# CalcFalcon Roadmap

**Operating model:** command center + chips. See `docs/CHIP-PROTOCOL.md`.
**Rulings that override this document:** `docs/DECISIONS.md`.
**Previous phase-based roadmap:** archived at `docs/archive/ROADMAP-v2-phases.md`.

---

## The thesis

**CalcFalcon is a cross-platform comparison engine for people deciding where to sell, drive, or host. It is not a calculator directory.**

This is the product bet, and it came out of Search Console data rather than taste. Over the last 12 months the site earned **30,880 impressions and 106 clicks — a 0.34% click-through rate** at an average position around 20. Impressions grew roughly 8x between March and August; clicks stayed flat. The traffic is being offered and not taken.

Splitting queries by intent shows why:

| Query type | Queries | Impressions | Top-10 rate | Weighted position |
|---|---|---|---|---|
| **Comparison** ("X vs Y") | 122 | 1,466 | **36%** | 24.5 |
| **Head terms** ("how much does X pay") | 481 | 5,433 | **3%** | 27.8 |

The site ranks in the top ten on comparison queries at **twelve times** the rate it does on head terms — position 3.0 on "printful vs printify pricing comparison 2026", 7.5 on "amazon flex vs doordash vs instacart", 7.4 on "patreon vs ko-fi fees comparison". Meanwhile "how much does doordash pay" has 1,006 impressions at position 27.8.

The reason is structural and durable: **DoorDash will never publish that Instacart pays more.** Ko-fi will never publish an honest Patreon fee comparison. Indeed and ZipRecruiter publish per-job salary data, not cross-platform net-of-expenses math. No incumbent *can* occupy the comparison space, which is also why it satisfies AdSense's "substantial value and originality compared to other sites" — the bar the site has failed twice.

**Nothing gets deleted.** The 45 calculators keep their URLs and keep winning branded terms ("kofi calculator" position 5.3, "turo calc" position 3.0). They stop being the front door and become the evidence engine inside comparison hubs.

### The four hubs

| Hub | Platforms | Calculators today | Evidence |
|---|---|---|---|
| Creator payments | Ko-fi · Patreon · Buy Me a Coffee · Gumroad · Substack | 4 of 5 (BMAC missing) | pos 7.2–8.8 on vs-queries |
| Gig delivery | DoorDash · Instacart · Amazon Flex · Uber Eats | 4 | pos 7.2–7.5; hub page already pos 10.9 |
| Print-on-demand | Printful · Printify · Merch by Amazon · Gumroad | 2 | **pos 3.0–5.3**, best on the site |
| Asset monetization | Airbnb · Turo · storage/parking | 2 | Turo calc pos 7.0 |

The fourth is the Airbnb answer specifically. The Airbnb calculator sits at position 52 against AirDNA and Mashvisor, who hold real occupancy and ADR data by zip code. "Airbnb vs Turo: which asset earns more" needs no proprietary market data and has no owner.

---

## Wave status

| Wave | Status | Focus |
|---|---|---|
| **W1** | **CLOSED** 2026-08-25 — 3 of 4 merged | CTR capture, hub spec, verified fee data |
| **W2** | **CLOSED** 2026-08-25 — 6 of 6 merged and deployed | Correct wrong platform fees (blocker, D-011) + dead-link fix |
| W3 | NOT STARTED | Cents sweep (D-013), fee guard, remaining blog fee copy, retitling redo |
| W4 | NOT STARTED | Build the first comparison hub per `docs/specs/comparison-hub.md` |
| W5 | NOT STARTED | Buy Me a Coffee calculator (needs correct baseline + touches 2 hot spots) |
| W6 | NOT STARTED | AdSense re-review once original value ships (D-004) |

### W1 outcome

Merged: `CHIP-HUB-SPEC` (584-line architecture spec) · `CHIP-CTR-BLOG` (10 blog titles, comparison-framed) · `CHIP-RESEARCH-PAYMENTS` (verified fee fact file).

Rejected: `CHIP-CTR-CALC` — wrote 2024 Patreon plan tiers that no longer exist into page metadata (D-012). Its before/after table survives at `docs/notes/CHIP-CTR-CALC.md` as the starting point for the W3 redo.

The wave's highest-value output was a finding nobody asked for: **all four creator payment calculators compute on wrong fees** (D-011). That is the category D-001 names as the site's strategic core.

### W2 — running

Five chips, disjoint files, concurrent. Four fee corrections at **Opus** (money math), one dead-link fix at **Sonnet** (mechanical).

`CHIP-FEE-PATREON` · `CHIP-FEE-GUMROAD` · `CHIP-FEE-KOFI` · `CHIP-FEE-SUBSTACK` · `CHIP-DEADLINK-FIX`

Ownership is one logic module + one component + one page per fee chip; the dead-link chip owns four components none of them touch. `KofiCalc.tsx` carries a fifth dead URL and was assigned to `CHIP-FEE-KOFI` rather than split across two chips.

**None of them may change a page `title`, `description`, or `<h1>`** — that surface belongs to W3, and editing it here would collide.

### W2 outcome — closed 2026-08-25

Six chips, all merged, verified, and deployed. Every creator payment calculator now computes correct fees with a cited source block. Five dead share URLs fixed. Two blog posts corrected, including the description string that was rendering the dead Patreon plan menu onto the corrected calculator page.

Highest-value finding, again unasked-for: **`formatCurrency` rounds away cents site-wide** (D-013), caught independently by two chips only because both measured rendered output rather than source.

