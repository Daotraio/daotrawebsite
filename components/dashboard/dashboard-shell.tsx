"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu, X, Orbit } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

// Icons by name: a server layout passes these props, and a component function
// cannot cross from a Server Component into a Client Component.
const ICONS = { overview: LayoutDashboard } as const;

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
}

// The signed-in account is passed in by the server layout, which asked Daotra
// (`GET /portal/me`) — this client component holds no session of its own.
export function DashboardShell({
  roleLabel,
  navItems,
  account,
  loginHref,
  children,
}: {
  roleLabel: string;
  navItems: DashboardNavItem[];
  account: { email: string; name: string };
  loginHref: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = ICONS[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground",
              active && "bg-white/[0.06] text-accent-silver"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-obsidian-900">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.06] bg-obsidian-950 py-6 md:flex">
        <Link href="https://daotra.io" className="mb-8 flex items-center gap-2 px-6">
          <Orbit className="h-6 w-6 text-accent-silver" />
          <span className="font-display text-lg font-semibold tracking-tight">Daotra</span>
        </Link>
        {nav}
        <div className="mt-auto px-3 pt-6">
          <SignOutButton loginHref={loginHref} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-white/[0.06] bg-obsidian-900/80 px-4 backdrop-blur-xl md:px-8">
          <button
            className="flex h-11 w-11 items-center justify-center text-foreground md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="hidden md:block">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{roleLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{account.email}</span>
            <div
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-graphite to-accent-silver text-sm font-semibold text-obsidian-950"
            >
              {(account.name || account.email || "?").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="border-b border-white/[0.06] bg-obsidian-950 py-4 md:hidden">
            {nav}
            <div className="px-3 pt-4">
              <SignOutButton loginHref={loginHref} />
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
