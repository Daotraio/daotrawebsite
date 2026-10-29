"use client";

// The Publisher Portal's frame — the Daotra Admin's AppShell, for Publishers
// (Daotraio/daotra: frontend/admin/src/layout/AppShell.tsx): a dark sidebar with
// the brand and sectioned navigation, a sticky header with breadcrumbs and the
// account menu, and the light content canvas. Styles: components/portal/portal.css.
//
// The account shown is what the server layout received from Daotra
// (`GET /portal/me`); this component holds no session of its own.

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, LayoutDashboard, LogOut, Menu, X } from "lucide-react";

const ICONS = { overview: LayoutDashboard } as const;

export interface PortalNavArea {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
}

export interface PortalNavSection {
  title: string;
  areas: PortalNavArea[];
}

export interface PortalAccount {
  email: string;
  publisherName: string;
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden>
      <svg width="16" height="16" viewBox="0 0 32 32">
        <path d="M9 7h7.5a9 9 0 0 1 0 18H9z" fill="none" stroke="#7c83ff" strokeWidth="3.4" />
      </svg>
    </span>
  );
}

function initials(value: string): string {
  const letters = value.replace(/@.*/, "").split(/[.\s_-]+/).filter(Boolean);
  return ((letters[0]?.[0] ?? "?") + (letters[1]?.[0] ?? "")).toUpperCase();
}

function AccountMenu({ account, loginHref }: { account: PortalAccount; loginHref: string }) {
  const [open, setOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  // Revokes the session in Daotra and clears the cookie (/api/portal/logout).
  const signOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/portal/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      window.location.assign(loginHref);
    }
  };

  return (
    <div className="user-menu" ref={ref}>
      <button
        type="button"
        className="user-button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="avatar">{initials(account.email || account.publisherName)}</span>
        <span className="user-meta">
          <div className="email">{account.email}</div>
          <div className="role">{account.publisherName}</div>
        </span>
        <ChevronDown size={14} className="muted" />
      </button>
      {open ? (
        <div className="menu" role="menu">
          <div className="menu-head">
            <strong>{account.email}</strong>
            {account.publisherName}
          </div>
          <button type="button" role="menuitem" className="menu-item" onClick={signOut} disabled={signingOut}>
            <LogOut size={14} /> {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function PortalShell({
  navigation,
  account,
  loginHref,
  children,
}: {
  navigation: PortalNavSection[];
  account: PortalAccount;
  loginHref: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = React.useState(false);

  const section = navigation.find((s) => s.areas.some((a) => a.href === pathname));
  const area = section?.areas.find((a) => a.href === pathname);

  return (
    <div className={`shell ${navOpen ? "nav-open" : ""}`}>
      <aside className="sidebar" id="portal-sidebar">
        <div className="brand">
          <BrandMark />
          <span className="brand-name">Daotra</span>
          <span className="brand-tag">Publisher</span>
        </div>
        <nav className="nav" aria-label="Publisher portal">
          {navigation.map((s) => (
            <div key={s.title}>
              <div className="nav-section">{s.title}</div>
              {s.areas.map((a) => {
                const Icon = ICONS[a.icon];
                return (
                  <Link
                    key={a.href}
                    href={a.href}
                    className={`nav-link ${a.href === pathname ? "active" : ""}`}
                    aria-current={a.href === pathname ? "page" : undefined}
                    onClick={() => setNavOpen(false)}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    <span>{a.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="nav-foot">{account.publisherName}</div>
      </aside>
      {navOpen ? <div className="scrim" onClick={() => setNavOpen(false)} aria-hidden /> : null}
      <div className="main">
        <header className="header">
          <button
            type="button"
            className="menu-toggle"
            aria-label={navOpen ? "Close navigation" : "Open navigation"}
            aria-controls="portal-sidebar"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((v) => !v)}
          >
            {navOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="crumbs">
            {section ? (
              <>
                <span>{section.title}</span>
                <ChevronRight size={13} />
              </>
            ) : null}
            <strong>{area?.label ?? "Publisher portal"}</strong>
          </div>
          <div className="header-spacer" />
          <AccountMenu account={account} loginHref={loginHref} />
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
