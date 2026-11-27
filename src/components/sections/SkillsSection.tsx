import { resumeData } from "@/content/resume";

export default function SkillsSection() {
    return (
        <section id="skills" className="scroll-mt-8 py-10 md:py-12">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold md:text-3xl">
                        Technical Skills
                    </h2>

                    <p className="mt-2 text-neutral-400">
                        Technologies, frameworks, and technical competencies.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {resumeData.skills.map((group) => (
                        <article key={group.title} className="surface-card">
                            <h3 className="text-lg font-semibold text-neutral-100">
                                {group.title}
                            </h3>

                            <ul className="mt-4 flex flex-wrap gap-2">
                                {group.items.map((skill) => (
                                    <li key={skill} className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-300">
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}