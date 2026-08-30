import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Subdomain routing:
 *   aff.daotra.io/*  -> internally served from /portal/publisher/*
 *   adv.daotra.io/*  -> internally served from /portal/advertiser/*
 *   daotra.io/*       -> untouched (the marketing site in app/*)
 *
 * This is the standard Next.js "multi-tenant subdomain" middleware pattern:
 * one deployed app, host-based rewrite. On Cloudflare, aff.daotra.io and
 * adv.daotra.io both need to be added as Custom Domains pointing at the same
 * Worker (see README) - this file is what makes a single Worker able to
 * serve three different hostnames correctly.
 *
 * /register and /login are public on each subdomain; everything else under
 * a subdomain is a dashboard route and requires a session whose role matches
 * that subdomain.
 */
export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  const isPublisherPortal = host.startsWith("aff.");
  const isAdvertiserPortal = host.startsWith("adv.");

  if (!isPublisherPortal && !isAdvertiserPortal) {
    return NextResponse.next();
  }

  const role: "publisher" | "advertiser" = isPublisherPortal ? "publisher" : "advertiser";
  const portalSegment = isPublisherPortal ? "publisher" : "advertiser";

  const isPublicPortalPath =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/");

  if (!isPublicPortalPath) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const loginUrl = new URL("/login", req.url); // req.url preserves the subdomain host
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== role) {
      // Signed in, but on the wrong portal for their account type (e.g. an
      // advertiser hitting aff.daotra.io) - bounce to their own portal
      // rather than showing a confusing 403.
      const correctHost = isPublisherPortal
        ? host.replace(/^aff\./, "adv.")
        : host.replace(/^adv\./, "aff.");
      const redirectUrl = new URL(req.url);
      redirectUrl.host = correctHost;
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = `/portal/${portalSegment}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on everything except static assets, images, and API routes (API
  // routes are host-agnostic and don't need rewriting).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
