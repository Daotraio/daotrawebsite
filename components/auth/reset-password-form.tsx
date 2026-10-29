"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { PASSWORD_MIN, resetPasswordSchema, type ResetPasswordValues } from "@/lib/validation/auth";
import { Label, Input } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";

// Redeems a one-time password-reset link that Daotra staff generated and gave
// the Publisher by hand. The link carries its token in the URL FRAGMENT
// (`#token=…`): a fragment is never sent to a server, so the token reaches no
// access log, no Referer and no analytics. It is read once, held in memory only,
// and wiped from the address bar straight away. Verify Password is checked here
// and never sent.
export function ResetPasswordForm({ loginHref }: { loginHref: string }) {
  const [token, setToken] = React.useState<string | null | undefined>(undefined);
  const [status, setStatus] = React.useState<"idle" | "done" | "error">("idle");
  const [message, setMessage] = React.useState("");

  // Read exactly once: the effect clears the fragment, so a second run (React
  // StrictMode re-runs effects in development) would find it gone.
  const consumed = React.useRef(false);
  React.useEffect(() => {
    if (consumed.current) return;
    consumed.current = true;
    const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const found = fragment.get("token");
    // The fragment exists only in the browser (it is never sent to the server),
    // so it can be read only after mount.
    setToken(found && found.length >= 16 ? found : null);
    // Out of the address bar and the history entry at once.
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!token) return;
    setStatus("idle");
    try {
      const res = await fetch("/api/portal/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
        credentials: "same-origin",
      });
      reset();
      if (res.ok) {
        setToken(null);
        setStatus("done");
        return;
      }
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      if (res.status === 400) {
        // The link is spent either way: the reset was attempted with it.
        setToken(null);
      }
      setMessage(body?.message ?? "We couldn't reset your password. Please try again.");
      setStatus("error");
    } catch {
      setMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="space-y-6">
        <p role="status" className="flex items-start gap-2 text-sm text-accent-silver">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Your password has been changed and every existing session has been signed out.
        </p>
        <Button asChild size="md" className="w-full">
          <a href={loginHref}>Log in</a>
        </Button>
      </div>
    );
  }

  if (token === undefined) return null;

  if (token === null) {
    return (
      <div className="space-y-4">
        {status === "error" && (
          <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" /> {message}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          This page needs the complete reset link you were given. Reset links are single-use and
          expire after a short time &mdash; if yours no longer works, ask your Daotra contact for a
          new one.
        </p>
        <a href={loginHref} className="text-sm text-accent-silver hover:underline">
          Back to log in
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="reset-password">New password</Label>
        <Input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          aria-required="true"
          {...register("password")}
        />
        {errors.password && <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <div>
        <Label htmlFor="reset-confirm">Verify password</Label>
        <Input
          id="reset-confirm"
          type="password"
          autoComplete="new-password"
          aria-required="true"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">At least {PASSWORD_MIN} characters.</p>

      {status === "error" && (
        <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {message}
        </p>
      )}

      <div className="flex justify-center">
        <Button type="submit" size="md" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving…" : "Set new password"}
        </Button>
      </div>
    </form>
  );
}
