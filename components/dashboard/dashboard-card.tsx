import { cn } from "@/lib/utils";

export function DashboardCard({
  title,
  value,
  hint,
  className,
}: {
  title: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-white/[0.08] bg-white/[0.02] p-6", className)}>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{title}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.12] py-16 text-center">
      <p className="font-display text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