Ruling changes this wave: D-013 (cents), D-014 (Confident publishes arithmetic, Verify withholds advice), D-015 (Command Center now pushes).

### W3 — proposed, not yet spawned

| Chip | Why | Model | Sequencing |
|---|---|---|---|
| `CHIP-CENTS-SWEEP` | D-013 — 45 files, per-call-site judgment | Opus · high | **Serialized, alone** — *move*-shaped |
| `CHIP-FEE-GUARD` | D-011 says fees are "enforced by a guard"; no guard exists. **Four separate chips flagged this.** Extend the `SUPERSEDED` denylist in `scripts/check-tax-data.mjs` to platform fees | Opus · medium | Parallel-safe |
| `CHIP-BLOG-FEE-COPY-2` | The fee defect is a class of **six** posts, not two. Two propagate errors into thresholds readers are told to act on — a $990 Beehiiv crossover and a Gumroad-vs-Sellfy crossover | Opus · high | After the fee guard |
| `CHIP-HYDRATION` | React discards SSR HTML on every calculator; traced to `useCalculatorState` reading `window.location` at init. Measure before retitling so a page-speed shift isn't misattributed | Opus · high | **Serialized, alone** |
| `CHIP-CTR-CALC-2` | The rejected W1 retitling, redone against correct fees. Start from the rollback table in `docs/notes/CHIP-CTR-CALC.md` | Fable · high | After the cents sweep |
| `CHIP-RESEARCH-NEWSLETTER` | Beehiiv 0% and ConvertKit 3.5% appear in a live calculator and a published post with **no primary source**. Blocks any newsletter comparison work under D-011 | Opus · medium | Parallel-safe; gates the newsletter fixes |

**Open question for the human, unresolved:** `docs/specs/comparison-hub.md` §8 flags that the comparison rankings justifying D-001 are held by existing blog posts, so a hub on those queries would cannibalize the site's best URLs. The spec recommends coexisting on broader queries and watching Search Console for four weeks before deciding per-post. That decision is due before any hub ships.

---

## Wave 1 — proposed

Four chips, disjoint file ownership, safe to run concurrently. Rationale for sequencing: W1 is deliberately the cheapest possible test of the thesis. Titles and meta capture traffic already being offered without writing a single new page, and two weeks of Search Console data afterward tells us whether intent-matching moves CTR *before* we commit to an architecture change.

| Chip | Lane | Model | Owns |
|---|---|---|---|
| `CHIP-CTR-CALC` | implementation | **Fable 5 · high** | `title`/`description` props on ~15 named calculator `.astro` pages |
| `CHIP-CTR-BLOG` | implementation | **Opus 5 · high** | frontmatter `title`/`description` on ~10 named `src/content/blog/*.md` |
| `CHIP-RESEARCH-PAYMENTS` | spec/docs | **Opus 5 · medium** | `docs/facts/creator-payment-fees.md` only |
| `CHIP-HUB-SPEC` | spec/docs | **Fable 5 · high** | `docs/specs/comparison-hub.md` only |
| `CHIP-INTEGRATOR-W1` | docs | **Sonnet 5 · low** | runs alone, last; merges notes into shared docs |

**Why these four don't collide:** the two CTR chips touch different file types (`.astro` pages vs `.md` frontmatter) with explicitly named, non-overlapping lists. The two doc chips write one new file each and no code. No chip touches a hot-spot file from `CHIP-PROTOCOL.md §2`.

**Why the CTR work is split rather than one chip:** editing titles across all 65 pages is *move*-shaped work — broad and shallow — which conflicts with everything. Scoping each chip to a named list of the highest-impression pages keeps it *extract*-shaped and parallelizable.

**Model tier rationale:** title and meta copy is conversion writing against a live traffic number, which is brand-voice judgment, not mechanical editing — hence the top tier on the calculator pages where 30,880 impressions are at stake. The hub spec is novel architecture plus product judgment. The research chip is accuracy-critical (its output feeds money calculations) but bounded, so strong tier rather than top.

---

## Deliberately not doing

**Phases 12 and 13 of the old roadmap are cancelled** (see `DECISIONS.md` D-002). They planned eight more tax, finance, and business-operations calculators. Personal finance averages **position 88** across 12 months with zero clicks — "rent vs buy calculator" ranks 98th, "fire calculator" 91st. Adding inventory to the weakest category was the wrong bet.

**Personal-finance calculators are de-prioritized, not deleted.** They have no natural comparison set, which is exactly why they lose. They stay as working utility pages and receive no further investment.

**AdSense re-review is held** until a hub ships (`DECISIONS.md` D-004). Two reviews have already been spent; a third with nothing structurally new to point at would spend two more weeks for the same verdict.

---

## Open questions for the human

Tracked here until ruled on, then moved to `DECISIONS.md`.

1. **Do we touch the Ko-fi calculator's title?** It is the single best-performing page on the site — position 12.3, 1.54% CTR, 52 of the site's 106 total clicks. Rewriting its title risks the one thing that works. Options: exclude it from W1 and learn from the other 14 pages first, or include it with a fast rollback if CTR drops.
2. **Buy Me a Coffee: standalone calculator page, or hub-only?** Affects URL structure, which is a standing decision (`DECISIONS.md`, URL Structure).
3. **Is `hello@calcfalcon.com` monitored well enough to publish more prominently** as the corrections channel on YMYL pages?
