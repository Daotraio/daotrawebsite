"use client";

import * as React from "react";
import { Label, Input } from "@/components/ui/form-fields";
import { SelectMenu } from "@/components/ui/select-menu";
import { cn } from "@/lib/utils";

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "Euro" },
];

const TIMEFRAME_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

type DealType = "CPA" | "HYB" | "RS";
type Currency = "USD" | "EUR";
type TimeFrame = "daily" | "monthly" | "yearly";

const DEAL_TYPES: { value: DealType; label: string }[] = [
  { value: "CPA", label: "CPA" },
  { value: "HYB", label: "Hyb" },
  { value: "RS", label: "RS" },
];

// Time Frame is a label on the output, not a scaling multiplier - FTD Amount
// is however many FTDs the user says happen in whichever period they pick
// (e.g. 5 FTDs on "daily" - $100 FTD Commission = $500, no further scaling).
//
// FTD Commission is a real user-entered rate, so CPA mode (and the CPA
// portion of Hyb mode) has no invented numbers. RS mode is pure revenue
// share - FTD Amount x RS% - with no CPA/FTD Commission component at all.
// Both Hyb's and RS's revenue-share component still need a baseline
// NGR-per-FTD figure to turn a percentage into a dollar amount, and no real
// figure was given for that - this constant is illustrative only (see the
// on-page disclaimer) and should be replaced with Daotra's actual average
// NGR per FTD before this goes live.
const RS_BASE_PER_FTD: Record<Currency, number> = { USD: 40, EUR: 36 };

function formatCurrency(value: number, currency: Currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function CommissionCalculator() {
  const [dealType, setDealType] = React.useState<DealType>("CPA");
  const [currency, setCurrency] = React.useState<Currency>("USD");
  const [ftdAmount, setFtdAmount] = React.useState(5);
  const [ftdCommission, setFtdCommission] = React.useState(100);
  const [timeFrame, setTimeFrame] = React.useState<TimeFrame>("daily");
  const [rsPercent, setRsPercent] = React.useState(20);

  const clampedFtd = Math.min(9999, Math.max(1, ftdAmount || 1));
  const clampedCommission = Math.max(0, ftdCommission || 0);
  const clampedRs = Math.min(100, Math.max(1, rsPercent || 1));

  const cpaPart = clampedFtd * clampedCommission;
  const rsPart = clampedFtd * RS_BASE_PER_FTD[currency] * (clampedRs / 100);
  const commission = dealType === "CPA" ? cpaPart : dealType === "HYB" ? cpaPart + rsPart : rsPart;

  return (
    <section className="border-b border-white/[0.06] py-24">
      <div className="container">
        <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground">
          Predict your commission
        </h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          A quick estimate of what your traffic could earn on Daotra - adjust the numbers below.
        </p>

        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="space-y-6">
              <div>
                <Label>Deal type</Label>
                <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.02] p-1">
                  {DEAL_TYPES.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDealType(d.value)}
                      aria-pressed={dealType === d.value}
                      className={cn(
                        "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                        dealType === d.value
                          ? "bg-foreground text-obsidian-950"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="calc-currency">Currency</Label>
                  <SelectMenu
                    id="calc-currency"
                    value={currency}
                    onChange={(v) => setCurrency(v as Currency)}
                    options={CURRENCY_OPTIONS}
                  />
                </div>
                <div>
                  <Label htmlFor="calc-timeframe">Time frame</Label>
                  <SelectMenu
                    id="calc-timeframe"
                    value={timeFrame}
                    onChange={(v) => setTimeFrame(v as TimeFrame)}
                    options={TIMEFRAME_OPTIONS}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="calc-ftd">FTD amount</Label>
                  <Input
                    id="calc-ftd"
                    type="number"
                    min={1}
                    max={9999}
                    value={ftdAmount}
                    onChange={(e) => setFtdAmount(Number(e.target.value))}
                  />
                </div>
                {dealType !== "RS" && (
                  <div>
                    <Label htmlFor="calc-ftd-commission">FTD Commission</Label>
                    <Input
                      id="calc-ftd-commission"
                      type="number"
                      min={0}
                      value={ftdCommission}
                      onChange={(e) => setFtdCommission(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>

              {dealType !== "CPA" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="calc-rs">RS %</Label>
                    <Input
                      id="calc-rs"
                      type="number"
                      min={1}
                      max={100}
                      value={rsPercent}
                      onChange={(e) => setRsPercent(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-start justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 lg:w-64 lg:items-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Estimated {timeFrame} commission
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-foreground">
                {formatCurrency(commission, currency)}
              </p>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Illustrative estimate only - actual payouts are set per your Publisher or Advertiser
            Agreement.
          </p>
        </div>
      </div>
    </section>
  );
}
