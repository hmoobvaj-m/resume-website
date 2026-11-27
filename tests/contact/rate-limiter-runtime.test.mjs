import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { createRateLimiter, LIMITS } from "../../workers/contact/rate-limiter.js";

const WORKER_ROOT = fileURLToPath(
    new URL("../../workers/contact/", import.meta.url),
);

const ORIGIN = "https://matthew.hmoobvaj.us";
const SECOND_ORIGIN = "https://portfolio.hmoobvaj.us";

const CONTACT_WORKER = "portfolio-contact";
const LIMITER_WORKER = "portfolio-contact-rate-limiter";
const LIMITER_CLASS = "ContactRateLimiter";

const TEST_ENTRYPOINT = `
    import worker from "./worker.js";

    export default {
        async fetch(request, env) {
            const { origin, ip } = await request.json();

            const contactRequest = new Request(origin + "/api/contact", {
                method: "POST",
                headers: {
                    Origin: origin,
                    "Content-Type": "application/json",
                    "CF-Connecting-IP": ip,
                },
                body: "{}",
            });

            return worker.fetch(contactRequest, env);
        },
    };
`;

function createModules(...filenames) {
    return filenames.map(filename => {
        const path = join(WORKER_ROOT, filename);

        return {
            type: "ESModule",
            path,
            contents: readFileSync(path, "utf8"),
        };
    });
}

function createRuntime(persist) {
    const common = {
        modulesRoot: WORKER_ROOT,
        compatibilityDate: "2026-11-26",

        outboundService() {
            throw new Error("External network requests are forbidden in tests");
        },
    };

    const options = convertV4MiniflareOptions({
        cf: false,
        resourcePersistencePath: persist,

        workers: [
            {
                ...common,
                name: CONTACT_WORKER,

                modules: [
                    {
                        type: "ESModule",
                        path: join(WORKER_ROOT, "test-entrypoint.js"),
                        contents: TEST_ENTRYPOINT,
                    },
                    ...createModules(
                        "worker.js",
                        "index.js",
                        "rate-limiter.js",
                    ),
                ],

                bindings: {
                    ALLOWED_ORIGINS: [ORIGIN, SECOND_ORIGIN],
                    TURNSTILE_SECRET_KEY: "mock-secret",
                    RESEND_API_KEY: "mock-key",
                    CONTACT_FROM: "sender@example.com",
                    CONTACT_TO: "recipient@example.com",
                },

                durableObjects: {
                    CONTACT_RATE_LIMITER: {
                        className: LIMITER_CLASS,
                        scriptName: LIMITER_WORKER,
                        useSQLite: true,
                    },
                },
            },
            {
                ...common,
                name: LIMITER_WORKER,

                modules: createModules(
                    "rate-limiter-worker.js",
                    "rate-limiter.js",
                ),
            },
        ],
    });

    const limiterWorker = options.workers.find(
        worker => worker.config.name === LIMITER_WORKER,
    );

    assert.ok(limiterWorker, "Private rate-limiter Worker is missing");

    limiterWorker.config.exports = {
        ...limiterWorker.config.exports,
        [LIMITER_CLASS]: {
            type: "durable-object",
            storage: "sqlite",
        },
    };

    return new Miniflare({
        ...options,
        enableDevRegistry: false,
    });
}

async function getNamespace(runtime) {
    return runtime.getDurableObjectNamespace("CONTACT_RATE_LIMITER", CONTACT_WORKER);
}

function assertDecisions(results, expectedAccepted) {
    const accepted = results.filter(result => result.success);
    const rejected = results.filter(result => !result.success);

    assert.equal(accepted.length, expectedAccepted);
    assert.equal(rejected.length, results.length - expectedAccepted);

    for (const result of rejected) {
        assert.ok(Number.isInteger(result.retryAfter));
        assert.ok(result.retryAfter >= 1 && result.retryAfter <= 60);
    }
}

