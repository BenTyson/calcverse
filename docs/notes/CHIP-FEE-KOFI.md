# CHIP-FEE-KOFI

**Lane:** implementation
**Owns:** `src/lib/calculators/kofi-earnings.ts`, `src/components/calculators/KofiCalc.tsx`, `src/pages/creator/kofi-calculator.astro` (body copy / FAQ / worked examples only), `docs/notes/CHIP-FEE-KOFI.md`
**Model:** Opus, high effort
**Fact source:** `docs/facts/creator-payment-fees.md` § 2 (CHIP-RESEARCH-PAYMENTS, verified 2026-08-25). No fee figure on this page came from anywhere else.

---

## What shipped

`git status` at handoff is exactly the three owned `src/` files. Nothing else was written.

### `src/lib/calculators/kofi-earnings.ts` — rewritten fee model

- **Three fee states replace two.** `goldMember: boolean` → `plan: 'free' | 'standard' | 'gold'`. The old model could not express **Standard**, which is the state every creator joining Ko-fi today starts in.
- **The 5% is applied per product type, per plan** (`serviceFeeRates()`), which is how Ko-fi actually charges it:

  | | one-off tips | memberships | commissions | shop |
  |---|---|---|---|---|
  | Ko-fi Free | **0%** | 5% | 5% | 5% |
  | Standard | 5% | 5% | 5% | 5% |
  | Ko-fi Gold | 0% | 0% | 0% | 0% |

  The previous code charged 5% on tips + memberships and **0% on shop and commissions** — wrong in both directions, and wrong in the platform's favour on the direction that matters most to this page's audience.
- **Gold is $12/month, not $6**, and it is now **subtracted from take-home**. The old model never subtracted the subscription at all, so Gold take-home was over-stated by the full price on top of the wrong price.
- New exports so no fee figure is ever written as a literal again: `KOFI_SERVICE_FEE_RATE`, `KOFI_GOLD_MONTHLY_COST`, `KOFI_GOLD_BREAK_EVEN` (**derived** as `12 / 0.05`, never restated), `KOFI_FEE_DATA_LAST_VERIFIED`. The `.astro` page imports all four.
- New result field `goldSubscriptionCost`, surfaced as its own breakdown line.
- **Source comment block** in the style of `shared/tax-brackets.ts`: cites the fact file plus S1/S2/S3, records the verification date, lists what changed and why, lists what is **not** modelled (Goals, monthly recurring tips, the Gold + Standard double-charge trap, currency conversion), and records open Verify row **V-K1** inline so the next person editing the file sees it.
- Default plan is `standard` — the state a new creator is actually in.
- `resolveKofiPlan()` + a deprecated optional `goldMember` field preserve pre-existing shared `?s=` links.

### `src/components/calculators/KofiCalc.tsx`

- **Dead URL fixed.** Line 34 emitted `https://calcfalcon.com/creator/ko-fi-calculator` — a 404. It now derives the URL from `window.location`, stripping any `/embed` prefix, with the correct literal as a server-render fallback. Deriving it means the slug can never drift out of sync with the route again. Copy-results text now also names the plan.
- Gold checkbox → **plan dropdown**, and it is shown in **Quick mode as well as Advanced**. It changes the answer more than any other input on the page (a $25/month spread on $500 of revenue), so hiding it behind Advanced mode was making the default answer wrong for a large share of visitors.
- Breakdown row relabelled "Ko-fi Service Fee" with a per-plan qualifier (`5% on all` / `5% except tips` / `0%`), plus a conditional "Ko-fi Gold Subscription −$12" row.
- Tooltips rewritten: the service-fee tooltip states the per-product rates; the processing tooltip states that **Ko-fi does not process payments** and charges no payout fee or minimum.
- Gold comparison card rewritten — see the V-K1 note below. It is now arithmetic plus a caveat, not a recommendation.
- "Ko-fi Tips" list: the lead item was "Ko-fi takes 0% from shop sales", which is false. Replaced with five items that are each a Confident row.
- One-time migration effect for legacy `?s=` links carrying `goldMember: true`.

