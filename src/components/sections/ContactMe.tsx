import { siteConfig } from "@/content/site";
import ContactDialog from "@/components/contact/ContactDialog";
import Icon from "@/components/ui/Icon";

export default function ContactMe() {
    return (
        <section id="contact" className="section-spacing">
            <div className="site-shell">
                <div className="surface-card text-center md:p-10">
                    <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl border border-border bg-surface-raised text-accent">
                        <Icon name="mail" className="size-6" />
                    </div>

                    <h2 className="section-title">Get in touch</h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted md:text-base">
                        Interested in discussing career opportunities,
                        technical projects, or professional collaboration?
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <ContactDialog
                            triggerLabel="Send a message"
                            triggerClassName="button-primary"
                        />

                        <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="button-secondary">
                            <Icon name="linkedin" className="size-4" />
                            LinkedIn
                        </a>

                        <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="button-secondary">
                            <Icon name="github" className="size-4" />
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}