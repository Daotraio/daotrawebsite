import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BadgeCheck, CircleSlash, Coins, MousePointerClick, UserPlus } from "lucide-react";
import type { ReactNode } from "react";
import { TimelineCard } from "@/components/portal/timeline-chart";
import { Card, PageHeader } from "@/components/portal/ui";
import { PortalSessionEndedError, readDashboard, readDashboardCharts } from "@/lib/portal-api";
import {
  formatCount,
  formatMoney,
  parsePeriod,
  PERIODS,
  type PortalDashboard,
} from "@/lib/portal-business";
import { publisherPortalPaths } from "@/lib/portal-paths";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

// The Publisher Dashboard (Daotra BD-91): the Admin Dashboard's structure for this
// Publisher alone. Every figure is Daotra's — the Admin's definitions, restricted to
// the Publisher's own Publisher-visible conversions — and the commission is the
// accrued CPA commission only, one line per currency, never converted (D4).

function StatTile({ icon, label, period, value }: { icon: ReactNode; label: string; period: string; value: number | null }) {
  return (
    <Card className="stat">
      <div className="stat-label">
        {icon}
        {label}
      </div>
      {value === null ? (
        <div className="stat-unavailable">
          <CircleSlash size={14} /> Unavailable
        </div>
      ) : (
        <div className="stat-value num">{formatCount(value)}</div>
      )}
      <div className="stat-caption">{period}</div>
    </Card>
  );
}

function CommissionCard({ data }: { data: PortalDashboard }) {
  let body: ReactNode;
  if (data.commission === null)
    body = (
      <div className="stat-unavailable">
        <CircleSlash size={14} /> Unavailable
      </div>
    );
  else if (data.commission.length === 0) body = <span className="muted">No commission in this period.</span>;
  else
    body = (
      <table className="data">
        <thead>
          <tr>
            <th scope="col">Currency</th>
            <th scope="col" className="right">
              CPA commission
            </th>
          </tr>
        </thead>
        <tbody>
          {data.commission.map((row) => (
            <tr key={row.currency}>
              <td className="mono">{row.currency}</td>
              <td className="right num">{formatMoney(row.amount, row.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  return (
    <Card title="Commission" actions={<span className="subtle">Accrued CPA · {data.period_label}</span>}>
      <div className="card-body">{body}</div>
    </Card>
  );
}

export default async function PublisherDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const paths = publisherPortalPaths((await headers()).get("host"));
  const period = parsePeriod((await searchParams).period);

  let data: PortalDashboard;
  let charts: Awaited<ReturnType<typeof readDashboardCharts>>;
  try {
    [data, charts] = await Promise.all([readDashboard(period), readDashboardCharts(period)]);
  } catch (error) {
    if (error instanceof PortalSessionEndedError) redirect(paths.login);
    throw error;
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Your own traffic and conversions. Times are UTC."
        actions={
          <nav className="segmented" aria-label="Period">
            {PERIODS.map((p) => (
              <Link
                key={p.value}
                href={`${paths.dashboard}?period=${p.value}`}
                aria-current={p.value === period ? "page" : undefined}
                className="segment"
                prefetch={false}
              >
                {p.label}
              </Link>
            ))}
          </nav>
        }
      />
      <div className="grid grid-4">
        <StatTile icon={<MousePointerClick size={15} />} label="Clicks" period={data.period_label} value={data.clicks} />
        <StatTile icon={<UserPlus size={15} />} label="Registrations" period={data.period_label} value={data.registrations} />
        <StatTile icon={<Coins size={15} />} label="FTDs" period={data.period_label} value={data.ftds} />
        <StatTile icon={<BadgeCheck size={15} />} label="QFTDs" period={data.period_label} value={data.qftds} />
      </div>
      <div style={{ marginTop: 14 }}>
        <CommissionCard data={data} />
      </div>
      <div className="dashboard-charts">
        <TimelineCard points={charts.timeline} bucket={charts.bucket} />
      </div>
    </>
  );
}
