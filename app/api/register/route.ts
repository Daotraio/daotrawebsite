import { NextRequest, NextResponse } from "next/server";
import { callDaotra, DaotraUnavailableError, errorCode } from "@/lib/daotra-api";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isSameOrigin } from "@/lib/request-guards";
import { publisherRegisterRequestSchema, toDaotraRegistration } from "@/lib/validation/auth";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" };

function reply(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

// Publisher registration (BD-71 as amended 2026-10-29): the form's fields go to
// Daotra, which creates the Publisher in Pending and its login, atomically.
// Nothing is stored here and NOTHING IS LOGGED — the body holds a password and
// the registrant's personal data. Advertisers never self-register (BD-66), so
// this route accepts the Publisher form only.
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return reply(403, { error: "forbidden" });

  const ip = clientIp(req.headers);
  const { success: withinLimit } = await rateLimit(`register:${ip ?? "unknown"}`, 5, 60_000);
  if (!withinLimit) {
    return reply(429, { error: "rate_limited", message: "Too many attempts. Please try again in a minute." });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return reply(400, { error: "invalid_request" });
  }

  const parsed = publisherRegisterRequestSchema.safeParse(body);
  if (!parsed.success) {
    // Field names and messages only — never the submitted values.
    return reply(422, { error: "invalid_submission", fields: parsed.error.flatten().fieldErrors });
  }
  if (parsed.data.website) {
    // Honeypot tripped: answer as a registration would, record nothing.
    return reply(200, { ok: true });
  }

  let result;
  try {
    result = await callDaotra("/public/publisher-registrations", {
      method: "POST",
      json: toDaotraRegistration(parsed.data),
      clientIp: ip,
    });
  } catch (error) {
    if (error instanceof DaotraUnavailableError) {
      return reply(503, { error: "unavailable", message: "Registration is temporarily unavailable." });
    }
    throw error;
  }

  const code = errorCode(result.body);
  if (result.status === 202) {
    // The same answer whether or not the email already held an account —
    // Daotra does not say, and neither do we.
    return reply(200, { ok: true });
  }
  if (result.status === 409 && code === "publisher_name_taken") {
    return reply(409, {
      error: code,
      field: "name",
      message: "This Publisher name is already registered. Choose a different name.",
    });
  }
  if (result.status === 422 && code === "country_invalid") {
    return reply(422, { error: code, field: "country", message: "Select a valid country." });
  }
  if (result.status === 429) {
    return reply(429, { error: "rate_limited", message: "Too many attempts. Please try again later." });
  }
  if (result.status === 422) {
    return reply(422, { error: "invalid_submission" });
  }
  return reply(502, { error: "unavailable", message: "Registration is temporarily unavailable." });
}
