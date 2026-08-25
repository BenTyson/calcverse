# CHIP-FEE-GUMROAD

**Lane:** implementation
**Owns:** `src/lib/calculators/gumroad-revenue.ts`, `src/components/calculators/GumroadCalc.tsx`, `src/pages/creator/gumroad-calculator.astro`, `docs/notes/CHIP-FEE-GUMROAD.md`
**Model:** Opus, high effort
**Source of truth:** `docs/facts/creator-payment-fees.md` § 5 (research date 2026-08-25). No figure below comes from anywhere else.

## What shipped

### `src/lib/calculators/gumroad-revenue.ts`

The fee model changed **shape**, not just a constant. It was `revenueAfterRefunds * (gumroadFee / 100)`; it is now a percentage component plus a flat component multiplied by a transaction count.

- New source comment block at the top, styled after `shared/tax-brackets.ts`: cites the fact file, its research date, both underlying primary sources (S10 `gumroad.com/pricing`, S11 `gumroad.com/help/article/13-getting-paid`), lists what is deliberately **not** modelled and why, and lists the three assumptions the model makes.
- New exported constants `GUMROAD_FEE_PERCENT` (10), `GUMROAD_FLAT_FEE` (0.5), `GUMROAD_FEES_LAST_VERIFIED` (`'August 25, 2026'`).
- New input `gumroadFlatFee: number` (default `0.5`), exposed in **both** modes — the flat fee is half the headline rate, so hiding it in Advanced would have reproduced the defect.
- New input `flatFeeOnMemberships: 'yes' | 'no'` (default `'yes'`), Advanced only. See "The V-G1 problem" below.
- **No new sales-count input was needed** — `monthlySales` already existed and `memberCount` already counts renewals. Checked before adding, per the spawn prompt.
- Transaction count is `monthlySales * (1 - refundRate/100) + (flatFeeOnMemberships === 'yes' ? memberCount : 0)`. Refunded sales reverse the flat fee as well as the percentage, matching how the module already treated refunds for the percentage.
- New results: `billableTransactions`, `gumroadPercentFeeAmount`, `gumroadFlatFeeAmount`, `gumroadEffectiveRate`, `feePerSale`, `netPerSale`, `perSaleFeeRate`. `gumroadFeeAmount` is retained as the combined total, so nothing downstream breaks.
- `gumroadFee` slider range widened 5–15 → 5–30 so a reader can at least express the Discover rate manually.
- Defensive clamps added on `gumroadFlatFee` (≥ 0) and `refundRate` (0–100), and `gumroadFlatFee` falls back to `GUMROAD_FLAT_FEE` if a pre-existing shared `?s=` URL decodes without the field.

### `src/components/calculators/GumroadCalc.tsx`

- Per-transaction fee input, and an inline live line under the fee controls: *"At $29.00, Gumroad's 10% + $0.50/sale works out to **11.7%** — you keep **$25.60** per sale."*
- Two new result cards: **Gumroad's Real Rate** (`perSaleFeeRate`) and **You Keep Per Sale** (`netPerSale`).
- Breakdown splits the fee into `Gumroad Fee (10%)` and `Per-Transaction Fees (19.4 x $0.50)`. The flat row is suppressed when it is zero.
- The Advanced membership block gains the V-G1 dropdown with its caveat in `helpText`.
- **All per-sale and per-transaction money now renders through `formatCurrencyWithCents`, not `formatCurrency`.** See Measurements — this was a live bug in the first cut.
- Quick-mode fee panel and the tips list rewritten around the flat fee and the $100 payout minimum.
- `getResultsText()` now carries the fee as `10% + $0.50/sale = 11.7% effective`.

### `src/pages/creator/gumroad-calculator.astro`

Title, description and `<h1>`/`calculatorName` untouched, per the spawn prompt.

