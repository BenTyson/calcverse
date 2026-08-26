# CHIP-RESEARCH-NEWSLETTER

**Lane:** spec/docs — **no production code was touched.**
**Owns:** `docs/facts/newsletter-platform-fees.md`, `docs/notes/CHIP-RESEARCH-NEWSLETTER.md`
**Model:** Opus, medium effort

## What shipped

| File | Change |
|---|---|
| `docs/facts/newsletter-platform-fees.md` | **New.** Verified fee structures for beehiiv, ConvertKit/Kit and Substack from 13 first-party sources fetched 2026-08-25. Format matches its sibling `docs/facts/creator-payment-fees.md`: numbered source list with load method, Claim/Value/Confidence/Source/Fetched tables, per-platform Verify tables, cross-platform comparison, read-only code cross-check, and a consolidated Verify summary. |
| `docs/notes/CHIP-RESEARCH-NEWSLETTER.md` | **New.** This file. |

**Production code untouched.** No file under `src/` was modified. No file under
`scripts/` was modified. `src/components/calculators/*` was **not even read** —
CHIP-CENTS-SWEEP owns all 45 this wave. `docs/facts/creator-payment-fees.md` was
read but **not modified**; it is a sibling's frozen output.

Read-only: `src/lib/calculators/newsletter-revenue.ts`,
`src/content/blog/substack-vs-beehiiv-newsletter-revenue.md`,
`docs/CHIP-PROTOCOL.md`, `CLAUDE.md`, `docs/DECISIONS.md`,
`docs/facts/creator-payment-fees.md`, and `ls src/lib/calculators/`.

## Verification

**Sources.** 13 URLs, every one loaded in this session, listed in §1 of the fact
file with the method that worked and the page's own date stamp. Nothing is cited
that was not opened. Where a platform publishes no figure, the row says so and is
marked **Verify** rather than filled in — 17 Verify rows, 4 of them load-bearing.

**Interactive price grids.** Both beehiiv and Kit hide their real price ladder
behind a control. Both re-render asynchronously, and **a settle under ~1.5 s
silently returns the previous tier's prices.** My first beehiiv pass used 250 ms
and produced a non-monotonic ladder (`$169` at 1,000 subscribers, `$69` at 2,500).
That pass was discarded. Every published figure in the fact file comes from a
≥1.3 s-settle pass, and each ladder was checked for monotonicity across all tiers
and cross-checked against an independently captured tier.

**Kit monthly-billing prices are derived, and the derivation was validated.**
The page publishes `annual charge` + `Save $X per year`; monthly billing is
`(annual + save) / 12`. I read the page's own monthly display at two tiers —
1,000 (Creator $39, Pro $79) and 8,000 (Creator $119, Pro $169) — and the formula
reproduced all four exactly. Derived rows are labelled as derived in the table.

**Corrected arithmetic was computed by running the real module, not by hand.**
Scratch script at
`<scratchpad>/newsletter-check.ts`, run with `npx tsx` (Node 20 here does not
support `--experimental-strip-types`; `node_modules/.bin/tsx` does not exist in a
fresh worktree, so `npx --yes tsx` was used). It imports the **unmodified**
`calculateNewsletterRevenue` and `DEFAULT_INPUTS` and diffs them against a
corrected fee model built only from Confident rows. Output is reproduced in §8 of
the fact file. No production file was written by the script.

**Sibling cross-check.** §4 of the fact file was captured independently of
`docs/facts/creator-payment-fees.md` §6 and compared line by line. **No
disagreement** — 10% platform fee, 2.9% + $0.30 card, 0.7% Billing as of July
2024, 0.5% legacy expiring 2025-06-30, no plan tiers, no reader-side fee,
identical non-card fee list, identical `13.6% + $0.30` total. One additive
refinement offered for the Integrator, not applied: the Zendesk API gives the
article's exact `edited_at` (**2025-12-16**), which sharpens the sibling's V-S5
"Updated 8 months ago".

