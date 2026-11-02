// The Postbacks Log export route (Daotra BD-91 as amended 2026-11-02), driven as a Next.js
// handler with the Daotra API replaced by a recording fake. Pinned: what reaches Daotra (the
// session as a bearer, the allowlisted filters, never the page position or anything else in
// the URL), what returns to the browser (the file, as Daotra made it — or nothing), and the
// refusals (no session → login, a refused export → back to the log with a notice).
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import { GET as exportPostbacks } from "@/app/api/portal/postbacks/export/route";
import { EXPORT_ERROR_MESSAGES, parseExportError } from "@/lib/portal-business";

const API = "https://api.daotra.test";
const SECRET = "gateway-secret-for-tests-0123456789abcdef";
const HOST = "aff.daotra.test";
const CSV = "text/csv; charset=utf-8";
const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type Call = { url: string; init: RequestInit };
let calls: Call[] = [];
let reply: { status: number; body?: BodyInit; headers?: Record<string, string> };
let logged: string[] = [];

function request(query: string, cookie: string | null = "session-token-abc"): NextRequest {
  const headers: Record<string, string> = { host: HOST, "cf-connecting-ip": "203.0.113.7" };
  if (cookie) headers.cookie = `daotra_portal=${cookie}`;
  return new NextRequest(`https://${HOST}/api/portal/postbacks/export${query}`, { headers });
}

