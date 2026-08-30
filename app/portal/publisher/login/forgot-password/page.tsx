import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };

export default function PublisherForgotPasswordPage() {
  return (
    <AuthShell title="Reset your password" description="Enter your account email and we'll send a reset link.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
