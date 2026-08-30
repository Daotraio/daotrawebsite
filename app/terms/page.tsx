import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { LegalSection } from "@/components/legal/legal-section";
import { robotsMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing use of the Daotra affiliate network by publishers and advertisers.",
  robots: robotsMeta,
};

const LAST_UPDATED = "August 30, 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description={`Last updated: ${LAST_UPDATED}. A plain-language summary of the terms governing use of Daotra's website and platform, including the Publisher and Advertiser portals.`}
      />

      <div className="container max-w-3xl py-4">
        <div className="rounded-xl border border-accent-silver/20 bg-accent-silver/5 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Template notice:</strong> this document is a
          general starting point, not legal advice. Daotra operates in a regulated vertical
          (iGaming, including Sweepstakes) across many jurisdictions - have qualified legal
          counsel review and localize these Terms, and the Privacy Policy, before they go live
          for real users.
        </div>

        <LegalSection id="acceptance" title="1. Using the platform">
          <p>
            By accessing or using daotra.io or the Publisher and Advertiser portals at
            aff.daotra.io and adv.daotra.io (together, the &ldquo;Platform&rdquo;), you agree to
            these Terms and our Privacy Policy. If you don&apos;t agree, please don&apos;t use the
            Platform. You must be old enough to enter an agreement in your jurisdiction, and if
            you&apos;re acting for a company, you confirm you have the authority to accept these
            Terms on its behalf. Registering on the Publisher or Advertiser portal submits an
            application, not an automatic account - Daotra reviews and approves applications at
            its discretion, and Advertisers in regulated verticals must hold the licenses required
            to operate in each market they target.
          </p>
        </LegalSection>

        <LegalSection id="platform-role" title="2. What Daotra is">
          <p>
            Daotra runs a performance marketing network connecting Publishers, who direct
            traffic, with Advertisers, who run offers, across iGaming (including Sweepstakes),
            Prediction Markets, and Tech Verticals. Daotra is an intermediary: we don&apos;t operate
            the underlying gambling, prediction-market, or software products advertised through
            the network, and we&apos;re not a party to the relationship between an end user and an
            Advertiser. Tracking and attribution infrastructure is operated separately and covered
            in your Publisher or Advertiser Agreement.
          </p>
        </LegalSection>

        <LegalSection id="responsibilities" title="3. Your responsibilities">
          <p>
            Whichever role you&apos;re in, you&apos;re responsible for complying with the law in every
            market you operate in or target - including licensing, advertising rules, and
            consumer protection. Publishers agree to promote only approved offers, using honest
            creative and targeting, and to disclose the commercial nature of their content where
            required. Advertisers agree to keep their licensing current and to honor the offer and
            payout terms in effect at the time of a conversion. Neither role may use fraudulent,
            automated, or manipulative traffic-generation methods, misrepresent identity or
            licensing, or attempt to access or disrupt the Platform outside its intended use.
          </p>
        </LegalSection>

        <LegalSection id="ip-confidentiality" title="4. Intellectual property & confidentiality">
          <p>
            The Platform, including its software and the Daotra name and branding, belongs to
            Daotra. We grant you a limited license to use it for its intended purpose, and using
            our name or logo in your own marketing needs our written consent first. Non-public
            information you access through the Platform is confidential, and should only be
            used to run your campaigns.
          </p>
        </LegalSection>

        <LegalSection id="disclaimers" title="5. Disclaimers & limitation of liability">
          <p>
            The Platform is provided &ldquo;as is,&rdquo; without warranties of any kind, and we
            don&apos;t guarantee it will be uninterrupted, error-free, or that any particular volume
            of traffic or revenue will result from your use of the network. To the fullest extent
            the law allows, Daotra is not liable for indirect, incidental, or consequential
            damages, and our total liability for any claim is capped at a reasonable amount set
            out in your Publisher or Advertiser Agreement. You agree to indemnify Daotra against
            claims arising from your breach of these Terms or your violation of the law.
          </p>
        </LegalSection>

        <LegalSection id="termination" title="6. Suspension, termination, and disputes">
          <p>
            We may suspend or terminate your account if we reasonably believe you&apos;ve violated
            these Terms, engaged in fraud, or lost a required license, and you can close your
            account at any time by contacting us. These Terms are governed by the law specified in
            your Publisher or Advertiser Agreement; we&apos;ll first try to resolve any dispute
            informally, and unresolved disputes go to the process set out in that Agreement.
          </p>
        </LegalSection>

        <LegalSection id="changes" title="7. Changes & contact">
          <p>
            We may update these Terms from time to time; material changes will be announced by
            email or an in-platform notice, and continued use after that point means you accept
            the update. If a provision here turns out to be unenforceable, the rest still stands.
            Questions about these Terms can be sent to{" "}
            <a href="mailto:legal@daotra.io" className="text-accent-silver hover:underline">
              legal@daotra.io
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
