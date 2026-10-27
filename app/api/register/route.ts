import { NextRequest, NextResponse } from "next/server";
import { portalRegisterSchema, publisherRegisterSchema } from "@/lib/validation/auth";
import { getCountryName } from "@/lib/countries";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { success: withinLimit } = await rateLimit(`register:${ip}`, 5, 60_000);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Publishers submit the fuller registration form (aff.daotra.io/register);
  // anything else goes through the original four-field application schema.
  const isPublisher =
    typeof body === "object" && body !== null && (body as { role?: unknown }).role === "publisher";

  if (isPublisher) {
    const parsed = publisherRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission.", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    if (parsed.data.website) {
      // Honeypot tripped - report success without recording anything.
      return NextResponse.json({ ok: true });
    }

    // NOTE: no database or CRM is wired into this codebase yet, so a
    // registration is only logged today (visible in the Worker's logs). Persist
    // it here - and notify whoever reviews registrations - once the
    // destination is chosen (Daotra's CRM/tracking platform, a DB table, an
    // email/Telegram notification). Credentials are issued after approval;
    // this route doesn't create an account.
    const { website: _honeypot, country, telegram, ...rest } = parsed.data;
    console.info("[register] new publisher registration", {
      ...rest,
      telegram: `@${telegram}`,
      country: `${getCountryName(country)} (${country})`,
    });

    return NextResponse.json({ ok: true });
  }

  const parsed = portalRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  if (parsed.data.website) {
    // Honeypot tripped - report success without recording anything.
    return NextResponse.json({ ok: true });
  }

  // NOTE: no database is wired into this codebase (see .env.example -
  // DATABASE_URL). Persist the application here once you've picked a
  // provider, e.g.:
  //   await db.applications.create({ data: { ...parsed.data, status: "pending" } })
  // and trigger your approval workflow (email/Telegram notification to the
  // ops team, a review queue in an internal tool, etc). Once approved, the
  // applicant needs an actual account + password created - this route only
  // captures the application today.
  const { role, companyName, fullName, email, telegram } = parsed.data;
  console.info("[register] new application", { role, companyName, fullName, email, telegram });

  return NextResponse.json({ ok: true });
}
