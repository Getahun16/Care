import Index from "@/views/Index";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [partners, latestNews, impactMetrics] = await Promise.all([
    prisma.partner.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
    prisma.newsEvent.findMany({
      where: { status: { not: "DRAFT" } },
      orderBy: { date: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        date: true,
        type: true,
        imageUrl: true,
        excerpt: true,
      },
    }),
    prisma.impactMetric.findMany({
      orderBy: { createdAt: "asc" },
      take: 4,
    }),
  ]);

  return <Index partners={partners} latestNews={latestNews} impactMetrics={impactMetrics} />;
}
