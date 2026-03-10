# CalcFalcon — Current Status

**Last Updated:** 2026-03-09
**Domain:** calcfalcon.com
**Hosting:** Railway (auto-deploy from main)

## What's Live

**20 calculators** across **5 categories**, **59 routes** (38 indexable + 20 embeds + 1 SSR API endpoint)

### Freelance (4) — Cyan
| Calculator | Slug |
|-----------|------|
| Freelancer Hourly Rate | `/freelance/hourly-rate-calculator` |
| Quarterly Tax Estimator | `/freelance/quarterly-tax-calculator` |
| W2 vs 1099 Comparison | `/freelance/w2-vs-1099-calculator` |
| Project Rate Calculator | `/freelance/project-rate-calculator` |

### Creator (7) — Magenta
| Calculator | Slug |
|-----------|------|
| YouTube AdSense Revenue | `/creator/youtube-adsense-calculator` |
| Twitch Revenue | `/creator/twitch-calculator` |
| Podcast Sponsorship | `/creator/podcast-calculator` |
| Patreon Earnings | `/creator/patreon-calculator` |
| Ko-fi Earnings | `/creator/kofi-calculator` |
| Etsy Fee Calculator | `/creator/etsy-fee-calculator` |
| Substack Revenue | `/creator/substack-calculator` |

### Gig Economy (4) — Emerald
| Calculator | Slug |
|-----------|------|
| DoorDash Earnings | `/gig-economy/doordash-calculator` |
| Uber/Lyft Driver Earnings | `/gig-economy/uber-lyft-calculator` |
| Instacart Shopper | `/gig-economy/instacart-calculator` |
| Airbnb Profit | `/gig-economy/airbnb-calculator` |

### Side Hustle (1) — Purple
| Calculator | Slug |
|-----------|------|
| Side Hustle Time to Goal | `/side-hustle/time-to-goal-calculator` |

### Personal Finance (4) — Amber
| Calculator | Slug |
|-----------|------|
| FIRE Calculator | `/personal-finance/fire-calculator` |
| Emergency Fund | `/personal-finance/emergency-fund-calculator` |
| Rent vs Buy | `/personal-finance/rent-vs-buy-calculator` |
| Subscription Audit | `/personal-finance/subscription-audit-calculator` |

## Other Pages
- Homepage (`/`)
- 5 category index pages (with intro paragraphs + FAQ structured data)
- Blog index (`/blog`) + 8 pillar articles
- About page (`/about`)
- Privacy Policy (`/privacy`) — includes email, advertising, affiliate disclosures
- Terms of Service (`/terms`)
- 404 page
- API: `/api/subscribe` (SSR endpoint for email capture via Resend)

## What's Done

### Phase 1 — Tech Debt & Rebrand
- [x] Full rebrand: Calcverse → CalcFalcon
- [x] Domain migration to calcfalcon.com (in code — DNS/Railway config is manual)
- [x] Fixed all `text-brand-*` / `bg-brand-*` → `primary-*` (5 instances)
- [x] All 16 calculator pages: `client:load` → `client:visible`
- [x] ErrorBoundary wired into all 16 calculator `.tsx` files
- [x] Accessibility: skip-to-content, aria-describedby on inputs, aria-valuetext on sliders, radiogroup on ModeToggle
- [x] Privacy/Terms dates updated to March 2026
- [x] Favicon updated (brand gradient)
- [x] OG images updated (default + 3 calculator-specific)
- [x] robots.txt with calcfalcon.com sitemap URL
- [x] Hero section redesigned (dark bg, real copy)
- [x] Homepage copy rewritten
- [x] Footer expanded to 6 calculators
- [x] Custom 404 page

### Phase 2a — Chart Components
- [x] Installed Recharts
- [x] `DonutChart.tsx` — pie/donut with inner label, category colors, legend
- [x] `BarComparisonChart.tsx` — side-by-side or stacked bars, custom tooltip
- [x] `ProjectionChart.tsx` — area/line chart with goal line support
- [x] `ChartCard.tsx` — wrapper card with title/description
- [x] `chart-colors.ts` — category-aware color palette utility

### Phase 2b — Chart Integration (7 calculators)
- [x] FreelancerRateCalc — Donut (tax/expense/profit breakdown)
- [x] EtsyFeesCalc — Donut (fee breakdown)
- [x] KofiCalc — Donut (replaced old stacked bar with DonutChart)
- [x] QuarterlyTaxCalc — Stacked bar (quarterly payment schedule)
- [x] W2vs1099Calc — Side-by-side bar (gross/taxes/net comparison)
- [x] YouTubeAdSenseCalc — Side-by-side bar (low/mid/high earnings)
- [x] SideHustleGoalCalc — Projection chart (cumulative earnings + goal line)

