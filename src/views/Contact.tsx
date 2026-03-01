"use client";

import { useState, useTransition } from "react";
import { Mail, MapPin, Send, CheckCircle, Loader2 } from "lucide-react";
import { submitContactForm } from "@/lib/actions/contact";
import { subscribeNewsletter } from "@/lib/actions/newsletter";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    subject: "",
    message: "",
    newsletter: false,
  });

  // Newsletter widget state
  const [nlEmail, setNlEmail] = useState("");
  const [nlState, setNlState] = useState<
    "idle" | "loading" | "success" | "exists" | "error"
  >("idle");
  const [nlError, setNlError] = useState<string | null>(null);
  const [nlPending, startNlTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const res = await submitContactForm(fd);
        if (res.error) setServerError(res.error);
        else setSubmitted(true);
      } catch (e) { console.error(e); }
    });
  };

  const handleNewsletterSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNlError(null);
    const fd = new FormData();
    fd.set("email", nlEmail);
    fd.set("source", "sidebar_widget");
    startNlTransition(async () => {
      try {
        const res = await subscribeNewsletter(fd);
        if (res.alreadySubscribed) {
          setNlState("exists");
        } else if (res.error) {
          setNlError(res.error);
          setNlState("error");
        } else {
          setNlState("success");
          setNlEmail("");
        }
      } catch (e) { console.error(e); }
    });
  };

  const contacts = [
    { label: "General Enquiries", email: "info@circularcoffee.org", icon: Mail },
    { label: "Research Collaboration", email: "research@circularcoffee.org", icon: Mail },
    { label: "Media & Communications", email: "media@circularcoffee.org", icon: Mail },
  ];

  return (
    <div className="min-h-screen pt-24">
      <section className="py-20 bg-charcoal-mid">
        <div className="container mx-auto">
          <span className="tag-pill mb-4 inline-block">Get In Touch</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Contact <span className="text-gradient-green">Us</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Whether you're a researcher, farmer, funder, or curious mind — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-16">
          {/* â”€â”€ Contact form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">Send a Message</h2>
            {submitted ? (
              <div className="glass-card rounded-2xl p-10 border border-border text-center">
                <CheckCircle className="w-14 h-14 text-leaf-bright mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">
                  Thank you for reaching out. We'll be in touch within 3 working days.
                  {form.newsletter && (
                    <span className="block mt-2 text-leaf-bright text-sm">
                      âœ“ You've been subscribed to our quarterly newsletter.
                    </span>
                  )}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setServerError(null);
                    setForm({ name: "", email: "", org: "", subject: "", message: "", newsletter: false });
                  }}
                  className="mt-6 text-sm text-leaf-bright hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: "name", label: "Full Name", type: "text", placeholder: "Dr. Jane Smith", required: false },
                  { key: "email", label: "Email Address", type: "email", placeholder: "jane@university.edu", required: true },
                  { key: "org", label: "Organisation (optional)", type: "text", placeholder: "University / NGO / Cooperative", required: false },
                  { key: "subject", label: "Subject", type: "text", placeholder: "Research collaboration / Media / General", required: false },
                ].map(({ key, label, type, placeholder, required }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                    <input
                      name={key}
                      type={type}
                      required={required}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form] as string}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-leaf/50"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Your message..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-leaf/50 resize-none"
                    required
                  />
                </div>

                {/* Newsletter checkbox */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={form.newsletter}
                    onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}
                    className="rounded border-border bg-muted w-4 h-4 accent-leaf shrink-0"
                  />
                  <label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer select-none">
                    Subscribe me to the CARES quarterly newsletter — research updates, field stories & events.
                  </label>
                </div>

                {serverError && (
                  <p className="text-sm text-rose-400 bg-rose-400/10 rounded-xl px-4 py-3">{serverError}</p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full py-3.5 rounded-xl font-semibold bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {pending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* â”€â”€ Info panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-border">
              <h3 className="font-serif font-bold text-lg mb-4">Institutional Contacts</h3>
              <div className="space-y-4">
                {contacts.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <c.icon className="w-4 h-4 mt-0.5 text-leaf-bright shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.label}</p>
                      <a href={`mailto:${c.email}`} className="text-sm text-muted-foreground hover:text-leaf-bright transition-colors">
                        {c.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-border">
              <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-leaf-bright" /> Locations
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">University of Antwerp (North)</p>
                  <p>Prinsstraat 13, 2000 Antwerp, Belgium</p>
                </div>
                <div className="section-divider" />
                <div>
                  <p className="font-semibold text-foreground">Addis Ababa University (South)</p>
                  <p>King George VI Street, Addis Ababa, Ethiopia</p>
                </div>
              </div>
            </div>

            {/* â”€â”€ Standalone newsletter widget â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="glass-card rounded-2xl p-6 border border-border">
              <h3 className="font-serif font-bold text-lg mb-2">Newsletter Signup</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get quarterly research updates, field stories, and event announcements direct to your inbox.
              </p>

              {nlState === "success" ? (
                <div className="flex items-center gap-2 text-leaf-bright text-sm">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Subscribed! Check your inbox for a welcome email.</span>
                </div>
              ) : nlState === "exists" ? (
                <div className="flex items-center gap-2 text-amber-400 text-sm">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>You're already subscribed — thanks for your support!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSignup} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={nlEmail}
                      onChange={(e) => setNlEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="flex-1 px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-leaf/50"
                    />
                    <button
                      type="submit"
                      disabled={nlPending}
                      className="px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-all text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      {nlPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      Subscribe
                    </button>
                  </div>
                  {nlError && (
                    <p className="text-xs text-rose-400">{nlError}</p>
                  )}
                  <p className="text-xs text-muted-foreground/60">
                    No spam, ever. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
