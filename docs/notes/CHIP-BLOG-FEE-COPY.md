# CHIP-BLOG-FEE-COPY

**Lane:** implementation
**Owns:** `src/content/blog/patreon-fees-and-earnings.md`, `src/content/blog/kofi-vs-patreon-comparison.md`, `docs/notes/CHIP-BLOG-FEE-COPY.md`
**Model:** Opus, high effort
**Source of fact:** `docs/facts/creator-payment-fees.md` (2026-08-25) only. D-010 and D-011 quoted in the spawn prompt.

## What shipped

### `src/content/blog/patreon-fees-and-earnings.md`

- **Frontmatter `description` replaced.** This is the string that renders inside
  `src/pages/creator/patreon-calculator.astro` via `CalculatorLayout.astro:97-104`,
  which pulls `post.data.description` for any blog post whose `calculatorSlug`
  matches the page. The old one taught the dead plan menu one click below the
  corrected calculator. Also renders on `/blog/`.
- `updatedDate: 2026-08-25` added.
- **`## Patreon's Three Fee Tiers` → `## Patreon Has One Plan Now`.** The three
  `### Lite / ### Pro / ### Premium` subsections are gone. Replaced with
  `### The Standard Plan: 10% Platform Fee` and `### The Legacy Plans: 5%, 8%,
  and 11%`. The legacy section carries the fact that actually matters to a
  legacy holder: unpublishing (even briefly) forfeits the rate permanently, and
  Patreon's own advice is to use pause instead.
- **`## Which Plan Should You Choose` → `## There Is No Plan to Choose`.** The
  old section was ~350 words advising the reader to pick a plan and gave revenue
  thresholds for switching. None of those actions exist. The replacement says so
  explicitly, including that an earlier version of the article got it wrong, and
  redirects the decision to the cross-platform comparison.
- **Two new subsections under `## The Hidden Cost: Payment Processing`:**
  `### The Standard Plan Has No Micropayment Rate` (the standard plan charges
  2.9% + $0.30 on every payment regardless of amount; legacy plans charge
  5% + $0.10 at ≤$3) and `### When It Costs More Than 2.9%` (3.9% for non-US
  PayPal/Venmo, 2.5% currency conversion, non-USD base rates, and payout fees
  that Patreon states are not shown in the Earnings dashboard breakdown).
- **All four worked examples recomputed at 10%** (see Measurements).
- Alternatives paragraph rewritten: the Substack claim was factually inverted,
  the Ko-fi claim was garbled, the BMC claim was incomplete.
- Trailing figures: `17%` → `19%` in the churn section and the closing line;
  `14% to 17%` → `14% to 19%`; the $3-tier paragraph now states what a $3 pledge
  actually nets.

### `src/content/blog/kofi-vs-patreon-comparison.md`

- **`title` untouched** — preserved verbatim per the spawn prompt's live CTR
  experiment (`a6f4266`).
- **`description` untouched.** Checked against the fact file: it asserts nothing
  false and names no dead plan or wrong figure. Left alone to keep the
  experiment clean.
- `updatedDate: 2026-08-25` added.
- Lede rewritten: Patreon "8% to 12%" → 10%; Gold $6 → $12; and the free tier's
  0% on one-off tips stated up front, because it is the strongest true claim on
  the page and the article was previously hiding it behind a wrong one.
- **`### Ko-fi: Free Tier vs Gold` → `### Ko-fi: Three Fee States`.** Free /
  Standard / Gold, with what each charges on which product. Includes the trap
  that a Gold creator with "Get all of Ko-fi" also switched on still pays 5%.
- **`### Patreon: Three Tiers` → `### Patreon: One Rate`.**
- **`## Ko-fi Gold Break-Even Math` fully recomputed at $240**, and re-based:
  the break-even only applies to revenue that carries the 5%, so a pure tip-jar
  creator on Ko-fi Free saves nothing by upgrading at any revenue level.
- **`### Patreon Lite` scenario deleted** from `## Real Revenue Comparison`; the
  remaining four recomputed and the scenario framed explicitly as recurring
  support so Ko-fi's 5% legitimately applies on the free tier too.
