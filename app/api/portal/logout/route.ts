import { NextRequest, NextResponse } from "next/server";
import { callDaotra, DaotraUnavailableError } from "@/lib/daotra-api";
import { clearSessionCookie, SESSION_COOKIE } from "@/lib/portal-session";
import { clientIp, isSameOrigin } from "@/lib/request-guards";

export const runtime = "nodejs";

// Sign out: the session is revoked in Daotra (server-side, effective at once,
// on every device that held this token) and the cookie is cleared here. The
// cookie is cleared even when Daotra cannot be reached, so the browser never
// keeps a session the user asked to end.
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      await callDaotra("/portal/auth/logout", { method: "POST", token, clientIp: clientIp(req.headers) });
    } catch (error) {
      if (!(error instanceof DaotraUnavailableError)) throw error;
    }
  }
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  clearSessionCookie(response);
  return response;
}