- Every "flat 10%" / "no additional credit card fees" / "for every $1 you charge, you keep $0.90" claim removed or corrected.
- New intro subsection **"What the $0.50 Actually Costs You"** with the price/fee/net/effective-rate table.
- Discover stated as a published fact without asserting how it interacts with the direct rate (V-G2 is open).
- Merchant-of-record status added — per fact file § 8 it is Gumroad's one genuinely distinctive property and was nowhere on the site.
- Two FAQs added ("Why is my Gumroad fee higher than 10 percent?", "When does Gumroad pay you?"); the remaining five rewritten.
- New section **"Getting Paid: Gumroad's Payout Rules"** ($100 minimum, 7-day hold, PayPal 2%, instant 3%, country-change forfeiture).
- **Competitor table replaced.** See "The competitor-table problem" below.
- New visible **Sources & Last Updated** block at the foot of the deep-dive, linking S10 and S11 with the 2026-08-25 verification date and naming the two unpublished assumptions. It is hand-rolled rather than `SourcesBlock.astro` because that component is tax-specific (it takes `taxYear`, and its body text is about IRS filing) and I do not own it.

## The V-G1 problem — and why there is a dropdown

V-G1 is open: Gumroad says the fee is "per transaction for all sales" but never addresses recurring billing. D-011 says resolving a Verify row by picking the plausible number is exactly the defect the fact file exists to prevent. Both silent choices are wrong in the same way — omitting the $0.50 understates, forcing it overstates.

So the choice is **exposed to the reader** as a labelled dropdown whose help text states plainly that Gumroad does not publish this. It defaults to charging it, which is the literal reading of the published rate, and the page copy and FAQ both say so. This is disclosure, not resolution; V-G1 stays open.

## Discover (30%) — deliberately not modelled

Modelling it requires resolving **V-G2** (is 30% instead of, or on top of, 10% + $0.50?). The fact file records that Gumroad's pricing page presents them as two alternative per-transaction rates without saying so explicitly. Either implementation would be a guess baked into money math.

The rate is therefore **stated** on the page and in the calculator's fee panel as a published fact, with "this calculator models direct sales only". Widening the percentage slider to 30% at least lets a reader model it by hand. Proposed as a follow-up chip below.

## The competitor-table problem — the largest judgement call here

The old table compared Gumroad against Etsy, Shopify Basic, Payhip, Lemon Squeezy and Teachable, with a computed "Total on $30 Sale" column. **None of those five platforms is in the fact file**, and under D-011 third-party platform fees are now governed like IRS figures: primary sources fetched in-session or nothing. I have no verified figure for any of them, and I am an implementation chip with no research mandate.

Publishing the corrected Gumroad row alongside five unverified competitor rows would have fixed the like-for-unlike asymmetry by making the *rest* of the table the unverified part.

So the table was rebuilt from fact file § 8 — **Gumroad, Ko-fi, Patreon, Buy Me a Coffee, Substack** — every cell tracing to a Confident row, and every platform quoted *with* its fixed component and with whether processing is charged separately. A paragraph states explicitly why Etsy and Shopify are absent and links to the Etsy fee calculator.

Two consequences worth the Command Center's attention:

1. The computed "$X on a $30 sale" column is gone. It cannot be restored honestly for Buy Me a Coffee — the fact file marks **V-B3** as blocking *any* BMC effective-rate number — and partial columns invite exactly the asymmetry this chip was sent to fix.
2. The page now loses its Shopify break-even claim ("approximately $560/month"). That claim was arithmetic on unverified Shopify inputs and was also wrong under the new fee model. I computed replacements (at $30: Gumroad $3.50/sale vs Shopify $1.17/sale → break-even ~17 sales/month, ~$502) but **did not publish them**, because the $39/mo and 2.9% + $0.30 inputs are unverified.

If the Command Center would rather keep competitor breadth than fact-file purity, that is a ruling to make explicitly, not a thing for a chip to decide.

## Verification

