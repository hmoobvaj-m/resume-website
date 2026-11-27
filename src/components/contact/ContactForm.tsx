"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { siteConfig } from "@/content/site";

type TurnstileApi = {
    render: (container: HTMLElement, options: Record<string, unknown>) => string;
    reset: (widgetId: string) => void;
    remove: (widgetId: string) => void;
};

type FormStatus = {
    type: "success" | "error";
    message: string;
};

function getTurnstile() {
    return (window as Window & { turnstile?: TurnstileApi }).turnstile;
}

export default function ContactForm() {
    const widgetContainer = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const pendingRef = useRef(false);

    const [scriptReady, setScriptReady] = useState(false);
    const [token, setToken] = useState("");
    const [pending, setPending] = useState(false);
    const [status, setStatus] = useState<FormStatus | null>(null);

    const siteKey = siteConfig.contact.turnstileSiteKey;
    const configured = Boolean(siteKey) && !siteKey.startsWith("REPLACE_");

    useEffect(() => {
        if (!configured || !scriptReady || !widgetContainer.current) return;

        const turnstile = getTurnstile();

        if (!turnstile) return;

        const id = turnstile.render(widgetContainer.current, {
            sitekey: siteKey,
            theme: "dark",
            action: "contact",
            callback: (value: string) => setToken(value),
            "expired-callback": () => setToken(""),
            "error-callback": () => {
                setToken("");
                setStatus({
                    type: "error",
                    message: "Security verification failed. Please retry or use LinkedIn.",
                });
            },
        });

        widgetId.current = id;

        return () => {
            turnstile.remove(id);
            widgetId.current = null;
        };
    }, [configured, scriptReady, siteKey]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!token || pendingRef.current) return;

        const form = event.currentTarget;
        const data = new FormData(form);

        pendingRef.current = true;
        setPending(true);
        setStatus(null);

        try {
            const response = await fetch(siteConfig.contact.endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "omit",
                cache: "no-store",
                signal: AbortSignal.timeout(20000),
                body: JSON.stringify({
                    name: data.get("name"),
                    email: data.get("email"),
                    message: data.get("message"),
                    website: data.get("website"),
                    token,
                }),
            });

            if (response.status === 429) {
                setStatus({
                    type: "error",
                    message: "Too many requests. Please wait a minute before trying again.",
                });

                return;
            }

            const result = await response.json();

            if (!response.ok || result.ok !== true) {
                setStatus({
                    type: "error",
                    message: "Your message could not be submitted. Please retry or use LinkedIn.",
                });

                return;
            }

            form.reset();

            setStatus({
                type: "success",
                message: "Your message has been submitted successfully.",
            });
        } catch {
            setStatus({
                type: "error",
                message: "Submission could not be confirmed. Please try again later or use LinkedIn.",
            });
        } finally {
            setToken("");
            setPending(false);
            pendingRef.current = false;

            if (widgetId.current) getTurnstile()?.reset(widgetId.current);
        }
    }

    return (
        <>
            {configured && (
                <Script
                    id="cloudflare-turnstile"
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                    strategy="afterInteractive"
                    onReady={() => setScriptReady(true)}
                    onError={() => setStatus({
                        type: "error",
                        message: "Security verification is unavailable. Please use LinkedIn.",
                    })}
                />
            )}

            <p className="mb-6 text-sm leading-6 text-neutral-400">
                Have a question, career opportunity, or project in mind?
                Send a message using the form below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" aria-busy={pending}>
                <label className="block space-y-2">
                    <span className="text-sm font-medium">Name</span>

                    <input
                        name="name"
                        autoComplete="name"
                        placeholder="Your name"
                        required
                        maxLength={100}
                        className="form-input"
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium">Email address</span>

                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                        maxLength={254}
                        className="form-input"
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium">Message</span>

                    <textarea
                        name="message"
                        placeholder="How can I help?"
                        required
                        minLength={10}
                        maxLength={3000}
                        rows={5}
                        className="form-input resize-y"
                    />
                </label>

                <div className="hidden" aria-hidden="true">
                    <input name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {configured ? (
                    <div ref={widgetContainer} className="min-h-16" />
                ) : (
                    <p className="text-sm text-neutral-400">
                        The contact form is currently unavailable.
                    </p>
                )}

                <p className="text-xs leading-5 text-neutral-400">
                    Your contact information is used to process and respond to
                    your inquiry. Please do not include confidential information.
                    This form uses Cloudflare for abuse prevention and an email
                    delivery provider to forward your message.
                </p>

                {status && (
                    <p
                        role={status.type === "error" ? "alert" : "status"}
                        className={`rounded-lg border p-3 text-sm ${status.type === "success"
                                ? "border-emerald-800 bg-emerald-950 text-emerald-200"
                                : "border-red-800 bg-red-950 text-red-200"
                            }`}
                    >
                        {status.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!configured || !token || pending}
                    className="button-primary w-full"
                >
                    {pending ? "Sending message..." : "Send message"}
                </button>
            </form>

            <div className="mt-6 border-t border-neutral-800 pt-5 text-center">
                <p className="mb-3 text-sm text-neutral-400">
                    Prefer to connect directly?
                </p>

                <a
                    href={siteConfig.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-secondary text-sm"
                >
                    Connect on LinkedIn
                </a>
            </div>
        </>
    );
}