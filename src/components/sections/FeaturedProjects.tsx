import { projects } from "@/content/projects";
import Icon, { type IconName } from "@/components/ui/Icon";

const projectIcons: Record<string, IconName> = {
    "StudySync": "brain",
    "Rockwell Automation × NVIDIA Hackathon": "scan",
    "Proxmox Virtual Homelab": "server",
    "IPEX-LLM": "cpu",
};

export default function FeaturedProjects() {
    const featuredProjects = projects.filter((project) => project.featured);

    return (
        <section id="projects" className="section-spacing border-y border-border">
            <div className="site-shell">
                <div className="mb-6">
                    <h2 className="section-title">Featured Projects</h2>

                    <p className="section-description">
                        Selected work across software engineering, artificial intelligence, and infrastructure.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {featuredProjects.map((project) => (
                        <article
                            key={project.title}
                            className="surface-card flex h-full min-w-0 flex-col"
                        >
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-raised text-accent">
                                    <Icon
                                        name={projectIcons[project.title] ?? "code"}
                                        className="size-6"
                                    />
                                </div>

                                {project.period && (
                                    <p className="text-right text-xs font-medium leading-5 text-muted">
                                        {project.period}
                                    </p>
                                )}
                            </div>

                            <h3 className="text-xl font-semibold tracking-tight text-foreground">
                                {project.title}
                            </h3>

                            {project.subtitle && (
                                <p className="mt-1 text-sm font-medium leading-6 text-accent">
                                    {project.subtitle}
                                </p>
                            )}

                            <p className="mt-4 text-sm leading-7 text-muted">
                                {project.description}
                            </p>

                            <div className="mt-auto pt-5">
                                <ul aria-label="Technologies" className="flex flex-wrap gap-2">
                                    {project.tech.map((technology) => (
                                        <li key={technology} className="tech-tag">
                                            {technology}
                                        </li>
                                    ))}
                                </ul>

                                {(project.github || project.live) && (
                                    <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-5">
                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="button-secondary"
                                            >
                                                <Icon name="github" className="size-4" />
                                                Source repository
                                            </a>
                                        )}

                                        {project.live && (
                                            <a
                                                href={project.live}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="button-secondary"
                                            >
                                                View project
                                                <Icon name="external-link" className="size-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}