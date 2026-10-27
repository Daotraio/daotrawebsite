import { z } from "zod";
import { isCountryCode } from "@/lib/countries";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});
export type LoginValues = z.infer<typeof loginSchema>;

// Telegram usernames: 5-32 characters, letters/numbers/underscores, must
// start with a letter. Stored WITHOUT the leading "@" - the "@" is a fixed,
// non-editable UI prefix (see TelegramInput), never part of the value itself.
const telegramUsername = z
  .string()
  .trim()
  .min(5, "Telegram usernames are at least 5 characters")
  .max(32, "Telegram usernames are at most 32 characters")
  .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "Use only letters, numbers, and underscores, starting with a letter");

// This is the full registration form as specified: an application/lead form
// (no password here - credentials are issued after the application is
// approved), so it's deliberately just four fields plus consent.
export const portalRegisterSchema = z.object({
  role: z.enum(["publisher", "advertiser"]),
  companyName: z.string().trim().min(2, "Enter your company name").max(160),
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address"),
  telegram: telegramUsername,
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms & Conditions and Privacy Policy" }),
  }),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});
export type PortalRegisterValues = z.infer<typeof portalRegisterSchema>;

// Publisher registration (aff.daotra.io/register) - the fuller application
// form: contact details plus the company's legal details. Like the schema
// above it's an application, not an account (no password; credentials are
// issued on approval). Optional text fields accept "" so an untouched input
// validates; the honeypot works the same way as everywhere else.
const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const publisherRegisterSchema = z.object({
  role: z.literal("publisher"),
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
  telegram: telegramUsername,
  teams: optionalText(200),
  legalName: z.string().trim().min(2, "Enter the legal name").max(200),
  registrationNumber: z.string().trim().min(2, "Enter the registration number").max(60),
  // ISO 3166-1 alpha-2 code (see lib/countries.ts).
  country: z.string().refine(isCountryCode, "Select a country"),
  address: optionalText(300),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});
export type PublisherRegisterValues = z.infer<typeof publisherRegisterSchema>;
