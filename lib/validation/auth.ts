import { z } from "zod";

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
