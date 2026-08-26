# CHIP-CENTS-SWEEP

**Lane:** implementation
**Owns:** `src/components/calculators/*.tsx` (all 45), `docs/notes/CHIP-CENTS-SWEEP.md`
**Model:** Opus, high effort
**Ruling:** D-013 — fix per call site; `formatCurrency` itself is **not** modified.

---

## What shipped

`src/lib/utils/formatters.ts` was **not touched**, per D-013.

**98 of 553** plain `formatCurrency()` call sites switched to `formatCurrencyWithCents()`
across **22 of 45** components, plus **5** `formatFn={formatCurrency}` props (see the
`ResultCard` finding below — those five are why the first pass silently did nothing on
five headline cards).

| File | Sites | What became cents |
|---|---|---|
| `AmazonFlexCalc.tsx` | 3 | `effectiveHourlyRate`, `perBlockNet` |
| `BreakEvenCalc.tsx` | 6 | `contributionMargin`, `variableCostPerUnit`, `pricePerUnit` |
| `DoorDashCalc.tsx` | 4 | `effectiveHourlyRate`, `earningsPerDelivery`, `costPerMile` |
| `DropshippingMarginCalc.tsx` | 13 + 1 fn | the whole per-order ledger + `profitPerOrder` |
| `EtsyFeesCalc.tsx` | 13 + 1 fn | the whole per-sale ledger (`listingFee` … `netProfit`) |
| `FreelanceWritingRateCalc.tsx` | 2 + 1 fn | `effectiveHourlyRate` |
| `FreelancerRateCalc.tsx` | 1 | `effectiveHourlyAfterTax` |
| `InstacartCalc.tsx` | 3 | `effectiveHourlyRate`, `earningsPerBatch` |
| `KofiCalc.tsx` | 12 | the monthly fee ledger + the two fee sentences in body copy |
| `OnlineCourseCalc.tsx` | 2 + 1 fn | `revenuePerStudent` |
| `PodcastSponsorshipCalc.tsx` | 2 | `effectiveCPM` |
| `ProfitMarginCalc.tsx` | 1 | `profitPerUnit` |
| `ProjectRateCalc.tsx` | 2 | `effectiveHourlyRate` |
| `ResellingProfitCalc.tsx` | 11 + 1 fn | the whole per-item ledger + net-profit-per-hour |
| `SubstackCalc.tsx` | 7 | `revenuePerSubscriber` + the Stripe/Substack fee ledger |
| `TaskRabbitCalc.tsx` | 3 | `effectiveHourlyRate`, `perTaskNet` |
| `TikTokCalc.tsx` | 2 | `perVideo` |
| `TutoringIncomeCalc.tsx` | 2 | `effectiveHourlyRate` |
| `TwitchRevenueCalc.tsx` | 2 | `revenuePerViewer` |
| `UberLyftCalc.tsx` | 3 | `effectiveHourlyRate`, `costPerMile` |
| `ValueBasedPricingCalc.tsx` | 2 | `effectiveHourlyRate` |
| `YouTubeAdSenseCalc.tsx` | 2 | `earningsPerVideo` (its `Math.round()` wrapper dropped) |

Components using the cents variant: **4 → 26 of 45**.

---

## Measurements

### Call-site census (source)

| | Count |
|---|---|
| Component files | 45 |
| `formatCurrency(` sites, before | **553** |
| `formatCurrencyWithCents(` sites, before | 36 (Gumroad 15, POD 10, SubAudit 9, Patreon 2) |
| Converted by this chip | **98** (17.7%) |
| Deliberately left whole | **455** (82.3%) |
| `formatFn={formatCurrency}` props corrected | 5 of 65 |

The spawn prompt said 2 of 45 components used the cents variant. The repo says **4** —
`GumroadCalc` and `PatreonCalc` landed their fixes in the Wave 2 merge that this worktree
branches from. Trusting the repo over the notes, per §7.

### The threshold, as arithmetic

Every logic module was executed against its own `DEFAULT_INPUTS` (`npx tsx`) and each
rendered field's whole-dollar rounding error computed. The rule applied:

> Convert iff the quantity is a **measured per-unit rate** (denominator = hour, mile, sale,
> order, item, delivery, batch, block, task, video, viewer, subscriber, student, 1000
> downloads), **or** it is a line in a **fee / per-transaction ledger** in which some line
> rounds with **≥ 2% error**. Everything else stays whole.

