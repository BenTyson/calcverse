# CHIP-CTR-CALC

**Lane:** implementation
**Owns:** the 14 calculator page `.astro` files listed in the spawn prompt (title/description props only) + this notes file
**Model:** Fable, high effort

## What shipped

Rewrote the `title` and `description` props on 14 calculator pages so that snippets **lead with the answer** the informational query is asking (fees, cuts, formulas), and frame pages as comparisons **only where the page genuinely compares** (reselling, POD, newsletter, retirement). No `<h1>`/`calculatorName` changes — they feed breadcrumbs and WebApplication schema, and the existing names were already accurate; changing them added risk without improving the snippet. No content sections, calculator logic, or layouts touched. `src/pages/creator/kofi-calculator.astro` untouched per D-008 (verified: built title still `Ko-fi Earnings Calculator - Estimate Your Creator Income`).

Every figure placed in a snippet was verified against the calculator's own logic in `src/lib/calculators/` **and** is stated in the page's existing FAQ copy, so no title/description promises anything the page doesn't deliver:

| Figure in snippet | Verified against |
|---|---|
| Patreon 5% / 8% / 12% + ~2.9% + $0.30 | `patreon-earnings.ts:30-37` + page FAQ #1 |
| Airbnb 3% standard host fee | `airbnb-profit.ts` DEFAULT_INPUTS + FAQ |
| Gumroad flat 10%, processing included | `gumroad-revenue.ts:8,42` + FAQ #1 |
| TikTok Creator Fund ~$0.02–$0.05 / 1K views | `tiktok-earnings.ts:8` (input range $0.01–$0.10, default $0.03) + FAQ #1 |
| Substack 10% + Stripe ~2.9% + $0.30 ≈ 12–14% all-in | `substack-revenue.ts:29-32` + FAQ #1 |
| YouTube 55% creator share; $1–$10 typical RPM | `youtube-adsense.ts:74` (0.55) + FAQ #1 ($1–$10) |
| eBay 13.25%, Poshmark 20%, Mercari 10%+2.9%, FB 5% | `reselling-profit.ts:27-31` + FAQ #1 |
| Turo 10–35% by plan, ~25% typical | `turo-profit.ts:35` (default 25) + FAQ #1 (10–15 / 20–25 / 30–35) |
| Merch by Amazon 32.5% royalty | `print-on-demand-profit.ts:70` (`MERCH_ROYALTY_RATE = 0.325`) |
| Substack 10% / ConvertKit 3.5% / Beehiiv 0% + ~2.9% Stripe | `newsletter-revenue.ts:46-66` + FAQ #2 |
| Solo 401(k) > SEP-IRA at same income (employee deferral) | `freelance-retirement.ts:65-73` (employee limit + 25% vs 25% only), stated qualitatively — **no dollar figures in snippet** so it can't go stale |
| Project rate = hours × hourly + 15–20% buffer | `project-rate.ts` model + FAQ #1 |
| Margin = (revenue − costs) / revenue | `profit-margin.ts` definitionally |
| Sponsorship: engagement-driven, no figure | `sponsorship-rate.ts` CPE model — no defensible headline number, so none used |

### Before/after table (rollback record — prior values are exact)

