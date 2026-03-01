import { ArrowRight, Download, Target, GitBranch, CheckCircle2 } from "lucide-react";

const objectives = [
  "Develop biochar and compost from coffee husk to improve soil fertility in smallholder farms",
  "Valorize coffee pulp and wastewater through biorefinery and treatment technologies",
  "Assess socio-economic impacts on coffee farmers and cooperatives",
  "Build local capacity through PhD training and knowledge transfer",
  "Create actionable policy briefs for national agricultural bodies",
  "Establish gender-inclusive and youth-focused extension programs",
];

const workPackages = [
  { id: "WP1", title: "Project Coordination", color: "tag-coffee", lead: "UA Antwerp" },
  { id: "WP2", title: "Soil Health Research", color: "tag-pill", lead: "AAU & UA" },
  { id: "WP3", title: "Waste Valorization", color: "tag-pill", lead: "AAU" },
  { id: "WP4", title: "Socio-Economic Assessment", color: "tag-pill", lead: "AAU & IFPRI" },
  { id: "WP5", title: "Dissemination & Policy", color: "tag-coffee", lead: "All Partners" },
];

export default function TheProject() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="py-20 bg-charcoal-mid">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <span className="tag-pill mb-4 inline-block">About the Project</span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              The <span className="text-gradient-green">Circular Coffee</span> Project
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              A 4-year north–south cooperative research programme funded by VLIR-UOS, connecting the University of Antwerp and Addis Ababa University to close the coffee value chain loop in Ethiopia.
            </p>
          </div>
        </div>
      </section>

      {/* What is VLIR-UOS */}
      <section className="py-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="tag-pill mb-4 inline-block">VLIR-UOS Cooperation</span>
            <h2 className="font-serif text-3xl font-bold mb-5">What is VLIR-UOS?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              VLIR-UOS (Flemish Interuniversity Council – University Development Cooperation) supports partnerships between Flemish universities and institutions in the Global South. These "Institutional University Cooperation" projects build lasting academic and research capacity.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The Circular Coffee project is part of this framework, bringing together expertise in agronomy, food science, environmental engineering, and development economics.
            </p>
            <a href="#" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full text-sm font-semibold border border-border text-foreground hover:border-leaf-bright/50 transition-all">
              <Download className="w-4 h-4" /> Download Project Brief (PDF)
            </a>
          </div>

          {/* Problem statement */}
          <div className="glass-card rounded-2xl p-8 border border-border">
            <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive text-sm">!</span>
              The Problem
            </h3>
            <ul className="space-y-3 text-muted-foreground text-sm">
              {[
                "Ethiopia produces ~400,000 tons of coffee waste annually",
                "Coffee husk & pulp pollute rivers and degrade farm soils",
                "Smallholder farmers lose an estimated 30% of potential income",
                "No integrated circular economy model exists at farm level",
                "Limited access to research-backed composting and valorization techniques",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Circular Economy Model */}
      <section className="py-20 bg-charcoal-mid">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <span className="tag-pill mb-4 inline-block">Framework</span>
            <h2 className="font-serif text-4xl font-bold">Circular Economy Model</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { step: "01", label: "Coffee Harvest", icon: "☕" },
                { step: "02", label: "Processing & Waste Capture", icon: "♻" },
                { step: "03", label: "Biochar & Compost", icon: "🌿" },
                { step: "04", label: "Soil Enrichment → Better Yields", icon: "🌱" },
              ].map((item, i) => (
                <div key={item.step} className="relative">
                  <div className="glass-card rounded-xl p-5 text-center border border-border h-full">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <div className="text-xs text-leaf-bright font-mono mb-1">{item.step}</div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:flex absolute top-1/2 -right-2 z-10 -translate-y-1/2 w-4 h-4 rounded-full bg-leaf-bright items-center justify-center">
                      <ArrowRight className="w-2.5 h-2.5 text-background" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <span className="tag-pill mb-4 inline-block">SMART Objectives</span>
            <h2 className="font-serif text-3xl font-bold mb-6">
              <Target className="inline w-7 h-7 mr-2 text-leaf-bright" />
              Project Goals
            </h2>
            <ul className="space-y-4">
              {objectives.map((obj) => (
                <li key={obj} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-leaf-bright mt-0.5 shrink-0" />
                  <span className="text-muted-foreground text-sm leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Work Packages */}
          <div>
            <span className="tag-pill tag-coffee mb-4 inline-block">Structure</span>
            <h2 className="font-serif text-3xl font-bold mb-6">
              <GitBranch className="inline w-7 h-7 mr-2 text-coffee-light" />
              Work Packages
            </h2>
            <div className="space-y-3">
              {workPackages.map((wp) => (
                <div key={wp.id} className="glass-card rounded-xl p-4 border border-border flex items-center gap-4">
                  <span className={`${wp.color} font-mono text-xs shrink-0`}>{wp.id}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{wp.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Lead: {wp.lead}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
