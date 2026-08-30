import { networkTotals, geoOffers } from "@/lib/geo-offers";

export function StatsStrip() {
  const totals = networkTotals();
  const stats = [
    { label: "Active GEOs", value: totals.totalGeos.toString() },
    { label: "Live offers", value: `${totals.totalOffers}+` },
    { label: "Verticals", value: geoOffers.verticals.length.toString() },
    { label: "Primary markets", value: totals.byTier.primary.toString() },
  ];

  return (
    <section className="border-b border-white/[0.06] bg-obsidian-950/60">
      <div className="container grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center sm:text-left">
            <p className="font-mono text-3xl font-semibold text-foreground">
              {s.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
