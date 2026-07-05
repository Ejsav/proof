"use client";

import { useId, useState } from "react";
import { CREDIT_TIERS } from "@/lib/leads/schema";
import { formatPrice } from "@/lib/format";
import { Select } from "@/components/ui/Select";

/**
 * Engagement tool, not an offer. Rates are illustrative estimates by
 * self-reported credit tier. [DEALER: fact needed — replace with real
 * lender rate sheet before launch.]
 */
const ESTIMATED_APR: Record<string, number> = {
  [CREDIT_TIERS[0]]: 6.9,
  [CREDIT_TIERS[1]]: 8.9,
  [CREDIT_TIERS[2]]: 12.9,
  [CREDIT_TIERS[3]]: 17.9,
};

const TERMS = [36, 48, 60, 72] as const;

function monthlyPayment(principal: number, aprPct: number, months: number): number {
  if (principal <= 0) return 0;
  const r = aprPct / 100 / 12;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export function PaymentEstimator() {
  const [price, setPrice] = useState(22000);
  const [down, setDown] = useState(2000);
  const [term, setTerm] = useState<number>(60);
  const [tier, setTier] = useState<string>(CREDIT_TIERS[1]);
  const priceId = useId();
  const downId = useId();

  const apr = ESTIMATED_APR[tier];
  const principal = Math.max(price - down, 0);
  const payment = monthlyPayment(principal, apr, term);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
      <h3 className="text-h3">Estimate your payment</h3>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor={priceId} className="text-small font-medium text-ink">
              Vehicle price
            </label>
            <span className="text-small font-medium text-ink">{formatPrice(price)}</span>
          </div>
          <input
            id={priceId}
            type="range"
            min={8000}
            max={40000}
            step={500}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-2 w-full accent-accent-600"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor={downId} className="text-small font-medium text-ink">
              Down payment
            </label>
            <span className="text-small font-medium text-ink">{formatPrice(down)}</span>
          </div>
          <input
            id={downId}
            type="range"
            min={0}
            max={10000}
            step={250}
            value={down}
            onChange={(e) => setDown(Number(e.target.value))}
            className="mt-2 w-full accent-accent-600"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Select
            label="Term"
            name="estimator-term"
            value={String(term)}
            onChange={(e) => setTerm(Number(e.target.value))}
          >
            {TERMS.map((t) => (
              <option key={t} value={t}>
                {t} months
              </option>
            ))}
          </Select>
          <Select
            label="Credit (best guess)"
            name="estimator-tier"
            value={tier}
            onChange={(e) => setTier(e.target.value)}
          >
            {CREDIT_TIERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6">
        <p className="label-caps text-ink-faint">Estimated payment</p>
        <p className="mt-2 font-display text-display font-semibold text-accent-600" aria-live="polite">
          {formatPrice(Math.round(payment))}
          <span className="text-h3 text-ink-muted">/mo</span>
        </p>
        <p className="mt-3 text-caption text-ink-faint">
          Estimate only, using a {apr.toFixed(1)}% illustrative APR over {term} months with{" "}
          {formatPrice(down)} down. Not a financing offer; your actual rate and terms depend on
          lender approval. Excludes tax, title, registration and dealer fees.
        </p>
      </div>
    </div>
  );
}
