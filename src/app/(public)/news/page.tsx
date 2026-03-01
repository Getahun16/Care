import type { Metadata } from "next";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
import NewsEvents from "@/views/NewsEvents";

export const metadata: Metadata = {
  title: "News & Events | Circular Coffee",
  description: "Project milestones, field stories, upcoming events, and policy updates.",
};

export default async function NewsPage() {
  const items = await prisma.newsEvent.findMany({
    where: { status: { not: "DRAFT" } },
    orderBy: { date: "desc" },
  });
  return <NewsEvents items={items} />;
}
