import { resumeData } from "@/content/resume";

export const siteConfig = {
    name: resumeData.name,
    title: resumeData.title,
    summary: resumeData.summary,

    github: "https://github.com/hmoobvaj-m",
    linkedin: "https://linkedin.com/in/mhmongvaj",

    url: "https://matthew.hmoobvaj.us",

    contact: {
        endpoint: "/api/contact",
        turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
    },
};