| Page | Field | Before | After | Target query |
|---|---|---|---|---|
| creator/patreon-calculator.astro | title | Patreon Calculator - Estimate Your Creator Earnings | Patreon Fee Calculator - How Much Does Patreon Take? | "how much does patreon take" |
| | desc | Calculate your Patreon earnings after fees. See how much you'll actually take home based on patron count, pledge amount, and plan tier. | Patreon takes 5% (Lite), 8% (Pro), or 12% (Premium), plus ~2.9% + $0.30 processing per pledge. Calculate your exact take-home by patron count and plan tier. | |
| gig-economy/airbnb-calculator.astro | title | Airbnb Profit Calculator - Calculate Your STR Income | Airbnb Profit Calculator - Host Fees & Break-Even Point | "airbnb host fees" / "airbnb profit calculator" |
| | desc | Calculate your Airbnb rental profit after all fees and expenses. See your break-even occupancy rate and monthly/annual income potential. | Airbnb's standard host fee is just 3% — cleaning, vacancy, and your mortgage decide real profit. Calculate net income and the occupancy you need to break even. | |
| creator/gumroad-calculator.astro | title | Gumroad Calculator - Estimate Your Digital Product Revenue | Gumroad Fee Calculator - How Much Does Gumroad Take? | "gumroad fees" / "how much does gumroad take" |
| | desc | Calculate your Gumroad revenue after fees. Model product sales, memberships, affiliates, and refunds. Free Gumroad fee calculator. | Gumroad takes a flat 10% per sale, payment processing included — no monthly or listing fees. Calculate net revenue from products, memberships, and affiliates. | |
| creator/tiktok-calculator.astro | title | TikTok Earnings Calculator - Estimate Creator Fund Revenue | TikTok Money Calculator - Creator Fund, Deals & LIVE Gifts | "tiktok money calculator" / "how much does tiktok pay per 1000 views" |
| | desc | Calculate potential TikTok earnings from the Creator Fund, brand deals, and LIVE gifts. Free TikTok money calculator for creators. | TikTok's Creator Fund pays about $0.02-$0.05 per 1,000 views — brand deals and LIVE gifts are where the real money is. Estimate your total monthly earnings. | |
| creator/substack-calculator.astro | title | Substack Calculator - Newsletter Revenue Calculator | Substack Fee Calculator - How Much Does Substack Take? | "how much does substack take" / "substack fees" |
| | desc | Calculate your Substack newsletter earnings after fees. Project subscriber growth and see your net take-home from paid subscriptions. | Substack takes 10% of subscription revenue, plus Stripe's ~2.9% + $0.30 per transaction — typically 12-14% all-in. Calculate your net newsletter income. | |
| creator/youtube-adsense-calculator.astro | title | YouTube AdSense Calculator - Estimate Your Earnings | YouTube Money Calculator - RPM, CPM & AdSense Earnings | "youtube money calculator" / "how much does youtube pay per 1000 views" |
| | desc | Calculate potential YouTube ad revenue based on your views, niche, and audience. Free CPM and RPM calculator for YouTubers. | YouTube pays creators 55% of ad revenue — typically $1-$10 per 1,000 views depending on niche and audience. Estimate your channel's earnings from views and RPM. | |
| creator/sponsorship-rate-calculator.astro | title | Sponsorship Rate Calculator - Know What to Charge for Brand Deals | Sponsorship Rate Calculator - What to Charge Brands | "sponsorship rate calculator" / "how much to charge for sponsored post" |
| | desc | Calculate your sponsorship rate based on followers, engagement, niche, and deliverable type. Free calculator for influencers and content creators. | Sponsored-post rates depend on engagement, not follower count alone. Price Instagram, TikTok, YouTube, or Twitter deals, with exclusivity and usage rights. | |
| side-hustle/reselling-profit-calculator.astro | title | Reselling Profit Calculator - eBay, Poshmark & More | Reselling Fee Calculator - eBay vs Poshmark vs Mercari | "ebay vs poshmark fees" / "reselling fee calculator" |
| | desc | Calculate your reselling profit after platform fees, shipping, and costs. Compare eBay, Poshmark, Mercari, and Facebook Marketplace. | Poshmark takes 20%, eBay about 13.25%, Mercari 10% + 2.9%, Facebook Marketplace 5%. Compare platform fees and calculate real profit after shipping and costs. | |
| gig-economy/turo-calculator.astro | title | Turo Calculator - Calculate Your Car Rental Profit | Turo Profit Calculator - How Much Does Turo Really Take? | "how much does turo take" |
| | desc | Calculate your Turo car rental profit after host fees, insurance, and expenses. See your break-even days, monthly income, and profit margin. | Turo's host fee runs 10-35% depending on your protection plan — most hosts pay about 25%. Calculate profit after the fee, insurance, cleaning, and depreciation. | |
| creator/print-on-demand-profit-calculator.astro | title | Print-on-Demand Profit Calculator - POD Margins & Revenue | Print-on-Demand Calculator - Printful vs Printify vs Amazon | "printful vs printify" (comparison lane — where the site already ranks) |
| | desc | Calculate your print-on-demand profit per unit and monthly revenue. Compare Printful, Printify, and Merch by Amazon costs. Free POD calculator. | Printify usually has the lowest base costs, Printful charges more for quality, and Merch by Amazon pays a 32.5% royalty. Compare per-unit profit by platform. | |
| side-hustle/profit-margin-calculator.astro | title | Profit Margin Calculator - Gross, Operating & Net Margins | *(unchanged)* Profit Margin Calculator - Gross, Operating & Net Margins | "profit margin calculator" / "how to calculate profit margin" |
| | desc | Calculate your profit margins at every level: gross, operating, and net. Analyze cost breakdowns, per-unit profit, and break-even revenue for your business. | Profit margin is (revenue - costs) / revenue. Calculate gross, operating, and net margins, see per-unit profit, and find the revenue you need to break even. | |
| creator/newsletter-revenue-calculator.astro | title | Newsletter Revenue Calculator - Subscription & Sponsorship Income | Newsletter Calculator - Substack vs Beehiiv vs ConvertKit | "substack vs beehiiv" (comparison lane) |
| | desc | Calculate your newsletter revenue from paid subscriptions and sponsorships. Compare Substack, Beehiiv, and ConvertKit fees. Free newsletter revenue calculator. | Substack takes 10% of paid subscriptions, ConvertKit 3.5%, Beehiiv 0% — plus ~2.9% Stripe each. Compare platforms and project subscription and sponsor revenue. | |
| freelance/freelance-retirement-calculator.astro | title | Freelance Retirement Calculator - Solo 401(k) vs SEP-IRA | Solo 401(k) vs SEP-IRA Calculator for the Self-Employed | "solo 401k vs sep ira calculator" (comparison lane) |
| | desc | Compare Solo 401(k), SEP-IRA, Traditional and Roth IRA contribution limits for self-employed workers. See tax savings and projected retirement balance. | At the same income a Solo 401(k) usually allows bigger contributions than a SEP-IRA — the employee deferral is the difference. Compare limits and tax savings. | |
| freelance/project-rate-calculator.astro | title | Project Rate Calculator - Convert Hourly to Project Pricing | Project Rate Calculator - Turn Hourly Rates Into Quotes | "hourly to project rate" |
| | desc | Calculate project-based pricing from your hourly rate. Includes scope buffer, revision rounds, complexity adjustments, and tiered pricing suggestions. | A project rate is estimated hours x your hourly rate, plus a 15-20% buffer for scope creep and revisions. Build a quote with tiered pricing suggestions. | |

