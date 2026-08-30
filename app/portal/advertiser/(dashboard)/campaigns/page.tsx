import type { Metadata } from "next";
import { EmptyState } from "@/components/dashboard/dashboard-card";

export const metadata: Metadata = { title: "Campaigns", robots: { index: false, follow: false } };

export default function AdvertiserCampaignsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Campaigns</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage active and draft campaigns across your verticals.
        </p>
      </div>
      <EmptyState
        title="No campaigns yet"
        description="Campaign creation and publisher targeting tools will appear here once the offer-management backend is wired in."
      />
    </div>
  );
}
