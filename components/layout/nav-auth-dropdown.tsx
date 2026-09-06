"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavAuthDropdownProps {
  label: string;
  publisherHref: string;
  advertiserHref: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}

// Click-to-open (not hover) dropdown offering the Publisher/Advertiser choice
// behind a single "Register" or "Login" trigger - collapses what used to be
// 4 separate header buttons down to 2.
export function NavAuthDropdown({
  label,
  publisherHref,
  advertiserHref,
  variant = "ghost",
  size = "sm",
  className,
}: NavAuthDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-full gap-1.5"
      >
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </Button>

      {open && (
        <div
          role="menu"
          aria-label={`${label} as`}
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-lg border border-white/10 bg-obsidian-800 shadow-glow"
        >
          <a
            role="menuitem"
            href={publisherHref}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
          >
            Publisher
          </a>
          <a
            role="menuitem"
            href={advertiserHref}
            onClick={() => setOpen(false)}
            className="block border-t border-white/[0.06] px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
          >
            Advertiser
          </a>
        </div>
      )}
    </div>
  );
}
