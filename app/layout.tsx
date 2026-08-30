import type { Metadata } from "next";
import { headers } from "next/headers";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CookieBanner } from "@/components/consent/cookie-banner";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://daotra.io"),
  title: {
    default: "Daotra — Performance Marketing & Publisher Network",
    template: "%s | Daotra",
  },
  description:
    "Daotra is an international performance marketing and affiliate network connecting publishers and advertisers across iGaming, Prediction Markets, and Tech Verticals.",
  keywords: [
    "affiliate network",
    "performance marketing",
    "iGaming affiliates",
    "prediction markets affiliate",
    "Tech Verticals affiliate network",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Daotra",
    title: "Daotra — Performance Marketing & Publisher Network",
    description:
      "Global affiliate network spanning iGaming, Prediction Markets, and Tech Verticals.",
    url: "https://daotra.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daotra — Performance Marketing & Publisher Network",
    description:
      "Global affiliate network spanning iGaming, Prediction Markets, and Tech Verticals.",
  },
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
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
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
