// Sponsorship Rate Calculator
// Estimate what to charge for brand deals and sponsored content

export interface SponsorshipRateInputs {
  // Quick mode
  platform: string;
  followers: number;
  engagementRate: number;

  // Advanced mode
  niche: string;
  deliverableType: string;
  exclusivity: string;
  usageRights: string;
  numberOfDeliverables: number;
  turnaroundDays: number;
}

export interface SponsorshipRateResults {
  suggestedRate: number;
  packageTotal: number;
  effectiveCPM: number;
  lowRate: number;
  highRate: number;
  baseRate: number;
  nicheMultiplier: number;
  deliverableMultiplier: number;
  exclusivityMultiplier: number;
  usageMultiplier: number;
  rushMultiplier: number;
  perDeliverableRate: number;
  bulkDiscount: number;
}

// Platform CPE (cost per engagement) benchmarks
const PLATFORM_CPE: Record<string, number> = {
  instagram: 0.15,
  youtube: 0.08,
  tiktok: 0.04,
  twitter: 0.07,
  podcast: 0, // uses CPM
  newsletter: 0, // uses CPM
  blog: 0, // uses CPM
};

// CPM model for platforms without engagement-based pricing
const PLATFORM_CPM: Record<string, number> = {
  podcast: 25,
  newsletter: 30,
  blog: 20,
};

const NICHE_MULTIPLIERS: Record<string, number> = {
  finance: 1.5,
  tech: 1.3,
  beauty: 1.1,
  fitness: 1.0,
  lifestyle: 0.9,
  food: 0.95,
  travel: 1.0,
  gaming: 0.8,
};

const DELIVERABLE_MULTIPLIERS: Record<string, number> = {
  post: 1.0,
  story: 0.5,
  reel: 1.2,
  video: 1.5,
  integration: 2.0,
  dedicated: 3.0,
};

const EXCLUSIVITY_MULTIPLIERS: Record<string, number> = {
  none: 1.0,
  category: 1.25,
  full: 1.75,
};

const USAGE_MULTIPLIERS: Record<string, number> = {
  none: 1.0,
  'organic-repost': 1.15,
  'paid-ads': 1.5,
  perpetual: 2.0,
};

export function calculateSponsorshipRate(inputs: SponsorshipRateInputs): SponsorshipRateResults {
  const engagementDecimal = inputs.engagementRate / 100;
  const engagedAudience = inputs.followers * engagementDecimal;

  // Calculate base rate
  let baseRate: number;
  const cpe = PLATFORM_CPE[inputs.platform];

  if (cpe > 0) {
    // Engagement-based model
    baseRate = engagedAudience * cpe;
  } else {
    // CPM-based model
    const cpm = PLATFORM_CPM[inputs.platform] || 25;
    baseRate = (inputs.followers / 1000) * cpm;
  }

  // Apply multipliers
  const nicheMultiplier = NICHE_MULTIPLIERS[inputs.niche] || 1.0;
  const deliverableMultiplier = DELIVERABLE_MULTIPLIERS[inputs.deliverableType] || 1.0;
  const exclusivityMultiplier = EXCLUSIVITY_MULTIPLIERS[inputs.exclusivity] || 1.0;
  const usageMultiplier = USAGE_MULTIPLIERS[inputs.usageRights] || 1.0;

  // Rush premium: 1.5x if < 7 days turnaround
  const rushMultiplier = inputs.turnaroundDays < 7 ? 1.5 : 1.0;

  const suggestedRate = baseRate * nicheMultiplier * deliverableMultiplier * exclusivityMultiplier * usageMultiplier * rushMultiplier;

  // Bulk discount: 10% per additional unit
  const bulkDiscount = inputs.numberOfDeliverables > 1
    ? suggestedRate * 0.1 * (inputs.numberOfDeliverables - 1)
    : 0;

  const packageTotal = suggestedRate * inputs.numberOfDeliverables - bulkDiscount;
  const perDeliverableRate = inputs.numberOfDeliverables > 0
    ? packageTotal / inputs.numberOfDeliverables
    : suggestedRate;

  // Effective CPM
  const effectiveCPM = inputs.followers > 0
    ? (suggestedRate / inputs.followers) * 1000
    : 0;

  // Market range (low = 0.6x, high = 1.5x)
  const lowRate = suggestedRate * 0.6;
  const highRate = suggestedRate * 1.5;

  return {
    suggestedRate: Math.round(suggestedRate),
    packageTotal: Math.round(packageTotal),
    effectiveCPM: Math.round(effectiveCPM * 100) / 100,
    lowRate: Math.round(lowRate),
    highRate: Math.round(highRate),
    baseRate: Math.round(baseRate),
    nicheMultiplier,
    deliverableMultiplier,
    exclusivityMultiplier,
    usageMultiplier,
    rushMultiplier,
    perDeliverableRate: Math.round(perDeliverableRate),
    bulkDiscount: Math.round(bulkDiscount),
  };
}

export const DEFAULT_INPUTS: SponsorshipRateInputs = {
  platform: 'instagram',
  followers: 10000,
  engagementRate: 3,
  niche: 'lifestyle',
  deliverableType: 'post',
  exclusivity: 'none',
  usageRights: 'none',
  numberOfDeliverables: 1,
  turnaroundDays: 14,
};

export const QUICK_MODE_DEFAULTS: Partial<SponsorshipRateInputs> = {
  niche: 'lifestyle',
  deliverableType: 'post',
  exclusivity: 'none',
  usageRights: 'none',
  numberOfDeliverables: 1,
  turnaroundDays: 14,
};
