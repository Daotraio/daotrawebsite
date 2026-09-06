"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectMenuOption {
  value: string;
  label: string;
}

interface SelectMenuProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectMenuOption[];
  className?: string;
  "aria-label"?: string;
}

const fieldClasses =
  "w-full rounded-md border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent-silver focus:ring-1 focus:ring-accent-silver disabled:opacity-50";

// A fully custom-styled dropdown, not a native <select> - the native
// element's options popup is drawn by the OS/browser and ignores our CSS
// (color-scheme:dark isn't reliably honored across browsers), so it kept
// rendering with a light background. Building our own listbox means every
// pixel is ours to style.
export function SelectMenu({ id, value, onChange, options, className, ...aria }: SelectMenuProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

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
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        {...aria}
        className={cn(fieldClasses, "flex items-center justify-between gap-2 text-left")}
      >
        <span>{selected?.label ?? ""}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-lg border border-white/10 bg-obsidian-800 shadow-glow"
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.05]",
                o.value === value ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {o.label}
              {o.value === value && <Check className="h-4 w-4 text-accent-silver" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
