import type { Metadata } from "next";
import { DashboardCard, EmptyState } from "@/components/dashboard/dashboard-card";

export const metadata: Metadata = {
  title: "Publisher Overview",
  robots: { index: false, follow: false },
};

// Route stub per the build plan - real figures require the tracking/attribution
// backend, which lives in Project D's isolated infrastructure and is
// explicitly out of scope here. This wires the layout, guard, and UI shape
// so the real data layer can be dropped in later.
export default function PublisherOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account snapshot for the last 30 days.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Clicks" value="—" hint="Connects to live tracking" />
        <DashboardCard title="Conversions" value="—" hint="Connects to live tracking" />
        <DashboardCard title="Earnings" value="—" hint="Connects to live tracking" />
        <DashboardCard title="Active offers" value="0" hint="Browse the offer catalog" />
      </div>

      <EmptyState
        title="No activity yet"
        description="Once your application is approved and you activate your first offer, performance data will appear here in real time."
      />
    </div>
  );
}
