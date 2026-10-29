// The published versions of the two policies a Publisher accepts at
// registration (Daotra BD-71 as amended 2026-10-29: explicit acceptance, with the
// time and the document versions recorded).
//
// ONE source for both the page and the record: app/terms and app/privacy show
// `lastUpdated` from here, and the registration route sends `version` to Daotra,
// so the version recorded is always the version published. When a policy
// changes, change it here — the page and every later acceptance move together.
// The browser never chooses the version: the server route adds it.

export interface LegalDocument {
  /** Recorded with the acceptance — `YYYY-MM-DD` of the revision. */
  version: string;
  /** Shown on the page. */
  lastUpdated: string;
  href: string;
}

// `href` is relative on purpose: the checkbox must open the policy served by the
// SAME deployment whose version it records. An absolute https://daotra.io link
// would show Staging registrants Production's text while recording Staging's
// version. On aff.daotra.io, middleware.ts serves these two paths unrewritten.
//
// 2026-10-29 revision, approved by the owner (wording T1–T3, P1–P2): the
// cancelled Advertiser portal and adv.daotra.io removed, and Publisher
// registration described as it now works. Previous version of both: 2026-08-30.
export const TERMS: LegalDocument = {
  version: "2026-10-29",
  lastUpdated: "October 29, 2026",
  href: "/terms",
};

export const PRIVACY: LegalDocument = {
  version: "2026-10-29",
  lastUpdated: "October 29, 2026",
  href: "/privacy",
};
