import Link from "next/link";
import { Orbit } from "lucide-react";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden py-16">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

      <div className="relative w-full max-w-md px-4">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <Orbit className="h-6 w-6 text-accent-silver" />
          <span className="font-display text-lg font-semibold tracking-tight">Daotra</span>
        </Link>

        <div className="glass rounded-2xl p-8 shadow-glow">
          <h1 className="font-display text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
        </div>

        {footer && <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>}
      </div>
    </div>
  );
}
