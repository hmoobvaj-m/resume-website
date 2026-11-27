import { siteConfig } from "@/content/site";
import Modal from "@/components/ui/Modal";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactMe() {
    return (
        <section id="contact" className="scroll-mt-8 py-10 md:py-12">
            <div className="mx-auto max-w-5xl px-6">
                <div className="surface-card text-center md:p-10">
                    <h2 className="text-2xl font-semibold md:text-3xl">
                        Get in touch
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-400 md:text-base">
                        Interested in discussing career opportunities,
                        technical projects, or professional collaboration?
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <Modal
                            title="Contact me"
                            triggerLabel="Send a message"
                            triggerClassName="button-primary"
                        >
                            <ContactForm />
                        </Modal>

                        <a
                            href={siteConfig.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-secondary"
                        >
                            LinkedIn
                        </a>

                        <a
                            href={siteConfig.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-secondary"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}