import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { AuthShell } from "@/components/auth/auth-shell";
import { PublisherRegisterForm } from "@/components/auth/publisher-register-form";
import { publisherPortalPaths } from "@/lib/portal-paths";

export const metadata: Metadata = {
  // absolute: skip the site-wide "%s | Daotra" template so the tab reads
  // exactly "Publisher Registration - Daotra".
  title: { absolute: "Publisher Registration - Daotra" },
  robots: { index: false, follow: false },
};

export default async function PublisherRegisterPage() {
  const paths = publisherPortalPaths((await headers()).get("host"));
  return (
    <AuthShell
      wide
      title="Publisher Registration"
      description="Create your Publisher account. You can log in as soon as you've registered; Daotra will be in touch to complete your onboarding."
      footer={
        <>
          Already registered?{" "}
          <Link href={paths.login} className="text-accent-silver hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <PublisherRegisterForm loginHref={paths.login} />
    </AuthShell>
  );
}
