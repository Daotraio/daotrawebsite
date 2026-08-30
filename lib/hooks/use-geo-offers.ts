"use client";

import * as React from "react";
import { geoOffers as seedDataset, type GeoOffersDataset } from "@/lib/geo-offers";

/**
 * Single source of truth for globe/coverage data across the widget.
 *
 * Seeds state from the bundled dataset (instant, no loading flash), then
 * fetches /api/geo-offers and swaps it in if that resolves. Every consumer
 * of this hook automatically benefits when /api/geo-offers is later backed
 * by something live (a DB, a webhook-fed cache) - no component using this
 * hook needs to change.
 */
export function useGeoOffers() {
  const [dataset, setDataset] = React.useState<GeoOffersDataset>(seedDataset);
  const [isLive, setIsLive] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    fetch("/api/geo-offers")
      .then((res) => (res.ok ? (res.json() as Promise<GeoOffersDataset>) : Promise.reject(res.status)))
      .then((data) => {
        if (!cancelled) {
          setDataset(data);
          setIsLive(true);
        }
      })
      .catch(() => {
        // Endpoint unreachable - stay on the bundled seed rather than break
        // the widget. isLive stays false so callers can distinguish this.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { dataset, isLive };
}
