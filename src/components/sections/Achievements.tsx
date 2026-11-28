import { resumeData } from "@/content/resume";
import { projects } from "@/content/projects";
import Icon from "@/components/ui/Icon";

export default function Achievements() {
    if (!resumeData.achievements.length) return null;

    return (
        <section id="achievements" className="section-spacing border-t border-border">
            <div className="site-shell">
                <div className="mb-6">
                    <h2 className="section-title">Honors &amp; Achievements</h2>

                    <p className="section-description">
                        Professional, Academic, and Competitive Recognition.
                    </p>
                </div>

                <div className="space-y-4">
                    {resumeData.achievements.map((achievement) => {
                        const relatedProject = projects.find(
                            (project) => project.id === achievement.projectId && project.featured
                        );

                        return (
                            <article
                                key={achievement.id}
                                className="surface-card border-border-strong"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-surface-raised text-accent">
                                        <Icon name="award" className="size-8" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                                                    {achievement.title}
                                                </h3>

                                                <p className="mt-1 text-sm font-medium text-accent">
                                                    {achievement.organization}
                                                </p>

                                                {achievement.team && (
                                                    <p className="mt-1 text-sm text-muted">
                                                        {achievement.team}
                                                    </p>
                                                )}
                                            </div>

                                            <p className="shrink-0 text-xs font-medium text-muted md:text-sm">
                                                {achievement.period}
                                            </p>
                                        </div>

                                        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
                                            {achievement.description}
                                        </p>

                                        {relatedProject && (
                                            <a
                                                href={`#project-${relatedProject.id}`}
                                                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-foreground hover:underline"
                                            >
                                                View Technical Project
                                                <Icon name="arrow-right" className="size-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}