### `src/pages/creator/kofi-calculator.astro` — body copy only

`title`, `description`, `calculatorName` (which is what renders the `<h1>`), `ogImage`, `slug` and the five FAQ **questions** are untouched. Only FAQ **answers** and prose changed.

- All five FAQ answers rewritten. The largest reversal is *"Does Ko-fi take a cut from shop sales?"* — the old answer was **"No!"**; it is now "Yes."
- Intro `<h2>` "Understanding Ko-fi: The Zero-Fee Creator Platform" → "Understanding Ko-fi's Fees: Free, Standard and Gold". The old heading asserted a falsehood in a heading. (An `<h2>` is body copy; D-010 protects `title`/`description`/`<h1>` only.)
- Comparison table rebuilt. The old one listed "Patreon (Premium) 12%" — a plan that does not exist — and hand-waved take-home figures that do not reproduce from its own stated rates. The new table compares **published fee structures** across all five platforms, every cell a Confident row, and deliberately does **not** publish hand-computed cross-platform take-home numbers. It also surfaces payout minimums, which no fee percentage shows.
- New section "The Same $500, Two Different Answers", and the $1,015 worked example, both recomputed **by running the calculator**.
- "Strategies" section: dropped "Lean into shop sales" (built on the false 0% claim) and "Offer annual memberships" (**not in the fact file** — Ko-fi annual membership billing is not a verified claim, so it should not be on the page).
- New **Sources** section with the three Ko-fi URLs and `{KOFI_FEE_DATA_LAST_VERIFIED}`. `SourcesBlock.astro` was **not** used: its body copy is hard-coded to tax years and "confirm with the IRS", which would render nonsense for platform fees, and it is not a file this chip owns.

---

## Verification

```
npm install                → clean
rm -rf .astro dist         → cleared before the baseline build (per protocol §8)
npm run build              → "[build] Complete!", grep -c '[ERROR]' = 0
npm run check:tax-data     → "✓ Tax data clean — TY2026, verified August 9, 2026,
                              no superseded figures outside the shared modules."
```

**Rendered-output checks** (`dist/client/creator/kofi-calculator/index.html`, not source):

- Stale-string sweep for `$6/month`, `$6 per month`, `$120/month`, `commission-free`, `0% commission`, `0% from shop`, `8-12%`, `Premium`, `zero-fee` → **only one hit**, and it is the corrective sentence "What it is not is a zero-fee platform".
- New figures present: `$12/month` ×9, `$12/mo` ×2, `$240/month` ×4.
- FAQ JSON-LD parses as valid `FAQPage` with all 5 questions and the new answers — the rewritten answers contain nested double quotes, so this was worth checking.

**Runtime check** (real browser, `npm run dev`). The page uses `client:visible`, which does not hydrate in the automation pane, so the identical component was driven through `/embed/creator/kofi-calculator` (`client:load`) — same `KofiCalc`, same logic module:

| Action | Expected (from `npx tsx` run of the module) | Observed in browser |
|---|---|---|
| Load, Standard, 20 tips × $5 + 10 members × $5 | fee $7.50, net $129.15 | "Ko-fi Service Fee (5% on all) −$8", **Net Monthly $129** |
| Switch to Ko-fi Free | fee $2.50, net $134.15 | "(5% except tips) −$3", **$134** |
| Switch to Ko-fi Gold | fee $0, sub $12, net $124.65 | "(0%) −$0", "Ko-fi Gold Subscription −$12", **$125** |
| Members → 100 (gross $600, Standard) | service fee $30 | Gold card: "You are paying **$30**/month … difference is **$18**/month" |
| Copy Results | live route | `http://localhost:4399/creator/kofi-calculator` — **not** the old 404 slug, and the `/embed` prefix correctly stripped |
| Legacy `?s=` link with `goldMember:true`, no `plan` | migrates to Gold, net $195.97 | dropdown shows **Gold**, **Net Monthly $196** |

Console during all of the above: no errors from this component. Two pre-existing errors appear — a service-worker registration failure (`public/sw.js` is not served by the dev server) and a React hydration mismatch. **Both reproduce identically on `/embed/gig-economy/doordash-calculator`, which this chip never touched**, so neither is a regression. See Reflections.

