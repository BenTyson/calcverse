/**
 * Ko-fi Earnings Calculator
 * Estimate Ko-fi creator earnings from tips, memberships, shop sales and commissions.
 *
 * ---------------------------------------------------------------------------
 * SOURCES — every fee figure below traces to a "Confident" row in the verified
 * fact file. Do not change a number here without re-reading that file, and do
 * not add a figure that is not in it.
 * ---------------------------------------------------------------------------
 *
 * [1] docs/facts/creator-payment-fees.md § 2 "Ko-fi"
 *     Produced by CHIP-RESEARCH-PAYMENTS, research date 2026-08-25.
 *     Source of truth for third-party platform fees per ruling D-011.
 *
 *     Underlying first-party sources it records as loaded on 2026-08-25:
 *     - S1  https://ko-fi.com/pricing
 *     - S2  https://help.ko-fi.com/hc/en-us/articles/360002506494-Does-Ko-fi-take-a-fee
 *     - S3  https://ko-fi.com/gold
 *
 * WHAT CHANGED (2026-08-25) — the previous model was wrong in both directions:
 *   - It charged 5% on one-off tips. Ko-fi Free charges 0% on one-off tips.
 *   - It charged 0% on shop sales and commissions. Both are 5% on every plan
 *     except Gold.
 *   - It knew only two states (free 5% / Gold 0%). Ko-fi has THREE, and the
 *     default for a new creator is Standard, which is 5% on everything.
 *   - It priced Ko-fi Gold at $6/month. Gold is $12/month (S1), and the
 *     subscription was never subtracted from take-home at all.
 *
 * OPEN VERIFY ROW — V-K1 (fact file § 2 "Verify — Ko-fi"): whether Ko-fi Gold
 * is genuinely still purchasable by a brand-new creator. S1's pricing table and
 * S3's FAQ say yes; S3's own headline says "You no longer need Ko-fi Gold" and
 * the authoritative Help Center breakdown (S2) omits Gold entirely. Gold is
 * modelled here because existing Gold subscriptions demonstrably renew (S3) and
 * because Gold is on Ko-fi's published pricing table — but no copy on this site
 * may recommend buying it until V-K1 is resolved.
 *
 * NOT MODELLED (all recorded in the fact file, none of it in this calculator's
 * inputs):
 *   - Crowdfunding / Goals, which are 0% on Ko-fi Free.
 *   - Monthly (recurring) tips, which are 5% on Ko-fi Free — this module's
 *     "donations" input is one-off "coffees" only.
 *   - The Gold + Standard interaction: a Gold creator who also leaves "Get all
 *     of Ko-fi" switched on still pays the 5% service fee until they opt out
 *     separately (S2). Gold is modelled here as a clean 0%.
 *   - Currency conversion. Ko-fi charges nothing; the creator's own processor
 *     "usually adds a small percentage" and publishes no figure (V-K2).
 *
 * Last verified against the above: August 25, 2026.
 */

/** The date the fee figures in this module were last verified. */
export const KOFI_FEE_DATA_LAST_VERIFIED = 'August 25, 2026';

/**
 * Ko-fi's three fee states (fact file § 2, from S1/S2/S3).
 *
 * - `free`     — $0/mo. 0% on one-off tips and Goals; 5% on memberships,
 *                monthly tips, commissions and shop. Fewer features.
 * - `standard` — $0/mo. 5% on every payment type. All features unlocked.
 *                This is the DEFAULT state for creators joining today:
 *                "New creators now start with all of Ko-fi unlocked from day
 *                one." Reversible any time at Settings → Payment.
 * - `gold`     — $12/mo. 0% service fee on all payment options.
 */
export type KofiPlan = 'free' | 'standard' | 'gold';

export interface KofiEarningsInputs {
  // Quick mode
  monthlyDonations: number; // One-off "coffees"
  membershipCount: number;
  plan: KofiPlan;

  // Advanced mode
  avgDonationAmount: number; // Default $3-5 per coffee
  membershipPrice: number;
  shopSalesPerMonth: number;
  avgOrderValue: number;
  commissionSales: number; // Custom commissions
  paypalFeeRate: number; // The creator's OWN PayPal/Stripe rate

  /**
   * @deprecated Superseded by `plan` on 2026-08-25. Retained only so that
   * shared `?s=` links created before that date still resolve to Ko-fi Gold
   * instead of silently falling back to the Standard default. Never set it in
   * new code. (`goldMember: false` is intentionally NOT migrated — the old
   * two-state model conflated Free and Standard, so `false` is ambiguous.)
   */
  goldMember?: boolean;
}

export interface KofiEarningsResults {
  donationRevenue: number;
  membershipRevenue: number;
  shopRevenue: number;
  commissionRevenue: number;
  grossMonthly: number;
  /** Ko-fi's service fee, applied per product type for the selected plan. */
  platformFees: number;
  /** The Ko-fi Gold subscription itself, $0 on Free and Standard. */
  goldSubscriptionCost: number;
  paymentProcessingFees: number;
  totalFees: number;
  netMonthly: number;
  netAnnual: number;
  feePercentage: number;
  breakdown: {
    label: string;
    value: number;
    percentage: number;
  }[];
}

// --- Ko-fi fee constants (fact file § 2) -----------------------------------

/** Ko-fi's service fee wherever it applies. 5% on Free and Standard. (S1, S2) */
export const KOFI_SERVICE_FEE_RATE = 0.05;

/** Ko-fi Gold subscription price. $12/month, NOT $6. (S1) */
export const KOFI_GOLD_MONTHLY_COST = 12;

