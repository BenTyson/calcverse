# CalcFalcon Roadmap — Completed Phases (v1)

> **Historical archive.** These phases are all complete. See `docs/ROADMAP.md` for the active roadmap.

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
| B1. Blog: High-Volume Deep-Dives | DONE | 6 posts: TikTok, Uber/Lyft, Patreon, Airbnb, FIRE, Rent vs Buy |
| B2. Blog: Hub Posts & Strategy | DONE | 5 hub posts linking multiple calculators |
| B3. Blog: Creator Deep-Dives | DONE | 5 posts covering Substack, Podcast, Ko-fi, Sponsorship, Online Course |
| B4. Blog: Side Hustle & Gig Niche | DONE | 4 posts covering Reselling, TaskRabbit/Turo, Writing Rates, Dropshipping |
| B5. Blog: Remaining & Linking | DONE | 4 posts covering Tutoring, Meeting Cost, Subscription Audit, Print-on-Demand |

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

## Phase 7: Side Hustle Buildout — DONE

Reselling Profit, Freelance Writing Rate, Tutoring Income, Dropshipping Margin. 29 calculators, 5 in Side Hustle category.

---

## Phase 8: Freelance Business Essentials — DONE

Freelance Retirement (Solo 401k/SEP-IRA/IRA comparison, BarComparisonChart), Meeting Cost (time/cost analysis, DonutChart), Freelance Vacation Fund (savings planner, DonutChart), Value-Based Pricing (ROI-based pricing, BarComparisonChart). 33 calculators, 8 in Freelance category.

---

## Phase 9: Creator Economy Deepening — DONE

Sponsorship Rate (CPE/CPM rate calculator, BarComparisonChart), Print-on-Demand Profit (Printful/Printify/MBA, DonutChart), Online Course Revenue (Teachable/Udemy/Skillshare/self-hosted, DonutChart), Newsletter Revenue (Substack/Beehiiv/ConvertKit, subscriptions + sponsorships, DonutChart). 37 calculators, 13 in Creator category.

---

## Blog Content Roadmap

All 37 calculators have companion blog posts (32 posts total — some hub posts cover multiple calculators). Blog posts are the primary SEO driver — each targets "People Also Ask" and long-tail queries, linking to the calculator as a CTA.

### Phase B1: High-Volume Deep-Dives (6 posts) — DONE

6 single-calc deep-dives covering highest search volume uncovered topics. Backlinks added to 6 existing posts.

### Phase B2: Hub Posts & Strategy Guides (5 posts) — DONE

5 hub posts linking multiple calculators: Freelance Pricing Strategies, Best Platforms for Digital Products, Gig Delivery Apps Compared, Freelance Retirement Planning, Emergency Fund on Irregular Income.

### Phase B3: Creator Economy Deep-Dives (5 posts) — DONE

5 creator deep-dives: Substack/Beehiiv/ConvertKit comparison, podcast sponsorship earnings, Ko-fi/Patreon/BMAC comparison, sponsorship rate guide, online course earnings. Cross-links added to 4 existing posts.

### Phase B4: Side Hustle & Gig Niche (4 posts) — DONE

4 side hustle and gig niche posts: Reselling Profit (eBay/Poshmark/Mercari fee comparison), TaskRabbit vs Turo (active vs passive gig models), Freelance Writing Rates 2026 (per-word/article/hour benchmarks), Dropshipping Margins (real unit economics). Backlinks added to 7 existing posts.

### Phase B5: Remaining Niche & Internal Linking (4 posts) — DONE

4 final posts covering remaining calculators: Tutoring Side Hustle, True Cost of Meetings (hub: meeting-cost + vacation), Subscription Audit, Print-on-Demand 2026. Backlinks added to 8 existing posts. All 37 calculators now have blog coverage.

### Blog Implementation Notes

- Hub posts use `calculatorSlugs` (array) frontmatter; single-calc posts use `calculatorSlug` (string)
- File naming: kebab-case matching existing pattern (e.g., `tiktok-creator-earnings.md`)
- Category values: `freelance`, `creator`, `gig-economy`, `side-hustle`, `finance`
- Each post: 2,000-3,000 words, links to calculator in intro, links to 1-2 related blog posts
- Space publishedDate values ~1 week apart within each phase
- Reference posts: `doordash-driver-earnings.md` (single-calc), `side-hustle-taxes.md` (hub)
- Run `/create-blog-post` to create each post (full guided workflow)
