
import { resumeData } from "@/content/resume";
import Icon from "@/components/ui/Icon";

export default function ResumeContent() {
    return (
        <article>
            <header className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {resumeData.name}
                </h2>

                <p className="mt-2 text-lg text-muted">
                    {resumeData.title}
                </p>

                <p className="mt-1 text-sm text-muted">
                    {resumeData.location}
                </p>
            </header>

            <section className="border-t border-border py-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <Icon name="file-text" className="size-5 text-accent" />
                    Summary
                </h3>

                <p className="mt-4 leading-7 text-muted">
                    {resumeData.summary}
                </p>
            </section>

            <section className="border-t border-border py-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <Icon name="graduation-cap" className="size-5 text-accent" />
                    Education
                </h3>

                <div className="mt-4 space-y-4">
                    {resumeData.education.map((item) => (
                        <div key={`${item.degree}-${item.school}`} className="flex flex-col gap-2 md:flex-row md:justify-between">
                            <div>
                                <h4 className="font-semibold text-foreground">
                                    {item.degree}
                                </h4>

                                <p className="text-muted">
                                    {item.school}
                                </p>

                                <p className="text-sm text-muted">
                                    {item.location}
                                </p>
                            </div>

                            <p className="text-sm text-muted">
                                {item.period}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-t border-border py-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <Icon name="briefcase" className="size-5 text-accent" />
                    Work Experience
                </h3>

                <div className="mt-4 space-y-6">
                    {resumeData.experience.map((item) => (
                        <article key={`${item.organization}-${item.role}`}>
                            <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                                <div>
                                    <h4 className="font-semibold text-foreground">
                                        {item.role}
                                    </h4>

                                    <p className="text-muted">
                                        {item.organization}
                                    </p>
                                </div>

                                <p className="text-sm text-muted">
                                    {item.period}
                                </p>
                            </div>

                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
                                {item.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            {resumeData.achievements.length > 0 && (
                <section className="border-t border-border py-6">
                    <h3 className="flex items-center gap-3 text-xl font-semibold text-foreground">
                        <Icon name="award" className="size-5 text-accent" />
                        Honors &amp; Awards
                    </h3>

                    <div className="mt-4 space-y-6">
                        {resumeData.achievements.map((achievement) => (
                            <article key={achievement.id}>
                                <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                                    <div>
                                        <h4 className="font-semibold text-foreground">
                                            {achievement.title}
                                        </h4>

                                        <p className="text-muted">
                                            {achievement.organization}
                                        </p>

                                        {achievement.team && (
                                            <p className="text-sm text-muted">
                                                {achievement.team}
                                            </p>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted">
                                        {achievement.period}
                                    </p>
                                </div>

                                <p className="mt-3 text-sm leading-6 text-muted">
                                    {achievement.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <section className="border-t border-border py-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <Icon name="layers" className="size-5 text-accent" />
                    Technical Projects
                </h3>

                <div className="mt-4 space-y-6">
                    {resumeData.personalProjects.map((project) => (
                        <article key={project.id}>
                            <h4 className="font-semibold text-foreground">
                                {project.title}
                            </h4>

                            {project.subtitle && (
                                <p className="mt-1 text-sm text-muted">
                                    {project.subtitle}
                                </p>
                            )}

                            {project.period && (
                                <p className="mt-1 text-sm text-muted">
                                    {project.period}
                                </p>
                            )}

                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
                                {project.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            <section className="border-t border-border py-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <Icon name="code" className="size-5 text-accent" />
                    Technical Skills
                </h3>

                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                    {resumeData.skills.map((group) => (
                        <div key={group.title}>
                            <h4 className="font-semibold text-foreground">
                                {group.title}
                            </h4>

                            <ul className="mt-3 flex flex-wrap gap-2">
                                {group.items.map((skill) => (
                                    <li
                                        key={skill}
                                        className="tech-tag max-w-full whitespace-normal break-words"
                                    >
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
