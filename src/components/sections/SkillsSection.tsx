import { resumeData } from "@/content/resume";

export default function SkillsSection() {
    const skillGroups = [
        { category: "Languages", items: resumeData.skills.languages },
        { category: "Frameworks", items: resumeData.skills.frameworks },
        { category: "Databases", items: resumeData.skills.databases },
        { category: "Tools", items: resumeData.skills.tools },
    ]

    return (
        <section className="py-16">
            <div className="mx-auto max-w-5xl px-6">
                <h2 className="text-2xl font-semibold md:text-3xl text-center">Skills</h2>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {skillGroups.map((group) => (
                        <div key={group.category} className="rounded-2xl border border-neutral-500 p-6">
                            <h3 className="text-lg font-semibold text-center">{group.category}</h3>

                            <ul className="mt-4 flex flex-wrap gap-2 sm:justify-center">
                                {group.items.map((item) => (
                                    <li key={item} className="rounded-full bg-neutral-1oo px-3 py-1 text-sm">
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