/**
 * Rate card. ILLUSTRATIVE — Fundo does not publish pricing. In production this file is
 * loaded from a versioned JSON owned by finance and approved by compliance, so a pricing
 * change is a data change, not a deploy.
 */
export const RATE_CARD = {
  version: 'illustrative-2026-11',
  minAmount: 500,
  maxAmount: 10_000,
  step: 100,
  terms: [
    { weeks: 12, factor: 1.25 },
    { weeks: 16, factor: 1.3 },
    { weeks: 20, factor: 1.35 },
  ],
} as const;

export type TermWeeks = (typeof RATE_CARD.terms)[number]['weeks'];

export interface Quote {
  amount: number;
  weeks: TermWeeks;
  factor: number;
  payback: number;
  cost: number;
  /** Regular weekly payment, in dollars with cents. */
  payment: number;
  /** Last payment absorbs rounding so the total is exact. */
  lastPayment: number;
}

const toCents = (n: number) => Math.round(n * 100);

/** Round to the nearest step and keep inside the allowed range. */
export function normalizeAmount(raw: number): number {
  if (!Number.isFinite(raw)) return RATE_CARD.minAmount;
  const rounded = Math.round(raw / RATE_CARD.step) * RATE_CARD.step;
  return Math.min(RATE_CARD.maxAmount, Math.max(RATE_CARD.minAmount, rounded));
}

export function getQuote(amount: number, weeks: TermWeeks): Quote {
  const term = RATE_CARD.terms.find((t) => t.weeks === weeks);
  if (!term) throw new Error(`Unknown term: ${weeks}`);
  const a = normalizeAmount(amount);
  const paybackCents = toCents(a * term.factor);
  const paymentCents = Math.floor(paybackCents / term.weeks);
  const lastCents = paybackCents - paymentCents * (term.weeks - 1);
  return {
    amount: a,
    weeks: term.weeks,
    factor: term.factor,
    payback: paybackCents / 100,
    cost: (paybackCents - toCents(a)) / 100,
    payment: paymentCents / 100,
    lastPayment: lastCents / 100,
  };
}
