import type { Metadata } from "next";
import Link from "next/link";
import ResumeContent from "@/components/resume/ResumeContent";

export const metadata: Metadata = {
    title: "Resume | Matthew Vang",
    description: "Professional experience, education, projects and technical skills.",
};

export default function ResumePage() {
    return (
        <main className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <Link href="/" className="button-secondary">
                    Back to home
                </Link>

                <a href="/resume.pdf" download className="button-primary">
                    Download PDF
                </a>
            </div>

            <h1 className="sr-only">Resume</h1>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:p-10">
                <ResumeContent />
            </div>
        </main>
    );
}