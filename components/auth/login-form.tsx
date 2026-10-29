"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { Label, Input } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Publisher sign-in. Posts to this site's own /api/portal/login, which calls
// Daotra and sets the HttpOnly session cookie — the session token never reaches
// this component. Every refusal reads the same, by design.
export function LoginForm({ homeHref, forgotHref }: { homeHref: string; forgotHref: string }) {
  const router = useRouter();
  const [formError, setFormError] = React.useState<string>("");
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", website: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setFormError("");
    if (values.website) return; // honeypot tripped, silently drop

    let res: Response;
    try {
      res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
        credentials: "same-origin",
      });
    } catch {
      setFormError("Network error. Please check your connection and try again.");
      return;
    }

    if (res.ok) {
      router.replace(homeHref);
      router.refresh();
      return;
    }
    resetField("password");
    if (res.status === 429) {
      setFormError("Too many attempts. Please wait a minute and try again.");
    } else if (res.status === 401) {
      setFormError("Incorrect email or password.");
    } else {
      setFormError("Sign-in is temporarily unavailable. Please try again shortly.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="absolute left-[-9999px] opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" {...register("email")} />
        {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href={forgotHref} className="text-xs text-accent-silver hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
        {errors.password && <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>}
      </div>

      {formError && (
        <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {formError}
        </p>
      )}

      <div className="flex justify-center">
        <Button type="submit" size="md" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </div>
    </form>
  );
}
