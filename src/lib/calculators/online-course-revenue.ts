// Online Course Revenue Calculator
// Estimate course revenue across platforms and revenue streams

export interface OnlineCourseInputs {
  // Quick mode
  coursePrice: number;
  monthlySales: number;
  platform: string;

  // Advanced mode
  refundRate: number;
  completionRate: number;
  subscriptionStudents: number;
  subscriptionPrice: number;
  launchStudents: number;
  launchPrice: number;
  adSpend: number;
  udemyOrganicPercent: number;
}

export interface OnlineCourseResults {
  monthlyNetRevenue: number;
  annualRevenue: number;
  revenuePerStudent: number;
  courseSalesGross: number;
  subscriptionRevenue: number;
  launchRevenue: number;
  totalGross: number;
  platformFee: number;
  paymentProcessing: number;
  refundAmount: number;
  netMonthly: number;
  breakdown: {
    label: string;
    value: number;
    percentage: number;
  }[];
}

// Platform fee structures
function getPlatformFees(
  platform: string,
  courseSalesGross: number,
  subscriptionRevenue: number,
  launchRevenue: number,
  udemyOrganicPercent: number
): { platformFee: number; paymentProcessing: number } {
  const totalGross = courseSalesGross + subscriptionRevenue + launchRevenue;

  switch (platform) {
    case 'teachable': {
      // 5% transaction fee + Stripe (2.9% + $0.30 per sale approximated)
      const platformFee = totalGross * 0.05;
      const paymentProcessing = totalGross * 0.029;
      return { platformFee, paymentProcessing };
    }
    case 'udemy': {
      // 63% organic sales, 3% instructor-brought, blended rate
      const organicDecimal = udemyOrganicPercent / 100;
      const blendedRate = organicDecimal * 0.63 + (1 - organicDecimal) * 0.03;
      const platformFee = courseSalesGross * blendedRate;
      return { platformFee, paymentProcessing: 0 };
    }
    case 'skillshare': {
      // ~$2 per referral/enrollment model (approximate)
      const estimatedEnrollments = courseSalesGross > 0
        ? Math.ceil(courseSalesGross / 30)
        : 0;
      const platformFee = estimatedEnrollments * 2;
      return { platformFee, paymentProcessing: 0 };
    }
    case 'self-hosted': {
      // Stripe only: 2.9% + $0.30 per transaction
      const paymentProcessing = totalGross * 0.029;
      return { platformFee: 0, paymentProcessing };
    }
    default:
      return { platformFee: 0, paymentProcessing: 0 };
  }
}

export function calculateOnlineCourseRevenue(inputs: OnlineCourseInputs): OnlineCourseResults {
  // Course sales
  const courseSalesGross = inputs.coursePrice * inputs.monthlySales;

  // Subscription revenue (monthly)
  const subscriptionRevenue = inputs.subscriptionStudents * inputs.subscriptionPrice;

  // Launch revenue (amortized over 12 months)
  const launchRevenue = (inputs.launchStudents * inputs.launchPrice) / 12;

  const totalGross = courseSalesGross + subscriptionRevenue + launchRevenue;

  // Platform fees
  const { platformFee, paymentProcessing } = getPlatformFees(
    inputs.platform,
    courseSalesGross,
    subscriptionRevenue,
    launchRevenue,
    inputs.udemyOrganicPercent
  );

  // Refunds (on course sales only)
  const refundAmount = courseSalesGross * (inputs.refundRate / 100);

  // Net
  const netMonthly = totalGross - platformFee - paymentProcessing - refundAmount - inputs.adSpend;
  const annualRevenue = netMonthly * 12;

  const totalStudents = inputs.monthlySales + inputs.subscriptionStudents;
  const revenuePerStudent = totalStudents > 0 ? netMonthly / totalStudents : 0;

  // Revenue source breakdown (for DonutChart)
  const allStreams = [
    { label: 'Course Sales', value: courseSalesGross },
    { label: 'Subscriptions', value: subscriptionRevenue },
    { label: 'Launch Revenue', value: launchRevenue },
  ];

  const activeStreams = allStreams.filter((s) => s.value > 0);
  const breakdown = activeStreams.map((s) => ({
    label: s.label,
    value: Math.round(s.value * 100) / 100,
    percentage: totalGross > 0 ? (s.value / totalGross) * 100 : 0,
  }));

  return {
    monthlyNetRevenue: Math.round(netMonthly * 100) / 100,
    annualRevenue: Math.round(annualRevenue * 100) / 100,
    revenuePerStudent: Math.round(revenuePerStudent * 100) / 100,
    courseSalesGross: Math.round(courseSalesGross * 100) / 100,
    subscriptionRevenue: Math.round(subscriptionRevenue * 100) / 100,
    launchRevenue: Math.round(launchRevenue * 100) / 100,
    totalGross: Math.round(totalGross * 100) / 100,
    platformFee: Math.round(platformFee * 100) / 100,
    paymentProcessing: Math.round(paymentProcessing * 100) / 100,
    refundAmount: Math.round(refundAmount * 100) / 100,
    netMonthly: Math.round(netMonthly * 100) / 100,
    breakdown,
  };
}

export const DEFAULT_INPUTS: OnlineCourseInputs = {
  coursePrice: 197,
  monthlySales: 15,
  platform: 'teachable',
  refundRate: 5,
  completionRate: 30,
  subscriptionStudents: 0,
  subscriptionPrice: 29,
  launchStudents: 0,
  launchPrice: 497,
  adSpend: 0,
  udemyOrganicPercent: 50,
};

export const QUICK_MODE_DEFAULTS: Partial<OnlineCourseInputs> = {
  refundRate: 5,
  completionRate: 30,
  subscriptionStudents: 0,
  subscriptionPrice: 29,
  launchStudents: 0,
  launchPrice: 497,
  adSpend: 0,
  udemyOrganicPercent: 50,
};
