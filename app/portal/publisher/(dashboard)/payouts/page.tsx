import type { Metadata } from "next";
import { EmptyState } from "@/components/dashboard/dashboard-card";

export const metadata: Metadata = { title: "Payouts", robots: { index: false, follow: false } };

export default function PublisherPayoutsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Payouts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Payment history and upcoming payout schedule.
        </p>
      </div>
      <EmptyState
        title="No payout history yet"
        description="Payouts will appear here once your first billing cycle closes."
      />
    </div>
  );
}