beforeEach(() => {
  calls = [];
  logged = [];
  reply = {
    status: 200,
    body: "Date (UTC),Event\n",
    headers: { "content-type": CSV, "content-disposition": 'attachment; filename="daotra-postbacks-20261102T093000Z.csv"' },
  };
  vi.stubEnv("DAOTRA_API_BASE_URL", API);
  vi.stubEnv("DAOTRA_WEBSITE_GATEWAY_SECRET", SECRET);
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(reply.body ?? null, { status: reply.status, headers: reply.headers });
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

describe("the Postbacks Log export route", () => {
  it("asks Daotra for the filtered export with the session, and nothing else from the URL", async () => {
    const response = await exportPostbacks(
      request("?format=csv&event_type=qftd&mid=mb2&publisher_click_id=Pub1&cursor=abc&publisher_id=B&export_format=xlsx"),
    );
    expect(response.status).toBe(200);
    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe(`${API}/portal/postbacks/export?export_format=csv&event_type=qftd&publisher_click_id=Pub1&mid=mb2`);
    const headers = calls[0]!.init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer session-token-abc");
    expect(headers["X-Daotra-Gateway-Auth"]).toBe(SECRET);
    expect(calls[0]!.init.redirect).toBe("manual");
  });

  it("returns Daotra's file as it is, never cached", async () => {
    reply = {
      status: 200,
      body: new Uint8Array([80, 75, 3, 4, 0, 255]),
      headers: { "content-type": XLSX, "content-disposition": 'attachment; filename="daotra-postbacks-20261102T093000Z.xlsx"' },
    };
    const response = await exportPostbacks(request("?format=xlsx"));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(XLSX);
    expect(response.headers.get("content-disposition")).toBe('attachment; filename="daotra-postbacks-20261102T093000Z.xlsx"');
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([80, 75, 3, 4, 0, 255]));
  });

  it("sends a browser without a session to the login, asking Daotra nothing", async () => {
    const response = await exportPostbacks(request("?format=csv", null));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(`https://${HOST}/login`);
    expect(calls).toHaveLength(0);
  });

  it("sends an ended session to the login", async () => {
    reply = { status: 401, body: '{"error":"unauthenticated"}', headers: { "content-type": "application/json" } };
    const response = await exportPostbacks(request("?format=csv"));
    expect(response.headers.get("location")).toBe(`https://${HOST}/login`);
  });

  it("returns a refused export to the log as too large, filters kept — never a partial file", async () => {
    reply = { status: 422, body: '{"error":"validation_failed","message":"Invalid request."}', headers: { "content-type": "application/json" } };
    const response = await exportPostbacks(request("?format=csv&mid=MB2&cursor=abc"));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(`https://${HOST}/postbacks?mid=MB2&export_error=too_large`);
    expect(response.headers.get("content-disposition")).toBeNull();
  });

  it("refuses anything that is not one of Daotra's two export files", async () => {
    const cases: Record<string, string>[] = [
      { "content-type": "text/html", "content-disposition": 'attachment; filename="daotra-postbacks-1Z.csv"' },
      { "content-type": CSV, "content-disposition": 'attachment; filename="../evil.csv"' },
      { "content-type": CSV },
    ];
    for (const headers of cases) {
      reply = { status: 200, body: "x", headers };
      const response = await exportPostbacks(request("?format=csv"));
      expect(response.status).toBe(303);
      expect(response.headers.get("location")).toContain("export_error=unavailable");
    }
  });

  it("an unknown format asks Daotra nothing", async () => {
    const response = await exportPostbacks(request("?format=pdf"));
    expect(response.status).toBe(303);
    expect(calls).toHaveLength(0);
  });

  it("never logs the token or the filters", async () => {
    reply = { status: 502, body: "upstream", headers: {} };
    await exportPostbacks(request("?format=csv&publisher_click_id=PUB-SECRET-9"));
    expect(logged.join(" ")).not.toContain("session-token-abc");
    expect(logged.join(" ")).not.toContain("PUB-SECRET-9");
  });

  it("treats a network failure, an upstream error or an unexpected answer as temporary", async () => {
    const answers: (() => Promise<Response>)[] = [
      async () => {
        throw new TypeError("fetch failed");
      },
      async () => new Response("<html>bad gateway</html>", { status: 502, headers: { "content-type": "text/html" } }),
      async () => new Response("{}", { status: 500, headers: { "content-type": "application/json" } }),
      async () => new Response("{}", { status: 404, headers: { "content-type": "application/json" } }),
    ];
    for (const answer of answers) {
      vi.stubGlobal("fetch", vi.fn(answer));
      const response = await exportPostbacks(request("?format=xlsx&event_type=qftd"));
      expect(response.status).toBe(303);
      expect(response.headers.get("location")).toBe(`https://${HOST}/postbacks?event_type=qftd&export_error=unavailable`);
      expect(response.headers.get("content-disposition")).toBeNull();
      expect(response.headers.get("content-type") ?? "").not.toMatch(/csv|spreadsheet/);
    }
  });

  it("treats a body that cannot be read as temporary, never as a file", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        const response = new Response("x", {
          status: 200,
          headers: { "content-type": CSV, "content-disposition": 'attachment; filename="daotra-postbacks-20261102T093000Z.csv"' },
        });
        Object.defineProperty(response, "arrayBuffer", { value: () => Promise.reject(new TypeError("stream broke")) });
        return response;
      }),
    );
    const response = await exportPostbacks(request("?format=csv"));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(`https://${HOST}/postbacks?export_error=unavailable`);
    expect(response.headers.get("content-disposition")).toBeNull();
    expect(logged.join(" ")).not.toContain("session-token-abc");
  });

  it("keeps the login for 403 as for 401", async () => {
    reply = { status: 403, body: '{"error":"forbidden"}', headers: { "content-type": "application/json" } };
    const response = await exportPostbacks(request("?format=xlsx"));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(`https://${HOST}/login`);
  });
});

describe("the export link and its notices", () => {
  it("names each failure in the owner's words, and nothing internal", () => {
    expect(parseExportError(undefined)).toBeNull();
    expect(parseExportError("too_large")).toBe("too_large");
    expect(parseExportError("unavailable")).toBe("unavailable");
    expect(parseExportError("<script>")).toBe("unavailable");
    expect(EXPORT_ERROR_MESSAGES.too_large).toBe("This export could not be prepared – narrow the filters.");
    expect(EXPORT_ERROR_MESSAGES.unavailable).toBe("Export temporarily unavailable – please try again.");
  });

  it("the Export links carry no download attribute, so a failure shows its notice", () => {
    const page = readFileSync("app/portal/publisher/(dashboard)/postbacks/page.tsx", "utf8");
    const links = page.match(/<a\b[^>]*exportHref[^>]*>/g) ?? [];
    expect(links.length).toBe(1);
    for (const link of links) expect(link).not.toMatch(/\bdownload\b/);
  });
});

