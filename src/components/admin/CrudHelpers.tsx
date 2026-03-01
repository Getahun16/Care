"use client";
import React from "react";

/* ── Reusable form field wrapper ───────────────────────────────────── */
export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputCls =
  "w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-leaf-bright/40";

export const selectCls =
  "w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-leaf-bright/40";

export const textareaCls =
  "w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-leaf-bright/40 resize-none";

/* ── Confirm delete dialog ──────────────────────────────────────────── */
export function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  label,
  pending,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  label: string;
  pending?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="glass-card rounded-xl border border-border p-6 max-w-sm w-full mx-4 space-y-4">
        <h3 className="font-semibold text-foreground">Delete {label}?</h3>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-muted border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={pending}
            className="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50"
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal wrapper ──────────────────────────────────────────────────── */
export function CrudModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto pt-8 pb-8">
      <div className="glass-card rounded-xl border border-border p-6 max-w-lg w-full mx-4 space-y-5 relative">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Submit button ──────────────────────────────────────────────────── */
export function SubmitBtn({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-leaf-bright transition-colors disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
