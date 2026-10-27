import { z } from "zod";

// A Telegram handle as typed into the site's forms: it MUST start with "@",
// and after that anything goes - letters in any language, numbers, symbols,
// in any order - except spaces/whitespace. 5-32 characters after the "@"
// (Telegram's own length range). The "@" is part of the stored value.
//
// Checks run in this order and the form shows the first failure, so an empty
// field says "Enter..." and a handle typed without "@" says to add one.
export const telegramHandle = z
  .string()
  .trim()
  .min(1, "Enter your Telegram username")
  .regex(/^@/, "Telegram must start with @")
  .regex(/^@\S*$/, "Telegram usernames can't contain spaces")
  .min(6, "Telegram usernames are at least 5 characters after the @")
  .max(33, "Telegram usernames are at most 32 characters after the @");

// Keeps what the user types in the shape the schema expects: no spaces, and
// exactly one leading "@" as soon as there's anything in the box (so typing
// "jordan" shows "@jordan", and pasting "@@jordan" collapses to "@jordan").
export function normalizeTelegramHandle(raw: string): string {
  const compact = raw.replace(/\s+/g, "");
  if (!compact) return "";
  return "@" + compact.replace(/^@+/, "");
}
