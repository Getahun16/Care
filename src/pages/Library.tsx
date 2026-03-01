"use client";

import { useState } from "react";
import {
  Search,
  Download,
  ExternalLink,
  FileText,
  BookOpen,
  FileBarChart,
  Presentation,
} from "lucide-react";

type PubType = "All" | "Journal" | "Policy Brief" | "Manual" | "Poster";
type Pillar = "All" | "Soil Health" | "Waste Valorization" | "Socio-Economic";

const publications = [
  {
    title: "Compost Amendment Effect on Soil Carbon in Ethiopian Coffee Farms",
    authors: "Tadesse S., De Moor J., Alemu T.",
    year: 2023,
    type: "Journal" as PubType,
    pillar: "Soil Health" as Pillar,
    doi: "10.1234/soil.2023",
    journal: "Agriculture, Ecosystems & Environment",
  },
  {
    title: "Biochar Yield Optimization from Coffee Husk Pyrolysis",
    authors: "Claeys T., Verheyden L.",
    year: 2024,
    type: "Journal" as PubType,
    pillar: "Soil Health" as Pillar,
    doi: "10.1234/bio.2024",
    journal: "Bioresource Technology",
  },
  {
    title: "Anaerobic Digestion of Coffee Pulp in Small-Scale Digesters",
    authors: "Getachew R., De Moor J.",
    year: 2024,
    type: "Journal" as PubType,
    pillar: "Waste Valorization" as Pillar,
    doi: "10.1234/dig.2024",
    journal: "Waste Management",
  },
  {
    title: "Constructed Wetland Performance for Coffee Wastewater",
    authors: "Muijs K., Lemma B.",
    year: 2023,
    type: "Journal" as PubType,
    pillar: "Waste Valorization" as Pillar,
    doi: "10.1234/wet.2023",
    journal: "Water Research",
  },
  {
    title: "Income Effects of Circular Practices on Sidama Coffee Farmers",
    authors: "Desta A., Bekele M.",
    year: 2024,
    type: "Journal" as PubType,
    pillar: "Socio-Economic" as Pillar,
    doi: "10.1234/inc.2024",
    journal: "World Development",
  },
  {
    title: "Circular Coffee: A Policy Framework for Ethiopian Cooperatives",
    authors: "Circular Coffee Project Team",
    year: 2023,
    type: "Policy Brief" as PubType,
    pillar: "Socio-Economic" as Pillar,
    doi: null,
    journal: "VLIR-UOS Publication",
  },
  {
    title: "Farmer's Guide to Coffee Husk Composting",
    authors: "Alemu T., Tadesse S.",
    year: 2024,
    type: "Manual" as PubType,
    pillar: "Soil Health" as Pillar,
    doi: null,
    journal: "Extension Manual",
  },
  {
    title: "Gender Dimensions of Coffee Value Chain Innovation in Ethiopia",
    authors: "Claeys T., Desta A.",
    year: 2023,
    type: "Journal" as PubType,
    pillar: "Socio-Economic" as Pillar,
    doi: "10.1234/gen.2023",
    journal: "Gender, Place & Culture",
  },
];

const typeIcon = {
  Journal: BookOpen,
  "Policy Brief": FileBarChart,
  Manual: FileText,
  Poster: Presentation,
};

export default function Library() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PubType>("All");
  const [pillarFilter, setPillarFilter] = useState<Pillar>("All");
  const [yearFilter, setYearFilter] = useState("All");

  const filtered = publications.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.authors.toLowerCase().includes(q);
    const matchesType = typeFilter === "All" || p.type === typeFilter;
    const matchesPillar = pillarFilter === "All" || p.pillar === pillarFilter;
    const matchesYear =
      yearFilter === "All" || p.year.toString() === yearFilter;
    return matchesQuery && matchesType && matchesPillar && matchesYear;
  });

  const types: PubType[] = [
    "All",
    "Journal",
    "Policy Brief",
    "Manual",
    "Poster",
  ];
  const pillars: Pillar[] = [
    "All",
    "Soil Health",
    "Waste Valorization",
    "Socio-Economic",
  ];

  return (
    <div className="min-h-screen pt-24">
      <section className="py-20 bg-charcoal-mid">
        <div className="container mx-auto">
          <span className="tag-pill mb-4 inline-block">Publications</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Research <span className="text-gradient-green">Library</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse, filter, and download all research outputs from the Circular
            Coffee project.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          {/* Search & Filters */}
          <div className="glass-card rounded-2xl p-6 border border-border mb-8">
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-leaf/50"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">
                  Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors ${typeFilter === t ? "bg-leaf text-secondary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">
                  Research Pillar
                </p>
                <div className="flex flex-wrap gap-2">
                  {pillars.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPillarFilter(p)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors ${pillarFilter === p ? "bg-leaf text-secondary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">
                  Year
                </p>
                <div className="flex flex-wrap gap-2">
                  {["All", "2024", "2023"].map((y) => (
                    <button
                      key={y}
                      onClick={() => setYearFilter(y)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors ${yearFilter === y ? "bg-coffee text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <p className="text-sm text-muted-foreground mb-5">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-4">
            {filtered.map((pub) => {
              const Icon = typeIcon[pub.type] || FileText;
              return (
                <div
                  key={pub.title}
                  className="glass-card rounded-xl p-5 border border-border hover:border-leaf-bright/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-leaf-bright" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="tag-pill text-xs">{pub.pillar}</span>
                        <span className="tag-pill tag-coffee text-xs">
                          {pub.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {pub.year}
                        </span>
                      </div>
                      <h3 className="font-serif font-semibold text-base text-foreground group-hover:text-leaf-bright transition-colors mb-1">
                        {pub.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {pub.authors}
                      </p>
                      <p className="text-xs text-muted-foreground/70 italic mt-0.5">
                        {pub.journal}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-leaf-bright"
                          title="Open DOI"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-leaf-bright"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No publications match your filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
