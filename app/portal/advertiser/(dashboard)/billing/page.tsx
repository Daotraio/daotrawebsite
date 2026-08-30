import type { Metadata } from "next";
import { EmptyState } from "@/components/dashboard/dashboard-card";

export const metadata: Metadata = { title: "Billing", robots: { index: false, follow: false } };

export default function AdvertiserBillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invoices, payment methods, and budget controls.
        </p>
      </div>
      <EmptyState
        title="No billing history yet"
        description="Invoices will appear here once your first billing cycle closes."
      />
    </div>
  );
}
