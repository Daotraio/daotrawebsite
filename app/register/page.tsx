import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { PortalChooser } from "@/components/auth/portal-chooser";

export const metadata: Metadata = {
  title: "Register",
  robots: { index: false, follow: false },
};

export default function RegisterChooserPage() {
  return (
    <AuthShell
      title="Join Daotra"
      description="Tell us which side of the network you're on."
      footer={null}
    >
      <PortalChooser mode="register" />
    </AuthShell>
  );
}
