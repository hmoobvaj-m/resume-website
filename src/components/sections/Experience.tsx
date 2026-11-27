import { resumeData } from "@/content/resume";
import ResumeDialog from "@/components/resume/ResumeDialog";

export default function ExperiencePreview() {
  return (
    <section id="resume" className="scroll-mt-8 py-10 md:py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Experience
          </h2>

          <ResumeDialog />
        </div>

        <div className="mt-6 space-y-4">
          {resumeData.experience.slice(0, 2).map((item) => (
            <article key={`${item.organization}-${item.role}`} className="surface-card">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-100">{item.role}</h3>
                  <p className="mt-1 text-neutral-400">{item.organization}</p>
                </div>

                <p className="text-sm text-neutral-400">{item.period}</p>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}