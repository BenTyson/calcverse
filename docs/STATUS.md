# CalcFalcon — Current Status

**Last Updated:** 2026-03-08
**Domain:** calcfalcon.com
**Hosting:** Railway (auto-deploy from main)

## What's Live

**16 calculators** across **4 categories**, **40 built pages** (24 indexable + 16 embeds)

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

## Other Pages
- Homepage (`/`)
- 4 category index pages
- Privacy Policy (`/privacy`)
- Terms of Service (`/terms`)
- 404 page

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

## What's NOT Done

- No analytics (decision: Umami self-hosted)
- No custom domain configured (DNS + Railway — manual step)
- No Google Search Console submission
- No blog / content system (Phase 3)
- No email capture (Phase 4)
- No ad placements (Phase 4)
- No affiliate links (Phase 4)
- Personal Finance category shows "Coming Soon"
- Only 4 of 16 calculators have custom OG images (SVG)
- SVG OG images may not render on all social platforms (PNG preferred)

## Known Pre-existing TS Warnings

These are non-blocking (build passes) but exist in the codebase:
- `getInitialState` returns `Record<string, unknown>` — doesn't match specific input types
- Some calculators pass `suffix` prop to `SliderInput` which doesn't exist in the type
- Some calculators use `highlighted` prop instead of `highlight` on `ResultCard`/`ResultBreakdown`
- `formatCompactNumber` imported but unused in YouTubeAdSenseCalc
