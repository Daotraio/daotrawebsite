import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Layers } from "lucide-react";
import { CopyLink } from "@/components/portal/copy-link";
import { Badge, Card, EmptyState, PageHeader, Props } from "@/components/portal/ui";
import { PortalSessionEndedError, readDealGroups } from "@/lib/portal-api";
import {
  allocationLabel,
  countryLabel,
  formatMoney,
  formatPercent,
  plainLabel,
  trackingLink,
  trafficSourceLabel,
  type PortalDeal,
  type PortalDealGroup,
} from "@/lib/portal-business";
import { publisherPortalPaths } from "@/lib/portal-paths";

export const metadata: Metadata = {
  title: "Deal Groups",
  robots: { index: false, follow: false },
};

// The Publisher's Deal Groups (Daotra BD-91 D3): only groups with Active access, and
// in each its Active and Paused Deals, with the Publisher terms in force, this
// Publisher's own tracking link — read only, provisioned by Daotra (BD-73) — and its
// own allocation (D2): never usage, never a general-cap figure.

function Terms({ deal }: { deal: PortalDeal }) {
  const terms = deal.terms;
  if (!terms) return <span className="subtle">-</span>;
  const cpa = terms.cpa_amount ? formatMoney(terms.cpa_amount, terms.cpa_currency) : null;
  const share = terms.revshare_percent ? formatPercent(terms.revshare_percent) : null;
  // "€80 CPA", "30% RevShare", or both for a Hybrid; the model alone if no figure stands.
  const figures = [cpa ? `${cpa} CPA` : null, share ? `${share} RevShare` : null].filter(Boolean).join(" + ");
  return <span className="num">{figures || plainLabel(terms.payout_model)}</span>;
}

function DealCard({ deal, trackingBase }: { deal: PortalDeal; trackingBase: string | undefined }) {
  const terms = deal.terms;
  const link = deal.tracking_path ? trackingLink(trackingBase, deal.tracking_path) : null;
  return (
    <Card
      title={
        <span className="deal-title">
          {deal.name}
          {deal.status === "paused" ? <Badge tone="warn">Paused</Badge> : <Badge tone="ok">Active</Badge>}
        </span>
      }
      actions={<span className="allocation">{allocationLabel(deal.allocation)}</span>}
    >
      <div className="card-body">
        <Props
          rows={[
            ["Brand", deal.brand ?? null],
            ["Traffic source", deal.traffic_source ? trafficSourceLabel(deal.traffic_source) : null],
            [
              "Eligible GEOs",
              deal.countries.length ? deal.countries.map(countryLabel).join(", ") : <span className="subtle">None</span>,
            ],
            ["Payout", <Terms key="terms" deal={deal} />],
            ["Min deposit", terms?.min_deposit ? formatMoney(terms.min_deposit, terms.cpa_currency) : null],
            ["Baseline", terms?.baseline ? formatMoney(terms.baseline, terms.cpa_currency) : null],
            ["Notes", terms?.notes ?? null],
            [
              "Tracking link",
              link ? (
                <span className="link-row" key="link">
                  <code className="mono link-value">{link}</code>
                  <CopyLink value={link} />
                </span>
              ) : (
                <span className="subtle">No active tracking link</span>
              ),
            ],
          ]}
        />
        {link ? (
          <p className="link-help">
            Add your click ID as <code className="mono">clickid</code>; optionally <code className="mono">mid</code>{" "}
            for a Media Buyer ID and <code className="mono">dp1</code>–<code className="mono">dp5</code>.
          </p>
        ) : null}
      </div>
    </Card>
  );
}

function GroupSection({ group, trackingBase }: { group: PortalDealGroup; trackingBase: string | undefined }) {
  return (
    <section className="deal-group" aria-labelledby={`group-${group.deal_group_id}`}>
      <header className="deal-group-head">
        <h2 id={`group-${group.deal_group_id}`}>{group.name}</h2>
        {group.vertical ? <Badge tone="info">{plainLabel(group.vertical)}</Badge> : null}
        <span className="subtle">
          {group.deals.length} {group.deals.length === 1 ? "Deal" : "Deals"}
        </span>
      </header>
      {group.deals.length ? (
        <div className="deal-list">
          {group.deals.map((deal) => (
            <DealCard key={`${group.deal_group_id}:${deal.deal_id}`} deal={deal} trackingBase={trackingBase} />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState title="No Deals in this group yet" />
        </Card>
      )}
    </section>
  );
}

export default async function PublisherDealGroupsPage() {
  const paths = publisherPortalPaths((await headers()).get("host"));
  let groups: PortalDealGroup[];
  try {
    groups = await readDealGroups();
  } catch (error) {
    if (error instanceof PortalSessionEndedError) redirect(paths.login);
    throw error;
  }
  const trackingBase = process.env.DAOTRA_TRACKING_BASE_URL;

  return (
    <>
      <PageHeader title="Deal Groups" subtitle="The Deals you can send traffic to, with your terms and tracking links." />
      {groups.length === 0 ? (
        <Card>
          <EmptyState icon={<Layers size={20} />} title="No Deal Groups yet">
            Deal Groups appear here once Daotra activates your access.
          </EmptyState>
        </Card>
      ) : (
        <div className="deal-groups">
          {groups.map((group) => (
            <GroupSection key={group.deal_group_id} group={group} trackingBase={trackingBase} />
          ))}
        </div>
      )}
    </>
  );
}
