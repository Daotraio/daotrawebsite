import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation/contact";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request-guards";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers) ?? "unknown";
  const { success: withinLimit } = await rateLimit(`contact:${ip}`, 5, 60_000);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // Honeypot tripped -> silently report success so bots don't learn to avoid it,
  // but never actually queue the message.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  // OWNER DECISION PENDING (Daotra audit AUD-27): no delivery channel exists.
  // Where an inquiry goes (an email provider, a CRM, a Daotra endpoint) is a
  // business and privacy decision that has not been made, so none is invented
  // here, and the inquiry is not stored anywhere.
  //
  // The sender's personal information — name, email, company, Telegram handle,
  // message — is NEVER logged: Workers Logs retain console output, with no
  // stated retention basis for personal data. Only non-identifying facts are.
  console.warn("[contact] inquiry accepted but not delivered: no delivery channel is configured", {
    messageLength: parsed.data.message.length,
    hasCompany: Boolean(parsed.data.company),
  });

  return NextResponse.json({ ok: true });
}
