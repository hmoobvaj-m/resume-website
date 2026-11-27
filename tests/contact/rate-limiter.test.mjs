import assert from "node:assert/strict";
import { test } from "node:test";
import { createRateLimiter, evaluateWindow, LIMITS, WINDOW_MS } from "../../workers/contact/rate-limiter.js";
import worker from "../../workers/contact/worker.js";

const NOW = 1_000_000;
const ORIGIN = "https://matthew.hmoobvaj.us";
const CLIENT_IP = "192.0.2.10";

test("admits the first request in an empty window", () => {
    const result = evaluateWindow([], LIMITS.ip, NOW);

    assert.deepEqual(result, {
        success: true,
        retryAfter: 0,
        timestamps: [NOW],
    });
});

for (const [scope, limit] of Object.entries(LIMITS)) {
    test(`enforces the ${scope} capacity`, () => {
        let timestamps = [];

        for (let i = 0; i < limit; i++) {
            const result = evaluateWindow(timestamps, limit, NOW);

            assert.equal(result.success, true);

            timestamps = result.timestamps;
        }

        const rejected = evaluateWindow(timestamps, limit, NOW);

        assert.equal(rejected.success, false);
        assert.equal(rejected.retryAfter, 60);
        assert.equal(rejected.timestamps.length, limit);
    });
}

test("removes timestamps at the expiration boundary", () => {
    const result = evaluateWindow([NOW - WINDOW_MS], LIMITS.ip, NOW);

    assert.equal(result.success, true);
    assert.deepEqual(result.timestamps, [NOW]);
});

test("retains timestamps within the active window", () => {
    const timestamp = NOW - WINDOW_MS + 1;
    const result = evaluateWindow([timestamp], LIMITS.ip, NOW);

    assert.deepEqual(result.timestamps, [timestamp, NOW]);
});

test("calculates the remaining retry duration", () => {
    const timestamps = Array(LIMITS.ip).fill(NOW - 45_000);
    const result = evaluateWindow(timestamps, LIMITS.ip, NOW);

    assert.equal(result.success, false);
    assert.equal(result.retryAfter, 15);
});

test("rounds fractional retry durations upward", () => {
    const timestamps = Array(LIMITS.ip).fill(NOW - WINDOW_MS + 1);
    const result = evaluateWindow(timestamps, LIMITS.ip, NOW);

    assert.equal(result.success, false);
    assert.equal(result.retryAfter, 1);
});

test("does not extend the window for denied requests", () => {
    const timestamps = Array(LIMITS.ip).fill(NOW - 30_000);
    const result = evaluateWindow(timestamps, LIMITS.ip, NOW);

    assert.equal(result.success, false);
    assert.deepEqual(result.timestamps, timestamps);
});

test("admits another request when the oldest timestamp expires", () => {
    const timestamps = [
        NOW - WINDOW_MS,
        NOW - 40_000,
        NOW - 30_000,
        NOW - 20_000,
        NOW - 10_000,
    ];

    const result = evaluateWindow(timestamps, LIMITS.ip, NOW);

    assert.equal(result.success, true);
    assert.equal(result.timestamps.length, LIMITS.ip);
    assert.equal(result.timestamps.at(-1), NOW);
});

test("does not modify the original timestamp collection", () => {
    const timestamps = [NOW - 1000];

    evaluateWindow(timestamps, LIMITS.ip, NOW);

    assert.deepEqual(timestamps, [NOW - 1000]);
});

function createNamespace(decision = { success: true, retryAfter: 0 }) {
    const names = [];

    const namespace = {
        getByName(name) {
            names.push(name);

            return {
                async fetch() {
                    return Response.json(decision);
                },
            };
        },
    };

    return { namespace, names };
}

test("uses a stable object identity for the same IP", async () => {
    const { namespace, names } = createNamespace();
    const limiter = createRateLimiter(namespace, "ip");

    await limiter.limit({ key: CLIENT_IP });
    await limiter.limit({ key: CLIENT_IP });

    assert.equal(names[0], names[1]);
    assert.match(names[0], /^ip:[a-f0-9]{64}$/);
    assert.ok(!names[0].includes(CLIENT_IP));
});

test("isolates different IP addresses", async () => {
    const { namespace, names } = createNamespace();
    const limiter = createRateLimiter(namespace, "ip");

    await limiter.limit({ key: CLIENT_IP });
    await limiter.limit({ key: "192.0.2.11" });

    assert.notEqual(names[0], names[1]);
});

