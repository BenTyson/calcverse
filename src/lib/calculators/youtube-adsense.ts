export const NICHE_CPMS: Record<string, { low: number; mid: number; high: number; label: string }> = {
  finance: { low: 8, mid: 15, high: 30, label: 'Finance & Investing' },
  tech: { low: 5, mid: 10, high: 20, label: 'Technology' },
  business: { low: 6, mid: 12, high: 25, label: 'Business & Marketing' },
  education: { low: 4, mid: 8, high: 15, label: 'Education' },
  howto: { low: 3, mid: 7, high: 14, label: 'How-To & DIY' },
  gaming: { low: 2, mid: 4, high: 8, label: 'Gaming' },
  entertainment: { low: 2, mid: 5, high: 10, label: 'Entertainment' },
  lifestyle: { low: 3, mid: 6, high: 12, label: 'Lifestyle & Vlogs' },
  health: { low: 5, mid: 10, high: 18, label: 'Health & Fitness' },
  general: { low: 2, mid: 5, high: 10, label: 'General Content' },
};

export const LOCATION_MULTIPLIERS: Record<string, { multiplier: number; label: string }> = {
  us: { multiplier: 1.5, label: 'United States' },
  uk: { multiplier: 1.3, label: 'United Kingdom' },
  canada: { multiplier: 1.2, label: 'Canada' },
  australia: { multiplier: 1.2, label: 'Australia' },
  europe: { multiplier: 1.0, label: 'Western Europe' },
  mixed: { multiplier: 0.7, label: 'Mixed Global' },
  global: { multiplier: 0.5, label: 'Developing Countries' },
};

export interface YouTubeAdSenseInputs {
  monthlyViews: number;
  niche: string;
  audienceLocation: string;
  averageViewDuration: number;
  uploadsPerMonth: number;
}

export interface YouTubeAdSenseResults {
  estimatedRPM: { low: number; mid: number; high: number };
  monthlyEarnings: { low: number; mid: number; high: number };
  annualEarnings: { low: number; mid: number; high: number };
  earningsPerVideo: { low: number; mid: number; high: number };
  effectiveCPM: { low: number; mid: number; high: number };
}

export const DEFAULT_INPUTS: YouTubeAdSenseInputs = {
  monthlyViews: 100000,
  niche: 'general',
  audienceLocation: 'mixed',
  averageViewDuration: 50,
  uploadsPerMonth: 8,
};

export function calculateYouTubeRevenue(
  inputs: YouTubeAdSenseInputs
): YouTubeAdSenseResults {
  // Get base CPM for niche
  const nicheCPM = NICHE_CPMS[inputs.niche] || NICHE_CPMS.general;
  const locationData = LOCATION_MULTIPLIERS[inputs.audienceLocation] || LOCATION_MULTIPLIERS.mixed;

  // Adjust for watch time (longer watch = more mid-roll ads possible)
  // Base assumption: 50% watch time is average
  const watchTimeMultiplier = Math.min(inputs.averageViewDuration / 50, 1.5);

  // Calculate monetized views (roughly 40-60% of views show ads)
  const monetizationRate = 0.5;
  const monetizedViews = inputs.monthlyViews * monetizationRate;

  // Calculate effective CPM (adjusted for location and watch time)
  const calculateEffectiveCPM = (baseCPM: number) =>
    baseCPM * locationData.multiplier * watchTimeMultiplier;

  const effectiveCPM = {
    low: calculateEffectiveCPM(nicheCPM.low),
    mid: calculateEffectiveCPM(nicheCPM.mid),
    high: calculateEffectiveCPM(nicheCPM.high),
  };

  // RPM = Revenue per 1000 views (after YouTube's 45% cut)
  const youtubeShare = 0.55; // Creator gets 55%
  const estimatedRPM = {
    low: effectiveCPM.low * youtubeShare,
    mid: effectiveCPM.mid * youtubeShare,
    high: effectiveCPM.high * youtubeShare,
  };

  // Calculate monthly earnings
  const calculateEarnings = (rpm: number) => (monetizedViews / 1000) * rpm;

  const monthlyEarnings = {
    low: calculateEarnings(estimatedRPM.low),
    mid: calculateEarnings(estimatedRPM.mid),
    high: calculateEarnings(estimatedRPM.high),
  };

  return {
    estimatedRPM,
    effectiveCPM,
    monthlyEarnings,
    annualEarnings: {
      low: monthlyEarnings.low * 12,
      mid: monthlyEarnings.mid * 12,
      high: monthlyEarnings.high * 12,
    },
    earningsPerVideo: {
      low: inputs.uploadsPerMonth > 0 ? monthlyEarnings.low / inputs.uploadsPerMonth : 0,
      mid: inputs.uploadsPerMonth > 0 ? monthlyEarnings.mid / inputs.uploadsPerMonth : 0,
      high: inputs.uploadsPerMonth > 0 ? monthlyEarnings.high / inputs.uploadsPerMonth : 0,
    },
  };
}