2% is the point at which the second significant digit of the displayed figure is wrong.
The measured distribution splits cleanly on it and does the discriminating for us:

| Field | Value at defaults | Rounds to | Error | Call |
|---|---|---|---|---|
| `etsy.listingFee` | 0.20 | `$0` | **100%** | cents |
| `doordash.costPerMile` | 0.14 | `$0` | **100%** | cents |
| `uberLyft.costPerMile` | 0.33 | `$0` | **100%** | cents |
| `dropshipping.refundCost` | 1.20 | `$1` | 16.7% | cents |
| `dropshipping.processingFee` | 1.16 | `$1` | 13.8% | cents |
| `etsy.paymentProcessingFee` | 1.15 | `$1` | 13.0% | cents |
| `etsy.totalFees` | 3.30 | `$3` | 9.1% | cents |
| `reselling.platformFee` | 5.30 | `$5` | 5.7% | cents |
| `substack.stripeBillingFee` | 6.65 | `$7` | 5.3% | cents |
| `doordash.effectiveHourlyRate` | 12.60 | `$13` | 3.2% | cents |
| `reselling.netProfit` | 9.70 | `$10` | 3.1% | cents |
| `amazonFlex.effectiveHourlyRate` | 17.35 | `$17` | 2.0% | cents |
| `kofi.platformFees` | 11.25 | `$11` | 2.2% | cents (ledger) |
| — threshold — | | | **2%** | |
| `valueBased.effectiveHourlyRate` | 109.91 | `$110` | 0.1% | cents *(class rule)* |
| `meetingCost.costPerMeeting` | 308.33 | `$308` | 0.1% | **whole** |
| `consulting.hourlyRate` | 253.00 | `$253` | 0.0% | **whole** |
| `newsletter.platformFee` | 237.50 | `$238` | 0.2% | **whole** |
| `freelanceVacation.costPerVacationDay` | 613.46 | `$613` | 0.1% | **whole** |

The one place the class rule overrides the arithmetic is `effectiveHourlyRate`: it is the
same named measured quantity in 9 calculators, ranging $12.60–$126.50. Formatting it with
cents on DoorDash and without on Value-Based Pricing would be the real inconsistency, so
all 9 are cents.

### The threshold, as *rendered* output

Source measurement is not the deliverable — rendered output is. Every `$…` string in all
145 built pages was extracted before and after (6,132 strings), then diffed positionally.

| | Count |
|---|---|
| Rendered money strings, total | 6,132 |
| Changed | **130** (2.1%) |
| — corrected a wrong figure | **82** |
| — gained a cosmetic `.00` | 48 |
| Pages with a changed string | 38 of 145 |
| Pages whose money-string **count** changed | **0** (no structural drift) |

All 48 `.00` additions are per-unit figures or ledger lines. **No headline annual or
monthly `ResultCard` gained `.00`** — the change D-013 rejects. Verified live: Ko-fi still
reads "Monthly Take-Home **$10** / Annual Earnings **$118**", Substack "Monthly Net **$47**
/ Annual Revenue **$560**", DoorDash "Weekly Net **$189** / Monthly Net **$818** / Annual
Net **$9,828**".

---

## Verification

```
npm install                → ok
npm run build              → 0 errors, 0 warnings (after rm -rf .astro dist)
npm run check:tax-data     → "Tax data clean — TY2026, verified August 9, 2026"
```

### Rendered-output greps over `dist/client/` (apostrophes unescaped first — `&#39;`)

| Pattern | Hits | |
|---|---|---|
| `$1/sale` (the Gumroad rendering) | **0** | |
| `-$0` not followed by decimals (the Patreon rendering) | **0** | |
| `$0/mile` | **0** | |
| `$0/<unit>` | 4 | all four are the hardcoded Ko-fi plan prices — Standard and Free genuinely cost **$0/mo**. Not formatter output. |

### Driven live through `/embed/<category>/<slug>` (4 calculators)

`client:visible` islands do not hydrate headlessly, so the embed route was used throughout.
The browser pane also reported `viewport 0x0` and `read_page` returned "(empty page)" even
after `resize_window`, so inputs were varied by constructing the site's own base64 `?s=`
URL state rather than by clicking.

