import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { PublisherRegisterForm } from "@/components/auth/publisher-register-form";

export const metadata: Metadata = {
  // absolute: skip the site-wide "%s | Daotra" template so the tab reads
  // exactly "Publisher Registration - Daotra".
  title: { absolute: "Publisher Registration - Daotra" },
  robots: { index: false, follow: false },
};

export default function PublisherRegisterPage() {
  return (
    <AuthShell
      wide
      title="Publisher Registration"
      description="Tell us about you and your company. We'll review your registration and follow up."
      footer={
        <>
          Already approved?{" "}
          <Link href="/login" className="text-accent-silver hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <PublisherRegisterForm />
    </AuthShell>
  );
}
