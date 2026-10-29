import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { PRIVACY, TERMS } from "@/lib/legal";

describe("the policies a registrant accepts", () => {
  it("link to the same deployment that records their version", () => {
    expect(TERMS.href).toBe("/terms");
    expect(PRIVACY.href).toBe("/privacy");
  });

  it("are served unrewritten and without a session on aff.daotra.io", () => {
    for (const path of ["/terms", "/privacy"]) {
      const res = middleware(new NextRequest(`https://aff.daotra.io${path}`, { headers: { host: "aff.daotra.io" } }));
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
      expect(res.headers.get("location")).toBeNull();
    }
  });

  it("keep the version and the displayed date together", () => {
    for (const doc of [TERMS, PRIVACY]) {
      const shown = new Date(`${doc.lastUpdated} UTC`).toISOString().slice(0, 10);
      expect(shown).toBe(doc.version);
    }
  });
});