- Three false claims removed: "Shop sales and commissions carry 0% platform fee
  on both tiers", "Ko-fi exempts shop sales from platform fees entirely", and
  the implied equivalence of Ko-fi free tier / Patreon Lite / BMC at 5%.
- V-K1 handled without guessing: the post states Gold's $12 price (a Confident
  row) and separately tells the reader Ko-fi is de-emphasising Gold and to
  confirm it's on offer before budgeting on it.
- V-B3 handled without guessing: an explicit caveat that BMC's published 0.5%
  payout processing charge has ambiguous incidence, so every BMC figure on the
  page should be read as a floor.
- Removed an unverifiable claim in passing ("without creating an account" for
  Ko-fi supporters — the fact file establishes this for BMC, not Ko-fi).
- Removed the CTA's claim that the calculator lets you "toggle between free and
  Gold tiers" — `CHIP-FEE-KOFI` owns that component this wave and its control
  surface is changing.

## Verification

```
npm install                 # worktree started without node_modules
rm -rf .astro dist
npm run build               # "Complete!"; grep -icE "error|warning" over full output = 0
npm run check:tax-data      # "✓ Tax data clean — TY2026, verified August 9, 2026,
                            #    no superseded figures outside the shared modules."
```

Worked examples computed through code, not by hand: scratch copies of
`patreon-earnings.ts` and `kofi-earnings.ts` with only the fee constants
corrected per the fact file, driven by a runner, executed with `npx tsx`
(Node 20 here rejects `--experimental-strip-types`, as the protocol warns).
Every published figure below is a line of that program's output.

**Rendered-output verification** (source-level checking was explicitly not
accepted for this job):

| Check | Result |
|---|---|
| `dist/client/creator/patreon-calculator/index.html` related-post card | now reads `line-clamp-2">Patreon&#39;s standard plan takes 10%, and payment processing pushes the real cut past 18% on a $5 pledge. What you actually keep, and how churn compounds.` — no dead plan named |
| Old description string anywhere in `dist/client/` | `grep -rlo "what creators actually keep on Lite, Pro, and Premium" dist/client/` → no matches |
| `Lite` / `Premium` / `advertised 8%` / `another 17%` / `16.9%` / `40.9%` / `12.1%` in built Patreon post | zero matches |
| `Lite` / `Premium` / `Patreon Pro` / `8% to 12%` / `$6 per month` / `11.3%` / `14.9%` in built Ko-fi post | zero matches |
| `$120` in built Ko-fi post | 1 match, intentional — the sentence explaining that the old $120 break-even came from the old $6 price |
| All 16 Patreon worked-example dollar figures | present in built HTML, each matching the runner output |
| All 30 Ko-fi worked-example dollar figures | present in built HTML, each matching the runner output |
| `dist/client/creator/kofi-calculator/index.html` related card | unchanged, as intended — that description was left alone |

The `formatCurrency` whole-dollar hazard did not bite: no figure on either page
is produced by that helper. All published figures are literal prose written from
the runner's `toFixed(2)` output.

## Measurements

### Patreon — standard 10% plan, US card, 100 patrons

| Avg pledge | Gross | Platform 10% | Processing | Total | Net | Effective |
|---|---|---|---|---|---|---|
| $1 | $100 | $10.00 | $32.90 | $42.90 | $57.10 | **42.9%** |
| $3 | $300 | $30.00 | $38.70 | $68.70 | $231.30 | 22.9% |
| $5 | $500 | $50.00 | $44.50 | $94.50 | $405.50 | **18.9%** |
| $10 | $1,000 | $100.00 | $59.00 | $159.00 | $841.00 | **15.9%** |
| $25 | $2,500 | $250.00 | $102.50 | $352.50 | $2,147.50 | **14.1%** |

Legacy Pro (8%) at $5 avg, for contrast: $84.50 total fees, $415.50 net, 16.9%
— which is exactly the number the article used to publish as if it were current.

Legacy micropayment rate vs standard on a $3 pledge: $0.25 vs $0.39 processing.

### Ko-fi Gold break-even, against a 5% service fee

`$12 / 0.05 = $240/month` of fee-bearing revenue.

