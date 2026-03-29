import Link from "next/link"
import { siteConfig } from "@/content/site"

export default function ContactMe() {
    return (
        <section id="contact" className="py-5">
            <div className="mx-auto max-w-5xl px-6">
                <div className="rounded-3xl border border-neutral-200 p-8 md:p-10">
                    <h2 className="text-center text-2xl font-semibold md:text-3xl">
                        My Contacts
                    </h2>

                    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                        <Link href={`mailto:${siteConfig.email}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-black px-5 py-3 text-white">Email Me</Link>

                        <Link href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="rounded-lg border px-5 py-3">Github</Link>

                        <Link href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-lg border px-5 py-3">LinkedIn</Link>
                    </div>
                    <p className="mt-4 text-center text-sm text-neutral-300">Or email me directly at {siteConfig.email}</p>
                </div>
            </div>
        </section>
    )
}