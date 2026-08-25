# Comparison Hub — Architecture Spec

**Author:** CHIP-HUB-SPEC (spec/docs lane — no production code written)
**Status:** PROPOSED — needs Command Center rulings on the items in §11
**Implements:** ruling D-001 (comparison-first architecture)
**Depends on:** `docs/facts/creator-payment-fees.md` (CHIP-RESEARCH-PAYMENTS, in flight — this spec does not assume its contents, only its existence)

Every code claim in this document was checked against the file it names. Files
read end-to-end: `kofi-earnings.ts`, `patreon-earnings.ts`,
`gumroad-revenue.ts`, `substack-revenue.ts`, `print-on-demand-profit.ts`,
`doordash-earnings.ts`, `instacart-earnings.ts` (partial), `KofiCalc.tsx`,
`patreon-calculator.astro`, `CalculatorLayout.astro`,
`useCalculatorState.ts`, `url-state.ts`, `calculators.ts`, `monetization.ts`,
`schema.ts`, `SourcesBlock.astro`, `category-styles.ts`,
`BarComparisonChart.tsx`, `embed/[...slug].astro` (partial),
`astro.config.mjs`.

---

## 1. What a hub is

A hub is one page that answers a **decision**, not a lookup: *"Where should I
take my supporters / my driving hours / my designs / my asset?"* One set of
user inputs drives N platform models and renders a ranked, side-by-side
result — with a deep link into each platform's existing full calculator
carrying the same scenario.

The four hubs (per D-001 / `docs/ROADMAP.md`):

| Hub | Platforms | Existing calculators |
|---|---|---|
| Creator payments | Ko-fi · Patreon · Buy Me a Coffee · Gumroad · Substack | 4 of 5 (BMAC missing) |
| Gig delivery | DoorDash · Instacart · Amazon Flex · Uber Eats | 4 (Uber Eats ≈ UberLyftCalc) |
| Print-on-demand | Printful · Printify · Merch by Amazon · Gumroad | POD calc already models 3 platforms internally |
| Asset monetization | Airbnb · Turo · storage/parking | 2 (storage/parking missing) |

**Nothing is deleted.** The 45 calculators keep their URLs. The hub is a new
page type that *consumes* them.

---

## 2. What the codebase gives us (verified)

Facts the design leans on, each checked against source:

1. **Logic functions are pure, typed, and directly importable.** Every
   calculator's math is a pure function in `src/lib/calculators/*.ts`
   (`calculateKofiEarnings(inputs)`, `calculatePatreonEarnings(inputs)`, …)
   with exported `Inputs`/`Results` interfaces and `DEFAULT_INPUTS`. They have
   no React, no DOM, no async. A hub component can call five of them in one
   render at negligible cost.

