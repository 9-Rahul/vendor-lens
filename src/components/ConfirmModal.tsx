"use client";

import { useEffect } from "react";
import { LuTriangleAlert } from "react-icons/lu";

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel, onConfirm]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative bg-white rounded-xl shadow-xl border border-[var(--color-outline-variant)]/40 w-full max-w-sm p-6 animate-[fadeInScale_150ms_ease-out]">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
            <LuTriangleAlert className="w-4 h-4 text-red-500" strokeWidth={2.5} />
          </div>
          <div>
            <h2
              id="confirm-modal-title"
              className="text-[15px] font-bold text-[var(--color-on-surface)] mb-1"
            >
              {title}
            </h2>
            <p className="text-[13px] text-[var(--color-secondary)] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-[12px] font-medium text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-lowest)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-[12px] font-medium text-white bg-red-500 hover:bg-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
