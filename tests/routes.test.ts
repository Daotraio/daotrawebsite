// The website's server routes, driven as Next.js handlers with the Daotra API
// replaced by a recording fake. What is pinned: what crosses to Daotra (and what
// never does), how Daotra's answers are translated, the session cookie, the
// same-origin guard, and that nothing is logged.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as register } from "@/app/api/register/route";
import { PRIVACY, TERMS } from "@/lib/legal";
import { POST as login } from "@/app/api/portal/login/route";
import { POST as logout } from "@/app/api/portal/logout/route";
import { POST as resetPassword } from "@/app/api/portal/reset-password/route";

const API = "https://api.daotra.test";
const SECRET = "gateway-secret-for-tests-0123456789abcdef";
const HOST = "aff.daotra.test";

type Call = { url: string; init: RequestInit };
let calls: Call[] = [];
let reply: { status: number; body?: unknown } = { status: 200 };
let logged: string[] = [];
let counter = 0;

function ip(): string {
  counter += 1;
  return `203.0.113.${counter % 250}`;
}

function request(path: string, body: unknown, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(`https://${HOST}${path}`, {
    method: "POST",
    headers: {
      host: HOST,
      "content-type": "application/json",
      "sec-fetch-site": "same-origin",
      "cf-connecting-ip": ip(),
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const form = {
  name: "Northwind Media",
  affiliateManager: "manager@daotra.example",
  contactName: "Ada Contact",
  email: "owner@northwind.example",
  telegram: "@ada_northwind",
  teams: "",
  legalName: "Northwind Media Ltd",
  registrationNumber: "NW-001234",
  country: "GB",
  address: "",
  password: "a-long-enough-password",
  acceptTerms: true,
};

beforeEach(() => {
  calls = [];
  logged = [];
  reply = { status: 200 };
  vi.stubEnv("DAOTRA_API_BASE_URL", API);
  vi.stubEnv("DAOTRA_WEBSITE_GATEWAY_SECRET", SECRET);
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(reply.body === undefined ? "" : JSON.stringify(reply.body), { status: reply.status });
    }),
  );
  for (const level of ["log", "info", "warn", "error", "debug"] as const) {
    vi.spyOn(console, level).mockImplementation((...args: unknown[]) => {
      logged.push(JSON.stringify(args));
    });
  }
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function sent(): Record<string, unknown> {
  expect(calls).toHaveLength(1);
  return JSON.parse(String(calls[0]!.init.body)) as Record<string, unknown>;
}

function header(name: string): string | null {
  return new Headers(calls[0]!.init.headers).get(name);
}

describe("POST /api/register", () => {
  it("forwards every field under Daotra's names, with the gateway headers, and logs nothing", async () => {
    reply = { status: 202, body: { status: "received" } };
    const req = request("/api/register", form);
    const res = await register(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(calls[0]!.url).toBe(`${API}/public/publisher-registrations`);
    expect(sent()).toEqual({
      name: "Northwind Media",
      email: "owner@northwind.example",
      password: "a-long-enough-password",
      contact_name: "Ada Contact",
      telegram: "@ada_northwind",
      teams: null,
      legal_name: "Northwind Media Ltd",
      registration_number: "NW-001234",
      country: "GB",
      address: null,
      requested_affiliate_manager_email: "manager@daotra.example",
      terms_accepted: true,
      terms_version: TERMS.version,
      privacy_version: PRIVACY.version,
    });
    expect(header("x-daotra-gateway-auth")).toBe(SECRET);
    expect(header("x-daotra-client-ip")).toBe(req.headers.get("cf-connecting-ip"));
    expect(logged).toEqual([]);
  });

  it("refuses a registration without the Terms & Privacy acceptance", async () => {
    const res = await register(request("/api/register", { ...form, acceptTerms: false }));
    expect(res.status).toBe(422);
    expect(calls).toHaveLength(0);
  });

  it("never accepts a Verify Password from the browser", async () => {
    const res = await register(request("/api/register", { ...form, confirmPassword: form.password }));
    expect(res.status).toBe(422);
    expect(calls).toHaveLength(0);
  });

  it("refuses a cross-site or origin-less request", async () => {
    const cross = await register(request("/api/register", form, { "sec-fetch-site": "cross-site" }));
    expect(cross.status).toBe(403);
    const bare = new NextRequest(`https://${HOST}/api/register`, {
      method: "POST",
      headers: { host: HOST, "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    expect((await register(bare)).status).toBe(403);
    expect(calls).toHaveLength(0);
  });

  it("names a taken Publisher name and an invalid country", async () => {
    reply = { status: 409, body: { error: "publisher_name_taken", message: "x" } };
    const taken = await register(request("/api/register", form));
    expect(taken.status).toBe(409);
    expect(await taken.json()).toMatchObject({ error: "publisher_name_taken", field: "name" });

    calls = [];
    reply = { status: 422, body: { error: "country_invalid", message: "x" } };
    const country = await register(request("/api/register", form));
    expect(country.status).toBe(422);
    expect(await country.json()).toMatchObject({ error: "country_invalid", field: "country" });
  });

  it("answers 503 when Daotra is not configured, never a false success", async () => {
    vi.stubEnv("DAOTRA_API_BASE_URL", "");
    const res = await register(request("/api/register", form));
    expect(res.status).toBe(503);
  });

  it("drops a honeypot submission without calling Daotra", async () => {
    // The honeypot must be empty (`max(0)`), so a filled one fails validation.
    const res = await register(request("/api/register", { ...form, website: "spam" }));
    expect(res.status).toBe(422);
    expect(calls).toHaveLength(0);
  });
});

describe("POST /api/portal/login", () => {
  it("keeps the session token in an HttpOnly cookie and out of the response body", async () => {
    reply = { status: 200, body: { token: "opaque-session-token", expires_at: new Date(Date.now() + 3600_000).toISOString() } };
    const res = await login(request("/api/portal/login", { email: "owner@northwind.example", password: "pw" }));

    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).not.toContain("opaque-session-token");
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("daotra_portal=opaque-session-token");
    expect(cookie.toLowerCase()).toContain("httponly");
    expect(cookie.toLowerCase()).toContain("samesite=lax");
    expect(cookie).toContain("Path=/");
    expect(sent()).toEqual({ email: "owner@northwind.example", password: "pw" });
    expect(logged).toEqual([]);
  });

  it("answers every refusal the same way", async () => {
    reply = { status: 401, body: { error: "authentication_failed", message: "Authentication failed." } };
    const res = await login(request("/api/portal/login", { email: "a@b.example", password: "wrong" }));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "authentication_failed", message: "Incorrect email or password." });
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("refuses a cross-site login", async () => {
    const res = await login(
      request("/api/portal/login", { email: "a@b.example", password: "pw" }, { "sec-fetch-site": "cross-site" }),
    );
    expect(res.status).toBe(403);
    expect(calls).toHaveLength(0);
  });
});

describe("POST /api/portal/logout", () => {
  it("revokes the session in Daotra and clears the cookie", async () => {
    reply = { status: 204 };
    const res = await logout(request("/api/portal/logout", {}, { cookie: "daotra_portal=opaque-session-token" }));
    expect(res.status).toBe(200);
    expect(calls[0]!.url).toBe(`${API}/portal/auth/logout`);
    expect(header("authorization")).toBe("Bearer opaque-session-token");
    expect(res.headers.get("set-cookie")).toMatch(/daotra_portal=;.*Max-Age=0/i);
  });
});

describe("POST /api/portal/reset-password", () => {
  const token = "t".repeat(43);

  it("forwards only the token and the new password, and clears any session cookie", async () => {
    reply = { status: 200, body: { status: "accepted" } };
    const res = await resetPassword(request("/api/portal/reset-password", { token, password: "a-brand-new-password" }));
    expect(res.status).toBe(200);
    expect(sent()).toEqual({ token, password: "a-brand-new-password" });
    expect(res.headers.get("set-cookie")).toMatch(/Max-Age=0/i);
    expect(logged).toEqual([]);
  });

  it("says a spent or expired link is not valid", async () => {
    reply = { status: 400, body: { error: "credential_token_invalid", message: "This link is not valid." } };
    const res = await resetPassword(request("/api/portal/reset-password", { token, password: "a-brand-new-password" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "link_invalid" });
  });

  it("refuses a short password and a Verify Password before calling Daotra", async () => {
    expect((await resetPassword(request("/api/portal/reset-password", { token, password: "short" }))).status).toBe(422);
    expect(
      (
        await resetPassword(
          request("/api/portal/reset-password", { token, password: "a-brand-new-password", confirmPassword: "x" }),
        )
      ).status,
    ).toBe(422);
    expect(calls).toHaveLength(0);
  });
});
