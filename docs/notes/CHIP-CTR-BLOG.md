# CHIP-CTR-BLOG

**Lane:** implementation
**Owns:** `title` and `description` frontmatter in 10 files under `src/content/blog/`, plus this notes file
**Model:** Opus, high effort

Rewrote the `title` and `description` YAML frontmatter on 10 blog posts to attack
the 0.34% site-wide CTR. No article prose was touched. No `calculatorSlug` /
`calculatorSlugs`, date, category, or draft field was touched. `src/pages/**`,
`src/content.config.ts`, layouts, configs and shared docs were not touched.

---

## Measurements

Measured before choosing any target, per CHIP-PROTOCOL §7.

**Distribution across all 40 blog posts (before my changes):**

| Field | min | p25 | median | p75 | max | mean |
|---|---|---|---|---|---|---|
| `title` length | 32 | 48 | 56 | 62 | 69 | 54.8 |
| `description` length | 131 | 145 | 152 | 155 | 163 | 149.9 |

12 of 40 titles exceeded 60 chars. 2 of 40 descriptions exceeded 160. None were
under 120.

**My 10, before:**

| chars (title / desc) | file |
|---|---|
| 51 / 154 | best-platforms-selling-digital-products |
| 60 / 134 | doordash-driver-earnings |
| 54 / 159 | fire-calculator-guide |
| 64 / 158 | gig-delivery-apps-compared |
| 53 / 155 | kofi-vs-patreon-comparison |
| 64 / 148 | print-on-demand-2026 |
| 65 / 151 | self-employment-tax-guide |
| 62 / 157 | substack-vs-beehiiv-newsletter-revenue |
| 60 / 145 | taskrabbit-vs-turo-side-hustles |
| 59 / 161 | tutoring-side-hustle-earnings |

**Target adopted: title ≤ 58 chars with the primary entity/keyword inside the
first ~40; description 145–158 chars.** This is a modest tightening of the site's
existing median (56 / 152) rather than an invented standard, so the 10 rewritten
posts stay stylistically consistent with the other 30. All 10 landed in range:
titles 48–58, descriptions 148–158.

### The measurement that changed the design — the ` | CalcFalcon` suffix

`src/pages/blog/[slug].astro:22` renders `` `${post.data.title} | CalcFalcon` ``.
Every blog title is **13 characters longer in the actual `<title>` tag than in
frontmatter.** Verified in built HTML, not inferred.

| | rendered `<title>` length |
|---|---|
| min / median / max across 40 posts | 45 / 68 / 82 |
| posts rendering over 60 chars | **31 / 40** |
| posts rendering over 70 chars | **15 / 40** |

This is why every comparison title I wrote **front-loads the entity names** and
puts the benefit clause last: when Google truncates, the `X vs Y vs Z` query
match survives and only the tail is lost. The old titles did the opposite —
`Gig Delivery Apps Compared: DoorDash vs Instacart vs Amazon Flex` rendered at
77 chars and pushed the actual query string past the cut. See Reflections; the
suffix itself is a file I do not own.

---

## Before / after — rollback record

Exact prior values. To roll back any row, restore both strings verbatim.

### 1. `src/content/blog/doordash-driver-earnings.md`
9,718 impr · pos 21.7 · 0.05% CTR · **target query:** `doordash pay after expenses` / `is doordash worth it after gas` (long-tail; head term `how much does doordash pay` conceded to Indeed/ZipRecruiter/Reddit)

- **Before title:** `How Much Do DoorDash Drivers Actually Make? (2026 Breakdown)`
- **Before desc:** `Real DoorDash earnings data after expenses — base pay, tips, peak pay, hidden costs, and what top dashers actually take home per hour.`
- **After title:** `How Much DoorDash Pays After Gas, Car Wear, and Taxes`
- **After desc:** `Dashers see gross pay in the app. Here is the same money after fuel, vehicle wear, and self-employment tax — plus how to find your real hourly rate.`
- **Why:** the post is **not** a cross-platform comparison and was not framed as one. Its only genuine differentiator against the incumbents is the gross-to-net gap, so the title now promises exactly that. `(2026 Breakdown)` was spending 17 rendered characters on nothing.

### 2. `src/content/blog/kofi-vs-patreon-comparison.md`
4,419 impr · pos 24.0 · 0.27% CTR · **target query:** `how much does ko-fi take` (~1,200 impr nearby) + `ko-fi vs patreon`

