export type ResumeProject = {
title: string;
bullets?: string[];
subBullets?: string[];
};

export const resumeData = {
    name: "Matthew Vang",
    title: "Computer Science Student",
    summary:
        "Senior at the University of Wisconsin–Milwaukee with interests in backend development, machine learning applications, robotics, networking, IoT technologies, and embedded systems. I enjoy working in Linux environments and building or contributing to open-source software related to homelab infrastructure.",

    education: [
        {
        degree: "B.S. in Computer Science",
        school: "University of Wisconsin–Milwaukee",
        period: "Anticipated Fall 2027",
        },
    ],

    experience: [
        {
        organization: "UW–Milwaukee",
        role: "Desktop Support Technician",
        period: "October 2022 - Current",
        bullets: [
            "Serve as a front-line contact for professors and faculty for all IT-related inquiries including granting user access, deploying software, basic network issues, and hardware/software issues.",
            "Provide IT support to end-users through ticketing system over the phone, by email, through remote access, or by traveling to offsite locations.",
            "Collaborate with a team of technicians to ensure efficient deployment and inventory of systems and peripherals.",
            "Manage the deployment of Windows systems and peripherals to fulfill client purchasing and deployment requests.",
            "Inventory and manage computer workstations and peripherals in a computer management system using Microsoft SCCM and Active Directory.",
        ],
        },
    ],

    personalProjects: [
        {
            title: "Resume Website",
            bullets: [
                "Developed a responsive personal website to showcase my resume, projects, and to gain more experience in frontend development",
                "Structured resume content in reusable TypeScript data objects for easier maintenance and updates",
                "Uses Tailwind CSS to create a consistent UI across all sections and screen sizes",
            ]
        },
        {
            title: "Proxmox Virtual Homelab",
            bullets: [
                "Operate a hypervisor to host multiple Linux containers (LXCs) and virtual machines (VMs) for hands-on practice.",
                "Utilize the environment to strengthen skills in Linux, networking, firewall configuration, and system monitoring and management.",
                "Deploy and manage self-hosted services, including:",
            ],
            subBullets: [
                "AI MCP Server for monitoring 3D printers and detecting failures.",
                "Home Assistant for IoT device management.",
                "Jellyfin for media streaming.",
                "Pi-hole for network-wide ad blocking.",
                "IPEX-LLM and Stable Diffusion for testing AI workloads on Intel Arc platform.",
                "Nginx Proxy Manager for secure reverse proxying of exposed services.",
            ],
        },
        {
            title: "IPEX-LLM",
            bullets: [
            "Installed and self-hosted Intel’s IPEX-LLM on Linux kernel 6.5, configuring runtime dependencies in a Conda environment with PyTorch and Intel oneAPI for optimized inference performance.",
            "Compiled and tuned the Linux kernel to ensure compatibility across shared libraries and improve efficiency for AI workloads.",
            "Integrated the hosted LLM with Home Assistant, enabling natural language commands through function calling to control IoT smart devices or provide intelligent responses.",
            ],
        },
    ] as ResumeProject[],

    skills: {
        programming: [
        "Object-Oriented Programming in Java",
        "Systems Programming in C/UNIX",
        "Python",
        "JavaScript",
        "TypeScript",
        "Git",
        ],
        aiMl: [
        "PyTorch",
        "Intel oneAPI",
        "Conda",
        "IPEX-LLM",
        "Kernel Tuning/Configuration",
        "YOLOv9",
        ],
        robotics: [
        "Arduino",
        "STM32",
        "CAD",
        "Computer Hardware",
        ],
        infrastructure: [
        "Microsoft SCCM",
        "Active Directory",
        "Linux Systems Management",
        "Networking (TCP/IP, Firewalls, Reverse Proxy)",
        ],
    },
};