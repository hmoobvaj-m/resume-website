import Link from "next/link";
import { siteConfig } from "@/content/site";
import ResumeDialog from "@/components/resume/ResumeDialog";

export default function Hero() {
    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="mb-5 inline-flex rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-300">
                        {siteConfig.title}
                    </p>

                    <h1 className="text-5xl font-bold tracking-tight text-neutral-100 md:text-7xl">
                        {siteConfig.name}
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-neutral-400 md:text-lg">
                        {siteConfig.summary}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <ResumeDialog triggerLabel="View resume" triggerClassName="button-primary" />

                        <Link href="/#projects" className="button-secondary">
                            View projects
                        </Link>

                        <Link href="/#contact" className="button-secondary">
                            Contact me
                        </Link>
                    </div>

                    <div className="mt-6 flex justify-center gap-6 text-sm text-neutral-400">
                        <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                            GitHub
                        </a>

                        <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}