// Gumroad Revenue Calculator
// Estimate Gumroad earnings from digital products and memberships

export interface GumroadRevenueInputs {
  // Quick mode
  productPrice: number;
  monthlySales: number;
  gumroadFee: number; // Percentage (flat 10%)

  // Advanced mode
  memberCount: number;
  memberPrice: number;
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
  gumroadFeeAmount: number;
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
  gumroadFee: 10,
  memberCount: 0,
  memberPrice: 9,
  affiliateRate: 25,
  affiliatePercent: 10,
  refundRate: 3,
  emailListSize: 1000,
  conversionRate: 2,
};

export const QUICK_MODE_DEFAULTS: Partial<GumroadRevenueInputs> = {
  memberCount: 0,
  memberPrice: 9,
  affiliateRate: 25,
  affiliatePercent: 0,
  refundRate: 3,
  emailListSize: 1000,
  conversionRate: 2,
};

export function calculateGumroadRevenue(inputs: GumroadRevenueInputs): GumroadRevenueResults {
  // Product revenue
  const productGross = inputs.productPrice * inputs.monthlySales;

  // Membership revenue
  const membershipGross = inputs.memberCount * inputs.memberPrice;

  const totalGross = productGross + membershipGross;

  // Refunds (applied to product sales only)
  const refundAmount = productGross * (inputs.refundRate / 100);

  const revenueAfterRefunds = totalGross - refundAmount;

  // Gumroad fee (includes payment processing)
  const gumroadFeeAmount = revenueAfterRefunds * (inputs.gumroadFee / 100);

  // Affiliate costs
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
    gumroadFeeAmount,
    affiliateCost,
    totalDeductions,
    netMonthly,
    netAnnual,
    effectiveFeeRate,
    emailListPotential,
    breakdown,
  };
}