### Phase 2c — Result Enhancements
- [x] `CopyResultsButton.tsx` — clipboard copy with Lucide Copy/Check icons, category-aware styling
- [x] `useCountUp.ts` hook — rAF count-up animation (ease-out, 600ms), respects `prefers-reduced-motion`
- [x] `Tooltip.tsx` — accessible hover/focus tooltip with `aria-describedby`, keyboard-focusable
- [x] `ResultCard` — added optional `numericValue`/`formatFn` props for opt-in count-up (backward-compatible)
- [x] `ResultBreakdown` — changed `label` type from `string` to `React.ReactNode` (backward-compatible)
- [x] All 16 calculators: CopyResultsButton integrated at top of results
- [x] All 16 calculators: count-up animation on primary highlighted ResultCard
- [x] Tooltips on 13 calculators for financial jargon (SE tax, FICA, CPM, RPM, etc.)
- [x] Installed `lucide-react` dependency

### Phase 3 — Content System & SEO Depth
- [x] Installed `@tailwindcss/typography` — `prose` classes active
- [x] Content Collections config (`src/content.config.ts`) with `glob` loader
- [x] `ArticleSEO` interface + `generateArticleSchema()` in schema.ts
- [x] `ogType` prop added to BaseLayout (default "website", blog uses "article")
- [x] `BlogLayout.astro` — breadcrumbs, article header, category badge, read time, calculator CTA
- [x] SchemaOrg.astro updated with `article` prop
- [x] Blog listing page (`/blog`) + article page (`/blog/[slug]`)
- [x] Header: Blog link added (desktop + mobile)
- [x] Footer: Blog + About links added
- [x] About page (`/about`)
- [x] 8 pillar articles: freelance rate, W2 vs 1099, YouTube CPM, DoorDash earnings, Twitch revenue, Etsy fees, quarterly taxes, side hustle taxes
- [x] "How to Use" content sections in all 16 calculator pages (`<Fragment slot="content">`)
- [x] `relatedCalculators` expanded to 3-4 cross-category links in all 16 calculators
- [x] 4 category index pages enhanced with intro paragraphs + FAQ sections + FAQ structured data

### Phase 4 — Monetization Infrastructure
- [x] `@astrojs/node` adapter for hybrid SSG/SSR
- [x] `AdSlot.astro` — CLS-safe ad placeholders (leaderboard 728x90, rectangle 336x280)
- [x] Ad slots in CalculatorLayout (mid + bottom) and BlogLayout (after content)
- [x] `EmailCapture.tsx` — React form with inline/compact variants, dark mode
- [x] `/api/subscribe` — SSR endpoint using Resend API
- [x] Email capture in CalculatorLayout, BlogLayout, and Footer
- [x] Lead magnet: placeholder PDF at `/downloads/freelancer-tax-cheatsheet.pdf`
- [x] `monetization.ts` — central config for affiliate URLs + AdSense publisher ID
- [x] `AffiliateCard.astro` + `AffiliateDisclosure.astro` — partner cards with `rel="nofollow sponsored"`
- [x] 4 calculator pages with affiliate products: QuarterlyTax→QuickBooks, W2vs1099→FreshBooks, YouTube→TubeBuddy, Etsy→EtsyAds
- [x] Conditional AdSense verification meta tag in BaseLayout
- [x] Privacy page updated with email, advertising, and affiliate sections
- [x] `docs/ben.md` — manual tasks tracker

### Phase 5a — Personal Finance Category
- [x] FIRE Calculator — ProjectionChart with goal line, Coast FIRE (advanced), on-track indicator
- [x] Emergency Fund — BarComparisonChart, income stability multiplier, dependents/partner income (advanced)
- [x] Rent vs Buy — ProjectionChart with two lines (rent vs buy net cost), break-even year
- [x] Subscription Audit — DonutChart, dynamic add/remove rows, priority categorization (advanced), Lucide Plus/X icons
- [x] `personal-finance/index.astro` category page with FAQs
- [x] Header nav updated with Personal Finance link
- [x] Homepage: removed "Coming Soon", added count: 4, updated counters to 20
- [x] Embed routes: all 4 calculators added
- [x] CalculatorLayout: `personal-finance` category color mapping added

## What's NOT Done

- No analytics (decision: Umami self-hosted)
- No custom domain configured (DNS + Railway — manual step)
- No Google Search Console submission
- Resend API key not configured (manual: see `docs/ben.md`)
- Affiliate URLs are placeholders (`#`)
- AdSense publisher ID not set (pending approval)
- Placeholder PDF needs real content
- Only 4 of 20 calculators have custom OG images (SVG)
- SVG OG images may not render on all social platforms (PNG preferred)

## Known Pre-existing TS Warnings

These are non-blocking (build passes) but exist in the codebase:
- `getInitialState` returns `Record<string, unknown>` — doesn't match specific input types
- Some calculators pass `suffix` prop to `SliderInput` which doesn't exist in the type
- Some calculators use `highlighted` prop instead of `highlight` on `ResultCard`/`ResultBreakdown`
- `formatCompactNumber` imported but unused in YouTubeAdSenseCalc
