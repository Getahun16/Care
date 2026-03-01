import { Suspense } from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import TeamCrud from "@/components/admin/TeamCrud";
import PaginationNav from "@/components/ui/PaginationNav";

export const metadata: Metadata = { title: "Team | Circular Coffee Admin" };

const PAGE_SIZE = 10;

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [members, total] = await Promise.all([
    prisma.teamMember.findMany({
      orderBy: { name: "asc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.teamMember.count(),
  ]);
  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Team
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage team members across all partner institutions.{" "}
          <span className="text-muted-foreground/60 font-normal">
            {total} total
          </span>
        </p>
      </div>
      <TeamCrud items={members} />
      <Suspense>
        <PaginationNav page={page} pageCount={pageCount} />
      </Suspense>
    </div>
  );
}
