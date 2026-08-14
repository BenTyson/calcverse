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
  // Every entry's `url` is a TODO(ben) placeholder ('#') until the program is
  // actually enrolled. AffiliateGrid treats '#'/empty/missing as "render
  // nothing" — see isAffiliateLive() below. Never paste a tracking link here
  // that wasn't obtained by actually enrolling in the program.
  affiliates: {
    quickbooks: {
      url: '#', // TODO(ben): enroll in QuickBooks ProAdvisor / Intuit affiliate program
      label: 'QuickBooks Self-Employed',
      description: 'Track expenses, maximize deductions, and estimate quarterly taxes automatically.',
    },
    freshbooks: {
      url: '#', // TODO(ben): enroll in FreshBooks Partner program — https://www.freshbooks.com/partners/affiliate
      label: 'FreshBooks',
      description: 'Simple invoicing and expense tracking built for freelancers and contractors.',
    },
    tubeBuddy: {
      url: '#', // TODO(ben): enroll in TubeBuddy Partner program
      label: 'TubeBuddy',
      description: 'Grow your YouTube channel with keyword research, A/B testing, and SEO tools.',
    },
    // --- Researched 2026-08-13. Signup URLs below were loaded and confirmed
    // this session; none are tracking links yet — apply, then paste the real
    // affiliate/tracking URL Intuit/beehiiv/etc. issue you over the '#'.
    beehiiv: {
      url: '#', // TODO(ben): apply at https://app.beehiiv.com/partner_program (up to 50-60% commission, 12 months, 60-day cookie)
      label: 'beehiiv',
      description: 'Publish and monetize a newsletter with built-in ads, subscriptions, and referral tools.',
    },
    keeper: {
      url: '#', // TODO(ben): apply at https://keepertax.hasoffers.com/signup (via https://www.keepertax.com/become-an-affiliate — up to $50/referral, 30-day cookie)
      label: 'Keeper',
      description: 'AI-powered tax app that finds write-offs and files your 1099 taxes for you.',
    },
    honeybook: {
      url: '#', // TODO(ben): apply at https://forms.gle/L5XMJGtSKuQuns7FA (via https://www.honeybook.com/lp/affiliates — $50/qualified referral, paid at 100 days)
      label: 'HoneyBook',
      description: 'Client management, invoicing, and contracts for service-based freelancers.',
    },
    bonsai: {
      url: '#', // TODO(ben): apply at https://hellobonsai.firstpromoter.com/ (via https://www.hellobonsai.com/affiliates — 60-day cookie)
      label: 'Bonsai',
      description: 'Contracts, proposals, invoicing, and time tracking built for independent consultants.',
    },
    turbotax: {
      url: '#', // TODO(ben): apply via CJ Affiliate — https://signup.cj.com/member/brandedPublisherSignUp.do?air_refmerchantid=1905878 (via https://turbotax.intuit.com/corp/affiliates.jsp)
      label: 'TurboTax Self-Employed',
      description: 'File self-employment taxes with guided support for 1099 income and deductions.',
    },
    podia: {
      url: '#', // TODO(ben): apply at https://podia.typeform.com/affiliate-apply (via https://affiliates.podia.com/ — 20% commission, capped 12 months, 31-day cookie)
      label: 'Podia',
      description: 'Sell courses, memberships, and digital downloads directly to your audience.',
    },
    turo: {
      url: '#', // TODO(ben): apply via FlexOffers — https://www.flexoffers.com/affiliate-programs/turo-affiliate-program/ ($6-$36 per action, 30-day cookie)
      label: 'Turo',
      description: "List your car on Turo's peer-to-peer marketplace and earn from every trip.",
    },
    printful: {
      url: '#', // TODO(ben): apply at https://www.printful.com/affiliates (10% commission for 12 months, $25 min payout)
      label: 'Printful',
      description: 'Print-on-demand fulfillment for merch, no inventory required.',
    },
    // etsyAds removed 2026-08-13: Etsy discontinued its affiliate program.
    // Replaced by `printful` for POD/merch calculators.
  },
  // Maps calculator slug (the part after /[category]/) to 1–3 partner keys
  // from `affiliates` above, ordered by relevance (first = shown as
  // "Recommended"). Used by AffiliateGrid to surface contextually relevant
  // partners per calculator. A calculator with no entry (or no live partner
  // in its entry) simply renders no affiliate card — that's expected for
  // most personal-finance calculators until a verified brokerage/HYSA
  // program is enrolled (see docs/ben.md).
  //
  // Traffic-weighted priority (Umami, all-time since 2026-03-14): Ko-fi,
  // Patreon, Gumroad, and Substack alone are ~38% of site pageviews — that's
  // why creator-commerce partners (podia, beehiiv, printful) appear ahead of
  // the freelance/tax cluster despite the latter having more calculators.
  calculatorAffiliates: {
    // Creator — highest traffic on the site
    'kofi-calculator': ['podia', 'beehiiv'],
    'patreon-calculator': ['podia', 'beehiiv'],
    'gumroad-calculator': ['podia', 'printful'],
    'substack-calculator': ['beehiiv'],
    'newsletter-revenue-calculator': ['beehiiv'],
    'print-on-demand-profit-calculator': ['printful'],
    'online-course-revenue-calculator': ['podia'],
    'sponsorship-rate-calculator': ['beehiiv'],
    'youtube-adsense-calculator': ['tubeBuddy'],
    'etsy-fee-calculator': ['printful'],
    // tiktok, twitch, podcast: no verified partner relevant enough to list —
    // see report.
    // Gig
    'turo-calculator': ['turo'],
    'doordash-calculator': ['keeper'],
    'uber-lyft-calculator': ['keeper'],
    'instacart-calculator': ['keeper'],
    'amazon-flex-calculator': ['keeper'],
    'taskrabbit-calculator': ['keeper'],
    'airbnb-calculator': ['quickbooks'],
    // Freelance
    'quarterly-tax-calculator': ['keeper', 'turbotax', 'quickbooks'],
    'self-employment-tax-calculator': ['keeper', 'turbotax'],
    'w2-vs-1099-calculator': ['keeper', 'freshbooks'],
    'hourly-rate-calculator': ['honeybook', 'bonsai'],
    'project-rate-calculator': ['honeybook', 'bonsai'],
    'consulting-fee-calculator': ['honeybook', 'bonsai'],
    'value-based-pricing-calculator': ['bonsai'],
    'meeting-cost-calculator': ['honeybook'],
    'freelance-retirement-calculator': ['quickbooks'],
    'break-even-calculator': ['quickbooks', 'freshbooks'],
    // freelance-vacation: no relevant partner — skipped.
    // Side Hustle
    'dropshipping-margin-calculator': ['printful', 'quickbooks'],
    'reselling-profit-calculator': ['printful'],
    'freelance-writing-rate-calculator': ['bonsai', 'honeybook'],
    'tutoring-income-calculator': ['honeybook'],
    'profit-margin-calculator': ['quickbooks', 'freshbooks'],
    // time-to-goal: no relevant partner — skipped.
    // Personal Finance: no verified brokerage/HYSA affiliate program yet —
    // all 8 calculators intentionally unmapped. See report.
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

export interface ResolvedAffiliate {
  key: AffiliateKey;
  label: string;
  description: string;
  url: string;
}

/** True only when a partner has a real (non-placeholder) tracking URL. */
export function isAffiliateLive(key: string): boolean {
  const partner = (MONETIZATION.affiliates as Record<string, { url: string }>)[key];
  return Boolean(partner && partner.url && partner.url !== '#');
}

/**
 * Resolves a calculator slug to its live affiliate partners (1–3, ordered
 * by relevance). Partners whose `url` is still the '#' placeholder are
 * filtered out — this is the single choke point that guarantees a dead
 * link can never render. See AffiliateGrid.astro, the only consumer.
 */
export function getAffiliatesForCalculator(slug: string): ResolvedAffiliate[] {
  const keys = (MONETIZATION.calculatorAffiliates as Record<string, string[]>)[slug] ?? [];
  return keys
    .filter(isAffiliateLive)
    .map((key) => {
      const partner = (MONETIZATION.affiliates as Record<string, { url: string; label: string; description: string }>)[key];
      return { key: key as AffiliateKey, label: partner.label, description: partner.description, url: partner.url };
    });
}
