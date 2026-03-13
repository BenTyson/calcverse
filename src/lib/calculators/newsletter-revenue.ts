// Newsletter Revenue Calculator
// Estimate newsletter income from subscriptions and sponsorships

export interface NewsletterRevenueInputs {
  // Quick mode
  totalSubscribers: number;
  platform: string;
  paidPercent: number;
  monthlyPrice: number;

  // Advanced mode
  monthlyGrowthRate: number;
  churnRate: number;
  annualPlanPercent: number;
  sponsorshipCPM: number;
  openRate: number;
  issuesPerMonth: number;
  sponsoredIssuesPercent: number;
}

export interface NewsletterRevenueResults {
  monthlyNetRevenue: number;
  annualRecurringRevenue: number;
  revenuePerSubscriber: number;
  paidSubscribers: number;
  subscriptionGross: number;
  sponsorshipRevenue: number;
  totalGross: number;
  platformFee: number;
  paymentProcessing: number;
  netMonthly: number;
  projectedPaidSubs6mo: number;
  projectedPaidSubs12mo: number;
  breakdown: {
    label: string;
    value: number;
    percentage: number;
  }[];
}

// Platform fee structures
function getPlatformFees(
  platform: string,
  subscriptionGross: number
): { platformFee: number; paymentProcessing: number } {
  switch (platform) {
    case 'substack':
      // 10% + Stripe 2.9%
      return {
        platformFee: subscriptionGross * 0.10,
        paymentProcessing: subscriptionGross * 0.029,
      };
    case 'beehiiv':
      // 0% (Scale plan) + Stripe 2.9%
      return {
        platformFee: 0,
        paymentProcessing: subscriptionGross * 0.029,
      };
    case 'convertkit':
      // 3.5% + Stripe 2.9%
      return {
        platformFee: subscriptionGross * 0.035,
        paymentProcessing: subscriptionGross * 0.029,
      };
    default:
      return { platformFee: 0, paymentProcessing: 0 };
  }
}

export function calculateNewsletterRevenue(inputs: NewsletterRevenueInputs): NewsletterRevenueResults {
  // Paid subscribers
  const paidSubscribers = Math.round(inputs.totalSubscribers * (inputs.paidPercent / 100));

  // Subscription revenue (annual plans = 10mo/12 effective monthly rate)
  const annualPlanDecimal = inputs.annualPlanPercent / 100;
  const monthlyPayers = paidSubscribers * (1 - annualPlanDecimal);
  const annualPayers = paidSubscribers * annualPlanDecimal;
  const effectiveAnnualMonthly = (inputs.monthlyPrice * 10) / 12; // annual discount
  const subscriptionGross = monthlyPayers * inputs.monthlyPrice + annualPayers * effectiveAnnualMonthly;

  // Sponsorship revenue
  const openRateDecimal = inputs.openRate / 100;
  const opens = inputs.totalSubscribers * openRateDecimal;
  const sponsoredIssuesDecimal = inputs.sponsoredIssuesPercent / 100;
  const sponsoredIssues = inputs.issuesPerMonth * sponsoredIssuesDecimal;
  const sponsorshipRevenue = inputs.sponsorshipCPM > 0
    ? (opens / 1000) * inputs.sponsorshipCPM * sponsoredIssues
    : 0;

  const totalGross = subscriptionGross + sponsorshipRevenue;

  // Platform fees (only on subscription revenue)
  const { platformFee, paymentProcessing } = getPlatformFees(inputs.platform, subscriptionGross);

  const netMonthly = totalGross - platformFee - paymentProcessing;
  const annualRecurringRevenue = netMonthly * 12;
  const revenuePerSubscriber = inputs.totalSubscribers > 0
    ? netMonthly / inputs.totalSubscribers
    : 0;

  // Growth projections (compound growth minus churn)
  const monthlyGrowthDecimal = inputs.monthlyGrowthRate / 100;
  const churnDecimal = inputs.churnRate / 100;
  const netGrowthRate = monthlyGrowthDecimal - churnDecimal;

  const projectedSubs6mo = inputs.totalSubscribers * Math.pow(1 + netGrowthRate, 6);
  const projectedSubs12mo = inputs.totalSubscribers * Math.pow(1 + netGrowthRate, 12);
  const projectedPaidSubs6mo = Math.round(projectedSubs6mo * (inputs.paidPercent / 100));
  const projectedPaidSubs12mo = Math.round(projectedSubs12mo * (inputs.paidPercent / 100));

  // Revenue breakdown (for DonutChart)
  const allStreams = [
    { label: 'Subscriptions', value: subscriptionGross },
    { label: 'Sponsorships', value: sponsorshipRevenue },
  ];
  const activeStreams = allStreams.filter((s) => s.value > 0);
  const breakdown = activeStreams.map((s) => ({
    label: s.label,
    value: Math.round(s.value * 100) / 100,
    percentage: totalGross > 0 ? (s.value / totalGross) * 100 : 0,
  }));

  return {
    monthlyNetRevenue: Math.round(netMonthly * 100) / 100,
    annualRecurringRevenue: Math.round(annualRecurringRevenue * 100) / 100,
    revenuePerSubscriber: Math.round(revenuePerSubscriber * 100) / 100,
    paidSubscribers,
    subscriptionGross: Math.round(subscriptionGross * 100) / 100,
    sponsorshipRevenue: Math.round(sponsorshipRevenue * 100) / 100,
    totalGross: Math.round(totalGross * 100) / 100,
    platformFee: Math.round(platformFee * 100) / 100,
    paymentProcessing: Math.round(paymentProcessing * 100) / 100,
    netMonthly: Math.round(netMonthly * 100) / 100,
    projectedPaidSubs6mo,
    projectedPaidSubs12mo,
    breakdown,
  };
}

export const DEFAULT_INPUTS: NewsletterRevenueInputs = {
  totalSubscribers: 5000,
  platform: 'substack',
  paidPercent: 5,
  monthlyPrice: 10,
  monthlyGrowthRate: 5,
  churnRate: 4,
  annualPlanPercent: 30,
  sponsorshipCPM: 30,
  openRate: 40,
  issuesPerMonth: 4,
  sponsoredIssuesPercent: 50,
};

export const QUICK_MODE_DEFAULTS: Partial<NewsletterRevenueInputs> = {
  monthlyGrowthRate: 5,
  churnRate: 4,
  annualPlanPercent: 30,
  sponsorshipCPM: 0,
  openRate: 40,
  issuesPerMonth: 4,
  sponsoredIssuesPercent: 50,
};
