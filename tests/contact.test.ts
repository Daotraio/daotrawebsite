// The contact form's server route (AUD-27). What is pinned: the sender's
// personal information — name, email, company, Telegram handle and message —
// is never written to any log (Workers Logs retain console output), and the
// route's answers are unchanged.
//
// Where an inquiry is *delivered* is an owner decision that has not been made;
// nothing here asserts or invents a delivery channel.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as contact } from "@/app/api/contact/route";

const HOST = "daotra.test";

let logged: string[] = [];
let counter = 0;

function request(body: unknown): NextRequest {
  counter += 1;
  return new NextRequest(`https://${HOST}/api/contact`, {
    method: "POST",
    headers: {
      host: HOST,
      "content-type": "application/json",
      "cf-connecting-ip": `198.51.100.${counter % 250}`,
    },
    body: JSON.stringify(body),
  });
}

const inquiry = {
  name: "Grace Synthetic-Sender",
  email: "grace.sender@inquiry.example",
  company: "Synthetic Casino Holdings",
  telegram: "@grace_synthetic",
  message: "We would like to buy traffic for our synthetic brand in GB.",
  website: "",
};

const PERSONAL = [inquiry.name, inquiry.email, inquiry.company, inquiry.telegram, inquiry.message];

beforeEach(() => {
  logged = [];
  for (const level of ["log", "info", "warn", "error", "debug"] as const) {
    vi.spyOn(console, level).mockImplementation((...args: unknown[]) => {
      logged.push(JSON.stringify(args));
    });
  }
});

afterEach(() => {
  vi.restoreAllMocks();
});

function expectNoPersonalInformationLogged() {
  const all = logged.join("\n");
  for (const value of PERSONAL) {
    expect(all).not.toContain(value);
  }
  // Fragments too: a log of the email's local part or domain is still the sender.
  expect(all).not.toContain("grace");
  expect(all).not.toContain("inquiry.example");
  expect(all).not.toContain("Synthetic");
}

describe("POST /api/contact", () => {
  it("accepts a valid inquiry without logging any personal information", async () => {
    const response = await contact(request(inquiry));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expectNoPersonalInformationLogged();
  });

  it("answers the honeypot exactly as before, and logs nothing personal", async () => {
    const response = await contact(request({ ...inquiry, website: "x" }));
    // A filled honeypot fails the schema's max(0) and is refused as before.
    expect(response.status).toBe(422);
    expectNoPersonalInformationLogged();
  });

  it("refuses an invalid submission without echoing or logging its values", async () => {
    const response = await contact(request({ ...inquiry, email: "not-an-email" }));
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.error).toBe("Invalid submission.");
    expect(JSON.stringify(body)).not.toContain(inquiry.name);
    expectNoPersonalInformationLogged();
  });
});
