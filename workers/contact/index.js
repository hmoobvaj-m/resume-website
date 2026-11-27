const MAX_BODY_BYTES = 16 * 1024;
const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_API_URL = "https://api.resend.com/emails";

function json(status, body, headers = {}) {
    return Response.json(body, {
        status,
        headers: {
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            ...headers,
        },
    });
}

function reject(status, message, headers = {}) {
    return json(status, { ok: false, message }, headers);
}

function rateLimited() {
    return reject(429, "Too many requests.", { "Retry-After": "60" });
}

function cleanString(value) {
    return typeof value === "string" ? value.trim() : "";
}

async function readJson(request) {
    if (!request.body) throw new SyntaxError("Missing body");

    const reader = request.body.getReader();
    const decoder = new TextDecoder("utf-8", { fatal: true });

    let size = 0;
    let text = "";

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            size += value.byteLength;

            if (size > MAX_BODY_BYTES) {
                await reader.cancel();
                throw new RangeError("Request too large");
            }

            text += decoder.decode(value, { stream: true });
        }

        text += decoder.decode();

        return JSON.parse(text);
    } finally {
        reader.releaseLock();
    }
}

function validate(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) return null;

    const name = cleanString(body.name);
    const email = cleanString(body.email);
    const message = cleanString(body.message);
    const token = cleanString(body.token);

    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

    if (body.website !== "") return null;
    if (!name || name.length > 100 || /[\r\n]/.test(name)) return null;
    if (!email || email.length > 254 || !emailPattern.test(email)) return null;
    if (message.length < 10 || message.length > 3000) return null;
    if (!token || token.length > 2048) return null;

    return { name, email, message, token };
}

async function verifyTurnstile(data, ip, hostname, env) {
    const response = await fetch(TURNSTILE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: AbortSignal.timeout(8000),
        body: new URLSearchParams({
            secret: env.TURNSTILE_SECRET_KEY,
            response: data.token,
            remoteip: ip,
        }),
    });

    if (!response.ok) throw new Error("Verification provider unavailable");

    const result = await response.json();

    return result.success === true
        && result.hostname === hostname
        && result.action === "contact";
}

async function sendEmail(data, env) {
    const response = await fetch(EMAIL_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
            from: env.CONTACT_FROM,
            to: [env.CONTACT_TO],
            reply_to: data.email,
            subject: "New portfolio contact inquiry",
            text: [
                `Name: ${data.name}`,
                `Submitted email (unverified): ${data.email}`,
                "",
                data.message,
            ].join("\n"),
        }),
    });

    if (!response.ok) {
        console.error("Email provider rejected request", response.status);
        return false;
    }

    return true;
}

const contactWorker = {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (!env.ALLOWED_ORIGINS.includes(url.origin) || url.pathname !== "/api/contact") {
            return reject(404, "Not found.");
        }

        if (request.method !== "POST") {
            return reject(405, "Method not allowed.", { Allow: "POST" });
        }

        const contentType = request.headers.get("Content-Type")
            ?.split(";")[0].trim().toLowerCase();

        if (contentType !== "application/json") {
            return reject(415, "Unsupported content type.");
        }

        const contentLength = Number(request.headers.get("Content-Length") || 0);

        if (contentLength > MAX_BODY_BYTES) {
            return reject(413, "Request too large.");
        }

        const ip = request.headers.get("CF-Connecting-IP");

        if (request.headers.get("Origin") !== url.origin) {
            return reject(403, "Request rejected.");
        }

        if (!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY
            || !env.CONTACT_FROM || !env.CONTACT_TO) {
            return reject(503, "Service unavailable.");
        }

        try {
            const attempt = await env.CONTACT_IP_LIMITER.limit({ key: ip });

            if (!attempt.success) return rateLimited();

            let body;

            try {
                body = await readJson(request);
            } catch (error) {
                return reject(
                    error instanceof RangeError ? 413 : 400,
                    "Invalid request body.",
                );
            }

            const data = validate(body);

            if (!data) return reject(400, "Invalid contact information.");

            const verified = await verifyTurnstile(data, ip, url.hostname, env);

            if (!verified) return reject(403, "Security verification failed.");

            const capacity = await env.CONTACT_SEND_LIMITER.limit({
                key: "portfolio-contact",
            });

            if (!capacity.success) return rateLimited();

            const accepted = await sendEmail(data, env);

            if (!accepted) return reject(503, "Message submission failed.");

            return json(200, { ok: true });
        } catch {
            console.error("Contact request processing failed");
            return reject(503, "Service temporarily unavailable.");
        }
    },
};

export default contactWorker;