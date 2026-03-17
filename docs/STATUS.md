# CalcFalcon — Current Status

**Last Updated:** 2026-03-17 (Phase 6 partial — automatable tasks complete)
**Domain:** calcfalcon.com
**Hosting:** Railway (auto-deploy from main)

## What's Live

**45 calculators** across **5 categories**, **141 routes** (95 indexable + 45 embeds + 1 SSR API endpoint)

### Freelance (11) — Cyan
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
| Self-Employment Tax | `/freelance/self-employment-tax-calculator` |
| Break-Even | `/freelance/break-even-calculator` |
| Consulting Fee | `/freelance/consulting-fee-calculator` |

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

### Side Hustle (6) — Purple
| Calculator | Slug |
|-----------|------|
| Side Hustle Time to Goal | `/side-hustle/time-to-goal-calculator` |
| Reselling Profit | `/side-hustle/reselling-profit-calculator` |
| Freelance Writing Rate | `/side-hustle/freelance-writing-rate-calculator` |
| Tutoring Income | `/side-hustle/tutoring-income-calculator` |
| Dropshipping Margin | `/side-hustle/dropshipping-margin-calculator` |
| Profit Margin | `/side-hustle/profit-margin-calculator` |

### Personal Finance (8) — Amber
| Calculator | Slug |
|-----------|------|
| FIRE Calculator | `/personal-finance/fire-calculator` |
| Emergency Fund | `/personal-finance/emergency-fund-calculator` |
| Rent vs Buy | `/personal-finance/rent-vs-buy-calculator` |
| Subscription Audit | `/personal-finance/subscription-audit-calculator` |
| Capital Gains Tax | `/personal-finance/capital-gains-tax-calculator` |
| Debt Payoff | `/personal-finance/debt-payoff-calculator` |
| Net Worth | `/personal-finance/net-worth-calculator` |
| Savings Goal | `/personal-finance/savings-goal-calculator` |

## Other Pages
- Homepage (`/`)
- 5 category index pages (with intro paragraphs + FAQ structured data)
- Blog index (`/blog`) + 40 articles
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

### Phase B4 — Blog: Side Hustle & Gig Niche (4 posts)
- [x] Reselling for Profit: eBay, Poshmark, and Mercari Fee Breakdown — platform fee walkthrough, $40 sale comparison
- [x] TaskRabbit vs Turo: Service and Rental Side Hustles Compared — active vs passive, startup costs, scaling
- [x] Freelance Writing Rates in 2026: Per Word, Per Article, and Per Hour — rate benchmarks, niche premiums, hidden time
- [x] How to Start a Dropshipping Business: Real Margins — unit economics, ROAS, returns as margin killers
- [x] Backlinks added to 7 existing posts (Etsy, Side Hustle Taxes, Gig Delivery, Airbnb, Freelance Rate, Pricing Strategies, Digital Products)

### Phase B5 — Blog: Remaining Niche & Internal Linking (4 posts)
- [x] How to Start a Tutoring Side Hustle (And What You Can Earn) — platform comparison, rates by subject, prep time
- [x] The True Cost of Meetings (And Why Freelancers Should Track Them) — hub post: meeting cost + vacation calculator, opportunity cost
- [x] Subscription Audit: How to Find and Cut Forgotten Subscriptions — priority framework, compound savings
- [x] Print-on-Demand in 2026: Printful vs Printify vs Merch by Amazon — per-unit cost modeling, marketplace fees
- [x] Backlinks added to 8 existing posts (Writing Rates, Side Hustle Taxes, Pricing Strategies, Freelance Rate, Emergency Fund, FIRE Guide, Digital Products, Etsy Fees)
- [x] All 37 calculators now have companion blog coverage (32 posts total)

### Phase 10a — Tax & Business Finance (first half)
- [x] Shared tax bracket module: `src/lib/calculators/shared/tax-brackets.ts` (FilingStatus, TAX_BRACKETS, STANDARD_DEDUCTIONS, FICA_RATES, calculateFederalTax, calculateSelfEmploymentTax, getMarginalBracket)
- [x] Refactored `quarterly-tax.ts` and `w2-vs-1099.ts` to use shared module
- [x] Self-Employment Tax Calculator (Freelance) — SS + Medicare + Additional Medicare, QBI deduction, BarComparisonChart, Schedule SE summary
- [x] Profit Margin Calculator (Side Hustle) — Gross/operating/net margin, DonutChart (cost breakdown), per-unit profit, break-even revenue
- [x] Embed routes, category indexes, config, homepage counts updated
- [x] OG images for both calculators

