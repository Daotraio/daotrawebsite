import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { PortalRegisterForm } from "@/components/auth/portal-register-form";

export const metadata: Metadata = {
  title: "Advertiser application",
  robots: { index: false, follow: false },
};

export default function AdvertiserRegisterPage() {
  return (
    <AuthShell
      title="Apply as an advertiser"
      description="Takes about a minute. We'll review - including licensing where relevant - and follow up by email."
      footer={
        <>
          Already approved?{" "}
          <Link href="/login" className="text-accent-silver hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <PortalRegisterForm role="advertiser" />
    </AuthShell>
  );
}
