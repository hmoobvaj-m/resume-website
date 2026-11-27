export const WINDOW_MS = 60_000;

export const LIMITS = Object.freeze({
    ip: 5,
    send: 10,
});

export function evaluateWindow(timestamps, limit, now) {
    const active = timestamps.filter(timestamp => timestamp > now - WINDOW_MS);

    if (active.length >= limit) {
        const retryAfter = Math.max(
            1,
            Math.ceil((active[active.length - limit] + WINDOW_MS - now) / 1000),
        );

        return { success: false, retryAfter, timestamps: active };
    }

    return {
        success: true,
        retryAfter: 0,
        timestamps: [...active, now],
    };
}

async function hashKey(key) {
    const bytes = new TextEncoder().encode(key);
    const digest = await crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(digest))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

export function createRateLimiter(namespace, scope) {
    if (scope !== "ip" && scope !== "send") {
        throw new Error("Invalid rate-limiter scope");
    }

    return {
        async limit({ key }) {
            if (typeof key !== "string" || !key.trim()) {
                throw new Error("Invalid rate-limiter key");
            }

            const name = scope === "ip"
                ? `ip:${await hashKey(key)}`
                : "send:global";

            const stub = namespace.getByName(name);

            const response = await stub.fetch(`https://rate-limiter.internal/${scope}`, {
                method: "POST",
            });

            if (!response.ok) throw new Error("Rate limiter unavailable");

            const result = await response.json();

            if (result?.success === true && result.retryAfter === 0) {
                return { success: true, retryAfter: 0 };
            }

            if (result?.success === false
                && Number.isInteger(result.retryAfter)
                && result.retryAfter >= 1
                && result.retryAfter <= 60) {
                return { success: false, retryAfter: result.retryAfter };
            }

            throw new Error("Invalid rate-limiter response");
        },
    };
}
