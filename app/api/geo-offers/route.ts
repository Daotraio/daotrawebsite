import { NextResponse } from "next/server";
import { geoOffers } from "@/lib/geo-offers";

export const runtime = "nodejs";

/**
 * Mock live-data endpoint for the globe widget.
 *
 * Today this just returns the bundled seed dataset (data/geo-offers.json).
 * The point of routing through an API rather than importing the JSON
 * directly in every component is the seam it creates: swap the body of this
 * handler for a database read, a cache fed by inbound webhooks, or a
 * real-time source, and every consumer (useGeoOffers(), the globe canvas,
 * the stats panels) picks up the change automatically - no component code
 * needs to know where the data came from.
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
