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

const news = [
  {
    date: "Nov 2024",
    title: "Biochar Trials Show 34% Soil Fertility Improvement in Kaffa Zone",
    tag: "Research",
  },
  {
    date: "Oct 2024",
    title: "Circular Coffee Team Presents at AAU International Symposium",
    tag: "Event",
  },
  {
    date: "Sep 2024",
    title: "New Cooperative Partnership Signed with Yirgacheffe Farmers Union",
    tag: "Partnership",
  },
];

export default function Index() {
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
              Turning Coffee Waste
              <br />
              <span className="text-gradient-green">Into Circular Value</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl animate-fade-in-up-delay-2">
              A north–south research partnership transforming Ethiopia's coffee
              by-products into soil health, economic opportunity, and
              sustainable livelihoods.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up-delay-2">
              <Link
                href="/project"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-all duration-200 shadow-glow"
              >
                Explore the Project <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold border border-border text-foreground hover:border-leaf-bright/50 transition-all duration-200"
              >
                View Research <BookOpen className="w-4 h-4" />
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

          {/* Partner logos */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
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
              Three Research Pillars
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
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
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
            <CounterStat target={1200} suffix="+" label="Farmers Reached" />
            <CounterStat target={34} suffix="%" label="Soil Fertility Gain" />
            <CounterStat target={8} suffix="" label="PhD Candidates" />
            <CounterStat target={42} suffix="%" label="Waste Reduction" />
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
              <h2 className="font-serif text-4xl font-bold">News & Updates</h2>
            </div>
            <Link
              href="/news"
              className="hidden md:flex items-center gap-1 text-leaf-bright hover:text-leaf-bright/80 font-medium transition-colors text-sm"
            >
              All news <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {news.map((item) => (
              <div
                key={item.title}
                className="glass-card rounded-xl p-5 border border-border flex items-start gap-5 hover:border-leaf-bright/30 transition-all duration-200 group cursor-pointer"
              >
                <div className="shrink-0">
                  <span className="text-xs text-muted-foreground font-sans">
                    {item.date}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="tag-pill text-xs">{item.tag}</span>
                  </div>
                  <h3 className="font-serif font-semibold text-base text-foreground group-hover:text-leaf-bright transition-colors">
                    {item.title}
                  </h3>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-leaf-bright transition-colors shrink-0 mt-1" />
              </div>
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
    </div>
  );
}