### Phase 10b — Tax & Business Finance (second half)
- [x] Shared tax bracket module: added `LONG_TERM_CG_BRACKETS`, `NIIT_RATE`, `NIIT_THRESHOLDS`, `calculateCapitalGainsTax()` to `shared/tax-brackets.ts`
- [x] Capital Gains Tax Calculator (Personal Finance) — short vs long-term comparison, NIIT, bracket stacking, BarComparisonChart, capital loss offsetting
- [x] Debt Payoff Calculator (Personal Finance) — snowball/avalanche strategies, dynamic debt list, ProjectionChart (with-extra vs minimum-only), freed-up minimum rollover
- [x] Embed routes, category indexes, config, homepage counts updated (39→41)
- [x] OG images for both calculators (Amber background)

### Phase 11 — Financial Planning
- [x] Net Worth Calculator (Personal Finance) — dynamic asset/liability lists, DonutChart (asset allocation), ProjectionChart (growth projection in advanced)
- [x] Break-Even Calculator (Freelance) — fixed/variable cost analysis, ProjectionChart (revenue vs total cost intersection), target profit with tax
- [x] Consulting Fee Calculator (Freelance) — market-based rates by experience/industry/location, BarComparisonChart (hourly/daily/project/retainer)
- [x] Savings Goal Calculator (Personal Finance) — monthly savings planner, ProjectionChart with goalLine, inflation adjustment, irregular income buffer
- [x] Embed routes, category indexes, config, homepage counts updated (41→45)
- [x] OG images for all 4 calculators

### Phase B6 — Blog: Tax & Business (4 posts)
- [x] Self-Employment Tax Guide 2026 — SE tax mechanics, 92.35% multiplier, deductions, S-corp strategy
- [x] How to Calculate Profit Margins for Side Hustles — gross/net/operating margins, benchmarks by hustle type
- [x] Capital Gains Tax for Freelancers and Creators — bracket stacking, NIIT, loss harvesting, timing strategies
- [x] Debt Payoff Strategies on Irregular Income — snowball vs avalanche, percentage-based payments, windfall rules
- [x] BlogLayout.astro: added Phase 10 + Phase 11 calculator names to CTA map
- [x] Backlinks added to 8 existing posts (quarterly-tax, w2-vs-1099, reselling, dropshipping, FIRE, side-hustle-taxes, emergency-fund, subscription-audit)

### Phase B7 — Blog: Financial Planning (4 posts)
- [x] Net Worth Tracking for Freelancers — asset allocation, debt-to-asset ratio, projection strategies
- [x] Break-Even Analysis for Course Creators and Product Sellers — contribution margin, fixed/variable costs, pricing lever
- [x] Consulting Rates by Industry in 2026 — 8 industries, 5 experience tiers, location/specialization multipliers
- [x] Savings Goals on Variable Income — percentage-based saving, irregular income buffer, competing goals
- [x] Backlinks added to 8 existing posts (fire-calculator-guide, emergency-fund, debt-payoff, freelance-pricing, freelance-rate, profit-margin, online-course, subscription-audit)

### Phase 6 (partial) — Polish & Technical SEO
- [x] OG images converted from SVG to PNG (42 files: 41 calculators + default) via `scripts/convert-og-images.mjs`
- [x] All 41 calculator `.astro` pages updated from `.svg` to `.png` ogImage references
- [x] BaseLayout default OG image updated to `default.png`
- [x] Fixed corrupt SVG header in `reselling-profit.svg` (unescaped `&`)
- [x] Structured data: `image` property added to WebApplication schema (`schema.ts` + `CalculatorLayout.astro`)
- [x] PWA support: `manifest.json`, service worker (`sw.js`), 192/512px PNG icons, manifest link + theme-color meta in BaseLayout
- [x] `sharp` added as explicit dependency for OG image conversion

## What's NOT Done

- Resend API key not configured (manual: see `docs/ben.md`)
- Affiliate URLs are placeholders (`#`)
- AdSense publisher ID not set (pending approval)
- Placeholder PDF needs real content
- Phase 6 remaining (manual): distribution (Product Hunt, Reddit, HARO), affiliate URL activation, PDF export, compare scenarios
- Phases 12-13 — 8 new calculators planned (see `docs/ROADMAP.md`)
- Phases B8-B9 — 8 new blog posts planned to pair with calculator phases

## Known Pre-existing TS Warnings

These are non-blocking (build passes) but exist in the codebase:
- Some calculators pass `suffix` prop to `SliderInput` which doesn't exist in the type
- Some calculators use `highlighted` prop instead of `highlight` on `ResultCard`/`ResultBreakdown`
- `formatCompactNumber` imported but unused in YouTubeAdSenseCalc
