import { Suspense } from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import NewsCrud from "@/components/admin/NewsCrud";
import PaginationNav from "@/components/ui/PaginationNav";

export const metadata: Metadata = {
  title: "News & Events | Circular Coffee Admin",
};

const PAGE_SIZE = 10;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [items, total] = await Promise.all([
    prisma.newsEvent.findMany({ orderBy: { date: "desc" }, skip, take: PAGE_SIZE }),
    prisma.newsEvent.count(),
  ]);
  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          News &amp; Events
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage news articles and upcoming events.{" "}
          <span className="text-muted-foreground/60 font-normal">
            {total} total
          </span>
        </p>
      </div>
      <NewsCrud items={items} />
      <Suspense>
        <PaginationNav page={page} pageCount={pageCount} />
      </Suspense>
    </div>
  );
}
