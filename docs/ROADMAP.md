# CalcFalcon Roadmap

## Phase Summary

| Phase | Status | Focus |
|-------|--------|-------|
| 0. Manual/External Steps | IN PROGRESS | DNS, analytics, email, AdSense |
| 6. Polish & Scale | NEXT | Analytics, Mediavine, backlinks |
| 10. Tax & Business Finance | PLANNED | SE Tax, Profit Margin, Capital Gains, Debt Payoff (~33K/mo) |
| 11. Financial Planning | PLANNED | Net Worth, Break-Even, Consulting Fee, Savings Goal (~16K/mo) |
| 12. Creator & Digital Business | PLANNED | Crypto Tax, Affiliate Marketing, Social Media ROI, Digital Product Pricing (~11K/mo) |
| 13. Business Operations | PLANNED | Late Payment, Cost Per Lead, Stock Options, 1099 Tax (~12K/mo) |
| B6. Blog: Tax & Business | PLANNED | 4 posts paired with Phase 10 |
| B7. Blog: Financial Planning | PLANNED | 4 posts paired with Phase 11 |
| B8. Blog: Creator & Digital | PLANNED | 4 posts paired with Phase 12 |
| B9. Blog: Business Operations | PLANNED | 4 posts paired with Phase 13 |

> Completed phases (1-5, 7-9, B1-B5) archived in `docs/archive/ROADMAP-v1.md`

---

## Phase 0: Manual/External Steps (User Action)

- [ ] Configure calcfalcon.com DNS → Railway
- [x] Sign up for Umami analytics (self-hosted) — DONE
- [ ] Sign up for Resend (email)
- [ ] Google Search Console — verify domain, submit sitemap
- [ ] AdSense application (after domain + 30 pages + 1K visits)

---

## Phase 6: Polish & Scale

- ~~Self-host Inter font (WOFF2 in `public/fonts/`)~~ DONE
- Monitor analytics, optimize top-performing pages
- Apply for Mediavine at 50K sessions/month
- Backlink building: Product Hunt, Reddit, HARO
- Consider premium features: PDF export, saved calculations

---

## Phase 10: Tax & Business Finance (~33K/mo combined search volume)

| Calculator | Category | Target Keyword | Est. Vol | Affiliate Potential |
|-----------|----------|---------------|----------|-------------------|
| Self-Employment Tax | Freelance | "self-employment tax calculator" | 8K/mo | TurboTax, QuickBooks |
| Profit Margin | Side Hustle | "profit margin calculator" | 10K/mo | Wave, Bench |
| Capital Gains Tax | Personal Finance | "capital gains tax calculator" | 5K/mo | Fidelity, CoinTracker |
| Debt Payoff | Personal Finance | "debt payoff calculator" | 10K/mo | SoFi, LendingClub |