- **`/embed/creator/etsy-fee-calculator`** — Listing Fee `$0.20` (was `$0`), Transaction
  `$1.95`, Processing `$1.15`, Total Fees `$3.30`, Gross `$30.00`, Net Profit `$15.70`.
  Ledger reconciles: 30.00 − 3.30 − 11.00 = 15.70.
- **`/embed/gig-economy/doordash-calculator`** — `$0.14/mile gas` (was `$0/mile gas`),
  Effective Hourly `$12.60`, Per Delivery `$7.00`; weekly/monthly/annual all still whole.
- **`/embed/creator/kofi-calculator?s=…`** at small-creator scale (4 tips × $3) — Service
  Fee `-$0.60` (was `-$1`), Processing `-$1.55` (was `-$2`), Gross `$12.00`, Net `$9.85`.
  **The old ledger did not add up**: it read 12 − 1 − 2 with a net of $10.
- **`/embed/creator/substack-calculator?s=…`** (12 subs @ $5) — Stripe Billing Fee
  `-$0.40`, which previously rendered **`-$0`** — the exact Patreon defect, in a second
  calculator, found only by driving it.

---

## Rollback record

Restoring a string does not restore a ranking. Prior public-facing values, verbatim
(non-embed pages; each `/embed/…` twin changed identically). Every change is a one-token
swap between `formatCurrency` and `formatCurrencyWithCents` at a named line — fully
reversible.

