import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/card";
import { InteractiveGlobe } from "@/components/home/interactive-globe";

// Color-coded via CSS custom properties (set in globals.css: --hero-accent-a /
// --hero-accent-b) rather than hardcoded hex here, so the two headline rows
// can be retinted from one place without touching this component.
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

      <div className="container relative grid gap-12 pt-28 pb-16 lg:grid-cols-2 lg:items-center lg:pt-32">
        <div className="animate-fade-up">
          <Eyebrow>International Performance Marketing Network</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block" style={{ color: "var(--hero-accent-a)" }}>
              One network
            </span>
            <span className="block" style={{ color: "var(--hero-accent-b)" }}>
              All traffic sources
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Daotra connects publishers and advertisers across{" "}
            <a href="#igaming" className="text-foreground underline decoration-white/25 underline-offset-4 hover:decoration-accent-cyan">
              iGaming
            </a>
            ,{" "}
            <a href="#prediction-markets" className="text-foreground underline decoration-white/25 underline-offset-4 hover:decoration-accent-cyan">
              Prediction Markets
            </a>
            , and{" "}
            <a href="#tech-verticals" className="text-foreground underline decoration-white/25 underline-offset-4 hover:decoration-accent-cyan">
              Tech Verticals
            </a>{" "}
            — with live coverage in 100s of markets and counting.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="https://aff.daotra.io/register">
                Join as Publisher <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://adv.daotra.io/register">
                Join as Advertiser <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <InteractiveGlobe />
        </div>
      </div>
    </section>
  );
}
