"use client";
import React, { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, BarChart3, TrendingUp, Users, Leaf, TreePine } from "lucide-react";
import type { ImpactMetric } from "../../../generated/prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  createImpactMetric,
  updateImpactMetric,
  deleteImpactMetric,
} from "@/lib/actions/impact";
import {
  Field,
  inputCls,
  selectCls,
  textareaCls,
  CrudModal,
  ConfirmDeleteDialog,
  SubmitBtn,
} from "./CrudHelpers";

const PILLAR_LABELS: Record<string, string> = {
  SOIL_HEALTH: "Soil Health",
  WASTE_VALORIZATION: "Waste Valorization",
  SOCIO_ECONOMIC: "Socio-Economic",
};

const iconMap: Record<string, LucideIcon> = {
  "Farmers Reached": Users,
  "Tonnes Composted": Leaf,
  "Ha Under Circular Practice": TreePine,
  "Average Income Increase": TrendingUp,
};
const colorMap: Record<string, string> = {
  "Farmers Reached": "text-sky-400",
  "Tonnes Composted": "text-leaf-bright",
  "Ha Under Circular Practice": "text-amber-400",
  "Average Income Increase": "text-purple-400",
};

const pillarsProgress = [
  { name: "Soil Health", progress: 72, target: "Improve soil carbon in 1 000 ha by 2026" },
  { name: "Waste Valorization", progress: 58, target: "Valorize 500 t of coffee by-products annually" },
  { name: "Socio-Economic", progress: 65, target: "Reach 2 000 smallholders with training" },
];
const highlights = [
  { year: "2022", event: "Project launched in Jimma and Sidama zones" },
  { year: "2023", event: "First compost applied to 120 ha; 340 farmers trained" },
  { year: "2024", event: "Biochar field trials show 18% yield improvement" },
  { year: "2025", event: "Wastewater anaerobic digestion pilot operational" },
];

export default function ImpactCrud({ items: initial }: { items: ImpactMetric[] }) {
  const [items, setItems] = useState(initial);
  const [mode, setMode] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<ImpactMetric | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ImpactMetric | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  React.useEffect(() => { setItems(initial); }, [initial]);
  function openAdd() { setEditing(null); setError(null); setMode("add"); }
  function openEdit(m: ImpactMetric) { setEditing(m); setError(null); setMode("edit"); }
  function close() { setMode(null); setEditing(null); setError(null); }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      try {
        const res = editing
          ? await updateImpactMetric(editing.id, {}, fd)
          : await createImpactMetric({}, fd);
        if (res.error) setError(res.error);
        else close();
      } catch (e) { console.error(e); }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startDeleteTransition(async () => {
      try {
        await deleteImpactMetric(deleteTarget.id);
        setDeleteTarget(null);
      } catch (e) { console.error(e); }
    });
  }

  return (
    <>
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((m) => {
          const Icon = iconMap[m.label] ?? BarChart3;
          const color = colorMap[m.label] ?? "text-leaf-bright";
          return (
            <div key={m.id} className="glass-card rounded-xl border border-border p-5 space-y-3 relative group">
              <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
              {m.notes && <p className="text-xs text-muted-foreground">{m.notes}</p>}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(m)} className="text-muted-foreground hover:text-foreground transition-colors p-1"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteTarget(m)} className="text-muted-foreground hover:text-rose-400 transition-colors p-1"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          );
        })}
        {/* Add button card */}
        <button
          onClick={openAdd}
          className="glass-card rounded-xl border border-dashed border-border p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-leaf-bright hover:border-leaf-bright/40 transition-colors"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs font-medium">Add Metric</span>
        </button>
      </div>

      {/* Pillars progress */}
      <div className="glass-card rounded-xl border border-border p-5 space-y-5">
        <h2 className="font-semibold text-foreground">Pillar-Level Progress</h2>
        {pillarsProgress.map((p) => (
          <div key={p.name} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">{p.name}</span>
              <span className="text-muted-foreground">{p.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full gradient-green transition-all" style={{ width: `${p.progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{p.target}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="glass-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-foreground mb-4">Project Milestones</h2>
        <div className="relative pl-6 space-y-4">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
          {highlights.map((h, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[1.375rem] top-0.5 w-3 h-3 rounded-full bg-leaf-bright border-2 border-background" />
              <p className="text-xs text-muted-foreground">{h.year}</p>
              <p className="text-sm text-foreground">{h.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <CrudModal open={mode !== null} onClose={close} title={editing ? "Edit Impact Metric" : "Add Impact Metric"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Label" required>
              <input name="label" defaultValue={editing?.label ?? ""} required className={inputCls} placeholder="Farmers Reached" />
            </Field>
            <Field label="Value" required>
              <input name="value" defaultValue={editing?.value ?? ""} required className={inputCls} placeholder="1,240" />
            </Field>
            <Field label="Year" required>
              <input name="year" type="number" defaultValue={editing?.year ?? new Date().getFullYear()} required className={inputCls} min={2015} max={2035} />
            </Field>
            <Field label="Research Pillar">
              <select name="pillar" defaultValue={editing?.pillar ?? ""} className={selectCls}>
                <option value="">— None —</option>
                {Object.entries(PILLAR_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes">
                <textarea name="notes" defaultValue={editing?.notes ?? ""} rows={2} className={textareaCls} placeholder="Context note (optional)" />
              </Field>
            </div>
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <SubmitBtn pending={pending} label={editing ? "Save Changes" : "Add Metric"} />
        </form>
      </CrudModal>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        label={`"${deleteTarget?.label ?? ""}"`}
        pending={deletePending}
      />
    </>
  );
}
