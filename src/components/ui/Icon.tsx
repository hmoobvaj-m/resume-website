import type { ReactNode } from "react";

export type IconName =
    | "terminal"
    | "code"
    | "graduation-cap"
    | "file-text"
    | "mail"
    | "github"
    | "linkedin"
    | "map-pin"
    | "briefcase"
    | "server"
    | "cpu"
    | "brain"
    | "scan"
    | "layers"
    | "arrow-right"
    | "external-link"
    | "download"
    | "close"
    | "check"
    | "send";

type IconProps = {
    name: IconName;
    className?: string;
};

const icons: Record<IconName, ReactNode> = {
    terminal: (
        <>
            <path d="m4 6 6 6-6 6" />
            <path d="M12 18h8" />
        </>
    ),
    code: (
        <>
            <path d="m8 6-6 6 6 6" />
            <path d="m16 6 6 6-6 6" />
            <path d="m14 4-4 16" />
        </>
    ),
    "graduation-cap": (
        <>
            <path d="m2 10 10-5 10 5-10 5-10-5Z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
            <path d="M22 10v6" />
        </>
    ),
    "file-text": (
        <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6M8 13h8M8 17h8" />
        </>
    ),
    mail: (
        <>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m2 6 10 7L22 6" />
        </>
    ),
    github: (
        <>
            <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.1-1.5 6.1-6.7A5.2 5.2 0 0 0 18.8 5c.2-.8.2-2-.2-3.2 0 0-1.1-.3-3.6 1.4a12.5 12.5 0 0 0-6 0C6.5 1.5 5.4 1.8 5.4 1.8 5 3 5 4.2 5.2 5a5.2 5.2 0 0 0-1.4 3.8c0 5.2 3.1 6.4 6.1 6.7A3.4 3.4 0 0 0 9 18.1V22" />
        </>
    ),
    linkedin: (
        <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 10v7M7 7v.1M11 17v-7M11 13a3 3 0 0 1 6 0v4" />
        </>
    ),
    "map-pin": (
        <>
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </>
    ),
    briefcase: (
        <>
            <rect x="3" y="7" width="18" height="14" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
        </>
    ),
    server: (
        <>
            <rect x="3" y="3" width="18" height="7" rx="2" />
            <rect x="3" y="14" width="18" height="7" rx="2" />
            <path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6" />
        </>
    ),
    cpu: (
        <>
            <rect x="6" y="6" width="12" height="12" rx="2" />
            <rect x="9" y="9" width="6" height="6" rx="1" />
            <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
        </>
    ),
    brain: (
        <>
            <path d="M12 18V5a3 3 0 0 0-6-1 4 4 0 0 0-3 6 4 4 0 0 0 1 7 4 4 0 0 0 8 1Z" />
            <path d="M12 18V5a3 3 0 0 1 6-1 4 4 0 0 1 3 6 4 4 0 0 1-1 7 4 4 0 0 1-8 1ZM7 9l2 2M17 9l-2 2" />
        </>
    ),
    scan: (
        <>
            <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
            <circle cx="12" cy="12" r="4" />
        </>
    ),
    layers: (
        <>
            <path d="m12 3 10 5-10 5L2 8l10-5Z" />
            <path d="m2 12 10 5 10-5M2 16l10 5 10-5" />
        </>
    ),
    "arrow-right": (
        <>
            <path d="M4 12h16M14 6l6 6-6 6" />
        </>
    ),
    "external-link": (
        <>
            <path d="M14 3h7v7M21 3l-10 10" />
            <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
        </>
    ),
    download: (
        <>
            <path d="M12 3v12M7 10l5 5 5-5" />
            <path d="M4 15v5h16v-5" />
        </>
    ),
    close: (
        <path d="m6 6 12 12M18 6 6 18" />
    ),
    check: (
        <path d="m5 12 4 4L19 6" />
    ),
    send: (
        <>
            <path d="m22 2-7 20-4-9-9-4 20-7Z" />
            <path d="m22 2-11 11" />
        </>
    ),
};

export default function Icon({ name, className = "size-5" }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            className={`shrink-0 ${className}`}
        >
            {icons[name]}
        </svg>
    );
}