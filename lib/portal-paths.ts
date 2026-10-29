// Where the Publisher portal's pages live for the current host.
//
// On aff.daotra.io, middleware.ts rewrites "/x" to "/portal/publisher/x", so
// links are short. Staging is a single workers.dev host with no subdomain, and
// local `next dev` has none either: there the internal routes are linked
// directly. Decided per request from the Host header, so one build serves both.

export interface PublisherPortalPaths {
  home: string;
  login: string;
  register: string;
  forgotPassword: string;
  /** The business screens (Daotra BD-91). */
  dashboard: string;
  dealGroups: string;
  postbacks: string;
}

export function publisherPortalPaths(host: string | null | undefined): PublisherPortalPaths {
  const base = (host ?? "").startsWith("aff.") ? "" : "/portal/publisher";
  return {
    home: base || "/",
    login: `${base}/login`,
    register: `${base}/register`,
    forgotPassword: `${base}/login/forgot-password`,
    dashboard: `${base}/dashboard`,
    dealGroups: `${base}/deal-groups`,
    postbacks: `${base}/postbacks`,
  };
}
