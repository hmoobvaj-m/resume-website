export type Project = {
    title: string;
    description: string;
    tech: string[];
    github?: string;
    live?: string;
    featured: boolean;
};

export const projects: Project[] = [
    {
        title: "Proxmox VE",
        description: "",
        tech: [],
        github: "",
        featured: true,
    },
];