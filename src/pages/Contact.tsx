"use client";

import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contacts = [
    {
      label: "General Enquiries",
      email: "info@circularcoffee.org",
      icon: Mail,
    },
    {
      label: "Research Collaboration",
      email: "research@circularcoffee.org",
      icon: Mail,
    },
    {
      label: "Media & Communications",
      email: "media@circularcoffee.org",
      icon: Mail,
    },
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
            Whether you're a researcher, farmer, funder, or curious mind — we'd
            love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-16">
          {/* Contact form */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">
              Send a Message
            </h2>
            {submitted ? (
              <div className="glass-card rounded-2xl p-10 border border-border text-center">
                <CheckCircle className="w-14 h-14 text-leaf-bright mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground">
                  Thank you for reaching out. We'll be in touch within 3 working
                  days.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: "",
                      email: "",
                      org: "",
                      subject: "",
                      message: "",
                    });
                  }}
                  className="mt-6 text-sm text-leaf-bright hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  {
                    key: "name",
                    label: "Full Name",
                    type: "text",
                    placeholder: "Dr. Jane Smith",
                  },
                  {
                    key: "email",
                    label: "Email Address",
                    type: "email",
                    placeholder: "jane@university.edu",
                  },
                  {
                    key: "org",
                    label: "Organisation (optional)",
                    type: "text",
                    placeholder: "University / NGO / Cooperative",
                  },
                  {
                    key: "subject",
                    label: "Subject",
                    type: "text",
                    placeholder: "Research collaboration / Media / General",
                  },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-leaf/50"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Your message..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-leaf/50 resize-none"
                    required
                  />
                </div>

                {/* Newsletter checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="newsletter"
                    className="rounded border-border bg-muted w-4 h-4 accent-leaf"
                  />
                  <label
                    htmlFor="newsletter"
                    className="text-sm text-muted-foreground"
                  >
                    Subscribe to our quarterly newsletter
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-semibold bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-all shadow-glow flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info panel */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-border">
              <h3 className="font-serif font-bold text-lg mb-4">
                Institutional Contacts
              </h3>
              <div className="space-y-4">
                {contacts.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <c.icon className="w-4 h-4 mt-0.5 text-leaf-bright shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {c.label}
                      </p>
                      <a
                        href={`mailto:${c.email}`}
                        className="text-sm text-muted-foreground hover:text-leaf-bright transition-colors"
                      >
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
                  <p className="font-semibold text-foreground">
                    University of Antwerp (North)
                  </p>
                  <p>Prinsstraat 13, 2000 Antwerp, Belgium</p>
                </div>
                <div className="section-divider" />
                <div>
                  <p className="font-semibold text-foreground">
                    Addis Ababa University (South)
                  </p>
                  <p>King George VI Street, Addis Ababa, Ethiopia</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-border">
              <h3 className="font-serif font-bold text-lg mb-4">
                Newsletter Signup
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get quarterly research updates, field stories, and event
                announcements.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-leaf/50"
                />
                <button className="px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-all text-sm font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
