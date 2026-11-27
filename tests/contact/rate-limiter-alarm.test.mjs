import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { LIMITS, WINDOW_MS } from "../../workers/contact/rate-limiter.js";

const WORKER_ROOT = fileURLToPath(
    new URL("../../workers/contact/", import.meta.url),
);

const WORKER_NAME = "portfolio-contact-rate-limiter-alarm-test";
const LIMITER_CLASS = "ContactRateLimiter";
const LIMITER_BINDING = "CONTACT_RATE_LIMITER";
const INTERNAL_URL = "https://rate-limiter.internal";

const TEST_ENTRYPOINT = `
    import worker, {
        ContactRateLimiter as ProductionContactRateLimiter,
    } from "./rate-limiter-worker.js";

    import { LIMITS, WINDOW_MS } from "./rate-limiter.js";

    export class ContactRateLimiter extends ProductionContactRateLimiter {
        async fetch(request) {
            const path = new URL(request.url).pathname;
            const storage = this.ctx.storage;

            if (request.method === "GET" && path === "/__test/state") {
                return Response.json(await this.readState());
            }

            if (request.method === "POST" && path === "/__test/seed-expired") {
                const now = Date.now();
                const timestamps = Array(LIMITS.ip).fill(now - WINDOW_MS - 1000);

                await storage.transaction(async () => {
                    await storage.put("timestamps", timestamps);
                    await storage.setAlarm(now + 100);
                });

                return Response.json({ timestamps });
            }

            if (request.method === "POST" && path === "/__test/early-alarm") {
                const scheduledAt = Date.now() + 100;

                await storage.setAlarm(scheduledAt);

                return Response.json({ scheduledAt });
            }

            return super.fetch(request);
        }

        async readState() {
            const storage = this.ctx.storage;

            const [timestamps, alarm] = await Promise.all([
                storage.get("timestamps"),
                storage.getAlarm(),
            ]);

            return {
                hasTimestamps: timestamps !== undefined,
                timestamps: timestamps ?? [],
                alarm,
            };
        }
    }

    export default worker;
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

function createRuntime() {
    const options = convertV4MiniflareOptions({
        cf: false,

        workers: [
            {
                name: WORKER_NAME,
                modulesRoot: WORKER_ROOT,
                compatibilityDate: "2026-11-26",

                modules: [
                    {
                        type: "ESModule",
                        path: join(WORKER_ROOT, "test-alarm-entrypoint.js"),
                        contents: TEST_ENTRYPOINT,
                    },
                    ...createModules(
                        "rate-limiter-worker.js",
                        "rate-limiter.js",
                    ),
                ],

                durableObjects: {
                    [LIMITER_BINDING]: {
                        className: LIMITER_CLASS,
                        useSQLite: true,
                    },
                },

                outboundService() {
                    throw new Error("External network requests are forbidden in tests");
                },
            },
        ],
    });

    const limiterWorker = options.workers.find(
        worker => worker.config.name === WORKER_NAME,
    );

    assert.ok(limiterWorker, "Alarm test Worker is missing");

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

async function createStub(runtime, name) {
    const namespace = await runtime.getDurableObjectNamespace(
        LIMITER_BINDING,
        WORKER_NAME,
    );

    return namespace.getByName(name);
}

async function requestJson(stub, path, method = "GET") {
    const response = await stub.fetch(`${INTERNAL_URL}${path}`, { method });
    const body = await response.text();

    assert.equal(response.status, 200, `${method} ${path}: ${body}`);

    return JSON.parse(body);
}

async function admit(stub) {
    return requestJson(stub, "/ip", "POST");
}

async function readState(stub) {
    return requestJson(stub, "/__test/state");
}

async function waitForState(stub, predicate, description) {
    const deadline = performance.now() + 10_000;
    let state;

    do {
        state = await readState(stub);

        if (predicate(state)) return state;

        await delay(50);
    } while (performance.now() < deadline);

    assert.fail(`${description}: ${JSON.stringify(state)}`);
}

test("schedules cleanup for admitted requests without extending it for denied requests", { timeout: 20_000 }, async (t) => {
    const runtime = createRuntime();

    t.after(() => runtime.dispose());

    const stub = await createStub(runtime, "alarm-scheduling");

    const initial = await readState(stub);

    assert.equal(initial.hasTimestamps, false);
    assert.equal(initial.alarm, null);

    for (let i = 0; i < LIMITS.ip; i++) {
        const result = await admit(stub);

        assert.equal(result.success, true);
        assert.equal(result.retryAfter, 0);

        const state = await readState(stub);

        assert.equal(state.hasTimestamps, true);
        assert.equal(state.timestamps.length, i + 1);
        assert.equal(state.alarm, state.timestamps.at(-1) + WINDOW_MS);
    }

    const beforeDenial = await readState(stub);
    const denied = await admit(stub);

    assert.equal(denied.success, false);
    assert.ok(denied.retryAfter >= 1 && denied.retryAfter <= 60);

    const afterDenial = await readState(stub);

    assert.deepEqual(afterDenial.timestamps, beforeDenial.timestamps);
    assert.equal(afterDenial.alarm, beforeDenial.alarm);
});

test("deletes expired timestamp records through a scheduled alarm and restores capacity", { timeout: 20_000 }, async (t) => {
    const runtime = createRuntime();

    t.after(() => runtime.dispose());

    const stub = await createStub(runtime, "expired-record-cleanup");

    const seeded = await requestJson(
        stub,
        "/__test/seed-expired",
        "POST",
    );

    assert.equal(seeded.timestamps.length, LIMITS.ip);

    const cleaned = await waitForState(
        stub,
        state => !state.hasTimestamps && state.alarm === null,
        "Scheduled alarm did not remove expired timestamp records",
    );

    assert.equal(cleaned.hasTimestamps, false);
    assert.deepEqual(cleaned.timestamps, []);
    assert.equal(cleaned.alarm, null);

    for (let i = 0; i < LIMITS.ip; i++) {
        const result = await admit(stub);

        assert.equal(result.success, true);
    }

    const denied = await admit(stub);

    assert.equal(denied.success, false);

    const restored = await readState(stub);

    assert.equal(restored.hasTimestamps, true);
    assert.equal(restored.timestamps.length, LIMITS.ip);
    assert.equal(restored.alarm, restored.timestamps.at(-1) + WINDOW_MS);
});

test("retains active timestamp records and reschedules cleanup after an early alarm", { timeout: 20_000 }, async (t) => {
    const runtime = createRuntime();

    t.after(() => runtime.dispose());

    const stub = await createStub(runtime, "premature-alarm");

    for (let i = 0; i < LIMITS.ip; i++) {
        const result = await admit(stub);

        assert.equal(result.success, true);
    }

    const beforeAlarm = await readState(stub);
    const expectedExpiration = beforeAlarm.timestamps.at(-1) + WINDOW_MS;

    assert.equal(beforeAlarm.alarm, expectedExpiration);

    const earlyAlarm = await requestJson(
        stub,
        "/__test/early-alarm",
        "POST",
    );

    assert.ok(earlyAlarm.scheduledAt < expectedExpiration);

    const rescheduled = await waitForState(
        stub,
        state => state.alarm === expectedExpiration,
        "Early alarm did not restore the correct cleanup schedule",
    );

    assert.equal(rescheduled.hasTimestamps, true);
    assert.deepEqual(rescheduled.timestamps, beforeAlarm.timestamps);
    assert.equal(rescheduled.alarm, expectedExpiration);

    const denied = await admit(stub);

    assert.equal(denied.success, false);
    assert.ok(denied.retryAfter >= 1 && denied.retryAfter <= 60);

    const finalState = await readState(stub);

    assert.deepEqual(finalState.timestamps, beforeAlarm.timestamps);
    assert.equal(finalState.alarm, expectedExpiration);
});