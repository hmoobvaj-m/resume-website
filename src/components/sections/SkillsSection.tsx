import { resumeData } from "@/content/resume";

export default function SkillsSection() {
    const skillGroups = [
        { category: "Programming", items: resumeData.skills.programming },
        { category: "AI/ML", items: resumeData.skills.aiMl },
        { category: "Robotics", items: resumeData.skills.robotics },
        { category: "Infrastructure", items: resumeData.skills.infrastructure },
    ]

    return (
        <section className="py-16">
            <div className="mx-auto max-w-5xl px-6">
                <h2 className="text-2xl font-semibold md:text-3xl text-center">Skills</h2>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {skillGroups.map((group) => (
                        <div key={group.category} className="rounded-2xl border border-neutral-500 p-6">
                            <h3 className="text-lg font-semibold text-center">{group.category}</h3>

                            <ul className="mt-4 flex flex-wrap gap-2 justify-center">
                                {group.items.map((item) => (
                                    <li key={item} className="rounded-full bg-neutral-100 px-3 py-1 text-sm">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}