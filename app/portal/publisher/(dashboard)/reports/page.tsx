import type { Metadata } from "next";
import { EmptyState } from "@/components/dashboard/dashboard-card";

export const metadata: Metadata = { title: "Reports", robots: { index: false, follow: false } };

export default function PublisherReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Click, conversion, and sub-ID level reporting.
        </p>
      </div>
      <EmptyState
        title="Reporting data not yet connected"
        description="Live conversion and click data is served by the tracking infrastructure, which lives outside this codebase."
      />
    </div>
  );
}