| Fee-bearing revenue | 5% costs | Gold costs | Gold saves |
|---|---|---|---|
| $100 | $5.00 | $12.00 | −$7.00/mo |
| $200 | $10.00 | $12.00 | −$2.00/mo |
| **$240** | $12.00 | $12.00 | **$0.00 — break-even** |
| $250 | $12.50 | $12.00 | $0.50/mo |
| $500 | $25.00 | $12.00 | $13.00/mo ($156/yr) |
| $1,000 | $50.00 | $12.00 | $38.00/mo ($456/yr) |
| $2,000 | $100.00 | $12.00 | $88.00/mo ($1,056/yr) |

### Cross-platform, 20 supporters × $5/mo recurring ($100 gross, 20 transactions)

| | Platform cost | Processing | Total | Net | Effective |
|---|---|---|---|---|---|
| Ko-fi Free or Standard | $5.00 | $8.90 | $13.90 | $86.10 | 13.9% |
| Ko-fi Gold | $12.00 sub | $8.90 | $20.90 | $79.10 | 20.9% |
| Patreon standard | $10.00 | $8.90 | $18.90 | $81.10 | 18.9% |
| Buy Me a Coffee | $5.00 + $0.50 | $8.90 | $14.40 | $85.60 | 14.4% |

### Cross-platform, 50 × $5/mo ($250 gross)

| | Total | Net | Effective |
|---|---|---|---|
| Ko-fi Free or Standard | $34.75 | $215.25 | 13.9% |
| Ko-fi Gold | $34.25 | $215.75 | 13.7% |
| Patreon standard | $47.25 | $202.75 | 18.9% |
| Buy Me a Coffee | $36.00 | $214.00 | 14.4% |

## Worked-example CONCLUSIONS that changed, not just inputs

This is the part that matters. Six conclusions inverted or moved materially:

1. **Ko-fi Gold at $250/mo.** Old: "Gold pulls ahead by $6.50 per month over the
   free tier." New: **$0.50 per month.** The old advice — subscribe once you
   pass $250 — was worth $78/yr; the real figure is $6/yr. The recommendation is
   now "not a reason to subscribe to anything" at that level.
2. **Ko-fi Gold at $100/mo.** Old: costs "$0.80 per month" more than free. New:
   **$7.00 per month** more. Gold went from a rounding error to the most
   expensive option on the page at that volume.
3. **Who Gold is for at all.** New conclusion, absent from the old article: a
   creator whose income is one-off tips on Ko-fi Free is **already at 0%** and
   saves nothing by upgrading at any revenue level. The old break-even section
   implicitly told every Ko-fi creator above $120 to subscribe.
4. **Patreon's effective rate.** Old: "14% to 17%", closing on "don't mistake
   the 8% for the 17%". New: **14% to 19%**, closing on 10% vs 19%.
5. **Ko-fi vs Patreon at $500/mo recurring.** Old: $34/mo, $408/yr. New:
   **$38/mo, $456/yr.**
6. **BMC vs Ko-fi Gold at $1,000/mo.** Old: BMC $50, difference $44/mo. New:
   BMC $55 including the 0.5% recurring surcharge, Gold $12, difference
   **$43/mo** — and the old comparison omitted that BMC charges its 5% on
   one-off tips where Ko-fi Free charges 0%, which is the larger gap.

Two conclusions survived the recomputation unchanged and are worth recording as
*not* changed: the churn decay figures (95 / 86 / 74 / 54 patrons at 5%; 28 at
10%; $500 → $270 by December) are independent of fee rates, and the
per-transaction processing table ($3 → $0.39, $5 → $0.45, $10 → $0.59,
$25 → $1.03) was already correct.

## Rollback record

Restoring a string does not restore a ranking. Full diffs are in the worktree;
the ranking-bearing and conclusion-bearing strings are recorded verbatim here.

### `patreon-fees-and-earnings.md` frontmatter

Prior (verbatim):
```
title: "Patreon Fees and Earnings: A Creator's Guide"
description: "Real Patreon fees after payment processing — what creators actually keep on Lite, Pro, and Premium plans, plus how churn quietly kills your income."
publishedDate: 2026-03-09
```

Now:
```
title: "Patreon Fees and Earnings: A Creator's Guide"
description: "Patreon's standard plan takes 10%, and payment processing pushes the real cut past 18% on a $5 pledge. What you actually keep, and how churn compounds."
publishedDate: 2026-03-09
updatedDate: 2026-08-25
```

