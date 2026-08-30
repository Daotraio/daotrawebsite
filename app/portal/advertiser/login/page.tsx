import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Advertiser log in",
  robots: { index: false, follow: false },
};

export default function AdvertiserLoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Log in to your Advertiser dashboard."
      footer={
        <>
          Not approved yet?{" "}
          <Link href="/register" className="text-accent-cyan hover:underline">
            Apply as an Advertiser
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
