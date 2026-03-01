"use client";
import React, { useState, useTransition } from "react";
import {
  Search,
  Archive,
  Reply,
  Trash2,
  Mail,
  MailOpen,
  ArrowLeft,
  Calendar,
  Building2,
  X,
} from "lucide-react";
import type { ContactMessage } from "../../../generated/prisma/client";
import {
  markMessageRead,
  archiveMessage,
  deleteMessage,
} from "@/lib/actions/messages";
import { ConfirmDeleteDialog } from "./CrudHelpers";

function formatRelative(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatFull(date: Date): string {
  return new Date(date).toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-secondary/40 flex items-center justify-center text-leaf-bright font-bold text-sm shrink-0 select-none">
      {initials}
    </div>
  );
}

export default function MessageCrud({ items: initial }: { items: ContactMessage[] }) {
  const [items, setItems] = useState(initial);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [actionPending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  React.useEffect(() => {
    setItems(initial);
  }, [initial]);

  // Keep selected in sync with items (handles local optimistic updates)
  React.useEffect(() => {
    if (selected) {
      const updated = items.find((m) => m.id === selected.id);
      if (updated) setSelected(updated);
      else setSelected(null);
    }
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = items.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );
  const unread = items.filter((m) => !m.read).length;

  function openMessage(msg: ContactMessage) {
    setSelected(msg);
    // Auto-mark as read when opened
    if (!msg.read) {
      setItems((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)),
      );
      startTransition(async () => {
        try {
          await markMessageRead(msg.id, true);
        } catch (e) { console.error(e); }
      });
    }
  }

  function handleToggleRead(msg: ContactMessage) {
    const newRead = !msg.read;
    setItems((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: newRead } : m)),
    );
    startTransition(async () => {
      try {
        await markMessageRead(msg.id, newRead);
      } catch (e) { console.error(e); }
    });
  }

  function handleArchive(msg: ContactMessage) {
    setItems((prev) => prev.filter((m) => m.id !== msg.id));
    if (selected?.id === msg.id) setSelected(null);
    startTransition(async () => {
      try {
        await archiveMessage(msg.id);
      } catch (e) { console.error(e); }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startDeleteTransition(async () => {
      try {
        await deleteMessage(deleteTarget.id);
        setItems((prev) => prev.filter((m) => m.id !== deleteTarget.id));
        if (selected?.id === deleteTarget.id) setSelected(null);
        setDeleteTarget(null);
      } catch (e) { console.error(e); }
    });
  }

  return (
    <>
      {/* Header stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-leaf-bright" />
          {unread} unread
        </div>
        <span className="text-xs text-muted-foreground">{items.length} total messages</span>
      </div>

      {/* Search */}
      <div className="glass-card rounded-xl border border-border p-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelected(null);
          }}
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          placeholder="Search by name, subject, or email…"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Split pane */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="flex min-h-[480px]">

          {/* ── Left: message list ──────────────────────────────── */}
          <div
            className={`flex flex-col border-r border-border/50 ${
              selected ? "hidden lg:flex lg:w-80 xl:w-96 shrink-0" : "flex flex-1"
            }`}
          >
            <ul className="flex-1 overflow-y-auto divide-y divide-border/50">
              {filtered.map((msg) => (
                <li key={msg.id}>
                  <button
                    onClick={() => openMessage(msg)}
                    className={`w-full text-left px-4 py-3.5 transition-colors group ${
                      selected?.id === msg.id
                        ? "bg-leaf/10"
                        : !msg.read
                          ? "bg-leaf/5 hover:bg-leaf/10"
                          : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar name={msg.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-1">
                          <span
                            className={`text-sm truncate ${!msg.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}
                          >
                            {msg.name}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatRelative(msg.createdAt)}
                          </span>
                        </div>
                        <p
                          className={`text-xs truncate mt-0.5 ${!msg.read ? "font-medium text-foreground" : "text-muted-foreground"}`}
                        >
                          {msg.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {msg.body}
                        </p>
                      </div>
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-leaf-bright shrink-0 mt-1.5" />
                      )}
                    </div>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-5 py-12 text-center text-muted-foreground text-sm">
                  {search ? "No messages match your search." : "Inbox is empty."}
                </li>
              )}
            </ul>
            <div className="px-4 py-2.5 border-t border-border/50 text-xs text-muted-foreground bg-muted/10">
              {filtered.length} message{filtered.length !== 1 ? "s" : ""} · {unread} unread
            </div>
          </div>

          {/* ── Right: message detail ────────────────────────────── */}
          {selected ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Detail toolbar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50 bg-muted/10">
                <button
                  onClick={() => setSelected(null)}
                  className="lg:hidden flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mr-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-leaf-bright transition-colors"
                >
                  <Reply className="w-3 h-3" /> Reply
                </a>

                <button
                  onClick={() => handleToggleRead(selected)}
                  disabled={actionPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {selected.read ? (
                    <><Mail className="w-3 h-3" /> Mark unread</>
                  ) : (
                    <><MailOpen className="w-3 h-3" /> Mark read</>
                  )}
                </button>

                <button
                  onClick={() => handleArchive(selected)}
                  disabled={actionPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <Archive className="w-3 h-3" /> Archive
                </button>

                <button
                  onClick={() => setDeleteTarget(selected)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs text-muted-foreground hover:text-rose-400 transition-colors ml-auto"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>

              {/* Message content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Subject */}
                <h2 className="font-serif text-xl font-bold text-foreground leading-snug">
                  {selected.subject}
                </h2>

                {/* Sender card */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-leaf-bright font-bold text-base shrink-0 select-none">
                    {selected.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-semibold text-foreground text-sm">{selected.name}</p>
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-xs text-leaf-bright hover:underline block"
                    >
                      {selected.email}
                    </a>
                    {selected.organisation && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="w-3 h-3 shrink-0" />
                        {selected.organisation}
                      </p>
                    )}
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 shrink-0" />
                      {formatFull(selected.createdAt)}
                    </p>
                  </div>
                  {!selected.read && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-leaf/20 text-leaf-bright border border-leaf/30 shrink-0">
                      Unread
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="prose prose-sm prose-invert max-w-none">
                  {selected.body.split(/\n\n+/).map((para, i) => (
                    <p key={i} className="text-sm text-foreground leading-relaxed mb-4 last:mb-0 whitespace-pre-wrap">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Quick reply footer */}
              <div className="border-t border-border/50 px-5 py-3 bg-muted/10 flex items-center gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}&body=%0A%0A----%0AFrom: ${encodeURIComponent(selected.name)} %3C${encodeURIComponent(selected.email)}%3E`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-leaf-bright transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Reply to {selected.name.split(" ")[0]}
                </a>
                <span className="text-xs text-muted-foreground">
                  Opens your default email client
                </span>
              </div>
            </div>
          ) : (
            /* Empty state for detail pane */
            <div className="hidden lg:flex flex-1 items-center justify-center text-center p-10">
              <div>
                <Mail className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        label={`message from ${deleteTarget?.name ?? ""}`}
        pending={deletePending}
      />
    </>
  );
}