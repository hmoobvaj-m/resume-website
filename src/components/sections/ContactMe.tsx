import Link from "next/link"
import { siteConfig } from "@/content/site"

export default function ContactMe() {
    return (
        <section id="contact" className="py-20">
            <div className="mx-auto max-w-5xl px-6">
                <div className="rounded-3xl border border-neutral-200 p-8 md:p-10">
                    <h2 className="text-2xl font-semibold md:text-3xl">
                        Let's build something useful
                    </h2>

                    <p className="mt-3 max-w-2xl text-neutral-600">
                        My interests are in backend development, machine learning applications, IoT Technologies, and Robotics.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <Link href={`mailto:${siteConfig.email}`} className="rounded-lg border bg-black px-5 py-3 text-white">Email Me</Link>

                        <Link href={siteConfig.github} className="rounded-lg border px-5 py-3">Github</Link>

                        <Link href={siteConfig.linkedin} className="rounded-lg border px-5 py-3">LinkedIn</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}