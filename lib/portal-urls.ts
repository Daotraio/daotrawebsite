// Where the "Login" / "Register" links on the marketing site go.
//
// Production: the Publisher portal lives on its own subdomain
// (aff.daotra.io; middleware.ts rewrites it to /portal/publisher/*).
// Staging: that subdomain isn't connected - staging is a single workers.dev
// host - so links go to the internal portal routes instead, which lets the
// whole registration flow be tried end to end on staging.
//
// Read at request time from the per-environment APP_ENV var (see lib/seo.ts
// for why this can't be a build-time constant). Default is the production
// URLs, so if APP_ENV ever failed to reach the Worker, the fallback is the
// correct public link rather than a staging-only path; local `next dev`
// uses the internal routes since aff.daotra.io isn't reachable from there.
export interface PortalUrls {
  login: string;
  register: string;
}

export function getPublisherPortalUrls(): PortalUrls {
  const useInternalRoutes =
    process.env.APP_ENV === "staging" || process.env.NODE_ENV === "development";

  return useInternalRoutes
    ? { login: "/portal/publisher/login", register: "/portal/publisher/register" }
    : { login: "https://aff.daotra.io/login", register: "https://aff.daotra.io/register" };
}
