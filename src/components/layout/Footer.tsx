import { siteConfig } from "@/content/site";
import Icon from "@/components/ui/Icon";

const technologyLink =
    "font-medium text-accent underline-offset-4 transition-colors hover:text-foreground hover:underline";

export default function Footer() {
    return (
        <footer className="border-t border-border">
            <div className="site-shell py-8">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-accent">
                            <Icon name="terminal" />
                        </div>

                        <div>
                            <p className="font-semibold tracking-tight text-foreground">
                                {siteConfig.name}
                            </p>

                            <p className="mt-1 text-xs text-muted">
                                Personal portfolio &amp; resume
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="icon-button">
                            <Icon name="github" />
                        </a>

                        <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="icon-button">
                            <Icon name="linkedin" />
                        </a>
                    </div>
                </div>

                <div className="mt-6 flex flex-col justify-between gap-6 border-t border-border pt-6 text-xs leading-6 text-muted sm:flex-row sm:items-start">
                    <div className="space-y-2">
                        <p className="flex items-center gap-2">
                            <Icon name="code" className="size-4" />

                            <span>
                                Built with{" "}
                                <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className={technologyLink}>
                                    Next.js
                                </a>
                                {" "}&middot; Self-hosted
                            </span>
                        </p>

                        <p className="flex items-center gap-2">
                            <Icon name="server" className="size-4" />

                            <span>
                                Infrastructure uses{" "}
                                <a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer" className={technologyLink}>
                                    Cloudflare® services
                                </a>
                            </span>
                        </p>

                        <p className="flex items-center gap-2">
                            <Icon name="layers" className="size-4" />

                            <span>
                                <a href="https://workers.cloudflare.com" target="_blank" rel="noopener noreferrer" className={technologyLink}>
                                    Cloudflare Workers®
                                </a>
                                {" "}&middot;{" "}
                                <a href="https://www.cloudflare.com/products/turnstile/" target="_blank" rel="noopener noreferrer" className={technologyLink}>
                                    Cloudflare Turnstile
                                </a>
                            </span>
                        </p>

                        <p className="flex items-center gap-2">
                            <Icon name="mail" className="size-4" />

                            <span>
                                Email delivery via{" "}
                                <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className={technologyLink}>
                                    Resend
                                </a>
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-5">
                        <a href="/resume.pdf" download className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-foreground">
                            <Icon name="download" className="size-4" />
                            Resume PDF
                        </a>

                        <a href="#about" className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-foreground">
                            Back to Top
                            <Icon name="arrow-right" className="size-4 -rotate-90" />
                        </a>
                    </div>
                </div>

                <div className="mt-6 space-y-2 border-t border-border pt-5 text-xs leading-5 text-muted">
                    <p>
                        Vercel, the Vercel design, Next.js and related marks,
                        designs and logos are trademarks or registered trademarks
                        of Vercel, Inc. or its affiliates in the US and other
                        countries.
                    </p>

                    <p>
                        Cloudflare and Cloudflare Workers are trademarks or
                        registered trademarks of Cloudflare, Inc.
                    </p>

                    <p>
                        All other trademarks belong to their respective owners.
                        This portfolio is independently maintained and is not
                        sponsored or endorsed by the referenced companies.
                    </p>
                </div>
            </div>
        </footer>
    );
}