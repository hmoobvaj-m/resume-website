import { projects } from "@/content/projects";

export default function FeaturedProjects() {
    const featuredProjects = projects.filter((project) => project.featured);

    return (
        <section id="projects" className="scroll-mt-8 py-10 md:py-12">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold md:text-3xl">
                        Featured Projects
                    </h2>

                    <p className="mt-2 text-neutral-400">
                        Selected personal projects and technologies.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {featuredProjects.map((project) => (
                        <article key={project.title} className="surface-card flex flex-col">
                            <h3 className="text-xl font-semibold text-neutral-100">
                                {project.title}
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-neutral-400">
                                {project.description}
                            </p>

                            <ul className="mb-5 mt-4 flex flex-wrap gap-2">
                                {project.tech.map((item) => (
                                    <li key={item} className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs text-neutral-300">
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto flex flex-wrap gap-3">
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="button-secondary text-sm">
                                        Source repository
                                    </a>
                                )}

                                {project.live && (
                                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="button-secondary text-sm">
                                        View live site
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}