import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Layers } from "lucide-react";
import { CopyLink } from "@/components/portal/copy-link";
import { DealPayout } from "@/components/portal/deal-terms";
import { Badge, Card, DataTable, EmptyState, PageHeader, type Column } from "@/components/portal/ui";
import { PortalSessionEndedError, readDealGroups } from "@/lib/portal-api";
import {
  allocationLabel,
  countryLabel,
  findGroup,
  formatMoney,
  plainLabel,
  trackingLink,
  trafficSourceLabel,
  type PortalDeal,
  type PortalDealGroup,
} from "@/lib/portal-business";
import { publisherPortalPaths } from "@/lib/portal-paths";

export const metadata: Metadata = {
  title: "Deal Group",
  robots: { index: false, follow: false },
};

// One Deal Group's Deals (Daotra BD-91 D3), one Deal per row — the Admin's Deal Group
// detail table, adapted to what a Publisher may see: Active and Paused Deals, the brand
// only where brand-visible, the eligible GEOs, the Publisher terms, this Publisher's own
// tracking link (read only — BD-73) and its own allocation (D2). The group comes from
// Daotra's scoped `/portal/deal-groups`: a group that is not this Publisher's Active
// group — another Publisher's, a Pending one, or none at all — is "not found", alike.

function columns(trackingBase: string | undefined): Column<PortalDeal>[] {
  return [
    {
      key: "deal",
      header: "Deal",
      render: (deal) => <strong>{deal.name}</strong>,
    },
    { key: "brand", header: "Advertiser", render: (deal) => deal.brand ?? <span className="subtle">-</span> },
    {
      key: "status",
      header: "Status",
      render: (deal) => (deal.status === "paused" ? <Badge tone="warn">Paused</Badge> : <Badge tone="ok">Active</Badge>),
    },
    {
      key: "traffic",
      header: "Traffic source",
      render: (deal) => (deal.traffic_source ? trafficSourceLabel(deal.traffic_source) : <span className="subtle">-</span>),
    },
    {
      key: "geos",
      header: "Eligible GEOs",
      render: (deal) =>
        deal.countries.length ? (
          <span className="wrap">{deal.countries.map(countryLabel).join(", ")}</span>
        ) : (
          <span className="subtle">None</span>
        ),
    },
    { key: "payout", header: "Payout", render: (deal) => <DealPayout deal={deal} /> },
    {
      key: "min",
      header: "Min deposit",
      align: "right",
      render: (deal) =>
        deal.terms?.min_deposit ? (
          <span className="num">{formatMoney(deal.terms.min_deposit, deal.terms.cpa_currency)}</span>
        ) : (
          <span className="subtle">-</span>
        ),
    },
    {
      key: "baseline",
      header: "Baseline",
      align: "right",
      render: (deal) =>
        deal.terms?.baseline ? (
          <span className="num">{formatMoney(deal.terms.baseline, deal.terms.cpa_currency)}</span>
        ) : (
          <span className="subtle">-</span>
        ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (deal) => (deal.terms?.notes ? <span className="wrap">{deal.terms.notes}</span> : <span className="subtle">-</span>),
    },
    { key: "allocation", header: "Allocation", render: (deal) => allocationLabel(deal.allocation) },
    {
      key: "link",
      header: "Tracking link",
      render: (deal) => {
        if (!deal.tracking_path) return <span className="subtle">No active tracking link</span>;
        const link = trackingLink(trackingBase, deal.tracking_path);
        return (
          <span className="link-row">
            <code className="mono link-value">{link}</code>
            <CopyLink value={link} />
          </span>
        );
      },
    },
  ];
}

export default async function PublisherDealGroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const paths = publisherPortalPaths((await headers()).get("host"));
  const { groupId } = await params;
  let groups: PortalDealGroup[];
  try {
    groups = await readDealGroups();
  } catch (error) {
    if (error instanceof PortalSessionEndedError) redirect(paths.login);
    throw error;
  }
  const group = findGroup(groups, groupId);
  if (!group) notFound();

  return (
    <>
      <PageHeader
        title={group.name}
        subtitle={
          <>
            {group.vertical ? <Badge tone="info">{plainLabel(group.vertical)}</Badge> : null}{" "}
            {group.deals.length} {group.deals.length === 1 ? "Deal" : "Deals"}
          </>
        }
        actions={
          <Link href={paths.dealGroups} className="btn sm" prefetch={false}>
            <ChevronLeft size={13} /> All Deal Groups
          </Link>
        }
      />
      <Card>
        <DataTable
          columns={columns(process.env.DAOTRA_TRACKING_BASE_URL)}
          rows={group.deals}
          rowKey={(deal) => deal.deal_id}
          empty={<EmptyState icon={<Layers size={20} />} title="No Deals in this group yet" />}
        />
        {group.deals.some((deal) => deal.tracking_path) ? (
          <p className="link-help table-foot">
            Add your click ID to a tracking link as <code className="mono">clickid</code>; optionally{" "}
            <code className="mono">mid</code> for a Media Buyer ID and <code className="mono">dp1</code>–
            <code className="mono">dp5</code>.
          </p>
        ) : null}
      </Card>
    </>
  );
}
