import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag, MapPin, ArrowLeft, Clock } from "lucide-react";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const item = await prisma.newsEvent.findUnique({ where: { id: decodedId } })
    ?? await prisma.newsEvent.findFirst({ where: { title: decodedId } });
  if (!item) return { title: "Not Found | Circular Coffee" };
  return {
    title: `${item.title} | Circular Coffee`,
    description: item.excerpt ?? undefined,
    openGraph: item.imageUrl ? { images: [item.imageUrl] } : undefined,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const item = await prisma.newsEvent.findUnique({ where: { id: decodedId } })
    ?? await prisma.newsEvent.findFirst({ where: { title: decodedId } });

  if (!item) notFound();

  const isUpcoming = item.status === "UPCOMING";
  const isEvent = item.type === "EVENT";
  const categoryLabel = isEvent ? "Event" : "News";

  const formattedDate =
    item.date instanceof Date
      ? item.date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : String(item.date);

  const paragraphs = item.content
    ? item.content
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="py-16 bg-charcoal-mid border-b border-border">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-leaf-bright transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News & Events
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="tag-pill flex items-center gap-1 text-xs">
              <Tag className="w-3 h-3" /> {categoryLabel}
            </span>
            {isUpcoming && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-leaf/20 text-leaf-bright border border-leaf/30">
                Upcoming
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-6">
            {item.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-leaf-bright" />
              {formattedDate}
            </span>
            {item.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-leaf-bright" />
                {item.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-leaf-bright" />
              {isEvent
                ? isUpcoming
                  ? "Upcoming Event"
                  : "Past Event"
                : "Published"}
            </span>
          </div>
        </div>
      </section>

      {/* Cover image */}
      {item.imageUrl && (
        <div className="container mx-auto max-w-4xl px-4 mt-10">
          <div className="rounded-2xl overflow-hidden border border-border h-72 md:h-96">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <section className="py-12">
        <div className="container mx-auto max-w-3xl">
          {item.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-4 border-leaf pl-5 italic">
              {item.excerpt}
            </p>
          )}

          {paragraphs.length > 0 ? (
            <div className="space-y-5 text-base leading-relaxed">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          ) : (
            !item.excerpt && (
              <p className="text-muted-foreground italic">
                No content available for this item.
              </p>
            )
          )}
        </div>
      </section>

      {/* Footer nav */}
      <div className="container mx-auto max-w-3xl pb-16 border-t border-border pt-8">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm text-leaf-bright hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all News & Events
        </Link>
      </div>
    </div>
  );
}