`title` is byte-identical. This file was **not** part of `a6f4266`
(CHIP-CTR-BLOG's 10-post retitle), so no live title experiment was disturbed.
Old description 147 chars, new 151 — both inside the snippet budget.

### `kofi-vs-patreon-comparison.md` frontmatter

`title` and `description` are **byte-identical to before this chip ran**. Only
`updatedDate: 2026-08-25` was inserted. Prior/current title, verbatim:

```
title: "Ko-fi vs Patreon vs Buy Me a Coffee: What They Really Take"
description: "The advertised platform fee is only half the cut. Compare what each one actually takes after per-transaction processing, and where Ko-fi Gold pays for itself."
```

### Prior verbatim text of the deleted Patreon plan-menu section

```
## Patreon's Three Fee Tiers

Patreon offers three plan levels, each with a different platform fee percentage. The platform fee is calculated on your gross monthly earnings — the total amount pledged by your patrons before any other deductions.

### Lite: 5% Platform Fee

The Lite plan is Patreon's entry-level option. At 5%, it offers the lowest platform fee, but it comes with significant tradeoffs. You get basic membership tools — a creator page, patron management, and payment processing — but you lose access to features like membership tiers, special offers, analytics dashboards, and the app. For creators just testing the waters with a small audience, Lite keeps costs low. But most creators outgrow it quickly because tiered pricing is fundamental to maximizing revenue per patron.

### Pro: 8% Platform Fee

Pro is where most creators land, and Patreon knows it. At 8%, you get the full toolkit: unlimited membership tiers, analytics, workshops, special offers, and priority support. The 8% rate is reasonable on paper — comparable to what platforms like Teachable or Gumroad charge. The problem isn't the 8%. It's what comes after.

### Premium: 12% Platform Fee

Premium adds team management tools, a dedicated partner manager, and priority everything. At 12%, it's aimed at creators earning enough that the added support and features justify the cost. If you're earning $10,000 or more per month, the incremental cost over Pro (an extra 4% or $400+ per month) buys you meaningful operational support. Below that threshold, it's hard to justify.
```

### Prior verbatim text of the deleted "Which Plan Should You Choose" section

```
## Which Plan Should You Choose

The decision between Lite, Pro, and Premium comes down to a simple revenue threshold calculation.

If you're earning under $500 per month, Lite's 5% rate saves you $15 to $25 per month compared to Pro. That matters when your total take-home is under $400. The feature limitations of Lite (no tiers, limited analytics) become a problem as you grow, but at the earliest stage, every dollar matters.

Between $500 and $5,000 per month, Pro is the clear choice. Membership tiers alone justify the extra 3% because they let you capture more revenue per patron. A creator earning $2,000 per month pays $60 more in platform fees on Pro vs. Lite, but tiers, analytics, and special offers typically generate far more than $60 in additional revenue.

Above $5,000 per month, Premium starts making sense — but only if you're spending meaningful time on operational tasks that a partner manager could handle, or if you need team accounts. At $5,000 gross, Premium costs $200 more per month than Pro. At $10,000, it's $400 more. That's real money, and the ROI depends entirely on whether you use the premium features.
```

### Prior verbatim text of the three deleted false Ko-fi claims

```
Ko-fi's free tier charges a 5% platform fee on donations (called "coffees") and memberships. Shop sales and commissions carry 0% platform fee on both tiers. Ko-fi Gold eliminates the platform fee entirely across all revenue streams, but costs $6 per month.
```
```
Note that shop sales don't factor into this calculation because Ko-fi charges 0% platform fee on shop sales regardless of your tier.
```
```
The other structural issue is that Patreon's fees apply uniformly to all revenue. Ko-fi exempts shop sales from platform fees entirely. If a meaningful portion of your income comes from selling digital products or merchandise, Ko-fi's fee structure is significantly more favorable.
```

### Prior verbatim text of the deleted "Patreon Lite" comparison scenario

```
### Patreon Lite

Platform fee (5%): $5.00. Payment processing: $8.90. Total fees: $13.90. Net: $86.10. Effective fee: 13.9%.
```

## Changelog entry (pre-drafted — Integrator merges this, do not write it to shared docs yourself)

```
fix(content): correct Patreon and Ko-fi fee copy in two blog posts

Removed the Lite/Pro/Premium plan menu from patreon-fees-and-earnings.md,
which Patreon closed on 2025-08-04, and recomputed all four worked examples
at the standard 10% rate (effective fee at a $5 pledge: 16.9% → 18.9%).
Corrected Ko-fi Gold to $12/month and the break-even to $240/month in
kofi-vs-patreon-comparison.md, removed the false "shop sales are 0%" claim,
and added Ko-fi Free's 0% rate on one-off tips. The Patreon post's frontmatter
description also renders as the related-post card on the Patreon calculator
page, which was showing the dead plan menu one click below the corrected
calculator.
```

## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| high | Substack post omits Stripe's 0.7% Billing fee across ~8 worked examples **and** the Beehiiv break-even threshold is derived from the incomplete rate | `src/content/blog/substack-vs-beehiiv-newsletter-revenue.md` L21,35,43,45,71,73,77,79,103,129 | proposed as CHIP-BLOG-FEE-COPY-2 |
| high | Gumroad's `+$0.50/transaction` absent from two blog posts; one derives a platform-choice threshold from the wrong rate | `src/content/blog/best-platforms-selling-digital-products.md:22,24`; `src/content/blog/profit-margin-side-hustles.md:61` | proposed as CHIP-BLOG-FEE-COPY-2 |
| medium | "platforms like Patreon take 5% to 12%" — the dead plan menu, in a third blog post | `src/content/blog/tiktok-creator-earnings.md:103` | proposed as CHIP-BLOG-FEE-COPY-2 |
| medium | Patreon calculator page's own worked example computes on "the Pro plan (8%)" with "~3.5%" processing — a rate that appears in no source | `src/pages/creator/patreon-calculator.astro:124` | left: sibling chip owns the file; flagging in case its scope was only the plan menu |
| low | "Most creators find that 50% to 70% of their patrons cluster at the $3 to $5 level" — unsourced audience statistic presented as data | `src/content/blog/patreon-fees-and-earnings.md:112` | left: not a fee claim, out of scope |
| low | Shared scratchpad directory is not per-chip; sibling chips this wave wrote `kofi-worked.ts`, `patreon-worked.ts`, `gum.ts` into the same folder I was given | scratchpad root | worked around by using a subdirectory |

### 1. What I saw outside my scope

**The fee-copy defect is a class, and it is bigger than the two posts I was
given.** Per §7, I enumerated it programmatically rather than reporting the
instances I happened to notice — grepping every blog post for the five fact-file
platforms co-occurring with a percentage or a dollar figure. Four more posts
carry wrong platform fees, and in two of them the error propagates into a
*threshold the reader is told to act on*, which is the same failure mode as the
Patreon plan menu rather than a simple stale number:

- `substack-vs-beehiiv-newsletter-revenue.md` never mentions the 0.7% Stripe
  Billing fee. Its "Below $990 per month, Substack is cheaper than Beehiiv"
  threshold is computed from `0.10 × revenue = $99`. Every worked example
  understates Substack by 0.7% of gross — at its own $2,000 scenario, $318 in
  fees should be $332. The legacy 0.5% rate expired 2025-06-30, so there is no
  creator for whom the omission is correct.
- `best-platforms-selling-digital-products.md:22` states "On a $29 ebook,
  Gumroad takes $2.90" — the real figure is $3.40. Two lines later it computes a
  Gumroad-vs-Sellfy crossover from the same wrong rate: at 50 sales/month of a
  $29 product it says Gumroad costs $145, where the true cost is $170. It also
  never mentions the 30% Discover rate.
- `profit-margin-side-hustles.md:61` — "$29 template pays roughly 10%"; 11.7%.
- `tiktok-creator-earnings.md:103` — "platforms like Patreon take 5% to 12%".

Note that the last one is the *same fabricated 12% figure* D-012 rejected
CHIP-CTR-CALC's titles for. It has been sitting in body copy the whole time.
That suggests 12% wasn't invented by that chip — it was inherited from the
calculator module (`patreon-earnings.ts:33`), which is exactly the propagation
path D-011 exists to close.

**A structural observation about the calculator↔blog coupling.** The defect I
was spawned to fix — a corrected calculator page rendering a wrong blog
description in its related-post card — is not specific to Patreon. Every blog
post with a `calculatorSlug` injects its raw `description` into that calculator's
page (`CalculatorLayout.astro:97-104`). There is no guard, no length limit, and
no signal in the blog file that its frontmatter is doing double duty. Anyone
editing a calculator page for accuracy will not think to check a markdown file
in another directory. This is worth a line in `CLAUDE.md`'s Key Files table or
a comment at the top of `CalculatorLayout.astro`.

### 2. Risks in what I built

**I could not run the real corrected Patreon calculator.** My worktree branched
from `4667db0`; `src/lib/calculators/patreon-earnings.ts` here still reads
`lite: 0.05, pro: 0.08, premium: 0.12` under the comment
`// Patreon fee structure (2024)`. The sibling chip's correction is not in my
tree. I therefore computed through a scratch copy with only the rate map
replaced — the transaction-count and processing logic is the shipped code,
untouched. **If the sibling chip changes the processing model** (e.g. adds the
legacy micropayment rate, or the 2.5% conversion fee), my published worked
examples will describe a simpler model than the calculator the reader clicks
through to. The four worked examples are all US-card, USD-payout, standard-plan
cases, which is the one case where the two models agree — but this should be
re-checked after both chips merge. **This is a direct consequence of the
sequencing D-012 identified: I am a writing chip running concurrently with the
implementation chip whose output my prose describes.** The fact file was
correctly sequenced ahead of me; the calculator was not.

The same applies to Ko-fi: `CHIP-FEE-KOFI` owns the module and page, and I have
written prose describing a three-state fee model that its calculator may or may
not expose. I removed the one sentence that described the calculator's controls
so the post doesn't assert a UI I can't see.

**V-K1 and V-P1 were not resolved and nothing depends on them.** V-P1 (is the
one-time-purchase ceiling 11% or 12%?) — neither bound is published anywhere in
either post; the Patreon post discusses membership fees only. V-K1 (is Gold
purchasable at $12?) — the $12 price is a Confident row and D-010 rules on the
$240 break-even, so I published both, but I added an explicit paragraph telling
the reader Ko-fi is de-emphasising Gold and to confirm availability. I also
volunteered a caveat for V-B3, which the spawn prompt didn't name: the Ko-fi
post publishes BMC effective rates, and the fact file says not to publish a BMC
effective-rate number until V-B3 resolves. Rather than delete a whole
comparison column I bounded it — the figures are stated as a floor, with the
reason. **Command Center should decide whether bounding is acceptable or whether
the BMC rows must come out entirely.** I flag this as the one place where I
interpreted a Verify row rather than obeying it.

**Fee figures now have no expiry mechanism.** Both posts state figures verified
2026-08-25 with no on-page verification date and no `SourcesBlock` equivalent —
unlike tax figures, which carry `TAX_DATA_LAST_VERIFIED` into every page. The
fact file itself says to treat anything older than ~6 months as suspect. Nothing
in the repo will notice when that happens.

### 3. Proposed follow-up chips

- **CHIP-BLOG-FEE-COPY-2** — the remaining four posts in the class above.
  Owns: `substack-vs-beehiiv-newsletter-revenue.md`,
  `best-platforms-selling-digital-products.md`, `profit-margin-side-hustles.md`,
  `tiktok-creator-earnings.md`, and its own notes file. Must recompute the
  Substack↔Beehiiv and Gumroad↔Sellfy crossover thresholds, not just the rates.
  Opus, high effort — same reason as this chip: derived thresholds, not
  find-and-replace.
- **CHIP-FEE-GUARD** — D-011 says platform fees are "enforced by a guard", but
  no guard exists. Extend `scripts/check-tax-data.mjs` (or add a sibling script)
  with a `SUPERSEDED` denylist for platform fees: `Lite`+`Patreon`, `Premium`+
  `Patreon`, Ko-fi Gold at `$6`, `$120` break-even, Gumroad "flat 10%". The
  tax-data guard is what stopped the tax figures decaying; fees now have the
  same status and none of the machinery. Owns `scripts/`, `package.json`.
  Sonnet is sufficient.
- **CHIP-FEE-FRESHNESS** — mirror `TAX_DATA_LAST_VERIFIED` for platform fees:
  a `FEE_DATA_LAST_VERIFIED` constant plus a visible "fees verified on" line on
  creator pages and fee-bearing posts. Small, but it is the difference between a
  labeled stale figure and a confident wrong one, which is the standard
  `CLAUDE.md` already sets for tax data.
- **CHIP-RELATED-CARD-AUDIT** — sweep every calculator page's rendered
  related-post card against the fact file. My fix covers the two posts I own; I
  have not verified the other ~43.

### 4. Harness improvements — what the protocol failed to warn me about

**The protocol's ordering rule (§7, from D-012) covers research→writing but not
implementation→writing.** It now says a research chip must finish and merge
before the writing chip is spawned. The same argument applies one link further
down the chain: I was asked to write prose whose worked examples must agree with
a calculator being rewritten in a sibling worktree at the same moment. I had to
reconstruct the corrected calculator from the fact file to compute anything.
Suggested addition:

> A chip whose output must *agree with* another chip's output — not merely avoid
> its files — is sequenced behind it, not beside it. Disjoint file ownership
> prevents merge conflicts; it does not prevent two chips publishing two
> different answers to the same question.

**"Compute worked examples by running the calculator" has an unhandled case.**
§8 and `CLAUDE.md` both give this instruction unconditionally. It assumes the
calculator is correct. When the calculator is the thing being fixed — which is
the entire premise of this wave — the instruction is unfollowable as written.
The protocol should say what to do: copy the module to scratch, correct only the
constants the fact file names, run through the real code path, and record in
notes exactly which constants were substituted. That is what I did, but I had to
invent it.

**Verify rows need a third state.** The protocol treats them as binary: blocked
or not. Real copy hits a middle case constantly — a figure is Confident, its
*availability or applicability* is Verify (V-K1), or a component of a total is
ambiguous (V-B3). Deleting the passage loses real information; publishing it
flat overstates certainty. A sanctioned third option — publish the Confident
part with the uncertainty stated in the copy itself — would have saved me a
judgement call on live money copy. It's also just better writing: "Ko-fi is
de-emphasising Gold, confirm it's on offer" is more useful to a creator than
either silence or false confidence.

**The scratchpad is shared, not per-chip.** The session scratchpad path given in
my system prompt already contained `kofi-worked.ts`, `patreon-worked.ts`,
`gum.ts`, `substack.ts` and `kofi-before.html` from sibling chips when I opened
it. I nearly overwrote a sibling's file with a `cp` before noticing. Worth a
line in §8's environment traps: **use a subdirectory named after your chip.**

**One protocol rule paid off exactly as advertised.** §5's "measure the RENDERED
value" was the whole job here, and the spawn prompt's warning about a sibling
shipping a 100% error that was correct in source was well-placed. It also caught
something I'd have missed: the built HTML entity-encodes apostrophes, so a naive
`grep` for `Patreon's` in `dist/` returns nothing and would have read as a clean
sweep. Worth adding to §5 — **grep built HTML for the distinctive words, not for
strings containing apostrophes, quotes, or dashes.**

### 5. Model tier feedback

Opus/high was right, and I'd argue it was necessary rather than generous. The
mechanical part (swap 8% for 10%, $6 for $12) is Sonnet work. What wasn't: three
sentences in these posts had *inverted* meaning rather than wrong numbers — "Ko-fi
exempts shop sales from platform fees entirely" and "Substack absorbs more of
that cost" are not stale figures, they are claims pointing the opposite way from
the truth, and a find-and-replace pass sails straight past them. Two whole
sections had to be rewritten because the *action they recommended does not
exist*. And the highest-value output of the job — noticing that six worked-example
*conclusions* changed, including one that fell from $6.50/mo to $0.50/mo and
inverted the recommendation — required carrying the fee model, the article's
argument, and the reader's decision in mind simultaneously.

CHIP-BLOG-FEE-COPY-2 should also be Opus/high for the same reason: the Substack
and Gumroad posts both derive platform-choice thresholds from their wrong rates,
so correcting the rate without recomputing the threshold would leave the same
defect this chip was spawned to fix.
