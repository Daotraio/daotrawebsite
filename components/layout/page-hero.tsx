import { Eyebrow } from "@/components/ui/card";

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-grid bg-grid pt-28 pb-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="container relative max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">{description}</p>
        {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>}
      </div>
    </section>
  );
}
