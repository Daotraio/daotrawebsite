import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { robotsMeta } from "@/lib/seo";

// One humanist sans, everywhere - headings, body, labels, and buttons all
// share this single typeface (Apple-style: one family, varied by weight/
// tracking) rather than pairing with a separate display or mono face.
// --font-display and the font-mono Tailwind utility both alias this same
// variable (see tailwind.config.ts) so there's exactly one font loaded.
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://daotra.io"),
  title: {
    default: "Daotra - Performance Marketing & Affiliate Network",
    template: "%s | Daotra",
  },
  description:
    "Daotra is a global performance marketing and affiliate network connecting publishers and advertisers across iGaming, Sweepstakes, and Prediction Markets - high-intent traffic, direct offers, and on-time payouts.",
  keywords: [
    "affiliate network",
    "affiliates",
    "advertisers",
    "performance marketing",
    "iGaming affiliates",
    "Sweepstakes affiliates",
    "prediction markets affiliate",
    "high-intent traffic",
    "publisher network",
  ],
  robots: robotsMeta,
  openGraph: {
    type: "website",
    siteName: "Daotra",
    title: "Daotra - Performance Marketing & Affiliate Network",
    description:
      "Global affiliate network spanning iGaming, Sweepstakes, and Prediction Markets - direct offers, high-intent traffic, on-time payouts.",
    url: "https://daotra.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daotra - Performance Marketing & Affiliate Network",
    description:
      "Global affiliate network spanning iGaming, Sweepstakes, and Prediction Markets - direct offers, high-intent traffic, on-time payouts.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Daotra",
  url: "https://daotra.io",
  description:
    "Daotra is a global performance marketing and affiliate network connecting publishers and advertisers across iGaming, Sweepstakes, and Prediction Markets.",
  sameAs: ["https://t.me/daotra"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // aff.daotra.io and adv.daotra.io render their own chrome (AuthShell for
  // login/register, DashboardShell for the dashboard routes) - the marketing
  // header/footer only belongs on the apex site. Checked server-side via the
  // Host header so there's no client-side flash of the marketing nav.
  // headers() is async as of Next.js 15 - must be awaited.
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const isPortalHost = host.startsWith("aff.") || host.startsWith("adv.");

  return (
    <html lang="en" className={sans.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AuthProvider>
          {!isPortalHost && <SiteHeader />}
          <main className="flex-1">{children}</main>
          {!isPortalHost && <SiteFooter />}
          {!isPortalHost && <CookieBanner />}
        </AuthProvider>
      </body>
    </html>
  );
}
