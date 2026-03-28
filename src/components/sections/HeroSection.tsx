import Link from "next/link";
import { siteConfig } from "@/content/site"

export default function Hero() {
    return (
        <section className="py-20 md:py-28">
            <div className="mx-auto max-w-5x1 px-6">
                <div className="max-w-3x1">
                    <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                        {siteConfig.title}
                    </p>

                    <h1 className="text-4x1 font-bold tracking-tight md:text-6x1">
                        {siteConfig.name}
                    </h1>

                    <p className="m-6 text-lg leading-8 text-neutral-600 md:text-xl">
                        {siteConfig.summary}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link href="/projects" className="rounded-lg border border-neutral-3oo px-5 py-3 transition hover:opacity-90">View Projects</Link>
                        <Link href="/projects" className="rounded-lg border border-neutral-3oo px-5 py-3 transition hover:opacity-90">View Resume</Link>
                        <Link href="/projects" className="rounded-lg border border-neutral-3oo px-5 py-3 transition hover:opacity-90">Contact Me</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}