import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { publisherPortalPaths } from "@/lib/portal-paths";

export const metadata: Metadata = {
  title: "Publisher log in",
  robots: { index: false, follow: false },
};

export default async function PublisherLoginPage() {
  const paths = publisherPortalPaths((await headers()).get("host"));
  return (
    <AuthShell
      title="Welcome back"
      description="Log in to your Publisher account."
      footer={
        <>
          New to Daotra?{" "}
          <Link href={paths.register} className="text-accent-silver hover:underline">
            Register as a Publisher
          </Link>
        </>
      }
    >
      <LoginForm homeHref={paths.home} forgotHref={paths.forgotPassword} />
    </AuthShell>
  );
}
