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
| 5a. Personal Finance | DONE | FIRE, Emergency Fund, Rent vs Buy, Subscription Audit |
| 5b. Gig Economy Expansion | DONE | Amazon Flex, TaskRabbit, Turo Profit |
| 5c. Creator Expansion | DONE | TikTok Earnings, Gumroad Revenue |
| 5d-5e. OG Images & Homepage | DONE | OG images for all 25 calculators, homepage featured refresh |
| 7. Side Hustle Buildout | DONE | Reselling Profit, Freelance Writing Rate, Tutoring Income, Dropshipping Margin |
| 8. Freelance Business | DONE | Freelance Retirement, Meeting Cost, Freelance Vacation, Value-Based Pricing |
| 9. Creator Deepening | DONE | Sponsorship Rate, Print-on-Demand, Online Course, Newsletter Revenue |
| 6. Polish & Scale | NEXT | Analytics, Mediavine, backlinks |
| B1. Blog: High-Volume Deep-Dives | TODO | 6 posts covering TikTok, Uber/Lyft, FIRE, Airbnb, Patreon, Rent vs Buy |
| B2. Blog: Hub Posts & Strategy | TODO | 5 hub posts linking multiple calculators |
| B3. Blog: Creator Deep-Dives | TODO | 5 posts covering Substack, Podcast, Ko-fi, Sponsorship, Online Course |
| B4. Blog: Side Hustle & Gig Niche | TODO | 4 posts covering Reselling, TaskRabbit/Turo, Writing Rates, Dropshipping |
| B5. Blog: Remaining & Linking | TODO | 4 posts covering Tutoring, Meeting Cost, Subscription Audit, Print-on-Demand |

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

### 5a. Personal Finance (4 new) — DONE
FIRE, Emergency Fund, Rent vs Buy, Subscription Audit. Category index page, nav, homepage, embeds all updated. 20 calculators across 5 categories.

### 5b. Gig Economy (3 new) — DONE
Amazon Flex, TaskRabbit, Turo Profit. 23 calculators across 5 categories.

### 5c. Creator (2 new) — DONE
TikTok Earnings, Gumroad Revenue. 25 calculators, 9 in Creator category.

### 5d-5e. OG Images & Homepage — DONE
Custom SVG OG images for all 25 calculators (platform icons via Simple Icons, category-colored backgrounds). Homepage featured section refreshed with 5-category representation. All calculator pages wired with `ogImage` prop.

---

## Phase 8: Freelance Business Essentials — DONE

Freelance Retirement (Solo 401k/SEP-IRA/IRA comparison, BarComparisonChart), Meeting Cost (time/cost analysis, DonutChart), Freelance Vacation Fund (savings planner, DonutChart), Value-Based Pricing (ROI-based pricing, BarComparisonChart). 33 calculators, 8 in Freelance category.

---

## Phase 9: Creator Economy Deepening — DONE

Sponsorship Rate (CPE/CPM rate calculator, BarComparisonChart), Print-on-Demand Profit (Printful/Printify/MBA, DonutChart), Online Course Revenue (Teachable/Udemy/Skillshare/self-hosted, DonutChart), Newsletter Revenue (Substack/Beehiiv/ConvertKit, subscriptions + sponsorships, DonutChart). 37 calculators, 13 in Creator category.

---

## Phase 6: Polish & Scale

- ~~Self-host Inter font (WOFF2 in `public/fonts/`)~~ DONE
- Monitor analytics, optimize top-performing pages
- Apply for Mediavine at 50K sessions/month
- Backlink building: Product Hunt, Reddit, HARO
- Consider premium features: PDF export, saved calculations

---

## Blog Content Roadmap

8 of 37 calculators have companion blog posts. 29 remain uncovered. Blog posts are the primary SEO driver — each targets "People Also Ask" and long-tail queries, linking to the calculator as a CTA.

**Current coverage (8 posts):** Freelance Hourly Rate, Quarterly Tax, W2 vs 1099, YouTube AdSense, Etsy Fees, Twitch, DoorDash, Side Hustle Taxes (hub).

### Phase B1: High-Volume Deep-Dives (6 posts)

Highest search volume uncovered topics first.

| Post Title | Category | Calculator(s) | Angle |
|-----------|----------|---------------|-------|
| How Much Do TikTok Creators Actually Make? (2026 Data) | creator | tiktok-calculator | Creator Fund RPM, brand deals, LIVE gifts, earnings tiers |
| Uber and Lyft Driver Earnings: What You Really Take Home | gig-economy | uber-lyft-calculator | Gross vs net, gas/depreciation, market variance |
| FIRE Calculator: How to Know When You Can Retire Early | finance | fire-calculator | 4% rule, Coast vs Lean FIRE, projections by income |
| Airbnb Hosting Profit: What Hosts Actually Earn After Fees | gig-economy | airbnb-calculator | Fee breakdown, occupancy benchmarks, ROI by property type |
| Patreon Fees and Earnings: A Creator's Guide | creator | patreon-calculator | Fee tiers, payment processing, tier pricing strategy |
| Rent vs Buy in 2026: How to Actually Run the Numbers | finance | rent-vs-buy-calculator | Break-even timeline, opportunity cost, when renting wins |

### Phase B2: Hub Posts & Strategy Guides (5 posts)

Cluster content linking multiple calculators. Better SEO than thin single-calc posts.

