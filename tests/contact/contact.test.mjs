import assert from "node:assert/strict";
import { test } from "node:test";
import contactWorker from "../../workers/contact/index.js";

const ORIGIN = "https://matthew.hmoobvaj.us";
const ENDPOINT = `${ORIGIN}/api/contact`;
const CLIENT_IP = "192.0.2.10";
const MAX_BODY_BYTES = 16 * 1024;

const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_API_URL = "https://api.resend.com/emails";

const ALLOWED_ORIGINS = [
    "https://matthew.hmoobvaj.us",
    "https://portfolio.hmoobvaj.us",
    "https://professional.hmoobvaj.us",
    "https://contact.hmoobvaj.us",
    "https://resume.hmoobvaj.us",
];

const VALID_BODY = {
    name: "Integration Test",
    email: "sender@example.com",
    message: "Testing the portfolio contact API.",
    website: "",
    token: "mock-turnstile-token",
};

function createRequest({
    url = ENDPOINT,
    method = "POST",
    origin = ORIGIN,
    contentType = "application/json",
    body = JSON.stringify(VALID_BODY),
    contentLength,
} = {}) {
    const headers = new Headers({
        "CF-Connecting-IP": CLIENT_IP,
    });

    if (origin !== null) headers.set("Origin", origin);
    if (contentType !== null) headers.set("Content-Type", contentType);
    if (contentLength !== undefined) headers.set("Content-Length", String(contentLength));

    return new Request(url, {
        method,
        headers,
        body: method === "GET" || method === "HEAD" ? undefined : body,
    });
}

function createEnvironment(t, options = {}) {
    const calls = {
        ipLimiter: [],
        sendLimiter: [],
        turnstile: [],
        resend: [],
    };

    const verification = {
        success: true,
        hostname: new URL(ORIGIN).hostname,
        action: "contact",
        ...options.verification,
    };

    const env = {
        ALLOWED_ORIGINS,
        TURNSTILE_SECRET_KEY: "mock-turnstile-secret",
        RESEND_API_KEY: "mock-resend-key",
        CONTACT_FROM: "Portfolio <portfolio@example.com>",
        CONTACT_TO: "recipient@example.com",

        CONTACT_IP_LIMITER: {
            async limit(input) {
                calls.ipLimiter.push(input);
                return { success: options.ipAllowed ?? true };
            },
        },

        CONTACT_SEND_LIMITER: {
            async limit(input) {
                calls.sendLimiter.push(input);
                return { success: options.sendAllowed ?? true };
            },
        },

        ...options.env,
    };

    t.mock.method(console, "error", () => { });

    t.mock.method(globalThis, "fetch", async (url, init) => {
        if (url === TURNSTILE_URL) {
            calls.turnstile.push(init);

            if (options.turnstileError) throw new Error("Mock verification failure");

            return Response.json(verification, {
                status: options.turnstileStatus ?? 200,
            });
        }

        if (url === EMAIL_API_URL) {
            calls.resend.push(init);

            if (options.resendError) throw new Error("Mock email delivery failure");

            return Response.json(
                { id: "mock-email-id" },
                { status: options.resendStatus ?? 200 },
            );
        }

        assert.fail(`Unexpected outbound request: ${url}`);
    });

    return { env, calls };
}

async function assertResponse(response, expectedStatus) {
    assert.equal(response.status, expectedStatus);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
    assert.match(response.headers.get("Content-Type") ?? "", /^application\/json\b/i);

    const body = await response.json();

    assert.equal(body.ok, expectedStatus === 200);

    if (expectedStatus !== 200) {
        assert.equal(typeof body.message, "string");
        assert.ok(body.message.length > 0);
    }

    return body;
}

function assertNoProvidersCalled(calls) {
    assert.equal(calls.turnstile.length, 0);
    assert.equal(calls.resend.length, 0);
    assert.equal(calls.sendLimiter.length, 0);
}

// Endpoint and request validation

const requestCases = [
    {
        name: "rejects an unauthorized destination hostname",
        request: { url: "https://example.com/api/contact" },
        status: 404,
    },
    {
        name: "rejects an incorrect endpoint path",
        request: { url: `${ENDPOINT}/unexpected` },
        status: 404,
    },
    {
        name: "rejects GET requests",
        request: { method: "GET" },
        status: 405,
    },
    {
        name: "rejects OPTIONS requests",
        request: { method: "OPTIONS" },
        status: 405,
    },
    {
        name: "rejects PUT requests",
        request: { method: "PUT" },
        status: 405,
    },
    {
        name: "rejects unsupported content types",
        request: { contentType: "text/plain" },
        status: 415,
    },
    {
        name: "rejects missing content types",
        request: { contentType: null },
        status: 415,
    },
    {
        name: "rejects missing Origin headers",
        request: { origin: null },
        status: 403,
    },
    {
        name: "rejects unauthorized Origin headers",
        request: { origin: "https://example.com" },
        status: 403,
    },
    {
        name: "rejects mismatched authorized origins",
        request: { origin: "https://portfolio.hmoobvaj.us" },
        status: 403,
    },
    {
        name: "rejects oversized declared content lengths",
        request: { contentLength: MAX_BODY_BYTES + 1 },
        status: 413,
    },
    {
        name: "rejects oversized bodies without a Content-Length header",
        request: {
            body: JSON.stringify({
                ...VALID_BODY,
                message: "a".repeat(MAX_BODY_BYTES),
            }),
        },
        status: 413,
    },
    {
        name: "rejects malformed JSON",
        request: { body: '{"name":' },
        status: 400,
    },
    {
        name: "rejects invalid UTF-8",
        request: { body: new Uint8Array([0xc3, 0x28]) },
        status: 400,
    },
    {
        name: "rejects empty request bodies",
        request: { body: null },
        status: 400,
    },
];