---

## Measurements

**Which mode the plan selector belongs in.** It was Advanced-only as a Gold checkbox. Measured spread across plans at a constant $500/month gross and a constant 119-or-fewer transaction count, from the module:

| $500/month arriving as | Ko-fi Free | Standard | Ko-fi Gold |
|---|---|---|---|
| 100 one-off tips of $5 | **$455.50** (8.9% fees) | $430.50 (13.9%) | $443.50 (11.3%) |
| 100 memberships of $5 | $430.50 (13.9%) | $430.50 (13.9%) | **$443.50** (11.3%) |

A **$25/month spread on identical gross revenue**, and the winning plan flips depending on product mix. No other input on the page moves the answer that much for a fixed revenue figure, so the selector was promoted to both modes. This table also ships on the page — it is the most decision-relevant thing the calculator now knows.

**Gold break-even is derived, not chosen:** `KOFI_GOLD_MONTHLY_COST / KOFI_SERVICE_FEE_RATE` = `12 / 0.05` = **$240/month of fee-charging revenue**. Confirmed by executing the module (`npx tsx`), not by hand. Never written as a literal anywhere.

**Dead-URL class enumerated programmatically**, per protocol §7, rather than trusting the one instance reported to me. Every `https://calcfalcon.com/...` literal in `src/components/calculators/` was checked against `dist/client/<path>/index.html`. The class is **exactly 5**:

| Dead URL | File | Status |
|---|---|---|
| `/creator/ko-fi-calculator` | `KofiCalc.tsx` | **fixed here** |
| `/creator/podcast-sponsorship-calculator` | `PodcastSponsorshipCalc.tsx` | sibling-owned |
| `/creator/twitch-revenue-calculator` | `TwitchRevenueCalc.tsx` | sibling-owned |
| `/freelance/freelancer-rate-calculator` | `FreelancerRateCalc.tsx` | sibling-owned |
| `/gig-economy/airbnb-profit-calculator` | `AirbnbProfitCalc.tsx` | sibling-owned |

That matches the four files on my do-not-touch list exactly, so the class is fully assigned this wave. The sweep script is reproducible: enumerate the literals, strip the origin, test for the built `index.html`.

---

## Rollback record

**D-008 compliance proof.** The built page was captured **before** any edit and diffed against the built page after. All eight ranking-bearing surfaces are byte-identical — SHA-256 of both extracts is `e739a72394891fc3ab787786776c08aca6df66a962f69da829ce8d1f2ae08f48`:

```
<title>Ko-fi Earnings Calculator - Estimate Your Creator Income</title>
<meta name="description" content="Calculate your Ko-fi earnings from donations, memberships, and shop sales. See your take-home after fees and whether Ko-fi Gold is worth it."
<link rel="canonical" href="https://calcfalcon.com/creator/kofi-calculator/"
<meta property="og:title" content="Ko-fi Earnings Calculator - Estimate Your Creator Income"
<meta property="og:description" content="Calculate your Ko-fi earnings from donations, memberships, and shop sales. See your take-home after fees and whether Ko-fi Gold is worth it."
<meta name="twitter:title" content="Ko-fi Earnings Calculator - Estimate Your Creator Income"
<meta name="twitter:description" content="Calculate your Ko-fi earnings from donations, memberships, and shop sales. See your take-home after fees and whether Ko-fi Gold is worth it."
<h1 class="heading-lg text-neutral-900">Ko-fi Earnings Calculator</h1>
```

The five FAQ **questions** are also unchanged verbatim — they carry query matches and feed the FAQPage schema, so only the answers were rewritten.

### Prior values of changed public text, verbatim

> Restoring these strings would restore the falsehoods. This record exists so a revert is *possible*, not because one is advisable. And restoring a string does not restore a ranking.

**Intro `<h2>`:**
> `Understanding Ko-fi: The Zero-Fee Creator Platform`

