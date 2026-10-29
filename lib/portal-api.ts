// The Publisher portal's business reads, server-side — Daotra BD-91.
//
// Each read sends the session token and nothing that names a Publisher: Daotra
// resolves the tenant from the session (ADR-0002, ADR-0030), so a page cannot ask
// for anybody else's data — there is no parameter to ask with. A session Daotra no
// longer accepts (logout elsewhere, a reset, a disabled login) answers 401 and the
// page goes to the login; anything else unexpected is an error, never an empty
// screen that would look like "no data".
//
// Server Components only: it reads the session cookie and, through
// lib/daotra-api.ts, the gateway secret.

import { cookies } from "next/headers";
import { callDaotra } from "@/lib/daotra-api";
import {
  postbackQuery,
  type Period,
  type PortalDashboard,
  type PortalDashboardCharts,
  type PortalDealGroup,
  type PortalPostbackPage,
  type PostbackFilters,
} from "@/lib/portal-business";
import { SESSION_COOKIE } from "@/lib/portal-session";

if (typeof window !== "undefined") {
  throw new Error("lib/portal-api is server-only");
}

/** The session is no longer live: the caller sends the browser to the login. */
export class PortalSessionEndedError extends Error {
  constructor() {
    super("portal session ended");
    this.name = "PortalSessionEndedError";
  }
}

export class PortalReadError extends Error {
  constructor(path: string, status: number) {
    super(`portal read ${path} answered ${status}`);
    this.name = "PortalReadError";
  }
}

/** One read, with the session's own token — exported for tests. */
export async function portalRead<T>(path: `/portal/${string}`, token: string | undefined): Promise<T> {
  if (!token) throw new PortalSessionEndedError();
  const { status, body } = await callDaotra(path, { token });
  if (status === 401 || status === 403) throw new PortalSessionEndedError();
  if (status !== 200 || body === null || typeof body !== "object") {
    // The path only (it carries filters, never a credential) — never the body.
    throw new PortalReadError(path.split("?")[0] ?? path, status);
  }
  return body as T;
}

async function sessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function readDashboard(period: Period): Promise<PortalDashboard> {
  return portalRead(`/portal/dashboard?period=${period}`, await sessionToken());
}

export async function readDashboardCharts(period: Period): Promise<PortalDashboardCharts> {
  return portalRead(`/portal/dashboard/charts?period=${period}`, await sessionToken());
}

export async function readDealGroups(): Promise<PortalDealGroup[]> {
  return portalRead("/portal/deal-groups", await sessionToken());
}

export async function readPostbacks(filters: PostbackFilters): Promise<PortalPostbackPage> {
  return portalRead(`/portal/postbacks${postbackQuery(filters)}`, await sessionToken());
}
