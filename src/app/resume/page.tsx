import type { Metadata } from "next";
import Link from "next/link";
import ResumeContent from "@/components/resume/ResumeContent";
import Icon from "@/components/ui/Icon";
import { resumeData } from "@/content/resume";

export const metadata: Metadata = {
    title: `Resume | ${resumeData.name}`,
    description: "Professional experience, education, projects and technical skills.",
};

export default function ResumePage() {
    return (
        <main className="site-shell py-8 md:py-14">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <Link href="/" className="button-secondary">
                        <Icon name="arrow-right" className="size-4 rotate-180" />
                        Back to Home
                    </Link>

                    <a href="/resume.pdf" download className="button-primary">
                        <Icon name="download" className="size-4" />
                        Download PDF
                    </a>
                </div>

                <h1 className="sr-only">Resume</h1>

                <div className="surface-card p-5 sm:p-8 md:p-10">
                    <ResumeContent />
                </div>

                <p className="mt-6 text-center text-xs leading-6 text-muted">
                    {resumeData.name} &middot; Professional Resume
                </p>
            </div>
        </main>
    );
}