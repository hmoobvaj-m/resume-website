import { resumeData } from "@/content/resume";
import Icon, { type IconName } from "@/components/ui/Icon";

const skillIcons: Record<string, IconName> = {
    "Programming Languages": "code",
    "Frameworks & Developer Tools": "layers",
    "AI & Machine Learning": "brain",
    "Infrastructure & Networking": "server",
    "Enterprise Systems": "briefcase",
    "Additional Skills": "check",
};

export default function SkillsSection() {
    return (
        <section id="skills" className="section-spacing">
            <div className="site-shell">
                <div className="mb-6">
                    <h2 className="section-title">Technical Skills</h2>

                    <p className="section-description">
                        Technologies and competencies across development, AI, and systems engineering.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {resumeData.skills.map((group) => (
                        <article key={group.title} className="surface-card min-w-0">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-accent">
                                    <Icon
                                        name={skillIcons[group.title] ?? "layers"}
                                        className="size-5"
                                    />
                                </div>

                                <h3 className="text-base font-semibold tracking-tight text-foreground">
                                    {group.title}
                                </h3>
                            </div>

                            <ul className="mt-5 flex flex-wrap gap-2">
                                {group.items.map((skill) => (
                                    <li
                                        key={skill}
                                        className="tech-tag max-w-full whitespace-normal break-words"
                                    >
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