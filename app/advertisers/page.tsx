import type { Metadata } from "next";
import { ArrowRight, ShieldAlert, Gauge, Users, Dices, TrendingUp, Cpu, LogIn } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Card, Eyebrow } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Advertisers",
  description:
    "Scale acquisition across iGaming, Sweepstakes, and Prediction Markets with vetted, high-intent publisher traffic from Daotra's affiliate network.",
};

const BENEFITS = [
  {
    icon: Users,
    title: "Vetted publisher network",
    description: "Every publisher passes a traffic-quality and compliance review before going live.",
  },
  {
    icon: ShieldAlert,
    title: "Fraud and quality controls",
    description: "Automated anomaly detection flags suspicious conversion patterns before you pay for them.",
  },
  {
    icon: Gauge,
    title: "Real-time spend visibility",
    description: "Set budget caps by offer, geo, or publisher and watch spend update as it happens.",
  },
];

const VERTICAL_DETAILS = [
  {
    id: "igaming",
    icon: Dices,
    name: "iGaming & Sweepstakes",
    description:
      "Sportsbooks, casinos, and a dedicated Sweepstakes offering. We only onboard operators holding valid licenses in every market they target through the network.",
  },
  {
    id: "prediction-markets",
    icon: TrendingUp,
    name: "Prediction Markets",
    description:
      "Event contract and forecasting platforms - one of the fastest-growing verticals in performance marketing right now.",
  },
  {
    id: "tech-verticals",
    icon: Cpu,
    name: "Tech Verticals",
    description:
      "VPN, SaaS, fintech, and utility apps that pay on measurable actions: signups, trials, deposits, and installs.",
  },
];

export default function AdvertisersPage() {
  return (
    <>
      <PageHero
        eyebrow="For Advertisers"
        title="Acquisition traffic you can actually verify."
        description="Daotra gives advertisers access to a vetted publisher network across iGaming, Sweepstakes, and Prediction Markets - with fraud screening and full attribution support built in."
        actions={
          <>
            <Button asChild size="lg">
              <a href="https://adv.daotra.io/register">
                Advertiser Register <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://adv.daotra.io/login">
                Advertiser Login <LogIn className="h-4 w-4" />
              </a>
            </Button>
          </>
        }
      />

      <section className="border-b border-white/[0.06] py-24">
        <div className="container">
          <Eyebrow>Why advertisers choose Daotra</Eyebrow>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
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

      <section className="border-b border-white/[0.06] py-24">
        <div className="container">
          <Eyebrow>Verticals we run</Eyebrow>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground">
            Built for three specific kinds of offers - not a generic catch-all.
          </h2>
          <div className="mt-12 space-y-4">
            {VERTICAL_DETAILS.map((v) => (
              <div
                key={v.id}
                id={v.id}
                className="scroll-mt-24 flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 sm:flex-row sm:items-start"
              >
                <v.icon className="h-8 w-8 shrink-0 text-accent-silver" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{v.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container flex flex-col items-start gap-6 rounded-2xl border border-accent-silver/20 bg-gradient-to-br from-obsidian-800 to-obsidian-950 p-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Set up your first campaign this week.
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Our onboarding team reviews new advertiser applications within hours, including a
              licensing check for regulated verticals.
            </p>
          </div>
          <Button asChild size="lg">
            <a href="https://adv.daotra.io/register">
              Advertiser Register <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
