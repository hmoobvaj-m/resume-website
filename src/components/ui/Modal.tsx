"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import Icon, { type IconName } from "@/components/ui/Icon";

type ModalProps = {
    title: string;
    titleIcon?: IconName;
    triggerLabel: ReactNode;
    triggerClassName?: string;
    fallbackHref?: string;
    actions?: ReactNode;
    children: ReactNode;
    wide?: boolean;
};

export default function Modal({
    title,
    titleIcon,
    triggerLabel,
    triggerClassName = "button-secondary",
    fallbackHref,
    actions,
    children,
    wide = false,
}: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const titleId = useId();
    const [isOpen, setIsOpen] = useState(false);

    function openDialog(event: MouseEvent<HTMLElement>) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

        const dialog = dialogRef.current;

        if (!dialog || typeof dialog.showModal !== "function" || dialog.open) return;

        event.preventDefault();

        triggerRef.current = event.currentTarget;

        dialog.showModal();
        setIsOpen(true);
    }

    function closeDialog() {
        dialogRef.current?.close();
    }

    function handleClose() {
        setIsOpen(false);
        triggerRef.current?.focus();
    }

    return (
        <>
            {fallbackHref ? (
                <Link href={fallbackHref} prefetch={false} onClick={openDialog} className={triggerClassName} aria-haspopup="dialog">
                    {triggerLabel}
                </Link>
            ) : (
                <button type="button" onClick={openDialog} className={triggerClassName} aria-haspopup="dialog">
                    {triggerLabel}
                </button>
            )}

            <dialog
                ref={dialogRef}
                aria-labelledby={titleId}
                onClose={handleClose}
                className={`dialog-surface ${wide ? "max-w-4xl" : "max-w-xl"}`}
            >
                <div className="flex max-h-[90dvh] flex-col">
                    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-raised px-4 py-3 sm:px-6 sm:py-4">
                        <h2 id={titleId} className="flex min-w-0 flex-1 items-center gap-3 text-lg font-semibold tracking-tight sm:text-xl">
                            {titleIcon && (
                                <Icon name={titleIcon} className="size-6 text-accent" />
                            )}

                            {title}
                        </h2>

                        <button
                            type="button"
                            onClick={closeDialog}
                            aria-label="Close dialog"
                            className="icon-button order-2 sm:order-3"
                        >
                            <Icon name="close" />
                        </button>

                        {actions && (
                            <div className="order-3 flex w-full flex-wrap items-center gap-2 sm:order-2 sm:w-auto">
                                {actions}
                            </div>
                        )}
                    </header>

                    <div className="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-8">
                        {isOpen && children}
                    </div>
                </div>
            </dialog>
        </>
    );
}