**Intro paragraph 1:**
> `Ko-fi has carved out a distinct position in the creator economy by offering something no other major platform does: zero platform fees on shop sales and optional zero fees on donations and memberships through its Gold plan. For creators who are tired of watching 8-12% of their income disappear into platform fees on Patreon or similar services, Ko-fi represents a fundamentally different approach to monetization.`

**Intro paragraph 2 (tail):**
> `And the Ko-fi Shop allows creators to sell digital downloads, commissions, and physical products with zero platform commission.`

**"How Ko-fi's Fee Structure Works" (whole paragraph):**
> `Ko-fi's fee model has two tiers. Free accounts pay a 5% platform fee on donations and memberships, plus payment processing (approximately 2.9% + $0.30 per transaction via Stripe or PayPal). Ko-fi Gold members pay $6/month to eliminate the 5% platform fee entirely, leaving only payment processing costs. Shop sales are always commission-free regardless of plan tier.`

**"How to Use" paragraph 2:**
> `Switch to Advanced mode to compare free vs. Ko-fi Gold accounts side by side. Gold costs $6/month but removes the 5% platform fee entirely. The key threshold: if your combined donation and membership income exceeds roughly $120/month, Gold pays for itself. Above that level, every additional dollar saves you 5 cents in fees. You can also model shop sales in Advanced mode — Ko-fi takes 0% commission on shop transactions, making it one of the most competitive platforms for selling digital products.`

**"How to Use" paragraph 4:**
> `If you are deciding between Ko-fi and other platforms, consider that Ko-fi's fee structure (5% or 0% with Gold) is significantly lower than Patreon's 8-12%. However, Patreon offers more robust membership management tools.`

**FAQ 1 answer:**
> `Free Ko-fi accounts pay a 5% platform fee on donations and memberships. Ko-fi Gold members ($6/month) pay 0% platform fees. All accounts pay payment processing fees (PayPal/Stripe) of approximately 2.9% + $0.30 per transaction.`

**FAQ 2 answer:**
> `Ko-fi Gold costs $6/month and removes the 5% platform fee. If you receive more than $120/month in donations and memberships, Gold pays for itself. Gold also includes features like a custom page URL, analytics, and scheduled posts.`

**FAQ 3 answer:**
> `Ko-fi memberships are recurring monthly payments from supporters. You can offer tiers with different benefits. Ko-fi takes 5% (or 0% with Gold) plus payment processing. Members can cancel anytime.`

**FAQ 4 answer:**
> `No! Ko-fi takes 0% from shop sales - you only pay payment processing fees (around 2.9% + $0.30). This makes Ko-fi Shop very competitive for selling digital products, art, and merch.`

**FAQ 5 answer:**
> `Ko-fi has lower fees (5% vs 8-12%) and takes 0% from shop sales. Patreon has more features for large creators. Ko-fi is better for small creators and one-time donations. Many creators use both!`

**Comparison table (removed rows):** `Ko-fi (Free) | 5% | ~2.9% + $0.30 | ~$42 | ~$458`; `Ko-fi Gold | 0% ($6/mo) | ~2.9% + $0.30 | ~$26 | ~$474`; `Patreon (Pro) | 8% | ~2.9% + $0.30 | ~$58 | ~$442`; `Patreon (Premium) | 12% | ~2.9% + $0.30 | ~$78 | ~$422`; `Buy Me a Coffee | 5% | ~2.9% + $0.30 | ~$42 | ~$458`.

**Worked-example conclusion:**
> `Total gross: $1,015/month. On Ko-fi Gold ($6/month), fees are: $0 platform fee on shop sales, 0% platform fee on donations and memberships (Gold benefit), plus ~2.9% + $0.30 processing on each transaction. After all fees, the creator takes home approximately $940 -- a 92.6% take-home rate.`

**Strategy bullets removed:**
> `Lean into shop sales. Because Ko-fi charges zero commission on shop transactions, every dollar you shift from donations to product sales improves your margin. Digital products like templates, presets, or downloadable art have zero marginal cost and pure profit after creation.`
>
> `Use the Gold break-even as a milestone. If your combined donations and memberships exceed $120/month, Gold pays for itself. Track this number and upgrade at the right time. Below $120, the 5% fee on a free account costs less than the $6 Gold subscription.`
>
> `Offer annual memberships. Ko-fi supports annual billing for memberships. Offering a 10-month-for-12 annual plan reduces churn and front-loads revenue. Supporters who pay annually are also more likely to stay long-term because they have already committed.`

