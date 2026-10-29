import { NextRequest, NextResponse } from "next/server";

/**
 * Subdomain routing:
 *   aff.daotra.io/*  -> internally served from /portal/publisher/* (the Publisher
 *                       portal's official hostname — Daotra BD-40 as amended)
 *   adv.daotra.io/*  -> redirected to the public Advertisers page: the Advertiser
 *                       portal is cancelled (BD-40 as amended 2026-10-29); this
 *                       only catches a stale link while the custom domain exists
 *   daotra.io/*       -> untouched (the marketing site in app/*)
 *
 * The standard Next.js "multi-tenant subdomain" pattern: one deployed app,
 * host-based rewrite. On Cloudflare, aff.daotra.io is a Custom Domain pointing
 * at the same Worker (see README).
 *
 * /register and /login (with everything under /login/ — forgot password and the
 * reset-password page) are public on aff. Any other Publisher path needs the
 * session cookie, or it goes to /login. This is a fast redirect, not the
 * authentication check: the portal layout asks Daotra whether the session is
 * live on every request (lib/portal-session.ts).
 */
const SESSION_COOKIES = ["__Host-daotra_portal", "daotra_portal"];

/**
 * Set on requests for /portal/* pages served WITHOUT a portal subdomain (the
 * staging workers.dev host, local dev), so the root layout leaves out the
 * marketing header and footer there too. Always overwritten here: a value the
 * client sends is never passed through.
 */
const PORTAL_ROUTE_HEADER = "x-daotra-portal-route";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  if (host.startsWith("adv.")) {
    return NextResponse.redirect("https://daotra.io/advertisers", 308);
  }

  const isPublisherPortal = host.startsWith("aff.");

  // The policies a registrant accepts, served from the same deployment that
  // records their version (lib/legal.ts) — public, never rewritten into the portal.
  if (isPublisherPortal && (pathname === "/terms" || pathname === "/privacy")) {
    return NextResponse.next();
  }

  if (!isPublisherPortal) {
    const headers = new Headers(req.headers);
    if (pathname.startsWith("/portal/")) headers.set(PORTAL_ROUTE_HEADER, "1");
    else headers.delete(PORTAL_ROUTE_HEADER);
    return NextResponse.next({ request: { headers } });
  }

  const isPublicPortalPath =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/");

  if (!isPublicPortalPath) {
    const hasSession = SESSION_COOKIES.some((name) => Boolean(req.cookies.get(name)?.value));
    if (!hasSession) {
      const loginUrl = new URL("/login", req.url); // req.url preserves the subdomain host
      return NextResponse.redirect(loginUrl);
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = `/portal/publisher${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on everything except static assets, images, and API routes (API
  // routes are host-agnostic and don't need rewriting).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
