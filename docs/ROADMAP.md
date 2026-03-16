# CalcFalcon Roadmap

## Phase Summary

| Phase | Status | Focus |
|-------|--------|-------|
| 0. Manual/External Steps | IN PROGRESS | Email, AdSense (DNS + analytics + GSC done) |
| 6. Polish, Distribution & Scale | PLANNED | OG→PNG, structured data, distribution, affiliate activation, product depth |
| 10a. Tax & Business Finance (SE Tax, Profit Margin) | DONE | Shared tax brackets, SE Tax, Profit Margin |
| 10b. Tax & Business Finance (Cap Gains, Debt Payoff) | DONE | Capital Gains Tax, Debt Payoff (~15K/mo) |
| 11. Financial Planning | DONE | Net Worth, Break-Even, Consulting Fee, Savings Goal (~16K/mo) |
| 12. Creator & Digital Business | NEXT | Crypto Tax, Affiliate Marketing, Social Media ROI, Digital Product Pricing (~11K/mo) |
| 13. Business Operations | PLANNED | Late Payment, Cost Per Lead, Stock Options, 1099 Tax (~12K/mo) |
| B6. Blog: Tax & Business | PLANNED | 4 posts paired with Phase 10 |
| B7. Blog: Financial Planning | PLANNED | 4 posts paired with Phase 11 |
| B8. Blog: Creator & Digital | PLANNED | 4 posts paired with Phase 12 |
| B9. Blog: Business Operations | PLANNED | 4 posts paired with Phase 13 |

> Completed phases (1-5, 7-9, B1-B5, 10a-11) archived in `docs/archive/ROADMAP-v1.md`

---

## Phase 0: Manual/External Steps (User Action)

- [x] Configure calcfalcon.com DNS → Railway
- [x] Sign up for Fathom analytics (site ID: BRHGFMPN)
- [x] Google Search Console — verify domain, submit sitemap
- [ ] Sign up for Resend (email)
- [ ] AdSense application (after domain + 30 pages + 1K visits)

---

## Phase 6: Polish, Distribution & Scale

### SEO & Shareability
- Convert OG images from SVG to PNG (SVGs don't render on Twitter/LinkedIn/Slack)
- Add `SoftwareApplication` structured data to calculator pages for rich search results
- Monitor Search Console, optimize top-performing pages

### Distribution (seed initial traffic)
- Submit to Product Hunt
- Post to niche subreddits: r/freelance, r/sidehustle, r/smallbusiness, r/Entrepreneur
- Submit to Indie Hackers
- Post individual calculators to niche communities where they solve real problems
- HARO responses for freelance/tax/gig-economy queries

### Monetization Activation
- Replace placeholder affiliate URLs in `monetization.ts` with real tracking links
- Apply for Mediavine at 50K sessions/month
- Apply for AdSense (after initial traffic)

### Product Depth
- PDF export of calculator results (real lead magnet)
- Compare scenarios mode (run same calc with 2 input sets side by side)
- PWA support (mobile home screen install)

---

## Phase 10a: Tax & Business Finance — DONE

- [x] Shared tax brackets: `src/lib/calculators/shared/tax-brackets.ts`
- [x] Self-Employment Tax Calculator (Freelance, 8K/mo)
- [x] Profit Margin Calculator (Side Hustle, 10K/mo)

## Phase 10b: Tax & Business Finance — DONE

- [x] Capital Gains Tax Calculator (Personal Finance, 5K/mo)
- [x] Debt Payoff Calculator (Personal Finance, 10K/mo)

---

## Phase 11: Financial Planning — DONE

- [x] Net Worth Calculator (Personal Finance, 5K/mo)
- [x] Break-Even Calculator (Freelance, 5K/mo)
- [x] Consulting Fee Calculator (Freelance, 3K/mo)
- [x] Savings Goal Calculator (Personal Finance, 3K/mo)

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

| Category | Current | Remaining | Final |
|----------|---------|-----------|-------|
| Freelance | 11 | +1 | 12 |
| Creator | 13 | +3 | 16 |
| Gig Economy | 7 | +0 | 7 |
| Side Hustle | 6 | +1 | 7 |
| Personal Finance | 8 | +1 | 9 |
| **Total** | **45** | **+6** | **51** |

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

- **Shared tax library:** `src/lib/calculators/shared/tax-brackets.ts` — FilingStatus, brackets, deductions, FICA rates, LTCG brackets, NIIT, calculateFederalTax, calculateSelfEmploymentTax, calculateCapitalGainsTax, getMarginalBracket
- **Dynamic list (add/remove rows):** Subscription Audit, Debt Payoff — reuse pattern from `subscription-audit.ts` (also for Net Worth, Crypto Tax)
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
B6 (blog: Phase 10) → B7 (blog: Phase 11) — NEXT
Phase 6 (polish)
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
