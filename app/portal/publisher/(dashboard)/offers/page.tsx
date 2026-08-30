import type { Metadata } from "next";
import { EmptyState } from "@/components/dashboard/dashboard-card";

export const metadata: Metadata = { title: "Offers", robots: { index: false, follow: false } };

export default function PublisherOffersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Offers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse live offers across iGaming, Prediction Markets, and Tech Verticals.
        </p>
      </div>
      <EmptyState
        title="Offer catalog not yet connected"
        description="This view will list live offers by vertical, geo, and payout model once the offer-management backend is wired in."
      />
    </div>
  );
}
