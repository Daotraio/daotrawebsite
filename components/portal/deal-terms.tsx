// A Deal's Publisher terms for display (Daotra BD-91 D3): "€80 CPA", "30% RevShare",
// or both for a Hybrid; the model alone if no figure stands. Never the Advertiser side.
import { formatMoney, formatPercent, plainLabel, type PortalDeal } from "@/lib/portal-business";

export function DealPayout({ deal }: { deal: PortalDeal }) {
  const terms = deal.terms;
  if (!terms) return <span className="subtle">-</span>;
  const cpa = terms.cpa_amount ? formatMoney(terms.cpa_amount, terms.cpa_currency) : null;
  const share = terms.revshare_percent ? formatPercent(terms.revshare_percent) : null;
  const figures = [cpa ? `${cpa} CPA` : null, share ? `${share} RevShare` : null].filter(Boolean).join(" + ");
  return <span className="num">{figures || plainLabel(terms.payout_model)}</span>;
}
