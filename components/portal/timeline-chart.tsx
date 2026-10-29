"use client";

// The Conversions timeline — the Daotra Admin's (frontend/admin/src/pages/
// DashboardCharts.tsx, BD-89), for the signed-in Publisher's own figures (BD-91). Every
// count arrives from the server; this only draws it. The REG · FTD · QFTD switch
// changes the line drawn: all three series arrive at once. Hand-drawn SVG, as the
// Admin's, with a table twin so every value is reachable without hovering.

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { CircleSlash } from "lucide-react";
import {
  bucketLabel,
  bucketTitle,
  compactCount,
  formatCount,
  labelledIndexes,
  METRICS,
  niceTicks,
  type PortalTimelinePoint,
  type TimelineMetric,
} from "@/lib/portal-business";

const HEIGHT = 232;
const PAD = { top: 14, right: 16, bottom: 28, left: 40 };

function useWidth<T extends HTMLElement>(): [React.RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry!.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

function Plot({ points, bucket, metric }: { points: PortalTimelinePoint[]; bucket: string; metric: TimelineMetric }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const values = points.map((p) => p[metric]);
  const ticks = niceTicks(Math.max(...values, 0));
  const top = ticks[ticks.length - 1] || 1;
  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (points.length <= 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const y = (v: number) => PAD.top + plotH - (v / top) * plotH;
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const area = `${line}L${x(points.length - 1).toFixed(1)},${y(0)}L${x(0).toFixed(1)},${y(0)}Z`;
  const labels = labelledIndexes(points.length, Math.max(2, Math.floor(plotW / 64)));
  const name = METRICS.find((m) => m.value === metric)?.name ?? "";

  const pick = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const rel = event.clientX - box.left - PAD.left;
    const index = points.length <= 1 ? 0 : Math.round((rel / plotW) * (points.length - 1));
    setActive(Math.min(points.length - 1, Math.max(0, index)));
  };
  const step = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const from = active ?? (event.key === "ArrowLeft" ? points.length : -1);
    setActive(Math.min(points.length - 1, Math.max(0, from + (event.key === "ArrowRight" ? 1 : -1))));
  };
  const current = active === null ? null : points[active];

  return (
    <div className="timeline-plot" ref={ref}>
      {width > 0 ? (
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={`${name} per ${bucket}`}
          tabIndex={0}
          onPointerMove={pick}
          onPointerLeave={() => setActive(null)}
          onKeyDown={step}
          onBlur={() => setActive(null)}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line className="chart-grid" x1={PAD.left} x2={PAD.left + plotW} y1={y(tick)} y2={y(tick)} />
              <text className="chart-tick" x={PAD.left - 8} y={y(tick)} dy="0.32em" textAnchor="end">
                {compactCount(tick)}
              </text>
            </g>
          ))}
          {labels.map((i) => (
            <text
              key={i}
              className="chart-tick"
              x={x(i)}
              y={HEIGHT - 8}
              textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
            >
              {bucketLabel(points[i]!.bucket_start, bucket)}
            </text>
          ))}
          <path className="chart-area" d={area} />
          <path className="chart-line" d={line} />
          {current && active !== null ? (
            <g>
              <line className="chart-crosshair" x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + plotH} />
              <circle className="chart-dot" cx={x(active)} cy={y(values[active]!)} r={4.5} />
            </g>
          ) : null}
        </svg>
      ) : (
        <div style={{ height: HEIGHT }} />
      )}
      {current && active !== null ? (
        <div
          className="chart-tooltip"
          role="status"
          style={{
            left: Math.min(Math.max(x(active), 70), Math.max(70, width - 70)),
            top: Math.max(0, y(values[active]!) - 58),
          }}
        >
          <strong className="num">{formatCount(values[active]!)}</strong>
          <span>
            {name} · {bucketTitle(current.bucket_start, bucket)}
          </span>
        </div>
      ) : null}
      {/* Hidden by a wrapping element: a <table> ignores the clip's overflow, so its
          rows would otherwise lengthen the page. */}
      <div className="sr-only">
        <table>
          <caption>{name}</caption>
          <tbody>
            {points.map((p) => (
              <tr key={p.bucket_start}>
                <th scope="row">{bucketTitle(p.bucket_start, bucket)}</th>
                <td>{p[metric]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** `points` null: the read was cancelled by Daotra's statement timeout. */
export function TimelineCard({ points, bucket }: { points: PortalTimelinePoint[] | null; bucket: string }) {
  const [metric, setMetric] = useState<TimelineMetric>("qftds");
  const total = useMemo(() => (points ? points.reduce((sum, p) => sum + p[metric], 0) : 0), [points, metric]);
  let body;
  if (points === null)
    body = (
      <div className="chart-empty">
        <CircleSlash size={14} /> Unavailable — the read took too long
      </div>
    );
  else if (points.every((p) => p.registrations + p.ftds + p.qftds === 0))
    body = <div className="chart-empty">No data for selected period</div>;
  else body = <Plot points={points} bucket={bucket} metric={metric} />;
  return (
    <section className="card">
      <header className="card-head">
        <h2 className="card-title">
          <span className="chart-title">
            Conversions
            {points ? (
              <span className="chart-total">
                <span className="num">{formatCount(total)}</span> {METRICS.find((m) => m.value === metric)?.name}
              </span>
            ) : null}
          </span>
        </h2>
        <div style={{ marginLeft: "auto" }}>
          <div className="segmented" role="group" aria-label="Metric">
            {METRICS.map((m) => (
              <button key={m.value} type="button" aria-pressed={m.value === metric} onClick={() => setMetric(m.value)}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="card-body chart-body">{body}</div>
    </section>
  );
}
