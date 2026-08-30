import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { PortalRegisterForm } from "@/components/auth/portal-register-form";

export const metadata: Metadata = {
  title: "Publisher application",
  robots: { index: false, follow: false },
};

export default function PublisherRegisterPage() {
  return (
    <AuthShell
      title="Apply as a Publisher"
      description="Takes about a minute. We'll review and follow up by email."
      footer={
        <>
          Already approved?{" "}
          <Link href="/login" className="text-accent-cyan hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <PortalRegisterForm role="publisher" />
    </AuthShell>
  );
}