| Page | Label | Was (verbatim) | Now |
|---|---|---|---|
| `creator/etsy-fee-calculator` | Net Profit | `$16` | `$15.70` |
| `creator/etsy-fee-calculator` | Total Fees (×2) | `$3` | `$3.30` |
| `creator/etsy-fee-calculator` | Listing Fee | `$0` | `$0.20` |
| `creator/etsy-fee-calculator` | Transaction Fee (6.5%) | `$2` | `$1.95` |
| `creator/etsy-fee-calculator` | Payment Processing | `$1` | `$1.15` |
| `creator/etsy-fee-calculator` | Gross Revenue | `$30` | `$30.00` |
| `creator/kofi-calculator` | Total Fees description | `$28` | `$28.28` |
| `creator/kofi-calculator` | Tip Revenue | `$100` | `$100.00` |
| `creator/kofi-calculator` | Membership Revenue | `$50` | `$50.00` |
| `creator/kofi-calculator` | Shop Sales | `$75` | `$75.00` |
| `creator/kofi-calculator` | Gross Monthly | `$225` | `$225.00` |
| `creator/kofi-calculator` | Ko-fi Service Fee | `$11` | `$11.25` |
| `creator/kofi-calculator` | Payment Processing | `$17` | `$17.03` |
| `creator/kofi-calculator` | Net Monthly | `$197` | `$196.73` |
| `creator/online-course-revenue-calculator` | Revenue per Student | `$172` | `$171.59` |
| `creator/podcast-calculator` | Effective CPM | `$56` | `$56.00` |
| `creator/substack-calculator` | Per Subscriber | `$8` | `$7.99` |
| `creator/substack-calculator` | Monthly Gross | `$950` | `$950.00` |
| `creator/substack-calculator` | Substack Fee (10%) | `$95` | `$95.00` |
| `creator/substack-calculator` | Stripe Processing | `$49` | `$49.30` |
| `creator/substack-calculator` | Stripe Billing Fee (0.7%) | `$7` | `$6.65` |
| `creator/substack-calculator` | Net Revenue | `$799` | `$799.05` |
| `creator/tiktok-calculator` | Per Video | `$31` | `$30.59` |
| `creator/twitch-calculator` | Revenue Per Viewer | `$5` | `$4.73` |
| `creator/youtube-adsense-calculator` | Per Video (Est.) | `$12` | `$12.03` |
| `freelance/break-even-calculator` | Contribution Margin (×3) | `$35` | `$35.00` |
| `freelance/break-even-calculator` | Variable Cost/Unit | `$15` | `$15.00` |
| `freelance/break-even-calculator` | Price/Unit | `$50` | `$50.00` |
| `freelance/hourly-rate-calculator` | Effective Hourly (After Tax) | `$56` | `$56.00` |
| `freelance/project-rate-calculator` | Effective Hourly | `$127` | `$126.50` |
| `freelance/value-based-pricing-calculator` | Effective Hourly Rate | `$110` | `$109.91` |
| `gig-economy/amazon-flex-calculator` | Effective Hourly | `$17` | `$17.35` |
| `gig-economy/amazon-flex-calculator` | Per Block Net | `$69` | `$69.40` |
| `gig-economy/doordash-calculator` | Effective Hourly | `$13` | `$12.60` |
| `gig-economy/doordash-calculator` | Per Delivery | `$7` | `$7.00` |
| `gig-economy/doordash-calculator` | Weekly Miles / gas | `$0` | `$0.14` |
| `gig-economy/instacart-calculator` | Hourly Rate | `$16` | `$15.98` |
| `gig-economy/instacart-calculator` | Per Batch | `$16` | `$15.98` |
| `gig-economy/taskrabbit-calculator` | Effective Hourly | `$25` | `$24.62` |
| `gig-economy/taskrabbit-calculator` | Per Task Net | `$62` | `$61.56` |
| `gig-economy/uber-lyft-calculator` | Effective Hourly | `$21` | `$21.25` |
| `gig-economy/uber-lyft-calculator` | Cost Per Mile | `$0` | `$0.33` |
| `side-hustle/dropshipping-margin-calculator` | Profit Per Order (×2) | `$16` | `$15.63` |
| `side-hustle/dropshipping-margin-calculator` | Selling Price (×2) | `$40` | `$39.99` |
| `side-hustle/dropshipping-margin-calculator` | Supplier Cost | `$12` | `$12.00` |
| `side-hustle/dropshipping-margin-calculator` | Ad Spend | `$8` | `$8.00` |
| `side-hustle/dropshipping-margin-calculator` | Platform Fee | `$0` | `$0.00` |
| `side-hustle/dropshipping-margin-calculator` | Processing Fee | `$1` | `$1.16` |
| `side-hustle/dropshipping-margin-calculator` | Returns | `$2` | `$2.00` |
| `side-hustle/dropshipping-margin-calculator` | Refunds | `$1` | `$1.20` |
| `side-hustle/dropshipping-margin-calculator` | Total Per-Order Costs | `$24` | `$24.36` |
| `side-hustle/freelance-writing-rate-calculator` | Effective Hourly Rate | `$50` | `$50.00` |
| `side-hustle/reselling-profit-calculator` | Net Profit (×2) | `$10` | `$9.70` |
| `side-hustle/reselling-profit-calculator` | Selling Price | `$40` | `$40.00` |
| `side-hustle/reselling-profit-calculator` | Purchase Price | `$15` | `$15.00` |
| `side-hustle/reselling-profit-calculator` | Platform Fee | `$5` | `$5.30` |
| `side-hustle/reselling-profit-calculator` | Shipping Cost | `$8` | `$8.00` |
| `side-hustle/reselling-profit-calculator` | Materials | `$2` | `$2.00` |
| `side-hustle/tutoring-income-calculator` | Effective Hourly | `$40` | `$40.12` |

No page `title`, `description`, or `<h1>` was touched.

---

## Changelog entry (pre-drafted — Integrator merges this)

- **Per-unit figures now render in cents (D-013).** Swept all 553 `formatCurrency()` call
  sites across the 45 calculator components and converted 98 of them — per-unit, per-sale
  and fee-ledger figures — to `formatCurrencyWithCents()`. Etsy's listing fee rendered as
  `$0` instead of `$0.20`; DoorDash and Uber/Lyft cost-per-mile as `$0` instead of `$0.14`
  and `$0.33`; Substack's Stripe billing fee as `-$0`; small Ko-fi fee ledgers did not add
  up. Headline annual and monthly totals deliberately stay whole-dollar, and
  `formatCurrency` itself is unchanged.

---

## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| high | `ResultCard` **ignores `value=` entirely** when `numericValue`+`formatFn` are both passed — it renders `formatFn(animated)`. Converting `value=` alone is a silent no-op on those cards. Hit 5 of them; caught only by driving the page, since SSR and hydration disagree. | `src/components/ui/results/ResultCard.tsx:36` | fixed here (5 `formatFn` props) |
| high | Substack's Stripe billing fee rendered `-$0` for a small newsletter — the Patreon defect in a second calculator, not previously reported | `SubstackCalc.tsx:156` | fixed here |
| high | Ko-fi's fee ledger did not arithmetically reconcile at small scale: `$12 − $1 − $2` displayed with a net of `$10` | `KofiCalc.tsx:268–299` | fixed here |
| medium | Three fields dodge `formatCurrency` with hand-rolled `.toFixed(2)` / a bespoke formatter instead of using `formatCurrencyWithCents` — the bug was known locally and worked around three times rather than fixed | `NewsletterCalc.tsx:40,234`; `YouTubeAdSenseCalc.tsx:137`; `FreelanceWritingRateCalc.tsx:29,174` | left: cosmetic, correct output |
| medium | The two Wave 2 fee chips left **contradictory conventions**: Gumroad converted its whole ledger to cents, Patreon converted only the sub-dollar flat fees. Patreon's ledger is now mixed-precision and does not reconcile — the rendered page reads `$500 − $50 − $45 − $0.25` = `$404.75` against a stated Net Earnings of `$405` (true net $405.25; the $44.50 processing fee is what displays as `$45`) | `PatreonCalc.tsx:170–216` | left: not in my brief; proposed below |
| medium | Instacart's "Hourly Rate" and "Per Batch" cards render the **identical** value ($15.98) at defaults, because `hoursPerWeek` and weekly batches coincide. Reads as a bug to a user. | `instacart-earnings.ts:60–61` | left: needs a defaults change, product call |
| low | 60 `formatFn={formatCurrency}` props remain. Each is a latent repeat of the same trap for any future chip that edits a `value=` | `src/components/calculators/*.tsx` | left: correct today |
| low | `newsletter.revenuePerSubscriber` is $0.44 at defaults and would render `$0` — it escapes only because it uses `.toFixed(2)` | `NewsletterCalc.tsx:234` | left: renders correctly |

### 1. What I saw outside my scope

The `ResultCard` finding is the important one and it generalises past this chip. The
component takes both a pre-formatted `value` string and an optional `numericValue`+`formatFn`
pair, and when the pair is present **`value` is dead** — it is what SSR paints, then
hydration replaces it with `formatFn(animated)`. So the server HTML and the live page can
disagree about a number indefinitely, and nothing in the build catches it. My first pass
converted `value=` on five cards; `dist/` looked unchanged for those five (correctly — the
string was never used), and only loading the embed showed Etsy's Net Profit still reading
`$16` next to a ledger that now summed to `$15.70`. **Grepping `dist/` is necessary but not
sufficient on this codebase; for anything inside a `ResultCard` you must also hydrate it.**
That is a sharper version of the protocol's existing "measure the rendered value" rule and
I think §8 should carry it.

Second: measuring logic modules against `DEFAULT_INPUTS` **does not reproduce what the page
renders**. Most calculators default to Quick mode and merge `QUICK_MODE_DEFAULTS` over the
defaults before calling the calc function. I lost time on Twitch, where my scratch script
said `netAnnual` = $5,974.20 and the page said $5,674 — not a bug, just Quick mode. Any
chip computing an expected value from a logic module has to apply `QUICK_MODE_DEFAULTS`
first or it will chase a phantom.

Third, the workaround pattern: three separate places already print sub-dollar money with a
hand-rolled `` `$${x.toFixed(2)}` ``. Each author hit D-013's bug, recognised it locally,
and routed around it rather than reaching for the variant that already existed in the same
file. That is a decent signal that `formatCurrency`'s name is the trap — it reads like the
default choice. Renaming it `formatCurrencyWhole` would make the wrong call visible at
every call site; D-013 forbids changing its *behaviour*, not its name.

### 2. Risks in what I built

- **The 48 cosmetic `.00`s are the judgment call.** I converted three ledger blocks whole
  (Ko-fi, Substack, Dropshipping/Reselling/Etsy per-item) rather than only their offending
  lines, because a ledger reading `$225` − `$11.25` − `$17.03` = `$196.73` looks broken.
  That is the Gumroad precedent, but it does mean `Gross Monthly $225.00` now carries cents.
  If the Command Center reads that as D-013's rejected change, reverting is a one-token swap
  on the 4 Ko-fi and 2 Substack revenue lines and I'd not argue hard.
