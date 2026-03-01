"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  pageCount: number;
}

function getPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function PaginationNav({ page, pageCount }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pageCount <= 1) return null;

  function href(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    return `${pathname}?${params.toString()}`;
  }

  const base =
    "inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 rounded-lg text-sm font-medium transition-colors";
  const active = `${base} bg-leaf text-secondary-foreground`;
  const normal = `${base} bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80`;
  const disabled = `${base} text-muted-foreground/30 cursor-not-allowed pointer-events-none`;

  const pages = getPages(page, pageCount);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 pt-6 select-none"
    >
      {page <= 1 ? (
        <span className={disabled}>
          <ChevronLeft className="w-4 h-4" />
        </span>
      ) : (
        <Link href={href(page - 1)} className={normal} aria-label="Previous page">
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p as number)}
            aria-current={p === page ? "page" : undefined}
            className={p === page ? active : normal}
          >
            {p}
          </Link>
        ),
      )}

      {page >= pageCount ? (
        <span className={disabled}>
          <ChevronRight className="w-4 h-4" />
        </span>
      ) : (
        <Link href={href(page + 1)} className={normal} aria-label="Next page">
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  );
}
