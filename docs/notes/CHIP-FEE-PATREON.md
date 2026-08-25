# CHIP-FEE-PATREON

**Lane:** implementation
**Owns:** `src/lib/calculators/patreon-earnings.ts`, `src/components/calculators/PatreonCalc.tsx`, `src/pages/creator/patreon-calculator.astro`, `docs/notes/CHIP-FEE-PATREON.md`
**Model:** Opus, high effort

---

## What shipped

### `src/lib/calculators/patreon-earnings.ts` — rewritten

The module previously modelled `{ lite: 0.05, pro: 0.08, premium: 0.12 }` under a
comment reading `// Patreon fee structure (2024)`. Per `docs/facts/creator-payment-fees.md`
§3, that plan menu closed on 2025-08-04 and "Lite"/"Premium" appear nowhere in
Patreon's current documentation. Replaced with:

| Plan key | Rate | Open to new creators? |
|---|---|---|
| `standard` | **10%** | **Yes — the only plan you can join** |
| `legacy_founders` | 5% | No, closed 2019-05-07 |
| `legacy_pro` | 8% | No, closed 2025-08-04 |
| `legacy_pro_merch` | 11% | No, closed 2025-08-04 |

Added a ~55-line source comment block in the style of `shared/tax-brackets.ts`,
citing the fact file, its two primary sources (S4 patreon.com/pricing, S5 the
Help Center "Creator fees overview" article), the verification date, and D-011.
It also states the modelling scope and — explicitly — what is *not* modelled and
why, so the gaps are visible rather than implied.

New exports: `PATREON_PLANS`, `PATREON_LEGACY_CUTOFF` (`'August 4, 2025'`),
`PATREON_FEES_LAST_VERIFIED` (`'August 25, 2026'`), types `PatreonPlan` /
`PatreonPayoutMethod`. The page imports the last two rather than restating them
as literals — same discipline as `TAX_YEAR` / `TAX_DATA_LAST_VERIFIED`.

Fee mechanics now modelled, all traced to Confident rows in the fact file:

- **Platform fee** — plan rate × gross.
- **Payment processing, standard plan** — 2.9% + $0.30 per patron, **with no
  micropayment rate**. The fact file quotes Patreon verbatim: the standard plan
  "applies the same processing rates to all payments, regardless of amount."
  This is the single most decision-relevant fact for a low-pledge creator and
  the calculator now surfaces it.
- **Payment processing, legacy Pro / Pro + Merch** — 5% + $0.10 when the average
  pledge is ≤ $3, otherwise 2.9% + $0.30.
- **Payment processing, Founders** — 1.6% + $0.30.
- **Currency conversion** — 2.5% on the share of gross paid in a currency other
  than the payout currency (new `crossCurrencyPct` input, default 0).
- **Payout transaction fee** — new `payoutMethod` input: direct deposit $0.25,
  PayPal 1% (min $0.25, cap $20), Payoneer Wallet $1.00. Assumes one payout per
  month, disclosed in the input help text.

New results fields: `currencyConversionFee`, `payoutFee`, `planRatePct`,
`planLabel`, `micropaymentApplied`, `processingRateLabel`.

**Stale-URL guard.** The input key was renamed `feeTier` → `plan`. Shared links
carrying `?s=` with the old `feeTier: 'premium'` would otherwise index into
`PATREON_PLANS` and produce `NaN`. `calculatePatreonEarnings` falls back to
`standard` for any unrecognised plan key; verified by running the function with
`plan: 'premium'` (returns Standard 10%, $405.25, finite).

### `src/components/calculators/PatreonCalc.tsx`

- Plan dropdown rewritten: `Standard — 10% (current plan)` first, then three
  options each labelled `Legacy: … (closed)`. Help text names the 2025-08-04
  cutoff and says to pick a legacy plan only if already grandfathered in.
- Two new advanced inputs (cross-currency share slider, payout method dropdown).
- New amber callout, shown only when a legacy plan is selected, warning that
  unpublishing or republishing the page forfeits the legacy rate permanently.
- Currency-conversion and payout-fee rows render only when non-zero, and use
  `formatCurrencyWithCents` — `formatCurrency` rounds to whole dollars and
  rendered the $0.25 payout fee as `-$0` (caught in the browser, not the source).
