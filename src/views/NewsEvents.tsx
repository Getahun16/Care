"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Tag, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { NewsEvent as DbNewsEvent } from "../../generated/prisma/client";

type Category =
  | "All"
  | "Research"
  | "Event"
  | "Partnership"
  | "Policy"
  | "News";
type Timing = "all" | "upcoming" | "past";

type PostItem = {
  id: number | string;
  title: string;
  date: string;
  category: Category;
  excerpt: string | null;
  upcoming: boolean;
  image: string | null;
};

function dbToPost(item: DbNewsEvent): PostItem {
  return {
    id: item.id,
    title: item.title,
    date:
      item.date instanceof Date
        ? item.date.toISOString().split("T")[0]
        : String(item.date),
    category: item.type === "EVENT" ? "Event" : "News",
    excerpt: item.excerpt,
    upcoming: item.status === "UPCOMING",
    image: item.imageUrl ?? null,
  };
}

const staticPosts: PostItem[] = [
  {
    id: 1,
    title: "Biochar Trials Show 34% Soil Fertility Improvement in Kaffa Zone",
    date: "2024-11-15",
    category: "Research",
    excerpt:
      "New data from our 18-month longitudinal trial demonstrates significant improvements in soil organic carbon and plant-available phosphorus following biochar application.",
    upcoming: false,
    image: null,
  },
  {
    id: 2,
    title: "Circular Coffee Team Presents at AAU International Symposium",
    date: "2024-10-03",
    category: "Event",
    excerpt:
      "Dr. Tadesse and Prof. Alemu presented the project's preliminary findings to an audience of 400+ researchers and development professionals in Addis Ababa.",
    upcoming: false,
    image: null,
  },
  {
    id: 3,
    title: "New Cooperative Partnership Signed with Yirgacheffe Farmers Union",
    date: "2024-09-20",
    category: "Partnership",
    excerpt:
      "A formal MOU was signed to implement circular processing practices across 12 washing stations covering 3,200 farmer members.",
    upcoming: false,
    image: null,
  },
  {
    id: 4,
    title: "Annual Project Review & Stakeholder Workshop — Addis Ababa",
    date: "2025-02-14",
    category: "Event",
    excerpt:
      "Year 2 review meeting bringing together all project partners, PhD candidates, and external stakeholders to assess progress and plan next milestones.",
    upcoming: true,
    image: null,
  },
  {
    id: 5,
    title:
      "Policy Brief Launch: Circular Frameworks for Ethiopian Coffee Cooperatives",
    date: "2024-08-01",
    category: "Policy",
    excerpt:
      "The project's first policy brief, offering actionable recommendations for integrating circular economy practices into cooperative governance structures.",
    upcoming: false,
    image: null,
  },
  {
    id: 6,
    title: "Field School: Compost Training for Kaffa Zone Farmers",
    date: "2025-03-10",
    category: "Event",
    excerpt:
      "A 2-day practical training session for 60 smallholder farmers on husk composting techniques and application methods.",
    upcoming: true,
    image: null,
  },
];

const categoryColors: Record<string, string> = {
  All: "",
  Research: "tag-pill",
  Event: "tag-coffee",
  Partnership: "tag-pill",
  Policy: "tag-coffee",
  News: "tag-pill",
};

export default function NewsEvents({
  items: dbItems,
}: {
  items?: DbNewsEvent[];
}) {
  const posts: PostItem[] =
    dbItems && dbItems.length > 0 ? dbItems.map(dbToPost) : staticPosts;

  const categories: Category[] = [
    "All",
    ...(Array.from(new Set(posts.map((p) => p.category))) as Category[]),
  ];
  const [cat, setCat] = useState<Category>("All");
  const [timing, setTiming] = useState<Timing>("all");

  const filtered = posts.filter((p) => {
    const matchCat = cat === "All" || p.category === cat;
    const matchTiming =
      timing === "all" || (timing === "upcoming" ? p.upcoming : !p.upcoming);
    return matchCat && matchTiming;
  });

  const PAGE_SIZE = 9;
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [cat, timing]);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="min-h-screen pt-24">
      <section className="py-20 bg-charcoal-mid">
        <div className="container mx-auto">
          <span className="tag-pill mb-4 inline-block">Stay Updated</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            News & <span className="text-gradient-green">Events</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Project milestones, field stories, upcoming events, and policy
            updates.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center mb-10">
            <div className="flex gap-2">
              {(["all", "upcoming", "past"] as Timing[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTiming(t)}
                  className={`text-sm px-4 py-2 rounded-full capitalize transition-colors ${timing === t ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                >
                  {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="h-5 w-px bg-border hidden sm:block" />
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors ${cat === c ? "bg-leaf text-secondary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                >
                  <Tag className="w-3 h-3" /> {c}
                </button>
              ))}
            </div>
          </div>

          {/* Posts grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paged.map((post) => (
              <Link
                key={post.id}
                href={`/news/${encodeURIComponent(String(post.id))}`}
                className="flex flex-col"
              >
                <article className="glass-card rounded-2xl border border-border overflow-hidden pillar-hover group cursor-pointer flex flex-col flex-1">
                  <div className="h-40 bg-gradient-to-br from-charcoal-mid to-charcoal flex items-center justify-center overflow-hidden">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`text-5xl ${post.upcoming ? "gradient-green" : "gradient-coffee"} w-16 h-16 rounded-full flex items-center justify-center text-2xl`}
                      >
                        {post.category === "Research"
                          ? "🔬"
                          : post.category === "Event"
                            ? "📅"
                            : post.category === "Partnership"
                              ? "🤝"
                              : "📋"}
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs ${categoryColors[post.category] || "tag-pill"}`}
                      >
                        {post.category}
                      </span>
                      {post.upcoming && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-leaf/20 text-leaf-bright border border-leaf/30">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <h2 className="font-serif font-semibold text-base leading-snug mb-3 group-hover:text-leaf-bright transition-colors flex-1">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <span className="text-xs text-leaf-bright flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pageCount > 1 && filtered.length > 0 && (
            <div className="flex items-center justify-center gap-1 pt-10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    pageCount <= 7 ||
                    p === 1 ||
                    p === pageCount ||
                    Math.abs(p - currentPage) <= 1,
                )
                .reduce<(number | "...")[]>((acc, p) => {
                  if (
                    acc.length > 0 &&
                    typeof acc[acc.length - 1] === "number" &&
                    p - (acc[acc.length - 1] as number) > 1
                  )
                    acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`d${i}`}
                      className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={`inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 rounded-lg text-sm font-medium transition-colors ${
                        p === currentPage
                          ? "bg-leaf text-secondary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(pageCount, p + 1))
                }
                disabled={currentPage >= pageCount}
                aria-label="Next page"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p>No posts match your current filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
