import { siteConfig } from "@/content/site";
import Icon from "@/components/ui/Icon";

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
                        <a
                            href={siteConfig.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub profile"
                            className="icon-button"
                        >
                            <Icon name="github" />
                        </a>

                        <a
                            href={siteConfig.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn profile"
                            className="icon-button"
                        >
                            <Icon name="linkedin" />
                        </a>
                    </div>
                </div>

                <div className="mt-6 flex flex-col justify-between gap-4 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center">
                    <p>Built with Next.js &middot; Self-hosted</p>

                    <div className="flex flex-wrap items-center gap-5">
                        <a
                            href="/resume.pdf"
                            download
                            className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-foreground"
                        >
                            <Icon name="download" className="size-4" />
                            Resume PDF
                        </a>

                        <a
                            href="#about"
                            className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-foreground"
                        >
                            Back to top
                            <Icon name="arrow-right" className="size-4 -rotate-90" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}