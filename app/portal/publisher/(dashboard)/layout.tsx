import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@/components/portal/portal.css";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PortalShell, type PortalNavSection } from "@/components/portal/portal-shell";
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
//
// The frame is the Daotra Admin's design language (components/portal), scoped
// under `.portal-ui` so the marketing site's styles never meet it.
export default async function PublisherDashboardLayout({ children }: { children: React.ReactNode }) {
  const paths = publisherPortalPaths((await headers()).get("host"));
  const identity = await currentPortalIdentity();
  if (!identity) redirect(paths.login);

  // The three business screens (Daotra BD-91), then the account's own page.
  const navigation: PortalNavSection[] = [
    {
      title: "Performance",
      areas: [
        { href: paths.dashboard, label: "Dashboard", icon: "dashboard" },
        { href: paths.dealGroups, label: "Deal Groups", icon: "dealGroups" },
        { href: paths.postbacks, label: "Postbacks Log", icon: "postbacks" },
      ],
    },
    { title: "Account", areas: [{ href: paths.home, label: "Overview", icon: "overview" }] },
  ];

  return (
    <div className="portal-ui">
      <PortalShell
        navigation={navigation}
        account={{ email: identity.email ?? "", publisherName: identity.publisher_name }}
        loginHref={paths.login}
      >
        {children}
      </PortalShell>
    </div>
  );
}
