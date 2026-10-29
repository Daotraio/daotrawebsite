import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { publisherPortalPaths } from "@/lib/portal-paths";
import { currentPortalIdentity } from "@/lib/portal-identity";

// Every portal page is rendered per request, for the signed-in Publisher only.
export const dynamic = "force-dynamic";

// The portal's authentication boundary on the website side. The session is
// checked with Daotra on every request (`GET /portal/me`), so a session revoked
// there — logout, a reset, a disabled login — is refused here at once. Daotra
// enforces the tenant itself: whatever this page asks for, it is answered with
// the session's own Publisher only. The middleware's cookie check is only a fast
// redirect; this is the check that counts, and it also covers the staging host,
// where the portal is served without the aff. subdomain.
export default async function PublisherDashboardLayout({ children }: { children: React.ReactNode }) {
  const paths = publisherPortalPaths((await headers()).get("host"));
  const identity = await currentPortalIdentity();
  if (!identity) redirect(paths.login);

  // Only what exists today. The dashboard, Deal Groups and Postbacks Log
  // screens follow their own specifications.
  const navItems: DashboardNavItem[] = [{ href: paths.home, label: "Overview", icon: "overview" }];

  return (
    <DashboardShell
      roleLabel="Publisher Portal"
      navItems={navItems}
      account={{ email: identity.email ?? "", name: identity.publisher_name }}
      loginHref={paths.login}
    >
      {children}
    </DashboardShell>
  );
}
