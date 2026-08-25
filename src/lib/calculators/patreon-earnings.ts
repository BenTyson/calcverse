/**
 * Patreon creator earnings — fee model.
 *
 * ---------------------------------------------------------------------------
 * SOURCES — every rate below traces to a row in the project's verified fact
 * file. Do not change a number here without re-reading that file, and do not
 * add a rate that is not in it.
 * ---------------------------------------------------------------------------
 *
 * [1] docs/facts/creator-payment-fees.md — §3 "Patreon"
 *     Produced by CHIP-RESEARCH-PAYMENTS. Fee data last verified: 2026-08-25.
 *     Primary sources behind that section, both loaded on that date:
 *       S4  https://www.patreon.com/pricing
 *       S5  Patreon Help Center, "Creator fees overview" (article 11111747095181)
 *           https://support.patreon.com/hc/en-us/articles/11111747095181-Creator-fees-overview
 *
 * Governed by DECISIONS.md D-011: third-party platform fees get the same
 * treatment as IRS/SSA figures — single source of truth, primary sources
 * fetched in-session, cited with a verification date.
 *
 * ---------------------------------------------------------------------------
 * WHAT CHANGED, AND WHY THIS MODULE WAS REWRITTEN
 * ---------------------------------------------------------------------------
 * This module previously modelled a "Lite 5% / Pro 8% / Premium 12%" plan menu
 * commented "(2024)". Per [1], **those plans do not exist.** Patreon closed its
 * plan menu on 2025-08-04. "Lite" and "Premium" appear nowhere in Patreon's
 * current fee documentation, and 12% is not a rate Patreon publishes.
 *
 * Current reality:
 *   - Every creator who published a page after 2025-08-04 is on a single
 *     mandatory **10% standard plan**. There is no choice to make.
 *   - Three legacy plans survive, all closed to new creators, held only by
 *     creators grandfathered in: Founders 5%, Pro 8%, Pro + Merch 11%.
 *   - Legacy status is lost by unpublishing or republishing the page.
 *
 * ---------------------------------------------------------------------------
 * MODELLING SCOPE — stated so the gaps are visible rather than implied
 * ---------------------------------------------------------------------------
 * Modelled: recurring membership pledges, USD payout, patrons paying by credit
 * card / Apple Pay / US PayPal / US Venmo (per [1] these share identical
 * rates), the legacy micropayment rate, the 2.5% cross-currency fee, and the
 * per-payout transaction fee.
 *
 * NOT modelled, deliberately:
 *   - One-time digital product sales. [1] flags V-P1: Patreon's own article
 *     says the one-time-purchase platform fee runs "between 5% and 12%" while
 *     the legacy plan table in that same article tops out at 11%. That is an
 *     unresolved contradiction in a primary source, so no one-time-purchase
 *     rate is published here at all. Do not add one until V-P1 is closed.
 *   - Non-USD payout currencies. [1] carries the full per-currency table if a
 *     future version needs it.
 *   - Non-US PayPal/Venmo patrons (3.9% + $0.30 rather than 2.9% + $0.30).
 *   - Sales tax on the platform fee itself (V-P5 unresolved: merchant-of-record
 *     status is not established).
 *   - Per-currency Payoneer/PayPal payout tables (V-P4 unresolved).
 */

export type PatreonPlan =
  | 'standard'
  | 'legacy_founders'
  | 'legacy_pro'
  | 'legacy_pro_merch';

export type PatreonPayoutMethod = 'direct_deposit' | 'paypal' | 'payoneer';

export interface PatreonInputs {
  numberOfPatrons: number;
  averagePledge: number;
  /** Which Patreon plan the creator is on. Everyone who joined after
   *  2025-08-04 is on 'standard'; the rest are closed legacy plans. */
  plan: PatreonPlan;
  churnRate: number; // monthly churn percentage
  /** Share of gross paid by patrons in a currency other than the creator's
   *  payout currency. Patreon charges 2.5% on those payments. */
  crossCurrencyPct: number;
  payoutMethod: PatreonPayoutMethod;
}

