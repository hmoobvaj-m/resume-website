export type ResumeProject = {
    id: string;
    title: string;
    subtitle?: string;
    period?: string;
    description: string;
    bullets: string[];
    tech: string[];
    featured: boolean;
    github?: string;
    live?: string;
};

export type ResumeAchievement = {
    id: string;
    title: string;
    organization: string;
    team?: string;
    period: string;
    description: string;
    projectId?: string;
};

export type ResumeSkillGroup = {
    title: string;
    items: string[];
};

export const resumeData = {
    name: "Matthew Vang",
    title: "Computer Science Student",
    location: "Milwaukee, WI",

    summary:
        "Computer Science senior at the University of Wisconsin–Milwaukee with experience in technical documentation, document accessibility, software engineering, artificial intelligence, and virtualized infrastructure. Interested in developing reliable, secure, and practical software solutions through modern technologies.",

    education: [
        {
            degree: "Bachelor of Science in Computer Science",
            school: "University of Wisconsin–Milwaukee",
            location: "Milwaukee, WI",
            period: "Anticipated December 2026",
        },
    ],

    experience: [
        {
            organization: "University of Wisconsin–Milwaukee",
            role: "SAP Technical Writer",
            period: "March 2026 – Present",
            bullets: [
                "Evaluate and remediate document accessibility using NVDA and JAWS, addressing screen reader compatibility, document tagging, heading hierarchies, and non-text content.",
                "Standardize technical documentation and accessibility practices across SAP educational resources.",
                "Leverage AI-assisted workflows to streamline technical content analysis, alternative text generation, and document remediation.",
                "Translate complex SAP ERP business processes and application interfaces into accessible instructional documentation.",
            ],
        },
        {
            organization: "University of Wisconsin–Milwaukee",
            role: "Desktop Support Technician",
            period: "October 2022 – March 2026",
            bullets: [
                "Delivered frontline IT support to university faculty and staff, resolving hardware, software, networking, and user access issues.",
                "Diagnosed and resolved technical incidents through ticketing systems, remote access, and on-site support.",
                "Coordinated the deployment, configuration, and distribution of Windows workstations and peripherals.",
                "Managed enterprise workstation inventories and device configurations using Microsoft SCCM and Active Directory.",
            ],
        },
    ],

    achievements: [
        {
            id: "physical-ai-hackathon-finalist",
            title: "Physical AI Hackathon Finalist",
            organization: "Rockwell Automation × NVIDIA Physical AI Hackathon",
            team: "Team Code Crusaders",
            period: "October 2026 – November 2026",
            description:
                "Selected as a finalist for an AI-powered industrial manufacturing inspection solution.",
            projectId: "manufacturing-inspection",
        },
    ] as ResumeAchievement[],

    personalProjects: [
        {
            id: "studysync",
            title: "StudySync",
            subtitle: "AI-Powered Learning Platform | Senior Capstone Project",
            description:
                "A collaborative full-stack educational platform featuring retrieval-augmented generation, vector-based information retrieval, and LLM-powered study tools.",
            bullets: [
                "Collaborate on the development of a full-stack, AI-powered educational platform.",
                "Design modular backend architecture using the ports-and-adapters pattern to support extensible AI service integration.",
                "Contribute to retrieval-augmented generation (RAG), vector-based information retrieval, and LLM-powered study tools.",
            ],
            tech: ["Next.js", "TypeScript", "Python", "FastAPI", "RAG", "LLMs"],
            featured: true,
        },
        {
            id: "manufacturing-inspection",
            title: "AI-Powered Manufacturing Inspection",
            subtitle: "Rockwell Automation × NVIDIA Physical AI Hackathon | Team Code Crusaders",
            period: "October 2026 – November 2026",
            description:
                "An AI-powered industrial manufacturing inspection solution leveraging computer vision, digital twins, and synthetic data to detect assembly defects.",
            bullets: [
                "Collaborated on a computer vision inspection architecture leveraging digital twins and synthetic data to identify manufacturing assembly defects.",
                "Co-designed a counterfactual inspection methodology comparing real-world camera imagery against simulated manufacturing states to detect anomalies.",
            ],
            tech: [
                "Computer Vision",
                "Digital Twins",
                "Synthetic Data",
                "Artificial Intelligence",
            ],
            featured: true,
        },
        {
            id: "proxmox-homelab",
            title: "Proxmox Virtual Homelab",
            subtitle: "Infrastructure & Systems Engineering",
            description:
                "Self-hosted virtualized infrastructure focused on network security, systems engineering, hardware-accelerated AI workloads, and intelligent automation.",
            bullets: [
                "Architect and administer virtualized infrastructure using Proxmox VE, Linux containers, virtual machines, and Docker.",
                "Implement VLAN segmentation, firewall policies, VPN connectivity, and reverse proxies to secure self-hosted services.",
                "Deploy hardware-accelerated AI workloads, IoT automation, DNS filtering, and intelligent device monitoring services.",
            ],
            tech: ["Proxmox VE", "Linux", "Docker", "LXC", "Networking", "Virtualization"],
            featured: true,
        },
        {
            id: "ipex-llm",
            title: "IPEX-LLM",
            description:
                "Self-hosted, GPU-accelerated large language model inference integrated with Home Assistant for natural language control of IoT devices.",
            bullets: [
                "Deployed and configured Intel IPEX-LLM using Linux, Conda, PyTorch, and Intel oneAPI for GPU-accelerated inference.",
                "Compiled and configured the Linux kernel to address compatibility requirements for AI workloads.",
                "Integrated self-hosted LLM inference with Home Assistant through function calling, enabling natural language control of IoT devices.",
            ],
            tech: ["PyTorch", "Intel oneAPI", "IPEX-LLM", "Linux", "Conda", "Home Assistant"],
            featured: true,
        },
    ] as ResumeProject[],

    skills: [
        {
            title: "Programming Languages",
            items: ["Java", "C", "Python", "TypeScript", "JavaScript"],
        },
        {
            title: "Frameworks & Developer Tools",
            items: ["React", "Next.js", "FastAPI", "REST APIs", "Git", "GitHub", "GitHub Actions"],
        },
        {
            title: "AI & Machine Learning",
            items: [
                "PyTorch",
                "OpenCV",
                "Computer Vision",
                "Large Language Models (LLMs)",
                "Retrieval-Augmented Generation (RAG)",
                "Synthetic Data Generation",
                "Digital Twins",
                "Intel oneAPI",
                "IPEX-LLM",
                "Hardware-Accelerated Inference",
            ],
        },
        {
            title: "Infrastructure & Networking",
            items: [
                "Linux",
                "Docker",
                "Proxmox VE",
                "LXC",
                "Virtualization",
                "TCP/IP",
                "VLANs",
                "Firewalls",
                "DNS",
                "VPNs",
                "Reverse Proxies",
            ],
        },
        {
            title: "Enterprise Systems",
            items: ["SAP S/4HANA", "SAP Fiori", "ERP", "Microsoft SCCM", "Active Directory"],
        },
        {
            title: "Additional Skills",
            items: [
                "Arduino",
                "STM32",
                "CAD",
                "Technical Writing",
                "WCAG",
                "ADA Accessibility",
                "Document Remediation",
                "NVDA",
                "JAWS",
            ],
        },
    ] as ResumeSkillGroup[],
};