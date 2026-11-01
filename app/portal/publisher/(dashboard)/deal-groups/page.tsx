import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChevronRight, Layers } from "lucide-react";
import { Badge, Card, DataTable, EmptyState, PageHeader, type Column } from "@/components/portal/ui";
import { PortalSessionEndedError, readDealGroups } from "@/lib/portal-api";
import { plainLabel, type PortalDealGroup } from "@/lib/portal-business";
import { dealGroupPath, publisherPortalPaths } from "@/lib/portal-paths";

export const metadata: Metadata = {
  title: "Deal Groups",
  robots: { index: false, follow: false },
};

// The Publisher's Deal Groups (Daotra BD-91 D3) as a table — one group per row, as the
// Admin's Deal Groups list — showing only groups with Active access. A row opens the
// group's Deals. Every figure comes from Daotra's `/portal/deal-groups`, already scoped
// to this Publisher; nothing here filters for authorization.

export default async function PublisherDealGroupsPage() {
  const paths = publisherPortalPaths((await headers()).get("host"));
  let groups: PortalDealGroup[];
  try {
    groups = await readDealGroups();
  } catch (error) {
    if (error instanceof PortalSessionEndedError) redirect(paths.login);
    throw error;
  }

  const columns: Column<PortalDealGroup>[] = [
    {
      key: "name",
      header: "Deal Group",
      render: (group) => (
        <Link href={dealGroupPath(paths, group.deal_group_id)} className="row-link" prefetch={false}>
          {group.name}
        </Link>
      ),
    },
    {
      key: "vertical",
      header: "Vertical",
      render: (group) => (group.vertical ? <Badge tone="info">{plainLabel(group.vertical)}</Badge> : <span className="subtle">-</span>),
    },
    { key: "deals", header: "Deals", align: "right", render: (group) => <span className="num">{group.deals.length}</span> },
    {
      key: "open",
      header: <span className="sr-only">Open</span>,
      align: "right",
      render: (group) => (
        <Link href={dealGroupPath(paths, group.deal_group_id)} className="btn ghost sm" prefetch={false} aria-label={`Open ${group.name}`}>
          View Deals <ChevronRight size={13} />
        </Link>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Deal Groups" subtitle="The Deal Groups you can send traffic to. Open one to see its Deals, terms and tracking links." />
      <Card>
        <DataTable
          columns={columns}
          rows={groups}
          rowKey={(group) => group.deal_group_id}
          empty={
            <EmptyState icon={<Layers size={20} />} title="No Deal Groups yet">
              Deal Groups appear here once Daotra activates your access.
            </EmptyState>
          }
        />
      </Card>
    </>
  );
}
