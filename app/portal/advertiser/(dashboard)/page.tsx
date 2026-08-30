import type { Metadata } from "next";
import { DashboardCard, EmptyState } from "@/components/dashboard/dashboard-card";

export const metadata: Metadata = { title: "Advertiser Overview", robots: { index: false, follow: false } };

export default function AdvertiserOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your spend and acquisition snapshot for the last 30 days.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Spend" value="-" hint="Connects to live tracking" />
        <DashboardCard title="Conversions" value="-" hint="Connects to live tracking" />
        <DashboardCard title="Avg. CPA" value="-" hint="Connects to live tracking" />
        <DashboardCard title="Active campaigns" value="0" hint="Launch your first campaign" />
      </div>

      <EmptyState
        title="No campaigns yet"
        description="Once your application is approved and you launch your first campaign, spend and conversion data will appear here in real time."
      />
    </div>
  );
}