## Verification

- `npm install` — completed (fresh worktree had no node_modules).
- `npm run build` — completed, `[build] Complete!`; grep of full output for `error|warn` returned **zero lines**. All 141 pages built.
- `npm run check:tax-data` — `✓ Tax data clean — TY2026, verified August 9, 2026, no superseded figures outside the shared modules.`
- Rendered-output check on built HTML (5 titles + 3 meta descriptions confirmed verbatim in `dist/client/`): patreon, substack, turo, reselling, freelance-retirement titles; patreon, substack, turo descriptions. All exact matches.
- `git status --short` shows exactly the 14 owned files modified, nothing else. Ko-fi page title confirmed unchanged in built output (D-008).
- Note: `description` also renders as the visible on-page subtitle (`CalculatorLayout.astro:133`), so every answer-first description now literally puts the answer at the top of the page — the "title must not over-promise" constraint is satisfied structurally, not just via FAQ copy further down.

## Measurements

Current distribution before changes (measured, not assumed):

- Titles: min 50, max 65, mean 55.8 chars (2 of 14 over 60: sponsorship 65, newsletter 65)
- Descriptions: min 123, max 159, mean 140.3 chars (8 of 14 below 140 — under-using the snippet budget)

Chosen targets from that arithmetic: titles 50–60 (trim the two over-length outliers, keep the rest in the proven band), descriptions 145–160 (the answer-first pattern needs the full budget; previous mean of 140 left 15–20 chars of answer space unused).

After changes: titles min 51, max 59, mean 55.1 — all 14 within 50–60. Descriptions min 152, max 160, mean 156.6 — all within 145–160. **Trades:** none forced; every answer fit without dropping a verified figure. The only near-miss was the newsletter description, where "sponsorship revenue" was shortened to "sponsor revenue" to stay ≤160.

## Changelog entry (pre-drafted — Integrator merges this, do not write it to shared docs yourself)