- **Before title:** `Ko-fi vs Patreon vs Buy Me a Coffee: Which Pays Best?`
- **Before desc:** `Fee comparison between Ko-fi (0-5%), Patreon (5-12%), and Buy Me a Coffee (5%) — plus Ko-fi Gold break-even math and which platform fits your creator type.`
- **After title:** `Ko-fi vs Patreon vs Buy Me a Coffee: What They Really Take`
- **After desc:** `The advertised platform fee is only half the cut. Compare what each one actually takes after per-transaction processing, and where Ko-fi Gold pays for itself.`
- **Why:** `Which Pays Best?` is a vague promise; `What They Really Take` answers the adjacent informational query verbatim. **The new description deliberately drops the three fee percentages** the old one asserted — see the fee-verification note in Reflections.
- **Note:** this is the blog post, not `src/pages/creator/kofi-calculator.astro`, which is off-limits under D-008 and was not opened or modified.

### 3. `src/content/blog/gig-delivery-apps-compared.md`
3,570 impr · pos 10.9 · 0.22% CTR (**page one**) · **target query:** `does doordash or instacart pay more` (ranks 4.0–7.5), `amazon flex vs doordash vs instacart` (126 impr, pos 7.5)

- **Before title:** `Gig Delivery Apps Compared: DoorDash vs Instacart vs Amazon Flex`
- **Before desc:** `Compare real earnings, expenses, and working conditions across DoorDash, Instacart, and Amazon Flex. Data-driven breakdown of what drivers actually take home.`
- **After title:** `DoorDash vs Instacart vs Amazon Flex: Which Pays More?`
- **After desc:** `Net hourly pay after gas and vehicle wear, miles driven per dollar earned, physical demands, and scheduling — compared across all three delivery apps.`
- **Why:** the highest-value single change in the set. The generic prefix `Gig Delivery Apps Compared:` pushed the exact query string to character 27 of a 77-char rendered title. Now the query string is characters 1–36. `Data-driven breakdown` was filler and is replaced with the four axes the post actually compares.
- **Honesty check:** the post genuinely answers "which pays more" with per-platform net hourly ranges and a *Choose X when* section. Uber Eats is deliberately **not** in the title — the post only mentions it under multi-apping and does not compare it.

### 4. `src/content/blog/print-on-demand-2026.md`
1,552 impr · pos 10.9 · **0 clicks** · **target query:** `printful vs printify pricing comparison 2026` (ranks 3.0 per D-001)

- **Before title:** `Print-on-Demand in 2026: Printful vs Printify vs Merch by Amazon`
- **Before desc:** `Compare Printful, Printify, and Merch by Amazon for print-on-demand profits. Per-unit costs, marketplace fees, and when POD beats holding inventory.`
- **After title:** `Printful vs Printify vs Merch by Amazon: 2026 Margins`
- **After desc:** `Base costs, Etsy and Amazon fee stacks, and return losses on the same t-shirt across all three — plus the volume where bulk printing beats print-on-demand.`
- **Why:** same defect as #3 — a 77-char rendered title with the query buried behind a category label. `2026` is retained because the ranking query contains it. The description now names the three cost layers the post actually models (base cost, marketplace fee stack, returns) instead of restating the title.

### 5. `src/content/blog/best-platforms-selling-digital-products.md`
464 impr · pos 32.0 · 0 clicks · **target query:** `gumroad vs teachable`, `gumroad fees` (repositioned off the `best platforms for X` head term, which is unwinnable at pos 32)