2. **Input shapes are bespoke per platform — deliberately.**
   `PatreonInputs` is `{numberOfPatrons, averagePledge, feeTier, churnRate}`;
   `KofiEarningsInputs` has nine fields spanning donations, memberships, shop,
   commissions, a Gold flag, and a processing rate; `SubstackInputs` has
   free-subscriber conversion and annual-plan mix. These differences are the
   *content* of the comparison (they encode each platform's business model),
   not an inconvenience to be normalized away.

3. **The comparison pattern already exists in miniature.**
   `print-on-demand-profit.ts` holds per-platform cost tables for Printful,
   Printify, and Merch by Amazon and switches models on a `platform` input
   (royalty model vs cost-plus model). `newsletter-revenue.ts`,
   `online-course-revenue.ts`, and `reselling-profit.ts` do the same for
   their platform sets. What no calculator does yet is show N platforms
   **simultaneously** for one scenario — they make the user flip a dropdown.

4. **URL state is generic and reusable.** `useCalculatorState<T>` +
   `url-state.ts` (`encodeState` = base64 JSON in `?s=`,
   `getInitialState` merges decoded over defaults) work for *any* input
   object shape. A hub gets shareable-scenario URLs for free, and —
   critically — can **generate `?s=` deep links into the existing single
   calculators** by encoding a mapped inputs object with `getShareUrl()`.

   ⚠️ One trap, verified in `useCalculatorState.ts` lines 13–17: when mode is
   `quick`, a `useEffect` overwrites inputs with `QUICK_MODE_DEFAULTS` *after*
   URL state is read. **Any deep link that sets advanced-mode fields must
   include `?mode=advanced`** or the target calculator clobbers them on mount.
   (This also means existing quick-mode share links silently lose
   advanced-field state — flagged in Reflections as a standalone bug.)

5. **The side-by-side chart exists.** `BarComparisonChart.tsx` takes
   `data: {label, ...}[]` and `bars: BarConfig[]` (grouped or stacked) with
   category theming — exactly the hub's headline visual. `ResultCard`,
   `ResultBreakdown`, `ChartCard`, `formatCurrency` all reuse directly.

6. **Fee constants are embedded per-module and uncited.** `KOFI_FREE_FEE = 0.05`
   in `kofi-earnings.ts`; `PATREON_FEE_RATES` in `patreon-earnings.ts` under a
   comment reading "Patreon fee structure **(2024)**"; `SUBSTACK_FEE_RATE = 0.10`;
   Printful/Printify base-cost tables in `print-on-demand-profit.ts`. Unlike
   tax data, platform fees have **no shared module, no citation block, no
   last-verified date, and no staleness guard**. §5 fixes this.

7. **SEO plumbing is generic.** `generateWebApplicationSchema` /
   `generateFAQSchema` / `generateBreadcrumbSchema` take plain
   name/description/url arguments — nothing calculator-specific. The sitemap
   filter excludes only `/embed/`, so new hub routes are indexed with zero
   config change (`astro.config.mjs` line 16).

8. **`CalculatorLayout.astro` is calculator-shaped, not reusable as-is.** It
   hardwires the breadcrumb to `/{categorySlug}/{slug}`, the embed URL, the
   affiliate grid keyed by calculator slug, and blog-post matching on
   `calculatorSlug(s)`. Hubs need their own layout (§7) rather than prop-hacks
   on this hot-spot file.

---

## 3. The engine abstraction — decision and reasoning

### The central question

One set of user inputs must drive N platform models whose native input shapes
differ. Three options were weighed:

**Option A — normalize the platforms into one generic fee model.**
Define `{platformFeePct, processingPct, processingFlat, fixedMonthlyCost}` per
platform and one generic `computeNet(gross, txCount, schedule)`.

- *For:* apples-to-apples by construction; trivially extensible to platforms
  with no calculator (BMAC); tiny code.
- *Against, and fatal:* it **reimplements math that already exists**, so the
  hub's Patreon number and the Patreon calculator's number can drift apart —
  the same defect class that produced two-year-stale tax data, now visible to
  users as the site disagreeing with itself on money. It also flattens exactly
  the model differences that make the comparison honest (Merch by Amazon is a
  royalty model with no processing fee to the seller; Substack's annual-plan
  mix changes transaction counts; Ko-fi charges platform fee on donations and
  memberships but not shop sales — all verified in the modules).

**Option B — refactor every calculator onto a shared normalized input type.**
- *Against, and fatal:* it's *move*-shaped refactoring across ~45 modules and
  45 components for zero user-visible gain, serializes the whole roadmap
  behind it, and destroys the bespoke inputs that make single calculators good
  at their own job.

**Option C — adapter per platform, calling the existing functions. CHOSEN.**
Each hub defines its own small input type (the shared knobs a person actually
has: audience size, average contribution, hours, designs…). Each platform in
the hub is an adapter that (a) maps hub inputs → that platform's native
`Inputs` object, filling unmapped fields from documented assumptions,
(b) calls the **existing** `calculateX()` unchanged, and (c) projects the
native `Results` onto a small common outcome shape for display.

- *For:* zero changes to existing modules (new files only — maximally
  parallel-safe); the hub number **provably equals** the single calculator's
  number for the same inputs, which is both a trust property and a testable
  invariant; the mapping assumptions become explicit, displayable editorial
  content instead of silent modeling choices; deep links into the single
  calculators fall out for free via `encodeState`.
- *Cost:* each adapter embeds judgment ("a 'supporter' means one patron at
  the average pledge on Patreon, but on Gumroad it means a buyer of one
  product at that price"). This is unavoidable in any honest cross-model
  comparison; the design makes it visible rather than pretending a
  normalization removed it.

### The contracts

New directory `src/lib/hubs/` (no existing file is touched):

```ts
// src/lib/hubs/types.ts
export interface PlatformOutcome {
  grossMonthly: number;
  platformFee: number;       // the platform's own cut
  processingFee: number;     // Stripe/PayPal-style processing
  fixedMonthlyCost: number;  // e.g. paid tiers modeled as a cost; 0 if none
  netMonthly: number;
  netAnnual: number;
  effectiveFeePct: number;   // (gross - net) / gross * 100
}

export interface HubPlatform<HubInputs> {
  key: string;               // 'patreon'
  name: string;              // 'Patreon'
  /** Existing calculator page, if one exists (BMAC: undefined). */
  calculatorHref?: string;   // '/creator/patreon-calculator'
  /** Maps hub inputs to the platform's native inputs — exported separately
   *  so the deep-link builder and compute() share one mapping. */
  toNativeInputs?: (inputs: HubInputs) => Record<string, unknown>;
  compute: (inputs: HubInputs) => PlatformOutcome;
  /** The mapping judgments, rendered verbatim under the results table.
   *  E.g. "Assumes every supporter is a monthly member at your average
   *  contribution; one-off donations are modeled separately." */
  assumptions: string[];
  /** Structural caveats, e.g. "Royalty model — platform pays production
   *  and shipping; no processing fee is charged to you." */
  caveats?: string[];
}

export interface HubDefinition<HubInputs extends object> {
  key: string;                       // 'creator-payments'
  name: string;
  category: import('@lib/utils/category-styles').CategoryKey; // theming
  defaultInputs: HubInputs;
  quickModeDefaults?: Partial<HubInputs>;
  platforms: HubPlatform<HubInputs>[];
}
```

```ts
// src/lib/hubs/engine.ts — pure, ~40 lines
export function computeAll<T extends object>(
  hub: HubDefinition<T>, inputs: T
): Array<{ platform: HubPlatform<T>; outcome: PlatformOutcome }> {
  // map + sort by netMonthly desc; no other logic
}

/** Sweeps one numeric hub input across a range and returns each platform's
 *  net at each step, plus the crossover points where the ranking flips.
 *  This powers the "originality" analysis in §6 — the chart no platform
 *  will ever publish. */
export function sweep<T extends object>(
  hub: HubDefinition<T>, inputs: T, key: keyof T,
  range: { from: number; to: number; steps: number }
): { series: Array<Record<string, number>>; crossovers: Crossover[] }
```

The deep-link builder reuses `getShareUrl()` from `src/lib/utils/url-state.ts`
with the adapter's `toNativeInputs(inputs)` and **must append
`?mode=advanced`** (see §2.4). The URL base comes from the page via a prop —
never hardcoded (`Astro.site` fallback rule).

### The UI layer

One React island per hub, e.g.
`src/components/hubs/CreatorPaymentsHub.tsx`:

- Wraps in `<ErrorBoundary>`; uses `useCalculatorState<CreatorHubInputs>`
  (works unchanged — it is generic), `ModeToggle`, and the shared inputs
  (`NumberInput`, `CurrencyInput`, `SliderInput`).
- Renders, top to bottom: shared inputs → ranked platform cards
  (`ResultCard`-based, winner highlighted) → `BarComparisonChart` (grouped
  bars: net vs total fees per platform) → crossover analysis (sweep chart +
  plain-English sentences generated from `crossovers`) → per-platform
  assumption blocks with the **"Open the full X calculator with these
  numbers →"** deep link.
- Hydrated `client:visible` on the page (hubs are pages, not embeds — the
  standing hydration decision applies as-is).
- The site rule "all calculators must have Quick/Advanced mode" is applied to
  hubs too: Quick = the 2–3 shared knobs; Advanced = payment-mix and
  per-platform overrides.

Per-hub input types stay **small and honest**. Creator payments Quick mode is
just: `supporters` (number of paying supporters/mo), `avgContribution` ($),
`oneOffShare` (% of support that is one-off vs recurring). Advanced adds
processing-rate override and per-platform tier pickers (Patreon plan, Ko-fi
Gold on/off) surfaced as *scenario toggles*, not buried defaults.

---

## 4. Reuse vs rebuild — per calculator

| Module | Verdict | Notes |
|---|---|---|
| `kofi-earnings.ts` | **Call as-is** | Adapter maps supporters/avg → donations + memberships; shop/commissions default 0. Gold toggle exposed in Advanced. |
| `patreon-earnings.ts` | **Call as-is** | Map supporters → `numberOfPatrons`, avg → `averagePledge`. `feeTier` is a hub Advanced toggle (default `'pro'` = module default). Churn irrelevant to the fee comparison; pass the default. |
| `gumroad-revenue.ts` | **Call as-is** | Two honest mappings exist: memberships (`memberCount`/`memberPrice`) for recurring support, product sales for one-off. Use both, driven by `oneOffShare`. `affiliatePercent: 0`, `refundRate` default — stated in assumptions. |
| `substack-revenue.ts` | **Call as-is** | Map supporters → `paidSubscribers`. `annualPlanPercent` materially changes fees (verified: transaction-count math at lines 60–66); expose in Advanced, default to module default. |
| Buy Me a Coffee | **No module exists — new fee model, gated on facts file** | Thin native-style module `src/lib/calculators/bmac-earnings.ts` in the same 3-layer pattern *eventually*; for hub V1 a fee model inside the adapter is acceptable **only if** every figure imports from the platform-fee registry (§5) sourced from `docs/facts/creator-payment-fees.md`. **No figure may be invented; if the facts file doesn't verify BMAC, the hub ships with 4 platforms.** |
| `doordash-earnings.ts`, `instacart-earnings.ts`, `amazon-flex.ts`, `uber-lyft-earnings.ts` | **Call as-is (W3)** | Shapes already near-shared: jobs/wk, pay/job, tip, miles, gas, mpg, hours. The gig hub adapter is the easiest of the four. |
| `print-on-demand-profit.ts` | **Call as-is, N times** | Already multi-platform on a dropdown; the hub calls it once per `platform` value with identical other inputs. The cleanest adapter on the site. |
| `airbnb-profit.ts`, `turo-profit.ts` | **Call as-is (W4)** | Asset hub compares different asset classes, not substitutes — needs its own framing (net per $ of asset value / per hour of management). Hardest editorially; last. |

**Refactoring class:** hub work is **extract-shaped** — new files only
(`src/lib/hubs/`, `src/components/hubs/`, `src/pages/compare/`,
`src/layouts/HubLayout.astro`). It parallelizes safely against anything that
doesn't own those (currently non-existent) paths. The **one exception** is the
fee-registry extraction below, which edits existing calculator modules and
must be granted exclusively.

---

## 5. Platform fee data — the YMYL extension

Platform fees are money figures on a YMYL site and currently have *less*
governance than tax figures: hardcoded per-module, no citations, one module
self-labeled "(2024)". A hub multiplies their surface area (one wrong fee now
misprices five platforms' comparison). Apply the tax-data playbook:

1. **New module `src/lib/platforms/platform-fees.ts`** (name parallel to
   `shared/tax-brackets.ts`): every platform's fee constants, a source-URL
   comment per figure, and exported `PLATFORM_FEES_LAST_VERIFIED` /
   per-platform verified dates. Populated **only** from
   `docs/facts/creator-payment-fees.md` (or successor fact files) — never
   from memory, never from this spec.
2. **Existing calculator modules import from it** — `kofi-earnings.ts`,
   `patreon-earnings.ts`, `gumroad-revenue.ts`, `substack-revenue.ts` drop
   their local constants. This is a small *extract* refactor (5–6 files,
   deep not broad) but it touches live calculator logic: **own chip,
   exclusive grant on those files, runs before or alongside the hub build,
   never concurrent with another chip touching creator calculators.**
3. **Guard:** extend the `scripts/check-tax-data.mjs` pattern with a
   platform-fee check (superseded-values denylist, "no fee literal outside
   `platform-fees.ts`" grep). Proposed as a follow-up chip; the hub must not
   ship before at least the registry (step 1) exists, or the hub's
   `SourcesBlock`-style dating would be fiction.
4. **Visible sourcing:** hub pages render a `SourcesBlock` (existing
   component, verified generic — takes `taxYear`/`lastVerified`/`sources`
   props; a `feeYear` relabel or a thin `FeeSourcesBlock` wrapper is
   acceptable, do not fork the styling) listing each platform's pricing page
   and the verified date. This is the AdSense trust signal the site was
   twice dinged for lacking, applied to the new page type from day one.
5. Fee-tier tables (like `BASE_COSTS` in `print-on-demand-profit.ts`)
   migrate opportunistically when their hub ships — not as a big-bang.

---

## 6. Originality — what a hub shows that no platform can

This is the point of the exercise (D-001, AdSense "substantial value and
originality"). Concretely, per section of the hub page:

1. **Same-scenario net across competitors.** DoorDash will never publish that
   Instacart pays more; Ko-fi will never model Patreon's Pro tier. The ranked
   cards are the artifact. Every number is reproducible on the linked
   single-platform calculator — the deep link *is* the methodology citation.
2. **Crossover analysis (the sweep).** Flat per-transaction processing fees
   ($0.30-class) punish small contributions non-linearly, while percentage
   platform fees scale — so the *ranking flips* as average contribution or
   supporter count changes. The sweep chart + generated sentences ("below
   $N/mo average, X nets more; above it, Y wins") is analysis that exists
   nowhere else, is regenerated live from the user's own scenario, and is
   pure arithmetic on already-built models — no new data required.
3. **Fixed-cost break-evens.** "At what MRR does a paid tier with 0% platform
   fee beat the free tier's percentage?" (Ko-fi Gold's $6/mo vs 5% is the
   archetype — the logic already exists as a hardcoded callout in
   `KofiCalc.tsx` lines 243–256; the hub generalizes it across platforms.)
4. **Net-of-expenses math for gig work (W3).** Indeed/ZipRecruiter publish
   gross per-job figures; the gig calculators model miles, gas, and vehicle
   cost. Cross-platform *net hourly* is original by construction.
5. **Shareable scenario URLs.** `?s=` state at hub level means a Reddit
   answer can link "here's the comparison for your numbers" — a distribution
   loop no static comparison article has.
6. **Dated, cited fee table** (§5.4) — original in the "trustworthy" sense
   reviewers actually score.

What a hub must **not** be: a prose rehash of each platform's pricing page
with a table. That is exactly the "available elsewhere" content AdSense
rejected. Rule of thumb for implementation chips: every section must either
(a) compute on the user's inputs or (b) cite a dated primary source.

---

## 7. URL, routing, layout

### Proposal — ⚠️ touches a standing decision, needs a ruling

The standing URL structure (`DECISIONS.md` Part 2) defines only
`/[category]/[name]-calculator`, `/embed/...`, `/blog/[slug]`. Proposed
addition:

```
/compare/[hub-slug]        # e.g. /compare/creator-payments
```

**Why a new top-level prefix rather than a category path:**

- Hubs are cross-category in principle (asset monetization spans gig and
  finance framing; Gumroad appears in two hubs). Forcing
  `/creator/creator-payments-hub` misfiles them and collides with the
  `-calculator` suffix convention.
- `/compare/` matches the query class it targets ("X vs Y") and gives clean
  anchor text for internal links.
- It leaves `/[category]/` meaning exactly one thing (single calculators),
  which keeps the canonical-query mapping in §8 legible.

Rejected alternatives: `/hubs/` (jargon, no query intent);
`/[category]/compare/[slug]` (breaks for cross-category hubs); replacing
category index pages (they serve navigation, not comparison intent, and
`/gig-economy` already ranks ~10.9 as-is — don't disturb it).

**Needs from the Command Center:** a numbered ruling adding `/compare/[hub-slug]`
to the URL-structure standing decision, plus a ruling on hub slugs
(`creator-payments`, `gig-delivery`, `print-on-demand`, `asset-monetization`
proposed).

### Layout

New `src/layouts/HubLayout.astro` — **do not extend `CalculatorLayout.astro`**
(hot-spot file; and its breadcrumb/embed/affiliate/blog-matching logic is
calculator-slug-shaped, verified §2.8). HubLayout wraps `BaseLayout`, and
renders: breadcrumb (`Home / Compare / {hub name}`), header, intro slot, the
island slot, methodology/content slots, FAQ block, sources block, related
calculators (reuse `RelatedCalculators.astro` — it takes a plain array),
email capture. Ad slots and affiliate grid are **deliberately absent in V1**:
wiring them requires `monetization.ts` (hot spot) and there is nothing to
render until units/URLs exist (`adUnits` are all `''` and every affiliate URL
is `'#'`, verified). Add later via a scoped chip.

Schema.org: `WebApplication` + `FAQPage` + `BreadcrumbList` via the existing
generic generators — no schema code changes needed. (An `ItemList` of the
compared platforms is a possible later addition; not required for V1.)

No `/embed/compare/...` in V1 — embeds require the `[...slug].astro` if-else
hot spot; defer until a hub demonstrably earns links.

Design system: hub pages take the category theme of their `HubDefinition.category`
(`creator` magenta for creator payments, `gig` emerald for gig delivery) via
the existing `category-styles.ts` maps and `card-elevated` cards. Never
`brand-*`.

---

## 8. Relationship to existing pages — and the cannibalization trap

### Query → canonical page mapping

| Query class | Example | Canonical page |
|---|---|---|
| Branded calculator | "kofi calculator" | `/creator/kofi-calculator` (unchanged — 52 of 106 clicks live here, D-008 protects it) |
| Head terms | "how much does doordash pay" | single calculator (unchanged; we rank ~27 and that's fine per D-001) |
| Multi-platform decision | "patreon vs kofi fees", "best platform for memberships" | **hub** |
| Informational | "how do patreon fees work" | blog post |

Title discipline enforces the split: hubs use "X vs Y vs Z: …" comparison
phrasing and **never** the word "calculator" in the title; calculator pages
keep "calculator" phrasing and never adopt "vs" framing. Interlinks:

- Hub → calculator: the per-platform deep links (§3) plus a "full X
  calculator" card row. These links are the evidence-engine relationship
  D-001 describes.
- Calculator → hub: one prominent CTA ("Deciding between platforms? Compare
  X vs …") on each member calculator. **This edits either
  `CalculatorLayout.astro` (hot spot) or each member page — scope it as its
  own serialized chip**, not part of the hub build.
- Blog → hub: see below.

### The trap nobody named: the comparison rankings belong to blog posts

The GSC evidence for D-001 (pos 3.0 "printful vs printify pricing comparison
2026", 7.4 "patreon vs ko-fi fees comparison") is almost certainly held by
existing **blog posts** — the repo has `kofi-vs-patreon-comparison.md`,
`gig-delivery-apps-compared.md`, `print-on-demand-2026.md`,
`substack-vs-beehiiv-newsletter-revenue.md`, `taskrabbit-vs-turo-side-hustles.md`
(verified in `src/content/blog/`). A new hub page targeting the same queries
**competes with the site's own best-ranking URLs** — the one way to lose
rankings we already own.

This spec cannot resolve it (requires the GSC URL-level data only the Command
Center has). The options, for a ruling before the first hub ships:

- **(a) Upgrade in place:** the hub replaces the ranking blog post at the
  blog URL. Rejected: `/blog/` is prose-shaped; islands in content
  collections fight the content pipeline; URL says "article" while the page
  is a tool.
- **(b) 301 the blog post to the hub** once the hub is demonstrably better.
  Cleanest long-term; risks re-ranking turbulence on the site's best URLs.
- **(c) Coexist with distinct intent** (RECOMMENDED for V1): hub launches on
  a *broader* query than the pairwise posts ("creator payment platforms
  compared" / "ko-fi vs patreon vs gumroad vs substack"), each pairwise blog
  post gets a prominent link up to the hub, and the hub links down to the
  posts. Watch GSC ~4 weeks; only then decide per-post whether to 301 (b).
  Editing those blog posts is CHIP-CTR-BLOG territory this wave — sequence
  the blog-side links **after** W1 merges.

---

## 9. First hub: creator payments — build spec

**Why this one first:** largest verified audience (Ko-fi/Patreon/Gumroad/
Substack ≈ 38% of pageviews per `monetization.ts` comment and MEMORY),
4 of 5 platform models already built and callable, the fee fact file is
being produced *this wave*, and the vs-queries it targets already show
top-10 positions. POD has better positions but only 2 calculators and its
pairwise post already ranks 3.0 — less headroom, more cannibalization risk.
Gig delivery is second (W3): easiest adapters, hub-page query already at 10.9.

**Page:** `/compare/creator-payments` (pending §7 ruling)
**Island:** `CreatorPaymentsHub.tsx`, `client:visible`
**Theme:** `creator` (magenta)

**Hub inputs (Quick):**
- `supporters` — paying supporters per month (NumberInput)
- `avgContribution` — average $ per supporter per month (CurrencyInput)
- `oneOffShare` — % of support that is one-off rather than recurring
  (SliderInput 0–100)

**Advanced adds:** processing-rate override (Slider, like Ko-fi's
`paypalFeeRate`); Patreon plan tier (Dropdown lite/pro/premium); Ko-fi Gold
toggle; Substack annual-plan % (Slider); Gumroad framing toggle
(memberships vs products).

**Adapter mappings (each rendered as an on-page assumption):**

| Platform | Recurring share maps to | One-off share maps to |
|---|---|---|
| Patreon | patrons × avg pledge | — (no one-off product; assumption states this and excludes one-off share from Patreon's gross, which is itself informative) |
| Ko-fi | memberships × price | donations × avg amount |
| Gumroad | memberships | product sales |
| Substack | paid subscribers × monthly price | — (same note as Patreon) |
| BMAC | membership model **iff** facts file verifies fees | one-off supports, same condition |

Platforms whose model can't absorb part of the scenario show a smaller gross
*with the reason stated inline* — that asymmetry is honest and is precisely
the decision information the visitor came for. The alternative (silently
normalizing gross to be equal everywhere) fabricates a comparison.

**Numbers in prose:** every worked example in the page's intro/FAQ copy must
be computed by executing the hub engine in a scratch script (`npx tsx`, per
CHIP-PROTOCOL environment notes) — never by hand. FAQ answers citing specific
fee percentages import/quote from the fee registry, and are re-checked by the
platform-fee guard (§5.3) once it exists.

**Definition of done for the build chip:** `npm run build` and
`npm run check:tax-data` pass; a browser check confirms (a) island hydrates,
(b) deep links open each calculator pre-filled in advanced mode with matching
net numbers, (c) the sweep chart renders and its sentences match the chart.
Matching-net (b) is the core invariant of the whole architecture — verify it
per platform, not per one example.

---

## 10. Sequencing — proposed follow-up chips

Ordered; ownership is exact and disjoint unless marked serialized.

| # | Chip | Lane | Owns (exactly) | Notes |
|---|---|---|---|---|
| 1 | `CHIP-FEES-CREATOR` | impl | **new** `src/lib/platforms/platform-fees.ts`; edits `src/lib/calculators/kofi-earnings.ts`, `patreon-earnings.ts`, `gumroad-revenue.ts`, `substack-revenue.ts` | Extract fee constants into the cited registry, populated from `docs/facts/creator-payment-fees.md`. Extract-shaped but touches live calc logic — exclusive grant, and if the facts file contradicts a current constant, **fix the constant with citation** (that's the point). Model: strong tier, accuracy-critical. |
| 2 | `CHIP-HUB-BUILD` | impl | **new files only:** `src/lib/hubs/types.ts`, `src/lib/hubs/engine.ts`, `src/lib/hubs/creator-payments.ts`, `src/components/hubs/CreatorPaymentsHub.tsx`, `src/layouts/HubLayout.astro`, `src/pages/compare/creator-payments.astro` | Can start concurrent with #1 against the engine/UI, but ships only after #1 merges (adapters read the registry). Model: top tier — this is the architectural bet. |
| 3 | `CHIP-FEE-GUARD` | impl | `scripts/check-platform-fees.mjs` (new) + `package.json` script line | Platform-fee analog of the tax-data guard. Can run concurrent with #2. |
| 4 | `CHIP-HUB-LINKS` | impl, **serialized** | `src/layouts/CalculatorLayout.astro` *or* the 4–5 member calculator pages; the 3–4 comparison blog posts' link blocks | Hot-spot files; runs alone after #2, and after W1's CTR chips merge (they own overlapping pages this wave). |
| 5 | `CHIP-HUB-NAV` | impl, serialized | `src/pages/index.astro`, `src/lib/config/calculators.ts` (or a new `hubs.ts` registry consumed by nav) | Homepage/nav surfacing. Prefer a new `src/lib/config/hubs.ts` so the hot-spot registry is untouched. |
| — | Gig hub (W3), POD hub, asset hub | | repeat 1–2 per hub | Each needs its own fact file first (research chip per hub). |

BMAC standalone calculator (Roadmap open question 2): this spec's
recommendation is **hub-only first** — the hub proves whether BMAC queries
convert before a 3-file calculator + registry + embed entry (two hot-spot
files) is spent on it. Needs a ruling either way.

---

## 11. Rulings this spec needs

1. **URL structure:** add `/compare/[hub-slug]` (§7). Standing decision
   change — cannot proceed without it.
2. **Blog cannibalization strategy** (§8): option (c) coexist-then-decide is
   recommended; needs GSC URL-level confirmation of which pages hold the
   comparison rankings.
3. **BMAC hub-only vs standalone** (§10) — already an open roadmap question.
4. **Fee-registry mandate** (§5): platform fees get tax-data-grade governance
   (registry + guard + visible sourcing). Recommend ruling this binding
   before any hub ships.

---

## 12. Risks — what could make this bet fail

1. **Self-cannibalization** (§8). The most likely failure. The site's only
   proven rankings are pairwise comparison *articles*; a hub aimed at the
   same queries can demote both. Mitigated by broad-query targeting + ruling
   #2; not eliminated.
2. **Interactive pages may rank worse than articles for comparison queries.**
   The evidence for D-001 comes from prose pages. If Google reads the hub as
   thin (an island renders client-side; crawlers see the static shell), the
   thesis tests false for structural reasons. Mitigation: the page must carry
   substantial server-rendered prose (methodology, crossover discussion with
   computed examples, cited fee table, FAQ) around the island — the island
   is the demo, the prose is the ranking surface.
3. **Fee staleness at N-platform blast radius.** One stale fee now misprices
   every comparison on the page — on the exact defect class (uncited money
   figures) that drew the AdSense violation. Mitigation is §5; residual risk
   is platforms changing pricing between annual verifications. The visible
   last-verified date converts that from "confidently wrong" to "labeled".
4. **False-equivalence criticism.** Mapping one scenario onto different
   business models embeds judgment; a hostile reader (or platform) can call
   any mapping unfair. Mitigation: assumptions rendered inline, asymmetries
   shown rather than normalized away, and every number reproducible on the
   platform's own dedicated calculator via deep link.
5. **The comparison-query pool is small.** 122 queries / 1,466 impressions
   is a 12x better *rate* on ~4x fewer impressions. If the pool doesn't
   deepen as pages target it (comparison queries are often mid-tail), the
   ceiling is low. This is why W1 (cheap CTR test) precedes W2 — honor that
   sequencing; don't build hub #2 until hub #1 shows GSC movement.
6. **Adapter drift.** If a future chip changes a calculator's input shape
   without updating its hub adapter, the hub silently miscomputes.
   Mitigation: adapters import the native `Inputs` types (compile-time
   breakage, not silent), and the fee guard greps hub files too.
7. **Deep-link fragility.** The `?mode=advanced` requirement (§2.4) is
   load-bearing and non-obvious; it must be a code comment in the deep-link
   builder and a checklist item in the build chip's verification. Fixing
   `useCalculatorState`'s quick-mode clobbering (Reflections) would remove
   the fragility at the source.
