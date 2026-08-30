import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { LegalSection, LegalList } from "@/components/legal/legal-section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Daotra collects, uses, and protects personal data.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "August 23, 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`Last updated: ${LAST_UPDATED}. This Policy explains how Daotra collects, uses, discloses, and protects personal data when you use daotra.io and the Publisher and Advertiser portals.`}
      />

      <div className="container max-w-3xl py-4">
        <div className="rounded-xl border border-accent-cyan/20 bg-accent-cyan/5 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Template notice:</strong> this document is a
          comprehensive starting point covering GDPR- and CCPA-style obligations, not legal
          advice. Have qualified counsel confirm it against the specific jurisdictions you
          operate in and register with the relevant data protection authority if required
          (e.g. the ICO in the UK, or a lead supervisory authority in the EU) before going live.
        </div>

        <LegalSection id="controller" title="1. Who we are">
          <p>
            Daotra (&ldquo;Daotra,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) is the data
            controller responsible for the personal data described in this Policy, collected
            through daotra.io, aff.daotra.io, and adv.daotra.io (together, the
            &ldquo;Platform&rdquo;). This Policy applies to Publishers, Advertisers, and website
            visitors. It does not cover the privacy practices of the third-party operators
            (iGaming, Prediction Markets, Tech Verticals, or other) that Publishers promote — those are
            governed by each operator&apos;s own privacy policy.
          </p>
        </LegalSection>

        <LegalSection id="data-we-collect" title="2. Personal data we collect">
          <p>We collect the following categories of personal data:</p>
          <LegalList
            items={[
              <span key="account">
                <strong className="text-foreground">Account and application data:</strong> full
                name, company name, email address, Telegram username, password (hashed), and role
                (Publisher or Advertiser).
              </span>,
              <span key="verification">
                <strong className="text-foreground">Verification data:</strong> for Advertisers,
                information needed to confirm regulatory licensing status; for either role, tax
                identification information (e.g. W-9/W-8BEN) where required to process payments.
              </span>,
              <span key="payment">
                <strong className="text-foreground">Payment data:</strong> bank account, wallet,
                or payment-processor details needed to send or receive payouts. Card numbers, where
                applicable, are processed by our payment processor and are not stored on our
                servers.
              </span>,
              <span key="usage">
                <strong className="text-foreground">Usage data:</strong> pages viewed, features
                used, and actions taken within the Platform, including dashboard activity.
              </span>,
              <span key="device">
                <strong className="text-foreground">Device and technical data:</strong> IP
                address, browser type and version, device identifiers, operating system, referral
                URL, and approximate location derived from IP address.
              </span>,
              <span key="communications">
                <strong className="text-foreground">Communications:</strong> messages you send us
                via the contact form, email, or Telegram, including their content.
              </span>,
              <span key="cookies">
                <strong className="text-foreground">Cookies and similar technologies:</strong> see
                Section 5 below.
              </span>,
            ]}
          />
          <p>
            We do not intentionally collect special-category data (e.g. health, religion,
            political opinions) and ask that you not include such information in free-text fields
            like the contact form.
          </p>
        </LegalSection>

        <LegalSection id="how-we-collect" title="3. How we collect data">
          <p>
            We collect data you provide directly (e.g. registration and contact forms),
            automatically through your use of the Platform (e.g. cookies, server logs), and, for
            Advertisers, from public or commercial sources when verifying licensing status.
          </p>
        </LegalSection>

        <LegalSection id="legal-basis" title="4. Legal basis for processing (EEA/UK users)">
          <p>Where GDPR or UK GDPR applies, we rely on the following legal bases:</p>
          <LegalList
            items={[
              <span key="contract">
                <strong className="text-foreground">Performance of a contract:</strong> to review
                your application, operate your account, and facilitate payments.
              </span>,
              <span key="legitimate">
                <strong className="text-foreground">Legitimate interests:</strong> to prevent
                fraud, secure the Platform, improve our services, and communicate with you about
                your account — balanced against your rights and interests.
              </span>,
              <span key="legal-obligation">
                <strong className="text-foreground">Legal obligation:</strong> to comply with tax,
                anti-money-laundering, and licensing-verification requirements.
              </span>,
              <span key="consent">
                <strong className="text-foreground">Consent:</strong> for optional marketing
                communications and non-essential cookies, which you can withdraw at any time.
              </span>,
            ]}
          />
        </LegalSection>

        <LegalSection id="how-we-use" title="5. How we use personal data">
          <LegalList
            items={[
              "Reviewing and processing Publisher and Advertiser applications.",
              "Operating your account and the Publisher/Advertiser dashboards.",
              "Calculating, processing, and sending or receiving payments.",
              "Detecting, investigating, and preventing fraud and abuse.",
              "Responding to inquiries submitted via the contact form, email, or Telegram.",
              "Sending service communications (account status, policy changes) and, where you've opted in, marketing communications.",
              "Complying with legal, tax, and regulatory obligations.",
              "Aggregated, de-identified analytics to understand and improve the Platform.",
            ]}
          />
        </LegalSection>

        <LegalSection id="cookies" title="6. Cookies and similar technologies">
          <p>We use the following categories of cookies:</p>
          <LegalList
            items={[
              <span key="essential">
                <strong className="text-foreground">Strictly necessary:</strong> required for
                login sessions, security (e.g. rate limiting, bot protection), and core site
                functionality. These cannot be switched off.
              </span>,
              <span key="functional">
                <strong className="text-foreground">Functional:</strong> remember preferences such
                as your selected portal.
              </span>,
              <span key="analytics">
                <strong className="text-foreground">Analytics:</strong> help us understand
                aggregate usage patterns to improve the Platform. Used only with consent where
                required by law.
              </span>,
            ]}
          />
          <p>
            We do not use cookies to serve third-party advertising on daotra.io. Where analytics
            or functional cookies require consent under applicable law, we will ask for it via a
            cookie banner before setting them.
          </p>
        </LegalSection>

        <LegalSection id="sharing" title="7. How we share personal data">
          <p>We share personal data only in the following circumstances:</p>
          <LegalList
            items={[
              <span key="processors">
                <strong className="text-foreground">Service providers:</strong> hosting
                (Cloudflare), payment processing, email delivery, and rate-limiting/security
                infrastructure, each acting under contractual confidentiality and data-protection
                obligations.
              </span>,
              <span key="counterparties">
                <strong className="text-foreground">Network counterparties:</strong> to facilitate
                a match, we may share limited business information (e.g. a Publisher&apos;s traffic
                profile, an Advertiser&apos;s offer terms) between Publishers and Advertisers — never
                payment credentials or unnecessary personal data.
              </span>,
              <span key="legal">
                <strong className="text-foreground">Legal and safety:</strong> where required to
                comply with law, respond to lawful requests from public authorities, or protect
                the rights, property, or safety of Daotra, our users, or the public.
              </span>,
              <span key="corporate">
                <strong className="text-foreground">Business transfers:</strong> in connection
                with a merger, acquisition, financing, or sale of assets, subject to
                confidentiality commitments.
              </span>,
            ]}
          />
          <p>We do not sell personal data, and have not sold personal data in the past 12 months.</p>
        </LegalSection>

        <LegalSection id="transfers" title="8. International data transfers">
          <p>
            Daotra operates internationally, and personal data may be processed in countries
            other than your own, including countries that may not provide the same level of data
            protection. Where we transfer personal data out of the EEA, UK, or Switzerland, we
            rely on recognized transfer mechanisms such as the European Commission&apos;s Standard
            Contractual Clauses, the UK International Data Transfer Addendum, or an applicable
            adequacy decision.
          </p>
        </LegalSection>

        <LegalSection id="retention" title="9. Data retention">
          <p>
            We retain personal data for as long as needed to provide the Platform, comply with
            legal and tax obligations (typically 6–7 years for financial records), resolve
            disputes, and enforce our agreements. Rejected applications are retained for a limited
            period to prevent repeat fraudulent applications, then deleted or anonymized. You can
            request earlier deletion subject to Section 11 below.
          </p>
        </LegalSection>

        <LegalSection id="security" title="10. Data security">
          <p>
            We apply technical and organizational safeguards appropriate to the sensitivity of
            the data, including encryption in transit (TLS/HTTPS), password hashing, rate
            limiting and bot protection on public forms, and role-based access controls limiting
            internal access to personal data. No method of transmission or storage is completely
            secure; we cannot guarantee absolute security, and encourage you to use a strong,
            unique password and to notify us immediately of any suspected account compromise.
          </p>
        </LegalSection>

        <LegalSection id="your-rights" title="11. Your privacy rights">
          <p>
            <strong className="text-foreground">If you are in the EEA, UK, or Switzerland</strong>{" "}
            (GDPR/UK GDPR), you have the right to: access the personal data we hold about you;
            correct inaccurate data; request erasure; restrict or object to certain processing;
            receive your data in a portable format; and withdraw consent at any time where
            processing is based on consent. You also have the right to lodge a complaint with your
            local data protection authority.
          </p>
          <p>
            <strong className="text-foreground">If you are a California resident</strong>{" "}
            (CCPA/CPRA), you have the right to: know what personal information we collect, use,
            and disclose; request deletion; correct inaccurate information; opt out of the
            &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information (we do not sell or
            share personal information for cross-context behavioral advertising); limit use of
            sensitive personal information; and not be discriminated against for exercising these
            rights.
          </p>
          <p>
            To exercise any of these rights, contact{" "}
            <a href="mailto:privacy@daotra.io" className="text-accent-cyan hover:underline">
              privacy@daotra.io
            </a>
            . We will respond within the timeframe required by applicable law and may need to
            verify your identity before processing certain requests.
          </p>
        </LegalSection>

        <LegalSection id="children" title="12. Children's privacy">
          <p>
            The Platform is not directed at, and we do not knowingly collect personal data from,
            anyone under 18 years old. If we learn that we have collected personal data from a
            person under 18, we will delete it. Contact us at{" "}
            <a href="mailto:privacy@daotra.io" className="text-accent-cyan hover:underline">
              privacy@daotra.io
            </a>{" "}
            if you believe this may have occurred.
          </p>
        </LegalSection>

        <LegalSection id="marketing" title="13. Marketing communications">
          <p>
            Where you have opted in, we may send you marketing communications about network
            updates, new offers, or events. You can opt out at any time using the unsubscribe
            link in any marketing email, or by contacting{" "}
            <a href="mailto:privacy@daotra.io" className="text-accent-cyan hover:underline">
              privacy@daotra.io
            </a>
            . You will continue to receive transactional and service communications (e.g. account
            or payment notices) even after opting out of marketing.
          </p>
        </LegalSection>

        <LegalSection id="changes" title="14. Changes to this Policy">
          <p>
            We may update this Policy from time to time to reflect changes in our practices or
            legal requirements. Material changes will be notified via email or an in-platform
            notice at least 14 days before taking effect. The &ldquo;Last updated&rdquo; date at
            the top of this page reflects the most recent revision.
          </p>
        </LegalSection>

        <LegalSection id="contact" title="15. Contact us">
          <p>
            For any question about this Policy or to exercise your privacy rights, contact us at{" "}
            <a href="mailto:privacy@daotra.io" className="text-accent-cyan hover:underline">
              privacy@daotra.io
            </a>{" "}
            or via Telegram at{" "}
            <a
              href="https://t.me/daotra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-cyan hover:underline"
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
