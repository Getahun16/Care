"use client";
import React, { useRef, useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  GripVertical,
  ImagePlus,
  X,
  Loader2,
} from "lucide-react";
import {
  createPartner,
  updatePartner,
  deletePartner,
} from "@/lib/actions/partners";
import { Field, inputCls, CrudModal, ConfirmDeleteDialog } from "./CrudHelpers";

type Partner = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function PartnerCrud({ items: initial }: { items: Partner[] }) {
  const [items, setItems] = useState(initial);
  const [mode, setMode] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  // Logo upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  React.useEffect(() => {
    setItems(initial);
  }, [initial]);

  function openAdd() {
    setEditing(null);
    setError(null);
    setLogoPreview(null);
    setLogoUrl(null);
    setUploadError(null);
    setMode("add");
  }
  function openEdit(p: Partner) {
    setEditing(p);
    setError(null);
    setLogoPreview(p.logoUrl);
    setLogoUrl(p.logoUrl);
    setUploadError(null);
    setMode("edit");
  }
  function close() {
    setMode(null);
    setEditing(null);
    setError(null);
    setLogoPreview(null);
    setLogoUrl(null);
    setUploadError(null);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Live preview
    setLogoPreview(URL.createObjectURL(file));
    setUploadError(null);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || json.error) {
        setUploadError(json.error ?? "Upload failed.");
        setLogoPreview(editing?.logoUrl ?? null);
        setLogoUrl(editing?.logoUrl ?? null);
      } else {
        setLogoUrl(json.url);
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
      setLogoPreview(editing?.logoUrl ?? null);
      setLogoUrl(editing?.logoUrl ?? null);
    } finally {
      setUploading(false);
      // reset so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleRemoveLogo() {
    setLogoPreview(null);
    setLogoUrl(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (uploading) return;
    const fd = new FormData(e.currentTarget);
    // Override logoUrl with the uploaded value
    fd.set("logoUrl", logoUrl ?? "");
    setError(null);
    startTransition(async () => {
      try {
        const res = editing
          ? await updatePartner(editing.id, {}, fd)
          : await createPartner({}, fd);
        if (res.error) setError(res.error);
        else close();
      } catch (e) { console.error(e); }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startDeleteTransition(async () => {
      try {
        await deletePartner(deleteTarget.id);
        setDeleteTarget(null);
      } catch (e) { console.error(e); }
    });
  }

  const active = items.filter((p) => p.active).length;

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Partners", value: items.length },
          { label: "Active", value: active },
          { label: "Inactive", value: items.length - active },
        ].map((s) => (
          <div
            key={s.label}
            className="glass-card rounded-xl border border-border p-4 text-center"
          >
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-colors text-sm font-semibold shadow-glow"
        >
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No partners yet. Click "Add Partner" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...items]
            .sort((a, b) => a.order - b.order)
            .map((p) => (
              <div
                key={p.id}
                className="glass-card rounded-xl border border-border p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  {/* Logo or placeholder */}
                  <div className="w-14 h-14 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                    {p.logoUrl ? (
                      <img
                        src={p.logoUrl}
                        alt={p.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-xl font-bold text-muted-foreground">
                        {p.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${p.active ? "text-leaf-bright bg-leaf/10 border-leaf/20" : "text-muted-foreground bg-muted border-border"}`}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </span>
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors text-muted-foreground hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {p.name}
                  </p>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-leaf-bright hover:underline mt-0.5 truncate"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      {p.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <GripVertical className="w-3 h-3" />
                  Order: {p.order}
                </div>
              </div>
            ))}
        </div>
      )}

      <CrudModal
        open={mode !== null}
        onClose={close}
        title={mode === "edit" ? "Edit Partner" : "Add Partner"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Partner Name" required>
            <input
              name="name"
              defaultValue={editing?.name ?? ""}
              required
              placeholder="e.g. University of Antwerp"
              className={inputCls}
            />
          </Field>

          {/* Logo upload */}
          <Field label="Logo">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
            />

            {logoPreview ? (
              <div className="flex items-center gap-4">
                <div className="w-20 h-16 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-leaf-bright/40 transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Uploading…
                      </>
                    ) : (
                      <>
                        <ImagePlus className="w-3 h-3" /> Change image
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    disabled={uploading}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted border border-border text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed border-border hover:border-leaf-bright/50 transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xs">Uploading…</span>
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-xs">Click to upload logo</span>
                    <span className="text-xs opacity-60">
                      PNG, JPG, SVG, WebP — max 2 MB
                    </span>
                  </>
                )}
              </button>
            )}

            {uploadError && (
              <p className="text-xs text-rose-400 mt-1">{uploadError}</p>
            )}
          </Field>

          <Field label="Website">
            <input
              name="website"
              type="url"
              defaultValue={editing?.website ?? ""}
              placeholder="https://example.com"
              className={inputCls}
            />
          </Field>

          <Field label="Display Order">
            <input
              name="order"
              type="number"
              min={0}
              defaultValue={editing?.order ?? 0}
              className={inputCls}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Lower numbers appear first in the carousel.
            </p>
          </Field>

          <Field label="Status">
            <select
              name="active"
              defaultValue={editing ? String(editing.active) : "true"}
              className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-leaf-bright/40"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </Field>

          {error && (
            <p className="text-sm text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2 border border-rose-500/20">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 rounded-lg bg-muted border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending || uploading}
              className="px-5 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-colors text-sm font-semibold shadow-glow disabled:opacity-50"
            >
              {pending
                ? "Saving…"
                : uploading
                  ? "Uploading…"
                  : mode === "edit"
                    ? "Save Changes"
                    : "Add Partner"}
            </button>
          </div>
        </form>
      </CrudModal>

      {/* Delete confirm */}
      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        label={deleteTarget?.name ?? "Partner"}
        pending={deletePending}
      />
    </>
  );
}