export interface PatreonResults {
  monthlyGross: number;
  patreonFee: number;
  paymentProcessingFee: number;
  currencyConversionFee: number;
  payoutFee: number;
  totalFees: number;
  monthlyNet: number;
  annualNet: number;
  effectiveFeePct: number;
  projectedPatrons6Mo: number;
  projectedPatrons12Mo: number;
  /** The platform fee rate actually applied, as a percentage (e.g. 10). */
  planRatePct: number;
  planLabel: string;
  /** True when the legacy micropayment processing rate (5% + $0.10) applied.
   *  Only reachable on the legacy Pro / Pro + Merch plans at a pledge <= $3. */
  micropaymentApplied: boolean;
  /** Human-readable description of the processing rate that was applied. */
  processingRateLabel: string;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

/**
 * Platform fee rates. Source [1] §3 "Platform fee".
 * `open` = a creator can be on this plan today by signing up.
 */
export const PATREON_PLANS: Record<
  PatreonPlan,
  { rate: number; label: string; open: boolean }
> = {
  standard: { rate: 0.10, label: 'Standard (10%)', open: true },
  legacy_founders: { rate: 0.05, label: 'Founders (5%, legacy)', open: false },
  legacy_pro: { rate: 0.08, label: 'Pro (8%, legacy)', open: false },
  legacy_pro_merch: { rate: 0.11, label: 'Pro + Merch (11%, legacy)', open: false },
};

/** The date the plan menu closed. Anyone who published after this is on the
 *  standard 10% plan and cannot select anything else. Source [1] §3. */
export const PATREON_LEGACY_CUTOFF = 'August 4, 2025';

/** Date the Patreon fee figures in this module were last verified against
 *  primary sources. Source [1] header. */
export const PATREON_FEES_LAST_VERIFIED = 'August 25, 2026';

/**
 * Payment processing, USD payout, patron paying by credit card / Apple Pay /
 * US PayPal / US Venmo. Source [1] §3 "Payment processing".
 *
 * Critical: the standard 10% plan has NO micropayment rate. [1] quotes
 * Patreon verbatim — "Unlike legacy plans, the standard 10% plan applies the
 * same processing rates to all payments, regardless of amount." A $1 pledge on
 * the standard plan is charged 2.9% + $0.30, a ~32.9% effective processing
 * rate. That is the single most decision-relevant fact for a low-pledge
 * creator, and the reason this model keeps the flat fee per patron.
 */
const PROCESSING_STANDARD = { rate: 0.029, flat: 0.30 };

/** Legacy Pro / Pro + Merch only, on tier prices at or below the micropayment
 *  threshold. Source [1] §3 "legacy plans". */
const PROCESSING_LEGACY_MICRO = { rate: 0.05, flat: 0.10 };
const LEGACY_MICROPAYMENT_THRESHOLD = 3; // USD tier price, inclusive

/** Founders plan, USD, credit card / Apple Pay. Source [1] §3 "Founders". */
const PROCESSING_FOUNDERS = { rate: 0.016, flat: 0.30 };

/** Charged when a patron pays in a currency other than the creator's payout
 *  currency. Source [1] §3 "Currency conversion". */
const CURRENCY_CONVERSION_RATE = 0.025;

/**
 * Per-payout transaction fees, deducted when the balance leaves Patreon.
 * Source [1] §3 "Payout transaction fees". The model assumes one payout per
 * month, which is the common cadence but is an assumption, not a Patreon rule.
 */
const PAYOUT_FEES = {
  direct_deposit: { type: 'flat' as const, amount: 0.25, label: 'Direct deposit' },
  paypal: {
    type: 'percent' as const,
    rate: 0.01,
    min: 0.25,
    max: 20,
    label: 'PayPal',
  },
  payoneer: { type: 'flat' as const, amount: 1.0, label: 'Payoneer Wallet' },
};

export const DEFAULT_INPUTS: PatreonInputs = {
  numberOfPatrons: 100,
  averagePledge: 5,
  // Everyone who can sign up for Patreon today gets this plan and no other.
  plan: 'standard',
  churnRate: 5,
  crossCurrencyPct: 0,
  payoutMethod: 'direct_deposit',
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculatePatreonEarnings(
  inputs: PatreonInputs
): PatreonResults {
  // A stale shared URL can carry a plan key that no longer exists (the old
  // 'lite' / 'premium' values). Fall back to the plan every creator is on.
  const planKey: PatreonPlan = PATREON_PLANS[inputs.plan] ? inputs.plan : 'standard';
  const plan = PATREON_PLANS[planKey];

  const patrons = Math.max(0, inputs.numberOfPatrons);
  const pledge = Math.max(0, inputs.averagePledge);
  const monthlyGross = patrons * pledge;

  // 1. Platform fee.
  const patreonFee = monthlyGross * plan.rate;

  // 2. Payment processing, charged per transaction.
  const isLegacyMicroPlan = planKey === 'legacy_pro' || planKey === 'legacy_pro_merch';
  const micropaymentApplied =
    isLegacyMicroPlan && pledge > 0 && pledge <= LEGACY_MICROPAYMENT_THRESHOLD;

  let processing = PROCESSING_STANDARD;
  if (planKey === 'legacy_founders') {
    processing = PROCESSING_FOUNDERS;
  } else if (micropaymentApplied) {
    processing = PROCESSING_LEGACY_MICRO;
  }

  const paymentProcessingFee =
    monthlyGross * processing.rate + patrons * processing.flat;

  const processingRateLabel = `${round2(processing.rate * 100)}% + $${processing.flat.toFixed(2)} per patron`;

  // 3. Cross-currency conversion, on the share of gross paid in a currency
  //    other than the creator's payout currency.
  const crossCurrencyShare = Math.min(100, Math.max(0, inputs.crossCurrencyPct)) / 100;
  const currencyConversionFee =
    monthlyGross * crossCurrencyShare * CURRENCY_CONVERSION_RATE;

  // 4. Payout fee, charged when the balance leaves Patreon. Assumes one
  //    payout per month.
  const balanceBeforePayout = Math.max(
    0,
    monthlyGross - patreonFee - paymentProcessingFee - currencyConversionFee
  );
  const payoutConfig = PAYOUT_FEES[inputs.payoutMethod] ?? PAYOUT_FEES.direct_deposit;
  let payoutFee = 0;
  if (balanceBeforePayout > 0) {
    payoutFee =
      payoutConfig.type === 'flat'
        ? payoutConfig.amount
        : Math.min(
            Math.max(balanceBeforePayout * payoutConfig.rate, payoutConfig.min),
            payoutConfig.max
          );
  }

  const totalFees =
    patreonFee + paymentProcessingFee + currencyConversionFee + payoutFee;
  const monthlyNet = monthlyGross - totalFees;
  const annualNet = monthlyNet * 12;
  const effectiveFeePct = monthlyGross > 0 ? (totalFees / monthlyGross) * 100 : 0;

  // Project patron counts with churn.
  // Compound decay: P(t) = P0 * (1 - churnRate)^t
  const monthlyRetention = 1 - inputs.churnRate / 100;
  const projectedPatrons6Mo = Math.round(patrons * Math.pow(monthlyRetention, 6));
  const projectedPatrons12Mo = Math.round(patrons * Math.pow(monthlyRetention, 12));

  const breakdown = [
    { label: 'Monthly Gross', amount: round2(monthlyGross) },
    {
      label: `Patreon Fee (${round2(plan.rate * 100)}%)`,
      amount: round2(patreonFee),
      isDeduction: true,
    },
    {
      label: 'Payment Processing',
      amount: round2(paymentProcessingFee),
      isDeduction: true,
    },
  ];
  if (currencyConversionFee > 0) {
    breakdown.push({
      label: 'Currency Conversion (2.5%)',
      amount: round2(currencyConversionFee),
      isDeduction: true,
    });
  }
  if (payoutFee > 0) {
    breakdown.push({
      label: `Payout Fee (${payoutConfig.label})`,
      amount: round2(payoutFee),
      isDeduction: true,
    });
  }

  return {
    monthlyGross: round2(monthlyGross),
    patreonFee: round2(patreonFee),
    paymentProcessingFee: round2(paymentProcessingFee),
    currencyConversionFee: round2(currencyConversionFee),
    payoutFee: round2(payoutFee),
    totalFees: round2(totalFees),
    monthlyNet: round2(monthlyNet),
    annualNet: round2(annualNet),
    effectiveFeePct: Math.round(effectiveFeePct * 10) / 10,
    projectedPatrons6Mo,
    projectedPatrons12Mo,
    planRatePct: round2(plan.rate * 100),
    planLabel: plan.label,
    micropaymentApplied,
    processingRateLabel,
    breakdown,
  };
}