- Quick-mode copy and the "Pro tip" rewritten around the flat $0.30 charge.

### `src/pages/creator/patreon-calculator.astro`

`title`, `description` and `calculatorName` (which drives the `<h1>`) are
**untouched**, per the spawn prompt and D-012's Wave 2 retitling reservation.

- FAQ: the "5-12% … Lite/Pro/Premium" answer replaced; the "Which Patreon plan
  should I choose?" question — which asks the reader to take an action no reader
  can take — replaced with "Can I still get a cheaper Patreon plan?"; a new FAQ
  added on why small pledges lose so much.
- Intro, "How to Use", and deep-dive rewritten. The "Choosing the Right Plan"
  section is gone; "Legacy Plans: Only If You Already Have One" replaces it.
- Both deep-dive tables regenerated from `calculatePatreonEarnings()` output.
- New "Fee Data & Last Updated" block at the foot: verification date (imported,
  not a literal), both primary source links, and an explicit statement of what
  the model does not cover.

---

## Verification

```
npm install                # completed; worktree had no node_modules
rm -rf .astro dist
npm run build              # "[build] Complete!" — 0 errors, 0 warnings
                           # (grepped the full log for error/warn/✘: no matches)
npm run check:tax-data     # ✓ Tax data clean — TY2026, verified August 9, 2026,
                           #   no superseded figures outside the shared modules
git status --short         # only the 3 owned src files modified
```

**Worked examples were computed by running the calculator**, not by hand — a
scratch script imported `calculatePatreonEarnings` via `npx tsx` and printed the
pledge sweep, the plan comparison, and both worked examples. Every number in the
page tables is a line of that output.

**Runtime check.** Served `dist/client/` and loaded the built page. Confirmed in
the *rendered* HTML: no "Lite"/"Premium" as live plan names, no "5-12%", no
"8-15%"; `43.2%`, `$1,333.35`, `August 4, 2025` ×4, `August 25, 2026` ×1 all
present. Then exercised the hydrated component and confirmed:

| Scenario | Rendered result |
|---|---|
| Default (100 × $5, standard) | Gross $500 · fee $50 · processing $45 · payout $0.25 · **net $405** · 19% |
| Legacy Pro, 100 × $3 | Fee $24 · processing $25 (micropayment 5% + $0.10 applied) · **net $251** · 16.4% · legacy warning banner shown |
| Standard, 200 × $8, 50% cross-currency, PayPal payout | Conversion **-$20.00** · payout **-$13.14** (1% of $1,313.60) · net $1,300 |

**Environment caveat, stated plainly:** the interactive check was done on
`/embed/creator/patreon-calculator/` (`client:load`) rather than the page route
(`client:visible`). On the page route the island never hydrated in this harness
because the Browser pane reports `window.innerHeight === 0` while hidden, so
`IntersectionObserver` can never fire. Same component, same module; the page
route's server-rendered HTML was verified separately in `dist/client/`.

---

## Measurements