```
npm install                       # worktree started empty; completed clean
rm -rf .astro dist && npm run build
npm run check:tax-data
```

- `npm run build` — **0 errors, 0 warnings.** Grepped the full output for `error|warn|✘`: no matches. 141 pages built, "Complete!".
- `npm run check:tax-data` — `✓ Tax data clean — TY2026, verified August 9, 2026, no superseded figures outside the shared modules.` No new figure in this chip collides with the `SUPERSEDED` denylist.
- `git status --porcelain` shows exactly the three owned `src/` files modified. Nothing else touched.

**Runtime check.** `client:visible` does not hydrate in this environment (see Harness improvements), so behaviour was verified on `/embed/creator/gumroad-calculator`, which renders the same `GumroadCalc` under `client:load`. Every number below was read out of the live DOM and matches the scratch-script output exactly:

| Scenario | Live DOM | Expected |
|---|---|---|
| Default, price $29 | `At $29.00 ... works out to 11.7% — you keep $25.60 per sale` | 11.7% / $25.60 |
| Price → $5 | `20.0% — you keep $4.00`; breakdown `Gumroad Fee (10%) -$9.70`, `Per-Transaction Fees (19.4 x $0.50) -$9.70`, `Net Monthly $77.60` | 100 − 3 − 9.70 − 9.70 = 77.60 |
| 100 members @ $9, flat fee **on** | `Per-Transaction Fees (100 x $0.50) -$50.00`, `Net Monthly $760.00` | $760.00 |
| 100 members @ $9, flat fee **off** | flat-fee row absent, `Net Monthly $810.00` | $810.00 |
| Quick-mode reset | affiliate row disappears after hydration | affiliatePercent → 0 |

Console: no React or hydration errors (the only entries were a dev-only service-worker 404 and Vite HMR).

## Measurements

**Every worked example on the page was computed by running `calculateGumroadRevenue` under `npx tsx`, never by hand.** Node 20 rejects `--experimental-strip-types`, as the protocol warns.

Per-sale fee at the standard 10% + $0.50:

| Price | Fee | Net | Effective |
|---|---|---|---|
| $5 | $1.00 | $4.00 | 20.0% |
| $10 | $1.50 | $8.50 | 15.0% |
| $19 | $2.40 | $16.60 | 12.6% |
| $29 | $3.40 | $25.60 | 11.7% |
| $39 | $4.40 | $34.60 | 11.3% |
| $50 | $5.50 | $44.50 | 11.0% |
| $100 | $10.50 | $89.50 | 10.5% |

These reproduce the fact file's own derived table at $5/$10/$29/$50/$100 exactly, which is the cross-check that the implementation matches the researched rate.

Monthly scenarios published on the page, all with `refundRate: 0` unless stated:

| Scenario | Gumroad fee | Net |
|---|---|---|
| $29 × 20 | $68.00 ($58 pct + $10 flat) | **$512.00** |
| $39 × 20 | $88.00 | **$692.00** |
| $29 × 20, 3% refunds | $65.96 ($56.26 + $9.70) | **$496.64** |
| $19 × 60 (launch) | $144.00 ($114 + $30) | **$996.00** |
| $19 × 45 (steady) | $108.00 | **$747.00** |
| $19 × 45, 20% affiliate @ 30% | $108.00 + $51.30 commission | **$695.70** |
| $20 × 1, affiliate @ 30% | $2.50 + $6.00 | **$11.50** |

**The rendered-value measurement that caught a live bug.** After the first passing build I dumped `dist/client/creator/gumroad-calculator/index.html` and grepped it. The fee label rendered as **`10% + $1/sale`** and the net-per-sale as **`$26`**. `formatCurrency` in `src/lib/utils/formatters.ts` is `minimumFractionDigits: 0, maximumFractionDigits: 0` — it rounds `0.5` to `$1`. The entire point of this chip would have shipped as a rounding artefact, and the source code looked perfectly correct. Fixed by routing every per-sale and per-transaction figure through `formatCurrencyWithCents`, with a comment above the import saying why. Post-fix grep of the built HTML: `+ $1/sale` → 0 occurrences, `10% + $0.50` → 11.

