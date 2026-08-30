"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation/contact";
import { Label, Input, Textarea } from "@/components/ui/form-fields";
import { TelegramInput } from "@/components/ui/telegram-input";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { company: "", telegram: "", website: "" },
  });

  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.status === 429) {
        setErrorMessage("Too many requests. Please wait a minute and try again.");
        setStatus("error");
        return;
      }
      if (!res.ok) {
        setErrorMessage("Something went wrong sending your message. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot: visually hidden, off the tab order, never seen by real users */}
      <div className="absolute left-[-9999px] opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Jordan Lee" {...register("name")} />
          {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="company">Company (optional)</Label>
        <Input id="company" placeholder="Acme Media" {...register("company")} />
      </div>

      <div>
        <Label htmlFor="telegram">Telegram username</Label>
        <TelegramInput id="telegram" {...register("telegram")} />
        {errors.telegram && <p className="mt-1.5 text-xs text-destructive">{errors.telegram.message}</p>}
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} placeholder="Tell us about your traffic, offers, or question…" {...register("message")} />
        {errors.message && <p className="mt-1.5 text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>

      {status === "success" && (
        <p className="flex items-center gap-2 text-sm text-accent-silver">
          <CheckCircle2 className="h-4 w-4" /> Message sent - we&apos;ll reply within hours.
        </p>
      )}
      {status === "error" && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {errorMessage}
        </p>
      )}
    </form>
  );
}
