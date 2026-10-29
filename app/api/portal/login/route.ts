import { NextRequest, NextResponse } from "next/server";
import { callDaotra, DaotraUnavailableError } from "@/lib/daotra-api";
import { setSessionCookie } from "@/lib/portal-session";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isSameOrigin } from "@/lib/request-guards";
import { loginSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" };

function reply(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

// Publisher sign-in. Daotra checks the password (Argon2id), the lockout and the
// Publisher's stage — a login is permitted from Pending onward (BD-71) — and
// issues an opaque session token. The token goes into an HttpOnly cookie and is
// never returned to the browser's JavaScript. Every refusal is one answer, so
// the form cannot tell an unknown email from a wrong password or a locked one.
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return reply(403, { error: "forbidden" });

  const ip = clientIp(req.headers);
  const { success: withinLimit } = await rateLimit(`login:${ip ?? "unknown"}`, 10, 60_000);
  if (!withinLimit) {
    return reply(429, { error: "rate_limited", message: "Too many attempts. Please try again in a minute." });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return reply(400, { error: "invalid_request" });
  }
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return reply(422, { error: "invalid_submission" });
  if (parsed.data.website) return reply(401, { error: "authentication_failed" });

  let result;
  try {
    result = await callDaotra("/portal/auth/login", {
      method: "POST",
      json: { email: parsed.data.email, password: parsed.data.password },
      clientIp: ip,
    });
  } catch (error) {
    if (error instanceof DaotraUnavailableError) {
      return reply(503, { error: "unavailable", message: "Sign-in is temporarily unavailable." });
    }
    throw error;
  }

  if (result.status === 200) {
    const { token, expires_at: expiresAt } = (result.body ?? {}) as { token?: string; expires_at?: string };
    if (!token || !expiresAt) return reply(502, { error: "unavailable" });
    const response = reply(200, { ok: true });
    setSessionCookie(response, token, expiresAt);
    return response;
  }
  if (result.status === 429) {
    return reply(429, { error: "rate_limited", message: "Too many attempts. Please try again later." });
  }
  if (result.status === 401 || result.status === 422) {
    return reply(401, { error: "authentication_failed", message: "Incorrect email or password." });
  }
  return reply(502, { error: "unavailable", message: "Sign-in is temporarily unavailable." });
}
