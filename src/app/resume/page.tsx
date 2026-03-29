    import Link from "next/link";
    import { resumeData } from "@/content/resume";

    export default function ResumePage() {
        return (
            <main className="mx-auto max-w-5xl px-6 py-16 md:py-24 text-neutral-100">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                    <Link href="/" className="rounded-lg border border-neutral-600 px-5 py-3 text-center text-neutral-100 transition hover:bg-neutral-800">Back to Home</Link>

                    <a href="/resume.pdf" download className="rounded-lg border border-neutral-600 px-5 py-3 text-center text-neutral-100 transition hover:bg-neutral-800">Download PDF</a>
                </div>
                
                <div className="mb-10 flex justify-center">
                    <div className="text-center">
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-300">Resume</p>

                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white md:text-5xl">{resumeData.name}</h1>

                        <p className="mt-2 text-lg text-neutral-200">{resumeData.title}</p>
                    </div>
                </div>

                <section className="border-t border-neutral-700 py-8">
                    <h2 className="text-2xl font-semibold text-white md:text-3xl">Summary</h2>
                    
                    <p className="mt-4 leading-8 text-neutral-200">{resumeData.summary}</p>
                </section>

                <section className="border-t border-neutral-700 py-8">
                    <h2 className="text-2xl font-semibold text-white md:text-3xl">Education</h2>
                    <div className="mt-6 rounded-2xl border border-neutral-700 p-6">
                        {resumeData.education.map((item) => (
                            <div key={`${item.degree}-${item.school}`}>
                                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{item.degree}</h3>

                                        <p className="text-neutral-200">{item.school}</p>
                                    </div>

                                    <p className="text-sm text-neutral-300">{item.period}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="border-t border-neutral-700 py-8">
                    <h2 className="text-2xl font-semibold text-white md:text-3xl">Work Experience</h2>

                    <div className="mt-6 space-y-6">
                        {resumeData.experience.map((item) => (
                            <article key={`${item.organization}-${item.role}`} className="rounded-2xl border border-neutral-700 p-6">

                                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{item.role}</h3>

                                        <p className="text-neutral-200">{item.organization}</p>
                                    </div>

                                    <p className="text-sm text-neutral-300">{item.period}</p>
                                </div>

                                <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-200">
                                    {item.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            </article>
                    ))}
                    </div>
                </section>

                <section className="border-t border-neutral-700 py-8">
                    <h2 className="text-2xl font-semibold text-white md:text-3xl">Personal Projects</h2>

                    <div className="mt-6 space-y-6">
                        {resumeData.personalProjects.map((project) => (
                            <article key={project.title} className="rounded-2xl border border-neutral-700 p-6">
                            <h3 className="text-lg font-semibold text-white">{project.title}</h3>

                            <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-200">
                                {project.bullets?.map((bullet) => (
                                <li key={bullet}>{bullet}</li>
                                ))}
                            </ul>

                            {"subBullets" in project && project.subBullets && (
                                <ul className="mt-3 list-[circle] space-y-2 pl-10 text-neutral-200">
                                {project.subBullets.map((subBullet) => (
                                    <li key={subBullet}>{subBullet}</li>
                                ))}
                                </ul>
                            )}
                            </article>
                        ))}
                    </div>
                </section>

                <section className="border-t border-neutral-700 py-8">
                    <h2 className="text-2xl font-semibold text-white md:text-3xl">Technical Skills</h2>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-neutral-700 p-6">
                            <h3 className="text-lg font-semibold text-white">Programming</h3>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-200">
                                {resumeData.skills.programming.map((skill) => (
                                <li key={skill}>{skill}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-neutral-700 p-6">
                            <h3 className="text-lg font-semibold text-white">AI/ML</h3>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-200">
                                {resumeData.skills.aiMl.map((skill) => (
                                <li key={skill}>{skill}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-neutral-700 p-6">
                            <h3 className="text-lg font-semibold text-white">Robotics</h3>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-200">
                                {resumeData.skills.robotics.map((skill) => (
                                <li key={skill}>{skill}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-neutral-700 p-6">
                            <h3 className="text-lg font-semibold text-white">Infrastructure</h3>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-200">
                                {resumeData.skills.infrastructure.map((skill) => (
                                <li key={skill}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    </section>
            </main>
        );
    }