"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "daotra-cookie-consent";

const CONSENT_CHANGED_EVENT = "daotra-cookie-consent-changed";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  };
}

// "unavailable" = no stored choice can be read at all (server render, or
// localStorage blocked in privacy mode) - treated as "don't show the banner"
// so it never blocks the page over something we can't persist anyway.
function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "none";
  } catch {
    return "unavailable";
  }
}

function getServerSnapshot() {
  return "unavailable";
}

export function CookieBanner() {
  const stored = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = React.useState(false);

  const choose = (choice: "accepted" | "essential-only") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
      window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
    } catch {
      // ignore - the banner just won't persist across reloads in this case
    }
    setDismissed(true);
  };

  if (stored !== "none" || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/[0.08] bg-obsidian-950/95 backdrop-blur-xl"
    >
      <div className="container flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-muted-foreground">
          We use strictly necessary cookies to run this site, and optional analytics cookies to
          understand usage. See our{" "}
          <Link href="/privacy" className="text-accent-silver hover:underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex shrink-0 gap-3">
          <Button variant="outline" size="sm" onClick={() => choose("essential-only")}>
            Essential only
          </Button>
          <Button variant="primary" size="sm" onClick={() => choose("accepted")}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
