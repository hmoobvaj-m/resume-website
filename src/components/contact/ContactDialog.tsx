import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";
import ContactForm from "@/components/contact/ContactForm";

type ContactDialogProps = {
    triggerLabel?: string;
    triggerClassName?: string;
    showIcon?: boolean;
};

export default function ContactDialog({
    triggerLabel = "Contact me",
    triggerClassName = "button-secondary",
    showIcon = true,
}: ContactDialogProps) {
    return (
        <Modal
            title="Contact me"
            triggerLabel={
                <>
                    {showIcon && <Icon name="mail" className="size-4" />}
                    {triggerLabel}
                </>
            }
            triggerClassName={triggerClassName}
        >
            <ContactForm />
        </Modal>
    );
}