> **CTR pass, Wave 1:** rewrote titles/meta descriptions on 14 calculator pages to lead with the verified answer to the informational query (platform fee %, formula) and to signal genuine cross-platform comparison where the page delivers one. Ko-fi excluded per D-008. All figures verified against calculator logic; no content or logic changes.

## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| high | Retirement dollar limits hardcoded as string literals in page copy ($72,000, $24,500, $8,000, $7,500/$8,600) — currently correct vs `shared/retirement-limits.ts` but will silently go stale next autumn; `check:tax-data` only catches *superseded* figures, so current-year literals pass | src/pages/freelance/freelance-retirement-calculator.astro:9,14,70,105,107 | left: content sections out of my write scope; proposed as CHIP-RETIREMENT-COPY-WIRE |
| medium | Worktree predates the command-center docs: no `docs/CHIP-PROTOCOL.md`, no `docs/notes/`, and `docs/DECISIONS.md` has none of D-001…D-009. I read them from the main checkout read-only and trusted the spawn prompt's quoted D-008 per protocol §7 | worktree root | worked around; harness gap noted below |
| medium | Patreon fee logic comment says "Patreon fee structure (2024)" — tiers match the page FAQ but nobody has re-verified Patreon's current pricing; same class of check applies to all platform fees cited in snippets | src/lib/calculators/patreon-earnings.ts:25 | left: presumably CHIP-RESEARCH-PAYMENTS' fact file covers this; flag for cross-check when it lands |
| low | Sponsorship FAQ's "$10-20 per 1,000 followers" baseline is not derivable from the calculator's own model (Instagram CPM constant implies ~$25/1K before multipliers) — mild page-vs-logic inconsistency; I kept numbers out of that snippet | src/pages/creator/sponsorship-rate-calculator.astro:9 vs src/lib/calculators/sponsorship-rate.ts:99 | left: cosmetic, needs a sourced figure either way |
| low | Four pages (airbnb 52, tiktok 34, youtube 39, retirement 79) are ranking problems, not CTR problems — meta changes won't move them; they need the D-001 hub treatment | — | left: needs Command Center sequencing |

**1. Outside my scope.** The biggest item is the retirement page's hardcoded IRS limits (table above). Also: the description prop doubles as the visible page subtitle — a useful lever the spawn prompt didn't mention, and a constraint (descriptions must read as page copy, not just SERP bait); all 14 rewrites were checked for that dual role.

**2. Risks in what I built.** (a) The figures in snippets now create a *maintenance coupling*: if a platform changes its fee, the meta description goes stale along with the calculator — any future fee update must grep `src/pages/` for the figure, not just `src/lib/calculators/`. (b) "YouTube pays creators 55%" is the long-form-ad split only; Shorts revenue-sharing differs — the calculator only models the 55% split, so the snippet matches the tool, but a pedant could object. (c) The Turo "10-35%" range comes from page FAQ + calc default, not from Turo's published plans verified in-session — it mirrors what the page already claimed rather than a primary source. If CHIP-RESEARCH-PAYMENTS' fact file contradicts any of these, the description is one line to fix.

**3. Proposed follow-up chips.** CHIP-RETIREMENT-COPY-WIRE — owns `src/pages/freelance/freelance-retirement-calculator.astro` (content sections): interpolate `shared/retirement-limits.ts` exports into FAQ/prose/table instead of literals, and consider extending `check:tax-data` to flag current-year literals in page copy. CHIP-FEE-FACT-SYNC — after CHIP-RESEARCH-PAYMENTS lands, diff every platform-fee figure in `src/lib/calculators/` and these 14 snippets against the fact file.

**4. Harness improvements.** The protocol's §7 warning about stale worktree copies of DECISIONS.md proved out, but the gap is wider: my worktree had *no* CHIP-PROTOCOL.md at all — the spawn prompt should either quote the protocol's critical rules or state that chips should read shared docs from the main checkout (read-only) when the worktree predates them. Also worth adding to §8: `description` on calculator pages is user-visible copy (subtitle), not just metadata.

**5. Model tier.** Fable/high was right for this: the work is small in diff size but every line is a verified factual claim on a YMYL site with a live AdSense violation. A lower tier would likely have pattern-matched plausible fee figures instead of tracing each to the calculator logic.
