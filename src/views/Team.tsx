import { Linkedin, Globe } from "lucide-react";
import type { TeamMember as DbMember } from "../../generated/prisma/client";

interface TeamMember {
  name: string;
  title: string;
  institution: string;
  focus: string;
  role: "PI" | "Co-Supervisor" | "PhD" | "Research Assistant";
  initials: string;
  color: string;
  imageUrl?: string | null;
}

const COLORS = ["gradient-green", "gradient-coffee"];

function deriveCategory(role: string): TeamMember["role"] {
  const r = role.toLowerCase();
  if (r.includes("principal")) return "PI";
  if (r.includes("co-supervisor") || r.includes("co supervisor"))
    return "Co-Supervisor";
  if (r.includes("phd") || r.includes("candidate") || r.includes("researcher"))
    return "PhD";
  return "Research Assistant";
}

function dbToMember(m: DbMember, idx: number): TeamMember {
  const initials = m.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
  return {
    name: m.name,
    title: m.role,
    institution: m.institution,
    focus: m.bio ?? m.role,
    role: deriveCategory(m.role),
    initials,
    color: COLORS[idx % COLORS.length],
    imageUrl: m.imageUrl ?? null,
  };
}

const staticTeam: TeamMember[] = [
  {
    name: "Prof. Dr. Jan De Moor",
    title: "Principal Investigator (North)",
    institution: "University of Antwerp",
    focus: "Circular Bioeconomy & Waste Valorization",
    role: "PI",
    initials: "JD",
    color: "gradient-green",
  },
  {
    name: "Prof. Dr. Tigist Alemu",
    title: "Principal Investigator (South)",
    institution: "Addis Ababa University",
    focus: "Soil Science & Agroecology",
    role: "PI",
    initials: "TA",
    color: "gradient-coffee",
  },
  {
    name: "Dr. Lena Verheyden",
    title: "Co-Supervisor",
    institution: "University of Antwerp",
    focus: "Environmental Engineering & Biorefinery",
    role: "Co-Supervisor",
    initials: "LV",
    color: "gradient-green",
  },
  {
    name: "Dr. Mulugeta Bekele",
    title: "Co-Supervisor",
    institution: "Hawassa University",
    focus: "Agricultural Economics",
    role: "Co-Supervisor",
    initials: "MB",
    color: "gradient-coffee",
  },
  {
    name: "Selamawit Tadesse",
    title: "PhD Candidate",
    institution: "AAU / UA Antwerp",
    focus: "Coffee Husk Compost Trials",
    role: "PhD",
    initials: "ST",
    color: "gradient-green",
  },
  {
    name: "Robel Getachew",
    title: "PhD Candidate",
    institution: "Addis Ababa University",
    focus: "Anaerobic Digestion Systems",
    role: "PhD",
    initials: "RG",
    color: "gradient-coffee",
  },
  {
    name: "Amina Desta",
    title: "PhD Candidate",
    institution: "AAU / IFPRI",
    focus: "Gender & Value Chain Analysis",
    role: "PhD",
    initials: "AD",
    color: "gradient-green",
  },
  {
    name: "Thomas Claeys",
    title: "PhD Candidate",
    institution: "University of Antwerp",
    focus: "Biochar Characterization",
    role: "PhD",
    initials: "TC",
    color: "gradient-coffee",
  },
];

const roleOrder = ["PI", "Co-Supervisor", "PhD", "Research Assistant"] as const;
const roleLabels = {
  PI: "Principal Investigators",
  "Co-Supervisor": "Co-Supervisors",
  PhD: "PhD Candidates",
  "Research Assistant": "Research Assistants",
};

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-border pillar-hover flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 shadow-glow border-2 border-border">
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full ${member.color} flex items-center justify-center text-foreground font-serif font-bold text-xl`}
            >
              {member.initials}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-serif font-semibold text-base leading-tight">
            {member.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{member.title}</p>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-2">
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {member.institution}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {member.focus}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="tag-pill text-xs">{member.role}</span>
        <button className="text-muted-foreground hover:text-leaf-bright transition-colors">
          <Linkedin className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function Team({ members: dbMembers }: { members?: DbMember[] }) {
  const team: TeamMember[] =
    dbMembers && dbMembers.length > 0 ? dbMembers.map(dbToMember) : staticTeam;
  return (
    <div className="min-h-screen pt-24">
      <section className="py-20 bg-charcoal-mid">
        <div className="container mx-auto">
          <span className="tag-pill mb-4 inline-block">The People</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Our <span className="text-gradient-green">Research Team</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A multidisciplinary team spanning soil science, environmental
            engineering, economics, and gender studies from Ethiopia and
            Belgium.
          </p>
        </div>
      </section>

      <div className="py-20">
        <div className="container mx-auto space-y-16">
          {roleOrder.map((role) => {
            const members = team.filter((m) => m.role === role);
            if (!members.length) return null;
            return (
              <div key={role}>
                <h2 className="font-serif text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="w-8 h-1 rounded-full bg-leaf inline-block" />
                  {roleLabels[role]}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {members.map((m) => (
                    <MemberCard key={m.name} member={m} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