/**
 * The revenue at which Ko-fi Gold's $12/month equals the 5% service fee it
 * removes. Derived, never restated: $12 / 0.05 = $240/month of fee-charging
 * revenue. Import this; do not write "240" into page copy.
 */
export const KOFI_GOLD_BREAK_EVEN = KOFI_GOLD_MONTHLY_COST / KOFI_SERVICE_FEE_RATE;

/**
 * Ko-fi does not process payments — the creator connects their own PayPal or
 * Stripe account and pays that processor's normal rates. Ko-fi's own published
 * guidance is "usually around 3% + $0.30", explicitly stated to vary by account
 * type, location and currency (S2). The true rate is the creator's own
 * processor contract, which is why the percentage is a user input.
 */
export const PAYMENT_PROCESSING_FIXED = 0.30;

/**
 * Service fee rate by product type, per plan. Every cell is a Confident row in
 * fact file § 2 "Fee table — creator side".
 */
function serviceFeeRates(plan: KofiPlan): {
  donations: number;
  memberships: number;
  shop: number;
  commissions: number;
} {
  const f = KOFI_SERVICE_FEE_RATE;
  switch (plan) {
    case 'gold':
      // 0% on all payment options.
      return { donations: 0, memberships: 0, shop: 0, commissions: 0 };
    case 'free':
      // One-off tips are 0%. Everything else in this model is 5%.
      return { donations: 0, memberships: f, shop: f, commissions: f };
    case 'standard':
    default:
      // 5% on every payment type.
      return { donations: f, memberships: f, shop: f, commissions: f };
  }
}

/** Resolve the plan, honouring pre-2026-08-25 shared links. */
export function resolveKofiPlan(inputs: KofiEarningsInputs): KofiPlan {
  if (inputs.plan) return inputs.plan;
  return inputs.goldMember ? 'gold' : 'standard';
}

export function calculateKofiEarnings(inputs: KofiEarningsInputs): KofiEarningsResults {
  const plan = resolveKofiPlan(inputs);

  // Calculate revenue streams
  const donationRevenue = inputs.monthlyDonations * inputs.avgDonationAmount;
  const membershipRevenue = inputs.membershipCount * inputs.membershipPrice;
  const shopRevenue = inputs.shopSalesPerMonth * inputs.avgOrderValue;
  const commissionRevenue = inputs.commissionSales;

  const grossMonthly = donationRevenue + membershipRevenue + shopRevenue + commissionRevenue;

  // Ko-fi's service fee, applied per product type for the selected plan.
  const rates = serviceFeeRates(plan);
  const platformFees =
    donationRevenue * rates.donations +
    membershipRevenue * rates.memberships +
    shopRevenue * rates.shop +
    commissionRevenue * rates.commissions;

  // The Gold subscription is a real monthly cost and belongs in take-home.
  const goldSubscriptionCost = plan === 'gold' ? KOFI_GOLD_MONTHLY_COST : 0;

  // Payment processing — charged by the creator's own PayPal/Stripe account,
  // not by Ko-fi, on every transaction.
  const numDonations = inputs.monthlyDonations;
  const numMemberships = inputs.membershipCount; // Monthly recurring
  const numShopOrders = inputs.shopSalesPerMonth;
  const numCommissions = inputs.commissionSales > 0 ? Math.ceil(inputs.commissionSales / 100) : 0;
  const totalTransactions = numDonations + numMemberships + numShopOrders + numCommissions;

  const paymentProcessingFees =
    (grossMonthly * (inputs.paypalFeeRate / 100)) +
    (totalTransactions * PAYMENT_PROCESSING_FIXED);

  const totalFees = platformFees + paymentProcessingFees + goldSubscriptionCost;
  const netMonthly = grossMonthly - totalFees;
  const netAnnual = netMonthly * 12;

  const feePercentage = grossMonthly > 0 ? (totalFees / grossMonthly) * 100 : 0;

  // Revenue breakdown
  const breakdown = [
    { label: 'Tips', value: donationRevenue, percentage: grossMonthly > 0 ? (donationRevenue / grossMonthly) * 100 : 0 },
    { label: 'Memberships', value: membershipRevenue, percentage: grossMonthly > 0 ? (membershipRevenue / grossMonthly) * 100 : 0 },
    { label: 'Shop Sales', value: shopRevenue, percentage: grossMonthly > 0 ? (shopRevenue / grossMonthly) * 100 : 0 },
    { label: 'Commissions', value: commissionRevenue, percentage: grossMonthly > 0 ? (commissionRevenue / grossMonthly) * 100 : 0 },
  ].filter(item => item.value > 0);

  return {
    donationRevenue,
    membershipRevenue,
    shopRevenue,
    commissionRevenue,
    grossMonthly,
    platformFees,
    goldSubscriptionCost,
    paymentProcessingFees,
    totalFees,
    netMonthly,
    netAnnual,
    feePercentage,
    breakdown,
  };
}

export const DEFAULT_INPUTS: KofiEarningsInputs = {
  monthlyDonations: 20,
  membershipCount: 10,
  // Standard is what a creator joining Ko-fi today starts on (S1, S2).
  plan: 'standard',
  avgDonationAmount: 5,
  membershipPrice: 5,
  shopSalesPerMonth: 5,
  avgOrderValue: 15,
  commissionSales: 0,
  paypalFeeRate: 2.9,
};

export const QUICK_MODE_DEFAULTS: Partial<KofiEarningsInputs> = {
  avgDonationAmount: 5,
  membershipPrice: 5,
  shopSalesPerMonth: 0,
  avgOrderValue: 15,
  commissionSales: 0,
  paypalFeeRate: 2.9,
};