Build and `check:tax-data` were **not** run: spec/docs lane, no `src/` change, and
`npm install` in this worktree would have been pure cost.

## Measurements

**beehiiv Scale, monthly billing, by total subscribers** — the distribution behind
the claim that the crossover is not a single number:

| ≤1,000 | ≤2,500 | ≤5,000 | ≤10K | ≤25K | ≤50K | ≤75K | ≤100K |
|---|---|---|---|---|---|---|---|
| $49 | $69 | $89 | $109 | $169 | $249 | $289 | $329 |

Substack-vs-beehiiv crossover is `P / 0.107` or `P / 0.10` depending on **V-N1**,
so it ranges from **$458–$490/mo** at a 1,000-subscriber list to
**$3,075–$3,290/mo** at 100K. The blog publishes a single **$990**, which is the
crossover at no tier.

**Fee-model error at the module's own `DEFAULT_INPUTS`** (measured by running the
module, not by reading it):

| Platform | Live net/mo | Corrected net/mo | Over-statement |
|---|---|---|---|
| Substack | $2,188.63 | $2,117.63 | $71.01/mo · $852/yr |
| beehiiv | $2,426.13 | $2,266.13 | $160.01/mo · $1,920/yr |
| Kit | $2,343.00 | $2,298.50 | $44.50/mo · $534/yr |

The errors differ per platform, so **the ranking the calculator produces is wrong,
not just the magnitudes.** At the blog's own scenario the corrected ranking puts
Kit cheapest; the post ranks beehiiv cheapest and never mentions that Kit's free
plan can run a paid newsletter at all.

## Rollback record

No public-facing text was changed. Nothing to roll back.

## Changelog entry (pre-drafted — Integrator merges this, do not write it to shared docs yourself)

- **Verified newsletter platform fee data.** Added `docs/facts/newsletter-platform-fees.md`
  covering beehiiv, ConvertKit/Kit and Substack from 13 first-party sources
  (2026-08-25). Unblocks newsletter-comparison correction work held under D-011.
  Findings: beehiiv has **no free-plan monetization** and no "Grow" plan — Scale is
  **$49–$329/mo by list size**, not the flat $99 published on the site; **Kit's
  3.5% + $0.30 is inclusive of card processing**, so the calculator double-counts
  Stripe on that branch; **no platform's $0.30 per-transaction fee is modelled
  anywhere**; and the blog's **$990 Substack-vs-beehiiv crossover is the crossover
  at no beehiiv tier** — the real figure ranges $490–$3,290/mo with list size.
  17 Verify rows opened, 4 load-bearing.

---

## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| blocker | beehiiv Scale modelled as free. Plan cost is **$49–$329/mo by list size** and is never subtracted — take-home over-stated by $160/mo ($1,920/yr) at the module's own defaults | `src/lib/calculators/newsletter-revenue.ts:53–58` | proposed as CHIP-FEE-NEWSLETTER |
| blocker | Kit branch **double-counts payment processing**: charges 3.5% *and* 2.9%, when Kit's 3.5% + $0.30 is all-in. Also never charges Kit's $39–$1,579/mo plan | `src/lib/calculators/newsletter-revenue.ts:59–64` | proposed as CHIP-FEE-NEWSLETTER |
| blocker | The **$0.30 per-transaction fee is absent from all three platform branches**. It is the only price-sensitive term — 6% of a $5/mo subscription | `src/lib/calculators/newsletter-revenue.ts:47–64` | proposed as CHIP-FEE-NEWSLETTER |
| blocker | Blog derives a **$990/mo crossover** the reader is told to act on. It is the crossover at no beehiiv tier; real range $490–$3,290/mo by list size | `src/content/blog/substack-vs-beehiiv-newsletter-revenue.md:77,79` | proposed as CHIP-BLOG-NEWSLETTER |
| blocker | Blog cites a **"Grow plan at $49/month"** that does not exist, and prices Scale at $99 and Max at $399 — neither is a beehiiv price at any tier or cadence | `…newsletter-revenue.md:59,63,65,…` (15 lines) | proposed as CHIP-BLOG-NEWSLETTER |
| high | **beehiiv's free plan cannot take paid subscriptions at all.** Entry price for a paid newsletter is $49/mo. Not stated anywhere on the site | `newsletter-revenue.ts` + blog | proposed as CHIP-FEE-NEWSLETTER |
| high | Blog's own worked example at line 81 **inverts its conclusion**: at $500/mo gross with a ≤1,000 list, beehiiv ($49) beats Substack ($50), and the post says the opposite | `…newsletter-revenue.md:81` | proposed as CHIP-BLOG-NEWSLETTER |
| high | Substack's **0.7% Stripe Billing fee** missing from the newsletter module and from every blog worked example. Same defect the sibling found in `substack-revenue.ts` — it is duplicated, not isolated | `newsletter-revenue.ts:47–52`; blog:43,45,120–123 | proposed as CHIP-FEE-NEWSLETTER |
| high | **V-N1 open:** whether beehiiv incurs Stripe's 0.7% Billing fee is unpublished. Blocks any single-number beehiiv effective rate or crossover | `docs/facts/newsletter-platform-fees.md` V-N1 | left: needs an account or a beehiiv support answer |
| high | Blog states a self-employment tax figure of **"$3,672/year"** on $24,000 — it omits the 92.35% net-earnings adjustment. Correct: **$3,391**. Hardcoded YMYL figure in body copy, violating the `CLAUDE.md` Tax Data rule, on a site with a live AdSense violation | `…newsletter-revenue.md:197` | left: outside scope; proposed as CHIP-BLOG-TAXFIG |
| medium | `annualPrice = monthlyPrice × 10` hardcoded as "the standard 2-month discount". **No platform mandates any annual ratio.** Identical to the `substack-revenue.ts:49` defect the sibling already logged — same wrong assumption in two modules | `newsletter-revenue.ts:78` | proposed as CHIP-FEE-NEWSLETTER |
| medium | Comment "platform fees only on subscription revenue" is right for direct-sold sponsorship and wrong for platform-sourced. beehiiv **Boosts is a documented 20%**; Ad Network share is unpublished (V-N4) | `newsletter-revenue.ts:92`; blog:145,149,151 | left: needs a product ruling on whether to model sponsorship take |
| medium | Blog **over-states Kit's cost by $48/mo** (double-counted Stripe) — the only error in the post that runs against a platform rather than for it | `…newsletter-revenue.md:101,103,123` | proposed as CHIP-BLOG-NEWSLETTER |
| medium | `docs/facts/creator-payment-fees.md` and this file both now describe Substack. **Two fact files, one platform** — a future chip can cite either | `docs/facts/` | left: proposed as a `docs/facts/README.md` index for the Integrator |
| low | Unknown platform string falls through to `{platformFee: 0, paymentProcessing: 0}` — silently returns a zero-fee result instead of failing | `newsletter-revenue.ts:65–67` | left: cosmetic until a fourth platform is added |
| low | Kit is branded **Kit**, not ConvertKit. The blog says "still known as ConvertKit … in some markets"; nothing on `kit.com` supports that | `…newsletter-revenue.md:89` | proposed as CHIP-BLOG-NEWSLETTER |

### 1. What I saw outside my scope

**The Wave 2 report that triggered this chip was right about the calculator and
half-right about the blog.** The module omits both the 0.7% Billing fee and the
$0.30 flat fee. The blog post **does** include the $0.30 — its Stripe arithmetic
(`$58 + $60 = $118`) is correct as far as it goes — and omits only the 0.7%. I
report that because a correction chip briefed on "the blog omits both" would go
looking for a defect that is not there and might "fix" correct arithmetic. Trust
the repo over the notes, including mine.