Effective fee rate against average pledge, standard plan, 100 patrons, from the
real function (this is the distribution the page's headline claim rests on):

| Pledge | Gross | Platform | Processing | Total | Net | Effective |
|---|---|---|---|---|---|---|
| $1 | $100 | $10.00 | $32.90 | $43.15 | $56.85 | **43.2%** |
| $2 | $200 | $20.00 | $35.80 | $56.05 | $143.95 | 28.0% |
| $3 | $300 | $30.00 | $38.70 | $68.95 | $231.05 | 23.0% |
| $5 | $500 | $50.00 | $44.50 | $94.75 | $405.25 | 19.0% |
| $10 | $1,000 | $100.00 | $59.00 | $159.25 | $840.75 | 15.9% |
| $25 | $2,500 | $250.00 | $102.50 | $352.75 | $2,147.25 | 14.1% |
| $50 | $5,000 | $500.00 | $175.00 | $675.25 | $4,324.75 | 13.5% |

Plan comparison at 100 patrons × $5 (net / effective): Standard $405.25 / 19.0%,
Founders $436.75 / 12.7%, Pro $415.25 / 17.0%, Pro + Merch $400.25 / 20.0%.

At 100 × **$3**, legacy Pro (8%) nets **$250.75** and beats Founders (5%) at
**$249.95**, because the legacy micropayment rate's $0.10 flat charge beats
Founders' $0.30. That inversion is on the page; it is the kind of thing hand
arithmetic would never have surfaced.

**A hand-written number I caught in my own draft:** the first pass of the "Pro
tip" said a $2 pledge "loses about 25% to processing alone." It is 17.9%
(2.9% + $0.30/$2). Corrected to the verified figures — 32.9% at $1, 17.9% at $2,
5.9% at $10. Protocol §8's "compute worked examples by running the calculator"
should be read as covering *every* number in prose, not just the ones in tables.

---

## Rollback record

Exact prior values of public-facing text. Restoring a string does not restore a
ranking — and in this case the prior strings were factually false, so a rollback
would republish a fee menu that has not existed since 2025-08-04.

**Unchanged (deliberately):** `title` = `"Patreon Calculator - Estimate Your Creator Earnings"`,
`description` = `"Calculate your Patreon earnings after fees. See how much you'll actually take home based on patron count, pledge amount, and plan tier."`,
`calculatorName` = `"Patreon Earnings Calculator"`, `ogImage`, `slug`,
`relatedCalculators`.

### FAQ — prior text

> **Q:** How much does Patreon take from creators?
> **A:** Patreon takes between 5-12% depending on your plan: Lite (5%), Pro (8%), or Premium (12%). On top of this, payment processing fees apply (typically 2.9% + $0.30 per transaction). For most creators, total fees range from 8-15% of gross earnings.

> **Q:** Which Patreon plan should I choose?
> **A:** Start with Lite (5%) if you just need basic features. Choose Pro (8%) for most creators—it includes analytics, merch integration, and promotional tools. Premium (12%) is for larger creators needing team accounts and dedicated support.

The two FAQs on churn rate and realistic earnings are unchanged. The FAQ array is
consumed by `FAQPage` JSON-LD, so both of the above were also in structured data.

### Intro prose — prior text

> Your take-home from Patreon depends on three factors: the number of active patrons, their average pledge amount, and the fees deducted by Patreon and payment processors. Patreon offers three plan tiers — Lite at 5%, Pro at 8%, and Premium at 12% — each with different feature sets. Payment processing fees (typically 2.9% plus $0.30 per transaction) apply on top of the platform fee, meaning your total fee burden ranges from roughly 8% to 15% of gross revenue.

> After 12 months, you would have roughly 155 active patrons generating about $660 per month after fees.

(The second sentence is now "roughly 184 active patrons producing about $920 per
month gross and $746 per month net" — simulated at +20 patrons/month with 5%
monthly churn, then run through the calculator. The prior 155/$660 pair matches
no plan, old or new.)

### "How to Use" prose — prior text

> **Advanced Mode:** … You can set your monthly churn rate, select your Patreon plan tier (Lite at 5 percent, Pro at 8 percent, or Premium at 12 percent), and adjust payment processing assumptions. …

> **Choosing the Right Plan** (h3)
> The Lite plan at 5 percent is tempting for its low fee, but it lacks analytics, merch integration, and promotional tools that help you grow. Most creators benefit from the Pro plan at 8 percent, which pays for itself through better conversion and retention tools. Only consider Premium at 12 percent if you need team accounts or manage a high-volume page where dedicated support saves you significant time.

The Quick Mode paragraph previously read "The calculator applies standard Patreon
fees to produce your estimated monthly and annual take-home." The "Maximizing
Patron Retention" h3 and its paragraph are unchanged.

### Deep-dive — prior text

> **Patreon Plan Comparison** (h2)
> Choosing the right Patreon plan directly affects your take-home. The table below compares what you keep at different revenue levels across all three plans, including estimated payment processing fees.

Prior table (headers `Monthly Gross | Lite (5%) | Pro (8%) | Premium (12%)`):

| Monthly Gross | Lite (5%) | Pro (8%) | Premium (12%) |
|---|---|---|---|
| $500 | $440 | $425 | $405 |
| $1,000 | $885 | $855 | $815 |
| $2,500 | $2,225 | $2,150 | $2,050 |
| $5,000 | $4,460 | $4,310 | $4,110 |
| $10,000 | $8,930 | $8,630 | $8,230 |

> At $1,000/month gross, the difference between Lite and Pro is about $30/month. Whether Pro's additional features — analytics, promo tools, merch integration, and app access — are worth $360/year depends on how actively you use them to retain and convert patrons.

> **Worked Example: Growing from 0 to 200 Patrons** (h2 — heading changed to "Worked Example: Launching with 200 Patrons")
> … If 70% choose the $5 tier (140 patrons = $700) and 30% choose the $15 tier (60 patrons = $900), your gross is $1,600/month. On the Pro plan (8%) with payment processing (~3.5%), your take-home is roughly $1,416/month or $16,992/year.
> … After 12 months, you would have approximately 260 patrons generating around $2,080 gross and $1,841 net per month.

(Now $1,333.35/month and $16,000/year at 200 × $8, and $1,733.43/month at 260 × $8.)

The four "Reducing Churn" paragraphs are unchanged except the annual-billing one,
which previously began "Annual subscribers churn at roughly one-third the rate of
monthly subscribers. Even a small discount…" and now adds the flat-fee point.

### Component strings — prior text

| Location | Prior |
|---|---|
| Quick-mode subtitle | `Using Pro tier (8% fee) and 5% monthly churn` |
| Quick-mode footer | `Based on Pro tier (8% + payment processing) and 5% monthly churn.` |
| Dropdown options | `Lite (5%)` · `Pro (8%)` · `Premium (12%)` |
| Dropdown help text | `Your Patreon membership tier` |
| Processing tooltip | `Credit card and PayPal transaction fees (2.9% + $0.30 per transaction)` |
| Pro tip | `Reduce churn by engaging regularly with patrons and offering exclusive content. Even a 1% churn reduction significantly impacts annual revenue.` |
| Copy-results text | had no plan line; otherwise unchanged |

---

## Changelog entry (pre-drafted — Integrator merges this, do not write it to shared docs yourself)

- **Patreon calculator: corrected a two-year-stale fee model.** The calculator
  offered a Lite 5% / Pro 8% / Premium 12% plan menu that Patreon closed on
  2025-08-04 — two of those plans never existed under those names. It now
  defaults to the mandatory 10% standard plan, models the three closed legacy
  plans (Founders 5%, Pro 8%, Pro + Merch 11%) behind a clearly-labelled
  selector, and adds the legacy micropayment rate, the 2.5% cross-currency fee,
  and per-payout transaction fees. Page copy no longer advises readers to pick a
  plan they cannot buy. Fee figures now carry a source block and a verification
  date, per D-011.

---

## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| blocker | Calculator modelled a plan menu that has not existed since 2025-08-04; page copy advised readers which of those plans to buy | `src/lib/calculators/patreon-earnings.ts:25-34`, `src/pages/creator/patreon-calculator.astro` | fixed here |
| blocker | `src/content/blog/patreon-fees-and-earnings.md` teaches the dead Lite/Pro/Premium menu across three `###` sections and every worked example, and is **linked from the corrected calculator page** by `RelatedBlogCTA` — its excerpt ("what creators actually keep on Lite, Pro, and Premium plans") renders *inside* the page I just fixed | `src/content/blog/patreon-fees-and-earnings.md:3,9,17-27,43,53-69,103-109,127` | proposed as CHIP-BLOG-PATREON-FEES |
| high | `src/content/blog/kofi-vs-patreon-comparison.md` carries the same dead plan menu **and** the $6 Ko-fi Gold error that D-010 rules must be corrected | `kofi-vs-patreon-comparison.md:9,21,35,61,67,121,131,172` | proposed as CHIP-BLOG-KOFI-VS-PATREON |
| medium | "platforms like Patreon take 5% to 12%" in a live blog post | `src/content/blog/tiktok-creator-earnings.md:103` | left: not my file; fold into a blog sweep |
| medium | Ko-fi calculator page states Patreon's fee as "8-12%" twice | `src/pages/creator/kofi-calculator.astro:29,94` | left: CHIP-FEE-KOFI owns that file — flagging in case its prompt scoped only Ko-fi's own rates |
| medium | Hub spec documents `PatreonInputs` as `{numberOfPatrons, averagePledge, feeTier, churnRate}`; `feeTier` is now `plan` and two fields were added | `docs/specs/comparison-hub.md:54,89-90` | left: spec file, not mine — hub chip must re-read the module |
| low | `formatCurrency` rounds to whole dollars, so any sub-$1 fee line renders as `-$0` | `src/lib/utils/formatters.ts:1` | worked around here with `formatCurrencyWithCents` |
| low | `check:tax-data` has no notion of platform fees, so nothing enforces D-011 the way it enforces IRS figures | `scripts/check-tax-data.mjs` | proposed as CHIP-FEE-GUARD |

### 1. What I saw outside my scope

**The blog is the other half of this defect, and it is louder than the
calculator.** The single worst thing I found is not in code: the corrected
calculator page renders a card linking to `/blog/patreon-fees-and-earnings`,
whose description string is *"Real Patreon fees after payment processing — what
creators actually keep on Lite, Pro, and Premium plans."* That text is in the
built HTML of the page I just fixed. A reader who follows it lands on 2,000
words explaining how to choose between three plans that cannot be chosen,
including a "Which plan should you choose?" section with revenue thresholds.
Fixing the calculator without fixing that post leaves the wrong answer one click
away, on the same page, from the same site.

I swept the whole class programmatically rather than reporting what I happened
to notice (protocol §7). Live copy still asserting the dead Patreon plan menu,
exhaustively: `patreon-fees-and-earnings.md` (8 places), `kofi-vs-patreon-comparison.md`
(8 places), `tiktok-creator-earnings.md` (1), `kofi-calculator.astro` (2). No
other file in `src/` matches.

**D-011's guard does not exist yet.** The ruling says platform fees are "enforced
by a guard," on the model of `check:tax-data`. `scripts/check-tax-data.mjs` knows
nothing about platform fees. Nothing today would stop the next chip re-introducing
`0.12` as a Patreon rate, or catch the strings "Patreon Lite" / "Patreon Premium"
in prose. That is the piece of D-011 that is still unimplemented, and it is the
piece that makes the correction durable rather than a one-off.

### 2. Risks in what I built

- **`averagePledge` is a proxy for tier price in the legacy micropayment test.**
  The fact file's threshold is on the *tier price* (≤ $3), not the average. A
  legacy creator with tiers straddling $3 gets a single rate where reality would
  blend two. This only affects grandfathered creators on legacy Pro plans — a
  shrinking set — but it is an approximation, and it is documented in the module.
- **The payout fee assumes one payout per month.** Patreon does not mandate a
  cadence. Disclosed in the input help text, but a creator paying out weekly
  under-counts. I judged including the fee with a stated assumption better than
  omitting it, since the prior model's omission was listed as an understatement
  in the fact file — but it is a judgement call worth a second opinion.
- **I did not model non-US PayPal/Venmo patrons (3.9% + $0.30) or non-USD payout
  currencies.** Both are Confident rows in the fact file, so they are available;
  I left them out to hold the advanced panel to four inputs. A creator with a
  mostly-European audience will see a slightly optimistic number. The page states
  this limitation explicitly rather than letting it pass silently.
- **Input key rename `feeTier` → `plan` invalidates old shared links' plan
  choice.** Deliberate: those links encode `lite`/`premium`, and silently mapping
  them onto a current plan would be inventing an answer. They now fall back to
  the standard 10% plan, which is the correct default for almost every reader.
  Patron count and pledge amount still survive from old links.

### 3. V-P1 — checked, and it does not block this work

The spawn prompt correctly warned that V-P1 (Patreon's own article says one-time
purchase fees run "between 5% and 12%" while its legacy table tops out at 11%) is
an open Verify row. **My fix does not depend on resolving it.** This calculator
models recurring membership pledges only; it has no one-time-purchase input and I
did not add one. Nowhere in the module, component, or page does a "5–12%" range
or a one-time-purchase rate appear — I grepped the rendered HTML to confirm. The
module's source block names V-P1 explicitly and instructs the next chip not to
add a one-time-purchase rate until it is closed.

The one place I had to be careful: the old FAQ opened "Patreon takes between
5-12%." The tempting fix is to reword the range. I removed the range entirely
and stated the single rate that actually applies.

### 4. Proposed follow-up chips

- **CHIP-BLOG-PATREON-FEES** *(blocker, do this next)* — rewrite
  `src/content/blog/patreon-fees-and-earnings.md` against the fact file. Owns
  that one file. Its frontmatter `description` is rendered on the calculator page
  by `RelatedBlogCTA`, so the fix is visible on the site's second-best asset. All
  worked examples must be recomputed by importing `calculatePatreonEarnings`.
- **CHIP-BLOG-KOFI-VS-PATREON** — rewrite
  `src/content/blog/kofi-vs-patreon-comparison.md`. Carries both the dead Patreon
  menu and the $6 Ko-fi Gold price D-010 rules must be corrected. Should run
  after CHIP-FEE-KOFI so it can cite the corrected Ko-fi model. Owns one file.
- **CHIP-FEE-GUARD** — implement the guard D-011 promises. Extend
  `scripts/check-tax-data.mjs` (or add `scripts/check-platform-fees.mjs` plus an
  npm script) with a `SUPERSEDED` denylist for platform fees: the strings
  "Patreon Lite", "Patreon Premium", `12%` adjacent to "Patreon", Ko-fi Gold at
  `$6`, Gumroad "flat 10%" without `$0.50`, and Substack totals omitting `0.7%`.
  Owns `scripts/` + `package.json`. Must run alone — `package.json` is a
  collision hot spot. This is what stops the correction decaying.
- **CHIP-BLOG-FEE-SWEEP** *(low)* — the one-line Patreon fee mentions in
  `tiktok-creator-earnings.md` and any similar cross-references. Small; could be
  folded into CHIP-FEE-GUARD's first run once the guard reports the full list.

### 5. Harness improvements

- **Add to §8 Environment traps:** *the Browser pane reports
  `window.innerHeight === 0` while hidden, so `client:visible` islands never
  hydrate and no amount of `scrollIntoView` / `window.scrollTo` helps.* Load
  `/embed/<category>/<slug>` instead — it uses `client:load` and hydrates the
  identical component immediately. This cost me several tool calls and looked
  exactly like a hydration bug in my own code. The embed route is the
  purpose-built interactive-verification surface for this repo and the protocol
  should say so.
- **§8's "compute worked examples by running the calculator" should say *every
  number in prose*, not just worked examples.** I wrote a plausible-sounding
  "about 25%" into a tip callout and only caught it because I re-derived it. The
  numbers most likely to be wrong are the small conversational ones nobody thinks
  of as a "worked example."
- **The protocol has no guidance on renaming an input key**, but `?s=` URL state
  is `{...defaults, ...decoded}`, so a rename silently changes behaviour for
  every previously shared link. Worth a line in §8: renaming a key in a
  `PROJECT_INPUTS` type is a public-interface change; guard the lookup and say so
  in Rollback.
- **A chip correcting public copy needs a rendered-output check for the strings
  it removed, not just the ones it added.** Grepping `dist/client/` for "Lite"
  is what surfaced the blog CTA leaking the dead plan menu back onto my fixed
  page. That finding would have been invisible from the source files I own.
- **Minor:** `docs/facts/creator-payment-fees.md` was excellent to work from —
  the Confident/Verify split made every decision mechanical. The one thing it
  lacks is a stable per-row ID for Confident rows (only Verify rows have IDs), so
  a source comment has to cite "§3 Platform fee" by prose heading. IDs on
  Confident rows would let code cite a fact precisely.

### 6. Model tier feedback

Opus/high was the right call, but the difficulty was not the arithmetic — it was
knowing which numbers I was *not* allowed to produce. Most of the real work was
reading the fact file's Confident/Verify boundary carefully enough to design a
model that stays inside it, then noticing that the tempting shape (keep a plan
dropdown, just fix the rates) still misrepresents reality because the whole point
is that there is no longer a choice to make. A cheaper tier would very plausibly
have swapped `0.12` for `0.10` in the rates map, left "Which plan should I
choose?" in the FAQ, and reported the job done.
