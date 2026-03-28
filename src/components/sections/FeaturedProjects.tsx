import Link from "next/link"
import { projects } from "@/content/projects"

export default function FeaturedProjects() {
    const featuredProjects = projects.filter((project) => project.featured);

    return (
        <section id="projects" className="py-16">
            <div className="mx-auto max-w-5x1 px-6">
                <div className="mb-8">
                    <h2 className="text-2x1 font-semibold md:text-3x1">Featured Projects</h2>
                    
                    <p className="mt-2 text-neutral-600">A few projects that reflect my current interest and technical focus</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {featuredProjects.map((project) => (
                        <article key={project.title} className="rounded-2x1 border border-neutral-200 p-6">
                            <h3 className="text-xl font-semibold">{project.title}</h3>"
                            <p className="mt-3 text-neutral-600">{project.description}</p>

                            <ul className="mt-4 flex flex-wrap gap-2">
                                {project.tech.map((item) => (
                                    <li key={item} className="rounded-full bg-neutral-100 px-3 py-1 text-sm">
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-5 flex gap-4">
                                {project.github && (<Link href={project.github} className="underline">Github</Link>)}

                                {project.live && (<Link href={project.live} className="underline">Live Site</Link>)}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}