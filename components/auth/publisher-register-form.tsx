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
import { ApplicationReceivedDialog } from "@/components/auth/application-received-dialog";
import { PRIVACY, TERMS } from "@/lib/legal";

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

export function PublisherRegisterForm({ loginHref }: { loginHref: string }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PublisherRegisterValues>({
    resolver: zodResolver(publisherRegisterSchema),
    defaultValues: {
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
      password: "",
      confirmPassword: "",
      website: "",
    },
  });

  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const onSubmit = async (values: PublisherRegisterValues) => {
    setStatus("idle");
    // Verify Password is checked above (the schema's refine) and is NEVER sent
    // anywhere — not to this site's server, not to Daotra (BD-71 as amended).
    const { confirmPassword: _verified, ...request } = values;
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        credentials: "same-origin",
      });
      if (res.status === 429) {
        setErrorMessage("Too many attempts. Please wait a minute and try again.");
        setStatus("error");
        return;
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string; field?: string; message?: string }
          | null;
        if (body?.error === "publisher_name_taken") {
          setError("name", { message: body.message ?? "This name is already registered." }, { shouldFocus: true });
          setErrorMessage("Choose a different name and submit again.");
        } else if (body?.error === "country_invalid") {
          setError("country", { message: body.message ?? "Select a valid country." }, { shouldFocus: true });
          setErrorMessage("Select a valid country and submit again.");
        } else if (res.status === 503 || res.status === 502) {
          setErrorMessage("Registration is temporarily unavailable. Please try again shortly.");
        } else {
          setErrorMessage("We couldn't submit your registration. Please check the form and try again.");
        }
        setStatus("error");
        return;
      }
      // Clear everything (including the typed passwords) out of form state.
      reset();
      setStatus("success");
      setDialogOpen(true);
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <>
        <p role="status" className="flex items-start gap-2 text-sm text-accent-silver">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Registration received. If this email address isn&rsquo;t already registered, your Publisher
            account has been created &mdash;{" "}
            <a href={loginHref} className="text-accent-silver hover:underline">
              log in
            </a>{" "}
            with your email and password.
          </span>
        </p>
        <ApplicationReceivedDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          loginHref={loginHref}
        />
      </>
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
            <Label htmlFor="pub-password">
              Password
              <Req />
            </Label>
            <Input
              id="pub-password"
              type="password"
              aria-required="true"
              autoComplete="new-password"
              {...register("password")}
            />
            <FieldError message={errors.password?.message} />
          </div>

          <div>
            <Label htmlFor="pub-confirmPassword">
              Verify Password
              <Req />
            </Label>
            <Input
              id="pub-confirmPassword"
              type="password"
              aria-required="true"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            <FieldError message={errors.confirmPassword?.message} />
          </div>

          <p className="text-xs text-muted-foreground sm:col-span-2">
            At least 12 characters. You&rsquo;ll log in with your email and this password.
          </p>

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
        <div>
          <label htmlFor="pub-acceptTerms" className="flex items-start gap-2 text-sm text-muted-foreground">
            <input
              id="pub-acceptTerms"
              type="checkbox"
              aria-required="true"
              aria-invalid={Boolean(errors.acceptTerms) || undefined}
              className="mt-0.5 accent-accent-silver"
              {...register("acceptTerms")}
            />
            <span>
              I have read and accept the{" "}
              <a href={TERMS.href} target="_blank" rel="noopener noreferrer" className="text-accent-silver hover:underline">
                Terms &amp; Conditions
              </a>{" "}
              and the{" "}
              <a href={PRIVACY.href} target="_blank" rel="noopener noreferrer" className="text-accent-silver hover:underline">
                Privacy Policy
              </a>
              .<Req />
            </span>
          </label>
          <FieldError message={errors.acceptTerms?.message} />
        </div>
        <div className="flex justify-center">
          <Button type="submit" size="md" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Submitting…" : "Register"}
          </Button>
        </div>
      </div>
    </form>
  );
}
