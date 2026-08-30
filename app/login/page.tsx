import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { PortalChooser } from "@/components/auth/portal-chooser";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
};

export default function LoginChooserPage() {
  return (
    <AuthShell
      title="Log in to Daotra"
      description="Publishers and advertisers each have their own portal."
      footer={null}
    >
      <PortalChooser mode="login" />
    </AuthShell>
  );
}
