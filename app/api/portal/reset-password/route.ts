import { NextRequest, NextResponse } from "next/server";
import { callDaotra, DaotraUnavailableError } from "@/lib/daotra-api";
import { clearSessionCookie } from "@/lib/portal-session";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isSameOrigin } from "@/lib/request-guards";
import { resetPasswordRequestSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" };

function reply(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

// Redeem a staff-issued, one-time reset link (BD-71 as amended 2026-10-29).
// Daotra consumes the token (single-use, short-lived), sets the new password and
// revokes every session of the account. No session is issued: the Publisher
// signs in afterwards with the new password. The token and the password are
// never logged.
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return reply(403, { error: "forbidden" });

  const ip = clientIp(req.headers);
  const { success: withinLimit } = await rateLimit(`reset:${ip ?? "unknown"}`, 10, 60_000);
  if (!withinLimit) {
    return reply(429, { error: "rate_limited", message: "Too many attempts. Please try again in a minute." });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return reply(400, { error: "invalid_request" });
  }
  const parsed = resetPasswordRequestSchema.safeParse(body);
  if (!parsed.success) return reply(422, { error: "invalid_submission" });

  let result;
  try {
    result = await callDaotra("/portal/auth/reset-password", {
      method: "POST",
      json: { token: parsed.data.token, password: parsed.data.password },
      clientIp: ip,
    });
  } catch (error) {
    if (error instanceof DaotraUnavailableError) {
      return reply(503, { error: "unavailable", message: "Password reset is temporarily unavailable." });
    }
    throw error;
  }

  if (result.status === 200) {
    // Any session this browser held was revoked with the reset.
    const response = reply(200, { ok: true });
    clearSessionCookie(response);
    return response;
  }
  if (result.status === 400) {
    return reply(400, {
      error: "link_invalid",
      message: "This link is not valid. It may have expired or already been used — ask Daotra for a new one.",
    });
  }
  if (result.status === 429) {
    return reply(429, { error: "rate_limited", message: "Too many attempts. Please try again later." });
  }
  if (result.status === 422) return reply(422, { error: "invalid_submission" });
  return reply(502, { error: "unavailable", message: "Password reset is temporarily unavailable." });
}
