import { NextResponse } from "next/server";
import { geoOffers } from "@/lib/geo-offers";

export const runtime = "nodejs";

/**
 * Mock live-data endpoint for the globe widget.
 *
 * NOTE: today this just returns the bundled seed dataset (data/geo-offers.json).
 * This is the ONLY place that needs to change to go live: swap the body of
 * this handler for a call to Daotra's tracking/CRM platform (a direct DB
 * read, an internal API call, or a cache kept warm by inbound webhooks) that
 * returns data matching the GeoOffersDataset shape (lib/geo-offers.ts).
 * Every consumer - useGeoOffers() (lib/hooks/use-geo-offers.ts), the globe
 * canvas, the click-to-country deal count, and the "Live network coverage"
 * totals - reads exclusively through this endpoint already, so none of that
 * component code needs to change. Do also shorten/remove the Cache-Control
 * header below once this is backed by something that actually updates in
 * real time.
 */
export async function GET() {
  return NextResponse.json(geoOffers, {
    headers: {
      // Mock data changes as rarely as the file does; a real live endpoint
      // would typically set this much shorter (or no-store) instead.
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
