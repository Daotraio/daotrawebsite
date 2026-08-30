import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { LegalSection } from "@/components/legal/legal-section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Daotra collects, uses, and protects personal data on its affiliate network.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "August 30, 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`Last updated: ${LAST_UPDATED}. A plain-language summary of how Daotra collects, uses, and protects personal data across daotra.io and the Publisher and Advertiser portals.`}
      />

      <div className="container max-w-3xl py-4">
        <div className="rounded-xl border border-accent-silver/20 bg-accent-silver/5 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Template notice:</strong> this document is a
          general starting point, not legal advice. Have qualified counsel confirm it against the
          specific jurisdictions you operate in, and register with a relevant data protection
          authority if your operations require it, before going live.
        </div>

        <LegalSection id="overview" title="1. Overview">
          <p>
            This Policy covers the personal data Daotra (&ldquo;we,&rdquo; &ldquo;us&rdquo;)
            handles through daotra.io, aff.daotra.io, and adv.daotra.io (together, the
            &ldquo;Platform&rdquo;), for Publishers, Advertisers, and website visitors. It doesn&apos;t
            cover the privacy practices of the third-party operators that Publishers promote -
            those are governed by each operator&apos;s own policy. Cookie use is covered separately
            by the cookie banner shown on the site.
          </p>
        </LegalSection>

        <LegalSection id="data-we-collect" title="2. What we collect and why">
          <p>
            We collect what&apos;s needed to run the Platform: account and application details (name,
            company, email, Telegram username, password), verification information for licensing
            or tax purposes, payment details needed to send or receive payouts, basic usage and
            device data, and anything you send us directly through the contact form, email, or
            Telegram. We use this to review applications, operate your account and dashboard,
            process payments, prevent fraud, respond to your messages, and meet our legal and tax
            obligations. We don&apos;t sell personal data.
          </p>
        </LegalSection>

        <LegalSection id="sharing" title="3. Sharing">
          <p>
            We share personal data only where it&apos;s needed to run the Platform - with service
            providers such as hosting and payment processing, with the other side of a match
            (e.g. limited traffic or offer details between a Publisher and Advertiser, never
            payment credentials), or where required by law or to protect the rights and safety of
            Daotra and our users.
          </p>
        </LegalSection>

        <LegalSection id="your-rights" title="4. Your rights">
          <p>
            Depending on where you&apos;re located, you may have the right to access, correct, or
            request deletion of your personal data, and to object to or restrict certain
            processing. To exercise any of these rights, contact{" "}
            <a href="mailto:privacy@daotra.io" className="text-accent-silver hover:underline">
              privacy@daotra.io
            </a>
            . We may need to verify your identity first, and will respond within a reasonable
            timeframe.
          </p>
        </LegalSection>

        <LegalSection id="changes" title="5. Changes & contact">
          <p>
            We may update this Policy from time to time to reflect changes in our practices; the
            &ldquo;Last updated&rdquo; date above reflects the most recent revision. For any
            question about this Policy, contact{" "}
            <a href="mailto:privacy@daotra.io" className="text-accent-silver hover:underline">
              privacy@daotra.io
            </a>{" "}
            or via Telegram at{" "}
            <a
              href="https://t.me/daotra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-silver hover:underline"
            >
              @Daotra
            </a>
            .
          </p>
        </LegalSection>
      </div>
    </>
  );
}
