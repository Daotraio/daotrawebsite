import { X } from "lucide-react";
import type { GeoOfferCountry, GeoOffersDataset } from "@/lib/geo-offers";
import { VERTICAL_COLORS, networkTotals } from "@/lib/geo-offers";

const TIER_LABEL: Record<GeoOfferCountry["tier"], string> = {
  primary: "Primary market",
  growth: "Growth market",
  emerging: "Emerging market",
};

export function GlobeInfoContent({
  dataset,
  country,
  onClose,
}: {
  dataset: GeoOffersDataset;
  country: GeoOfferCountry | null;
  onClose: () => void;
}) {
  if (!country) {
    const totals = networkTotals(dataset);
    return (
      <div className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
          Live network coverage
        </p>
        <div className="grid grid-cols-3 gap-4">
          <Stat label="GEOs" value={totals.totalGeos.toString()} />
          <Stat label="Active offers" value={`${totals.totalOffers}+`} />
          <Stat label="Verticals" value={dataset.verticals.length.toString()} />
        </div>
        <p className="text-sm text-muted-foreground">
          Tap any marker to see offer coverage and verticals live for that market.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
            {TIER_LABEL[country.tier]}
          </p>
          <h3 className="font-display text-xl font-semibold text-foreground">{country.name}</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close market details"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Stat label="Active offers" value={country.activeOffers.toString()} />
        <Stat label="Region" value={country.region} />
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Verticals</p>
        <div className="flex flex-wrap gap-2">
          {country.verticals.map((v) => (
            <span
              key={v}
              className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium"
              style={{ color: VERTICAL_COLORS[v] }}
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
