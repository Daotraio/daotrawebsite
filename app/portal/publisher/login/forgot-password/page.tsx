import type { Metadata } from "next";
import { headers } from "next/headers";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordNotice } from "@/components/auth/forgot-password-form";
import { publisherPortalPaths } from "@/lib/portal-paths";

export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };

export default async function PublisherForgotPasswordPage() {
  const paths = publisherPortalPaths((await headers()).get("host"));
  return (
    <AuthShell title="Forgot your password?" description="Password resets are handled by your Daotra contact.">
      <ForgotPasswordNotice loginHref={paths.login} />
    </AuthShell>
  );
}
