# CalcFalcon — Current Status

**Last Updated:** 2026-03-14 (Phase B3 complete)
**Domain:** calcfalcon.com
**Hosting:** Railway (auto-deploy from main)

## What's Live

**37 calculators** across **5 categories**, **110 routes** (73 indexable + 37 embeds + 1 SSR API endpoint)

### Freelance (8) — Cyan
| Calculator | Slug |
|-----------|------|
| Freelancer Hourly Rate | `/freelance/hourly-rate-calculator` |
| Quarterly Tax Estimator | `/freelance/quarterly-tax-calculator` |
| W2 vs 1099 Comparison | `/freelance/w2-vs-1099-calculator` |
| Project Rate Calculator | `/freelance/project-rate-calculator` |
| Freelance Retirement | `/freelance/freelance-retirement-calculator` |
| Meeting Cost | `/freelance/meeting-cost-calculator` |
| Freelance Vacation Fund | `/freelance/freelance-vacation-calculator` |
| Value-Based Pricing | `/freelance/value-based-pricing-calculator` |

### Creator (13) — Magenta
| Calculator | Slug |
|-----------|------|
| YouTube AdSense Revenue | `/creator/youtube-adsense-calculator` |
| Twitch Revenue | `/creator/twitch-calculator` |
| Podcast Sponsorship | `/creator/podcast-calculator` |
| Patreon Earnings | `/creator/patreon-calculator` |
| Ko-fi Earnings | `/creator/kofi-calculator` |
| Etsy Fee Calculator | `/creator/etsy-fee-calculator` |
| Substack Revenue | `/creator/substack-calculator` |
| TikTok Earnings | `/creator/tiktok-calculator` |
| Gumroad Revenue | `/creator/gumroad-calculator` |
| Sponsorship Rate | `/creator/sponsorship-rate-calculator` |
| Print-on-Demand Profit | `/creator/print-on-demand-profit-calculator` |
| Online Course Revenue | `/creator/online-course-revenue-calculator` |
| Newsletter Revenue | `/creator/newsletter-revenue-calculator` |

### Gig Economy (7) — Emerald
| Calculator | Slug |
|-----------|------|
| DoorDash Earnings | `/gig-economy/doordash-calculator` |
| Uber/Lyft Driver Earnings | `/gig-economy/uber-lyft-calculator` |
| Instacart Shopper | `/gig-economy/instacart-calculator` |
| Airbnb Profit | `/gig-economy/airbnb-calculator` |
| Amazon Flex Earnings | `/gig-economy/amazon-flex-calculator` |
| TaskRabbit Earnings | `/gig-economy/taskrabbit-calculator` |
| Turo Profit | `/gig-economy/turo-calculator` |

### Side Hustle (5) — Purple
| Calculator | Slug |
|-----------|------|
| Side Hustle Time to Goal | `/side-hustle/time-to-goal-calculator` |
| Reselling Profit | `/side-hustle/reselling-profit-calculator` |
| Freelance Writing Rate | `/side-hustle/freelance-writing-rate-calculator` |
| Tutoring Income | `/side-hustle/tutoring-income-calculator` |
| Dropshipping Margin | `/side-hustle/dropshipping-margin-calculator` |

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
- Blog index (`/blog`) + 24 articles (8 pillar + 6 Phase B1 + 5 Phase B2 + 5 Phase B3)
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

### Phase B1 — Blog: High-Volume Deep-Dives (6 posts)
- [x] TikTok Creator Earnings — Creator Fund RPM, brand deals, LIVE gifts, earnings tiers
- [x] Uber/Lyft Driver Earnings — Gross vs net, gas/depreciation/IRS mileage, market variance
- [x] Patreon Fees and Earnings — Fee tiers, payment processing, churn math, tier strategy
- [x] Airbnb Hosting Profit — Fee breakdown, occupancy benchmarks, break-even, tax implications
- [x] FIRE Calculator Guide — 4% rule, Coast/Lean/Fat FIRE, savings rate, freelancer strategies
- [x] Rent vs Buy 2026 — Break-even timeline, opportunity cost, when renting wins
- [x] Backlinks added to 6 existing posts (Twitch, DoorDash, Side Hustle Taxes, YouTube, Etsy, Freelance Rate)
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

### Phase 5b — Gig Economy Expansion
- [x] Amazon Flex Earnings — block-based delivery calc with gas, maintenance, IRS mileage tip
- [x] TaskRabbit Earnings — service fee, travel time/cost, supplies, DropdownInput for task category
- [x] Turo Profit — monthly rental scope, break-even days, profit margin, protection plan trade-offs
- [x] Embed routes: all 3 calculators added
- [x] Gig Economy index: 7 calculators, removed Coming Soon section
- [x] Homepage: updated counts to 23 calculators, 7 gig economy
- [x] Cross-links: DoorDash→Amazon Flex, Airbnb→Turo, Instacart→Amazon Flex

### Phase 5c — Creator Expansion
- [x] TikTok Earnings — Creator Fund RPM, brand deals, LIVE gifts, DonutChart (multi-stream), growth projection (advanced)
- [x] Gumroad Revenue — flat 10% fee, memberships, affiliates, refunds, email list potential, DonutChart (products+memberships)
- [x] Embed routes: both calculators added
- [x] Creator index: 9 calculators, Gumroad removed from Coming Soon
- [x] Homepage: updated counts to 25 calculators, 9 creator
- [x] Cross-links: YouTube→TikTok, Patreon→TikTok, Etsy→Gumroad

