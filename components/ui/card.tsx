import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-accent-cyan/30",
        className
      )}
      {...props}
    />
  );
}

export function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent-cyan",
        className
      )}
      {...props}
    />
  );
}
