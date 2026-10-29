import type { NextRequest } from "next/server";

/**
 * Whether a state-changing request came from this site's own pages.
 *
 * The CSRF guard for every POST route that acts with — or creates — a
 * Publisher session. Browsers send `Sec-Fetch-Site` on every request; one too
 * old to send it still sends `Origin` on a POST, which must name this host. A
 * request carrying neither is refused: these routes are only ever called by our
 * own forms, never by a server or a script.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const site = req.headers.get("sec-fetch-site");
  if (site) return site === "same-origin";
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

/**
 * The browser's address, for rate limiting and for Daotra's per-address limits.
 *
 * Only `CF-Connecting-IP`: on Cloudflare it is set by the edge and cannot be
 * supplied by the client, unlike `X-Forwarded-For`, which a caller can write
 * freely. `null` where it is absent (local development) — never a guess.
 */
export function clientIp(headers: Headers): string | null {
  const value = headers.get("cf-connecting-ip")?.trim();
  return value ? value : null;
}