**Component strings removed:** `$6/month for 0% platform fees`; `Ko-fi takes 5% on free accounts, 0% for Gold members ($6/mo)`; `Ko-fi Gold Worth It?` / `Ko-fi Gold costs $6/month and removes the 5% fee.` / `You'd save {x}/month by upgrading!`; `• Ko-fi takes 0% from shop sales (only payment processing)`; `Using $5 avg donation, free account (5% fee)`; `https://calcfalcon.com/creator/ko-fi-calculator`.

### Behavioural changes that are not text

- **Default result changed.** The page's on-load answer moves because the default state is now Standard with the fee applied to the right products. Advanced defaults (20 tips × $5, 10 members × $5, 5 shop × $15): old model $7.50 service fee → new $11.25 on Standard. This is a correction, not a regression, but anyone comparing screenshots should know.
- **Old shared `?s=` links** carrying `goldMember: true` resolve to Gold and now include the $12 subscription, so their take-home is lower than when they were shared. `goldMember: false` links land on Standard, because the old two-state model conflated Free and Standard and `false` is genuinely ambiguous.

---

## Changelog entry (pre-drafted — Integrator merges this, do not write it to shared docs yourself)

- **Ko-fi calculator fee model corrected (D-010, D-011).** Ko-fi Gold repriced from $6 to **$12/month** with the subscription now subtracted from take-home; the break-even corrected from $120 to **$240/month of fee-charging revenue**; the 5% service fee moved off one-off tips (0% on Ko-fi Free) and onto shop sales and commissions (5%, previously modelled as 0%); Ko-fi's third fee state, **Standard**, added and made the default. Body copy, all five FAQ answers, the platform comparison table and the worked example were recomputed by running the calculator. Fee figures now import from a single sourced module and are cited on-page with a verification date. Per D-008 the page's title, meta description and `<h1>` are byte-identical to before.
- **Fixed a dead link on the site's highest-traffic page:** the Ko-fi calculator's copy-results text shared `/creator/ko-fi-calculator`, a 404. It now derives the live route.

---

## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| blocker | `kofi-vs-patreon-comparison.md` republishes every defect this chip just fixed — $6 Gold ×4, $120 break-even ×3, "shop sales carry 0% on both tiers", and a Patreon "Lite" plan that does not exist. It is the blog post that links **into** the site's best page. | `src/content/blog/kofi-vs-patreon-comparison.md:9,17,37,41,65,87,111,131,136,140,176` | proposed as CHIP-FEE-BLOG-KOFI |
| blocker | Open Verify row **V-K1** blocks any recommendation to buy Ko-fi Gold. Fixed the price (a Confident row) but did **not** publish a purchase recommendation. Needs a Command Center ruling — see below. | `docs/facts/creator-payment-fees.md` § 2 | **left: caveated, needs ruling** |
| high | React **hydration mismatch on every calculator**. Reproduced on `/embed/gig-economy/doordash-calculator`, untouched by this chip. React discards the server HTML and re-renders the whole island. | `src/hooks/useCalculatorState.ts` (URL state read at client init) | left: pre-existing, out of scope, sibling-owned |
| high | `patreon-fees-and-earnings.md:113` states "Ko-fi takes 0% on donations and charges a flat 5% only on Ko-fi Gold features (shop, memberships)" — which is backwards; Gold is the state with **no** fees. | `src/content/blog/patreon-fees-and-earnings.md:113` | proposed as CHIP-FEE-BLOG-KOFI |
| medium | Dead copy-results URLs: the class is **exactly 5**, enumerated programmatically. One fixed here; the other four are on sibling chips' files this wave. | `src/components/calculators/*.tsx` | fixed here (1 of 5); 4 assigned |
| medium | `DropdownInput` has no `aria-describedby` linking its `helpText`, unlike `NumberInput`/`CurrencyInput`. `CLAUDE.md` requires it on all inputs. My new plan selector inherits the gap. | `src/components/ui/inputs/DropdownInput.tsx:47` | left: shared file, not owned |
| medium | `SourcesBlock.astro` is hard-coded to tax prose ("tax year X", "confirm with the IRS"). D-011 puts platform fees under the same regime but there is no component to render their citations. | `src/components/calculator/SourcesBlock.astro:33,46` | left: wrote an inline sources section instead |
| low | No guard equivalent to `check:tax-data` exists for platform fees, so D-011's "enforced by a guard" clause is unimplemented. | `scripts/` | proposed as CHIP-FEE-GUARD |
| low | The calculator has no input for Ko-fi crowdfunding Goals or **monthly recurring tips**, which have different fee treatment on Ko-fi Free (0% and 5% respectively). | `src/lib/calculators/kofi-earnings.ts` | left: documented in the module's NOT MODELLED block |

