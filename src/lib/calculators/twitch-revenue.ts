// Twitch Revenue Calculator
// Estimate Twitch streamer earnings from subs, bits, and ads

export interface TwitchRevenueInputs {
  // Quick mode
  averageViewers: number;
  subscriberCount: number;

  // Advanced mode
  streamHoursPerWeek: number;
  tier1Subs: number;
  tier2Subs: number;
  tier3Subs: number;
  bitsPerMonth: number;
  adRevenuePerHour: number; // CPM-based estimate
  sponsorshipRevenue: number;
  twitchCut: number; // Twitch's percentage (usually 50%, but Partners may negotiate)
}

export interface TwitchRevenueResults {
  subscriptionRevenue: {
    tier1: number;
    tier2: number;
    tier3: number;
    total: number;
  };
  bitsRevenue: number;
  adRevenue: number;
  sponsorshipRevenue: number;
  grossMonthly: number;
  twitchFees: number;
  netMonthly: number;
  netAnnual: number;
  revenuePerViewer: number;
  breakdown: {
    label: string;
    value: number;
    percentage: number;
  }[];
}

// Twitch subscription prices (USD)
const SUB_PRICES = {
  tier1: 4.99,
  tier2: 9.99,
  tier3: 24.99,
};

// Bits value (1000 bits = $10, but streamer gets $0.01 per bit)
const BITS_VALUE = 0.01;

export function calculateTwitchRevenue(inputs: TwitchRevenueInputs): TwitchRevenueResults {
  const streamerCut = (100 - inputs.twitchCut) / 100;

  // Calculate subscription revenue (before Twitch cut)
  const tier1Gross = inputs.tier1Subs * SUB_PRICES.tier1;
  const tier2Gross = inputs.tier2Subs * SUB_PRICES.tier2;
  const tier3Gross = inputs.tier3Subs * SUB_PRICES.tier3;
  const totalSubsGross = tier1Gross + tier2Gross + tier3Gross;

  // Streamer's cut of subscriptions
  const tier1Revenue = tier1Gross * streamerCut;
  const tier2Revenue = tier2Gross * streamerCut;
  const tier3Revenue = tier3Gross * streamerCut;
  const totalSubsRevenue = tier1Revenue + tier2Revenue + tier3Revenue;

  // Bits revenue (streamer gets 100% of bits value)
  const bitsRevenue = inputs.bitsPerMonth * BITS_VALUE;

  // Ad revenue (monthly estimate based on hours streamed)
  const monthlyStreamHours = inputs.streamHoursPerWeek * 4.33; // Average weeks per month
  const adRevenue = monthlyStreamHours * inputs.adRevenuePerHour;

  // Sponsorships (100% to streamer, already net)
  const sponsorshipRevenue = inputs.sponsorshipRevenue;

  // Calculate totals
  const grossMonthly = totalSubsGross + bitsRevenue + adRevenue + sponsorshipRevenue;
  const twitchFees = totalSubsGross - totalSubsRevenue; // Only subs have Twitch cut
  const netMonthly = totalSubsRevenue + bitsRevenue + adRevenue + sponsorshipRevenue;
  const netAnnual = netMonthly * 12;

  // Revenue per average viewer
  const revenuePerViewer = inputs.averageViewers > 0 ? netMonthly / inputs.averageViewers : 0;

  // Revenue breakdown for visualization
  const breakdown = [
    { label: 'Subscriptions', value: totalSubsRevenue, percentage: (totalSubsRevenue / netMonthly) * 100 || 0 },
    { label: 'Bits', value: bitsRevenue, percentage: (bitsRevenue / netMonthly) * 100 || 0 },
    { label: 'Ads', value: adRevenue, percentage: (adRevenue / netMonthly) * 100 || 0 },
    { label: 'Sponsorships', value: sponsorshipRevenue, percentage: (sponsorshipRevenue / netMonthly) * 100 || 0 },
  ].filter(item => item.value > 0);

  return {
    subscriptionRevenue: {
      tier1: tier1Revenue,
      tier2: tier2Revenue,
      tier3: tier3Revenue,
      total: totalSubsRevenue,
    },
    bitsRevenue,
    adRevenue,
    sponsorshipRevenue,
    grossMonthly,
    twitchFees,
    netMonthly,
    netAnnual,
    revenuePerViewer,
    breakdown,
  };
}

export const DEFAULT_INPUTS: TwitchRevenueInputs = {
  averageViewers: 100,
  subscriberCount: 50,
  streamHoursPerWeek: 20,
  tier1Subs: 45, // 90% of subs
  tier2Subs: 4,  // 8% of subs
  tier3Subs: 1,  // 2% of subs
  bitsPerMonth: 5000,
  adRevenuePerHour: 3.50, // Typical CPM for small streamers
  sponsorshipRevenue: 0,
  twitchCut: 50, // Standard 50/50 split
};

export const QUICK_MODE_DEFAULTS: Partial<TwitchRevenueInputs> = {
  streamHoursPerWeek: 20,
  tier2Subs: 0,
  tier3Subs: 0,
  bitsPerMonth: 2500,
  adRevenuePerHour: 3.50,
  sponsorshipRevenue: 0,
  twitchCut: 50,
};

// Helper to distribute subscribers across tiers
export function distributeSubs(totalSubs: number): { tier1: number; tier2: number; tier3: number } {
  return {
    tier1: Math.round(totalSubs * 0.90), // 90% Tier 1
    tier2: Math.round(totalSubs * 0.08), // 8% Tier 2
    tier3: Math.round(totalSubs * 0.02), // 2% Tier 3
  };
}
