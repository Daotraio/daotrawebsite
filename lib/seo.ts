// Read at runtime (via wrangler.jsonc's per-environment `vars.APP_ENV`), not
// inlined at build time - this repo's single CI build step is deployed as-is
// to both staging and production, so a build-time constant couldn't tell
// them apart. Staging defaults to noindex (including local `next dev`,
// where APP_ENV is unset) so it never gets picked up by search engines.
const isProduction = process.env.APP_ENV === "production";

export const robotsMeta = isProduction
  ? { index: true, follow: true }
  : { index: false, follow: false };
