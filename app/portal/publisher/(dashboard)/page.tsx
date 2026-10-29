import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Card, PageHeader, Props } from "@/components/portal/ui";
import { publisherPortalPaths } from "@/lib/portal-paths";
import { currentPortalIdentity } from "@/lib/portal-identity";

export const metadata: Metadata = {
  title: "Publisher Overview",
  robots: { index: false, follow: false },
};

// The authenticated landing page: who is signed in, from Daotra's own answer
// (`GET /portal/me` — this Publisher's data and nothing else). The business
// screens — Dashboard, Deal Groups, Postbacks Log — are beside it (Daotra BD-91).
export default async function PublisherOverviewPage() {
  const identity = await currentPortalIdentity();
  if (!identity) redirect(publisherPortalPaths((await headers()).get("host")).login);

  return (
    <>
      <PageHeader title={`Welcome, ${identity.publisher_name}`} subtitle="Your Daotra Publisher account." />
      <div style={{ maxWidth: 720 }}>
        <Card title="Account">
          <div className="card-body">
            <Props
              rows={[
                ["Publisher", identity.publisher_name],
                ["Publisher ID", <span key="id" className="mono">{identity.publisher_id}</span>],
                ["Signed in as", identity.email],
                ["Role", identity.portal_role === "owner" ? "Account owner" : "Member"],
              ]}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