for (const scenario of requestCases) {
    test(scenario.name, async (t) => {
        const { env, calls } = createEnvironment(t);
        const request = createRequest(scenario.request);
        const response = await contactWorker.fetch(request, env);

        if (scenario.status === 405) {
            assert.equal(response.headers.get("Allow"), "POST");
        }

        await assertResponse(response, scenario.status);
        assertNoProvidersCalled(calls);
    });
}

// Contact field validation

const invalidBodyCases = [
    ["null JSON values", null],
    ["JSON arrays", []],
    ["non-object JSON values", "invalid"],
    ["empty objects", {}],
    ["missing names", { ...VALID_BODY, name: undefined }],
    ["empty names", { ...VALID_BODY, name: "   " }],
    ["non-string names", { ...VALID_BODY, name: 123 }],
    ["oversized names", { ...VALID_BODY, name: "a".repeat(101) }],
    ["name newline injection", { ...VALID_BODY, name: "Test\r\nInjected" }],
    ["missing email addresses", { ...VALID_BODY, email: undefined }],
    ["invalid email addresses", { ...VALID_BODY, email: "invalid-email" }],
    ["oversized email addresses", {
        ...VALID_BODY,
        email: `${"a".repeat(250)}@example.com`,
    }],
    ["email newline injection", {
        ...VALID_BODY,
        email: "test@example.com\r\nBcc:other@example.com",
    }],
    ["missing messages", { ...VALID_BODY, message: undefined }],
    ["short messages", { ...VALID_BODY, message: "short" }],
    ["oversized messages", { ...VALID_BODY, message: "a".repeat(3001) }],
    ["missing Turnstile tokens", { ...VALID_BODY, token: undefined }],
    ["empty Turnstile tokens", { ...VALID_BODY, token: "" }],
    ["oversized Turnstile tokens", { ...VALID_BODY, token: "a".repeat(2049) }],
    ["populated honeypot fields", { ...VALID_BODY, website: "https://example.com" }],
    ["missing honeypot fields", { ...VALID_BODY, website: undefined }],
];

for (const [name, body] of invalidBodyCases) {
    test(`rejects ${name}`, async (t) => {
        const { env, calls } = createEnvironment(t);

        const response = await contactWorker.fetch(
            createRequest({ body: JSON.stringify(body) }),
            env,
        );

        await assertResponse(response, 400);
        assertNoProvidersCalled(calls);
    });
}

// Configuration validation

for (const key of [
    "TURNSTILE_SECRET_KEY",
    "RESEND_API_KEY",
    "CONTACT_FROM",
    "CONTACT_TO",
]) {
    test(`rejects requests when ${key} is missing`, async (t) => {
        const { env, calls } = createEnvironment(t, {
            env: { [key]: undefined },
        });

        const response = await contactWorker.fetch(createRequest(), env);

        await assertResponse(response, 503);
        assertNoProvidersCalled(calls);
        assert.equal(calls.ipLimiter.length, 0);
    });
}

// Turnstile verification

const verificationCases = [
    ["invalid tokens", { success: false }],
    ["expired or reused tokens", {
        success: false,
        "error-codes": ["timeout-or-duplicate"],
    }],
    ["mismatched verification hostnames", { hostname: "example.com" }],
    ["mismatched verification actions", { action: "login" }],
];

for (const [name, verification] of verificationCases) {
    test(`rejects ${name}`, async (t) => {
        const { env, calls } = createEnvironment(t, { verification });

        const response = await contactWorker.fetch(createRequest(), env);

        await assertResponse(response, 403);
        assert.equal(calls.turnstile.length, 1);
        assert.equal(calls.sendLimiter.length, 0);
        assert.equal(calls.resend.length, 0);
    });
}

test("fails securely when the verification provider is unavailable", async (t) => {
    const { env, calls } = createEnvironment(t, {
        turnstileStatus: 503,
    });

    const response = await contactWorker.fetch(createRequest(), env);

    await assertResponse(response, 503);
    assert.equal(calls.turnstile.length, 1);
    assert.equal(calls.resend.length, 0);
});

test("fails securely when the verification request throws", async (t) => {
    const { env, calls } = createEnvironment(t, {
        turnstileError: true,
    });

    const response = await contactWorker.fetch(createRequest(), env);

    await assertResponse(response, 503);
    assert.equal(calls.resend.length, 0);
});

