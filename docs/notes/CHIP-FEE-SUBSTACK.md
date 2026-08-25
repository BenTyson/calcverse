# CHIP-FEE-SUBSTACK

**Lane:** implementation
**Owns:** `src/lib/calculators/substack-revenue.ts`, `src/components/calculators/SubstackCalc.tsx`, `src/pages/creator/substack-calculator.astro`, `docs/notes/CHIP-FEE-SUBSTACK.md`
**Model:** Opus, high effort
**Ruling applied:** D-011 (platform fee data gets the tax-data treatment). Source of truth: `docs/facts/creator-payment-fees.md` § 6, verified 2026-08-25 against S12 (`support.substack.com` "How much does Substack cost").

---

## What shipped

### `src/lib/calculators/substack-revenue.ts`

- **Added the missing 0.7% Stripe Billing fee** (`STRIPE_BILLING_RATE = 0.007`), applied to gross alongside the 10% platform fee and Stripe's 2.9% + $0.30. This is the defect: no creator was modelled correctly, because the 0.5% legacy Billing rate expired 2025-06-30.
- **Added a source comment block** at the top of the module, styled after `shared/tax-brackets.ts` — cites the fact file, its 2026-08-25 verification date, and S12; explains *why* the Billing fee is routinely missed (Substack excludes it from the "Stripe processing fee" figure it shows creators); and enumerates the four open **Verify** rows (V-S1…V-S4) as explicitly NOT modelled, with a "do not fill these in from memory" warning.
- **Split the Stripe line in two.** `SubstackResults.stripeFee` is replaced by `stripeProcessingFee` (2.9% + $0.30) and `stripeBillingFee` (0.7%), plus `stripeFeeTotal` for a combined figure. Reporting them separately is the point — a creator reconciling against their Substack dashboard will only find the Billing fee under Transactions → All Activity.
- **Exported the rates** (`SUBSTACK_FEE_RATE`, `STRIPE_RATE`, `STRIPE_FLAT`, `STRIPE_BILLING_RATE`, `TOTAL_PERCENT_RATE`, `FEE_DATA_LAST_VERIFIED`) so the page copy consumes them instead of restating them. Per D-011's single-source-of-truth requirement.
- **Added `calculateNetPerPayment(payment)`** — fees on one recurring charge. Reproduces the fact file's § 6 table exactly and is what the page's worked examples are built from.
- **Named the annual-plan assumption.** `inputs.monthlyPrice * 10` is now `ANNUAL_PLAN_MONTHS`, documented as a *modelling convention, not a Substack rule* — Substack mandates no discount ratio (fact file § 7). Behaviour unchanged; only the framing and the copy were corrected. See Reflections for why I did not turn it into an input.

### `src/pages/creator/substack-calculator.astro`

- **Every dollar figure on the page is now computed at build time by running the calculator.** The frontmatter imports `calculateSubstackRevenue` / `calculateNetPerPayment` and interpolates the results into the prose, the FAQ answers, and the benchmark table rows. The numbers cannot drift from the model again, by construction.
- Rewrote the fee paragraph, added an `<h3>The 0.7% Stripe Billing Fee Most Calculators Miss</h3>` section explaining where it appears and that the 0.5% legacy rate expired, and stated the verification date in the body copy.
- Corrected the two FAQ answers carrying fee math, the "How to use" worked figure, the benchmarks table, the launch-to-$1,000 worked example, and the pricing-lever paragraph.
- **`title`, `description`, and `<h1>` untouched** — a separate chip owns retitling. Verified in the built HTML (below).

### `src/components/calculators/SubstackCalc.tsx`

- Fee Breakdown now shows four lines instead of three: Monthly Gross / Substack Fee (10%) / Stripe Processing / **Stripe Billing Fee (0.7%)** / Net Revenue, with a tooltip explaining that the Billing fee is charged separately and is not in Substack's Stripe processing figure.
- Corrected the "Pro tip" box, which asserted annual plans as "10 months of revenue upfront" (a restatement of the modelling convention as fact); it now leads with the real fee benefit — one $0.30 fixed fee a year instead of twelve.

---

## Verification

