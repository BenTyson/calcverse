// Podcast Sponsorship Calculator
// Estimate podcast advertising and sponsorship revenue

export interface PodcastSponsorshipInputs {
  // Quick mode
  downloadsPerEpisode: number;
  episodesPerMonth: number;

  // Advanced mode
  cpmRate: number; // Cost per mille (1000 downloads)
  preRollSpots: number; // 15-30 sec at start
  midRollSpots: number; // 60 sec in middle (highest CPM)
  postRollSpots: number; // 15-30 sec at end
  fillRate: number; // Percentage of inventory sold (0-100)
  affiliateRevenue: number; // Monthly affiliate income
  premiumSubscribers: number; // Paid subscribers
  premiumPrice: number; // Monthly subscription price
}

export interface PodcastSponsorshipResults {
  monthlyDownloads: number;
  preRollRevenue: number;
  midRollRevenue: number;
  postRollRevenue: number;
  totalAdRevenue: number;
  affiliateRevenue: number;
  premiumRevenue: number;
  grossMonthly: number;
  netMonthly: number; // After typical network cut if applicable
  netAnnual: number;
  effectiveCPM: number;
  revenuePerDownload: number;
  breakdown: {
    label: string;
    value: number;
    percentage: number;
  }[];
}

// Industry standard CPM rates by ad position
const CPM_MULTIPLIERS = {
  preRoll: 0.7, // Pre-roll pays less
  midRoll: 1.0, // Mid-roll is the baseline
  postRoll: 0.5, // Post-roll pays least
};

export function calculatePodcastSponsorship(inputs: PodcastSponsorshipInputs): PodcastSponsorshipResults {
  const monthlyDownloads = inputs.downloadsPerEpisode * inputs.episodesPerMonth;

  // Calculate ad revenue by position
  // Revenue = (downloads / 1000) * CPM * spots * fill rate
  const fillRateDecimal = inputs.fillRate / 100;

  const preRollRevenue = (monthlyDownloads / 1000) * inputs.cpmRate * CPM_MULTIPLIERS.preRoll * inputs.preRollSpots * fillRateDecimal;
  const midRollRevenue = (monthlyDownloads / 1000) * inputs.cpmRate * CPM_MULTIPLIERS.midRoll * inputs.midRollSpots * fillRateDecimal;
  const postRollRevenue = (monthlyDownloads / 1000) * inputs.cpmRate * CPM_MULTIPLIERS.postRoll * inputs.postRollSpots * fillRateDecimal;

  const totalAdRevenue = preRollRevenue + midRollRevenue + postRollRevenue;

  // Affiliate revenue (passed through)
  const affiliateRevenue = inputs.affiliateRevenue;

  // Premium subscription revenue
  const premiumRevenue = inputs.premiumSubscribers * inputs.premiumPrice;

  const grossMonthly = totalAdRevenue + affiliateRevenue + premiumRevenue;

  // Net (assuming direct sponsors, no network cut)
  const netMonthly = grossMonthly;
  const netAnnual = netMonthly * 12;

  // Effective CPM (what you actually earn per 1000 downloads)
  const effectiveCPM = monthlyDownloads > 0 ? (totalAdRevenue / monthlyDownloads) * 1000 : 0;

  // Revenue per download
  const revenuePerDownload = monthlyDownloads > 0 ? grossMonthly / monthlyDownloads : 0;

  // Breakdown for visualization
  const breakdown = [
    { label: 'Mid-Roll Ads', value: midRollRevenue, percentage: grossMonthly > 0 ? (midRollRevenue / grossMonthly) * 100 : 0 },
    { label: 'Pre-Roll Ads', value: preRollRevenue, percentage: grossMonthly > 0 ? (preRollRevenue / grossMonthly) * 100 : 0 },
    { label: 'Post-Roll Ads', value: postRollRevenue, percentage: grossMonthly > 0 ? (postRollRevenue / grossMonthly) * 100 : 0 },
    { label: 'Affiliates', value: affiliateRevenue, percentage: grossMonthly > 0 ? (affiliateRevenue / grossMonthly) * 100 : 0 },
    { label: 'Premium Subs', value: premiumRevenue, percentage: grossMonthly > 0 ? (premiumRevenue / grossMonthly) * 100 : 0 },
  ].filter(item => item.value > 0);

  return {
    monthlyDownloads,
    preRollRevenue,
    midRollRevenue,
    postRollRevenue,
    totalAdRevenue,
    affiliateRevenue,
    premiumRevenue,
    grossMonthly,
    netMonthly,
    netAnnual,
    effectiveCPM,
    revenuePerDownload,
    breakdown,
  };
}

export const DEFAULT_INPUTS: PodcastSponsorshipInputs = {
  downloadsPerEpisode: 5000,
  episodesPerMonth: 4,
  cpmRate: 25, // $25 CPM is typical for mid-size podcasts
  preRollSpots: 1,
  midRollSpots: 2,
  postRollSpots: 1,
  fillRate: 70, // 70% of inventory sold
  affiliateRevenue: 200,
  premiumSubscribers: 0,
  premiumPrice: 5,
};

export const QUICK_MODE_DEFAULTS: Partial<PodcastSponsorshipInputs> = {
  cpmRate: 25,
  preRollSpots: 1,
  midRollSpots: 2,
  postRollSpots: 1,
  fillRate: 70,
  affiliateRevenue: 0,
  premiumSubscribers: 0,
  premiumPrice: 5,
};

// CPM benchmarks by niche
export const CPM_BENCHMARKS = [
  { niche: 'Business/Finance', cpm: '$40-60' },
  { niche: 'Technology', cpm: '$30-50' },
  { niche: 'Health/Wellness', cpm: '$25-40' },
  { niche: 'True Crime', cpm: '$20-35' },
  { niche: 'Comedy', cpm: '$18-30' },
  { niche: 'General Interest', cpm: '$15-25' },
];