test("atomically enforces the per-IP limit under concurrent requests", async (t) => {
    const runtime = createRuntime();

    t.after(() => runtime.dispose());

    const namespace = await getNamespace(runtime);
    const limiter = createRateLimiter(namespace, "ip");

    const results = await Promise.all(
        Array.from({ length: 12 }, () =>
            limiter.limit({ key: "192.0.2.10" }),
        ),
    );

    assertDecisions(results, LIMITS.ip);
});

test("atomically enforces the shared sending allowance", async (t) => {
    const runtime = createRuntime();

    t.after(() => runtime.dispose());

    const namespace = await getNamespace(runtime);
    const limiter = createRateLimiter(namespace, "send");

    const results = await Promise.all(
        Array.from({ length: 20 }, (_, i) =>
            limiter.limit({ key: `request-${i}` }),
        ),
    );

    assertDecisions(results, LIMITS.send);
});

test("maintains separate allowances for different IP addresses", async (t) => {
    const runtime = createRuntime();

    t.after(() => runtime.dispose());

    const namespace = await getNamespace(runtime);
    const limiter = createRateLimiter(namespace, "ip");

    const first = await Promise.all(
        Array.from({ length: 8 }, () =>
            limiter.limit({ key: "192.0.2.20" }),
        ),
    );

    const second = await Promise.all(
        Array.from({ length: 8 }, () =>
            limiter.limit({ key: "192.0.2.21" }),
        ),
    );

    assertDecisions(first, LIMITS.ip);
    assertDecisions(second, LIMITS.ip);
});

test("preserves rate-limiting state across runtime restarts", { timeout: 45_000 }, async (t) => {
    const directory = await mkdtemp(join(tmpdir(), "contact-rate-limiter-"));

    let runtime;

    t.after(async () => {
        try {
            if (runtime) await runtime.dispose();
        } finally {
            await rm(directory, { recursive: true, force: true });
        }
    });

    runtime = createRuntime(directory);

    const firstNamespace = await getNamespace(runtime);
    const firstLimiter = createRateLimiter(firstNamespace, "ip");

    const results = await Promise.all(
        Array.from({ length: LIMITS.ip }, () =>
            firstLimiter.limit({ key: "192.0.2.30" }),
        ),
    );

    assertDecisions(results, LIMITS.ip);

    await runtime.dispose();

    runtime = undefined;
    runtime = createRuntime(directory);

    const secondNamespace = await getNamespace(runtime);
    const secondLimiter = createRateLimiter(secondNamespace, "ip");

    const result = await secondLimiter.limit({ key: "192.0.2.30" });

    assert.equal(result.success, false);
    assert.ok(result.retryAfter >= 1 && result.retryAfter <= 60);
});

test("shares the per-IP allowance across portfolio origins", async (t) => {
    const runtime = createRuntime();

    t.after(() => runtime.dispose());

    const worker = await runtime.getWorker(CONTACT_WORKER);

    function submit(origin, ip = "192.0.2.40") {
        return worker.fetch("https://test.invalid/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ origin, ip }),
        });
    }

    for (let i = 0; i < LIMITS.ip; i++) {
        const origin = i % 2 === 0 ? ORIGIN : SECOND_ORIGIN;
        const response = await submit(origin);
        const body = await response.json();

        assert.equal(
            response.status,
            400,
            `Request ${i + 1} from ${origin}: ${JSON.stringify(body)}`,
        );

        assert.deepEqual(body, {
            ok: false,
            message: "Invalid contact information.",
        });
    }

    const response = await submit(SECOND_ORIGIN);
    const body = await response.json();

    assert.equal(response.status, 429, JSON.stringify(body));
    assert.equal(response.headers.get("Cache-Control"), "no-store");

    const retryAfter = Number(response.headers.get("Retry-After"));

    assert.ok(Number.isInteger(retryAfter));
    assert.ok(retryAfter >= 1 && retryAfter <= 60);

    assert.deepEqual(body, {
        ok: false,
        message: "Too many requests.",
    });

    const independentResponse = await submit(ORIGIN, "192.0.2.41");

    assert.equal(independentResponse.status, 400);

    assert.deepEqual(await independentResponse.json(), {
        ok: false,
        message: "Invalid contact information.",
    });
});
