import type { Metadata } from "next";
import { ArrowRight, Wallet, LineChart, Headset, Layers, LogIn } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Card, Eyebrow } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Publishers",
  description:
    "Join Daotra as an affiliate and monetize your high-intent traffic across iGaming, Sweepstakes, and Prediction Markets offers - direct terms, no markups.",
};

const BENEFITS = [
  {
    icon: Wallet,
    title: "Fast, flexible payouts",
    description: "Monthly, Bi-Monthly and Weekly payments - guaranteed on time, never delayed.",
  },
  {
    icon: LineChart,
    title: "Real-time reporting",
    description: "Click, sub-ID, and conversion data updates live - no waiting on daily batches.",
  },
  {
    icon: Headset,
    title: "A named affiliate manager",
    description: "One point of contact who knows your traffic, not a rotating support queue.",
  },
  {
    icon: Layers,
    title: "Direct offers, no markups",
    description: "You see the same terms the advertiser set. No hidden sub-affiliation layers.",
  },
];

const STEPS = [
  { title: "Apply", description: "Tell us about your traffic sources and preferred verticals - takes about five minutes." },
  { title: "Get verified", description: "Our team reviews your application, usually within hours." },
  { title: "Pick your offers", description: "Browse live offers by vertical, geo, and payout model inside the dashboard." },
  { title: "Get paid", description: "Track conversions in real time and receive payouts on your chosen schedule." },
];

export default function PublishersPage() {
  return (
    <>
      <PageHero
        eyebrow="For Publishers"
        title="Traffic deserves offers that actually convert."
        description="Daotra gives publishers direct access to vetted advertisers across iGaming, Sweepstakes, and Prediction Markets - with transparent terms and payouts you can rely on."
        actions={
          <>
            <Button asChild size="lg" variant="outline">
              <a href="https://aff.daotra.io/register">
                Publisher Register <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://aff.daotra.io/login">
                Publisher Login <LogIn className="h-4 w-4" />
              </a>
            </Button>
          </>
        }
      />

      <section className="border-b border-white/[0.06] py-24">
        <div className="container">
          <Eyebrow>Why publishers choose Daotra</Eyebrow>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <Card key={b.title}>
                <b.icon className="h-8 w-8 text-accent-silver" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <Eyebrow>Getting started</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
            From application to first payout.
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
                <span className="font-mono text-sm text-accent-silver">{`0${i + 1}`}</span>
                <h3 className="mt-3 font-display text-base font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              </li>
            ))}
          </ol>
          <Button asChild size="lg" variant="outline" className="mt-10">
            <a href="https://aff.daotra.io/register">
              Publisher Register <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
