// The Publisher portal's business screens — Daotra BD-91: Dashboard, Deal Groups,
// Postbacks Log. Pure helpers only (no I/O, no secrets), so what a screen shows and
// what it asks Daotra for are unit-tested.
//
// **The website never names a Publisher.** Every request below carries only the
// session (lib/portal-api.ts) and Daotra resolves the tenant from it (ADR-0030). The
// query a page sends is built here from an explicit allowlist of filter keys, so a
// browser-supplied parameter — `publisher_id` or anything else — is never forwarded.
//
// Display rules are the Daotra Admin's (frontend/admin/src/lib/format.ts, labels.ts):
// amounts at most three decimals, half up, from the decimal string — never a float —
// with the currency's symbol, and never converted or combined across currencies.

// --------------------------------------------------------------------------
// Response shapes — Daotra's `/portal/*` models, field for field
// --------------------------------------------------------------------------

export interface PortalCommission {
  currency: string;
  amount: string;
}

export interface PortalDashboard {
  period: string;
  period_label: string;
  period_start: string;
  period_end: string;
  clicks: number | null;
  registrations: number | null;
  ftds: number | null;
  qftds: number | null;
  commission: PortalCommission[] | null;
}

export interface PortalTimelinePoint {
  bucket_start: string;
  registrations: number;
  ftds: number;
  qftds: number;
}

export interface PortalDashboardCharts {
  period: string;
  bucket: string;
  timeline: PortalTimelinePoint[] | null;
}

export interface PortalCountry {
  country_code: string;
  country_name: string | null;
  only_subdivisions: string[];
  excluded_subdivisions: string[];
}

export interface PortalTerms {
  payout_model: string;
  cpa_amount: string | null;
  cpa_currency: string | null;
  revshare_percent: string | null;
  min_deposit: string | null;
  baseline: string | null;
  notes: string | null;
}

export interface PortalDeal {
  deal_id: string;
  name: string;
  status: string;
  brand: string | null;
  traffic_source: string | null;
  countries: PortalCountry[];
  terms: PortalTerms | null;
  tracking_path: string | null;
  /** This Publisher's own allocation; `null` is Uncapped (D2). */
  allocation: number | null;
}

export interface PortalDealGroup {
  deal_group_id: string;
  name: string;
  vertical: string | null;
  deals: PortalDeal[];
}

export interface PortalPostback {
  received_at: string;
  event_type: string;
  publisher_click_id: string | null;
  deal_name: string;
}

export interface PortalPostbackPage {
  rows: PortalPostback[];
  next_cursor: string | null;
}

// --------------------------------------------------------------------------
// Periods
// --------------------------------------------------------------------------

export type Period = "today" | "last_7_days" | "current_month";

export const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "current_month", label: "Current Month" },
];

/** The period a page shows: a known value, otherwise the Admin's default. */
export function parsePeriod(raw: string | string[] | undefined): Period {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return PERIODS.some((p) => p.value === value) ? (value as Period) : "last_7_days";
}

// --------------------------------------------------------------------------
// Postbacks Log filters (BD-91 D1)
// --------------------------------------------------------------------------

export const EVENT_FILTERS = [
  { value: "registration", label: "Registration" },
  { value: "ftd", label: "FTD" },
  { value: "qftd", label: "QFTD" },
] as const;

/**
 * The only parameters the Postbacks Log ever sends. Traffic Class, Attribution,
 * Publisher, Advertiser and Daotra Click ID are not filters here (BD-91 D1).
 */
export interface PostbackFilters {
  received_from?: string;
  received_to?: string;
  event_type?: string;
  deal_id?: string;
  country?: string;
  publisher_click_id?: string;
  cursor?: string;
}

/** A whole UTC day Daotra accepts (2000-01-01 … 9998-12-31); anything else is dropped. */
const DATE = /^(?:[2-9]\d{3})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
const isDate = (value: string): boolean => DATE.test(value) && value <= "9998-12-31";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const COUNTRY = /^[A-Za-z]{2}$/;
const CURSOR = /^[A-Za-z0-9_-]{1,256}$/;

type SearchParams = Record<string, string | string[] | undefined>;

function first(params: SearchParams, key: string): string | undefined {
  const value = params[key];
  const text = (Array.isArray(value) ? value[0] : value)?.trim();
  return text ? text : undefined;
}

/**
 * The filters a page URL asks for — each validated, everything else dropped. An
 * invalid value is ignored rather than sent, so a hand-edited URL shows the
 * unfiltered log instead of an error.
 */
