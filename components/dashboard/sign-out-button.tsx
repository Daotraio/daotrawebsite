"use client";

import * as React from "react";
import { LogOut } from "lucide-react";

// Signs out through this site's /api/portal/logout, which revokes the session in
// Daotra and clears the cookie, then goes to the login page.
export function SignOutButton({ loginHref }: { loginHref: string }) {
  const [pending, setPending] = React.useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        try {
          await fetch("/api/portal/logout", { method: "POST", credentials: "same-origin" });
        } finally {
          window.location.assign(loginHref);
        }
      }}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/[0.05] hover:text-foreground disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
