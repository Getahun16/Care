"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

type Partner = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  order: number;
  active: boolean;
};

function PartnerCard({ partner }: { partner: Partner }) {
  const inner = (
    <>
      {partner.logoUrl ? (
        <img
          src={partner.logoUrl}
          alt={partner.name}
          className="h-8 w-auto object-contain"
        />
      ) : (
        <div className="w-8 h-8 rounded-md bg-muted border border-border flex items-center justify-center text-sm font-bold text-leaf-bright shrink-0">
          {partner.name.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
        {partner.name}
      </span>
      {partner.website && (
        <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-leaf-bright transition-colors shrink-0" />
      )}
    </>
  );

  const cls =
    "glass-card px-5 py-3 rounded-xl border border-border flex items-center gap-3 shrink-0 min-w-[160px] hover:border-leaf-bright/40 transition-all duration-200 group";

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}

export default function PartnersCarousel({
  partners,
}: {
  partners: Partner[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Triple the list for seamless infinite scroll
  const displayList =
    partners.length <= 1 ? partners : [...partners, ...partners, ...partners];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || partners.length <= 1) return;

    let animFrame: number;
    let pos = 0;
    const speed = 0.55; // px per frame

    function getSetWidth() {
      if (!track) return 0;
      return track.scrollWidth / 3; // tripled list
    }

    function step() {
      if (!isPaused) {
        pos += speed;
        const setWidth = getSetWidth();
        if (setWidth > 0 && pos >= setWidth) {
          pos -= setWidth;
        }
        if (track) track.style.transform = `translateX(-${pos}px)`;
      }
      animFrame = requestAnimationFrame(step);
    }

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [isPaused, partners]);

  if (partners.length === 0) return null;

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex gap-6 will-change-transform"
        style={{ width: "max-content" }}
      >
        {displayList.map((p, i) => (
          <PartnerCard key={`${p.id}-${i}`} partner={p} />
        ))}
      </div>
    </div>
  );
}