- **`effectiveHourlyRate` on the four freelance calculators** (writing, hourly-rate,
  project-rate, value-based) is under 0.5% error at defaults; I converted it on the class
  rule, not the arithmetic. `$50.00` and `$126.50` are the least defensible rows in the
  table.
- **Deliberately left whole, flagged as genuinely ambiguous** — per the brief, under-changing
  is recoverable: `costPerMeeting` ($308.33), `costPerVacationDay` ($613.46), `dailyRate`,
  `finalHourlyRate` (SideHustleGoal, $38.78), `perArticleRate` ($302.50), all quoted-price
  outputs (`hourlyRate`, `projectRate`, `monthlyRetainer`, `suggestedRate`, `packageTotal`,
  `perDeliverableRate`), the **Newsletter** fee ledger (smallest line $68.88, 0.2% error —
  it stays whole where Substack's converts, which is the threshold discriminating, not
  inconsistency), TikTok's `creatorFundRevenue` monthly line (RPM is $0.03, so a small
  creator's is sub-dollar, but it is an aggregate inside an all-aggregate block), and the
  Instacart/Tutoring weekly cost lines.
- YouTube's per-video card lost its `Math.round()`. The monthly/annual **ranges** keep
  theirs deliberately — they are estimates and rounding is the point.

### 3. Proposed follow-up chips

- **CHIP-RESULTCARD-COLLAPSE** — owns `src/components/ui/results/ResultCard.tsx` + the 60
  call sites still passing `formatFn`. Make `value` and `formatFn` mutually exclusive (or
  derive the static string from `formatFn(numericValue)`) so the SSR string and the hydrated
  string cannot diverge. This is the structural fix for the trap above and it is
  move-shaped — it must run alone.
- **CHIP-PATREON-LEDGER** — owns `PatreonCalc.tsx` only. Bring its fee ledger onto the
  Gumroad/Ko-fi convention so it reconciles. Small, and it settles the contradictory
  precedent the two Wave 2 chips left.
- **CHIP-INSTACART-DEFAULTS** — owns `instacart-earnings.ts` + `InstacartCalc.tsx`. Change
  the defaults so "Hourly Rate" and "Per Batch" stop coinciding.

### 4. Harness improvements

- §8 should record: **`ResultCard` ignores `value` when `formatFn` is supplied.** Cost me a
  full extra build/verify cycle and would have shipped a five-card silent no-op.
- §8 should record: **`QUICK_MODE_DEFAULTS` overrides `DEFAULT_INPUTS` on page load**, so a
  scratch script that imports a logic module and calls it with `DEFAULT_INPUTS` computes a
  number the page never shows.
- The `client:visible` warning in §8 is right but incomplete: on the embed route the pane
  still reported `viewport 0x0`, `read_page` returned "(empty page)", and `resize_window`
  did not fix it, so **no element could be clicked**. `get_page_text` worked fine. The
  reliable way to exercise non-default inputs is to build the site's own base64 `?s=` URL
  (`src/lib/utils/url-state.ts` — plain `btoa(JSON.stringify(state))`, plus
  `&mode=advanced`). Worth adding as the documented technique.
- `mcp__Claude_Browser__preview_start` insists on `.claude/launch.json` at the **main repo
  root**, which a worktree-isolated chip does not own and must not write. Fell back to
  `npx astro dev --port <free port>` in the background plus `preview_start` with a `url`.
  Worth recording, along with picking a non-4321 port so concurrent chips don't collide.
- The Bash tool refused several ordinary compound commands (`for` loops, `>` redirects to
  the scratchpad) as "too complex to verify". Combined with the existing no-heredocs note,
  the practical rule is: **write a `.py`/`.ts` file with `Write` and run it**. §8's heredoc
  note should be broadened.

### 5. Model tier feedback

Opus/high was right, and the reason is specific: the mechanical part (96 line-swaps) is
trivial, but the value was in (a) refusing to find-and-replace, (b) building the
before/after rendered-output diff to prove 82 corrections and 0 headline regressions, and
(c) noticing that five conversions were silently dead. A cheaper tier would very likely have
converted `value=` on those five cards, grepped `dist/`, seen no `-$0`, and reported success
— which is precisely the failure mode this chip exists to prevent. The classification of 553
sites also needed sustained judgment about which of D-013's two error modes each site risked.
