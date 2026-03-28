export const resumeData = {
    name: "Matthew Vang",
    title: "Computer Science Student",
    summary: "Computer Science Student with an interest in backend development, machine learning applications, IoT Technologies, and networking.",

    experience: [
        {
            organization: "UW-Milwaukee",
            role: "IT Technician",
            period: "October 2022 - Present",
            bullets: [
                "Serve as a front-line contact for professors and faculty for all IT-related inquiries including granting user access, deploying software, basic network issues, and hardware/software issues",
                "Provide IT support to end-users through ticketing system: over the phone, email, remote access, or traveling to offsite locations",
                "Collaborating with a team of technicians to ensure efficient deployment and inventory of systems and peripherals",
                "Managing the deployment of Windows systems and peripherals to fulfill client purchasing and deployment requests",
                "Inventorying/managing computer workstations and peripherals into a computer management system using Microsoft SCCM and Active Directory",
            ],
        },
    ],

    projects: [
        {
            title: "Resume Website",
            description: "Self-hosted portfolio site built with Next.js, TypeScript, and Docker behind a reverse proxy.",
            tech: ["Next.js", "TypeScript", "Tailwind CSS", "Docker"],
            live: "https://professional.hmoobvaj.us",
            featured: true
        },
        {
            title: "IPEX-LLM",
            description: "Performance layer on top of PyTorch that utilizes Intel's optimized mathematical operations instead of native PyTorch operations to allow better performance on Intel Hardware.",
            tech: ["PyTorch", "Python"],
            github: "https://github.com/intel/ipex-llm",
            featured: true
        },    
        {
            title: "Proxmox VE",
            description: "An open-source server management platform with a web-based UI that integrates KVM hypervisor, Linux Containers (LXC), software-defined storage, and networking functionalities on a single platform.",
            tech: ["Rust", "C", "JavaScript", "Perl", "Makefile"],
            github: "https://github.com/proxmox",
            featured: true
        },
    ],

    skills: {
        languages: ["Python", "TypeScript", "Java", "JavaScript", "SQL"],
        frameworks: ["Next.js", "Node.js", "React", "Django", "Django REST Framework"],
        databases: ["MySQL", "MongoDB"],
        tools: ["Git", "Docker", "Linux"],
    }
}