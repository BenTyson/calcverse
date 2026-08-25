// Gumroad Revenue Calculator
// Estimate Gumroad earnings from digital products and memberships
//
// ---------------------------------------------------------------------------
// SOURCES — every Gumroad fee figure below traces to a verified fact file row.
// Do not change a rate here without re-reading the source it came from.
// ---------------------------------------------------------------------------
//
// [1] docs/facts/creator-payment-fees.md § 5 "Gumroad" — the single source of
//     truth for third-party platform fees on this site (ruling D-011). It
//     records the URL and the fetch date for every figure.
//     Fact-file research date: 2026-08-25.
//
//     Underlying primary sources cited by that file, both read on 2026-08-25:
//       S10  https://gumroad.com/pricing
//       S11  https://gumroad.com/help/article/13-getting-paid
//
//     Figures used here, all marked Confident in [1]:
//       - Direct sales fee ......... 10% + $0.50 per transaction  -> GUMROAD_FEE_PERCENT
//                                                                    GUMROAD_FLAT_FEE
//       - Separate processing fee .. none; Gumroad is merchant of record
//                                    since 2025-01-01, so the percentage is
//                                    all-inclusive (no Stripe/PayPal line item)
//       - Monthly cost ............. $0
//
// NOT MODELLED, deliberately:
//
//   - Discover marketplace fee (30% per transaction). [1] marks V-G2 open:
//     Gumroad's pricing page presents 30% and 10% + $0.50 as two alternative
//     per-transaction rates but never states whether Discover replaces the
//     direct rate or stacks on top of it. Modelling it either way would
//     resolve an open Verify row by guessing. Blocked until V-G2 closes.
//
//   - Payout costs: $100 payout minimum, PayPal payout 2%, instant payout 3%.
//     Confident in [1], but they are cashflow/withdrawal costs rather than
//     per-sale costs, so they do not belong in a per-sale fee model. Surfaced
//     as page copy instead.
//
// KNOWN ASSUMPTIONS (each one is exposed to the reader rather than buried):
//
//   - flatFeeOnMemberships. [1] V-G1 is open: Gumroad states the fee is "per
//     transaction for all sales" but never addresses recurring billing
//     specifically. Rather than pick a side, this is a user-facing choice.
//     It defaults to 'yes' — the literal reading of the published rate.
//
//   - Refunded sales are assumed to reverse BOTH the percentage and the flat
//     fee, so the transaction count is reduced by the refund rate. Gumroad does
//     not publish its refund fee-reversal policy.
//
//   - Affiliate commission is assumed to be a percentage of the GROSS sale
//     price, paid out of the creator's share (i.e. after Gumroad's cut, not
//     before it). [1] V-G3 is open on this; the behaviour is unchanged from the
//     previous version of this module.
//
// WHEN UPDATING: re-read [1] first. If [1] is more than ~6 months old, it needs
// re-verification by a research chip before any figure here is changed.

/** Gumroad's standard direct-sales percentage. [1] S10, verified 2026-08-25. */
export const GUMROAD_FEE_PERCENT = 10;

/** Gumroad's standard per-transaction flat fee. [1] S10, verified 2026-08-25. */
export const GUMROAD_FLAT_FEE = 0.5;

/** Date the Gumroad figures above were verified against primary sources. */
export const GUMROAD_FEES_LAST_VERIFIED = 'August 25, 2026';

export type FlatFeeOnMemberships = 'yes' | 'no';

export interface GumroadRevenueInputs {
  // Quick mode
  productPrice: number;
  monthlySales: number;
  gumroadFee: number; // Percentage component (standard 10%)
  gumroadFlatFee: number; // Per-transaction dollar component (standard $0.50)

  // Advanced mode
  memberCount: number;
  memberPrice: number;
  flatFeeOnMemberships: FlatFeeOnMemberships; // See V-G1 note above
  affiliateRate: number; // Commission % paid to affiliates
  affiliatePercent: number; // % of sales coming via affiliates
  refundRate: number; // Percentage
  emailListSize: number;
  conversionRate: number; // Percentage
}

export interface GumroadRevenueResults {
  productGross: number;
  membershipGross: number;
  totalGross: number;
  refundAmount: number;
  /** Number of chargeable transactions per month, net of refunds. */
  billableTransactions: number;
  /** Percentage component of Gumroad's fee. */
  gumroadPercentFeeAmount: number;
  /** Flat per-transaction component of Gumroad's fee. */
  gumroadFlatFeeAmount: number;
  /** Percentage + flat components combined. */
  gumroadFeeAmount: number;
  /** Gumroad's fee as a % of the revenue it is charged on. Price-dependent. */
  gumroadEffectiveRate: number;
  /** Gumroad's fee on a single product sale at the current price. */
  feePerSale: number;
  /** What the creator keeps from a single product sale at the current price. */
  netPerSale: number;
  /** feePerSale as a % of the product price — the honest headline rate. */
  perSaleFeeRate: number;
  affiliateCost: number;
  totalDeductions: number;
  netMonthly: number;
  netAnnual: number;
  effectiveFeeRate: number;
  emailListPotential: number;
  breakdown: {
    label: string;
    value: number;
    percentage: number;
  }[];
}

