# CalcFalcon Roadmap

## Phase Summary

| Phase | Status | Focus |
|-------|--------|-------|
| 1. Tech Debt & Rebrand | DONE | Rebrand, domain, a11y, ErrorBoundary, hydration |
| 2a. Chart Components | DONE | Recharts, DonutChart, BarComparisonChart, ProjectionChart, ChartCard |
| 2b. Chart Integration | DONE | Charts in 7 calculators (Freelancer, Etsy, Ko-fi, Quarterly, W2v1099, YouTube, SideHustle) |
| 2c. Result Enhancements | DONE | CopyResultsButton, count-up animation, Tooltip in all 16 calcs |
| 3. Content System | DONE | Blog infrastructure, 8 articles, calculator content, about page |
| 4. Monetization | DONE | Email capture, ad placements, affiliates, AdSense prep |
| 5. Calculator Expansion | NEXT | Personal Finance (4), Gig (3), Creator (2) → 25+ total |
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

## Phase 3: Content System & SEO Depth — DONE

Blog infrastructure, 8 pillar articles, about page, calculator content enhancements, category page FAQs. 34 indexable pages (50 total with embeds).

---

## Phase 4: Monetization Infrastructure — DONE

Ad slots, email capture (Resend), affiliate cards on 4 calculators, AdSense prep, privacy page updated. Manual setup tasks tracked in `docs/ben.md`.

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
Phase 2a-2c (DONE)
Phase 3 (DONE)
  ├── Phase 4 (monetization) — DONE
  └── Phase 5 (new calcs) — NEXT
Phase 6 (ongoing)
```

## Verification After Each Phase

- `npm run build` — 0 errors
- `npm run preview` — visual check
- Sitemap at `/sitemap-index.xml` includes new pages
- `grep -r "Calcverse" src/ public/` — must return 0
- `grep -r "brand-" src/` — must return 0
- Run `/update-phase` to update docs
