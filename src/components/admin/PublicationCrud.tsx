"use client";
import React, { useRef, useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  FileUp,
  X,
  Loader2,
  Download,
} from "lucide-react";
import type { Publication } from "../../../generated/prisma/client";
import {
  createPublication,
  updatePublication,
  deletePublication,
} from "@/lib/actions/publications";
import {
  Field,
  inputCls,
  selectCls,
  textareaCls,
  CrudModal,
  ConfirmDeleteDialog,
  SubmitBtn,
} from "./CrudHelpers";

const STATUS_LABELS = {
  PUBLISHED: "Published",
  IN_REVIEW: "In Review",
  DRAFT: "Draft",
};
const TYPE_LABELS = {
  JOURNAL: "Journal",
  POLICY_BRIEF: "Policy Brief",
  MANUAL: "Manual",
  CONFERENCE: "Conference",
  REPORT: "Report",
};
const PILLAR_LABELS = {
  SOIL_HEALTH: "Soil Health",
  WASTE_VALORIZATION: "Waste Valorization",
  SOCIO_ECONOMIC: "Socio-Economic",
};
const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: "text-leaf-bright bg-leaf/10 border-leaf/20",
  IN_REVIEW: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  DRAFT: "text-muted-foreground bg-muted border-border",
};

export default function PublicationCrud({
  items: initial,
}: {
  items: Publication[];
}) {
  const [items, setItems] = useState(initial);
  const [mode, setMode] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Publication | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  // PDF upload state
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  React.useEffect(() => {
    setItems(initial);
  }, [initial]);

  function openAdd() {
    setEditing(null);
    setError(null);
    setPdfName(null);
    setPdfUrl(null);
    setUploadError(null);
    setMode("add");
  }
  function openEdit(p: Publication) {
    setEditing(p);
    setError(null);
    const existing = ((p as any).pdfUrl as string | null) ?? null;
    setPdfUrl(existing);
    setPdfName(existing ? (existing.split("/").pop() ?? "Uploaded PDF") : null);
    setUploadError(null);
    setMode("edit");
  }
  function close() {
    setMode(null);
    setEditing(null);
    setError(null);
    setPdfName(null);
    setPdfUrl(null);
    setUploadError(null);
  }

  async function handlePdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("PDF must be under 20 MB.");
      return;
    }
    setPdfName(file.name);
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload?folder=publications", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setUploadError(json.error ?? "Upload failed.");
        setPdfName(null);
        setPdfUrl(null);
      } else {
        setPdfUrl(json.url);
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
      setPdfName(null);
      setPdfUrl(null);
    } finally {
      setUploading(false);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  }

  function handleRemovePdf() {
    setPdfName(null);
    setPdfUrl(null);
    setUploadError(null);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (uploading) return;
    const fd = new FormData(e.currentTarget);
    fd.set("pdfUrl", pdfUrl ?? "");
    setError(null);
    startTransition(async () => {
      try {
        const res = editing
          ? await updatePublication(editing.id, {}, fd)
          : await createPublication({}, fd);
        if (res.error) setError(res.error);
        else close();
      } catch (e) { console.error(e); }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startDeleteTransition(async () => {
      try {
        await deletePublication(deleteTarget.id);
        setDeleteTarget(null);
      } catch (e) { console.error(e); }
    });
  }

  return (
    <>
      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-colors text-sm font-semibold shadow-glow"
        >
          <Plus className="w-4 h-4" /> Add Publication
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                Title
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Type
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                Pillar
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                Year
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((pub) => (
              <tr
                key={pub.id}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-foreground line-clamp-1">
                    {pub.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {pub.authors}
                  </p>
                </td>
                <td className="px-4 py-4 hidden md:table-cell text-muted-foreground">
                  {TYPE_LABELS[pub.type] ?? pub.type}
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className="tag-pill text-xs">
                    {pub.pillar
                      ? (PILLAR_LABELS[pub.pillar] ?? pub.pillar)
                      : "—"}
                  </span>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell text-muted-foreground">
                  {pub.year}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[pub.status] ?? STATUS_COLORS.DRAFT}`}
                  >
                    {STATUS_LABELS[pub.status] ?? pub.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {(pub as any).pdfUrl && (
                      <a
                        href={(pub as any).pdfUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="text-leaf-bright hover:text-leaf-bright/80 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => openEdit(pub)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(pub)}
                      className="text-muted-foreground hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-muted-foreground text-sm"
                >
                  No publications yet. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
          {items.length} publication{items.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <CrudModal
        open={mode !== null}
        onClose={close}
        title={editing ? "Edit Publication" : "Add Publication"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Title" required>
                <input
                  name="title"
                  defaultValue={editing?.title ?? ""}
                  required
                  className={inputCls}
                  placeholder="Publication title"
                />
              </Field>
            </div>
            <Field label="Authors" required>
              <input
                name="authors"
                defaultValue={editing?.authors ?? ""}
                required
                className={inputCls}
                placeholder="Author(s)"
              />
            </Field>
            <Field label="Year" required>
              <input
                name="year"
                type="number"
                defaultValue={editing?.year ?? new Date().getFullYear()}
                required
                className={inputCls}
                min={1990}
                max={2030}
              />
            </Field>
            <Field label="Type" required>
              <select
                name="type"
                defaultValue={editing?.type ?? "JOURNAL"}
                required
                className={selectCls}
              >
                {Object.entries(TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status" required>
              <select
                name="status"
                defaultValue={editing?.status ?? "DRAFT"}
                required
                className={selectCls}
              >
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Research Pillar">
                <select
                  name="pillar"
                  defaultValue={editing?.pillar ?? ""}
                  className={selectCls}
                >
                  <option value="">— None —</option>
                  {Object.entries(PILLAR_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="DOI">
              <input
                name="doi"
                defaultValue={editing?.doi ?? ""}
                className={inputCls}
                placeholder="10.xxxx/..."
              />
            </Field>
            <Field label="URL">
              <input
                name="url"
                defaultValue={editing?.url ?? ""}
                className={inputCls}
                placeholder="https://..."
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Abstract">
                <textarea
                  name="abstract"
                  defaultValue={editing?.abstract ?? ""}
                  rows={3}
                  className={textareaCls}
                  placeholder="Abstract text…"
                />
              </Field>
            </div>

            {/* PDF Upload */}
            <div className="sm:col-span-2">
              <Field label="PDF File">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handlePdfChange}
                />
                {pdfName ? (
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-muted">
                    <FileUp className="w-4 h-4 text-leaf-bright shrink-0" />
                    <span className="text-sm text-foreground truncate flex-1">
                      {pdfName}
                    </span>
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      disabled={uploading}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Replace"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      disabled={uploading}
                      className="text-muted-foreground hover:text-rose-400 transition-colors disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex flex-col items-center justify-center gap-2 py-5 rounded-lg border-2 border-dashed border-border hover:border-leaf-bright/50 transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-xs">Uploading…</span>
                      </>
                    ) : (
                      <>
                        <FileUp className="w-5 h-5" />
                        <span className="text-xs">Click to upload PDF</span>
                        <span className="text-xs opacity-60">
                          PDF only — max 20 MB
                        </span>
                      </>
                    )}
                  </button>
                )}
                {uploadError && (
                  <p className="text-xs text-rose-400 mt-1">{uploadError}</p>
                )}
              </Field>
            </div>
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={pending || uploading}
            className="w-full py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-leaf-bright transition-colors disabled:opacity-50"
          >
            {pending
              ? "Saving…"
              : uploading
                ? "Uploading…"
                : editing
                  ? "Save Changes"
                  : "Add Publication"}
          </button>
        </form>
      </CrudModal>

      {/* Delete confirm */}
      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        label={`"${deleteTarget?.title ?? ""}"`}
        pending={deletePending}
      />
    </>
  );
}
