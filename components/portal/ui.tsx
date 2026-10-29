// The Publisher Portal's building blocks — the Daotra Admin's components
// (Daotraio/daotra: frontend/admin/src/components/ui.tsx, DataTable.tsx), with the
// same class names and markup, so a screen built here reads like the Admin.
// Server-renderable: no hooks, no client state. Styles: components/portal/portal.css.

import type { ReactNode } from "react";

export type Tone = "ok" | "warn" | "bad" | "info" | "mute";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </div>
  );
}

export function Card({
  title,
  actions,
  children,
  className = "",
}: {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`}>
      {title ? (
        <header className="card-head">
          <h2 className="card-title">{title}</h2>
          {actions ? <div style={{ marginLeft: "auto" }}>{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

/** Key / value rows. An empty value shows `-`, as everywhere in the Admin. */
export function Props({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="props">
      {rows.map(([term, value]) => (
        <div key={term} style={{ display: "contents" }}>
          <dt>{term}</dt>
          <dd>{value ?? <span className="subtle">-</span>}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Badge({ tone = "mute", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`badge ${tone}`}>
      <span className="dot" aria-hidden />
      {children}
    </span>
  );
}

export function Stat({ label, value, caption }: { label: ReactNode; value: ReactNode; caption?: ReactNode }) {
  return (
    <Card className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value num">{value}</div>
      {caption ? <div className="stat-caption">{caption}</div> : null}
    </Card>
  );
}

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      {icon ? <div className="empty-icon">{icon}</div> : null}
      <h3>{title}</h3>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

export function Notice({ tone, icon, children }: { tone?: "bad" | "warn"; icon?: ReactNode; children: ReactNode }) {
  return (
    <div className={`notice ${tone ?? ""}`} role={tone === "bad" ? "alert" : undefined}>
      {icon}
      <div>{children}</div>
    </div>
  );
}

export interface Column<Row> {
  key: string;
  header: ReactNode;
  align?: "right";
  render: (row: Row) => ReactNode;
}

/** A plain data table in the Admin's style; an empty set shows `empty`. */
export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  empty,
}: {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  empty: ReactNode;
}) {
  if (rows.length === 0) return <>{empty}</>;
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.align === "right" ? "right" : undefined} scope="col">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((c) => (
                <td key={c.key} className={c.align === "right" ? "right" : undefined}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
