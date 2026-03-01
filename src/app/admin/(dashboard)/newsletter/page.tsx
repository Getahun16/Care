import { Suspense } from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import NewsletterCrud from "@/components/admin/NewsletterCrud";
import PaginationNav from "@/components/ui/PaginationNav";

export const metadata: Metadata = {
  title: "Newsletter | Circular Coffee Admin",
};

const PAGE_SIZE = 10;

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [subscribers, total, active] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
  ]);
  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Newsletter
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage subscribers and send quarterly updates.{" "}
          <span className="text-leaf-bright font-medium">
            {active} active subscriber{active !== 1 ? "s" : ""}
          </span>
          {" "}·{" "}
          <span className="text-muted-foreground/60">{total} total</span>
        </p>
      </div>
      <NewsletterCrud subscribers={subscribers} />
      <Suspense>
        <PaginationNav page={page} pageCount={pageCount} />
      </Suspense>
    </div>
  );
}
