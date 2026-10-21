"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  className: string;
  labelledBy: string;
  children: ReactNode;
};

/** Native <dialog> driven by React state: focus trap, Esc and backdrop-click close for free. */
export function Modal({ open, onClose, className, labelledBy, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      document.body.style.overflow = "";
      onCloseRef.current();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  return (
    <dialog
      ref={ref}
      className={className}
      aria-labelledby={labelledBy}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close(); // backdrop
      }}
    >
      {children}
    </dialog>
  );
}