### 1. What I saw outside my scope

**The blog is now the worst version of the defect, and it links into the fixed page.** `kofi-vs-patreon-comparison.md` is not a page with a stale number on it; it is a page whose *entire thesis* is the $6/$120 break-even arithmetic, worked step by step across four sections, and it CTAs into `/creator/kofi-calculator`. A reader who follows that CTA now sees the corrected calculator contradict the article that sent them. It also runs the Patreon Lite/Pro/Premium menu that D-012 rejected `CHIP-CTR-CALC` for publishing. Correcting the calculator without correcting this post arguably makes the *inconsistency* more visible, not less. I would sequence it immediately.

**The hydration mismatch is a real cost that nobody has costed.** Every calculator island throws `Hydration failed because the server rendered HTML didn't match the client` on load. React's recovery is to throw away the server HTML and client-render from scratch. On `client:visible` pages that means the visible, already-painted calculator is torn down and rebuilt the moment it scrolls into view. The mechanism is that `useCalculatorState` initialises from `window.location` (via `getInitialState`/`getInitialMode`), which the server cannot see, so the first client render can differ from the server render whenever a `?s=` or `?mode=` param is present — and one of the mismatches (`className="text-sm text-neutral-500"`, the quick-mode hint paragraph) fires from the `mode` param. Given that the site's Core Web Vitals feed the same rankings D-008 is protecting, this seems worth measuring before Wave 2 retitling starts, if only to avoid attributing a CWV change to the retitle.

**A "Ko-fi is zero-fee" narrative had propagated into the design of the product itself.** The false 0%-on-shop claim was not just a sentence — it shaped the Advanced-mode layout (shop inputs grouped as the high-margin stream), the tips list, the strategy advice ("shift revenue into shop sales"), and the comparison table's framing. Correcting the arithmetic required rewriting the argument, not just the numbers. That is worth knowing when scoping the Patreon, Gumroad and Substack equivalents: they are not find-and-replace jobs.

**The fact file's most valuable finding is not in anyone's spawn prompt.** § 8 notes that Ko-fi is the only one of the five platforms charging 0% on its core product and the only one that never holds the creator's money. That second fact — no payout fee, no payout minimum, funds land in the creator's own processor account — is a genuine differentiator against Gumroad's $100 floor and Patreon's per-payout charge, and it appeared nowhere on the site. I put it on the page. It looks like exactly the "information you cannot get from the platform's own site" that D-004 says is the binding constraint on AdSense.

### 2. Risks in what I built

