import { Eyebrow } from "@/components/ui/card";

export function Mission() {
  return (
    <section className="border-b border-white/[0.06] py-24">
      <div className="container max-w-3xl text-center">
        <Eyebrow className="text-center">Our Mission</Eyebrow>
        <p className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl">
          Daotra&apos;s mission is to bridge between publishers and advertisers, building a
          transparent, high-performing affiliate network where every connection runs on direct
          terms, real data, and trust. We exist to cut the friction, hidden markups, and guesswork
          that slow other networks down - matching high-intent traffic with vetted, licensed
          offers across iGaming, Sweepstakes, and Prediction Markets, and paying out on time,
          every time.
        </p>
      </div>
    </section>
  );
}