**The biggest finding was not the one I was sent to get.** The brief framed this
as Beehiiv-0% and ConvertKit-3.5%-with-no-source. Both numbers turn out to be
literally true as headline rates. The damage is in what sits next to them:

- beehiiv's 0% is real, but **it is unreachable on the free plan** and it costs
  $49–$329/month to reach. The site models the 0% and not the $49–$329.
- Kit's 3.5% is real, but **it is inclusive of card processing** — Kit says so on
  its own pricing page and states that its own take is 0.6%. The calculator adds
  Stripe's 2.9% on top of an all-in rate. That is not a stale number; it is a
  category error, and it is the kind of thing a rate-only audit never catches.

**A structural error hiding under the numeric ones.** The blog's whole thesis is
"Substack's fee scales with revenue, beehiiv's is fixed, so beehiiv wins as you
grow." beehiiv's price is **not fixed** — it steps with total list size, which for
most newsletters is driven by *free* subscribers who generate no revenue. Correct
every number in that post and the argument is still wrong. This is a comparison
site under D-001; getting the *shape* of a fee structure wrong is worse than
getting a rate wrong.

**Kit's free plan is the buried lede.** From Confident rows alone: a paid
newsletter on Kit's free Newsletter plan costs 3.5% + $0.30 all-in, against
Substack's 13.6% + $0.30, with no monthly fee to offset it — so Substack is more
expensive at **every** revenue level, with no crossover. The site's only
newsletter-comparison post does not mention this. Per D-014 that arithmetic can
ship; any *recommendation* to switch has to carry the free plan's real limits
(10,000-subscriber cap, one automation, Kit branding), which are also Confident.

**Out-of-scope tax defect.** Line 197 of the blog computes self-employment tax as
15.3% of gross, skipping the 92.35% adjustment — $3,672 published where $3,391 is
correct. It is also a hardcoded IRS-derived figure in body copy, which
`CLAUDE.md`'s Tax Data rule 1 forbids outright. `docs/BLOG-TAX-AUDIT.md` is
recorded as closed 2026-08-09; this post published 2026-01-26 and carries the
defect, so either the audit missed it or the rule is not enforced on prose. Worth
a sweep, not just a fix.

**A doc-hygiene issue the Integrator should settle.** Substack now appears in two
fact files. Nothing in the protocol says which one wins. §6 of my file records
that they agree today, but that is luck, not architecture — the next annual
re-verification will update one and not the other. `docs/facts/` needs an index
naming the owning file per platform.

### 2. Risks in what I built

- **V-N1 is the one I would most want reviewed.** It is entirely plausible that
  beehiiv creators do pay Stripe's 0.7% Billing fee — the structure is identical to
  Substack's (recurring charges on the creator's own Stripe account, N3) and
  Stripe's pay-as-you-go Billing rate has no free tier (N12). I did **not** resolve
  it, because "structurally it should" is precisely the reasoning D-011 exists to
  forbid. I published both crossover columns instead of picking one. A downstream
  chip that wants a single number must resolve V-N1 first, not choose.
- **Kit's monthly-billing prices at 3,000 / 5,000 / 20,000 / 55,000 / 145,000 /
  255,000 are derived, not read.** The derivation matched the page exactly at both
  tiers where I could read the monthly display directly, which is good evidence but
  not proof at every tier. They are labelled `(derived)` in the table. The annual
  figures on the same rows **are** published values.
- **I sampled 10 of Kit's 45 slider steps.** V-N8 says plainly: do not interpolate a
  price for a subscriber count not in the table.
- **I did not read `NewsletterRevenueCalc.tsx`.** CHIP-CENTS-SWEEP owns
  `src/components/calculators/*` this wave. So I cannot say what the UI does with
  `platformFee` / `paymentProcessing`, whether it exposes a plan-cost line, or
  whether it renders a per-transaction fee. A correction chip must check that
  itself — and per D-013, `formatCurrency` would render a $0.30 fee as **"$0"**.
