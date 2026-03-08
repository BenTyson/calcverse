# CalcFalcon Roadmap

## Phase Summary

| Phase | Status | Focus |
|-------|--------|-------|
| 1. Tech Debt & Rebrand | DONE | Rebrand, domain, a11y, ErrorBoundary, hydration |
| 2a. Chart Components | DONE | Recharts, DonutChart, BarComparisonChart, ProjectionChart, ChartCard |
| 2b. Chart Integration | DONE | Charts in 7 calculators (Freelancer, Etsy, Ko-fi, Quarterly, W2v1099, YouTube, SideHustle) |
| 2c. Result Enhancements | DONE | CopyResultsButton, count-up animation, Tooltip in all 16 calcs |
| 3. Content System | NEXT | Blog infrastructure, 8-10 articles, calculator content, about page |
| 4. Monetization | PLANNED | Email capture, ad placements, affiliates, AdSense application |
| 5. Calculator Expansion | PLANNED | Personal Finance (4), Gig (3), Creator (2) → 25+ total |
| 6. Polish & Scale | ONGOING | Analytics optimization, Mediavine, backlinks |

## Phase 0: Manual/External Steps (User Action)

- [ ] Configure calcfalcon.com DNS → Railway
- [ ] Sign up for Umami analytics (self-hosted)
- [ ] Sign up for Resend (email)
- [ ] Google Search Console — verify domain, submit sitemap
- [ ] AdSense application (after domain + 30 pages + 1K visits)

---

## Phase 2: Data Visualization

### 2a. Chart Components — DONE
Recharts installed. 4 chart components + color utility created in `src/components/ui/charts/`.

### 2b. Chart Integration — DONE
Charts integrated into 7 calculators: FreelancerRate (donut), Etsy (donut), Ko-fi (donut, replaced old stacked bar), QuarterlyTax (stacked bar), W2vs1099 (side-by-side bar), YouTube (side-by-side bar), SideHustleGoal (projection + goal line).

### 2c. Result Enhancements — DONE
CopyResultsButton (lucide-react icons), useCountUp hook (rAF, prefers-reduced-motion), Tooltip component. Integrated into all 16 calculators. ResultCard supports `numericValue`/`formatFn` for opt-in animation. ResultBreakdown label accepts `React.ReactNode` for tooltips.

---

## Phase 3: Content System & SEO Depth

Target: 30+ indexed pages (exceeds AdSense minimum)

### 3a. Blog Infrastructure
- `src/content/config.ts` — Astro Content Collections schema
- `src/content/blog/` directory
- `src/pages/blog/index.astro` — listing page
- `src/pages/blog/[slug].astro` — article page
- `src/layouts/BlogLayout.astro` — article layout with related calcs
- Add Article schema to `src/lib/seo/schema.ts`
- Update Header + Footer with Blog link

### 3b. Pillar Articles (8-10)

| Article | Target Keyword | Calculator |
|---------|---------------|-----------|
| How to Calculate Your Freelance Rate | "how to set freelance rates" | Hourly Rate |
| W2 vs 1099: The Real Tax Difference | "w2 vs 1099 taxes" | W2vs1099 |
| YouTube AdSense Rates by Niche | "youtube adsense rates" | YouTube |
| DoorDash Driver Earnings: What to Expect | "doordash driver pay" | DoorDash |
| How Much Do Twitch Streamers Make? | "twitch streamer income" | Twitch |
| Etsy Fees Explained | "etsy seller fees" | Etsy |
| Quarterly Tax Guide for Freelancers | "quarterly estimated taxes" | Quarterly Tax |
| Side Hustle Taxes: What You Need to Know | "side hustle taxes" | Multiple |

### 3c-3e. Content Enhancements
- "How to Use This Calculator" content in each calculator's `<slot name="content" />`
- Expand `relatedCalculators` arrays to 3-4 cross-category links
- Enhance 4 category index pages with intros and FAQs
- Create `src/pages/about.astro` (trust signal for AdSense)

**Post-Phase 3:** 34-36 pages

---

## Phase 4: Monetization Infrastructure

### 4a. Email Capture
- `EmailCapture.tsx` — React form, Resend API (or Buttondown free tier)
- Placements: after calculator results, footer, blog articles
- Lead magnet: "Freelancer Tax Cheatsheet" PDF in `public/downloads/`

### 4b. Ad Placement Zones
- `AdSlot.astro` — properly-sized empty containers (pre-AdSense approval)
- Placements: between calculator and share, between FAQs and related, blog sidebar

### 4c. Affiliate Integration
- `AffiliateCard.tsx` — styled recommendation with disclosure
- Tax calcs → QuickBooks/FreshBooks, Creator calcs → platform signup, Gig calcs → referral programs
- `AffiliateDisclosure.tsx` + update privacy.astro

### 4d. AdSense Application
- Update privacy.astro with ad/cookie disclosure
- Add AdSense verification meta tag to BaseLayout.astro

---

## Phase 5: Calculator Expansion to 25+

### 5a. Personal Finance (4 new)

| Calculator | Files |
|-----------|-------|
| FIRE Calculator | `fire.ts`, `FireCalc.tsx`, `personal-finance/fire-calculator.astro` |
| Emergency Fund | `emergency-fund.ts`, `EmergencyFundCalc.tsx`, `emergency-fund-calculator.astro` |
| Rent vs Buy | `rent-vs-buy.ts`, `RentVsBuyCalc.tsx`, `rent-vs-buy-calculator.astro` |
| Subscription Audit | `subscription-audit.ts`, `SubscriptionAuditCalc.tsx`, `subscription-audit-calculator.astro` |

Also: create `personal-finance/index.astro`, remove `comingSoon: true` from homepage, update nav.

### 5b. Gig Economy (3 new)
TaskRabbit Earnings, Amazon Flex, Turo Profit

### 5c. Creator (2 new)
TikTok Creator Fund, Gumroad Revenue

### 5d. OG Images
Generate SVG OG images for all calculators (currently only 4 of 16 have them).

---

## Phase 6: Polish & Scale

- Self-host Inter font (WOFF2 in `public/fonts/`)
- Monitor analytics, optimize top-performing pages
- Apply for Mediavine at 50K sessions/month
- Backlink building: Product Hunt, Reddit, HARO
- Consider premium features: PDF export, saved calculations

---

## Execution Order

```
Phase 0 (manual) ─── required before Phase 4
Phase 1 (DONE)
Phase 2a-2b (DONE)
  ├── Phase 2c (DONE)
  ├── Phase 3 (content) — NEXT, required before Phase 4
  └── Phase 5 (new calcs) — benefits from Phase 2
         └── Phase 4 (monetization) — needs Phase 0 + Phase 3
Phase 6 (ongoing)
```

## Verification After Each Phase

- `npm run build` — 0 errors
- `npm run preview` — visual check
- Sitemap at `/sitemap-index.xml` includes new pages
- `grep -r "Calcverse" src/ public/` — must return 0
- `grep -r "brand-" src/` — must return 0
- Run `/update-phase` to update docs
