import Link from "next/link";
import { Orbit, Send, Linkedin } from "lucide-react";

const COLUMNS: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: "Network",
    links: [
      { href: "/about", label: "About Daotra" },
      { href: "/publishers", label: "Publishers" },
      { href: "/advertisers", label: "Advertisers" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Verticals",
    links: [
      { href: "/#igaming", label: "iGaming & Sweepstakes" },
      { href: "/#prediction-markets", label: "Prediction Markets" },
      { href: "/#tech-verticals", label: "Tech Verticals" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "https://aff.daotra.io/register", label: "Publisher Register", external: true },
      { href: "https://adv.daotra.io/register", label: "Advertiser Register", external: true },
      { href: "https://aff.daotra.io/login", label: "Publisher Login", external: true },
      { href: "https://adv.daotra.io/login", label: "Advertiser Login", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

const SOCIAL_LINKS = [
  { href: "https://t.me/daotra", label: "Telegram", Icon: Send },
  // Pending confirmed URL - update once the LinkedIn company page exists.
  { href: "https://linkedin.com/company/daotra", label: "LinkedIn", Icon: Linkedin },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-obsidian-950">
      <div className="container py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Orbit className="h-6 w-6 text-accent-silver" />
              <span className="font-display text-lg font-semibold tracking-tight">Daotra</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              International performance marketing and affiliate network for iGaming,
              Prediction Markets, and Tech Verticals.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.08] text-muted-foreground transition-colors hover:border-accent-silver/40 hover:text-accent-silver"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-accent-silver"
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.06] pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 Daotra.</p>
          <p className="max-w-2xl">
            Daotra promotes regulated and licensed operators only. Publishers are responsible for
            complying with all applicable local advertising, gambling, and consumer-protection laws
            in the jurisdictions they target. 18+ / 21+ where applicable. Please gamble responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
