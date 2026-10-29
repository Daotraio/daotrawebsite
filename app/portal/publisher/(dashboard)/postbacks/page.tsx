import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Send } from "lucide-react";
import { Card, DataTable, EmptyState, PageHeader } from "@/components/portal/ui";
import { PortalSessionEndedError, readDealGroups, readPostbacks } from "@/lib/portal-api";
import {
  dealOptions,
  EVENT_FILTERS,
  eventLabel,
  formatUtc,
  hasFilters,
  parsePostbackFilters,
  postbackQuery,
  type PortalDealGroup,
  type PortalPostback,
  type PortalPostbackPage,
} from "@/lib/portal-business";
import { publisherPortalPaths } from "@/lib/portal-paths";

export const metadata: Metadata = {
  title: "Postbacks Log",
  robots: { index: false, follow: false },
};

// The Publisher's Postbacks Log (Daotra BD-91 D1): only live postbacks Daotra
// delivered to this Publisher — what the Admin log shows with Publisher Delivery
// "Successful" — in exactly four columns. The filters are a plain GET form, so the
// URL is the state; Daotra re-applies the Publisher on every page.

const COLUMNS = [
  { key: "date", header: "Date", render: (row: PortalPostback) => <span className="num">{formatUtc(row.received_at)}</span> },
  { key: "event", header: "Event", render: (row: PortalPostback) => eventLabel(row.event_type) },
  {
    key: "click",
    header: "Publisher Click ID",
    render: (row: PortalPostback) =>
      row.publisher_click_id ? <span className="mono">{row.publisher_click_id}</span> : <span className="subtle">-</span>,
  },
  { key: "deal", header: "Deal", render: (row: PortalPostback) => row.deal_name },
];

export default async function PublisherPostbacksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const paths = publisherPortalPaths((await headers()).get("host"));
  const filters = parsePostbackFilters(await searchParams);

  let page: PortalPostbackPage;
  let groups: PortalDealGroup[];
  try {
    [page, groups] = await Promise.all([readPostbacks(filters), readDealGroups()]);
  } catch (error) {
    if (error instanceof PortalSessionEndedError) redirect(paths.login);
    throw error;
  }
  const deals = dealOptions(groups);
  const filtered = hasFilters(filters);
  const { cursor, ...withoutCursor } = filters;
  const older = page.next_cursor ? `${paths.postbacks}${postbackQuery({ ...withoutCursor, cursor: page.next_cursor })}` : null;
  const newest = cursor ? `${paths.postbacks}${postbackQuery(withoutCursor)}` : null;

  return (
    <>
      <PageHeader title="Postbacks Log" subtitle="Postbacks Daotra delivered to you, newest first. Times are UTC." />
      <Card>
        <form className="filters" method="get" action={paths.postbacks} aria-label="Filters">
          <label className="filter">
            <span>From</span>
            <input className="input" type="date" name="received_from" defaultValue={filters.received_from} />
          </label>
          <label className="filter">
            <span>To</span>
            <input className="input" type="date" name="received_to" defaultValue={filters.received_to} />
          </label>
          <label className="filter">
            <span>Event</span>
            <select className="select" name="event_type" defaultValue={filters.event_type ?? ""}>
              <option value="">All events</option>
              {EVENT_FILTERS.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </label>
          <label className="filter">
            <span>Deal</span>
            <select className="select" name="deal_id" defaultValue={filters.deal_id ?? ""}>
              <option value="">All Deals</option>
              {deals.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          <label className="filter">
            <span>Country</span>
            <input
              className="input"
              name="country"
              placeholder="DE"
              maxLength={2}
              size={4}
              defaultValue={filters.country}
              pattern="[A-Za-z]{2}"
              title="Two-letter country code"
            />
          </label>
          <label className="filter">
            <span>Publisher Click ID</span>
            <input className="input mono" name="publisher_click_id" maxLength={255} defaultValue={filters.publisher_click_id} />
          </label>
          <div className="filter-actions">
            <button type="submit" className="btn primary sm">
              Apply
            </button>
            {filtered ? (
              <Link href={paths.postbacks} className="btn ghost sm" prefetch={false}>
                Clear
              </Link>
            ) : null}
          </div>
        </form>
        <DataTable
          columns={COLUMNS}
          rows={page.rows}
          rowKey={(row) => `${row.received_at}:${row.event_type}:${row.publisher_click_id ?? ""}:${row.deal_name}`}
          empty={
            <EmptyState icon={<Send size={20} />} title={filtered ? "No postbacks match these filters" : "No delivered postbacks yet"}>
              {filtered ? "Try a wider date range or fewer filters." : "Postbacks appear here once Daotra delivers them to you."}
            </EmptyState>
          }
        />
        {older || newest ? (
          <div className="pager">
            {newest ? (
              <Link href={newest} className="btn sm" prefetch={false}>
                Back to newest
              </Link>
            ) : (
              <span />
            )}
            {older ? (
              <Link href={older} className="btn sm" prefetch={false}>
                Older postbacks
              </Link>
            ) : null}
          </div>
        ) : null}
      </Card>
    </>
  );
}
