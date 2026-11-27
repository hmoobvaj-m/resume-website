import { resumeData, type ResumeProject } from "@/content/resume";

export type Project = Pick<
    ResumeProject,
    "title" | "subtitle" | "period" | "description" |
    "tech" | "github" | "live" | "featured"
>;

export const projects: Project[] = resumeData.personalProjects.map((project) => ({
    title: project.title,
    subtitle: project.subtitle,
    period: project.period,
    description: project.description,
    tech: project.tech,
    github: project.github,
    live: project.live,
    featured: project.featured,
}));