test("uses one global object for all sending requests", async () => {
    const { namespace, names } = createNamespace();
    const limiter = createRateLimiter(namespace, "send");

    await limiter.limit({ key: "first-request" });
    await limiter.limit({ key: "second-request" });

    assert.deepEqual(names, ["send:global", "send:global"]);
});

test("rejects unsupported rate-limiter scopes", () => {
    const { namespace } = createNamespace();

    assert.throws(() => createRateLimiter(namespace, "invalid"));
});

test("rejects missing rate-limiter keys", async () => {
    const { namespace } = createNamespace();
    const limiter = createRateLimiter(namespace, "ip");

    await assert.rejects(limiter.limit({ key: null }));
});

for (const decision of [
    null,
    {},
    { success: "true", retryAfter: 0 },
    { success: true, retryAfter: 30 },
    { success: false, retryAfter: 0 },
    { success: false, retryAfter: 61 },
    { success: false, retryAfter: 1.5 },
]) {
    test(`rejects invalid limiter decision ${JSON.stringify(decision)}`, async () => {
        const { namespace } = createNamespace(decision);
        const limiter = createRateLimiter(namespace, "ip");

        await assert.rejects(limiter.limit({ key: CLIENT_IP }));
    });
}

function createRequest() {
    return new Request(`${ORIGIN}/api/contact`, {
        method: "POST",
        headers: {
            Origin: ORIGIN,
            "Content-Type": "application/json",
            "CF-Connecting-IP": CLIENT_IP,
        },
        body: JSON.stringify({
            name: "Security Test",
            email: "test@example.com",
            message: "Testing Durable Object rate limiting.",
            website: "",
            token: "mock-token",
        }),
    });
}

function createEnvironment(namespace) {
    return {
        ALLOWED_ORIGINS: [ORIGIN],
        TURNSTILE_SECRET_KEY: "mock-secret",
        RESEND_API_KEY: "mock-key",
        CONTACT_FROM: "sender@example.com",
        CONTACT_TO: "recipient@example.com",
        CONTACT_RATE_LIMITER: namespace,
    };
}

test("propagates the calculated Retry-After header", async (t) => {
    const { namespace } = createNamespace({
        success: false,
        retryAfter: 17,
    });

    const outbound = t.mock.method(globalThis, "fetch", async () => {
        throw new Error("Unexpected provider request");
    });

    const response = await worker.fetch(createRequest(), createEnvironment(namespace));

    assert.equal(response.status, 429);
    assert.equal(response.headers.get("Retry-After"), "17");
    assert.equal(outbound.mock.callCount(), 0);
});

test("fails closed when the Durable Object is unavailable", async (t) => {
    const namespace = {
        getByName() {
            throw new Error("Storage unavailable");
        },
    };

    t.mock.method(console, "error", () => { });

    const outbound = t.mock.method(globalThis, "fetch", async () => {
        throw new Error("Unexpected provider request");
    });

    const response = await worker.fetch(createRequest(), createEnvironment(namespace));

    assert.equal(response.status, 503);
    assert.equal(outbound.mock.callCount(), 0);
});

test("fails closed when the rate limiter returns an invalid decision", async (t) => {
    const { namespace } = createNamespace({ success: "true" });

    t.mock.method(console, "error", () => { });

    const outbound = t.mock.method(globalThis, "fetch", async () => {
        throw new Error("Unexpected provider request");
    });

    const response = await worker.fetch(createRequest(), createEnvironment(namespace));

    assert.equal(response.status, 503);
    assert.equal(outbound.mock.callCount(), 0);
});

test("rejects email delivery when the global allowance is exhausted", async (t) => {
    const namespace = {
        getByName(name) {
            return {
                async fetch() {
                    return Response.json(name === "send:global"
                        ? { success: false, retryAfter: 23 }
                        : { success: true, retryAfter: 0 });
                },
            };
        },
    };

    const outbound = t.mock.method(globalThis, "fetch", async url => {
        assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");

        return Response.json({
            success: true,
            hostname: new URL(ORIGIN).hostname,
            action: "contact",
        });
    });

    const response = await worker.fetch(createRequest(), createEnvironment(namespace));

    assert.equal(response.status, 429);
    assert.equal(response.headers.get("Retry-After"), "23");
    assert.equal(outbound.mock.callCount(), 1);
});
