"use client";

import * as React from "react";
import { Eyebrow } from "@/components/ui/card";

interface Partner {
  name: string;
  domain: string;
}

// Placeholder partner set - swap in real logo assets and confirmed domains
// as they're onboarded. Wordmark cards (rather than image files) keep this
// working with zero asset dependencies until real logos exist.
const PARTNERS: Partner[] = [
  { name: "Boomerang Partners", domain: "boomerang-partners.com" },
  { name: "Gypsy", domain: "gypsy.co" },
  { name: "Shark Partners", domain: "shark.partners" },
];

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="mx-3 flex h-28 w-64 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] px-6">
      <span className="font-display text-lg font-semibold tracking-tight text-foreground">
        {partner.name}
      </span>
      <span className="font-mono text-xs text-muted-foreground">{partner.domain}</span>
    </div>
  );
}

const AUTO_SCROLL_SPEED = 0.5; // px per animation frame, ~30px/s at 60fps

export function AdvertiserMarquee() {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const offsetRef = React.useRef(0);
  const draggingRef = React.useRef(false);
  const lastXRef = React.useRef(0);
  const halfWidthRef = React.useRef(0);

  React.useEffect(() => {
    let rafId: number;

    const measure = () => {
      if (trackRef.current) {
        // Track renders the partner list twice back-to-back for a seamless
        // loop, so half its scrollWidth is exactly one full cycle.
        halfWidthRef.current = trackRef.current.scrollWidth / 2;
      }
    };
    measure();
    window.addEventListener("resize", measure);

    const tick = () => {
      if (!draggingRef.current && halfWidthRef.current > 0) {
        offsetRef.current -= AUTO_SCROLL_SPEED;
        if (offsetRef.current <= -halfWidthRef.current) {
          offsetRef.current += halfWidthRef.current;
        }
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const delta = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    offsetRef.current += delta;
    if (halfWidthRef.current > 0) {
      // Keep the offset wrapped in both directions so a long drag never
      // scrolls off the duplicated content.
      while (offsetRef.current <= -halfWidthRef.current) offsetRef.current += halfWidthRef.current;
      while (offsetRef.current > 0) offsetRef.current -= halfWidthRef.current;
    }
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

  return (
    <section className="border-b border-white/[0.06] py-24">
      <div className="container">
        <Eyebrow>Advertiser Partners</Eyebrow>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground">
          Live campaigns, run by real operators.
        </h2>
      </div>

      <div
        className="relative mt-10 cursor-grab overflow-hidden py-2 active:cursor-grabbing"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        role="region"
        aria-label="Advertiser partner logos, auto-scrolling - click and drag to browse manually"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-obsidian-900 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-obsidian-900 to-transparent" />
        <div ref={trackRef} className="flex w-max will-change-transform">
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <PartnerCard key={`${p.name}-${i}`} partner={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
