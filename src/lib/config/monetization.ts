export const MONETIZATION = {
  adsense: {
    // Single source of truth for the AdSense client ID. Consumed by
    // BaseLayout (loader script + google-adsense-account meta tag) and by
    // AdSlot. Must stay in sync with the pub- line in `public/ads.txt`.
    publisherId: 'ca-pub-3941293108914142',

    // Ad unit IDs (the `data-ad-slot` value) keyed by the slot name passed to
    // <AdSlot slot="..." />. Get each one from the AdSense dashboard:
    // Ads → By ad unit → Display ads → create the unit → copy the numeric
    // `data-ad-slot` value out of the generated snippet.
    //
    // An empty string means that slot renders NOTHING at all — no container,
    // no label, no reserved space. Never ship a placeholder box.
    adUnits: {
      'calculator-mid': '', // TODO(ben): paste the leaderboard unit ID (728x90 responsive)
      'calculator-bottom': '', // TODO(ben): paste the rectangle unit ID (336x280)
      'blog-content': '', // TODO(ben): paste the leaderboard unit ID (728x90 responsive)
    },
    // Auto Ads are deliberately OFF: they inject into calculator input UI and
    // destroy conversion. Manual units in the three reserved slots only.
  },
  affiliates: {
    quickbooks: { url: '#', label: 'QuickBooks Self-Employed' }, // TODO: enroll in QuickBooks ProAdvisor / Intuit affiliate program
    freshbooks: { url: '#', label: 'FreshBooks' }, // TODO: enroll in FreshBooks Partner program
    tubeBuddy: { url: '#', label: 'TubeBuddy' }, // TODO: enroll in TubeBuddy Partner program
    etsyAds: { url: '#', label: 'Etsy Ads' }, // TODO: Etsy discontinued affiliates; swap for Printify/Printful/Creative Market
  },
  // Maps calculator slug (the part after /[category]/) to 1–3 partner keys
  // from `affiliates` above. Used by CalculatorLayout to surface contextually
  // relevant partners per calculator. Expands further in R2 once additional
  // partner programs (TurboTax, Betterment, SoFi, HoneyBook, etc.) are enrolled.
  calculatorAffiliates: {
    // Freelance
    'quarterly-tax-calculator': ['quickbooks', 'freshbooks'],
    'w2-vs-1099-calculator': ['freshbooks', 'quickbooks'],
    'self-employment-tax-calculator': ['quickbooks', 'freshbooks'],
    'hourly-rate-calculator': ['freshbooks', 'quickbooks'],
    'project-rate-calculator': ['freshbooks', 'quickbooks'],
    'consulting-fee-calculator': ['freshbooks', 'quickbooks'],
    'value-based-pricing-calculator': ['freshbooks'],
    'freelance-retirement-calculator': ['quickbooks'],
    'meeting-cost-calculator': ['freshbooks'],
    'freelance-vacation-calculator': ['freshbooks'],
    'break-even-calculator': ['freshbooks', 'quickbooks'],
    // Creator
    'youtube-adsense-calculator': ['tubeBuddy'],
    'etsy-fee-calculator': ['etsyAds'],
    'sponsorship-rate-calculator': ['tubeBuddy'],
    'tiktok-calculator': ['tubeBuddy'],
    'twitch-calculator': ['tubeBuddy'],
    'podcast-calculator': ['tubeBuddy'],
    'newsletter-revenue-calculator': ['tubeBuddy'],
    'online-course-revenue-calculator': ['tubeBuddy'],
    'patreon-calculator': ['tubeBuddy'],
    'substack-calculator': ['tubeBuddy'],
    'kofi-calculator': ['tubeBuddy'],
    'gumroad-calculator': ['tubeBuddy', 'etsyAds'],
    'print-on-demand-profit-calculator': ['etsyAds', 'tubeBuddy'],
    // Side Hustle
    'profit-margin-calculator': ['quickbooks', 'freshbooks'],
    'freelance-writing-rate-calculator': ['freshbooks'],
    'dropshipping-margin-calculator': ['quickbooks'],
    'reselling-profit-calculator': ['etsyAds'],
  } satisfies Record<string, string[]>,
} as const;

export type AffiliateKey = keyof typeof MONETIZATION.affiliates;

export type AdSlotName = keyof typeof MONETIZATION.adsense.adUnits;

/** Ad unit ID for a slot, or '' when it hasn't been created in AdSense yet. */
export function getAdUnitId(slot: string): string {
  return (MONETIZATION.adsense.adUnits as Record<string, string>)[slot] ?? '';
}

/**
 * True only when both the publisher ID and this slot's unit ID are set.
 * Callers use this to skip the surrounding spacing wrapper entirely, so an
 * unconfigured slot leaves no empty gap on the page.
 */
export function isAdSlotEnabled(slot: string): boolean {
  return Boolean(MONETIZATION.adsense.publisherId && getAdUnitId(slot));
}
