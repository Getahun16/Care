"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  Recycle,
  Users,
  TrendingUp,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import PartnersCarousel from "@/components/PartnersCarousel";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { ImpactMetric } from "../../generated/prisma/client";

// Parse a value string like "1,200+", "34%", "8" into { target, suffix }
function parseMetricValue(v: string): { target: number; suffix: string } {
  const clean = v.replace(/,/g, "");
  const m = clean.match(/^(\d+(?:\.\d+)?)(.*)/)
  if (!m) return { target: 0, suffix: v };
  return { target: parseFloat(m[1]), suffix: m[2] };
}

const FALLBACK_METRICS = [
  { target: 1200, suffix: "+", label: "Farmers Reached" },
  { target: 34,   suffix: "%", label: "Soil Fertility Gain" },
  { target: 8,    suffix: "",  label: "PhD Candidates" },
  { target: 42,   suffix: "%", label: "Waste Reduction" },
];

type Partner = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  order: number;
  active: boolean;
};

const heroImage = "/assets/hero-coffee.jpg";
const soilImg = "/assets/soil-research.jpg";
const wasteImg = "/assets/waste-research.jpg";
const socioImg = "/assets/socio-economic.jpg";

function CounterStat({
  target,
  suffix,
  label,
}: {
  target: number;
  suffix: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="stat-counter">
        {count}
        {suffix}
      </div>
      <p className="text-muted-foreground text-sm mt-1 font-sans">{label}</p>
    </div>
  );
}

const pillars = [
  {
    icon: Leaf,
    title: "Soil Health",
    tag: "Pillar 1",
    description:
      "Composting coffee husk, biochar research, and soil fertility trials to restore Ethiopian farmlands.",
    image: soilImg,
    color: "gradient-green",
    link: "/research#soil",
  },
  {
    icon: Recycle,
    title: "Waste Valorization",
    tag: "Pillar 2",
    description:
      "Transforming coffee pulp and wastewater into valuable biorefinery products.",
    image: wasteImg,
    color: "gradient-coffee",
    link: "/research#waste",
  },
  {
    icon: Users,
    title: "Socio-Economic Impact",
    tag: "Pillar 3",
    description:
      "Empowering smallholder farmers, cooperatives, and promoting gender & youth inclusion.",
    image: socioImg,
    color: "gradient-green",
    link: "/research#socio",
  },
];

type NewsSnippet = {
  id: string;
  title: string;
  date: Date | string;
  type: string;
  imageUrl?: string | null;
  excerpt?: string | null;
};

const STATIC_NEWS = [
  {
    id: "1",
    date: "Nov 2024",
    title: "Biochar Trials Show 34% Soil Fertility Improvement in Kaffa Zone",
    tag: "Research",
    image: null,
    excerpt:
      "New data from our 18-month longitudinal trial demonstrates significant improvements in soil organic carbon.",
  },
  {
    id: "2",
    date: "Oct 2024",
    title: "Circular Coffee Team Presents at AAU International Symposium",
    tag: "Event",
    image: null,
    excerpt:
      "Dr. Tadesse and Prof. Alemu presented findings to 400+ researchers and development professionals.",
  },
  {
    id: "3",
    date: "Sep 2024",
    title: "New Cooperative Partnership Signed with Yirgacheffe Farmers Union",
    tag: "Partnership",
    image: null,
    excerpt:
      "A formal MOU was signed to implement circular processing practices across 12 washing stations.",
  },
];

function toNewsRow(item: NewsSnippet) {
  const d = item.date instanceof Date ? item.date : new Date(item.date);
  const dateLabel = isNaN(d.getTime())
    ? String(item.date)
    : d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  const tag = item.type === "EVENT" ? "Event" : "News";
  return {
    id: item.id,
    date: dateLabel,
    title: item.title,
    tag,
    image: item.imageUrl ?? null,
    excerpt: item.excerpt ?? null,
  };
}

