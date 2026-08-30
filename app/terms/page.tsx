import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { LegalSection, LegalList } from "@/components/legal/legal-section";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing use of the Daotra network by publishers and advertisers.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "August 23, 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description={`Last updated: ${LAST_UPDATED}. These Terms govern your access to and use of Daotra's website and platform, including the Publisher and Advertiser portals.`}
      />

      <div className="container max-w-3xl py-4">
        <div className="rounded-xl border border-accent-cyan/20 bg-accent-cyan/5 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Template notice:</strong> this document is a
          comprehensive starting point, not legal advice. Daotra operates in a regulated vertical
          (iGaming) across many jurisdictions — have qualified legal counsel review and localize
          these Terms, and the Privacy Policy, before they go live for real users.
        </div>

        <LegalSection id="acceptance" title="1. Acceptance of these Terms">
          <p>
            By creating an account, accessing, or using any part of the Daotra platform —
            including daotra.io and the Publisher and Advertiser portals at aff.daotra.io and
            adv.daotra.io (together, the &ldquo;Platform&rdquo;) — you (&ldquo;you,&rdquo; the
            &ldquo;User&rdquo;) agree to be bound by these Terms & Conditions
            (&ldquo;Terms&rdquo;) and our Privacy Policy. If you do not agree, do not use the
            Platform. If you are entering into these Terms on behalf of a company or other legal
            entity, you represent that you have the authority to bind that entity, in which case
            &ldquo;you&rdquo; refers to that entity.
          </p>
        </LegalSection>

        <LegalSection id="eligibility" title="2. Eligibility">
          <p>You may only use the Platform if you meet all of the following conditions:</p>
          <LegalList
            items={[
              "You are at least 18 years old, or the age of majority in your jurisdiction if higher.",
              "You have the legal capacity to enter into a binding contract.",
              "You are not located in, or a resident of, any country or region subject to comprehensive trade sanctions administered by the United States, European Union, or United Nations, and you are not on any restricted-party or denied-persons list maintained by such authorities.",
              "Your use of the Platform, including the offers you promote or advertise, complies with all laws applicable to you, including in every jurisdiction you target.",
              "For Advertisers in regulated verticals (including iGaming), you hold all licenses and authorizations required to operate and to be advertised in each jurisdiction you target through the network.",
            ]}
          />
        </LegalSection>

        <LegalSection id="accounts" title="3. Accounts and applications">
          <p>
            Registration on aff.daotra.io or adv.daotra.io submits an application, not an
            immediate account. Daotra reviews applications and may approve, reject, or request
            further information at its sole discretion, including verification of identity,
            company registration, and — for Advertisers — regulatory licensing. You must provide
            accurate, current, and complete information, including a working Telegram handle and
            email address, and keep that information up to date. You are responsible for all
            activity under your account and for maintaining the confidentiality of your login
            credentials once issued. Notify us immediately of any unauthorized use of your
            account.
          </p>
        </LegalSection>

        <LegalSection id="platform-role" title="4. The role of the Platform">
          <p>
            Daotra operates a performance marketing network that connects Publishers (who direct
            traffic) with Advertisers (who run offers) across iGaming, Prediction Markets, and
            Tech Verticals (including VPN, SaaS, fintech, and utility software). Daotra is an
            intermediary: it does not itself operate the gambling, prediction-market, or software
            products advertised through
            the network, and is not a party to the underlying relationship between the end user
            and the Advertiser. Tracking, attribution, and postback infrastructure that records
            clicks and conversions is operated as separate, dedicated infrastructure and is
            addressed in your applicable Insertion Order, Publisher Agreement, or Advertiser
            Agreement rather than in this document.
          </p>
        </LegalSection>

        <LegalSection id="publisher-obligations" title="5. Publisher obligations">
          <p>As a Publisher, you agree that you will:</p>
          <LegalList
            items={[
              "Promote only offers you have been approved for, using creative, claims, and targeting consistent with the offer's terms and with applicable law.",
              "Clearly and conspicuously disclose the commercial nature of your content where required by law (e.g. affiliate disclosures, sponsored-content labeling).",
              "Not target minors, or jurisdictions where the promoted vertical is prohibited or where you lack the required local authorization to advertise it.",
              "Not generate traffic, clicks, leads, or conversions through fraudulent, automated, incentivized-without-disclosure, or otherwise manipulative means, including but not limited to bots, click-farms, cookie-stuffing, forced clicks, malware, adware, typosquatting, or paid-to-click schemes.",
              "Not bid on Daotra's, or any Advertiser's, trademarks in paid search without written authorization, and not engage in brand-bidding designed to intercept branded traffic.",
              "Not create multiple accounts to circumvent payout terms, offer caps, or a suspension.",
              "Comply with applicable anti-spam law (e.g. CAN-SPAM, CASL, GDPR's ePrivacy rules) for any email or messaging-based promotion.",
            ]}
          />
        </LegalSection>

        <LegalSection id="advertiser-obligations" title="6. Advertiser obligations">
          <p>As an Advertiser, you agree that you will:</p>
          <LegalList
            items={[
              "Hold, and keep current, every license or regulatory authorization required to offer your product or service in each jurisdiction you target through the network, and provide evidence of such licensing on request.",
              "Provide accurate offer terms, creative, and payout terms, and honor the payout terms in effect at the time a conversion occurred.",
              "Pay Daotra, and ensure Publishers are paid, in accordance with the payment terms in your Advertiser Agreement and applicable Insertion Orders.",
              "Not use data obtained through the network — including click, conversion, or Publisher performance data — for any purpose other than operating your campaign, and not share it with third parties without authorization.",
              "Implement and maintain reasonable safeguards against fraud, including responding in good faith to fraud disputes raised by Daotra or Publishers.",
              "Where your vertical requires it (e.g. iGaming), maintain responsible-gambling tooling (self-exclusion, deposit limits, age verification) on your own product.",
            ]}
          />
        </LegalSection>

        <LegalSection id="prohibited-conduct" title="7. Prohibited conduct">
          <p>Regardless of role, you must not, in connection with the Platform:</p>
          <LegalList
            items={[
              "Violate any applicable law, regulation, or third party's rights, including intellectual property, privacy, or publicity rights.",
              "Interfere with, disrupt, or attempt to gain unauthorized access to the Platform, its infrastructure, or any other user's account or data.",
              "Reverse engineer, scrape, or attempt to extract the Platform's underlying software, algorithms, or non-public data.",
              "Misrepresent your identity, company, traffic sources, or licensing status.",
              "Engage in money laundering, terrorist financing, or any activity intended to disguise the origin of funds.",
              "Facilitate access by, or process transactions on behalf of, anyone on an applicable sanctions or denied-party list.",
            ]}
          />
        </LegalSection>

        <LegalSection id="payments" title="8. Payments, fees, and clawbacks">
          <p>
            Payout terms (schedule, currency, minimum thresholds, and payment method) are set out
            in your Publisher or Advertiser Agreement and may vary by offer. Daotra, and
            Advertisers, reserve the right to withhold, reverse, or claw back payment for
            conversions later determined to be fraudulent, duplicate, non-compliant with offer
            terms, or otherwise invalid, including after payment has already been made to a
            Publisher. You are solely responsible for determining and remitting any taxes owed on
            amounts you receive through the Platform; Daotra may be required to collect tax
            identification information (e.g. a W-9 or W-8BEN) before releasing payment and to
            report payments to tax authorities where required by law.
          </p>
        </LegalSection>

        <LegalSection id="intellectual-property" title="9. Intellectual property">
          <p>
            The Platform, including its software, design, text, graphics, and the Daotra name and
            logo, is owned by Daotra or its licensors and protected by intellectual property law.
            Subject to your compliance with these Terms, Daotra grants you a limited,
            non-exclusive, non-transferable, revocable license to access and use the Platform for
            its intended purpose. You retain ownership of creative and content you upload, and
            grant Daotra a license to host, display, and distribute it as necessary to operate the
            network (e.g. showing your creative to prospective counterparties). Nothing in these
            Terms transfers ownership of either party&apos;s trademarks; use of Daotra&apos;s name or logo
            in your own marketing requires prior written consent.
          </p>
        </LegalSection>

        <LegalSection id="confidentiality" title="10. Confidentiality">
          <p>
            Non-public information shared through the Platform — including payout rates, offer
            terms, performance data, and account information — is confidential. You agree to use
            such information only to perform your obligations under these Terms, and not to
            disclose it to third parties except as required by law or with the disclosing party&apos;s
            written consent.
          </p>
        </LegalSection>

        <LegalSection id="disclaimers" title="11. Disclaimers">
          <p>
            The Platform is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without
            warranties of any kind, whether express, implied, or statutory, including implied
            warranties of merchantability, fitness for a particular purpose, and
            non-infringement. Daotra does not warrant that the Platform will be uninterrupted,
            error-free, or secure, or that any particular volume of traffic, conversions, or
            revenue will result from your use of the network.
          </p>
        </LegalSection>

        <LegalSection id="liability" title="12. Limitation of liability">
          <p>
            To the maximum extent permitted by law, Daotra will not be liable for any indirect,
            incidental, special, consequential, or punitive damages, or for any loss of profits,
            revenue, data, or goodwill, arising out of or related to your use of the Platform,
            even if advised of the possibility of such damages. Daotra&apos;s total aggregate liability
            for any claim arising out of or relating to these Terms or the Platform will not
            exceed the fees actually paid by you to Daotra (or, for Publishers, the amount payable
            to you) in the three months preceding the event giving rise to the claim.
          </p>
        </LegalSection>

        <LegalSection id="indemnification" title="13. Indemnification">
          <p>
            You agree to indemnify, defend, and hold harmless Daotra and its officers, employees,
            and affiliates from any claim, liability, damage, loss, or expense (including
            reasonable legal fees) arising from your breach of these Terms, your violation of
            applicable law, or your infringement of any third party&apos;s rights, including claims
            arising from offers you have advertised or traffic you have generated.
          </p>
        </LegalSection>

        <LegalSection id="termination" title="14. Suspension and termination">
          <p>
            Daotra may suspend or terminate your account, immediately and without prior notice, if
            we reasonably believe you have violated these Terms, engaged in fraudulent activity,
            lost a required license, or if we are required to do so by law or by a regulator. You
            may terminate your account at any time by contacting us. Sections that by their nature
            should survive termination — including Payments (for amounts already earned or owed),
            Confidentiality, Intellectual Property, Disclaimers, Limitation of Liability, and
            Indemnification — will survive.
          </p>
        </LegalSection>

        <LegalSection id="disputes" title="15. Governing law and dispute resolution">
          <p>
            These Terms are governed by the laws of the jurisdiction specified in your Publisher
            or Advertiser Agreement, without regard to conflict-of-laws principles. The parties
            will first attempt to resolve any dispute informally by good-faith negotiation for at
            least 30 days. If unresolved, disputes will be submitted to binding arbitration (or,
            where arbitration is not enforceable in your jurisdiction, to the exclusive
            jurisdiction of the courts specified in your Agreement), except that either party may
            seek injunctive relief in court to protect its intellectual property or confidential
            information.
          </p>
        </LegalSection>

        <LegalSection id="general" title="16. General">
          <LegalList
            items={[
              <span key="force-majeure">
                <strong className="text-foreground">Force majeure.</strong> Neither party is
                liable for delay or failure to perform caused by events beyond its reasonable
                control.
              </span>,
              <span key="changes">
                <strong className="text-foreground">Changes to these Terms.</strong> We may update
                these Terms from time to time; material changes will be notified via email or an
                in-platform notice, and continued use after the effective date constitutes
                acceptance.
              </span>,
              <span key="severability">
                <strong className="text-foreground">Severability.</strong> If any provision is
                held unenforceable, the remaining provisions remain in full effect.
              </span>,
              <span key="assignment">
                <strong className="text-foreground">Assignment.</strong> You may not assign these
                Terms without our written consent; Daotra may assign these Terms in connection
                with a merger, acquisition, or sale of assets.
              </span>,
              <span key="waiver">
                <strong className="text-foreground">No waiver.</strong> Failure to enforce any
                provision is not a waiver of the right to enforce it later.
              </span>,
              <span key="entire">
                <strong className="text-foreground">Entire agreement.</strong> These Terms,
                together with any Publisher or Advertiser Agreement and Insertion Orders, are the
                entire agreement between you and Daotra regarding the Platform.
              </span>,
            ]}
          />
        </LegalSection>

        <LegalSection id="contact" title="17. Contact">
          <p>
            Questions about these Terms can be sent to{" "}
            <a href="mailto:legal@daotra.io" className="text-accent-cyan hover:underline">
              legal@daotra.io
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
