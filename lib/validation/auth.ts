import { z } from "zod";
import { isCountryCode } from "@/lib/countries";
import { telegramHandle } from "@/lib/validation/telegram";
import { PRIVACY, TERMS } from "@/lib/legal";

// Daotra's own bounds (BD-71 as amended 2026-10-29): at least 12 characters.
// The upper bound matches Daotra's — an unbounded input on an unauthenticated
// path is an unbounded allocation.
export const PASSWORD_MIN = 12;
export const PASSWORD_MAX = 1024;

const password = z
  .string()
  .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
  .max(PASSWORD_MAX, `Password must be at most ${PASSWORD_MAX} characters`);

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  // Any length is accepted at login: an account's password was set under
  // whatever rule held then, and the answer must not differ by length.
  password: z.string().min(1, "Enter your password").max(PASSWORD_MAX),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});
export type LoginValues = z.infer<typeof loginSchema>;

// Publisher registration (aff.daotra.io/register). Optional text fields accept
// "" so an untouched input validates; the honeypot works as everywhere else.
const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

// What the BROWSER sends to the website: every field except Verify Password,
// which is checked in the browser and never transmitted (BD-71 as amended).
// `.strict()` refuses a request that carries anything else.
export const publisherRegisterRequestSchema = z
  .object({
    name: z.string().trim().min(2, "Enter a name").max(160),
    affiliateManager: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .max(200)
      .optional()
      .or(z.literal("")),
    contactName: z.string().trim().min(2, "Enter the contact's name").max(120),
    email: z.string().trim().email("Enter a valid email address").max(200),
    telegram: telegramHandle,
    teams: optionalText(200),
    legalName: z.string().trim().min(2, "Enter the legal name").max(200),
    registrationNumber: z.string().trim().min(2, "Enter the registration number").max(60),
    // ISO 3166-1 alpha-2 code (see lib/countries.ts).
    country: z.string().refine(isCountryCode, "Select a country"),
    address: optionalText(300),
    password,
    // Explicit acceptance of the Terms & Conditions and the Privacy Policy —
    // required, and only `true` (BD-71 as amended). The versions are added by
    // the server route, never chosen by the browser.
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "Accept the Terms & Conditions and the Privacy Policy to register" }),
    }),
    website: z.string().max(0).optional().or(z.literal("")), // honeypot
  })
  .strict();
export type PublisherRegisterRequest = z.infer<typeof publisherRegisterRequestSchema>;

// What the FORM validates before submission: the request plus Verify Password,
// which must match exactly.
export const publisherRegisterSchema = publisherRegisterRequestSchema
  .extend({ confirmPassword: z.string().min(1, "Verify your password") })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type PublisherRegisterValues = z.infer<typeof publisherRegisterSchema>;

// Setting a new password from a staff-issued reset link.
export const resetPasswordSchema = z
  .object({ password, confirmPassword: z.string().min(1, "Verify your password") })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

// What the browser sends to the website's reset route: the link's token and the
// new password — again never the Verify Password.
export const resetPasswordRequestSchema = z
  .object({
    token: z.string().min(16).max(256),
    password,
  })
  .strict();

/** The registration request, mapped to Daotra's `POST /public/publisher-registrations`. */
export function toDaotraRegistration(values: PublisherRegisterRequest) {
  const optional = (value: string | undefined) => (value && value.trim() ? value.trim() : null);
  return {
    name: values.name,
    email: values.email,
    password: values.password,
    contact_name: values.contactName,
    telegram: values.telegram,
    teams: optional(values.teams),
    legal_name: values.legalName,
    registration_number: values.registrationNumber,
    country: values.country,
    address: optional(values.address),
    requested_affiliate_manager_email: optional(values.affiliateManager),
    terms_accepted: values.acceptTerms,
    terms_version: TERMS.version,
    privacy_version: PRIVACY.version,
  };
}