export default function Index({
  partners = [],
  latestNews,
  impactMetrics,
}: {
  partners?: Partner[];
  latestNews?: NewsSnippet[];
  impactMetrics?: ImpactMetric[];
}) {
  const { t } = useLanguage();

  // Build the 4 stats: use DB data if available, else fall back to hardcoded
  const stats =
    impactMetrics && impactMetrics.length > 0
      ? impactMetrics.slice(0, 4).map((m) => ({
          label: m.label,
          ...parseMetricValue(m.value),
        }))
      : FALLBACK_METRICS;

  const news =
    latestNews && latestNews.length > 0
      ? latestNews.map(toNewsRow)
      : STATIC_NEWS;
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 to-transparent" />

        {/* Circular ring decoration */}
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] hidden xl:block">
          <div className="w-full h-full rounded-full border border-leaf-bright/10 animate-spin-slow" />
          <div
            className="absolute inset-8 rounded-full border border-coffee/20"
            style={{
              animationDuration: "30s",
              animation: "spin-slow 30s linear infinite reverse",
            }}
          />
          <div className="absolute inset-20 rounded-full border border-leaf-bright/15" />
        </div>

        <div className="container mx-auto relative z-10 pt-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-in-up">
              <span className="tag-pill">VLIR-UOS Cooperation</span>
              <span className="tag-pill tag-coffee">Ethiopia × Belgium</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in-up-delay">
              {t.home.heroTitle1} {t.home.heroTitle2}
              <br />
              <span className="text-gradient-green">CARES</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl animate-fade-in-up-delay-2">
              {t.home.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up-delay-2">
              <Link
                href="/project"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-all duration-200 shadow-glow"
              >
                {t.home.ctaExplore} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold border border-border text-foreground hover:border-leaf-bright/50 transition-all duration-200"
              >
                {t.home.ctaResearch} <BookOpen className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <a
          href="#mission"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-muted-foreground hover:text-leaf-bright transition-colors animate-bounce"
        >
          <ChevronDown className="w-6 h-6" />
        </a>
      </section>

      {/* Mission */}
      <section id="mission" className="py-24">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <span className="tag-pill mb-6 inline-block">Our Mission</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Waste → <span className="text-gradient-green">Value</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Ethiopia is the birthplace of coffee — yet the processing
              generates enormous quantities of husks, pulp, and wastewater that
              pollute rivers and degrade soils. The Circular Coffee project
              brings together researchers from{" "}
              <strong className="text-foreground">
                AAU (Addis Ababa University)
              </strong>{" "}
              and the{" "}
              <strong className="text-foreground">University of Antwerp</strong>{" "}
              to close this loop.
            </p>
            <div className="section-divider" />
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24 bg-charcoal-mid">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="tag-pill mb-4 inline-block">
              Research Framework
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              {t.home.pillarsTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <Link
                href={pillar.link}
                key={pillar.title}
                className="pillar-hover group"
              >
                <div className="rounded-2xl overflow-hidden shadow-card border border-border bg-card h-full flex flex-col">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="tag-pill text-xs">{pillar.tag}</span>
                    </div>
                    <div
                      className={`absolute bottom-4 left-4 w-10 h-10 rounded-full ${pillar.color} flex items-center justify-center`}
                    >
                      <pillar.icon className="w-5 h-5 text-foreground" />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-serif text-xl font-semibold mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                      {pillar.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-leaf-bright text-sm font-medium">
                      {t.pillars.learnMore} <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="tag-pill mb-4 inline-block">
              Measurable Change
            </span>
            <h2 className="font-serif text-4xl font-bold">
              Impact at a Glance
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((s) => (
              <CounterStat key={s.label} target={s.target} suffix={s.suffix} label={s.label} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/impact"
              className="inline-flex items-center gap-2 text-leaf-bright hover:text-leaf-bright/80 font-medium transition-colors"
            >
              View full impact report <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 bg-charcoal-mid">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="tag-pill mb-3 inline-block">Latest</span>
              <h2 className="font-serif text-4xl font-bold">
                {t.home.latestTitle}
              </h2>
            </div>
            <Link
              href="/news"
              className="hidden md:flex items-center gap-1 text-leaf-bright hover:text-leaf-bright/80 font-medium transition-colors text-sm"
            >
              All news <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/news/${encodeURIComponent(item.id)}`}
                className="glass-card rounded-2xl border border-border overflow-hidden pillar-hover group flex flex-col"
              >
                {/* Image / placeholder */}
                <div className="h-44 bg-gradient-to-br from-charcoal-mid to-charcoal overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full gradient-green flex items-center justify-center text-2xl shadow-glow">
                        {item.tag === "Event"
                          ? "📅"
                          : item.tag === "Partnership"
                            ? "🤝"
                            : "🔬"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="tag-pill text-xs">{item.tag}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-serif font-semibold text-base leading-snug mb-2 group-hover:text-leaf-bright transition-colors flex-1">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {item.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-leaf-bright pt-2 border-t border-border mt-auto">
                    {t.common.readMore} <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 md:hidden text-center">
            <Link
              href="/news"
              className="inline-flex items-center gap-1 text-leaf-bright font-medium text-sm"
            >
              All news <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center border-gradient shadow-elevated"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-leaf/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-coffee/20 blur-3xl" />
            <div className="relative z-10">
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Join the Circular Economy
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Whether you're a researcher, farmer, policy maker, or
                development professional — there's a role for you in this story.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-3.5 rounded-full font-semibold bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-all shadow-glow"
                >
                  Get Involved
                </Link>
                <Link
                  href="/library"
                  className="px-8 py-3.5 rounded-full font-semibold border border-border text-foreground hover:border-leaf-bright/50 transition-all"
                >
                  <TrendingUp className="inline w-4 h-4 mr-2" />
                  Publications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 border-t border-border bg-charcoal-mid">
        <div className="container mx-auto">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8 font-medium">
            {t.home.partnersTitle}
          </p>
          {partners.length > 0 ? (
            <PartnersCarousel partners={partners} />
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                "AAU",
                "University of Antwerp",
                "VLIR-UOS",
                "Belgian Development",
              ].map((p) => (
                <div
                  key={p}
                  className="glass-card px-6 py-3 rounded-xl text-sm font-semibold text-muted-foreground border border-border"
                >
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
