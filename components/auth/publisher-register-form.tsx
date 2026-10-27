"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { publisherRegisterSchema, type PublisherRegisterValues } from "@/lib/validation/auth";
import { Label, Input } from "@/components/ui/form-fields";
import { TelegramInput } from "@/components/ui/telegram-input";
import { CountrySelect } from "@/components/ui/country-select";
import { Button } from "@/components/ui/button";

// "*" marks the mandatory fields, as in the spec. aria-hidden because the
// inputs themselves carry aria-required for assistive tech.
function Req() {
  return (
    <span aria-hidden="true" className="text-muted-foreground">
      {" "}
      *
    </span>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-destructive">{message}</p>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
      {children}
    </h2>
  );
}

export function PublisherRegisterForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PublisherRegisterValues>({
    resolver: zodResolver(publisherRegisterSchema),
    defaultValues: {
      role: "publisher",
      name: "",
      affiliateManager: "",
      contactName: "",
      email: "",
      telegram: "",
      teams: "",
      legalName: "",
      registrationNumber: "",
      country: "",
      address: "",
      website: "",
    },
  });

  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const onSubmit = async (values: PublisherRegisterValues) => {
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
        setErrorMessage("We couldn't submit your registration. Please try again.");
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
      <p role="status" className="flex items-start gap-2 text-sm text-accent-silver">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        Registration received - we&rsquo;ll review it and get back to you, usually within hours, with
        next steps for accessing your account.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="absolute left-[-9999px] opacity-0" aria-hidden="true">
        <label htmlFor="pub-website">Website</label>
        <input id="pub-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <p className="text-xs text-muted-foreground">
        <span aria-hidden="true">* </span>Required field
      </p>

      <section className="space-y-5" aria-labelledby="pub-contact-heading">
        <div id="pub-contact-heading">
          <SectionHeading>Contact details</SectionHeading>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="pub-name">
              Name
              <Req />
            </Label>
            <Input id="pub-name" aria-required="true" autoComplete="organization" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <Label htmlFor="pub-affiliateManager">
              Affiliate Manager <span className="font-normal text-muted-foreground">(by email)</span>
            </Label>
            <Input
              id="pub-affiliateManager"
              type="email"
              placeholder="manager@company.com"
              {...register("affiliateManager")}
            />
            <FieldError message={errors.affiliateManager?.message} />
          </div>

          <div>
            <Label htmlFor="pub-contactName">
              Contact&rsquo;s Name
              <Req />
            </Label>
            <Input
              id="pub-contactName"
              aria-required="true"
              autoComplete="name"
              placeholder="Jordan Lee"
              {...register("contactName")}
            />
            <FieldError message={errors.contactName?.message} />
          </div>

          <div>
            <Label htmlFor="pub-email">
              Email
              <Req />
            </Label>
            <Input
              id="pub-email"
              type="email"
              aria-required="true"
              autoComplete="email"
              placeholder="you@company.com"
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <div>
            <Label htmlFor="pub-telegram">
              Telegram
              <Req />
            </Label>
            <TelegramInput id="pub-telegram" aria-required="true" {...register("telegram")} />
            <FieldError message={errors.telegram?.message} />
          </div>

          <div>
            <Label htmlFor="pub-teams">Teams</Label>
            <Input id="pub-teams" {...register("teams")} />
            <FieldError message={errors.teams?.message} />
          </div>
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="pub-company-heading">
        <div id="pub-company-heading">
          <SectionHeading>Company details</SectionHeading>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="pub-legalName">
              Legal Name
              <Req />
            </Label>
            <Input
              id="pub-legalName"
              aria-required="true"
              autoComplete="organization"
              {...register("legalName")}
            />
            <FieldError message={errors.legalName?.message} />
          </div>

          <div>
            <Label htmlFor="pub-registrationNumber">
              Registration Number
              <Req />
            </Label>
            <Input
              id="pub-registrationNumber"
              aria-required="true"
              autoComplete="off"
              {...register("registrationNumber")}
            />
            <FieldError message={errors.registrationNumber?.message} />
          </div>

          <div>
            <Label htmlFor="pub-country">
              Country
              <Req />
            </Label>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <CountrySelect
                  id="pub-country"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={Boolean(errors.country)}
                />
              )}
            />
            <FieldError message={errors.country?.message} />
          </div>

          <div>
            <Label htmlFor="pub-address">Address</Label>
            <Input id="pub-address" autoComplete="street-address" {...register("address")} />
            <FieldError message={errors.address?.message} />
          </div>
        </div>
      </section>

      {status === "error" && (
        <p role="alert" aria-live="assertive" className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {errorMessage}
        </p>
      )}

      <div className="space-y-4">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Submitting…" : "Register"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By registering you agree to our{" "}
          <a
            href="https://daotra.io/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-silver hover:underline"
          >
            Terms &amp; Conditions
          </a>{" "}
          and{" "}
          <a
            href="https://daotra.io/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-silver hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}
