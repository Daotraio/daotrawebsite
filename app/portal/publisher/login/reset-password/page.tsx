import type { Metadata } from "next";
import { headers } from "next/headers";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { publisherPortalPaths } from "@/lib/portal-paths";

export const metadata: Metadata = {
  title: "Set a new password",
  robots: { index: false, follow: false },
  // The reset link's token is in the URL fragment, which a browser never sends
  // in a Referer; this keeps the page itself from sending any Referer at all.
  referrer: "no-referrer",
};

// Under /login/ so the portal middleware treats it as a public page. The link
// Daotra's Admin hands out is DAOTRA_PUBLISHER_PASSWORD_RESET_URL — this page —
// with `#token=…` appended.
export default async function PublisherResetPasswordPage() {
  const paths = publisherPortalPaths((await headers()).get("host"));
  return (
    <AuthShell
      title="Set a new password"
      description="Choose a new password for your Publisher account."
    >
      <ResetPasswordForm loginHref={paths.login} />
    </AuthShell>
  );
}
