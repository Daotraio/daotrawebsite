// The signed-in Publisher for the current page render — Server Components only
// (React's `cache` exists only there). Route handlers use lib/portal-session.ts.
import { cache } from "react";
import { cookies } from "next/headers";
import { fetchPortalIdentity, SESSION_COOKIE, type PortalIdentity } from "@/lib/portal-session";

/** Asked of Daotra once per render, however many components need it. */
export const currentPortalIdentity = cache(async (): Promise<PortalIdentity | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return fetchPortalIdentity(token);
});
