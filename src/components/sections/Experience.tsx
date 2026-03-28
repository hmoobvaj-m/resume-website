import Link from "next/link"
import { experience } from "@/content/resume"

export default function ExperiencePreview() {
    return (
        <section id="resume" className="py-16">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold md:text-3xl">Experience</h2>
                    {/* <p className="mt-2 text-neutral-600"> Snapshot of my recent technical work.</p> */}
                </div>
                
                <Link href="/resume" className="underline">View full resume</Link>
            </div>

            <div className="mt-8 space-y-6">
                {experience.slice(0,2).map((item) => (
                    <article
                        key={`${item.organization}-${item.role}`}
                        className="rounded-2xl border border-neutral-200 p-6"
                    >
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">{item.organization}</h3>
                                {/* <p className="text-neutral-600">{item.organization}</p> */}
                            </div>
                            
                            <p className="text-lg font-semibold">{item.period}</p>
                        </div>

                        <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-700">
                            {item.bullets.map((bullet) => (
                                <li key={bullet}>{bullet}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    )
}