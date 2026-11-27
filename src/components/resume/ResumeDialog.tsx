import Link from "next/link";
import Modal from "@/components/ui/Modal";
import ResumeContent from "@/components/resume/ResumeContent";

type ResumeDialogProps = {
    triggerLabel?: string;
    triggerClassName?: string;
};

export default function ResumeDialog({
    triggerLabel = "View full resume",
    triggerClassName = "button-secondary",
}: ResumeDialogProps) {
    return (
        <Modal
            title="Resume"
            triggerLabel={triggerLabel}
            triggerClassName={triggerClassName}
            fallbackHref="/resume"
            wide
            actions={
                <>
                    <a href="/resume.pdf" download className="button-primary text-sm">
                        Download PDF
                    </a>

                    <Link href="/resume" className="button-secondary text-sm">
                        Full page
                    </Link>
                </>
            }
        >
            <ResumeContent />
        </Modal>
    );
}