- **Before title:** `Best Platforms for Selling Digital Products in 2026`
- **Before desc:** `Compare Gumroad, print-on-demand services, and online course platforms. Real fee structures, profit margins, and which platform fits your digital product.`
- **After title:** `Gumroad vs Teachable vs Printful: What You Keep Per Sale`
- **After desc:** `Three ways to sell digital products, three fee structures: flat commissions, monthly plans, and per-unit production costs. See which keeps the most per sale.`
- **Why:** the clearest D-001 case in the set — a listicle head term at position 32 converted to named-entity comparison framing. One brand per section, and all three are genuinely covered (Gumroad's flat commission, Teachable under *Online Course Platforms*, Printful under *Print-on-Demand*).

### 6. `src/content/blog/tutoring-side-hustle-earnings.md`
419 impr · pos 11.1 · 1 click · **target query:** `wyzant vs varsity tutors`, retaining `tutoring side hustle`

- **Before title:** `How to Start a Tutoring Side Hustle (And What You Can Earn)`
- **Before desc:** `Tutoring rates by platform, subject, and experience level. Compare Wyzant, Varsity Tutors, Tutor.com, and independent tutoring to find your real hourly earnings.`
- **After title:** `Tutoring Side Hustle Pay: Wyzant vs Varsity vs Independent`
- **After desc:** `Platforms bring you students and take a cut; independent keeps the cut but you find the clients. Compare real hourly pay after fees and unpaid prep time.`
- **Why:** the post is a real four-way platform comparison that the old title hid behind a how-to frame. `Tutoring Side Hustle` is kept at the front to protect the position-11 relevance that presumably comes from that phrase — this is the one row where I hedged rather than going to pure `X vs Y` framing.

### 7. `src/content/blog/taskrabbit-vs-turo-side-hustles.md`
208 impr · **pos 7.0** · 0 clicks · **target query:** `taskrabbit vs turo`

- **Before title:** `TaskRabbit vs Turo: Service and Rental Side Hustles Compared`
- **Before desc:** `Compare TaskRabbit service gigs with Turo car rentals. Startup costs, fee structures, time commitment, and real earnings data for both platforms.`
- **After title:** `TaskRabbit vs Turo: Which Side Hustle Pays More?`
- **After desc:** `One costs your time, the other costs capital up front. Compare service-fee cuts, unpaid travel, car carrying costs, and the days per month Turo must rent.`
- **Why:** position 7 with zero clicks on 208 impressions is the purest snippet failure in the set — the ranking is already there. `Service and Rental Side Hustles Compared` is an abstract academic clause that gives a scanner no reason to click. The description now leads with the actual tension (time vs capital) and ends on the Turo break-even day count, which is the post's most original piece of math.

### 8. `src/content/blog/substack-vs-beehiiv-newsletter-revenue.md`
90 impr · pos 19.0 · 0 clicks · **target query:** `substack vs beehiiv fees`

- **Before title:** `Substack vs Beehiiv vs ConvertKit: Newsletter Revenue Compared`
- **Before desc:** `Compare Substack, Beehiiv, and ConvertKit fees side by side — platform cuts, payment processing, sponsorship CPM, and what newsletter creators actually keep.`
- **After title:** `Substack vs Beehiiv vs ConvertKit: What You Actually Keep`
- **After desc:** `Substack's cut scales with your revenue; Beehiiv's flat monthly fee does not. See where the lines cross for your subscriber count, plus sponsorship CPM math.`
- **Why:** already comparison-led, so only the payoff clause changed. `Newsletter Revenue Compared` restates the title's own premise; `What You Actually Keep` states the outcome. The description now leads with the structural insight (percentage-of-revenue vs fixed monthly cost, and the crossover), which is what the post's *Breakeven Calculation* section actually delivers.

### 9. `src/content/blog/fire-calculator-guide.md`
52 impr · pos 57.1 · 0 clicks · **target query:** `fire number self employed` / `fire for freelancers`

- **Before title:** `FIRE Calculator: How to Know When You Can Retire Early`
- **Before desc:** `How the FIRE number works, what the 4% rule actually means, and how to calculate when you can retire — including Coast FIRE and freelancer-specific strategies.`
- **After title:** `FIRE for Freelancers: Why Your Number Runs 10-20% Higher`
- **After desc:** `The 4% rule assumes a steady paycheck. Self-employment tax, variable income, and a larger cash buffer push a freelancer's FIRE number up. Here is the math.`
- **Why:** at position 57 this is a ranking failure, not a snippet failure, so a title change alone will not move it. It was repositioned rather than optimised: `fire calculator` ranks 91st per D-002 and is unrecoverable, while the freelancer-FIRE angle is genuinely underserved and matches the site's audience. `10-20% higher` is the post's own stated conclusion, verbatim from its *FIRE on Freelance and Gig Income* section — not a figure I introduced. See the D-003 tension in Reflections.

### 10. `src/content/blog/self-employment-tax-guide.md`
44 impr · pos 12.9 · 0 clicks · **YMYL — treated conservatively** · **target query:** `self employment tax rate 2026`

- **Before title:** `Self-Employment Tax Guide 2026: Rates, Rules, and How to Pay Less`
- **Before desc:** `How self-employment tax works in 2026 — the 15.3% rate, Social Security and Medicare splits, deductions, and strategies to legally reduce what you owe.`
- **After title:** `Self-Employment Tax 2026: The 15.3% Rate and Deductions`
- **After desc:** `15.3% is 12.4% Social Security plus 2.9% Medicare, applied to 92.35% of net earnings — and the Social Security half stops at the annual wage base cap.`
- **Why:** `How to Pay Less` and `strategies to legally reduce what you owe` are savings promises on YMYL tax content. Both were removed in favour of `and Deductions`, which is a factual statement about the post's contents. The description is now purely descriptive of the mechanism.
- **Every figure verified in-session against the source of truth:** 12.4% = `SOCIAL_SECURITY_RATE 0.062` × 2 and 2.9% = `MEDICARE_RATE 0.0145` × 2, both `src/lib/calculators/shared/tax-brackets.ts:224–225`; 15.3% is their sum; 92.35% is the §1402(a)(12) statutory multiplier already stated in the post body. **The wage base cap is referenced by name, not by dollar amount, on purpose** — writing `$184,500` into markdown would create a hardcoded IRS figure that no import can update and that only the denylist would ever catch, and only after it went stale.

---

## Verification

Implementation lane, per CHIP-PROTOCOL §5.

| Command | Result |
|---|---|
| `npm install` | exit 0. Fresh worktree had no `node_modules`, as §8 warns. |
| `npm run check:tax-data` | `✓ Tax data clean — TY2026, verified August 9, 2026, no superseded figures outside the shared modules.` **0 warnings, 0 errors.** Also run before my changes to confirm the clean state was pre-existing and not luck. |
| `npm run build` | `[build] Complete!` — 141 pages, server built in 15.40s. Re-run and grepped for `error`/`warn`/`✗`: **no matches, 0 errors.** |
| `git status --short` | exactly 10 modified files, all under `src/content/blog/`. Nothing else. Uncommitted, as required. |

**Runtime check** (read from built HTML in `dist/client/`, not inferred from source) on 6 of the 10 changed posts — doordash-driver-earnings, gig-delivery-apps-compared, kofi-vs-patreon-comparison, print-on-demand-2026, self-employment-tax-guide, fire-calculator-guide. For each, the rendered `<title>`, `og:title`, and `<meta name="description">` all carry the new strings. The em dashes and the apostrophe in `Substack's` / `freelancer's` survive YAML parsing and HTML escaping intact. This check is what surfaced the ` | CalcFalcon` suffix finding above.

---

## Changelog entry (pre-drafted — Integrator merges this, do not write it to shared docs yourself)

- **Blog SEO titles and descriptions rewritten for CTR (10 posts).** Reframed the highest-impression blog posts around comparison queries per D-001, front-loading entity names so the `X vs Y vs Z` match survives SERP truncation. Removed the savings promise from the self-employment tax title (YMYL). No article prose changed; `title` and `description` frontmatter only.

---

## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| high | `src/pages/blog/[slug].astro:22` appends ` \| CalcFalcon` to every blog title. 31 of 40 blog posts render a `<title>` over 60 chars and 15 render over 70 — the brand suffix, not the authored titles, is the main cause. | `src/pages/blog/[slug].astro:22` | left: file not in my ownership list. Proposed as CHIP-TITLE-SUFFIX. |
| high | Third-party platform fee figures (Wyzant 25%, TaskRabbit 15%, Substack 10%, Gumroad 10%, Ko-fi 5%/$6 Gold, Merch by Amazon 32.5%, Etsy 6.5% + 3% + $0.25) are asserted across these posts with **no citation and no source-of-truth module**. `check:tax-data` does not cover them. | 8 of my 10 posts | left: out of scope and CHIP-RESEARCH-PAYMENTS owns the fact file. I kept all such figures out of the new snippets. |
| medium | Two posts state the same Merch by Amazon royalty differently — `print-on-demand-2026.md:63` gives ~$4.07 on a $19.99 shirt (≈20.4%), while `best-platforms-selling-digital-products.md:50` says "roughly 32.5 percent of the selling price". Both are mine to title, neither is mine to fix. | `print-on-demand-2026.md:63`, `best-platforms-selling-digital-products.md:50` | left: prose is out of scope. Proposed as CHIP-POD-RECONCILE. |
| medium | `print-on-demand-2026.md` carries `2026` in its slug, its title, and its body, with no mechanism to age it out. It will silently become a stale-dated page. Same shape as the defect that caused the AdSense rejection, in a different field. | `src/content/blog/print-on-demand-2026.md` | left: needs a product ruling on year-stamped slugs. |
| medium | `fire-calculator-guide.md` is in my list but is personal-finance content that D-003 excludes from further investment. I retitled it because the cost was one line, but it is the one row where the change cannot pay off — position 57.1 is a ranking failure, not a snippet failure. | — | fixed here, with the caveat recorded. |
| low | Blog frontmatter has no `keywords`, `targetQuery`, or `lastTitleChange` field, so there is nowhere in the repo to record what query a title is aiming at. All of that intent lives only in this notes file. | `src/content.config.ts` | left: schema is explicitly off-limits to me. Reported here as instructed. |
| low | `src/content/blog/` has 40 posts; only 13 appear in the Search Console table I was given. The other 27 have no measured impressions at all, so nothing is known about whether their titles work. | — | left: needs a fuller GSC pull. |

### 1. What I saw outside my scope

**The title suffix is the finding I would act on first.** I only caught it because §5 requires loading the rendered page rather than trusting the source. ` | CalcFalcon` costs 13 characters on every blog title, and the measurement above shows 31 of 40 posts rendering past the practical SERP limit because of it. Google frequently discards a boilerplate brand suffix and picks the site name from schema instead — but the site has no `WebSite`/`siteName` schema (I grepped `src/lib/seo/schema.ts`; there is no `siteName`, `WebSite`, or `alternateName` entry), so Google has nothing to substitute and may keep the suffix or rewrite the title itself. Calculator pages are worth checking for the same pattern; that is CHIP-CTR-CALC's territory, not mine.

**The unsourced fee figures are a slower-burning version of the tax-data defect.** These posts assert dozens of specific third-party fee percentages with no citation, no verification date, and no guard. Platform pricing changes more often than the IRS updates brackets, and D-001 makes cross-platform fee math *the* product. `check:tax-data` protects IRS and SSA figures precisely because review alone already failed once; the same argument now applies to platform fees, and nothing covers them. That is a structural gap, not a backlog item.

Because of that, **I deliberately removed the three fee percentages from the Ko-fi description** rather than carrying them forward. My constraint was "never invent a fee figure; if you can't verify it, leave it out," and I could not verify Wyzant's 25% or TaskRabbit's 15% against any primary source this session — and per §7 the research/writing split says I should not go do that research myself while CHIP-RESEARCH-PAYMENTS owns the fact file. The cost is real: a concrete number in a description lifts CTR, and the new snippets are structural instead ("what each one actually takes after per-transaction processing"). I judged an unverifiable number in the single most prominent position on the page to be the worse trade. If `docs/facts/creator-payment-fees.md` lands and confirms these figures, a follow-up pass should put the strongest one back into each description.

**A note on trusting the worktree.** Mine was branched at `6db616d`, two commits behind `main`, so it had no `docs/CHIP-PROTOCOL.md` and a `docs/DECISIONS.md` predating the entire D-001…D-009 ruling log. I read both via `git show a07857c:<path>` from the shared object store. §7's "rulings are quoted, not cited" warned me the local copy might be stale; it did not warn me the protocol file itself might be absent. That is worth a line in §8.

### 2. Risks in what I built

**Ranking risk on the two repositioned titles is the real exposure.** #5 (`best-platforms-selling-digital-products`) and #9 (`fire-calculator-guide`) do not just rewrite a snippet — they change what the page targets. Both are at positions 32 and 57 with zero clicks, so there is nothing to lose, which is exactly why I was willing. But this is the same asymmetry D-008 identified for Ko-fi: a rollback restores the string, not the ranking. The other eight are much safer, because they keep the same primary entities and only change the payoff clause.

**#6 (tutoring) is my least confident row.** It ranks at position 11.1 and I do not know which query puts it there. If it is `how to start tutoring`, dropping the how-to frame could cost the position. I hedged by keeping `Tutoring Side Hustle` first, but this is a guess, not a measurement, and it is the row I would most want reviewed.

**#1 (doordash) will probably not move much, and that is the honest expectation.** It holds 9,718 impressions — a third of the site's total — but at position 21.7, where nobody clicks regardless of the snippet. I was explicitly told not to fake comparison framing, and this post genuinely is not a comparison: it covers DoorDash alone and mentions multi-apping in one paragraph. The right fix is not a title. It is either building the comparison content the query set actually wants, or funnelling those impressions to `gig-delivery-apps-compared`, which does compare and already ranks 10.9.

**Two of my titles now open with "DoorDash".** #1 and #3 will appear together on DoorDash-related SERPs. They target different intents (single-platform net pay vs three-way comparison) and the posts already cross-link, so I think this reads as depth rather than duplication — but it is worth watching in the next GSC pull.

**The whole hypothesis is untested.** Every one of these changes rests on the premise that snippet framing is the binding constraint. D-008 rules that Ko-fi's page is excluded precisely so the other pages can test that premise first. These 10 posts are part of that test. If the next Search Console pull shows no movement on #3 and #7 — the two page-one posts where ranking is already sufficient and only the snippet was wrong — the hypothesis is wrong and nothing should be rolled out further on it.

### 3. Proposed follow-up chips

- **CHIP-TITLE-SUFFIX** — owns `src/pages/blog/[slug].astro` and `src/lib/seo/schema.ts`. Drop or shorten the ` | CalcFalcon` title suffix and add `WebSite`/`siteName` schema so Google renders the site name separately instead of consuming 13 title characters. Must run alone: `[slug].astro` and `schema.ts` are cross-cutting. Sequence **before** any further title work so the next wave optimises against the real character budget. *Sonnet, medium effort* — small, well-specified diff.
- **CHIP-FACTS-PLATFORM-FEES** (or fold into CHIP-RESEARCH-PAYMENTS' scope) — extend `docs/facts/` coverage past creator payments to the gig, tutoring, POD, and newsletter platform fees asserted across the blog, then add a `check:platform-fees` guard modelled on `scripts/check-tax-data.mjs` with a verification-date staleness check. Owns `docs/facts/*` and `scripts/`. *Opus, high effort* — this is verification work where a wrong figure is the failure mode.
- **CHIP-POD-RECONCILE** — owns `src/content/blog/print-on-demand-2026.md` and `src/content/blog/best-platforms-selling-digital-products.md` prose. Reconcile the contradictory Merch by Amazon royalty figures against whatever the fact file lands on. Must run **after** the fee fact file exists, and must not run concurrently with any chip holding those two files. *Sonnet, medium effort.*
- **CHIP-CTR-MEASURE** — docs lane, runs ~2 weeks after this merges reaches production. Pull Search Console, compare against the before-table in this file, and produce a ruling recommendation on whether the snippet hypothesis held — which is the evidence D-008 requires before anyone touches the Ko-fi page. *Sonnet, medium effort.*

### 4. Harness improvements

Things this protocol did not warn me about:

- **A worktree can be missing `docs/CHIP-PROTOCOL.md` entirely.** §8's environment traps mention stale branches after a history rewrite, but not the ordinary case of being branched a couple of commits before the protocol was committed. §8 should say plainly: *if `docs/CHIP-PROTOCOL.md` or a cited ruling is absent from your worktree, recover it with `git show <ref>:<path>` from the shared object store rather than proceeding without it.*
- **Worktree isolation blocks some ordinary shell shapes.** `cd`-ing to the shared checkout is refused (correctly), but so is any command the guard cannot statically prove stays inside the worktree — a `for f in ...; do ... done` loop over files in `src/content/blog/` was rejected as "too complex to verify." Worth a line in §8 so the next chip writes plain separate commands instead of losing a round-trip.
- **§5 should name the render check for content work.** It says "load the affected page and confirm the behavior," which reads as being about interactive behaviour. For frontmatter, copy, or SEO work the equivalent is *grep the built HTML in `dist/` for the strings you wrote*, and it is what caught the title-suffix finding here. Worth stating explicitly.
- **§7's "measure before choosing a threshold" needs a second half: measure the rendered value, not the authored one.** I measured frontmatter lengths, adopted a target, wrote all 10 titles, and only then discovered every one of them renders 13 characters longer. Measuring the source when the rendered artifact is what the threshold governs is a trap the rule as written does not close.
- **A rollback record has no home.** §9's template has no slot for one, so I put the before/after table under its own heading. If the Command Center expects rollback records in a consistent place — and for anything touching live SEO it should — the template should name the section.

### 5. Model tier feedback

Opus/high was the right call, and the reason is not the writing. Twenty short strings is not hard. The judgement calls were: deciding that the DoorDash post must *not* be framed as a comparison despite the comparison queries being where the impressions are; noticing the title suffix invalidated the length target I had just measured; and choosing to strip verifiable-looking fee percentages out of a snippet on a site whose defining failure was publishing confident wrong numbers. Each of those is a case where the locally attractive move is the wrong one. A cheaper tier would plausibly have written ten punchy comparison titles including a fake one for DoorDash, kept the fee percentages because they were already there, and never opened `dist/`.

If this pattern repeats for the remaining 30 posts once the suffix is fixed and the fee fact files exist, that follow-up is Sonnet work — the judgement calls will have been made and it becomes mechanical application of a proven pattern.
