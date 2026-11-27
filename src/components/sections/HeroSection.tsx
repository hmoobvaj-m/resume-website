import { siteConfig } from "@/content/site";
import { resumeData } from "@/content/resume";
import Icon from "@/components/ui/Icon";
import ResumeDialog from "@/components/resume/ResumeDialog";
import ContactDialog from "@/components/contact/ContactDialog";
import HeroIllustration from "@/components/sections/HeroIllustration";

export default function HeroSection() {
    return (
        <section id="about" className="hero-background border-b border-border py-14 md:py-24">
            <div className="site-shell">
                <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3.5 py-1.5 text-xs font-medium text-accent md:text-sm">
                            <Icon name="graduation-cap" className="size-4" />
                            {siteConfig.title}
                        </div>

                        <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                            {siteConfig.name}
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-8 text-muted md:text-lg">
                            {siteConfig.summary}
                        </p>

                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <ResumeDialog
                                triggerLabel="View Resume"
                                triggerClassName="button-primary"
                            />

                            <ContactDialog
                                triggerLabel="Contact Me"
                                triggerClassName="button-secondary"
                            />
                        </div>

                        <div className="mt-7 flex flex-wrap items-center gap-3">
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

                            <div className="ml-1 inline-flex items-center gap-2 text-sm text-muted">
                                <Icon name="map-pin" className="size-4" />
                                {resumeData.location}
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <HeroIllustration />
                    </div>
                </div>
            </div>
        </section>
    );
}