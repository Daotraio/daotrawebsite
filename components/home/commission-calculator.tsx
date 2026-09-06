"use client";

import * as React from "react";
import { Eyebrow } from "@/components/ui/card";
import { Label, Input, Select } from "@/components/ui/form-fields";
import { cn } from "@/lib/utils";

type DealType = "CPA" | "HYB" | "RS";
type Currency = "USD" | "EUR";
type TimeFrame = "daily" | "monthly" | "yearly";

const DEAL_TYPES: { value: DealType; label: string }[] = [
  { value: "CPA", label: "CPA" },
  { value: "HYB", label: "Hyb" },
  { value: "RS", label: "RS" },
];

// Illustrative example rates only - not Daotra's actual published payout
// terms (see the disclaimer rendered under the calculator). Swap these for
// real per-vertical/per-offer figures before this goes live for real users.
// FTD Amount is treated as "FTDs per month" - the baseline the Time Frame
// selector scales up or down from.
const CPA_RATE: Record<Currency, number> = { USD: 150, EUR: 140 };
const HYBRID_CPA_RATE: Record<Currency, number> = { USD: 75, EUR: 70 };
const NGR_PER_FTD: Record<Currency, number> = { USD: 40, EUR: 36 };
const TIMEFRAME_MULTIPLIER: Record<TimeFrame, number> = { daily: 1 / 30, monthly: 1, yearly: 12 };

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
  const [ftdAmount, setFtdAmount] = React.useState(50);
  const [timeFrame, setTimeFrame] = React.useState<TimeFrame>("monthly");
  const [ngrPercent, setNgrPercent] = React.useState(20);

  const clampedFtd = Math.min(9999, Math.max(1, ftdAmount || 1));
  const clampedNgr = Math.min(100, Math.max(1, ngrPercent || 1));
  const multiplier = TIMEFRAME_MULTIPLIER[timeFrame];

  const commission =
    dealType === "CPA"
      ? clampedFtd * CPA_RATE[currency] * multiplier
      : (clampedFtd * HYBRID_CPA_RATE[currency] +
          clampedFtd * NGR_PER_FTD[currency] * (clampedNgr / 100)) *
        multiplier;

  return (
    <section className="border-b border-white/[0.06] py-24">
      <div className="container">
        <Eyebrow>Commission Estimator</Eyebrow>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground">
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
                  <Select
                    id="calc-currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">Euro</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="calc-timeframe">Time frame</Label>
                  <Select
                    id="calc-timeframe"
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </Select>
                </div>
              </div>

              <div className={cn("grid gap-5", dealType !== "CPA" && "sm:grid-cols-2")}>
                <div>
                  <Label htmlFor="calc-ftd">FTD amount (per month)</Label>
                  <Input
                    id="calc-ftd"
                    type="number"
                    min={1}
                    max={9999}
                    value={ftdAmount}
                    onChange={(e) => setFtdAmount(Number(e.target.value))}
                  />
                </div>
                {dealType !== "CPA" && (
                  <div>
                    <Label htmlFor="calc-ngr">NGR %</Label>
                    <Input
                      id="calc-ngr"
                      type="number"
                      min={1}
                      max={100}
                      value={ngrPercent}
                      onChange={(e) => setNgrPercent(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>
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
            Illustrative estimate only, based on example rates - actual payouts are set per your
            Publisher or Advertiser Agreement.
          </p>
        </div>
      </div>
    </section>
  );
}
