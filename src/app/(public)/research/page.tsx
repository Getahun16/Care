import type { Metadata } from "next";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
import Research from "@/views/Research";

export const metadata: Metadata = {
  title: "Research & Pillars | Circular Coffee",
  description: "Three interconnected research areas forming the scientific backbone of the Circular Coffee project.",
};

export default async function ResearchPage() {
  const [projects, publications] = await Promise.all([
    prisma.researchProject.findMany({
      where: { status: { not: "PAUSED" } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.publication.findMany({
      where: { status: "PUBLISHED", pillar: { not: null } },
      orderBy: { year: "desc" },
    }),
  ]);
  return <Research projects={projects} publications={publications} />;
}