Removed-figure sweep of the rebuilt HTML — every stale number is gone and every replacement is present:

`$0.90` 0 · `$26.10` 0 · `$522` 0 · `$702` 0 · `$1,026` 0 · `$769.50` 0 · `$723.33` 0 · `$12.00` 0 · `$560` 0 · `Payhip` 0 · `Lemon Squeezy` 0 — and `10% + $0.50` 11 · `11.7` 7 · `$512` 2 · `$692` 1 · `$996` 1 · `$747` 1 · `$695.70` 1 · `merchant of record` 6.

(The single surviving `Teachable` is a related-post card title from `best-platforms-selling-digital-products.md`, not this page's copy. The single surviving `flat 10` is my own sentence negating it.)

## Rollback record

Exact prior values of every public-facing string changed. **Restoring a string does not restore a ranking** — this page holds 1,179 impressions at position 9.7 and the copy body was substantially rewritten.

### `src/pages/creator/gumroad-calculator.astro` — FAQ answers (verbatim, prior)

1. *How much does Gumroad charge per sale?* — "Gumroad charges a flat 10% fee on every transaction. This includes payment processing — there are no additional credit card fees, monthly subscriptions, or listing fees. This makes pricing simple compared to platforms like Etsy or Shopify."
2. *Is Gumroad good for selling digital products?* — "Gumroad is one of the best platforms for selling digital products like ebooks, courses, templates, software, and design assets. The flat 10% fee is competitive, there are no monthly costs, and you get built-in tools for email marketing, affiliates, and memberships."
3. *How does the Gumroad affiliate program work?* — unchanged except for a new final sentence: "This calculator assumes the commission is a percentage of the gross sale price and comes out of your share rather than Gumroad's."
4. *How do Gumroad memberships work?* — "Gumroad memberships let you charge recurring monthly or annual fees for access to content, community, or ongoing deliverables. The same 10% fee applies to membership payments. Members can cancel anytime, and you get tools to manage tiers and content access."
5. *Gumroad vs Etsy vs Shopify — which should I use?* — "Gumroad (10% flat) is best for digital products with no monthly fee. Etsy (6.5% + listing fees) is best for handmade/vintage physical goods with built-in marketplace traffic. Shopify (2.9% + $39/mo) is best for high-volume stores that need full customization. Choose based on your product type and sales volume."

Two FAQs were **added** (nothing to roll back): "Why is my Gumroad fee higher than 10 percent?" and "When does Gumroad pay you?". Question strings 1–5 are unchanged; only answers changed. FAQPage schema is generated from these, so a rollback restores the schema too.

### `src/pages/creator/gumroad-calculator.astro` — prose (verbatim, prior)

- Intro ¶1: "…Its fee structure is one of the simplest in the creator economy: a flat 10% on every transaction, with no monthly subscriptions, listing fees, or separate payment processing charges. This all-inclusive model makes it straightforward to calculate your margins — for every $1 you charge, you keep $0.90."
- Intro ¶3 (Product Types): "…The 10% fee applies identically to both models, so your pricing strategy should focus on customer lifetime value rather than trying to optimize around fee differences."
- Intro ¶4: "…so a $20 product with 10% Gumroad fee and 30% affiliate commission nets you only $12.00 per affiliate-driven sale."
- How to Use ¶1: "Enter your product price and expected monthly sales to see your net revenue after Gumroad's 10% fee. The calculator shows exactly what you keep from each sale, making it easy to price your digital products profitably."
- Quick Mode: "Set your product price, monthly sales volume, and Gumroad's fee rate (default 10%). The calculator shows your gross revenue, fee deduction, and net take-home. Use this to quickly test different price points and see how they affect your bottom line."
- Understanding Gumroad Fees: "Gumroad's flat 10% fee is all-inclusive — it covers payment processing, hosting, delivery, and the platform itself. There are no monthly subscriptions, listing fees, or hidden charges. This simplicity makes it easy to calculate your margins, unlike platforms with stacked fee structures." / "For context, selling a $29 digital product nets you $26.10 after Gumroad's cut. At 20 sales per month, that is $522 in net revenue. Increasing your price to $39 would net $702 per month at the same volume — a 34% increase in revenue from a $10 price bump."
- Comparison intro: "Choosing the right platform depends on your product type, sales volume, and whether you need marketplace traffic or bring your own audience. The table below compares effective fees across popular platforms for digital product sales."
- Comparison table rows (Platform | Platform Fee | Payment Processing | Monthly Cost | Total on $30 Sale): Gumroad `10% | Included | $0 | $3.00 (10%)`; Etsy (digital) `6.5% + $0.20 | 3% + $0.25 | $0 | $3.10 (10.3%)`; Shopify Basic `0% | 2.9% + $0.30 | $39 | $1.17 + $39/mo`; Payhip `5% | ~2.9% + $0.30 | $0 (free plan) | $2.67 (8.9%)`; Lemon Squeezy `5% + 50c | Included | $0 | $2.00 (6.7%)`; Teachable (Basic) `5% | ~2.9% + $0.30 | $59 | $2.67 + $59/mo`.
- Comparison closing ¶: "Gumroad's 10% flat fee is competitive at low to medium volumes because there is no monthly subscription. However, at higher volumes, platforms with lower percentage fees and a monthly subscription become more cost-effective. The break-even point where Shopify becomes cheaper than Gumroad is approximately $560/month in sales ($39 / 0.07 difference in fee rates)."
- Worked example ¶¶: "…you sell 60 copies in week one: 60 x $19 x 0.90 = $1,026 net revenue." / "At a steady 1.5 sales/day, monthly revenue is: 45 x $19 x 0.90 = $769.50 net." / "Those affiliate sales net you: $19 x 0.90 x 0.70 = $11.97 per sale (vs. $17.10 for direct sales). At 9 affiliate sales per month, affiliate revenue is $107.73 and direct revenue is $615.60, for a blended total of $723.33."

Sections **added** with no prior text: "What the $0.50 Actually Costs You", "Getting Paid: Gumroad's Payout Rules", the "Bundle rather than fragment" strategy paragraph, and the Sources & Last Updated block. Untouched: `title`, `description`, `ogImage`, `calculatorName`, `slug`, `relatedCalculators`, the "Growing Gumroad Revenue" paragraph, and the first four "Strategies" paragraphs.

### `src/components/calculators/GumroadCalc.tsx` (verbatim, prior)

- Fee slider tooltip: "Gumroad charges a flat 10% fee that includes payment processing — no additional transaction fees"; label `Gumroad Fee`; helpText "Standard rate is 10% (includes payment processing)"; range `min={5} max={15}`.
- Quick-mode panel body: "Gumroad charges a flat 10% fee on all transactions. This includes payment processing — no hidden charges. Compare this to Etsy (6.5% + listing fees) or Shopify (2.9% + monthly plan)."
- Breakdown fee row tooltip: "Gumroad's flat fee includes payment processing — no additional transaction fees"; single row `Gumroad Fee ({inputs.gumroadFee}%)`.
- Effective-fee-rate card description: `` `${formatCurrency(results.totalDeductions)}/month in fees` ``.
- Tips list, first and third bullets: "Price higher than you think — digital products have near-zero marginal cost" and "Offer product bundles to increase average order value".

## Changelog entry (pre-drafted — Integrator merges this, do not write it to shared docs yourself)

- **Gumroad calculator: fee model corrected from a flat percentage to 10% + $0.50 per transaction.** The module modelled Gumroad as a pure percentage, understating fees on every calculation — 11.7% rather than 10% at its own $29 default, and 20% rather than 10% at $5. Added a per-transaction fee component driven by the existing sales/member counts, surfaced Gumroad's real (price-dependent) rate and net-per-sale in the results, and rebuilt the page copy: removed the "flat 10%" and "you keep $0.90 of every $1" claims, recomputed every worked example by running the calculator, added Gumroad's merchant-of-record status and payout rules ($100 minimum, PayPal 2%, instant 3%), and replaced the competitor table with one built only from verified `docs/facts/creator-payment-fees.md` rows. Discover's 30% rate is stated but not modelled — V-G2 is still open. Figures verified 2026-08-25 (D-011).

## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| blocker | Gumroad modelled as a flat percentage; no per-transaction fee. Understated fees on 100% of calculations (11.7% real vs 10% modelled at the module's own default; 20% vs 10% at $5) | `src/lib/calculators/gumroad-revenue.ts:77` (prior) | fixed here |
| high | `formatCurrency` rounds to whole dollars, so `$0.50` rendered as **`$1`** and `$25.60` as `$26`. The source read correctly; only the built HTML showed it | `src/lib/utils/formatters.ts:1-12`, consumed by every calculator | fixed in my component; **the shared hazard is unfixed and affects all 45 calculators** |
| high | Blog post states "Gumroad charges a flat 10 percent… On a $29 ebook, Gumroad takes $2.90 and you keep $26.10. On a $99 design template, you keep $89.10." Correct: $3.40/$25.60 and $10.40/$88.60. Same post's membership example ("50 members × $9 → $405 after fees") should be $380 | `src/content/blog/best-platforms-selling-digital-products.md:22,24,36` | left: not my file — proposed as CHIP-FEE-BLOG-GUMROAD |
| high | Page compared Gumroad against 5 platforms whose fees are in no fact file, with a computed per-sale column | `src/pages/creator/gumroad-calculator.astro:110-129` (prior) | fixed here by restricting the table to verified platforms — needs a ruling, see below |
| medium | "A Gumroad creator selling a $29 template pays roughly 10% in platform and processing fees" — really 11.7%; the 79% net-margin figure derived from it is overstated | `src/content/blog/profit-margin-side-hustles.md:61` | left: not my file — same proposed chip |
| medium | Discover's 30% rate cannot be modelled without resolving V-G2 | `docs/facts/creator-payment-fees.md:335` | left, why: stated on the page, not modelled — proposed as CHIP-FEE-DISCOVER |
| medium | Blog post repeats the closed Patreon 8% "Pro plan" as live advice ("Pro is where most creators land") | `src/content/blog/patreon-fees-and-earnings.md:23` | left: sibling chip's platform, and D-012 territory |
| low | `useCalculatorState`'s quick-mode reset runs in a `useEffect`, so SSR HTML renders `DEFAULT_INPUTS` (affiliatePercent 10) and the visible numbers change on hydration. Crawlers see $482.14; users see $496.64 | `src/hooks/useCalculatorState.ts:14-18` | left: pre-existing, affects every calculator, not mine to change |
| low | `SourcesBlock.astro` is hard-wired to tax content (`taxYear` prop, IRS-specific body text), so a fee-sourced calculator cannot use it | `src/components/calculator/SourcesBlock.astro:16-34` | left: hand-rolled an equivalent block; proposed generalisation below |

### 1. What I saw outside my scope

**The formatter is the story here.** The protocol's "measure the rendered value, never the source value" rule earned its place again, and in a new way: the Wave 1 lesson was about a layout *appending* a string. This one is about a shared formatter *removing* information. `formatCurrency` renders every value with zero fraction digits. That is fine for `$5,959` and actively wrong for `$0.50`. My first build passed cleanly, the source was correct, the tests I would have written would have passed — and the page said Gumroad charges "10% + $1/sale". A 100% error in the exact figure the chip existed to publish.

This is not a Gumroad problem. Any calculator on this site that has to show a sub-dollar or cents-significant amount — per-mile rates, per-transaction fees, per-word rates, hourly deltas — is exposed. `formatCurrencyWithCents` exists and is barely used. Worth a sweep.

**The blog is where the corrected fee will next be contradicted.** I enumerated the class programmatically rather than reporting what I noticed: `grep -rli gumroad src/` returns 16 files. Of those, only two make fee claims, and both are wrong in the same way the calculator was. The rest are cross-links, config entries, and the calculator registry. The full list of defective claims is in the findings table with line numbers and corrected values (all computed by running the calculator, not by hand). After a fix to those two files, this site's Gumroad fee story is internally consistent.

**Fact-file scope is narrower than page scope.** This is the structural problem I hit. D-011 governs Gumroad, Ko-fi, Patreon, BMC and Substack. But the *pages* for those platforms compare against Etsy, Shopify, Payhip, Lemon Squeezy, Teachable, Sellfy, Podia, Udemy and ConvertKit Commerce. Every one of those figures is unverified and pre-dates D-011. The comparison content is CalcFalcon's stated strategic core under D-001, and roughly half of it is currently outside the governance regime that D-011 established. My three sibling chips are very likely hitting the same wall on their own pages this hour.

### 2. Risks in what I built

- **The competitor table is now narrower than it was.** I traded breadth for verifiability. That is the right call under D-011 as quoted to me, but it is a product decision affecting a page at position 9.7, and reasonable people could rule the other way. It is reversible from the Rollback record. If the Command Center wants the breadth back, the right route is a research chip, not restoring the old rows.
- **`flatFeeOnMemberships` is a new kind of control for this codebase** — an input that exists because a fact is unknown rather than because it varies by user. If the pattern is unwelcome, the alternative is to charge the $0.50 on renewals unconditionally and say so in copy; the model supports that by deleting one branch.
- **Refund treatment is an assumption I made explicit but cannot verify.** I reduce the transaction count by the refund rate, i.e. a refunded sale reverses its $0.50. Gumroad publishes nothing about fee reversal on refunds. If it keeps the flat fee on refunded sales, the calculator understates by `refundRate × monthlySales × $0.50` — $9.70/mo × 3% ≈ $0.29 at defaults. Small, but it is a fourth open question and arguably belongs in the fact file as V-G5.
- **Old shared `?s=` URLs** decode without `gumroadFlatFee`. `getInitialState` spreads decoded state over defaults so the field is populated, and I added a `?? GUMROAD_FLAT_FEE` fallback for a decoded `undefined`. Someone reopening a link they shared last month will now see a higher fee than they saw then. That is correct, but it is a visible change to a "saved" result.
- **I could not exercise `client:visible`** in this environment (below). The page route's hydration path is verified only by the fact that it uses the identical component the embed route hydrates successfully.

### 3. Proposed follow-up chips

| Chip | Scope | Files it would own |
|---|---|---|
| **CHIP-FEE-BLOG-GUMROAD** | Correct the Gumroad fee claims in blog copy — the $2.90/$26.10 and $89.10 figures, the volume break-even paragraph, the 50-member example, and the 79% margin claim. All corrected values are in my findings table. Do **not** let it touch competitor figures. | `src/content/blog/best-platforms-selling-digital-products.md`, `src/content/blog/profit-margin-side-hustles.md` |
| **CHIP-RESEARCH-COMMERCE** | Second fact file for the *storefront* platforms the comparison pages actually quote: Etsy, Shopify, Payhip, Lemon Squeezy, Teachable, Sellfy, Podia, Udemy, ConvertKit Commerce. Web-capable, must complete and merge **before** any chip restores a competitor table (the Wave 1 ordering rule). | `docs/facts/digital-storefront-fees.md` |
| **CHIP-FEE-DISCOVER** | After V-G1/V-G2 close: model Discover as a share-of-sales input, and settle whether the $0.50 recurs on renewals. Blocked on research. | this chip's three files |
| **CHIP-CENTS-SWEEP** | Sweep all 45 calculators for sub-dollar values rendered through `formatCurrency`. Consider adding a `formatMoney` that auto-selects precision, or a guard script in the style of `check-tax-data.mjs`. Highest-value harness fix I found. | `src/lib/utils/formatters.ts` + affected components (serialize it; it touches many files shallowly) |
| **CHIP-SOURCES-BLOCK** | Generalise `SourcesBlock.astro` to non-tax sources (`subject`/`lastVerified` instead of `taxYear`, configurable disclaimer) so fee-sourced calculators get the same trust signal without four chips hand-rolling four different blocks. Collision hot spot — must run alone. | `src/components/calculator/SourcesBlock.astro` + the pages using it |

### 4. Harness improvements — what the protocol didn't warn me about

1. **`client:visible` never hydrates in the headless browser.** `window.innerHeight` reports **0**, so the IntersectionObserver behind `client:visible` never fires. Scrolling, `scrollIntoView`, `resize_window` with the desktop preset, and a fresh tab all failed to change it. Every calculator page on this site uses `client:visible`, so *no chip can runtime-verify a calculator through its own page.* **The workaround worth writing into § 8: use the `/embed/<category>/<slug>` route, which is `client:load` and renders the identical component.** That is a genuinely useful property of the embed routes that nothing documents.
2. **The browser pane is shared across concurrently-running chips.** Mid-verification, my tab navigated itself to `http://127.0.0.1:8791/creator/patreon-calculator` — a sibling chip's dev server and page. I had a `read_page`/`javascript_tool` call return a Patreon island list while I believed I was on Gumroad. If I had been less careful I could have measured a sibling's page and reported it as mine. § 8 should say: **create your own tab, record its `tabId`, assert `location.href` inside every evaluation, and never trust a bare `tabs_context` label.** It should also warn that `resize_window` mutates shared state.
3. **`preview_start`'s dev-server mode is unusable for chips.** It requires `.claude/launch.json`, which does not exist in this repo and which no chip is granted write access to. Creating it would violate write-ownership for a verification convenience. I ran `npm run dev` via background Bash and pointed `preview_start` at the URL instead. Either grant `.claude/launch.json` to a one-off chip, or document the URL-mode workaround.
4. **The environment blocks compound shell commands in worktrees.** `mkdir -p .claude && cat > file <<'EOF'` was refused as "too complex to verify that it stays inside the worktree". Heredocs into a single path are fine; chaining is not. Worth a line in § 8 so nobody wastes a turn on it.
5. **§ 7's Verify-row rule needs a third branch.** It currently offers "blocked" or "don't guess". Real implementation work has a third option: *expose the uncertainty to the reader as a control or a caveat*. That is what I did with V-G1, and I think it is the right general answer when the unknown is a modelling switch rather than a figure. If the Command Center disagrees, the rule should say so explicitly, because the alternative reading — "memberships cannot be modelled at all until V-G1 closes" — would have blocked half this chip.
6. **§ 8's "Compute worked examples by running the calculator" belongs next to a warning about display formatting.** Running the calculator gives you the right number. It does not tell you what the page will show. Those are two different verification steps and only the first is currently documented.

### 5. Model tier feedback

Opus/high was right, and not because the arithmetic is hard. The judgement calls were: how to honour a Verify row without either guessing or abandoning the feature; whether to publish unverified competitor figures next to a corrected one; and noticing that a clean build with correct source code was rendering `$1` where it should render `$0.50`. A cheaper tier would have added `+ 0.50` to the formula, fixed the "flat 10%" sentences, kept the competitor table, and shipped — passing every stated check while leaving the page's headline fee wrong on screen.
