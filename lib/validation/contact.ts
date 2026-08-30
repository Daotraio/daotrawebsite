import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  inquiryType: z.enum(["publisher", "advertiser", "general", "press"]),
  message: z.string().trim().min(10, "Tell us a bit more (10 characters minimum)").max(4000),
  // Honeypot field: real users never see or fill this input (hidden via CSS),
  // so any non-empty value here is a strong bot signal.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
