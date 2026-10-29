// The Publisher's portal session, as the website holds it.
//
// The session IS Daotra's: an opaque token issued by `POST /portal/auth/login`,
// stored by Daotra only as a SHA-256 digest and revocable there at any moment
// (logout, a password reset, a staff "revoke sessions", a disabled login). The
// website keeps that token in one cookie and nothing else — no JWT, no copy of
// the identity — and asks Daotra who the caller is on every page that needs it.
//
// The cookie is HttpOnly (no browser JavaScript can read the token), Secure and
// `__Host-` prefixed outside development (sent only over HTTPS, only to this
// exact host, path `/`), and SameSite=Lax (not sent on cross-site POSTs; the
// routes also check the request's origin).

import type { NextResponse } from "next/server";
import { callDaotra } from "@/lib/daotra-api";

if (typeof window !== "undefined") {
  throw new Error("lib/portal-session is server-only");
}

const SECURE = process.env.NODE_ENV === "production";

/** `__Host-` requires Secure, so local http development uses the plain name. */
export const SESSION_COOKIE = SECURE ? "__Host-daotra_portal" : "daotra_portal";

export function setSessionCookie(response: NextResponse, token: string, expiresAt: string): void {
  const seconds = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(0, seconds),
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** Who Daotra says the session belongs to — its own data only (`GET /portal/me`). */
export interface PortalIdentity {
  publisher_id: string;
  publisher_name: string;
  portal_role: string;
  email: string | null;
}

/**
 * The signed-in Publisher, or null when there is no live session.
 *
 * Asked of Daotra on every call: a session revoked there (logout elsewhere, a
 * reset, a disabled login, a legacy Publisher status) is gone here at once.
 * An unreachable Daotra throws — it is not "signed out".
 */
export async function fetchPortalIdentity(token: string | undefined): Promise<PortalIdentity | null> {
  if (!token) return null;
  const { status, body } = await callDaotra("/portal/me", { token });
  if (status === 401 || status === 403) return null;
  if (status !== 200 || !body || typeof body !== "object") {
    throw new Error(`unexpected /portal/me status ${status}`);
  }
  return body as PortalIdentity;
}