export function parsePostbackFilters(params: SearchParams): PostbackFilters {
  const filters: PostbackFilters = {};
  const from = first(params, "received_from");
  if (from && isDate(from)) filters.received_from = from;
  const to = first(params, "received_to");
  if (to && isDate(to)) filters.received_to = to;
  const event = first(params, "event_type");
  if (event && EVENT_FILTERS.some((e) => e.value === event)) filters.event_type = event;
  const deal = first(params, "deal_id");
  if (deal && UUID.test(deal)) filters.deal_id = deal.toLowerCase();
  const country = first(params, "country");
  if (country && COUNTRY.test(country)) filters.country = country.toUpperCase();
  const click = first(params, "publisher_click_id");
  if (click && click.length <= 255) filters.publisher_click_id = click;
  const cursor = first(params, "cursor");
  if (cursor && CURSOR.test(cursor)) filters.cursor = cursor;
  return filters;
}

const FILTER_KEYS: (keyof PostbackFilters)[] = [
  "received_from",
  "received_to",
  "event_type",
  "deal_id",
  "country",
  "publisher_click_id",
  "cursor",
];

/** A query string from the allowlisted keys only, in a fixed order. */
export function postbackQuery(filters: PostbackFilters): string {
  const query = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = filters[key];
    if (value) query.set(key, value);
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}

/** Whether any filter (not the page position) is applied. */
export function hasFilters(filters: PostbackFilters): boolean {
  return FILTER_KEYS.some((key) => key !== "cursor" && Boolean(filters[key]));
}

// --------------------------------------------------------------------------
// Display — the Daotra Admin's rules
// --------------------------------------------------------------------------

const CURRENCY_SYMBOLS: Readonly<Record<string, string>> = { USD: "$", EUR: "€" };
const MONEY_DISPLAY_DECIMALS = 3;

/** Half up, by digit arithmetic on the string — never a float. */
export function roundDecimalString(value: string, places: number): string {
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(value.trim());
  if (!match) return value;
  const [, sign = "", whole = "0", fraction = ""] = match;
  if (fraction.length <= places) return value.trim();
  const kept = whole + fraction.slice(0, places);
  const roundUp = Number(fraction[places]) >= 5;
  let digits = kept.split("").map(Number);
  if (roundUp) {
    let i = digits.length - 1;
    while (i >= 0) {
      if (digits[i]! < 9) {
        digits[i]! += 1;
        break;
      }
      digits[i] = 0;
      i -= 1;
    }
    if (i < 0) digits = [1, ...digits];
  }
  const text = digits.join("");
  const intPart = text.slice(0, text.length - places) || "0";
  const fracPart = places > 0 ? text.slice(text.length - places) : "";
  return `${sign}${intPart}${fracPart ? `.${fracPart}` : ""}`;
}

/** Grouped, trailing zeros trimmed: `"12345.500000"` → `"12,345.5"`. */
export function formatDecimal(value: string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "-";
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(value.trim());
  if (!match) return value;
  const [, sign = "", whole = "0", fraction = ""] = match;
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const trimmed = fraction.replace(/0+$/, "");
  const negative = sign === "-" && (/[1-9]/.test(whole) || trimmed !== "");
  return `${negative ? "−" : ""}${grouped}${trimmed ? `.${trimmed}` : ""}`;
}