export const DEFAULT_INPUTS: GumroadRevenueInputs = {
  productPrice: 29,
  monthlySales: 20,
  gumroadFee: GUMROAD_FEE_PERCENT,
  gumroadFlatFee: GUMROAD_FLAT_FEE,
  memberCount: 0,
  memberPrice: 9,
  flatFeeOnMemberships: 'yes',
  affiliateRate: 25,
  affiliatePercent: 10,
  refundRate: 3,
  emailListSize: 1000,
  conversionRate: 2,
};

export const QUICK_MODE_DEFAULTS: Partial<GumroadRevenueInputs> = {
  memberCount: 0,
  memberPrice: 9,
  flatFeeOnMemberships: 'yes',
  affiliateRate: 25,
  affiliatePercent: 0,
  refundRate: 3,
  emailListSize: 1000,
  conversionRate: 2,
};

export function calculateGumroadRevenue(inputs: GumroadRevenueInputs): GumroadRevenueResults {
  const flatFee = Math.max(0, inputs.gumroadFlatFee ?? GUMROAD_FLAT_FEE);

  // Product revenue
  const productGross = inputs.productPrice * inputs.monthlySales;

  // Membership revenue
  const membershipGross = inputs.memberCount * inputs.memberPrice;

  const totalGross = productGross + membershipGross;

  // Refunds (applied to product sales only)
  const refundShare = Math.min(1, Math.max(0, inputs.refundRate / 100));
  const refundAmount = productGross * refundShare;

  const revenueAfterRefunds = totalGross - refundAmount;

  // Transaction count that the flat fee is charged on. Refunded sales are
  // assumed to reverse the flat fee along with the percentage, so the product
  // count is reduced by the same refund share applied to product revenue.
  // Membership renewals count as transactions only when the reader says so —
  // see the V-G1 note in the header block.
  const productTransactions = inputs.monthlySales * (1 - refundShare);
  const membershipTransactions =
    inputs.flatFeeOnMemberships === 'no' ? 0 : inputs.memberCount;
  const billableTransactions = productTransactions + membershipTransactions;

  // Gumroad fee: a percentage PLUS a flat amount per transaction.
  // Gumroad is merchant of record, so this is the whole fee — there is no
  // separate payment-processing line item. [1]
  const gumroadPercentFeeAmount = revenueAfterRefunds * (inputs.gumroadFee / 100);
  const gumroadFlatFeeAmount = billableTransactions * flatFee;
  const gumroadFeeAmount = gumroadPercentFeeAmount + gumroadFlatFeeAmount;

  // The headline number the flat fee makes price-dependent: what share of the
  // money Gumroad actually charges on does Gumroad keep?
  const gumroadEffectiveRate =
    revenueAfterRefunds > 0 ? (gumroadFeeAmount / revenueAfterRefunds) * 100 : 0;

  // Per-sale view at the current product price
  const feePerSale = inputs.productPrice * (inputs.gumroadFee / 100) + flatFee;
  const netPerSale = inputs.productPrice - feePerSale;
  const perSaleFeeRate = inputs.productPrice > 0 ? (feePerSale / inputs.productPrice) * 100 : 0;

  // Affiliate costs — commission on the gross sale price, paid from the
  // creator's share rather than Gumroad's (V-G3 open).
  const affiliateSales = productGross * (inputs.affiliatePercent / 100);
  const affiliateCost = affiliateSales * (inputs.affiliateRate / 100);

  const totalDeductions = refundAmount + gumroadFeeAmount + affiliateCost;
  const netMonthly = totalGross - totalDeductions;
  const netAnnual = netMonthly * 12;

  const effectiveFeeRate = totalGross > 0 ? (totalDeductions / totalGross) * 100 : 0;

  // Email list potential (monthly sales estimate from list)
  const emailListPotential = inputs.emailListSize * (inputs.conversionRate / 100) * inputs.productPrice;

  // Revenue breakdown (only include streams with value > 0)
  const allStreams = [
    { label: 'Product Sales', value: productGross },
    { label: 'Memberships', value: membershipGross },
  ];

  const activeStreams = allStreams.filter((s) => s.value > 0);
  const breakdown = activeStreams.map((s) => ({
    label: s.label,
    value: s.value,
    percentage: totalGross > 0 ? (s.value / totalGross) * 100 : 0,
  }));

  return {
    productGross,
    membershipGross,
    totalGross,
    refundAmount,
    billableTransactions,
    gumroadPercentFeeAmount,
    gumroadFlatFeeAmount,
    gumroadFeeAmount,
    gumroadEffectiveRate,
    feePerSale,
    netPerSale,
    perSaleFeeRate,
    affiliateCost,
    totalDeductions,
    netMonthly,
    netAnnual,
    effectiveFeeRate,
    emailListPotential,
    breakdown,
  };
}