```
npm install                # clean, exit 0
rm -rf .astro dist         # cleared cache first, per protocol §8
npm run build              # "Server built in 21.73s / Complete!" — 0 errors, 0 warnings
                           # (re-run piped through grep -iE "error|warn": no matches)
npm run check:tax-data     # "✓ Tax data clean — TY2026, verified August 9, 2026,
                           #    no superseded figures outside the shared modules."
```

**Unit check** — `npx tsx` scratch script importing the real module (Node 20 rejects `--experimental-strip-types`, as the protocol warns). `calculateNetPerPayment` reproduces the fact file's § 6 table to the cent:

| Payment | Fact file net | Module net | Fact file rate | Module rate |
|---|---|---|---|---|
| $5/mo | $4.02 | $4.02 | 19.6% | 19.6% |
| $10/mo | $8.34 | $8.34 | 16.6% | 16.6% |
| $50/yr | $42.90 | $42.90 | 14.2% | 14.2% |
| $100/yr | $86.10 | $86.10 | 13.9% | 13.9% |

**Rendered check** — measured in `dist/client/`, not the source:

- `dist/client/creator/substack-calculator/index.html`: `grep -cE "8\.71|4\.22|43\.55|12-14%|805"` → **0**. Every pre-existing wrong figure is gone from the built page.
- The SSR'd calculator island in the same file renders the corrected default: Gross $950 / Substack -$95 / Stripe Processing -$49 / **Stripe Billing Fee (0.7%) -$7** / Net **$799** (was $805.70 under the old model).
- `<title>Substack Calculator - Newsletter Revenue Calculator</title>` and `<h1 …>Substack Revenue Calculator</h1>` — unchanged. `<meta name="description">` unchanged.
- FAQPage JSON-LD in the built HTML carries the corrected answer text.
- `dist/client/embed/creator/substack-calculator/index.html` also renders the Billing line.

**Runtime check** — `npm run preview` on :4321, driven through the browser tools.
- Calculator page: island SSRs correctly, breakdown reads as above.
- Embed page (`client:load`): hydrated, and changing Paid Subscribers → 1 and Price → $5 live-updated the effective fee rate to **18.2%**, which matches the model by hand-check of the mixed 70/30 monthly/annual split (gross $4.75, fees $0.8635 → 18.18%).
- The calculator page's `client:visible` island did **not** hydrate in this headless browser. I confirmed this is environmental, not mine: an untouched page (`/creator/patreon-calculator`) also shows all 3 `<astro-island>` elements still carrying `ssr=""` after load. IntersectionObserver does not fire in this browser context. Noted so the next chip does not chase it.

---

## Measurements

**Understatement introduced by the missing Billing fee**, measured on the rendered page's own scenarios:

