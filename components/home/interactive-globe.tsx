"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { GlobeInfoContent } from "@/components/home/globe-info-panel";
import { useGeoOffers } from "@/lib/hooks/use-geo-offers";
import type { GeoOfferCountry } from "@/lib/geo-offers";

// globe.gl touches `window`/WebGL at import time, so the canvas must never
// render on the server - ssr: false is required here, not optional.
const GlobeCanvas = dynamic(
  () => import("@/components/home/globe-canvas").then((m) => m.GlobeCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-40 w-40 animate-pulse-slow rounded-full border border-accent-cyan/20 bg-accent-cyan/5" />
      </div>
    ),
  }
);

export function InteractiveGlobe() {
  const { dataset } = useGeoOffers();
  const [selected, setSelected] = React.useState<GeoOfferCountry | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const handleSelect = (country: GeoOfferCountry | null) => {
    setSelected(country);
    setSheetOpen(country !== null);
  };

  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-obsidian-950/60 sm:h-[560px] lg:h-[640px]">
      <GlobeCanvas
        countries={dataset.countries}
        onSelect={handleSelect}
        selected={selected}
        className="relative h-full w-full"
      />

      {/* Desktop / tablet: always-visible glass panel, content swaps on selection */}
      <div className="pointer-events-none absolute inset-0 hidden md:flex md:items-end md:p-6">
        <div className="glass pointer-events-auto w-full max-w-sm rounded-xl p-6 shadow-glow">
          <GlobeInfoContent dataset={dataset} country={selected} onClose={() => handleSelect(null)} />
        </div>
      </div>

      {/* Mobile: tap-to-bottom-sheet, since a fixed side panel would eat the whole viewport */}
      <div
        className={`absolute inset-x-0 bottom-0 md:hidden transition-transform duration-300 ease-out ${
          sheetOpen ? "translate-y-0" : "translate-y-[78%]"
        }`}
      >
        <button
          className="mx-auto block h-1.5 w-12 rounded-full bg-white/20"
          aria-label={sheetOpen ? "Collapse market details" : "Expand market details"}
          onClick={() => setSheetOpen((v) => !v)}
        />
        <div className="glass mt-3 rounded-t-2xl p-5">
          <GlobeInfoContent
            dataset={dataset}
            country={selected}
            onClose={() => {
              handleSelect(null);
              setSheetOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
