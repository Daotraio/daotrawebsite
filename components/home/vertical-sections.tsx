import { Dices, TrendingUp, Cpu, type LucideIcon } from "lucide-react";
import { Eyebrow } from "@/components/ui/card";

const VERTICALS: {
  id: string;
  icon: LucideIcon;
  name: string;
  tagline: string;
  description: string;
  servicesLabel?: string;
  services: string[];
}[] = [
  {
    id: "igaming",
    icon: Dices,
    name: "iGaming",
    tagline: "Regulated real-money gaming operators",
    description:
      "Daotra routes publisher traffic to licensed sportsbooks and casinos, with deal structures and compliance tooling built for a regulated vertical from the ground up.",
    services: [
      "Real-time postbacks on Daotra's platform",
      "Real-time deposit and bet-event tracking",
      "Regional licensing and compliance overlays per market",
      "CPA, RevShare, and Hybrid deal structuring",
      "Responsible-gambling signal passthrough to operators",
    ],
  },
  {
    id: "prediction-markets",
    icon: TrendingUp,
    name: "Prediction Markets",
    tagline: "Event contract & forecasting infrastructure",
    description:
      "One of the fastest-growing verticals in performance marketing. Daotra gives publishers early access to event-contract and forecasting platforms where users place predictions on real-time global events as they unfold, with attribution built for a newer kind of conversion event.",
    services: [
      "Publisher traffic directed to live predictions on real-time global events",
      "Contract-settlement conversion tracking",
      "Early-mover access as new markets go live",
      "Cross-platform attribution for multi-touch journeys",
      "Volume-based payout tiers",
    ],
  },
  {
    id: "tech-verticals",
    icon: Cpu,
    name: "Tech Verticals",
    tagline: "VPN, SaaS & performance tech",
    description:
      "Consumer privacy tools, fintech, and utility apps that convert on measurable actions — trials, installs, and subscriptions — with tooling built to bundle offers across categories under one payout relationship.",
    servicesLabel: "Platform capabilities",
    services: [
      "Trial-to-paid funnel tracking",
      "Install and signup attribution across mobile and desktop",
      "Multi-offer bundling across VPN, fintech, and utility apps",
      "Deep-link support for app and browser-based offers",
    ],
  },
];

export function VerticalSections() {
  return (
    <section className="border-b border-white/[0.06] py-24">
      <div className="container">
        <Eyebrow>Verticals</Eyebrow>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground">
          Three verticals. One network.
        </h2>

        <div className="mt-14 space-y-14">
          {VERTICALS.map((v) => (
            <div
              key={v.id}
              id={v.id}
              className="scroll-mt-24 grid gap-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 lg:grid-cols-[1fr_1.1fr] lg:p-10"
            >
              <div>
                <v.icon className="h-9 w-9 text-accent-cyan" strokeWidth={1.5} />
                <p className="mt-4 font-mono text-xs uppercase tracking-widest text-accent-cyan">
                  {v.tagline}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                  {v.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {v.servicesLabel ?? "Infrastructure services"}
                </p>
                <ul className="mt-3 space-y-3">
                  {v.services.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
