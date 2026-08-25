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
| **W1** | PROPOSED — awaiting rulings | Capture existing impressions (CTR), spec the hub, gather verified fee data |
| W2 | NOT STARTED | Build the comparison hub component + first hub |
| W3 | NOT STARTED | Fill named gaps (Buy Me a Coffee), second hub |
| W4 | NOT STARTED | AdSense re-review once original value ships |

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