| Scenario | Page claimed | Corrected net | Creator was over-promised |
|---|---|---|---|
| $10/mo subscription (page's headline example) | $8.71 | **$8.34** | $0.37/payment, 4.4% |
| $5/mo subscription | $4.22 | **$4.02** | $0.20/payment, 5.0% |
| $50/yr subscription | $43.55 | **$42.90** | $0.65/payment, 1.5% |
| Calculator default (100 subs @ $10, 30% annual) | $805.70/mo (module) | **$799.05/mo** | $6.65/mo, $79.80/yr |

**The intro copy was missing two fees, not one.** `$8.71 = $10 − 10% − 2.9%` and `$43.55 = $50 − 10% − 2.9%`, both exactly — the $0.30 flat fee is absent as well as the Billing fee. Even the *old* module would have said $8.41 and $43.25 for those payments. And $4.22 reconciles to nothing at all: the old module gives $4.06 for a $5 payment. The stated fee percentages (15.6%, 12.9%) match none of these figures either. So the page's worked examples were hand-arithmetic that had already drifted from the calculator sitting on the same page — which is why the fix here is to derive them at build time rather than to retype better numbers.

**Effective fee rate range** now stated on the page: 13.9% (at a $100 annual subscription) to 19.6% (at a $5 monthly one). The page previously claimed "typically 12-14%" — a range that does not contain the true rate at *either* of the two price points the page itself used as examples.

**Benchmark table** (rebuilt from the calculator at $7/mo, 3.5% conversion, 40% annual — effective rate 16.5%):

| Free subs | Paid | Old monthly (hand-written) | New monthly (computed) |
|---|---|---|---|
| 1,000 | 35 | $210 | $191 |
| 5,000 | 175 | $1,050 | $955 |
| 10,000 | 350 | $2,100 | $1,909 |
| 25,000 | 875 | $5,250 | $4,773 |
| 50,000 | 1,750 | $10,500 | $9,546 |

The old column reconciles to neither gross ($228.67 for row 1) nor net under the old model ($192.52) — it is exactly `paid × $6`, i.e. hand-written from a $6 figure that appears nowhere in the inputs. Under a header reading "Monthly Revenue (est.)" and a lede claiming the figures were "after Substack's 10% fee and Stripe processing," it overstated take-home by ~10% at every row, independent of the Billing fee. Header now reads "Monthly Net (est.)" and every cell comes from the calculator.

---

## Rollback record

Exact prior public-facing text, verbatim. **Restoring a string does not restore a ranking** — and in this case every string below is factually wrong, so a rollback would re-publish understated earnings.

**`src/pages/creator/substack-calculator.astro`**

FAQ 1 answer (prior):
> `Substack takes 10% of your revenue. Stripe payment processing adds another ~2.9% + $0.30 per transaction. Total fees are typically 12-14% of gross revenue, depending on your average transaction size.`

FAQ 3 answer (prior):
> `It varies wildly. The top 10 Substacks each make $1M+/year. Writers with 500 paid subscribers at $5/month earn ~$25K/year after fees. Most writers make under $10K/year. Build a large, engaged free list first.`

FAQ 4 answer (prior):
> `Yes! Annual subscribers pay 10 months upfront (with the typical 2-month discount) and churn at about 1/3 the rate of monthly subscribers. Aim for 30-50% of subscribers on annual plans.`

Intro paragraph (prior):
> `Substack takes a flat 10% of your subscription revenue. Stripe, which handles all payment processing, takes an additional 2.9% plus $0.30 per transaction. On a $10 monthly subscription, that means you receive roughly $8.71 after both fees. The per-transaction fixed cost of $0.30 makes lower price points less efficient — a $5 monthly subscription yields about $4.22 per payment (15.6% total fees), while a $50 annual subscription yields about $43.55 per payment (12.9% total fees).`

Annual-plan paragraph (prior):
> `Annual subscriptions are a critical lever in the Substack model. They are typically offered at a 10-20% discount (effectively 10 months for the price of 12), but annual subscribers churn at roughly one-third the rate of monthly subscribers. A newsletter with 50% of subscribers on annual plans will have significantly more stable revenue than one relying entirely on monthly billing.`

"How to use" paragraphs 2–3 (prior):
> `… The calculator accounts for both Substack's 10% platform fee and Stripe's payment processing fees.`
> `Use the projection to understand your growth trajectory. A newsletter with 5,000 free subscribers at a 3% conversion rate and $7/month pricing nets roughly $700-800/month after all fees. …`
> `Remember that annual subscriptions (typically offered at a 10-20% discount) provide better cash flow predictability and significantly lower churn. …`

Benchmarks lede + table (prior):
> `The table below shows estimated monthly revenue at different subscriber counts, assuming a $7/month price, 3.5% free-to-paid conversion rate, and 40% of paid subscribers on annual plans. Revenue is shown after Substack's 10% fee and Stripe processing.`
> Headers: `Monthly Revenue (est.)` / `Annual Revenue (est.)`
> Rows: `1,000 | 35 | $210 | $2,520` · `5,000 | 175 | $1,050 | $12,600` · `10,000 | 350 | $2,100 | $25,200` · `25,000 | 875 | $5,250 | $63,000` · `50,000 | 1,750 | $10,500 | $126,000`

Worked example (prior):
> `You start with 2,000 email subscribers from a blog or social media following. You launch a paid Substack at $8/month ($70/year for annual). In the first month, 3% convert to paid — that is 60 paid subscribers, split 60% monthly ($8) and 40% annual ($70/12 = $5.83 effective monthly).`
> `Monthly gross: 36 monthly subs at $8 = $288, plus 24 annual subs at $5.83 = $140. Total gross: $428. After Substack's 10% ($42.80) and Stripe processing (~$18), you net approximately $367 in month one.`
> `Assume you grow your free list by 500 subscribers per month … By month 6, you would have approximately 120 paid subscribers generating about $720 net. By month 10, you cross the $1,000/month threshold with roughly 170 paid subscribers.`

Strategy paragraphs (prior):
> `**Push annual plans aggressively.** Annual subscribers churn less, provide upfront cash flow, and smooth out revenue fluctuations. Offer a meaningful discount (15-20% off the monthly rate) and promote annual plans in onboarding emails, in posts, and at renewal time. Aim for 40-50% of your paid base on annual billing.`
> `**Raise prices deliberately.** … Moving from $7 to $10/month is a 43% revenue increase per subscriber. Some existing subscribers will cancel, but the math usually favors higher prices: even losing 20% of subscribers at a 43% price increase nets you a 14% revenue gain.`

**`src/components/calculators/SubstackCalc.tsx`**

Fee Breakdown row (prior):
> `{ label: <Tooltip text="Stripe payment processing: 2.9% + $0.30 per transaction">Stripe Fees</Tooltip>, value: `-${formatCurrency(results.stripeFee)}` },`

Pro tip box (prior):
> `**Pro tip:** Push annual subscriptions—you get 10 months of revenue upfront and annual subscribers churn at 1/3 the rate of monthly subscribers.`

**API rollback note:** `SubstackResults.stripeFee` no longer exists. Reverting the page/component without reverting the module (or vice versa) will not typecheck — the three files roll back together.

---

## Changelog entry (pre-drafted — Integrator merges this, do not write it to shared docs yourself)

- **Substack calculator: added Stripe's 0.7% Billing fee.** Total take is 13.6% + $0.30 per payment, not 12.9%. A $10/month subscription nets $8.34, not $8.71. The fee breakdown now reports Stripe processing and Stripe Billing separately, matching how the charges actually appear in a creator's Substack dashboard. Every worked example, FAQ figure, and benchmark row on the page is now computed at build time by running the calculator. Fees sourced to `docs/facts/creator-payment-fees.md` § 6 (verified 2026-08-25) per D-011.

---

## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| high | 0.7% Stripe Billing fee absent from the model; the 0.5% legacy rate expired 2025-06-30, so **no** creator was modelled correctly | `src/lib/calculators/substack-revenue.ts:29-32` (prior) | fixed here |
| high | `newsletter-revenue.ts` models Substack at `10% + 2.9%` — missing the 0.7% Billing fee **and the $0.30 flat fee entirely**, for all three platforms | `src/lib/calculators/newsletter-revenue.ts:46-66` | left: not my file — proposed as CHIP-FEE-NEWSLETTER |
| high | Blog post `substack-vs-beehiiv-newsletter-revenue.md` runs ~10 Substack fee calculations, all omitting the 0.7%, and derives a **Substack-vs-Beehiiv break-even** from them | `src/content/blog/substack-vs-beehiiv-newsletter-revenue.md:35,43,45,55,71,73,77,79,81` | left: not my file — proposed as CHIP-FEE-NEWSLETTER-BLOG |
| high | Benchmarks table published **gross** revenue under a "Monthly Revenue (est.)" header and a lede claiming it was net of fees — a ~10% overstatement independent of the Billing fee | `src/pages/creator/substack-calculator.astro` deep-dive table | fixed here |
| medium | Intro copy omitted Stripe's **$0.30 flat fee** too — `$8.71 = $10 − 10% − 2.9%` exactly; the old module itself said $8.41 | same page, intro paragraph | fixed here — copy is now derived from the calculator at build time |
| medium | Beehiiv 0% / ConvertKit 3.5% platform fees are in the code and in a published blog post but appear **nowhere** in the fact file — never verified by any research chip | `newsletter-revenue.ts:53-62`, blog post | left: blocked — needs research, see below |
| medium | `annualSubPrice = monthlyPrice * 10` hardcodes a discount Substack does not mandate; it should be an input | `src/lib/calculators/substack-revenue.ts` | left: named + documented as `ANNUAL_PLAN_MONTHS`, behaviour unchanged — see below |
| low | `client:visible` islands never hydrate in the headless browser here; SSR HTML is correct and `client:load` embeds hydrate fine | environment | left: documented above so the next chip doesn't chase it |
| low | Service worker registration throws on `npm run preview` ("Failed to register a ServiceWorker … unknown error occurred when fetching the script") on every page | `public/sw.js` / preview server | left: pre-existing, unrelated, cosmetic in preview |

### 1. What I saw outside my scope

**`newsletter-revenue.ts` is worse than `substack-revenue.ts` was.** My spawn prompt told me to expect it to be "likely wrong the same way." It is wrong in the same way *and one more*: it omits Stripe's $0.30 flat fee for all three platforms, not just the 0.7% Billing fee. Since the whole point of that calculator is comparing Substack against Beehiiv and ConvertKit, and the $0.30 is precisely what makes small-payment platforms expensive, the omission distorts the comparison rather than just shifting it. Under D-001 that is a comparison-engine defect, not a page defect.

**The blog post is the bigger exposure.** `substack-vs-beehiiv-newsletter-revenue.md` is a comparison article that runs the fee math out loud roughly ten times and lands on a headline claim — "the breakeven point is $990 per month in gross revenue" — derived from an understated Substack cost. With the Billing fee the Substack side is higher, so the break-even moves in Beehiiv's favour. It also states "your effective fee rate is 15.9%" for a $10/200-subscriber Substack, which is now 16.6%. This is exactly the D-011 defect class (advice derived from a wrong fee) in exactly the D-001 strategic category (cross-platform comparison).

**Beehiiv and ConvertKit have never been researched.** The fact file covers Ko-fi, Patreon, BMC, Gumroad, Substack. Beehiiv's "0% on the $99/mo Scale plan" and ConvertKit's "3.5%" are load-bearing in both a live calculator and a live blog post, and neither figure has a primary source anywhere in the repo. Per D-011 and protocol §7, any chip correcting the newsletter comparison is **blocked** until a research chip verifies them. I did not touch either figure.

**The annual-discount hardcode.** The fact file flags `monthlyPrice * 10` as "a modelling assumption presented as a platform rule." I deliberately did **not** convert it into an input: it is not a fee error, it changes the calculator's default output and its URL-state shape, and doing it inside a fee-correction chip would entangle two independent changes in one diff — making the fee fix harder to review and harder to roll back. What I did instead was name the constant, document it as a convention rather than a rule, and correct every piece of copy that asserted it as Substack policy. Converting it to an input is a clean standalone follow-up.

### 2. Risks in what I built

- **V-S2 is still open and I built on top of it.** The fact file does not establish whether Substack's 10% is taken before or after Stripe's fees. I apply all three percentages to gross, because that is what reproduces the fee table the fact file itself publishes — so the module and the fact file agree, but they could be jointly wrong. If Substack's 10% is actually taken on the post-Stripe amount, every net figure here is understated by roughly 0.36% of gross. I have flagged this in the module's comment block. It is a small error in a known direction, and resolving it needs a primary source, not a judgement call.
- **Building copy from the calculator at build time is a real trade-off.** It permanently prevents number drift, which is the defect this chip exists to fix. The cost is that the prose is now `{usd(...)}` interpolations, so a future writer editing the page has to understand that the numbers come from the frontmatter. I think that is the right trade on a YMYL-adjacent money page, but it is a new pattern on this site and someone should confirm they want it before it spreads.
- **Removing `SubstackResults.stripeFee` is a breaking rename.** I grepped every reference to `substack` across `src/`, `scripts/`, and `public/`; the only consumer is `SubstackCalc.tsx`, which I own, and the embed route renders the component rather than the results. But a rollback has to move all three files together.
- **The 60→120→170 subscriber trajectory in the worked example is narrative, not simulated.** The dollar figures at each of those counts now come from the calculator; the counts themselves are the original author's illustration and I left them alone. They are directionally consistent with the model's projection (default inputs project 100 → 124 at 6 months) but not derived from it.

### 3. Proposed follow-up chips

- **CHIP-FEE-NEWSLETTER** — owns `src/lib/calculators/newsletter-revenue.ts`, `src/components/calculators/NewsletterCalc.tsx`, `src/pages/creator/newsletter-revenue-calculator.astro`. Adds the 0.7% Billing fee and the missing $0.30 flat fee to the Substack branch. **Must be sequenced after** a research chip verifies Beehiiv and ConvertKit, or scoped explicitly to "fix Substack only, leave the other two branches untouched and labelled unverified" — otherwise it will be tempted to resolve a figure that has no fact-file row at all, which is the D-012 failure mode. It can import the exported rates from `substack-revenue.ts` rather than restating them.
- **CHIP-RESEARCH-NEWSLETTER-PLATFORMS** — web-capable research chip; owns a new section of `docs/facts/creator-payment-fees.md` (or a sibling fact file) covering **Beehiiv** and **ConvertKit/Kit** plan pricing and revenue share. Blocks the two chips above. Also a good moment to close **V-S2** (Substack's 10% base) and **V-S1** (payout terms), both of which I had to work around.
- **CHIP-FEE-NEWSLETTER-BLOG** — owns `src/content/blog/substack-vs-beehiiv-newsletter-revenue.md`. Recomputes every fee figure and the Beehiiv break-even. Blocked on the research chip. Note this post's break-even claim is the kind of specific, quotable number that a comparison hub would want to reuse, so getting it right has leverage beyond the post.
- **CHIP-SUBSTACK-ANNUAL-PRICE** — small; owns the same three Substack files. Turns `ANNUAL_PLAN_MONTHS` into an Advanced-mode input (annual price, or discount %), so the page stops implying Substack sets the ratio. Should run *after* this chip merges, not concurrently.
- **Fee-data guard.** D-011 says platform fees should be "enforced by a guard," and that guard does not exist yet. `scripts/check-tax-data.mjs` has the right shape: a `SUPERSEDED` denylist would catch a resurrected `0.005` Billing rate, a `0.05`/`0.08`/`0.12` Patreon plan, or a `$6` Ko-fi Gold price appearing anywhere outside the fee modules. Worth its own chip, owned by whoever also owns `package.json`'s scripts block. This is the piece that makes D-011 self-enforcing rather than dependent on the next chip remembering.

### 4. Harness improvements

- **The protocol should say where a chip's scratch script goes.** §8 tells you to use `npx tsx` but not where to put the file. Writing it into the worktree risks leaving an untracked file for the Command Center to trip over; I used the session scratchpad with an absolute import path, which worked cleanly. Worth one line in §8.
- **A worktree-isolated chip cannot use a heredoc in Bash.** `cat > file <<'EOF'` was refused as "too complex to verify that it stays inside the worktree." The fix is to use the `Write` tool, which is obvious in hindsight and cost me a round-trip. Worth adding to the Environment traps list beside the `npx tsx` note.
- **Add the `client:visible` hydration trap to §8.** "Load the affected page and confirm the behavior" is the implementation-lane bar, but calculator-page islands do not hydrate in this headless browser at all — the embed route (`client:load`) is the only place you can drive the component live. A chip that does not know this will either conclude it broke hydration or will skip the runtime check. The recipe that works: verify SSR output in `dist/client/`, then drive the `/embed/...` route for interactivity.
- **§7's "public factual copy ships with a fact table" should extend to worked examples.** The rule as written is about *claims*; the failure here was arithmetic in prose, which no fact table catches. The stronger rule — already in `CLAUDE.md`'s Tax Data §7 but not in the protocol — is: **derive published figures from the calculator, don't transcribe them.** Doing it at build time makes drift structurally impossible, and I'd suggest the protocol name that as the preferred pattern rather than "compute by running the calculator," which still leaves a hand-copied number in the file.
- **The do-not-touch list worked exactly as intended.** I found two high-severity defects in sibling territory (`newsletter-revenue.ts`, the comparison blog post) and reporting rather than fixing them was unambiguous. No friction.

### 5. Model tier feedback

Opus/high was right, but the money math was not the hard part — the arithmetic is four rates and a flat fee, and it was verified against the fact file's own table in one pass. The effort went into (a) auditing the page for *every* figure that silently depended on the fee model, which turned up the benchmark table publishing gross revenue under a net header — a defect nobody had flagged and that is larger than the 0.7% at every row — and (b) deciding what *not* to touch: the annual-price hardcode, the Beehiiv/ConvertKit rates, the sibling files. A lower tier would very plausibly have fixed the 0.7% correctly and left the gross-labelled-as-net table in place, or "helpfully" corrected the unverified Beehiiv rate. The judgement about scope boundaries is what justified the tier here, not the computation.