| Post Title | Category | Calculator(s) | Angle |
|-----------|----------|---------------|-------|
| How to Price Freelance Projects: Hourly, Project, and Value-Based | freelance | project-rate-calculator, value-based-pricing-calculator | Three pricing models compared, when each works |
| Best Platforms for Selling Digital Products in 2026 | creator | gumroad-calculator, print-on-demand-profit-calculator, online-course-revenue-calculator | Fee comparison, audience types, which to pick |
| Gig Delivery Apps Compared: DoorDash vs Instacart vs Amazon Flex | gig-economy | instacart-calculator, amazon-flex-calculator | Earnings/hr after expenses, multi-apping strategy |
| Freelance Retirement Planning: Solo 401(k), SEP-IRA, and Your Options | freelance | freelance-retirement-calculator | Account comparison, max contributions, tax advantages |
| How to Build an Emergency Fund When Your Income Is Irregular | finance | emergency-fund-calculator | Variable income challenges, stability multiplier approach |

### Phase B3: Creator Economy Deep-Dives (5 posts)

Remaining creator platforms. Strong social sharing potential.

| Post Title | Category | Calculator(s) | Angle |
|-----------|----------|---------------|-------|
| Substack vs Beehiiv vs ConvertKit: Newsletter Revenue Compared | creator | substack-calculator, newsletter-revenue-calculator | Platform fees head-to-head, paid newsletter economics |
| How Much Do Podcasters Make From Sponsorships? (2026 Rates) | creator | podcast-calculator | CPM rates by niche, download thresholds |
| Ko-fi vs Patreon vs Buy Me a Coffee: Which Pays Best? | creator | kofi-calculator | Fee comparison, one-time vs recurring models |
| How to Set Your Sponsorship Rate as a Creator | creator | sponsorship-rate-calculator | CPE vs CPM pricing, niche multipliers, negotiation |
| How Much Can You Make Selling Online Courses? | creator | online-course-revenue-calculator | Teachable vs Udemy vs Skillshare economics |

### Phase B4: Side Hustle & Gig Niche (4 posts)

Lower individual volume but underserved niches with less competition.

| Post Title | Category | Calculator(s) | Angle |
|-----------|----------|---------------|-------|
| Reselling for Profit: eBay, Poshmark, and Mercari Fee Breakdown | side-hustle | reselling-profit-calculator | Platform fee comparison, realistic margins |
| TaskRabbit vs Turo: Service and Rental Side Hustles Compared | gig-economy | taskrabbit-calculator, turo-calculator | Active vs passive gig models, startup costs |
| Freelance Writing Rates in 2026: Per Word, Per Article, and Per Hour | side-hustle | freelance-writing-rate-calculator | Rate benchmarks by experience, niche premiums |
| How to Start a Dropshipping Business: Real Margins | side-hustle | dropshipping-margin-calculator | Realistic margin breakdown, why most fail |

### Phase B5: Remaining Niche & Internal Linking (4 posts)

Last calculators covered. Hub/strategy angles make them substantive.

| Post Title | Category | Calculator(s) | Angle |
|-----------|----------|---------------|-------|
| How to Start a Tutoring Side Hustle (And What You Can Earn) | side-hustle | tutoring-income-calculator | Platform comparison, rates by subject |
| The True Cost of Meetings (And Why Freelancers Should Track Them) | freelance | meeting-cost-calculator, freelance-vacation-calculator | Opportunity cost + vacation fund as flip side |
| Subscription Audit: How to Find and Cut Forgotten Subscriptions | finance | subscription-audit-calculator | Priority framework, annual savings potential |
| Print-on-Demand in 2026: Printful vs Printify vs Merch by Amazon | creator | print-on-demand-profit-calculator | Per-unit cost modeling, when POD vs inventory |

### Blog Roadmap Summary

| Phase | Posts | New Calcs Covered | Cumulative |
|-------|-------|-------------------|------------|
| B1: High-Volume Deep-Dives | 6 | 6 | 6/29 |
| B2: Hub Posts & Strategy | 5 | 8 | 14/29 |
| B3: Creator Deep-Dives | 5 | 6 | 20/29 |
| B4: Side Hustle & Gig Niche | 4 | 5 | 25/29 |
| B5: Remaining & Linking | 4 | 6 | 29/29 |
| **Total** | **24** | **29** | **All covered** |

Post types: 7 hub/cluster posts (2-3 calcs each), 17 single-calc deep-dives.

### Blog Implementation Notes

- Hub posts use `calculatorSlugs` (array) frontmatter; single-calc posts use `calculatorSlug` (string)
- File naming: kebab-case matching existing pattern (e.g., `tiktok-creator-earnings.md`)
- Category values: `freelance`, `creator`, `gig-economy`, `side-hustle`, `finance`
- Each post: 2,000-3,000 words, links to calculator in intro, links to 1-2 related blog posts
- Space publishedDate values ~1 week apart within each phase
- Reference posts: `doordash-driver-earnings.md` (single-calc), `side-hustle-taxes.md` (hub)
- Run `/create-blog-post` to create each post (full guided workflow)

---

## Execution Order

```
Phase 0 (manual) ─── required before Phase 4
Phase 1 (DONE)
Phase 2a-2c (DONE)
Phase 3 (DONE)
  ├── Phase 4 (monetization) — DONE
  └── Phase 5a (personal finance) — DONE
       └── Phase 5b (DONE) → 5c (DONE) → 5d-5e (DONE)
Phase 7 (Side Hustle Buildout) — DONE
Phase 8 (Freelance Business) — DONE
Phase 9 (Creator Deepening) — DONE
Phase 6 — NEXT
Blog B1 → B2 → B3 → B4 → B5 (can run in parallel with Phase 6)
```

## Verification After Each Phase

- `npm run build` — 0 errors
- `npm run preview` — visual check
- Sitemap at `/sitemap-index.xml` includes new pages
- `grep -r "Calcverse" src/ public/` — must return 0
- `grep -r "brand-" src/` — must return 0
- Run `/update-phase` to update docs
