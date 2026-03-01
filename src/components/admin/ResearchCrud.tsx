"use client";
import React, { useState, useTransition } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { ResearchProject } from "../../../generated/prisma/client";
import {
  createResearchProject,
  updateResearchProject,
  deleteResearchProject,
} from "@/lib/actions/research";
import {
  Field,
  inputCls,
  selectCls,
  textareaCls,
  CrudModal,
  ConfirmDeleteDialog,
  SubmitBtn,
} from "./CrudHelpers";

const pillarConfig = [
  { key: "SOIL_HEALTH", name: "Soil Health", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  { key: "WASTE_VALORIZATION", name: "Waste Valorization", color: "text-leaf-bright bg-leaf/10 border-leaf/20" },
  { key: "SOCIO_ECONOMIC", name: "Socio-Economic", color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
];
const PILLAR_NAMES: Record<string, string> = Object.fromEntries(pillarConfig.map((p) => [p.key, p.name]));

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "text-leaf-bright bg-leaf/10 border-leaf/20",
  COMPLETED: "text-muted-foreground bg-muted border-border",
  PAUSED: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

function toDateInput(d: Date | string | null | undefined): string {
  if (!d) return "";
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toISOString().split("T")[0];
}

export default function ResearchCrud({ items: initial }: { items: ResearchProject[] }) {
  const [items, setItems] = useState(initial);
  const [mode, setMode] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<ResearchProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResearchProject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  React.useEffect(() => { setItems(initial); }, [initial]);
  function openAdd() { setEditing(null); setError(null); setMode("add"); }
  function openEdit(p: ResearchProject) { setEditing(p); setError(null); setMode("edit"); }
  function close() { setMode(null); setEditing(null); setError(null); }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      try {
        const res = editing
          ? await updateResearchProject(editing.id, {}, fd)
          : await createResearchProject({}, fd);
        if (res.error) setError(res.error);
        else close();
      } catch (e) { console.error(e); }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startDeleteTransition(async () => {
      try {
        await deleteResearchProject(deleteTarget.id);
        setDeleteTarget(null);
      } catch (e) { console.error(e); }
    });
  }

  const pillarStats = pillarConfig.map((cfg) => {
    const pp = items.filter((p) => p.pillar === cfg.key);
    const lead = pp[0]?.lead ?? "—";
    return { ...cfg, projects: pp.length, active: pp.filter((p) => p.status === "ACTIVE").length, lead };
  });

  return (
    <>
      {/* Pillars overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {pillarStats.map((p) => (
          <div key={p.key} className="glass-card rounded-xl border border-border p-5 space-y-3">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${p.color}`}>{p.name}</span>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{p.projects}</p>
                <p className="text-xs text-muted-foreground">total projects</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-leaf-bright">{p.active} active</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Lead: {p.lead}</p>
          </div>
        ))}
      </div>

      {/* Add button */}
      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-colors text-sm font-semibold shadow-glow">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Project list */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border font-medium text-sm text-muted-foreground">All Projects</div>
        <ul>
          {items.map((proj) => (
            <li key={proj.id} className="px-5 py-4 border-b border-border/50 last:border-b-0 hover:bg-muted/20 transition-colors flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{proj.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{proj.lead ? `Lead: ${proj.lead}` : ""}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="tag-pill text-xs hidden sm:inline">{PILLAR_NAMES[proj.pillar] ?? proj.pillar}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[proj.status] ?? STATUS_COLORS.PAUSED}`}>
                  {proj.status.charAt(0) + proj.status.slice(1).toLowerCase()}
                </span>
                <button onClick={() => openEdit(proj)} className="text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteTarget(proj)} className="text-muted-foreground hover:text-rose-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="px-5 py-8 text-center text-muted-foreground text-sm">No research projects yet.</li>
          )}
        </ul>
      </div>

      {/* Modal */}
      <CrudModal open={mode !== null} onClose={close} title={editing ? "Edit Research Project" : "New Research Project"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Title" required>
                <input name="title" defaultValue={editing?.title ?? ""} required className={inputCls} placeholder="Project title" />
              </Field>
            </div>
            <Field label="Research Pillar" required>
              <select name="pillar" defaultValue={editing?.pillar ?? "SOIL_HEALTH"} required className={selectCls}>
                {pillarConfig.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
              </select>
            </Field>
            <Field label="Status" required>
              <select name="status" defaultValue={editing?.status ?? "ACTIVE"} required className={selectCls}>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </Field>
            <Field label="Lead Researcher">
              <input name="lead" defaultValue={editing?.lead ?? ""} className={inputCls} placeholder="Dr. Name" />
            </Field>
            <div className="hidden sm:block" />
            <Field label="Start Date">
              <input name="startDate" type="date" defaultValue={toDateInput(editing?.startDate)} className={inputCls} />
            </Field>
            <Field label="End Date">
              <input name="endDate" type="date" defaultValue={toDateInput(editing?.endDate)} className={inputCls} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea name="description" defaultValue={editing?.description ?? ""} rows={3} className={textareaCls} placeholder="Project description…" />
              </Field>
            </div>
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <SubmitBtn pending={pending} label={editing ? "Save Changes" : "Create Project"} />
        </form>
      </CrudModal>

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
