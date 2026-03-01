"use client";

import { useState } from "react";
import { Leaf, Recycle, Users, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import type { ResearchProject, Publication } from "../../generated/prisma/client";

// ── Static fallback data ─────────────────────────────────────────────────────

const STATIC_TOPICS: Record<string, { title: string; desc: string }[]> = {
  SOIL_HEALTH: [
    { title: "Composting Coffee Husk", desc: "Field trials demonstrate that husk compost increases organic matter by up to 28%, reducing dependency on chemical fertilizers." },
    { title: "Biochar Research", desc: "Pyrolysis of coffee waste creates stable biochar that improves water retention and carbon sequestration in degraded soils." },
    { title: "Soil Fertility Trials", desc: "Longitudinal trials in Kaffa and Sidama zones monitor nitrogen, phosphorus, and microbiome changes under compost treatments." },
  ],
  WASTE_VALORIZATION: [
    { title: "Coffee Pulp Reuse", desc: "Anaerobic digestion of coffee pulp generates biogas for local energy use, with digestate as secondary fertilizer." },
    { title: "Wastewater Treatment", desc: "Constructed wetlands and bio-filters reduce BOD/COD in coffee wastewater to safe discharge standards." },
    { title: "Biorefinery Models", desc: "Integration of multiple valorization streams — cascading pulp → biogas → digestate → compost — maximizes resource efficiency." },
  ],
  SOCIO_ECONOMIC: [
    { title: "Smallholder Income", desc: "Participatory value chain analysis shows circular methods can increase net farm income by 18–26%." },
    { title: "Cooperative Integration", desc: "Working with Yirgacheffe and Kaffa cooperatives to institutionalize circular practices at processing station level." },
    { title: "Gender & Youth Inclusion", desc: "Dedicated gender-sensitive extension programming ensuring women and youth capture benefits from new value streams." },
  ],
};

const STATIC_PUBS: Record<string, string[]> = {
  SOIL_HEALTH: [
    "Tadesse et al. (2023) — Compost Amendment Effect on Soil Carbon in Ethiopian Coffee Farms",
    "Van der Berg et al. (2024) — Biochar Yield Optimization from Coffee Husk Pyrolysis",
  ],
  WASTE_VALORIZATION: [
    "Getachew et al. (2024) — Anaerobic Digestion of Coffee Pulp in Small-Scale Digesters",
    "Muijs & Lemma (2023) — Constructed Wetland Performance for Coffee Wastewater",
  ],
  SOCIO_ECONOMIC: [
    "Desta et al. (2024) — Income Effects of Circular Practices on Sidama Coffee Farmers",
    "Claeys et al. (2023) — Gender Dimensions of Coffee Value Chain Innovation in Ethiopia",
  ],
};

const LAYMAN: Record<string, string> = {
  SOIL_HEALTH: "Coffee leftovers — husks and pulp — are turned into natural fertilizer and charcoal. Mixed into farm soil, they help retain water and grow better crops. Farmers who use this method report healthier harvests.",
  WASTE_VALORIZATION: "After coffee beans are removed, huge amounts of fruit and water remain. Instead of dumping this into rivers, we use it to make cooking gas and clean the dirty water so it no longer harms fish or crops nearby.",
  SOCIO_ECONOMIC: "Small coffee farmers often earn very little because they throw away most of the coffee cherry. We teach them how to sell or use these 'wastes' — which means more money for the family and less pollution in their villages.",
};

function formatPub(p: Publication): string {
  const authorShort = p.authors.split(",")[0].trim() + (p.authors.includes(",") ? " et al." : "");
  return `${authorShort} (${p.year}) — ${p.title}`;
}

// ── Pillar config (decorative / structural) ──────────────────────────────────

const PILLARS = [
  {
    key: "SOIL_HEALTH",
    id: "soil",
    icon: Leaf,
    tag: "Pillar 1",
    title: "Soil Health",
    tagline: "Restoring Ethiopia's farmland through coffee waste valorization",
    image: "/assets/soil-research.jpg",
    accentColor: "text-leaf-bright",
    tagClass: "",
  },
  {
    key: "WASTE_VALORIZATION",
    id: "waste",
    icon: Recycle,
    tag: "Pillar 2",
    title: "Waste Valorization",
    tagline: "Transforming processing by-products into high-value resources",
    image: "/assets/waste-research.jpg",
    accentColor: "text-coffee-light",
    tagClass: "tag-coffee",
  },
  {
    key: "SOCIO_ECONOMIC",
    id: "socio",
    icon: Users,
    tag: "Pillar 3",
    title: "Socio-Economic Impact",
    tagline: "People at the centre of circular transformation",
    image: "/assets/socio-economic.jpg",
    accentColor: "text-leaf-bright",
    tagClass: "",
  },
] as const;

// ── PillarCard ────────────────────────────────────────────────────────────────

interface PillarCardProps {
  pillar: typeof PILLARS[number];
  topics: { title: string; desc: string }[];
  pubLines: string[];
}

function PillarCard({ pillar, topics, pubLines }: PillarCardProps) {
  const [showLayman, setShowLayman] = useState(false);
  const Icon = pillar.icon;

  return (
    <section id={pillar.id} className="py-20 scroll-mt-24">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left – content */}
          <div>
            <span className={`tag-pill mb-4 inline-block ${pillar.tagClass}`}>{pillar.tag}</span>
            <h2 className="font-serif text-4xl font-bold mb-2 flex items-center gap-2">
              <Icon className={`w-8 h-8 ${pillar.accentColor}`} />
              {pillar.title}
            </h2>
            <p className="text-muted-foreground mb-8">{pillar.tagline}</p>

            {/* Topics */}
            <div className="space-y-5">
              {topics.map((topic) => (
                <div key={topic.title} className="glass-card rounded-xl p-5 border border-border">
                  <h4 className="font-serif font-semibold text-base mb-2">{topic.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{topic.desc}</p>
                </div>
              ))}
            </div>

            {/* Plain-language toggle */}
            <button
              onClick={() => setShowLayman(!showLayman)}
              className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-leaf-bright transition-colors"
            >
              {showLayman ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showLayman ? "Hide" : "Show"} plain-language summary
            </button>

            {showLayman && (
              <div className="mt-3 p-4 rounded-xl bg-accent/30 border border-border text-sm text-muted-foreground leading-relaxed animate-fade-in">
                {LAYMAN[pillar.key]}
              </div>
            )}
          </div>

          {/* Right – image + publications */}
          <div>
            <div className="rounded-2xl overflow-hidden shadow-elevated mb-6">
              <img src={pillar.image} alt={pillar.title} className="w-full h-72 object-cover" />
            </div>

            {pubLines.length > 0 && (
              <div className="glass-card rounded-xl p-5 border border-border">
                <h4 className="font-serif font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {pillar.title}
                  <span className="opacity-60">— Related Publications</span>
                </h4>
                <ul className="space-y-2">
                  {pubLines.map((pub) => (
                    <li key={pub} className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
                      <span className="w-1.5 h-1.5 rounded-full bg-leaf-bright mt-2 shrink-0" />
                      <span className="group-hover:underline">{pub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-16">
        <div className="section-divider" />
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Research({
  projects,
  publications,
}: {
  projects?: ResearchProject[];
  publications?: Publication[];
}) {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="py-20 bg-charcoal-mid">
        <div className="container mx-auto">
          <span className="tag-pill mb-4 inline-block">Academic Research</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Research &amp; <span className="text-gradient-green">Pillars</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Three interconnected research areas forming the scientific backbone of the Circular Coffee project.
          </p>
          {/* Pillar nav anchors */}
          <div className="flex flex-wrap gap-3 mt-6">
            {PILLARS.map((p) => (
              <a key={p.id} href={`#${p.id}`} className={`tag-pill hover:bg-leaf/30 transition-colors ${p.tagClass}`}>
                {p.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Pillar sections */}
      {PILLARS.map((pillar) => {
        // Topics — DB projects for this pillar, fallback to static if none
        const dbTopics =
          projects && projects.filter((pr) => pr.pillar === pillar.key).length > 0
            ? projects
                .filter((pr) => pr.pillar === pillar.key)
                .map((pr) => ({ title: pr.title, desc: pr.description ?? "" }))
            : STATIC_TOPICS[pillar.key];

        // Publications — DB publications for this pillar, fallback to static if none
        const dbPubs =
          publications && publications.filter((pub) => pub.pillar === pillar.key).length > 0
            ? publications.filter((pub) => pub.pillar === pillar.key).map(formatPub)
            : STATIC_PUBS[pillar.key];

        return (
          <PillarCard
            key={pillar.key}
            pillar={pillar}
            topics={dbTopics}
            pubLines={dbPubs}
          />
        );
      })}
    </div>
  );
}
