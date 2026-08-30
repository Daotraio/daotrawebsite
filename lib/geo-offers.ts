import geoOffersRaw from "@/data/geo-offers.json";

export type Vertical = "iGaming" | "Prediction Markets" | "Tech Verticals";
export type CoverageTier = "primary" | "growth" | "emerging";

export interface GeoOfferCountry {
  iso: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  activeOffers: number;
  verticals: Vertical[];
  tier: CoverageTier;
}

export interface GeoOffersDataset {
  updatedAt: string;
  verticals: Vertical[];
  countries: GeoOfferCountry[];
}

// The bundled JSON is the default/seed dataset. Components should prefer the
// useGeoOffers() hook (lib/hooks/use-geo-offers.ts), which fetches
// /api/geo-offers and falls back to this seed if the endpoint is
// unreachable, so the globe never breaks and can later be pointed at a real
// live/webhook-fed source with zero component changes. Importing this
// directly is only for non-widget, non-interactive contexts (e.g. metadata).
export const geoOffers = geoOffersRaw as GeoOffersDataset;

// One accent color per vertical, drawn from the brand's blue/cyan range plus
// a supporting hue for Tech Verticals, so the globe stays legible when a
// market spans more than one.
export const VERTICAL_COLORS: Record<Vertical, string> = {
  iGaming: "#F5F5F7",
  "Prediction Markets": "#C7C7CC",
  "Tech Verticals": "#86868B",
};

export function dominantVertical(country: GeoOfferCountry): Vertical {
  // With no per-vertical split in the dataset, treat the first listed vertical
  // as the market's lead line of business for marker coloring.
  return country.verticals[0]!;
}

export function markerColor(country: GeoOfferCountry): string {
  return VERTICAL_COLORS[dominantVertical(country)];
}

export function networkTotals(dataset: GeoOffersDataset = geoOffers) {
  const totalOffers = dataset.countries.reduce((sum, c) => sum + c.activeOffers, 0);
  const totalGeos = dataset.countries.length;
  const byTier = dataset.countries.reduce<Record<CoverageTier, number>>(
    (acc, c) => {
      acc[c.tier] += 1;
      return acc;
    },
    { primary: 0, growth: 0, emerging: 0 }
  );
  return { totalOffers, totalGeos, byTier };
}
