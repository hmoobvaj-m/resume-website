import contactWorker from "./index.js";
import { createRateLimiter } from "./rate-limiter.js";

const publicContactWorker = {
    async fetch(request, env) {
        return contactWorker.fetch(request, {
            ALLOWED_ORIGINS: env.ALLOWED_ORIGINS,
            TURNSTILE_SECRET_KEY: env.TURNSTILE_SECRET_KEY,
            RESEND_API_KEY: env.RESEND_API_KEY,
            CONTACT_FROM: env.CONTACT_FROM,
            CONTACT_TO: env.CONTACT_TO,
            CONTACT_IP_LIMITER: createRateLimiter(env.CONTACT_RATE_LIMITER, "ip"),
            CONTACT_SEND_LIMITER: createRateLimiter(env.CONTACT_RATE_LIMITER, "send"),
        });
    },
};

export default publicContactWorker;