/** `€160`, `$77.123`: the symbol before, at most three decimals; never converted. */
export function formatMoney(value: string | null | undefined, currency: string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "-";
  const text = formatDecimal(roundDecimalString(value, MONEY_DISPLAY_DECIMALS));
  if (text === "-" || !/\d/.test(text)) return text;
  const code = (currency ?? "").trim().toUpperCase();
  const symbol = CURRENCY_SYMBOLS[code];
  if (symbol) return text.startsWith("−") ? `−${symbol}${text.slice(1)}` : `${symbol}${text}`;
  return code ? `${text} ${code}` : text;
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

/** A percentage from its decimal string: `"30.0000"` → `30%`. */
export function formatPercent(value: string | null | undefined): string {
  const text = formatDecimal(value);
  return text === "-" ? text : `${text}%`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** `29 Oct 2026, 14:05 UTC` — Daotra's time is UTC everywhere. */
export function formatUtc(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}, ${hh}:${mm} UTC`;
}

const EVENT_LABELS: Record<string, string> = { registration: "Registration", ftd: "FTD", qftd: "QFTD" };
export const eventLabel = (value: string): string => EVENT_LABELS[value] ?? "Other";

const PLAIN: Record<string, string> = {
  igaming: "iGaming",
  prediction_markets: "Prediction Markets",
  tech: "Tech",
  cpa: "CPA",
  revshare: "Revenue Share",
  hybrid: "Hybrid",
  active: "Active",
  paused: "Paused",
};
export const plainLabel = (value: string | null | undefined): string =>
  value ? (PLAIN[value] ?? value) : "-";

const TRAFFIC_SOURCES: Record<string, string> = {
  facebook: "Facebook",
  reddit: "Reddit",
  snapchat: "Snapchat",
  seo: "SEO",
  google_ppc: "Google PPC",
  bing_ppc: "Bing PPC",
  aso: "ASO",
  asa: "ASA",
  uac: "UAC",
  sms: "SMS",
  email: "Email",
  influencers: "Influencers & Streamers",
};
export const trafficSourceLabel = (value: string | null | undefined): string =>
  value ? (TRAFFIC_SOURCES[value] ?? value) : "-";

/** D2: the Publisher's own allocation only — never usage, never the general cap. */
export function allocationLabel(allocation: number | null): string {
  return allocation === null ? "Uncapped" : `Allocation: ${formatCount(allocation)}`;
}

/** `US — NJ, NY only` / `US — except NV` / `Germany`. */
export function countryLabel(country: PortalCountry): string {
  const name = country.country_name ?? country.country_code;
  if (country.only_subdivisions.length) return `${name} (${country.only_subdivisions.join(", ")} only)`;
  if (country.excluded_subdivisions.length)
    return `${name} (except ${country.excluded_subdivisions.join(", ")})`;
  return name;
}

/**
 * The full tracking link: the configured tracking origin (`DAOTRA_TRACKING_BASE_URL`,
 * a bare https origin — never guessed) and the path Daotra returned. Without a valid
 * origin the path alone is shown, as the Admin does.
 */
export function trackingLink(base: string | undefined, path: string): string {
  const origin = trackingOrigin(base);
  return origin ? `${origin}${path}` : path;
}

export function trackingOrigin(base: string | undefined): string | null {
  const raw = base?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const bare = (url.pathname === "/" || url.pathname === "") && !url.search && !url.hash;
    if (!bare || url.username || url.password) return null;
    if (url.protocol !== "https:" && !(url.protocol === "http:" && url.hostname === "localhost")) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/** The Publisher's own Deals across its groups, once each, for the Deal filter. */
export function dealOptions(groups: PortalDealGroup[]): { value: string; label: string }[] {
  const seen = new Map<string, string>();
  for (const group of groups) for (const deal of group.deals) seen.set(deal.deal_id, deal.name);
  return [...seen.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// --------------------------------------------------------------------------
// Timeline — the Admin's chart helpers (frontend/admin/src/lib/dashboardCharts.ts)
// --------------------------------------------------------------------------

export type TimelineMetric = "registrations" | "ftds" | "qftds";

export const METRICS: { value: TimelineMetric; label: string; name: string }[] = [
  { value: "registrations", label: "REG", name: "Registrations" },
  { value: "ftds", label: "FTD", name: "FTDs" },
  { value: "qftds", label: "QFTD", name: "QFTDs" },
];

export function niceTicks(max: number, count = 4): number[] {
  if (!(max > 0)) return [0, 1];
  const raw = max / count;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * power).find((s) => s >= raw) ?? 10 * power);
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let value = 0; value <= top + step / 2; value += step) ticks.push(Math.round(value));
  return ticks;
}

export function compactCount(value: number): string {
  if (value < 1000) return String(value);
  if (value < 1_000_000) return `${trim(value / 1000)}K`;
  return `${trim(value / 1_000_000)}M`;
}

const trim = (value: number) => (value >= 10 ? String(Math.round(value)) : value.toFixed(1).replace(/\.0$/, ""));

export function bucketLabel(iso: string, bucket: string): string {
  const date = new Date(iso);
  if (bucket === "hour") return `${String(date.getUTCHours()).padStart(2, "0")}:00`;
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
}

export function bucketTitle(iso: string, bucket: string): string {
  const date = new Date(iso);
  const day = `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
  return bucket === "hour" ? `${day}, ${bucketLabel(iso, bucket)} UTC` : `${day} ${date.getUTCFullYear()}`;
}

export function labelledIndexes(length: number, max: number): number[] {
  if (length <= 0) return [];
  if (length <= max) return Array.from({ length }, (_, i) => i);
  const step = Math.ceil((length - 1) / (max - 1));
  const indexes: number[] = [];
  for (let i = 0; i < length; i += step) indexes.push(i);
  if (indexes[indexes.length - 1] !== length - 1) {
    if (length - 1 - indexes[indexes.length - 1]! < step / 2) indexes.pop();
    indexes.push(length - 1);
  }
  return indexes;
}
