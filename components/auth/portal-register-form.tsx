"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { portalRegisterSchema, type PortalRegisterValues } from "@/lib/validation/auth";
import { Label, Input } from "@/components/ui/form-fields";
import { TelegramInput } from "@/components/ui/telegram-input";
import { Button } from "@/components/ui/button";

export function PortalRegisterForm({ role }: { role: "publisher" | "advertiser" }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PortalRegisterValues>({
    resolver: zodResolver(portalRegisterSchema),
    defaultValues: { role, website: "" },
  });

  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const onSubmit = async (values: PortalRegisterValues) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.status === 429) {
        setErrorMessage("Too many attempts. Please wait a minute and try again.");
        setStatus("error");
        return;
      }
      if (!res.ok) {
        setErrorMessage("We couldn't submit your application. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-accent-silver">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Application received - we&rsquo;ll review it and email you within 24–48 hours with next
        steps, including how to set your password.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="hidden" value={role} {...register("role")} />
      <div className="absolute left-[-9999px] opacity-0" aria-hidden="true">
        <label htmlFor="reg-website">Website</label>
        <input id="reg-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <Label htmlFor="reg-companyName">Company name</Label>
        <Input
          id="reg-companyName"
          autoComplete="organization"
          placeholder="Acme Media"
          {...register("companyName")}
        />
        {errors.companyName && (
          <p className="mt-1.5 text-xs text-destructive">{errors.companyName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="reg-fullName">Name</Label>
        <Input id="reg-fullName" autoComplete="name" placeholder="Jordan Lee" {...register("fullName")} />
        {errors.fullName && <p className="mt-1.5 text-xs text-destructive">{errors.fullName.message}</p>}
      </div>

      <div>
        <Label htmlFor="reg-email">Email</Label>
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          {...register("email")}
        />
        {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="reg-telegram">Telegram</Label>
        <TelegramInput id="reg-telegram" {...register("telegram")} />
        {errors.telegram && <p className="mt-1.5 text-xs text-destructive">{errors.telegram.message}</p>}
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" className="mt-0.5 accent-accent-silver" {...register("agreeToTerms")} />
          <span>
            I agree to the{" "}
            <a href="https://daotra.io/terms" target="_blank" rel="noopener noreferrer" className="text-accent-silver hover:underline">
              Terms &amp; Conditions
            </a>{" "}
            and{" "}
            <a href="https://daotra.io/privacy" target="_blank" rel="noopener noreferrer" className="text-accent-silver hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="mt-1.5 text-xs text-destructive">{errors.agreeToTerms.message}</p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" aria-live="assertive" className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {errorMessage}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
