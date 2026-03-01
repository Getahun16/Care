import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import ImpactCrud from "@/components/admin/ImpactCrud";

export const metadata: Metadata = { title: "Impact | Circular Coffee Admin" };

export default async function ImpactPage() {
  const metrics = await prisma.impactMetric.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Impact
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor project outcomes and key performance indicators.
        </p>
      </div>
      <ImpactCrud items={metrics} />
    </div>
  );
}
