import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import PartnerCrud from "@/components/admin/PartnerCrud";

export const metadata: Metadata = { title: "Partners | Circular Coffee Admin" };

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Partners
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage partner organisations displayed in the homepage carousel.
        </p>
      </div>
      <PartnerCrud items={partners} />
    </div>
  );
}
