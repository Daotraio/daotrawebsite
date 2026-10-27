"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { COUNTRIES, getCountryName } from "@/lib/countries";
import { cn } from "@/lib/utils";

interface CountrySelectProps {
  id?: string;
  /** ISO 3166-1 alpha-2 code, or "" when nothing is selected. */
  value: string;
  onChange: (code: string) => void;
  invalid?: boolean;
}

// Searchable country picker. Custom-built (not a native <select>/<datalist>)
// for the same reason as SelectMenu: native popups are drawn by the browser
// and ignore our dark theme - and with 249 options, type-to-filter matters.
export function CountrySelect({ id, value, onChange, invalid }: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const listId = `${id ?? "country"}-listbox`;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q)) : COUNTRIES;
  }, [query]);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Keep the keyboard-highlighted option in view as the user arrows through.
  React.useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const select = (code: string) => {
    onChange(code);
    setOpen(false);
    setQuery("");
  };

  const openList = () => {
    if (open) return;
    setQuery("");
    const selectedIndex = COUNTRIES.findIndex((c) => c.code === value);
    setActiveIndex(Math.max(selectedIndex, 0));
    setOpen(true);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        // Never let Enter submit the surrounding form while the list is open.
        if (open) {
          e.preventDefault();
          const choice = filtered[activeIndex];
          if (choice) select(choice.code);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
          setQuery("");
        }
        break;
      case "Tab":
        setOpen(false);
        setQuery("");
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid || undefined}
        aria-activedescendant={open && filtered[activeIndex] ? `${listId}-${filtered[activeIndex].code}` : undefined}
        autoComplete="off"
        placeholder="Select a country"
        value={open ? query : value ? getCountryName(value) : ""}
        onFocus={openList}
        onClick={openList}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className={cn(
          "w-full rounded-md border bg-white/[0.03] py-2.5 pl-4 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent-silver focus:ring-1 focus:ring-accent-silver",
          invalid ? "border-destructive" : "border-white/15"
        )}
      />
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-transform",
          open && "rotate-180"
        )}
      />

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-2 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-obsidian-800 py-1 shadow-glow"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-2.5 text-sm text-muted-foreground">No matching country</li>
          ) : (
            filtered.map((c, i) => (
              <li
                key={c.code}
                id={`${listId}-${c.code}`}
                role="option"
                aria-selected={c.code === value}
                data-index={i}
                // mousedown (not click) so the choice lands before the input blurs.
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(c.code);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors",
                  i === activeIndex ? "bg-white/[0.06] text-foreground" : "text-muted-foreground"
                )}
              >
                {c.name}
                {c.code === value && <Check className="h-4 w-4 text-accent-silver" />}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
