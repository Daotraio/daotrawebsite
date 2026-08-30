import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation/contact";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
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

  // NOTE: no email/CRM provider is wired up in this codebase - plug your
  // provider of choice here (e.g. Resend, SendGrid, or a CRM webhook) using
  // an API key from process.env. Keeping delivery out of this repo avoids
  // hardcoding a vendor choice or a secret that isn't actually configured.
  const { name, email, company, inquiryType, message } = parsed.data;
  console.info("[contact] new inquiry", { name, email, company, inquiryType, messageLength: message.length });

  return NextResponse.json({ ok: true });
}
