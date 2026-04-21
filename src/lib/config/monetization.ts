export const MONETIZATION = {
  adsense: {
    publisherId: '', // Fill when approved: 'ca-pub-XXXXXXXX'
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