### Phase 5d-5e — OG Images & Homepage Polish
- [x] Custom SVG OG images for all 25 calculators with platform icons (Simple Icons) and category-colored backgrounds
- [x] Updated default.svg counts (25 calculators across 5 categories)
- [x] `ogImage` prop wired into all 25 calculator `.astro` pages
- [x] Homepage featured calculators refreshed for 5-category representation (Freelance, Creator x2, Gig, Finance x2)

### Phase 7 — Side Hustle Buildout
- [x] Reselling Profit — per-item fee breakdown, DonutChart, platform presets (eBay/Poshmark/Mercari/FB Marketplace)
- [x] Freelance Writing Rate — per-word and per-article rate, time breakdown, experience levels
- [x] Tutoring Income — weekly scope, platform presets (Independent/Wyzant/Varsity Tutors/Tutor.com), prep time
- [x] Dropshipping Margin — per-order + monthly projection, DonutChart, returns/refunds, ROAS, break-even
- [x] Embed routes: all 4 calculators added
- [x] Side Hustle index: 5 calculators, removed Coming Soon section
- [x] Homepage: updated counts to 29 calculators, 5 side hustle
- [x] Cross-links: Time to Goal→Reselling+Tutoring, Etsy→Reselling, Hourly Rate→Writing Rate

### Phase 8 — Freelance Business Essentials
- [x] Freelance Retirement — Solo 401(k) vs SEP-IRA vs IRA comparison, BarComparisonChart (account type max contributions)
- [x] Meeting Cost — True cost of meetings with prep/follow-up/recovery time, DonutChart (time breakdown)
- [x] Freelance Vacation Fund — Savings needed for unpaid time off, DonutChart (cost breakdown)
- [x] Value-Based Pricing — Price by client ROI vs hourly, BarComparisonChart (value vs hourly comparison)
- [x] Embed routes: all 4 calculators added
- [x] Freelance index: 8 calculators, removed Coming Soon section
- [x] Homepage: updated counts to 33 calculators, 8 freelance
- [x] Cross-links: Hourly Rate→Value-Based, W2vs1099→Retirement, FIRE→Retirement, Project Rate→Meeting Cost

### Phase 9 — Creator Economy Deepening
- [x] Sponsorship Rate — CPE/CPM-based rate estimation, niche/deliverable/exclusivity/usage/rush multipliers, BarComparisonChart (market range)
- [x] Print-on-Demand Profit — Printful/Printify/Merch by Amazon cost modeling, marketplace fees, DonutChart (cost breakdown)
- [x] Online Course Revenue — Teachable/Udemy/Skillshare/self-hosted fee modeling, multi-stream revenue, DonutChart (revenue sources)
- [x] Newsletter Revenue — Substack/Beehiiv/ConvertKit fees, subscription + sponsorship revenue, DonutChart, growth projections
- [x] Embed routes: all 4 calculators added
- [x] Creator index: 13 calculators, removed Coming Soon section
- [x] Homepage: updated counts to 37 calculators, 13 creator
- [x] OG images: all 4 new calculators with creator magenta backgrounds

### Phase B2 — Blog: Hub Posts & Strategy Guides (5 posts)
- [x] Freelance Pricing Strategies — hourly vs project vs value-based, links to project-rate + value-based-pricing calculators
- [x] Best Platforms for Selling Digital Products — Gumroad vs POD vs courses, links to gumroad + print-on-demand + online-course calculators
- [x] Gig Delivery Apps Compared — DoorDash vs Instacart vs Amazon Flex, links to instacart + amazon-flex calculators
- [x] Freelance Retirement Planning — Solo 401(k), SEP-IRA, IRA comparison, links to freelance-retirement calculator
- [x] Emergency Fund on Irregular Income — stability multipliers, savings strategies, links to emergency-fund calculator
- [x] All 5 posts use `calculatorSlugs` (array) frontmatter
- [x] Internal links to related existing blog posts in each article

### Phase B3 — Blog: Creator Economy Deep-Dives (5 posts)
- [x] Substack vs Beehiiv vs ConvertKit: Newsletter Revenue Compared — platform fee head-to-head, paid newsletter economics
- [x] How Much Do Podcasters Make From Sponsorships? (2026 Rates) — CPM rates by niche, download thresholds
- [x] Ko-fi vs Patreon vs Buy Me a Coffee: Which Pays Best? — fee comparison, one-time vs recurring models
- [x] How to Set Your Sponsorship Rate as a Creator — CPE vs CPM pricing, niche multipliers, negotiation
- [x] How Much Can You Make Selling Online Courses? — Teachable vs Udemy vs Skillshare economics
- [x] Internal cross-links added to 4 existing posts (Patreon, YouTube AdSense, TikTok, Digital Products)

## What's NOT Done

- No custom domain configured (DNS + Railway — manual step)
- No Google Search Console submission
- Resend API key not configured (manual: see `docs/ben.md`)
- Affiliate URLs are placeholders (`#`)
- AdSense publisher ID not set (pending approval)
- Placeholder PDF needs real content
- SVG OG images may not render on all social platforms (PNG preferred for maximum compatibility)

## Known Pre-existing TS Warnings

These are non-blocking (build passes) but exist in the codebase:
- Some calculators pass `suffix` prop to `SliderInput` which doesn't exist in the type
- Some calculators use `highlighted` prop instead of `highlight` on `ResultCard`/`ResultBreakdown`
- `formatCompactNumber` imported but unused in YouTubeAdSenseCalc
