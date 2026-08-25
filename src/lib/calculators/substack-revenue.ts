/**
 * Substack paid-subscription revenue model.
 *
 * ---------------------------------------------------------------------------
 * SOURCES — every fee figure below traces to a verified fact file row.
 * Do not change a rate here without re-reading the source it came from.
 * ---------------------------------------------------------------------------
 *
 * [1] docs/facts/creator-payment-fees.md § 6 "Substack" — the project's single
 *     source of truth for third-party platform fees (ruling D-011).
 *     Verified 2026-08-25 by CHIP-RESEARCH-PAYMENTS against source S12:
 *     https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost
 *
 *     - Substack platform fee ......... 10% of each transaction
 *     - Stripe card processing ........ 2.9% + $0.30 per transaction
 *     - Stripe Billing fee (recurring)  0.7%, in force since July 2024
 *
 * WHY THE BILLING FEE MATTERS: Stripe's Billing fee is charged on recurring
 * payments and is **not** included in the "Stripe processing fee" figure shown
 * in Substack's own payment breakdown — it appears separately as "Stripe fee"
 * under Transactions -> All Activity. That is why it is routinely missed, and
 * why this module reports it as its own line rather than folding it into
 * `stripeProcessingFee`.
 *
 * The 0.5% legacy Billing rate applied only to creators who enabled payments
 * before 2024-07-10, and that grandfathering **expired 2025-06-30**. There is
 * no creator for whom 0.5% — or omitting the fee entirely — is correct today.
 *
 * NOT MODELLED (open Verify rows in [1] — do not "fill these in" from memory):
 *   V-S1  Payout minimum and schedule (funds move through the creator's own
 *         Stripe account, so Stripe's payout terms apply, not Substack's).
 *   V-S2  Whether Substack's 10% is taken before or after Stripe's fees and
 *         before or after tax. This module applies all three percentages to
 *         gross, which reproduces the fee table published in [1] § 6 exactly.
 *   V-S3  Fees on pledges, gifts, founding tiers and Substack Network.
 *   V-S4  Merchant-of-record status; no sales tax / VAT is modelled.
 *   Non-card rails (iDEAL, Bancontact, Sofort, SEPA Direct Debit) carry
 *   different Stripe rates — see [1] § 6. Card payment is assumed throughout.
 *
 * WHEN UPDATING: re-read [1]. If [1] is itself stale, a research chip must
 * re-verify against Substack's own published page before any rate moves here.
 * Fee schedules change without notice; treat anything older than ~6 months as
 * suspect.
 */

export interface SubstackInputs {
  paidSubscribers: number;
  monthlyPrice: number;
  freeSubscribers: number;
  conversionRate: number; // % of free that convert to paid
  churnRate: number; // monthly churn %
  annualPlanPercent: number; // % on annual vs monthly
}

