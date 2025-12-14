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
  stripeFee: number;
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

// Substack takes 10% of revenue
const SUBSTACK_FEE_RATE = 0.10;
// Stripe takes ~2.9% + $0.30 per transaction
const STRIPE_RATE = 0.029;
const STRIPE_FLAT = 0.30;

export const DEFAULT_INPUTS: SubstackInputs = {
  paidSubscribers: 100,
  monthlyPrice: 10,
  freeSubscribers: 2000,
  conversionRate: 5,
  churnRate: 4,
  annualPlanPercent: 30,
};

export function calculateSubstackRevenue(
  inputs: SubstackInputs
): SubstackResults {
  // Calculate monthly revenue
  // Annual subscribers pay upfront but we calculate monthly equivalent
  const monthlySubPrice = inputs.monthlyPrice;
  const annualSubPrice = inputs.monthlyPrice * 10; // Standard 2-month discount
  const annualMonthlyEquiv = annualSubPrice / 12;

  const monthlySubCount = inputs.paidSubscribers * (1 - inputs.annualPlanPercent / 100);
  const annualSubCount = inputs.paidSubscribers * (inputs.annualPlanPercent / 100);

  const monthlyGross = (monthlySubCount * monthlySubPrice) + (annualSubCount * annualMonthlyEquiv);

  // Substack fee (10%)
  const substackFee = monthlyGross * SUBSTACK_FEE_RATE;

  // Stripe fees (2.9% + $0.30 per subscriber)
  // Simplify: monthly subs pay monthly, annual subs pay once/year
  const monthlyTransactions = monthlySubCount;
  const annualTransactions = annualSubCount / 12; // Averaged monthly
  const totalTransactions = monthlyTransactions + annualTransactions;

  const stripeFee = (monthlyGross * STRIPE_RATE) + (totalTransactions * STRIPE_FLAT);

  // Calculate totals
  const totalFees = substackFee + stripeFee;
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
    monthlyGross: Math.round(monthlyGross * 100) / 100,
    substackFee: Math.round(substackFee * 100) / 100,
    stripeFee: Math.round(stripeFee * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
    monthlyNet: Math.round(monthlyNet * 100) / 100,
    annualNet: Math.round(annualNet * 100) / 100,
    revenuePerSubscriber: Math.round(revenuePerSubscriber * 100) / 100,
    effectiveFeePct: Math.round(effectiveFeePct * 10) / 10,
    projectedPaid6Mo: Math.round(projectedPaid6Mo),
    projectedPaid12Mo: Math.round(projectedPaid12Mo),
    breakdown: [
      { label: 'Monthly Gross', amount: Math.round(monthlyGross * 100) / 100 },
      { label: 'Substack Fee (10%)', amount: Math.round(substackFee * 100) / 100, isDeduction: true },
      { label: 'Stripe Fees', amount: Math.round(stripeFee * 100) / 100, isDeduction: true },
    ],
  };
}
