import Icon from "@/components/ui/Icon";
import ContactDialog from "@/components/contact/ContactDialog";
import { resumeData } from "@/content/resume";

const navigation = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#resume" },
    ...(resumeData.achievements.length
        ? [{ label: "Achievements", href: "#achievements" }]
        : []),
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
];

export default function Header() {
    return (
        <header className="relative z-40 border-b border-border bg-background/95 backdrop-blur-xl lg:sticky lg:top-0">
            <div className="site-shell">
                <div className="flex min-h-18 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
                    <a href="#about" className="inline-flex items-center gap-3 font-semibold tracking-tight text-foreground">
                        <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface-raised">
                            <Icon name="terminal" className="size-5 text-accent" />
                        </span>

                        <span>M. Vang</span>
                    </a>

                    <nav
                        aria-label="Main navigation"
                        className="order-3 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 lg:order-2 lg:ml-auto lg:w-auto lg:gap-x-5"
                    >
                        {navigation.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="inline-flex min-h-11 items-center text-sm font-medium text-muted transition-colors hover:text-foreground"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="order-2 lg:order-3">
                        <ContactDialog
                            triggerLabel="Contact"
                            triggerClassName="button-primary"
                            showIcon={false}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}