- **V-K1 is the one I want reviewed.** My reading: the $12 price and the 5% rate are both **Confident** rows, so `12 / 0.05 = $240` is arithmetic on verified inputs, and D-010 states the $240 figure as a ruling. What V-K1 actually casts doubt on is whether a *new* creator can still buy Gold. So I published the arithmetic and **withheld the recommendation** — the page and the in-calculator card state the difference in dollars and then say, from Confident rows, that Ko-fi's own Gold page is headed "You no longer need Ko-fi Gold" while its Help Centre breakdown omits Gold, and to check Ko-fi's current pricing. I did not pick a plausible answer to V-K1 in either direction; I reported Ko-fi's own contradiction. **If the Command Center reads D-011 as blocking the $240 figure outright, the fix is one edit to the two prose paragraphs plus the FAQ answer — the constant itself is derived in the module and would not change.** Flagging rather than assuming, because D-011 is the later ruling and its blanket Verify clause could be read to override D-010's explicit $240.
- **The default answer on the page changed**, because Standard is now the default and the fee hits the right products. That is the point, but it means every screenshot, every cached SERP snippet, and any external write-up citing this calculator's output is now stale. Expected, but it will look like a regression to anyone who remembers the old numbers.
- **Legacy `?s=` links with `goldMember: false` silently become Standard.** Unavoidable: the old boolean conflated Free and Standard, so `false` cannot be disambiguated. I migrated only `true`, which is unambiguous. Anyone who shared a "free tier" link gets a slightly worse take-home than they shared. Alternative would have been to map `false` → `free`, which would have been a guess in the creator's favour and wrong for the majority who are actually on Standard.
- **I promoted the plan selector into Quick mode**, which was not asked for. Justification is in Measurements: it is a $25/month swing on $500 of revenue and the winning plan flips by product mix, so leaving the most decision-relevant input hidden behind Advanced mode would have left the default answer wrong for most visitors. It adds one control to the page's above-the-fold density on the site's best-converting page, which is a real if small risk.
- **The comparison table now carries Patreon, Gumroad, BMC and Substack figures.** Those are all Confident rows in the fact file, and the sibling chips own the *calculators*, not this page's prose. But if a sibling lands a different characterisation of the same fees on their own page, the two pages could disagree. Worth a consistency pass at Integrator time.
- **`npx tsx` was used for the worked examples**, so they are the module's real output, not hand arithmetic. The $1,015 example aggregates two membership tiers (40 × $3 + 25 × $8) into one average price of $4.923 because the calculator has a single membership-price input. Gross, transaction count and totals are all faithful; the per-tier split in the prose is descriptive.

### 3. Proposed follow-up chips

- **CHIP-FEE-BLOG-KOFI** — owns `src/content/blog/kofi-vs-patreon-comparison.md` and `src/content/blog/patreon-fees-and-earnings.md`. Corrects Gold pricing, break-even, the shop-fee direction, and the non-existent Patreon plan menu. Must run **after** the Patreon fee chip merges so both posts land on one consistent Patreon story. Blocked by V-K1 in the same way this chip was. *Recommend Opus, high effort* — it is a rewrite of an argument, not a find-and-replace, and it is YMYL-adjacent money copy.
- **CHIP-FEE-GUARD** — owns a new `scripts/check-platform-fees.mjs` plus its `package.json` script. Implements D-011's unimplemented "enforced by a guard" clause: a `SUPERSEDED` denylist for retired figures (`$6/month` Ko-fi Gold, `$120` break-even, Patreon `Lite`/`Premium`, Gumroad "flat 10%" with no `$0.50`, Substack without `0.7%`) checked across `src/**` including `.astro` prose and `.md` blog content, exactly as `check-tax-data.mjs` does. This is the mechanism that makes D-011 self-enforcing rather than decaying. *Recommend Sonnet, medium effort* — the pattern is already written in `scripts/check-tax-data.mjs`.
- **CHIP-HYDRATION** — owns `src/hooks/useCalculatorState.ts`. Measures the mismatch, then fixes it (initialise from defaults and apply URL state in an effect, or make the state read SSR-safe). Touches all 45 calculators' behaviour from one file, so it must run **alone**. *Recommend Opus, high effort* — blast radius is the whole site.
- **CHIP-A11Y-DROPDOWN** — owns `src/components/ui/inputs/DropdownInput.tsx`. Adds `aria-describedby` wiring to match the other shared inputs, per the `CLAUDE.md` rule. Trivially small; could be folded into any chip that already owns shared inputs. *Recommend Haiku or Sonnet, low effort.*
- **CHIP-SOURCES-PLATFORM** — a `PlatformSourcesBlock.astro` (or a `kind` prop on `SourcesBlock`) so every creator calculator renders citations with a verification date the way tax pages do, instead of each page hand-rolling prose as I had to. Should run after all four fee chips land, so it knows what it is rendering. *Recommend Sonnet, medium effort.*

