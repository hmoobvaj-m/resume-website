import { DurableObject } from "cloudflare:workers";
import { evaluateWindow, LIMITS, WINDOW_MS } from "./rate-limiter.js";

const STORAGE_KEY = "timestamps";

export class ContactRateLimiter extends DurableObject {
    async fetch(request) {
        const scope = new URL(request.url).pathname.slice(1);

        if (request.method !== "POST" || (scope !== "ip" && scope !== "send")) {
            return new Response("Not found.", { status: 404 });
        }

        const storage = this.ctx.storage;

        const decision = await storage.transaction(async () => {
            const timestamps = await storage.get(STORAGE_KEY) ?? [];
            const now = Math.max(Date.now(), timestamps.at(-1) ?? 0);

            const result = evaluateWindow(timestamps, LIMITS[scope], now);

            if (result.success) {
                await Promise.all([
                    storage.put(STORAGE_KEY, result.timestamps),
                    storage.setAlarm(now + WINDOW_MS),
                ]);
            }

            return {
                success: result.success,
                retryAfter: result.retryAfter,
            };
        });

        return Response.json(decision, {
            headers: { "Cache-Control": "no-store" },
        });
    }

    async alarm() {
        const storage = this.ctx.storage;

        await storage.transaction(async () => {
            const timestamps = await storage.get(STORAGE_KEY) ?? [];
            const expiresAt = (timestamps.at(-1) ?? 0) + WINDOW_MS;

            if (expiresAt > Date.now()) {
                await storage.setAlarm(expiresAt);
                return;
            }

            await storage.delete(STORAGE_KEY);
        });
    }
}

const rateLimiterWorker = {
    fetch() {
        return new Response("Not found.", {
            status: 404,
            headers: { "Cache-Control": "no-store" },
        });
    },
};

export default rateLimiterWorker;
