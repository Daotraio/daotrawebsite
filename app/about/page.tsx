import type { Metadata } from "next";
import { Target, ShieldCheck, Globe2, Handshake } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Card, Eyebrow } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Daotra is an international performance marketing and affiliate network built for iGaming, Prediction Markets, and Tech Verticals.",
};

const VALUES = [
  {
    icon: Target,
    title: "Performance first",
    description:
      "We only succeed when our publishers and advertisers do. Every product decision is measured against real conversion outcomes, not vanity metrics.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance by default",
    description:
      "We work only with licensed, regulated advertisers and require publishers to follow local advertising law in every market they target.",
  },
  {
    icon: Globe2,
    title: "Genuinely global",
    description:
      "Our network spans 26 active markets across six regions, with regional account management rather than a one-size-fits-all playbook.",
  },
  {
    icon: Handshake,
    title: "Direct relationships",
    description:
      "No hidden sub-affiliation layers. Publishers work directly with advertisers' terms, and advertisers see exactly where their spend goes.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Daotra"
        title="Built by performance marketers, for performance marketers."
        description="Daotra started as a small in-house affiliate desk for a handful of iGaming operators. Today it's an independent network spanning four verticals and 26 markets — but the operating principle hasn't changed: real payouts, real traffic, no middlemen."
      />

      <section className="border-b border-white/[0.06] py-24">
        <div className="container">
          <Eyebrow>Our principles</Eyebrow>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground">
            What running the network actually looks like.
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {VALUES.map((v) => (
              <Card key={v.title}>
                <v.icon className="h-8 w-8 text-accent-cyan" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Compliance stance</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
              We vet the advertisers on our network before we vet the traffic.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every advertiser on Daotra is reviewed for licensing status in the markets they
              target before their offers go live. Publishers remain responsible for their own
              creative and targeting compliance, but they're never left guessing which operators
              are legitimate.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
            <p className="font-mono text-sm text-muted-foreground">
              &ldquo;Advertisers must hold a valid operating license in every jurisdiction they
              target through the network. Publishers must not promote unlicensed operators or
              target restricted regions.&rdquo;
            </p>
            <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
              — Daotra Network Terms, Compliance Clause
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