- **beehiiv publishes no revision date on its pricing page.** Kit's page markup
  carries `dateModified: 2024-12-18` while serving live prices. Freshness rests on
  these having been fetched today, not on any published stamp.
- **The `*` and `†` footnotes on beehiiv's "0% Take Rate on Paid Subscriptions*"
  were not captured** (V-N2). If they restrict the 0% by geography or eligibility,
  an unqualified "0%" claim is unsafe. I would resolve this before any copy ships.

### 3. Proposed follow-up chips

Ordered. Per D-012, **the fee chip must merge before the blog chip is spawned** —
the blog's numbers must come from the corrected module, not from prose arithmetic.

**CHIP-FEE-NEWSLETTER** — implementation. Correct the calculator against
`docs/facts/newsletter-platform-fees.md`.
Owns: `src/lib/calculators/newsletter-revenue.ts`,
`src/pages/creator/newsletter-revenue-calculator.astro`.
Needs: a transaction-count concept (annual payers bill 1×/yr, not 12×), a
beehiiv/Kit plan-cost input keyed to total list size, removal of the doubled 2.9%
on the Kit branch, the 0.7% Billing fee on Substack, and `+ $0.30 × transactions`
throughout. **Must state which V-N1 branch it assumes, in a source comment.** Must
not touch `src/components/calculators/NewsletterRevenueCalc.tsx` while
CHIP-CENTS-SWEEP is live — so either sequence it after that chip, or grant it the
component and hold CHIP-CENTS-SWEEP off this one file.

**CHIP-BLOG-NEWSLETTER** — implementation, **after** the above merges.
Owns: `src/content/blog/substack-vs-beehiiv-newsletter-revenue.md` only.
Rewrites the beehiiv and Kit sections, replaces the single $990 crossover with the
tier table, fixes the inverted $500/mo example, adds Kit's free-plan finding, and
recomputes all eight worked examples **by running the corrected module**. The
post's title and description name Substack and Beehiiv and stay as they are unless
the Command Center rules otherwise. Note that the frontmatter `calculatorSlugs`
points at `/creator/substack-calculator` and `/creator/newsletter-revenue-calculator`
— both are in other chips' correction scope.

**CHIP-FEE-GUARD-EXTEND** — implementation, small. D-011 promised platform fees
would be "enforced by a guard". Extend `scripts/check-tax-data.mjs` (or its
sibling) with a `SUPERSEDED` denylist for retired platform figures: Beehiiv `$99`
and `$399`, "Grow plan", Ko-fi Gold `$6`, Patreon `Lite`/`Premium`/`12%`, Gumroad
"flat 10%". This is what stops the same numbers reappearing. **Must be sequenced
after CHIP-FEE-GUARD, which owns `scripts/*` this wave.**

**CHIP-BLOG-TAXFIG** — implementation, small. Sweep every blog post for
hardcoded self-employment-tax arithmetic that skips the 92.35% adjustment. At
least one instance is live (`…newsletter-revenue.md:197`); per the protocol's
"verify reports exhaustively" rule, enumerate the class programmatically rather
than fixing the one I found. Owns: `src/content/blog/*.md`.

**CHIP-FACTS-INDEX** — Integrator-adjacent, tiny. Create `docs/facts/README.md`
naming the owning fact file per platform and the re-verification cadence. Resolves
the two-files-one-Substack ambiguity before it produces contradictory copy.

### 4. Harness improvements — for `CHIP-PROTOCOL.md`

Four things the protocol did not warn me about. All are cheap to add and each cost
me real time.

