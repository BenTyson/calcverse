// TikTok Earnings Calculator
// Estimate TikTok creator earnings from Creator Fund, brand deals, and LIVE gifts

export interface TikTokEarningsInputs {
  // Quick mode
  viewsPerVideo: number;
  videosPerWeek: number;
  rpm: number; // Revenue per 1K views ($0.01-$0.10)

  // Advanced mode
  brandDealRate: number;
  brandDealsPerMonth: number;
  liveHoursPerWeek: number;
  avgGiftsPerHour: number; // Dollar value of gifts per hour
  engagementRate: number; // Percentage
  monthlyGrowthRate: number; // Percentage
}

export interface TikTokEarningsResults {
  monthlyViews: number;
  creatorFundRevenue: number;
  brandDealRevenue: number;
  liveGiftRevenue: number;
  totalMonthly: number;
  totalAnnual: number;
  perVideo: number;
  breakdown: {
    label: string;
    value: number;
    percentage: number;
  }[];
  growthProjection: {
    month: number;
    earnings: number;
  }[];
}

export const DEFAULT_INPUTS: TikTokEarningsInputs = {
  viewsPerVideo: 50000,
  videosPerWeek: 5,
  rpm: 0.03,
  brandDealRate: 500,
  brandDealsPerMonth: 1,
  liveHoursPerWeek: 2,
  avgGiftsPerHour: 15,
  engagementRate: 5,
  monthlyGrowthRate: 5,
};

export const QUICK_MODE_DEFAULTS: Partial<TikTokEarningsInputs> = {
  brandDealRate: 500,
  brandDealsPerMonth: 0,
  liveHoursPerWeek: 0,
  avgGiftsPerHour: 15,
  engagementRate: 5,
  monthlyGrowthRate: 5,
};

export function calculateTikTokEarnings(inputs: TikTokEarningsInputs): TikTokEarningsResults {
  const monthlyViews = inputs.viewsPerVideo * inputs.videosPerWeek * 4.33;

  // Creator Fund revenue
  const creatorFundRevenue = (monthlyViews / 1000) * inputs.rpm;

  // Brand deal revenue
  const brandDealRevenue = inputs.brandDealRate * inputs.brandDealsPerMonth;

  // LIVE gift revenue
  const monthlyLiveHours = inputs.liveHoursPerWeek * 4.33;
  const liveGiftRevenue = monthlyLiveHours * inputs.avgGiftsPerHour;

  const totalMonthly = creatorFundRevenue + brandDealRevenue + liveGiftRevenue;
  const totalAnnual = totalMonthly * 12;

  const videosPerMonth = inputs.videosPerWeek * 4.33;
  const perVideo = videosPerMonth > 0 ? totalMonthly / videosPerMonth : 0;

  // Revenue breakdown (only include streams with value > 0)
  const allStreams = [
    { label: 'Creator Fund', value: creatorFundRevenue },
    { label: 'Brand Deals', value: brandDealRevenue },
    { label: 'LIVE Gifts', value: liveGiftRevenue },
  ];

  const activeStreams = allStreams.filter((s) => s.value > 0);
  const breakdown = activeStreams.map((s) => ({
    label: s.label,
    value: s.value,
    percentage: totalMonthly > 0 ? (s.value / totalMonthly) * 100 : 0,
  }));

  // Growth projection (12 months)
  const growthProjection = Array.from({ length: 12 }, (_, i) => {
    const growthMultiplier = Math.pow(1 + inputs.monthlyGrowthRate / 100, i);
    return {
      month: i + 1,
      earnings: totalMonthly * growthMultiplier,
    };
  });

  return {
    monthlyViews,
    creatorFundRevenue,
    brandDealRevenue,
    liveGiftRevenue,
    totalMonthly,
    totalAnnual,
    perVideo,
    breakdown,
    growthProjection,
  };
}
