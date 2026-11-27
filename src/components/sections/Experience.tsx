import { resumeData } from "@/content/resume";
import ResumeDialog from "@/components/resume/ResumeDialog";
import Icon from "@/components/ui/Icon";

export default function Experience() {
  return (
    <section id="resume" className="section-spacing">
      <div className="site-shell">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="section-title">Experience</h2>

            <p className="section-description">
              Professional experience in technology, accessibility, and enterprise systems.
            </p>
          </div>

          <ResumeDialog
            triggerLabel="View full resume"
            triggerClassName="button-secondary"
          />
        </div>

        <div className="space-y-4">
          {resumeData.experience.map((item) => (
            <article
              key={`${item.organization}-${item.role}`}
              className="surface-card"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-raised text-accent">
                  <Icon name="briefcase" className="size-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {item.role}
                      </h3>

                      <p className="mt-1 text-sm text-muted">
                        {item.organization}
                      </p>
                    </div>

                    <p className="shrink-0 text-xs font-medium text-muted md:text-sm">
                      {item.period}
                    </p>
                  </div>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
                    {item.bullets[0]}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
            Education
          </h3>

          <div className="space-y-4">
            {resumeData.education.map((item) => (
              <article
                key={`${item.degree}-${item.school}`}
                className="surface-card"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-raised text-accent">
                    <Icon name="graduation-cap" className="size-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {item.degree}
                        </h4>

                        <p className="mt-1 text-sm text-muted">
                          {item.school}
                        </p>
                      </div>

                      <p className="shrink-0 text-xs font-medium text-muted md:text-sm">
                        {item.period}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}