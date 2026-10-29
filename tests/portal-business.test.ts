// The Publisher portal's business screens (Daotra BD-91), website side.
//
// What is pinned: a read sends the session and nothing that names a Publisher; the
// Postbacks Log forwards only its allowlisted filters, validated; a session Daotra no
// longer accepts is "sign in again", never an empty screen; and the display rules —
// money never converted, D2's allocation-only cap, the Admin's chart helpers.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PortalReadError, PortalSessionEndedError, portalRead } from "@/lib/portal-api";
import {
  allocationLabel,
  countryLabel,
  dealOptions,
  formatMoney,
  formatUtc,
  hasFilters,
  niceTicks,
  parsePeriod,
  parsePostbackFilters,
  postbackQuery,
  roundDecimalString,
  trackingLink,
  trackingOrigin,
} from "@/lib/portal-business";

const API = "https://api.daotra.test";
const SECRET = "gateway-secret-for-tests-0123456789abcdef";

type Call = { url: string; init: RequestInit };
let calls: Call[] = [];
let reply: { status: number; body?: unknown } = { status: 200, body: {} };
let logged: string[] = [];

beforeEach(() => {
  calls = [];
  logged = [];
  reply = { status: 200, body: {} };
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

describe("portal reads", () => {
  it("send the session as a bearer and the gateway secret — and nothing naming a Publisher", async () => {
    reply = { status: 200, body: { rows: [], next_cursor: null } };
    await portalRead("/portal/postbacks?event_type=qftd", "session-token-abc");
    expect(calls).toHaveLength(1);
    const call = calls[0]!;
    expect(call.url).toBe(`${API}/portal/postbacks?event_type=qftd`);
    const headers = call.init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer session-token-abc");
    expect(headers["X-Daotra-Gateway-Auth"]).toBe(SECRET);
    expect(call.init.method).toBe("GET");
    expect(call.init.body).toBeUndefined();
    expect(call.url).not.toMatch(/publisher/i);
  });

  it("treat a refused session as ended, without calling Daotra when there is none", async () => {
    await expect(portalRead("/portal/dashboard", undefined)).rejects.toBeInstanceOf(PortalSessionEndedError);
    expect(calls).toHaveLength(0);
    for (const status of [401, 403]) {
      reply = { status, body: { error: "unauthenticated" } };
      await expect(portalRead("/portal/dashboard", "t")).rejects.toBeInstanceOf(PortalSessionEndedError);
    }
  });

  it("raise anything else, logging neither the token nor the body", async () => {
    reply = { status: 500, body: { error: "internal", secret: "do-not-log" } };
    await expect(portalRead("/portal/deal-groups", "session-token-xyz")).rejects.toBeInstanceOf(PortalReadError);
    reply = { status: 422, body: { error: "validation_failed" } };
    await expect(portalRead("/portal/postbacks?cursor=x", "session-token-xyz")).rejects.toBeInstanceOf(
      PortalReadError,
    );
    expect(logged.join(" ")).not.toContain("session-token-xyz");
    expect(logged.join(" ")).not.toContain("do-not-log");
  });
});

describe("Postbacks Log filters", () => {
  it("keep only the approved filters, validated", () => {
    const filters = parsePostbackFilters({
      received_from: "2026-10-01",
      received_to: "not-a-date",
      event_type: "qftd",
      deal_id: "0192F1E2-AAAA-7BBB-8CCC-1234567890AB",
      country: "de",
      publisher_click_id: " PUB-1 ",
      cursor: "eyJiZWZvcmUiOjEwfQ",
      publisher_id: "0192f1e2-aaaa-7bbb-8ccc-1234567890ab",
      advertiser_id: "x",
      click_id: "daotra-click",
      traffic: "test",
      attribution_status: "held",
    });
    expect(filters).toEqual({
      received_from: "2026-10-01",
      event_type: "qftd",
      deal_id: "0192f1e2-aaaa-7bbb-8ccc-1234567890ab",
      country: "DE",
      publisher_click_id: "PUB-1",
      cursor: "eyJiZWZvcmUiOjEwfQ",
    });
  });

  it("drop invalid values rather than send them", () => {
    expect(
      parsePostbackFilters({ event_type: "deposit", country: "DEU", deal_id: "nope", cursor: "a b" }),
    ).toEqual({});
    expect(parsePostbackFilters({ publisher_click_id: "x".repeat(256) })).toEqual({});
  });

  it("build the query from the allowlist alone", () => {
    const smuggled = { event_type: "ftd", publisher_id: "B" } as unknown as Parameters<typeof postbackQuery>[0];
    expect(postbackQuery(smuggled)).toBe("?event_type=ftd");
    expect(postbackQuery({})).toBe("");
    expect(postbackQuery({ cursor: "abc", country: "DE" })).toBe("?country=DE&cursor=abc");
    expect(hasFilters({ cursor: "abc" })).toBe(false);
    expect(hasFilters({ country: "DE" })).toBe(true);
  });
});

describe("display", () => {
  it("periods default to the Admin's", () => {
    expect(parsePeriod("today")).toBe("today");
    expect(parsePeriod(["current_month"])).toBe("current_month");
    expect(parsePeriod("yesterday")).toBe("last_7_days");
    expect(parsePeriod(undefined)).toBe("last_7_days");
  });

  it("money is per currency, three decimals half up, from the string", () => {
    expect(formatMoney("160.000000", "EUR")).toBe("€160");
    expect(formatMoney("77.123456", "USD")).toBe("$77.123");
    expect(formatMoney("1234567.0005", "EUR")).toBe("€1,234,567.001");
    expect(formatMoney("5", "GBP")).toBe("5 GBP");
    expect(roundDecimalString("0.9995", 3)).toBe("1.000");
  });

  it("D2: the allocation alone, or Uncapped", () => {
    expect(allocationLabel(20)).toBe("Allocation: 20");
    expect(allocationLabel(0)).toBe("Allocation: 0");
    expect(allocationLabel(null)).toBe("Uncapped");
  });

  it("countries state their subdivision limits", () => {
    expect(countryLabel({ country_code: "DE", country_name: "Germany", only_subdivisions: [], excluded_subdivisions: [] })).toBe(
      "Germany",
    );
    expect(countryLabel({ country_code: "US", country_name: null, only_subdivisions: ["NJ"], excluded_subdivisions: [] })).toBe(
      "US (NJ only)",
    );
    expect(
      countryLabel({ country_code: "CA", country_name: "Canada", only_subdivisions: [], excluded_subdivisions: ["QC"] }),
    ).toBe("Canada (except QC)");
  });

  it("tracking links use a bare https origin, never a guessed one", () => {
    expect(trackingLink("https://track.daotra.io", "/c/abc")).toBe("https://track.daotra.io/c/abc");
    expect(trackingLink("https://track.daotra.io/", "/c/abc")).toBe("https://track.daotra.io/c/abc");
    expect(trackingLink(undefined, "/c/abc")).toBe("/c/abc");
    for (const bad of ["http://track.daotra.io", "https://track.daotra.io/x", "https://u:p@t.io", "nonsense"]) {
      expect(trackingOrigin(bad)).toBeNull();
    }
    expect(trackingOrigin("http://localhost:8020")).toBe("http://localhost:8020");
  });

  it("dates are UTC", () => {
    expect(formatUtc("2026-10-29T14:05:09Z")).toBe("29 Oct 2026, 14:05 UTC");
    expect(formatUtc("garbage")).toBe("-");
  });

  it("the Deal filter lists each of the Publisher's Deals once", () => {
    const deal = (deal_id: string, name: string) => ({
      deal_id,
      name,
      status: "active",
      brand: null,
      traffic_source: null,
      countries: [],
      terms: null,
      tracking_path: null,
      allocation: null,
    });
    expect(
      dealOptions([
        { deal_group_id: "g1", name: "G1", vertical: null, deals: [deal("d2", "Beta"), deal("d1", "Alpha")] },
        { deal_group_id: "g2", name: "G2", vertical: null, deals: [deal("d1", "Alpha")] },
      ]),
    ).toEqual([
      { value: "d1", label: "Alpha" },
      { value: "d2", label: "Beta" },
    ]);
  });

  it("chart ticks are the Admin's", () => {
    expect(niceTicks(0)).toEqual([0, 1]);
    expect(niceTicks(7)).toEqual([0, 2, 4, 6, 8]);
  });
});

describe("hardening (independent QA)", () => {
  it("dates outside what Daotra accepts are dropped, never sent", () => {
    expect(parsePostbackFilters({ received_from: "0001-01-01", received_to: "9999-12-31" })).toEqual({});
    expect(parsePostbackFilters({ received_from: "2026-13-01", received_to: "2026-02-31x" })).toEqual({});
    expect(parsePostbackFilters({ received_from: "2000-01-01", received_to: "9998-12-31" })).toEqual({
      received_from: "2000-01-01",
      received_to: "9998-12-31",
    });
  });

  it("a failed read never logs its query string", async () => {
    reply = { status: 502, body: {} };
    await expect(
      portalRead("/portal/postbacks?publisher_click_id=PUB-SECRET-1", "session-token-xyz"),
    ).rejects.toBeInstanceOf(PortalReadError);
    expect(logged.join(" ")).not.toContain("PUB-SECRET-1");
    expect(logged.join(" ")).toContain("/portal/postbacks");
  });
});
