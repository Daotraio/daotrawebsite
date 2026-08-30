/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

// CSP is intentionally strict. 'unsafe-inline' on script-src is required today
// only because Next.js injects a small hydration bootstrap script without a
// nonce in the App Router's default config; if you wire up nonce-based CSP via
// middleware, tighten this by removing 'unsafe-inline' from script-src.
const ContentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.daotra.io",
  "font-src 'self' data:",
  // globe.gl / three.js fetch textures + geojson as static assets served from /public,
  // so no external connect-src is required for the globe itself.
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        // Applies to every route, including /aff/* and /adv/* dashboards.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // Convenience aliases straight to the correct portal subdomain.
      { source: "/publishers/apply", destination: "https://aff.daotra.io/register", permanent: false },
      { source: "/advertisers/apply", destination: "https://adv.daotra.io/register", permanent: false },
      { source: "/signin", destination: "/login", permanent: true },
      { source: "/signup", destination: "/register", permanent: true },
    ];
  },
};

module.exports = nextConfig;
