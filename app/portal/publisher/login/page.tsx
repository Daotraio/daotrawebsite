import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Publisher log in",
  robots: { index: false, follow: false },
};

export default function PublisherLoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Log in to your Publisher dashboard."
      footer={
        <>
          Not approved yet?{" "}
          <Link href="/register" className="text-accent-silver hover:underline">
            Apply as a Publisher
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
