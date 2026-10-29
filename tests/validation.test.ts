import { describe, expect, it } from "vitest";
import { PRIVACY, TERMS } from "@/lib/legal";
import {
  publisherRegisterRequestSchema,
  publisherRegisterSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
  toDaotraRegistration,
} from "@/lib/validation/auth";

const form = {
  name: "Northwind Media",
  affiliateManager: "manager@daotra.example",
  contactName: "Ada Contact",
  email: "owner@northwind.example",
  telegram: "@ada_northwind",
  teams: "ada.northwind",
  legalName: "Northwind Media Ltd",
  registrationNumber: "NW-001234",
  country: "GB",
  address: "1 Harbour Street",
  password: "a-long-enough-password",
  acceptTerms: true as const,
};

describe("registration validation", () => {
  it("accepts the full form with a matching Verify Password", () => {
    expect(publisherRegisterSchema.safeParse({ ...form, confirmPassword: form.password }).success).toBe(true);
  });

  it("requires at least 12 characters", () => {
    const short = "elevenchars";
    const result = publisherRegisterSchema.safeParse({ ...form, password: short, confirmPassword: short });
    expect(result.success).toBe(false);
  });

  it("requires Verify Password to match exactly", () => {
    const result = publisherRegisterSchema.safeParse({ ...form, confirmPassword: `${form.password} ` });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.confirmPassword).toBeTruthy();
  });

  it.each(["name", "contactName", "email", "password", "telegram", "legalName", "registrationNumber", "country", "acceptTerms"])(
    "requires %s",
    (field) => {
      const body: Record<string, unknown> = { ...form };
      delete body[field];
      expect(publisherRegisterRequestSchema.safeParse(body).success).toBe(false);
    },
  );

  it("refuses a request that carries Verify Password: it is never transmitted", () => {
    const result = publisherRegisterRequestSchema.safeParse({ ...form, confirmPassword: form.password });
    expect(result.success).toBe(false);
  });

  it("maps every field to Daotra's names, optional blanks to null, and nothing else", () => {
    const mapped = toDaotraRegistration(
      publisherRegisterRequestSchema.parse({ ...form, teams: "", address: "  ", affiliateManager: "" }),
    );
    expect(mapped).toEqual({
      name: "Northwind Media",
      email: "owner@northwind.example",
      password: form.password,
      contact_name: "Ada Contact",
      telegram: "@ada_northwind",
      teams: null,
      legal_name: "Northwind Media Ltd",
      registration_number: "NW-001234",
      country: "GB",
      address: null,
      requested_affiliate_manager_email: null,
      terms_accepted: true,
      terms_version: TERMS.version,
      privacy_version: PRIVACY.version,
    });
    expect(Object.keys(toDaotraRegistration(publisherRegisterRequestSchema.parse(form)))).not.toContain(
      "confirmPassword",
    );
  });
});

describe("Terms & Privacy acceptance", () => {
  it("is required and must be exactly true", () => {
    for (const value of [false, "true", 1, undefined]) {
      expect(publisherRegisterRequestSchema.safeParse({ ...form, acceptTerms: value }).success).toBe(false);
    }
  });

  it("never lets the browser choose the recorded versions", () => {
    expect(publisherRegisterRequestSchema.safeParse({ ...form, terms_version: "1999-01-01" }).success).toBe(false);
  });

  it("records the versions the pages publish", () => {
    expect(TERMS.version).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(PRIVACY.version).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("password reset validation", () => {
  it("needs 12 characters and an exact match", () => {
    expect(resetPasswordSchema.safeParse({ password: "short", confirmPassword: "short" }).success).toBe(false);
    expect(
      resetPasswordSchema.safeParse({ password: "a-new-password!", confirmPassword: "a-new-password?" }).success,
    ).toBe(false);
    expect(
      resetPasswordSchema.safeParse({ password: "a-new-password!", confirmPassword: "a-new-password!" }).success,
    ).toBe(true);
  });

  it("sends only the token and the new password", () => {
    const token = "t".repeat(43);
    expect(resetPasswordRequestSchema.safeParse({ token, password: "a-new-password!" }).success).toBe(true);
    expect(
      resetPasswordRequestSchema.safeParse({ token, password: "a-new-password!", confirmPassword: "x" }).success,
    ).toBe(false);
  });
});
