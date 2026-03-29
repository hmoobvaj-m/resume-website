import Link from "next/link"
import { projects } from "@/content/projects"

export default function FeaturedProjects() {
    const featuredProjects = projects.filter((project) => project.featured);

    return (
        <section id="projects" className="py-8">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mb-8">
                    <h2 className="text-center text-2xl font-semibold md:text-3xl">Featured Projects</h2>

                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {featuredProjects.map((project) => (
                        <article key={project.title} className="rounded-2xl border border-neutral-400 p-6 shadow-sm">
                            <h3 className="text-center text-xl font-semibold">{project.title}</h3>

                            <p className="mt-3 text-neutral-300">{project.description}</p>

                            <ul className="mt-4 flex flex-wrap gap-2">
                                {project.tech.map((item) => (
                                    <li key={item} className="rounded-full bg-neutral-700 px-3 py-1 text-sm">
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-5 flex gap-4 sm:justify-center text-center">
                                {project.github && (<a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-block text-neutral-200 transition duration-200 hover:-translate-y-0.5 hover:text-white">Github</a>)}

                                {project.live && (<a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-block text-neutral-200 transition duration-200 hover:-translate-y-0.5 hover:text-white">Live Site</a>)}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}