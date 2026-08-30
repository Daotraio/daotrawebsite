import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/card";

const PUBLISHER_POINTS = [
  "Weekly and Net-15 payment terms, in 12+ currencies",
  "Direct offers across all four verticals, no sub-affiliation markups",
  "Real-time reporting down to sub-ID and click level",
  "A dedicated affiliate manager from day one",
];

const ADVERTISER_POINTS = [
  "Vetted publisher network with fraud and compliance screening",
  "Full attribution and postback integration support",
  "Budget controls with real-time spend and CPA monitoring",
  "Regional account management across every active market",
];

export function DualPath() {
  return (
    <section className="border-b border-white/[0.06] py-24">
      <div className="container grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-8">
          <Eyebrow>For Publishers</Eyebrow>
          <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
            Monetize your traffic with offers that actually pay out.
          </h3>
          <ul className="mt-6 space-y-3">
            {PUBLISHER_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" />
                {p}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8" variant="outline">
            <Link href="/publishers">
              Explore Publishers <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-8">
          <Eyebrow>For Advertisers</Eyebrow>
          <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
            Scale acquisition with traffic you can actually trust.
          </h3>
          <ul className="mt-6 space-y-3">
            {ADVERTISER_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" />
                {p}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8" variant="outline">
            <Link href="/advertisers">
              Explore Advertisers <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