### 4. Harness improvements

- **§5 says "load the affected page and confirm the behavior." On this repo you often cannot.** Calculator pages are `client:visible`, and the browser automation pane reports a 0×0 viewport, so the IntersectionObserver never fires and the island never hydrates — the page renders, and every number on it is the server render of `DEFAULT_INPUTS`, which looks convincing and is not the thing you meant to test. I lost time before spotting that `?s=` was absent from the URL, which is the reliable tell that hydration has **not** happened. The workaround is in the protocol's own architecture section without being flagged as one: **drive the `/embed/<category>/<slug>` route instead — it is the same component under `client:load` and hydrates immediately.** Suggest adding to §8 Environment traps: *"To runtime-check a calculator, use its `/embed/` route. Calculator pages are `client:visible` and will not hydrate in the automation pane. If the URL has no `?s=` param after load, you are looking at server-rendered defaults, not the calculator."*
- **§8 should record that `pkill -f "astro dev"` is needed**, and that a background `npm run dev` on port 4321 will collide with a sibling chip's dev server. I used `--port 4399`. Worth stating as a convention: pick a port from your chip name, not the default.
- **The protocol has no rule for "my spawn prompt and a ruling point in different directions."** §7 covers *quoted* ruling text beating a stale local `DECISIONS.md`, but not two rulings in tension (D-010 asserts $240; D-011 says Verify rows block downstream copy). I resolved it by splitting the claim — publish the arithmetic, withhold the recommendation, report the tension — but a stated rule would be better than my judgement. Suggest: *"If two rulings conflict, implement the narrowest action consistent with both, publish nothing that requires choosing between them, and open your Reflections with the conflict."*
- **The Rollback record template says "for any change to public-facing text: the exact prior value."** On a page where I rewrote most of the body copy, that section is longer than the diff and is mostly a transcription of things nobody should restore. It would be more useful if the template distinguished *"text protected by a ruling"* (record verbatim, prove byte-identical) from *"text being corrected"* (record the claim being retracted and why, not the prose). I did both above; the second half earns its length only because the retracted claims are the audit trail for a factual correction.
- **The "compute worked examples by running the calculator" rule needs a companion:** *re-run them after your last edit*. My first `npx tsx` run happened before I removed an unused result field; the figures were unaffected, but nothing in the process would have caught it if they had been.
- **§7's "verify reports exhaustively, including your own" paid off.** My prompt named one dead URL. The programmatic sweep confirmed exactly five and confirmed the other four were already assigned — which converted "should I flag this?" into a checkable fact. Recommend the protocol suggest committing such sweep scripts to the scratchpad and pasting them into notes, so the next chip re-runs rather than re-derives.

### 5. Model tier feedback

Opus/high was right, and it was not the arithmetic that made it so — `12 / 0.05` needs no model at all. It was the judgement calls, each of which could have quietly produced a wrong page:

- Deciding that D-010's `$240` and D-011's Verify block could both be honoured by splitting arithmetic from recommendation, rather than either publishing a purchase recommendation or stopping dead.
- Noticing that "Offer annual memberships" is **not in the fact file** and therefore had to come out, even though it is plausible, harmless-sounding, and nobody asked me to audit it.
- Recognising that the false 0%-shop claim had propagated into the page's *structure* and strategy advice, so a numeric find-and-replace would have left a page that was arithmetically right and rhetorically still wrong.
- Deciding **not** to publish hand-computed cross-platform take-home figures in the comparison table, because I could not run those calculators to produce them.

A cheaper tier would very likely have done the find-and-replace, kept the $240 recommendation without the V-K1 caveat, and left the strategy section intact. For the three sibling fee chips I would keep Opus for Patreon (the plan menu is an argument rewrite plus a legacy/standard split) and would consider Sonnet for Gumroad, where the correction is genuinely arithmetic — add `+ $0.50`, add Discover — provided the page copy audit stays with a higher tier.
