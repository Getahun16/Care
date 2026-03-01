"use client";

import { Quote } from "lucide-react";
import type { ImpactMetric } from "../../generated/prisma/client";
import dynamic from "next/dynamic";

const ProjectMap = dynamic(() => import("@/components/ProjectMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-border bg-muted animate-pulse" style={{ height: 480 }} />
  ),
});

type MetricDisplay = { value: string; label: string; sub: string };

const staticMetrics: MetricDisplay[] = [
  { value: "1,200+", label: "Farmers Reached", sub: "Across 3 zones" },
  { value: "34%", label: "Soil Fertility Gain", sub: "Compost trials avg." },
  { value: "42%", label: "Waste Reduction", sub: "Processing station level" },
  { value: "18–26%", label: "Income Increase", sub: "Net farm income" },
  { value: "8", label: "PhD Candidates", sub: "Currently enrolled" },
  { value: "12", label: "Publications", sub: "Journals & reports" },
];

const testimonials = [
  {
    quote: "Since using the compost from our processing station, my yield has grown. I no longer need to buy expensive chemical fertilizer.",
    name: "Birtukan Lemma",
    role: "Coffee Farmer, Kaffa Zone",
  },
  {
    quote: "The biogas system has changed how we process coffee. We save money on firewood and the smell from the pulp pond is gone.",
    name: "Girma Tesfaye",
    role: "Cooperative Manager, Yirgacheffe",
  },
];

const partners = ["Yirgacheffe Coffee Farmers Cooperative", "Kaffa Zone Agricultural Bureau", "Ethiopian Institute of Agricultural Research", "SNV Netherlands Development Organization", "IFPRI", "Ministry of Agriculture Ethiopia"];

export default function Impact({ metrics: dbMetrics }: { metrics?: ImpactMetric[] }) {
  const metrics: MetricDisplay[] =
    dbMetrics && dbMetrics.length > 0
      ? dbMetrics.map((m) => ({ value: m.value, label: m.label, sub: m.notes ?? "" }))
      : staticMetrics;
  return (
    <div className="min-h-screen pt-24">
      <section className="py-20 bg-charcoal-mid">
        <div className="container mx-auto">
          <span className="tag-pill mb-4 inline-block">Real-World Change</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Impact & <span className="text-gradient-green">Stakeholders</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Measurable outcomes on soil, waste, and livelihoods — and the partners making it possible.
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold">Impact Metrics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {metrics.map((m) => (
              <div key={m.label} className="glass-card rounded-2xl p-6 border border-border text-center pillar-hover">
                <div className="font-serif text-3xl font-bold text-leaf-bright mb-1">{m.value}</div>
                <p className="text-sm font-semibold text-foreground">{m.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-charcoal-mid">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <span className="tag-pill mb-4 inline-block">Voices from the Field</span>
            <h2 className="font-serif text-4xl font-bold">Testimonials</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-8 border border-border">
                <Quote className="w-8 h-8 text-leaf-bright/40 mb-4" />
                <p className="text-foreground text-base leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center text-foreground font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <span className="tag-pill mb-4 inline-block">Collaboration</span>
            <h2 className="font-serif text-4xl font-bold">Our Partners</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((p) => (
              <div key={p} className="glass-card rounded-xl px-6 py-3 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-leaf-bright/40 transition-all cursor-pointer">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-20 bg-charcoal-mid">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <span className="tag-pill mb-4 inline-block">Field Presence</span>
            <h2 className="font-serif text-4xl font-bold mb-3">
              Project <span className="text-gradient-green">Locations</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              From Ethiopian coffee farms and processing stations to partner universities in Belgium
              — explore where CARES research happens.
            </p>
          </div>
          <ProjectMap />
        </div>
      </section>
    </div>
  );
}
