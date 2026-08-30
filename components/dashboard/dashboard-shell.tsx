"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Orbit, LogOut, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function DashboardShell({
  roleLabel,
  navItems,
  children,
}: {
  roleLabel: string;
  navItems: DashboardNavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground",
              active && "bg-white/[0.06] text-accent-cyan"
            )}
          >
            <item.icon className="h-4 w-4" />
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
          <Orbit className="h-6 w-6 text-accent-cyan" />
          <span className="font-display text-lg font-semibold tracking-tight">Daotra</span>
        </Link>
        {nav}
        <div className="mt-auto px-3 pt-6">
          <button
            onClick={() => signOut({ callbackUrl: "https://daotra.io" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
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
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session?.user?.email ?? "Not signed in"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan text-sm font-semibold text-obsidian-950">
              {(session?.user?.name ?? "?").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="border-b border-white/[0.06] bg-obsidian-950 py-4 md:hidden">
            {nav}
            <div className="px-3 pt-4">
              <button
                onClick={() => signOut({ callbackUrl: "https://daotra.io" })}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
