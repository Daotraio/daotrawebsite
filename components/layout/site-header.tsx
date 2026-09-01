"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Orbit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/publishers", label: "Publishers" },
  { href: "/advertisers", label: "Advertisers" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-obsidian-900/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 group" aria-label="Daotra home">
          <Orbit className="h-6 w-6 text-accent-silver transition-transform duration-500 group-hover:rotate-90" />
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            Daotra
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "text-accent-silver"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Direct, single-click actions - no dropdown/modal step, and no raw
            URLs shown to the user. Each button navigates immediately. */}
        <div className="hidden md:flex items-center gap-1.5">
          <Button asChild variant="ghost" size="sm">
            <a href="https://aff.daotra.io/login">Publisher Login</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="https://adv.daotra.io/login">Advertiser Login</a>
          </Button>
          <span className="mx-1 h-5 w-px bg-white/10" aria-hidden="true" />
          <Button asChild variant="ghost" size="sm">
            <a href="https://aff.daotra.io/register">Publisher Register</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="https://adv.daotra.io/register">Advertiser Register</a>
          </Button>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-obsidian-900/95 backdrop-blur-xl">
          <nav className="container flex flex-col gap-1 py-4" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-4">
              <Button asChild variant="outline" size="md" onClick={() => setOpen(false)}>
                <a href="https://aff.daotra.io/login">Publisher Login</a>
              </Button>
              <Button asChild variant="outline" size="md" onClick={() => setOpen(false)}>
                <a href="https://adv.daotra.io/login">Advertiser Login</a>
              </Button>
              <Button asChild variant="outline" size="md" onClick={() => setOpen(false)}>
                <a href="https://aff.daotra.io/register">Publisher Register</a>
              </Button>
              <Button asChild variant="outline" size="md" onClick={() => setOpen(false)}>
                <a href="https://adv.daotra.io/register">Advertiser Register</a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