export interface SubstackResults {
  monthlyGross: number;
  substackFee: number;
  /** Stripe card processing: 2.9% + $0.30 per transaction. */
  stripeProcessingFee: number;
  /** Stripe Billing fee on recurring payments: 0.7%. Billed separately. */
  stripeBillingFee: number;
  /** Both Stripe lines combined, for a single "Stripe takes" figure. */
  stripeFeeTotal: number;
  totalFees: number;
  monthlyNet: number;
  annualNet: number;
  revenuePerSubscriber: number;
  effectiveFeePct: number;
  projectedPaid6Mo: number;
  projectedPaid12Mo: number;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

/** Substack's platform fee — 10% of each transaction. Source [1]. */
export const SUBSTACK_FEE_RATE = 0.10;
/** Stripe card processing rate. Source [1]. */
export const STRIPE_RATE = 0.029;
/** Stripe per-transaction flat fee, USD. Source [1]. */
export const STRIPE_FLAT = 0.30;
/**
 * Stripe Billing fee on recurring payments. Source [1].
 * In force since July 2024; the 0.5% legacy rate expired 2025-06-30.
 */
export const STRIPE_BILLING_RATE = 0.007;

/** Combined percentage take: 10% + 2.9% + 0.7% = 13.6%, plus $0.30. */
export const TOTAL_PERCENT_RATE =
  SUBSTACK_FEE_RATE + STRIPE_RATE + STRIPE_BILLING_RATE;

/** Date the fee figures above were last verified against a primary source. */
export const FEE_DATA_LAST_VERIFIED = 'August 25, 2026';

/**
 * Monthly-equivalent price of an annual plan, as a multiple of the monthly
 * price. This is a MODELLING ASSUMPTION, not a Substack rule — Substack does
 * not mandate any annual discount ratio and creators set both prices
 * independently (source [1] § 6). Two months free is the convention most
 * newsletters follow, so it is what this model assumes.
 */
export const ANNUAL_PLAN_MONTHS = 10;

export const DEFAULT_INPUTS: SubstackInputs = {
  paidSubscribers: 100,
  monthlyPrice: 10,
  freeSubscribers: 2000,
  conversionRate: 5,
  churnRate: 4,
  annualPlanPercent: 30,
};

export interface PaymentFeeBreakdown {
  payment: number;
  substackFee: number;
  stripeProcessingFee: number;
  stripeBillingFee: number;
  totalFees: number;
  net: number;
  effectiveFeePct: number;
}

/**
 * Fees on a single recurring card payment of `payment` dollars — one monthly
 * charge, or one annual charge. Reproduces the fee table in [1] § 6.
 */
export function calculateNetPerPayment(payment: number): PaymentFeeBreakdown {
  const substackFee = payment * SUBSTACK_FEE_RATE;
  const stripeProcessingFee = payment * STRIPE_RATE + STRIPE_FLAT;
  const stripeBillingFee = payment * STRIPE_BILLING_RATE;
  const totalFees = substackFee + stripeProcessingFee + stripeBillingFee;
  const net = payment - totalFees;

  return {
    payment: round2(payment),
    substackFee: round2(substackFee),
    stripeProcessingFee: round2(stripeProcessingFee),
    stripeBillingFee: round2(stripeBillingFee),
    totalFees: round2(totalFees),
    net: round2(net),
    effectiveFeePct:
      payment > 0 ? Math.round((totalFees / payment) * 1000) / 10 : 0,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateSubstackRevenue(
  inputs: SubstackInputs
): SubstackResults {
  // Calculate monthly revenue
  // Annual subscribers pay upfront but we calculate monthly equivalent
  const monthlySubPrice = inputs.monthlyPrice;
  const annualSubPrice = inputs.monthlyPrice * ANNUAL_PLAN_MONTHS;
  const annualMonthlyEquiv = annualSubPrice / 12;

  const monthlySubCount = inputs.paidSubscribers * (1 - inputs.annualPlanPercent / 100);
  const annualSubCount = inputs.paidSubscribers * (inputs.annualPlanPercent / 100);

  const monthlyGross = (monthlySubCount * monthlySubPrice) + (annualSubCount * annualMonthlyEquiv);

  // Substack platform fee (10% of each transaction)
  const substackFee = monthlyGross * SUBSTACK_FEE_RATE;

  // Stripe card processing (2.9% + $0.30 per transaction)
  // Simplify: monthly subs pay monthly, annual subs pay once/year
  const monthlyTransactions = monthlySubCount;
  const annualTransactions = annualSubCount / 12; // Averaged monthly
  const totalTransactions = monthlyTransactions + annualTransactions;

  const stripeProcessingFee =
    monthlyGross * STRIPE_RATE + totalTransactions * STRIPE_FLAT;

  // Stripe Billing fee (0.7% on recurring payments) — charged on top of card
  // processing and NOT included in Substack's "Stripe processing fee" figure.
  const stripeBillingFee = monthlyGross * STRIPE_BILLING_RATE;

  const stripeFeeTotal = stripeProcessingFee + stripeBillingFee;

  // Calculate totals
  const totalFees = substackFee + stripeFeeTotal;
  const monthlyNet = monthlyGross - totalFees;
  const annualNet = monthlyNet * 12;
  const revenuePerSubscriber = inputs.paidSubscribers > 0
    ? monthlyNet / inputs.paidSubscribers
    : 0;
  const effectiveFeePct = monthlyGross > 0 ? (totalFees / monthlyGross) * 100 : 0;

  // Project subscriber growth with conversion and churn
  // New paid subs from free: freeSubscribers * conversionRate / 12 (monthly)
  // Churn: paidSubscribers * churnRate
  const monthlyNewPaid = inputs.freeSubscribers * (inputs.conversionRate / 100) / 12;
  const monthlyChurn = inputs.churnRate / 100;

  // Project 6 and 12 months
  let projectedPaid6Mo = inputs.paidSubscribers;
  let projectedPaid12Mo = inputs.paidSubscribers;

  for (let i = 0; i < 12; i++) {
    const newPaid = monthlyNewPaid;
    const churned = projectedPaid12Mo * monthlyChurn;
    projectedPaid12Mo = projectedPaid12Mo + newPaid - churned;

    if (i < 6) {
      projectedPaid6Mo = projectedPaid12Mo;
    }
  }

  return {
    monthlyGross: round2(monthlyGross),
    substackFee: round2(substackFee),
    stripeProcessingFee: round2(stripeProcessingFee),
    stripeBillingFee: round2(stripeBillingFee),
    stripeFeeTotal: round2(stripeFeeTotal),
    totalFees: round2(totalFees),
    monthlyNet: round2(monthlyNet),
    annualNet: round2(annualNet),
    revenuePerSubscriber: round2(revenuePerSubscriber),
    effectiveFeePct: Math.round(effectiveFeePct * 10) / 10,
    projectedPaid6Mo: Math.round(projectedPaid6Mo),
    projectedPaid12Mo: Math.round(projectedPaid12Mo),
    breakdown: [
      { label: 'Monthly Gross', amount: round2(monthlyGross) },
      { label: 'Substack Fee (10%)', amount: round2(substackFee), isDeduction: true },
      { label: 'Stripe Processing (2.9% + $0.30)', amount: round2(stripeProcessingFee), isDeduction: true },
      { label: 'Stripe Billing Fee (0.7%)', amount: round2(stripeBillingFee), isDeduction: true },
    ],
  };
}
