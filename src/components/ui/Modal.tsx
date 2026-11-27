"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";

type ModalProps = {
    title: string;
    triggerLabel: string;
    triggerClassName?: string;
    fallbackHref?: string;
    actions?: ReactNode;
    children: ReactNode;
    wide?: boolean;
};

export default function Modal({
    title,
    triggerLabel,
    triggerClassName = "button-secondary",
    fallbackHref,
    actions,
    children,
    wide = false,
}: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    const [isOpen, setIsOpen] = useState(false);

    function openDialog(event: MouseEvent<HTMLElement>) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

        const dialog = dialogRef.current;

        if (!dialog || typeof dialog.showModal !== "function" || dialog.open) return;

        event.preventDefault();
        dialog.showModal();
        setIsOpen(true);
    }

    function closeDialog() {
        dialogRef.current?.close();
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
                onClose={() => setIsOpen(false)}
                className={`m-auto w-11/12 overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 text-neutral-100 shadow-2xl ${wide ? "max-w-4xl" : "max-w-xl"}`}
            >
                <div className="flex max-h-[90dvh] flex-col">
                    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-700 px-5 py-4">
                        <h2 id={titleId} className="text-xl font-semibold">{title}</h2>

                        <div className="flex flex-wrap items-center gap-2">
                            {actions}

                            <button
                                type="button"
                                onClick={closeDialog}
                                aria-label="Close dialog"
                                className="rounded-lg px-3 py-2 text-xl text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                            >
                                &times;
                            </button>
                        </div>
                    </header>

                    <div className="min-h-0 overflow-y-auto overscroll-contain p-5 md:p-8">
                        {isOpen && children}
                    </div>
                </div>
            </dialog>
        </>
    );
}