**(a) The Zendesk JSON escalation generalises — say so.** §8 records it as a
Patreon-specific trick. `support.substack.com` 403s to WebFetch and its
`/api/v2/help_center/en-us/articles/<id>.json` returns 200 with the full article
body **plus** exact `created_at` / `updated_at` / `edited_at` stamps that the
rendered page only shows as "Updated 8 months ago". Suggested rewrite: *"Many
vendor help centres run on Zendesk and are Cloudflare-gated. Try
`/api/v2/help_center/en-us/articles/<id>.json` before reaching for a browser — it
is faster than the browser path and returns exact revision timestamps the HTML
hides. Confirmed on `support.patreon.com` and `support.substack.com`."*

**(b) The Chrome extension may simply be absent, and the fallback pane is
crippled.** `mcp__claude-in-chrome__*` returned "not connected" for the whole
session. `mcp__Claude_Browser__preview_start` worked, but in it **`read_page`
returns "(empty page)" and `computer{screenshot}` returns a blank image**, even
after `resize_window` — while `get_page_text` and `javascript_tool` work fine.
That failure mimics a broken page rather than a broken tool. This is the same
class as the `client:visible` trap already in §8 and deserves the same treatment:
*"If the browser pane reports `Viewport: 0x0` or an empty accessibility tree,
the pane is hidden, not the page. Use `get_page_text` and `javascript_tool`;
`read_page` and screenshots will not work."*

**(c) Add a rule: a pricing page behind a control is not a pricing page.** The
single highest-risk thing I did was read an async-re-rendering price grid. At
250 ms settle both vendors returned the **previous** tier's prices with no error,
no warning, and a perfectly plausible-looking result — my first beehiiv ladder had
`$169` at 1,000 subscribers and `$69` at 2,500. Proposed rule: *"When a figure
comes from a control-driven page (slider, tier selector, billing toggle), allow
≥1.5 s of settle per step, re-read the control's own state alongside the value,
and **check the captured series for monotonicity**. A silently lagged read is
indistinguishable from a real figure."* Monotonicity was what caught it; nothing
else would have.

**(d) The Verify-row rule needs a "both branches" clause.** §7 says a Verify row
blocks dependent work. D-014 says Confident arithmetic may ship. Neither covers my
actual case: a Confident comparison whose *result* moves with an unresolved binary
(V-N1). Publishing one number would have been guessing; publishing nothing would
have discarded verified work. I published **both columns, labelled by which branch
they assume**. Proposing that as the general pattern: *"When Confident inputs and
one unresolved binary produce a range rather than a value, publish the range with
each end labelled by the branch it assumes. Do not collapse it, and do not
withhold it."*

**(e) Minor.** §8 says "Worktree-isolated chips cannot use Bash heredocs" — true,
and I used `Write`. Worth adding that `npx --yes tsx` works for scratch TS in a
worktree with no `node_modules`, so a research chip does **not** need `npm install`
just to run one module. That saved several minutes and the note belongs next to the
existing `npx tsx` line.

### 5. Model tier feedback

**Opus/medium was right, and I would not go lower.** The mechanical part — fetch a
page, copy a number — is Haiku-grade. The two findings that actually matter were
not mechanical:

- Noticing that Kit's "3.5% + $0.30" and the calculator's "3.5% platform fee +
  2.9% Stripe" are not the same claim, and that `3.5 − 2.9 = 0.6` is Kit telling
  you so explicitly.
- Noticing that a lagged slider read is undetectable except by checking the
  *series* for monotonicity.

Both are the kind of thing a cheaper tier reports as "verified: 3.5%" and moves
on — which is exactly how the current wrong numbers got published in the first
place. **Recommendation for the follow-ups:** CHIP-FEE-NEWSLETTER at **Opus /
medium** (it has to redesign the fee signature around transaction counts and pick
a V-N1 branch, both judgement calls); CHIP-BLOG-NEWSLETTER at **Opus / medium**
(the post's thesis needs rewriting, not just its numbers); CHIP-FEE-GUARD-EXTEND,
CHIP-BLOG-TAXFIG and CHIP-FACTS-INDEX at **Sonnet / medium** — all three are
bounded pattern work against a written spec.
