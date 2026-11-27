import { resumeData } from "@/content/resume";

export default function ResumeContent() {
    const skillGroups = [
        { title: "Programming", items: resumeData.skills.programming },
        { title: "AI/ML", items: resumeData.skills.aiMl },
        { title: "Robotics", items: resumeData.skills.robotics },
        { title: "Infrastructure", items: resumeData.skills.infrastructure },
    ];

    return (
        <article>
            <header className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                    {resumeData.name}
                </h2>

                <p className="mt-2 text-lg text-neutral-400">{resumeData.title}</p>
            </header>

            <section className="border-t border-neutral-800 py-6">
                <h3 className="text-xl font-semibold text-white">Summary</h3>
                <p className="mt-4 leading-7 text-neutral-300">{resumeData.summary}</p>
            </section>

            <section className="border-t border-neutral-800 py-6">
                <h3 className="text-xl font-semibold text-white">Education</h3>

                <div className="mt-4 space-y-4">
                    {resumeData.education.map((item) => (
                        <div key={`${item.degree}-${item.school}`} className="flex flex-col gap-2 md:flex-row md:justify-between">
                            <div>
                                <h4 className="font-semibold text-neutral-100">{item.degree}</h4>
                                <p className="text-neutral-300">{item.school}</p>
                            </div>

                            <p className="text-sm text-neutral-400">{item.period}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-t border-neutral-800 py-6">
                <h3 className="text-xl font-semibold text-white">Work Experience</h3>

                <div className="mt-4 space-y-6">
                    {resumeData.experience.map((item) => (
                        <article key={`${item.organization}-${item.role}`}>
                            <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                                <div>
                                    <h4 className="font-semibold text-neutral-100">{item.role}</h4>
                                    <p className="text-neutral-300">{item.organization}</p>
                                </div>

                                <p className="text-sm text-neutral-400">{item.period}</p>
                            </div>

                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
                                {item.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            <section className="border-t border-neutral-800 py-6">
                <h3 className="text-xl font-semibold text-white">Personal Projects</h3>

                <div className="mt-4 space-y-6">
                    {resumeData.personalProjects.map((project) => (
                        <article key={project.title}>
                            <h4 className="font-semibold text-neutral-100">{project.title}</h4>

                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
                                {project.bullets?.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                ))}
                            </ul>

                            {project.subBullets && (
                                <ul className="mt-2 list-[circle] space-y-2 pl-10 text-sm leading-6 text-neutral-300">
                                    {project.subBullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            )}
                        </article>
                    ))}
                </div>
            </section>

            <section className="border-t border-neutral-800 py-6">
                <h3 className="text-xl font-semibold text-white">Technical Skills</h3>

                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                    {skillGroups.map((group) => (
                        <div key={group.title}>
                            <h4 className="font-semibold text-neutral-100">{group.title}</h4>

                            <ul className="mt-2 flex flex-wrap gap-2">
                                {group.items.map((skill) => (
                                    <li key={skill} className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-300">
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </article>
    );
}