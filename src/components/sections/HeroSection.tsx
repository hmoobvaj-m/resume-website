import Link from "next/link";
import { siteConfig } from "@/content/site"

export default function Hero() {
    return (
        <section className="py-20 md:py-28">
            <div className="mx-auto max-w-5xl px-6">
                <div className="max-w-3xl text-center">
                    <h2 className="text-4xl font-bold tracking-tight md:text-6xl text-neutral-300">{siteConfig.name}</h2>

                    <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-neutral-300">{siteConfig.title}</h3>

                    <p className="m-6 text-lg leading-8 text-neutral-300 md:text-xl">{siteConfig.summary}</p>

                    <div className="mt-8 flex flex-col gap-3 items-center sm:flex-row sm:justify-center">
                        <Link href="/#projects" className="rounded-lg border border-neutral-300 px-5 py-3 transition hover:opacity-90">View Projects</Link>
                        <Link href="/#resume" className="rounded-lg border border-neutral-300 px-5 py-3 transition hover:opacity-90">View Experience</Link>
                        <Link href="/#contact" className="rounded-lg border border-neutral-300 px-5 py-3 transition hover:opacity-90">Contact Me</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}