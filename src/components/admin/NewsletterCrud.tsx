"use client";

import { useState, useTransition } from "react";
import {
  Mail,
  Trash2,
  UserX,
  Users,
  Send,
  Search,
  Plus,
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { NewsletterSubscriber } from "../../../generated/prisma/client";
import {
  unsubscribeEmail,
  deleteSubscriber,
  sendQuarterlyNewsletter,
} from "@/lib/actions/newsletter";

// ─── empty section template ───────────────────────────────────────────────────
const emptySection = () => ({ title: "", content: "", link: "" });

export default function NewsletterCrud({
  subscribers,
}: {
  subscribers: NewsletterSubscriber[];
}) {
  const [list, setList] = useState(subscribers);
  const [search, setSearch] = useState("");
  const [showBlast, setShowBlast] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [blastResult, setBlastResult] = useState<{
    sent?: number;
    errors?: number;
    error?: string;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Blast form state
  const [blastForm, setBlastForm] = useState({
    subject: "",
    headline: "",
    intro: "",
  });
  const [sections, setSections] = useState([emptySection()]);

  const filtered = list.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const active = list.filter((s) => s.active).length;
  const inactive = list.length - active;

  function handleUnsubscribe(id: string) {
    startTransition(async () => {
      try {
        await unsubscribeEmail(id);
        setList((prev) =>
          prev.map((s) => (s.id === id ? { ...s, active: false } : s))
        );
      } catch (e) { console.error(e); }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Permanently delete this subscriber?")) return;
    startTransition(async () => {
      try {
        await deleteSubscriber(id);
        setList((prev) => prev.filter((s) => s.id !== id));
      } catch (e) { console.error(e); }
    });
  }

  async function handleSendBlast(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setBlastResult(null);
    if (!blastForm.subject || !blastForm.headline || !blastForm.intro) {
      setFormError("Subject, headline, and intro are required.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    // Append extra sections beyond the first (react state)
    sections.forEach((s, i) => {
      fd.set(`section_title_${i}`, s.title);
      fd.set(`section_content_${i}`, s.content);
      fd.set(`section_link_${i}`, s.link);
    });
    startTransition(async () => {
      try {
        const result = await sendQuarterlyNewsletter(fd);
        setBlastResult(result);
        if (result.sent && !result.error) {
          setBlastForm({ subject: "", headline: "", intro: "" });
          setSections([emptySection()]);
        }
      } catch (e) { console.error(e); }
    });
  }

  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Subscribers", value: list.length, icon: Users },
          { label: "Active", value: active, icon: Mail },
          { label: "Unsubscribed", value: inactive, icon: UserX },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="glass-card rounded-2xl p-5 border border-border"
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-4 h-4 text-leaf-bright" />
              <span className="text-xs text-muted-foreground font-medium">
                {label}
              </span>
            </div>
            <p className="font-serif text-3xl font-bold text-foreground">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Search + Send button */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search subscribers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-leaf/50"
          />
        </div>
        <button
          onClick={() => setShowBlast((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-all text-sm font-semibold shadow-glow"
        >
          <Send className="w-4 h-4" />
          Send Newsletter
          {showBlast ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Send newsletter blast panel */}
      {showBlast && (
        <div className="glass-card rounded-2xl p-6 border border-border">
          <h3 className="font-serif font-bold text-lg mb-5 flex items-center gap-2 text-foreground">
            <Send className="w-4 h-4 text-leaf-bright" /> Send Quarterly
            Newsletter
          </h3>

          {blastResult?.sent !== undefined && !blastResult.error && (
            <div className="flex items-center gap-2 text-leaf-bright bg-leaf-bright/10 rounded-xl px-4 py-3 mb-4 text-sm">
              <CheckCircle className="w-4 h-4" />
              Sent to {blastResult.sent} subscriber
              {blastResult.sent !== 1 ? "s" : ""}
              {blastResult.errors && blastResult.errors > 0
                ? ` (${blastResult.errors} failed)`
                : ""}
              .
            </div>
          )}
          {(blastResult?.error || formError) && (
            <p className="text-sm text-rose-400 bg-rose-400/10 rounded-xl px-4 py-3 mb-4">
              {blastResult?.error ?? formError}
            </p>
          )}

          <form onSubmit={handleSendBlast} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "subject", label: "Email Subject", placeholder: "CARES Quarterly Update – Q1 2026" },
                { name: "headline", label: "Headline", placeholder: "New Research on Soil Health" },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                    {label}
                  </label>
                  <input
                    name={name}
                    value={blastForm[name as keyof typeof blastForm]}
                    onChange={(e) =>
                      setBlastForm({ ...blastForm, [name]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-leaf/50"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Intro Paragraph
              </label>
              <textarea
                name="intro"
                rows={3}
                value={blastForm.intro}
                onChange={(e) =>
                  setBlastForm({ ...blastForm, intro: e.target.value })
                }
                placeholder="Dear subscribers, here is what we've been working on…"
                className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-leaf/50 resize-none"
              />
            </div>

            {/* Dynamic sections */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Content Sections
              </p>
              {sections.map((s, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-muted/50 border border-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      Section {i + 1}
                    </span>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setSections((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="text-rose-400 hover:text-rose-300 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    name={`section_title_${i}`}
                    value={s.title}
                    onChange={(e) =>
                      setSections((prev) =>
                        prev.map((x, j) =>
                          j === i ? { ...x, title: e.target.value } : x
                        )
                      )
                    }
                    placeholder="Section title"
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-leaf/50"
                  />
                  <textarea
                    name={`section_content_${i}`}
                    rows={2}
                    value={s.content}
                    onChange={(e) =>
                      setSections((prev) =>
                        prev.map((x, j) =>
                          j === i ? { ...x, content: e.target.value } : x
                        )
                      )
                    }
                    placeholder="Section content…"
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-leaf/50 resize-none"
                  />
                  <input
                    name={`section_link_${i}`}
                    value={s.link}
                    onChange={(e) =>
                      setSections((prev) =>
                        prev.map((x, j) =>
                          j === i ? { ...x, link: e.target.value } : x
                        )
                      )
                    }
                    placeholder="Link URL (optional)"
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-leaf/50"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSections((prev) => [...prev, emptySection()])}
                className="flex items-center gap-2 text-xs text-leaf-bright hover:text-leaf-bright/80 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add section
              </button>
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-3">
                Will be sent to{" "}
                <strong className="text-foreground">{active}</strong> active
                subscriber{active !== 1 ? "s" : ""}.
              </p>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-all text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-glow"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isPending ? "Sending…" : "Send to All Active"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Subscriber table */}
      <div className="glass-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Email", "Name", "Source", "Status", "Joined", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {s.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                        {(s.source ?? "—").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          s.active
                            ? "bg-leaf-bright/15 text-leaf-bright"
                            : "bg-rose-400/15 text-rose-400"
                        }`}
                      >
                        {s.active ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(s.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {s.active && (
                          <button
                            onClick={() => handleUnsubscribe(s.id)}
                            disabled={isPending}
                            title="Unsubscribe"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-400 hover:bg-muted transition-colors"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={isPending}
                          title="Delete"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-muted transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