// Rate limiting

test("enforces the per-IP rate limiter before provider requests", async (t) => {
    const { env, calls } = createEnvironment(t, {
        ipAllowed: false,
    });

    const response = await contactWorker.fetch(createRequest(), env);

    assert.equal(response.headers.get("Retry-After"), "60");

    await assertResponse(response, 429);
    assert.deepEqual(calls.ipLimiter, [{ key: CLIENT_IP }]);
    assertNoProvidersCalled(calls);
});

test("enforces the sending rate limiter before email delivery", async (t) => {
    const { env, calls } = createEnvironment(t, {
        sendAllowed: false,
    });

    const response = await contactWorker.fetch(createRequest(), env);

    assert.equal(response.headers.get("Retry-After"), "60");

    await assertResponse(response, 429);
    assert.equal(calls.turnstile.length, 1);
    assert.deepEqual(calls.sendLimiter, [{ key: "portfolio-contact" }]);
    assert.equal(calls.resend.length, 0);
});

// Email provider failure handling

test("handles rejected email delivery without exposing provider errors", async (t) => {
    const { env, calls } = createEnvironment(t, {
        resendStatus: 500,
    });

    const response = await contactWorker.fetch(createRequest(), env);
    const body = await assertResponse(response, 503);

    assert.equal(body.message, "Message submission failed.");
    assert.equal(calls.resend.length, 1);
});

test("handles email provider connection failures", async (t) => {
    const { env, calls } = createEnvironment(t, {
        resendError: true,
    });

    const response = await contactWorker.fetch(createRequest(), env);

    await assertResponse(response, 503);
    assert.equal(calls.resend.length, 1);
});

// Successful submission and outbound request validation

test("accepts a valid submission and constructs a controlled email request", async (t) => {
    const { env, calls } = createEnvironment(t);

    const response = await contactWorker.fetch(createRequest(), env);
    const body = await assertResponse(response, 200);

    assert.deepEqual(body, { ok: true });
    assert.deepEqual(calls.ipLimiter, [{ key: CLIENT_IP }]);
    assert.deepEqual(calls.sendLimiter, [{ key: "portfolio-contact" }]);
    assert.equal(calls.turnstile.length, 1);
    assert.equal(calls.resend.length, 1);

    const verification = calls.turnstile[0];

    assert.equal(verification.method, "POST");
    assert.equal(verification.body.get("secret"), env.TURNSTILE_SECRET_KEY);
    assert.equal(verification.body.get("response"), VALID_BODY.token);
    assert.equal(verification.body.get("remoteip"), CLIENT_IP);
    assert.ok(verification.signal instanceof AbortSignal);

    const delivery = calls.resend[0];
    const email = JSON.parse(delivery.body);

    assert.equal(delivery.method, "POST");
    assert.equal(delivery.headers.Authorization, `Bearer ${env.RESEND_API_KEY}`);
    assert.ok(delivery.signal instanceof AbortSignal);

    assert.deepEqual(email, {
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        reply_to: VALID_BODY.email,
        subject: "New portfolio contact inquiry",
        text: [
            `Name: ${VALID_BODY.name}`,
            `Submitted email (unverified): ${VALID_BODY.email}`,
            "",
            VALID_BODY.message,
        ].join("\n"),
    });

    assert.equal(email.html, undefined);
});

test("accepts JSON content types with charset parameters", async (t) => {
    const { env } = createEnvironment(t);

    const response = await contactWorker.fetch(
        createRequest({ contentType: "application/json; charset=utf-8" }),
        env,
    );

    await assertResponse(response, 200);
});

test("prevents submitted fields from overriding email configuration", async (t) => {
    const { env, calls } = createEnvironment(t);

    const response = await contactWorker.fetch(
        createRequest({
            body: JSON.stringify({
                ...VALID_BODY,
                from: "attacker@example.com",
                to: ["attacker@example.com"],
                subject: "Untrusted subject",
                reply_to: "attacker@example.com",
                html: "<script>alert(1)</script>",
            }),
        }),
        env,
    );

    await assertResponse(response, 200);

    const email = JSON.parse(calls.resend[0].body);

    assert.equal(email.from, env.CONTACT_FROM);
    assert.deepEqual(email.to, [env.CONTACT_TO]);
    assert.equal(email.reply_to, VALID_BODY.email);
    assert.equal(email.subject, "New portfolio contact inquiry");
    assert.equal(email.html, undefined);
});

// Multi-domain validation

for (const origin of ALLOWED_ORIGINS) {
    test(`accepts valid submissions from ${origin}`, async (t) => {
        const { env, calls } = createEnvironment(t, {
            verification: {
                hostname: new URL(origin).hostname,
            },
        });

        const response = await contactWorker.fetch(
            createRequest({
                url: `${origin}/api/contact`,
                origin,
            }),
            env,
        );

        await assertResponse(response, 200);
        assert.equal(calls.resend.length, 1);
    });
}
