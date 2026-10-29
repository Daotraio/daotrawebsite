import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { publisherPortalPaths } from "@/lib/portal-paths";
import { currentPortalIdentity } from "@/lib/portal-identity";

export const metadata: Metadata = {
  title: "Publisher Overview",
  robots: { index: false, follow: false },
};

// The authenticated landing page: who is signed in, from Daotra's own answer
// (`GET /portal/me` — this Publisher's data and nothing else). Deals, tracking
// links and reporting are not shown here yet; they follow their own
// specifications, and Deals appear only through Active Deal Group access.
export default async function PublisherOverviewPage() {
  const identity = await currentPortalIdentity();
  if (!identity) redirect(publisherPortalPaths((await headers()).get("host")).login);

  const rows: Array<[string, string]> = [
    ["Publisher", identity.publisher_name],
    ["Publisher ID", identity.publisher_id],
    ["Signed in as", identity.email ?? "-"],
    ["Role", identity.portal_role === "owner" ? "Account owner" : "Member"],
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Welcome, {identity.publisher_name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your Daotra Publisher account.</p>
      </div>

      <section aria-labelledby="account-heading" className="glass max-w-2xl rounded-2xl p-6">
        <h2 id="account-heading" className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Account
        </h2>
        <dl className="mt-4 divide-y divide-white/[0.06]">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="break-all text-sm text-foreground sm:col-span-2">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="max-w-2xl text-sm text-muted-foreground">
        Your Deals and tracking links will appear here once Daotra has completed your onboarding and
        your access is active.
      </p>
    </div>
  );
}
