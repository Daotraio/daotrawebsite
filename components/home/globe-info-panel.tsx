import { X } from "lucide-react";
import type { GeoOfferCountry, GeoOffersDataset } from "@/lib/geo-offers";
import { networkTotals } from "@/lib/geo-offers";

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
        <p className="font-mono text-xs uppercase tracking-widest text-accent-silver">
          Live network coverage
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Stat label="GEOs" value={totals.totalGeos.toString()} />
          <Stat label="Active deals" value={`${totals.totalOffers}+`} />
        </div>
        <p className="text-sm text-muted-foreground">
          Tap any market or country to see active deal coverage for that region.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="font-display text-xl font-semibold text-foreground">{country.name}</h3>
        <button
          onClick={onClose}
          aria-label="Close market details"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <Stat label="Active deals" value={country.activeOffers.toString()} />
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
