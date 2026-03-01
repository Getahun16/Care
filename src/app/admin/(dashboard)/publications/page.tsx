import { Suspense } from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import PublicationCrud from "@/components/admin/PublicationCrud";
import PaginationNav from "@/components/ui/PaginationNav";

export const metadata: Metadata = {
  title: "Publications | Circular Coffee Admin",
};

const PAGE_SIZE = 10;

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [publications, total] = await Promise.all([
    prisma.publication.findMany({
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
      skip,
      take: PAGE_SIZE,
    }),
    prisma.publication.count(),
  ]);
  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Publications
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage research papers, policy briefs, and manuals.{" "}
          <span className="text-muted-foreground/60 font-normal">
            {total} total
          </span>
        </p>
      </div>
      <PublicationCrud items={publications} />
      <Suspense>
        <PaginationNav page={page} pageCount={pageCount} />
      </Suspense>
    </div>
  );
}
