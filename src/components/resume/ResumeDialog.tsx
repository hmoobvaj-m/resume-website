import Link from "next/link";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";
import ResumeContent from "@/components/resume/ResumeContent";

type ResumeDialogProps = {
    triggerLabel?: string;
    triggerClassName?: string;
};

export default function ResumeDialog({
    triggerLabel = "View Full Resume",
    triggerClassName = "button-secondary",
}: ResumeDialogProps) {
    return (
        <Modal
            title="Resume"
            titleIcon="file-text"
            triggerLabel={
                <>
                    <Icon name="file-text" className="size-4" />
                    {triggerLabel}
                </>
            }
            triggerClassName={triggerClassName}
            fallbackHref="/resume"
            wide
            actions={
                <>
                    <a href="/resume.pdf" download className="button-primary">
                        <Icon name="download" className="size-4" />
                        Download PDF
                    </a>

                    <Link href="/resume" className="button-secondary">
                        Full Page
                        <Icon name="external-link" className="size-4" />
                    </Link>
                </>
            }
        >
            <ResumeContent />
        </Modal>
    );
}