**Implementation notes:**
- SE Tax: Annual Schedule SE focus (distinct from Quarterly Tax's payment scheduling). SS + Medicare + Additional Medicare Tax breakdown. BarComparisonChart.
- Profit Margin: Gross/operating/net margin from revenue + costs. DonutChart (cost breakdown). Complements Reselling, Dropshipping, POD.
- Capital Gains: Short-term vs long-term on stocks/crypto/real estate. BarComparisonChart (ST vs LT comparison).
- Debt Payoff: Snowball vs avalanche with dynamic debt list (reuse Subscription Audit pattern). ProjectionChart (balance over time).

**Pre-work:** Extract tax bracket logic from `src/lib/calculators/quarterly-tax.ts` into `src/lib/calculators/shared/tax-brackets.ts`. SE Tax, 1099 Tax, and Capital Gains Tax all reuse it.

---

## Phase 11: Financial Planning (~16K/mo combined)

| Calculator | Category | Target Keyword | Est. Vol | Affiliate Potential |
|-----------|----------|---------------|----------|-------------------|
| Net Worth | Personal Finance | "net worth calculator" | 5K/mo | Betterment, Empower |
| Break-Even | Freelance | "break-even calculator" | 5K/mo | Accounting tools |
| Consulting Fee | Freelance | "consulting rate calculator" | 3K/mo | HoneyBook, Dubsado |
| Savings Goal | Personal Finance | "savings goal calculator" | 3K/mo | Ally, Marcus |

**Implementation notes:**
- Net Worth: Dynamic asset/liability list. DonutChart (allocation). Companion to FIRE.
- Break-Even: Units + revenue break-even. ProjectionChart (revenue vs costs intersection).
- Consulting Fee: Market-based rate (distinct from Hourly Rate's cost-based approach). BarComparisonChart (hourly/day/project/retainer).
- Savings Goal: Monthly amount needed by target date. "Irregular income" angle for brand differentiation. ProjectionChart with goal line.

---

## Phase 12: Creator & Digital Business (~11K/mo combined)

| Calculator | Category | Target Keyword | Est. Vol | Affiliate Potential |
|-----------|----------|---------------|----------|-------------------|
| Crypto Tax | Personal Finance | "crypto tax calculator" | 5K/mo | CoinLedger, Koinly ($20-50/ref) |
| Affiliate Marketing | Creator | "affiliate marketing calculator" | 2K/mo | ShareASale, Impact |
| Social Media ROI | Creator | "social media ROI calculator" | 2K/mo | Buffer, Later |
| Digital Product Pricing | Creator | "how to price digital products" | 2K/mo | Gumroad, Shopify |

**Implementation notes:**
- Crypto Tax: Extends Capital Gains logic with crypto-specific events (staking, airdrops, DeFi). FIFO/LIFO. DonutChart (gains by type).
- Affiliate Marketing: Traffic → CTR → conversion → commission pipeline. ProjectionChart (revenue scaling).
- Social Media ROI: Time + money invested vs revenue attributed. BarComparisonChart (per-platform).
- Digital Product Pricing: Price optimization based on costs, market, and goals. BarComparisonChart (revenue at 3 price points).

---

## Phase 13: Business Operations (~12K/mo combined)

| Calculator | Category | Target Keyword | Est. Vol | Affiliate Potential |
|-----------|----------|---------------|----------|-------------------|
| Late Payment / Invoice | Freelance | "late payment fee calculator" | 2K/mo | FreshBooks, HoneyBook |
| Cost Per Lead | Side Hustle | "cost per lead calculator" | 2K/mo | Google Ads, Mailchimp |
| Stock Options | Personal Finance | "stock option calculator" | 3K/mo | Carta, Fidelity |
| 1099 Tax | Freelance | "1099 tax calculator" | 5K/mo | TurboTax, H&R Block |

**Implementation notes:**
- Late Payment: Interest accrual on overdue invoices. ProjectionChart (growing balance).
- Cost Per Lead: CPL, CPA, ROAS, break-even CPL from LTV. DonutChart (spend breakdown).
- Stock Options: ISO vs NSO, AMT, vesting, exercise strategy. ProjectionChart (value over time).
- 1099 Tax: Beginner-friendly "I got a 1099, what do I owe?" Reuses SE Tax logic. DonutChart (tax breakdown). Distinct intent from Quarterly Tax and W2vs1099.

---

## Category Distribution After All Phases

| Category | Current | Added | Final |
|----------|---------|-------|-------|
| Freelance | 8 | +4 | 12 |
| Creator | 13 | +3 | 16 |
| Gig Economy | 7 | +0 | 7 |
| Side Hustle | 5 | +2 | 7 |
| Personal Finance | 4 | +5 | 9 |
| **Total** | **37** | **+14** | **51** |

---

## Blog Content Roadmap

Each blog phase pairs with a calculator phase. Posts target "People Also Ask" and long-tail queries, linking to the calculator as a CTA.

### Phase B6 (pairs with Phase 10) — 4 posts
1. "Self-Employment Tax Guide 2026" → SE Tax calculator
2. "How to Calculate Profit Margins for Side Hustles" → Profit Margin calculator
3. "Capital Gains Tax for Freelancers and Creators" → Capital Gains calculator
4. "Debt Payoff Strategies on Irregular Income" → Debt Payoff calculator

### Phase B7 (pairs with Phase 11) — 4 posts
1. "Net Worth Tracking for Freelancers" → Net Worth calculator
2. "Break-Even Analysis for Course Creators and Product Sellers" → Break-Even calculator
3. "Consulting Rates by Industry in 2026" → Consulting Fee calculator
4. "Savings Goals on Variable Income" → Savings Goal calculator

### Phase B8 (pairs with Phase 12) — 4 posts
1. "Crypto Tax Guide for Creators and Freelancers" → Crypto Tax calculator
2. "Affiliate Marketing Income: Realistic Expectations" → Affiliate Marketing calculator
3. "Measuring Social Media ROI as a Creator" → Social Media ROI calculator
4. "How to Price Digital Products in 2026" → Digital Product Pricing calculator

### Phase B9 (pairs with Phase 13) — 4 posts
1. "How to Charge Late Fees as a Freelancer" → Late Payment calculator
2. "Understanding Cost Per Lead for Small Businesses" → CPL calculator
3. "Employee Stock Options Explained for Freelancers" → Stock Options calculator
4. "1099 Tax Guide for Beginners" → 1099 Tax calculator

### Blog Implementation Notes

- Hub posts use `calculatorSlugs` (array) frontmatter; single-calc posts use `calculatorSlug` (string)
- File naming: kebab-case matching existing pattern
- Category values: `freelance`, `creator`, `gig-economy`, `side-hustle`, `finance`
- Each post: 2,000-3,000 words, links to calculator in intro, links to 1-2 related blog posts
- Space publishedDate values ~1 week apart within each phase
- Run `/create-blog-post` to create each post (full guided workflow)

---

## Reusable Patterns for New Phases

- **Shared tax library:** Extract tax bracket logic into `src/lib/calculators/shared/tax-brackets.ts` before Phase 10
- **Dynamic list (add/remove rows):** Debt Payoff, Net Worth, Crypto Tax — reuse pattern from `subscription-audit.ts`
- **All existing shared components:** NumberInput, CurrencyInput, SliderInput, DropdownInput, ModeToggle, ResultCard, ResultBreakdown, CopyResultsButton, charts, Tooltip, useCalculatorState, ErrorBoundary

### Per-calculator checklist (use `/add-calculator` skill)
- Logic file, UI component, Astro page
- Embed route added to `src/pages/embed/[...slug].astro`
- OG image in `public/og-images/`
- Category index page updated
- Homepage counts updated
- Cross-links to related calculators

---

## Execution Order

```
Phase 0 (manual, ongoing)
Phase 6 (polish) — NEXT
Phase 10 (tax/biz finance) → B6 (blog)
Phase 11 (financial planning) → B7 (blog)
Phase 12 (creator/digital) → B8 (blog)
Phase 13 (biz operations) → B9 (blog)
```

## Verification After Each Phase

- `npm run build` — 0 errors
- `npm run preview` — visual check
- Sitemap at `/sitemap-index.xml` includes new pages
- `grep -r "Calcverse" src/ public/` — must return 0
- `grep -r "brand-" src/` — must return 0
- Run `/update-phase` to update docs
