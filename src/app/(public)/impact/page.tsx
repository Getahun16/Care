import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import Impact from "@/views/Impact";

export const metadata: Metadata = {
  title: "Impact & Stakeholders | Circular Coffee",
  description: "Measurable outcomes on soil, waste, and livelihoods — and the partners making it possible.",
};

export default async function ImpactPage() {
  const metrics = await prisma.impactMetric.findMany({
    orderBy: { createdAt: "asc" },
  });
  return <Impact metrics={metrics} />;
}
