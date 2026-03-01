import { PrismaClient } from "../generated/prisma/client";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin user ────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@circularcoffee.org" },
    update: { passwordHash },
    create: {
      email: "admin@circularcoffee.org",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ── Team members ──────────────────────────────────────────────────────────
  const team = [
    { name: "Dr. Elias Tadesse", role: "Principal Investigator", institution: "Jimma University", country: "Ethiopia", pillar: "SOIL_HEALTH" as const },
    { name: "Prof. Jonas Van der Berg", role: "Senior Researcher", institution: "Ghent University", country: "Belgium", pillar: "WASTE_VALORIZATION" as const },
    { name: "Dr. Fatuma Mekonnen", role: "Social Scientist", institution: "Addis Ababa University", country: "Ethiopia", pillar: "SOCIO_ECONOMIC" as const },
    { name: "Ana De Smedt", role: "PhD Researcher", institution: "Ghent University", country: "Belgium", pillar: "SOCIO_ECONOMIC" as const },
    { name: "Dr. Mohammed Ahmed", role: "Environmental Engineer", institution: "Addis Ababa University", country: "Ethiopia", pillar: "WASTE_VALORIZATION" as const, active: false },
    { name: "Lena Fischer", role: "MSc Student", institution: "KU Leuven", country: "Belgium", pillar: "SOIL_HEALTH" as const },
  ];
  for (const m of team) {
    await prisma.teamMember.upsert({
      where: { id: m.name },
      update: m,
      create: { ...m, id: m.name, active: m.active ?? true },
    });
  }
  console.log(`✅ Team members: ${team.length}`);

  // ── Publications ──────────────────────────────────────────────────────────
  const pubs = [
    { title: "Compost Amendment Effect on Soil Carbon in Ethiopian Coffee Farms", authors: "Tadesse et al.", year: 2023, type: "JOURNAL" as const, pillar: "SOIL_HEALTH" as const, status: "PUBLISHED" as const },
    { title: "Biochar Yield Optimization from Coffee Husk Pyrolysis", authors: "Van der Berg et al.", year: 2024, type: "JOURNAL" as const, pillar: "SOIL_HEALTH" as const, status: "PUBLISHED" as const },
    { title: "Wastewater Valorization in Ethiopian Coffee Processing", authors: "Ahmed et al.", year: 2024, type: "JOURNAL" as const, pillar: "WASTE_VALORIZATION" as const, status: "IN_REVIEW" as const },
    { title: "Gender Inclusion in Smallholder Coffee Cooperatives", authors: "Mekonnen & De Smedt", year: 2024, type: "POLICY_BRIEF" as const, pillar: "SOCIO_ECONOMIC" as const, status: "PUBLISHED" as const },
    { title: "Circular Economy Framework for Coffee By-Products", authors: "Circular Coffee Team", year: 2023, type: "MANUAL" as const, status: "PUBLISHED" as const },
  ];
  for (const p of pubs) {
    await prisma.publication.upsert({
      where: { id: p.title },
      update: p,
      create: { ...p, id: p.title },
    });
  }
  console.log(`✅ Publications: ${pubs.length}`);

  // ── Research projects ─────────────────────────────────────────────────────
  const projects = [
    { title: "Biochar from coffee husks: field trial Phase 2", pillar: "SOIL_HEALTH" as const, status: "ACTIVE" as const, lead: "Dr. Elias Tadesse" },
    { title: "Anaerobic digestion of pulping wastewater", pillar: "WASTE_VALORIZATION" as const, status: "ACTIVE" as const, lead: "Dr. Mohammed Ahmed" },
    { title: "Gender & income impact survey — Sidama zone", pillar: "SOCIO_ECONOMIC" as const, status: "ACTIVE" as const, lead: "Dr. Fatuma Mekonnen" },
    { title: "Compost maturity indicators for smallholders", pillar: "SOIL_HEALTH" as const, status: "COMPLETED" as const, lead: "Dr. Elias Tadesse" },
  ];
  for (const rp of projects) {
    await prisma.researchProject.upsert({
      where: { id: rp.title },
      update: rp,
      create: { ...rp, id: rp.title },
    });
  }
  console.log(`✅ Research projects: ${projects.length}`);

  // ── News & events ─────────────────────────────────────────────────────────
  const news = [
    { title: "Field visit to Sidama coffee cooperatives", type: "EVENT" as const, date: new Date("2025-03-15"), status: "UPCOMING" as const, excerpt: "Joint field visit by Ethiopian and Belgian teams to assess biochar trial outcomes." },
    { title: "New publication: Biochar yield optimization", type: "NEWS" as const, date: new Date("2025-02-28"), status: "PUBLISHED" as const, excerpt: "Our latest journal article has been accepted in the Journal of Cleaner Production." },
    { title: "Annual project consortium meeting — Ghent", type: "EVENT" as const, date: new Date("2025-02-10"), status: "PAST" as const, excerpt: "Annual review of progress across all three research pillars." },
    { title: "Circular Coffee featured in VLIR-UOS newsletter", type: "NEWS" as const, date: new Date("2025-01-20"), status: "PUBLISHED" as const, excerpt: "The project was highlighted as a model for North-South research cooperation." },
    { title: "Training workshop on composting — Jimma", type: "EVENT" as const, date: new Date("2024-11-05"), status: "PAST" as const, excerpt: "Hands-on training for 40 smallholder farmers on composting techniques." },
  ];
  for (const n of news) {
    await prisma.newsEvent.upsert({
      where: { id: n.title },
      update: { ...n },
      create: { ...n, id: n.title },
    });
  }
  console.log(`✅ News & events: ${news.length}`);

  // ── Impact metrics ────────────────────────────────────────────────────────
  const metrics = [
    { label: "Farmers Reached", value: "1240", year: 2025 },
    { label: "Tonnes Composted", value: "340", pillar: "SOIL_HEALTH" as const, year: 2025 },
    { label: "Ha Under Circular Practice", value: "680", year: 2025 },
    { label: "Average Income Increase", value: "22%", pillar: "SOCIO_ECONOMIC" as const, year: 2025 },
  ];
  for (const m of metrics) {
    await prisma.impactMetric.upsert({
      where: { id: m.label },
      update: m,
      create: { ...m, id: m.label },
    });
  }
  console.log(`✅ Impact metrics: ${metrics.length}`);

  // ── Contact messages ──────────────────────────────────────────────────────
  await prisma.contactMessage.createMany({
    skipDuplicates: true,
    data: [
      { id: "msg-1", name: "Amara Girma", email: "amara.girma@gmail.com", subject: "Collaboration inquiry", body: "I am a PhD student interested in joining the Circular Coffee project...", read: false },
      { id: "msg-2", name: "Sophie Claes", email: "s.claes@ugent.be", subject: "Request for composting data sets", body: "I would like to access the composting trial data for a comparative study...", read: false },
      { id: "msg-3", name: "Yusuf Abdi", email: "yusuf.abdi@agri.gov.et", subject: "Policy brief distribution", body: "We would like to distribute your latest policy brief to regional offices...", read: true },
    ],
  });
  console.log("✅ Contact messages: 3");

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
