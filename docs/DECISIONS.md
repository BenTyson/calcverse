# Decisions

Two parts. **Part 1 is a numbered ruling log and it overrides every spec, roadmap, and spawn prompt.** Part 2 is the standing decisions table — settled choices that are not re-debated.

Only the Command Center writes rulings. The Integrator does bookkeeping only (closing resolved items, correcting verified facts).

> **Chips:** if a spawn prompt quotes ruling text at you, **the quoted text wins** over the copy of this file in your worktree. Your copy may predate the ruling.

---

# Part 1 — Ruling log

## D-001 · Comparison-first architecture — RULED 2026-08-25

CalcFalcon is repositioned as a **cross-platform comparison engine**, not a calculator directory. Comparison hubs become the primary entry points; the 45 existing calculators become the evidence engine inside them and keep their URLs.

**Reasoning:** Search Console, trailing 12 months — the site ranks top-10 on comparison queries at 36%, versus 3% on head terms. Position 3.0 on "printful vs printify pricing comparison 2026" against position 27.8 on "how much does doordash pay" (1,006 impressions). The gap is structural: no platform will publish an honest comparison against its competitors, so the space cannot be occupied by an incumbent.

**Rejected:** continuing to optimize single-entity calculator pages for head terms. Those queries are owned by the platforms themselves plus Indeed, ZipRecruiter, and Reddit. Twelve months of data shows the site never gets above page three on them.

**Secondary effect:** this is also the answer to the AdSense violation. Cross-platform math is original by construction; a Ko-fi fee summary never will be.

## D-002 · Old Phases 12 and 13 cancelled — RULED 2026-08-25

The eight planned tax, finance, and business-operations calculators are cancelled. Old roadmap archived to `docs/archive/ROADMAP-v2-phases.md`.

**Reasoning:** personal finance averages position 88 across 12 months with zero clicks. "rent vs buy calculator" ranks 98th, "fire calculator" 91st, "sep ira calculator" 92nd. The phases would have added inventory to the site's weakest category while the strongest one (creator payments, 38% of pageviews on 3 of 45 calculators) was under-built.

## D-003 · Personal finance de-prioritized, not deleted — RULED 2026-08-25

The eight personal-finance calculators remain live and working. They receive no further investment and are excluded from hub work.

**Reasoning:** they have no natural comparison set, which is precisely why they lose — there is no "FIRE vs X" query. Removing them would cost URLs and inbound links for no measurable gain.

## D-004 · AdSense re-review held until original value ships — RULED 2026-08-25

No further AdSense review requests until at least one comparison hub is live.

**Reasoning:** two reviews already spent on the same "low value content" verdict. The second was requested after fixing authorship, disclaimers, sourcing, stale tax data, and dead ad placeholders — all real problems, none of them the binding constraint. The binding constraint is that nothing on the site is information you cannot get from the platform's own site. A third request with nothing structurally new would spend two more weeks for the same answer.

**Also settled:** AdSense has **no traffic minimum**. That belief drove months of wrong assumptions here. The rejections were always about content, never volume.

## D-005 · Nothing is removed for SEO reasons without an explicit ruling — RULED 2026-08-25

Low-traffic and low-ranking pages are repositioned, not pruned. Any deletion or consolidation requires a numbered ruling naming the specific pages.

**Reasoning, recorded plainly:** the Command Center recommended pruning the DoorDash, Airbnb, and personal-finance pages as dead weight. The human pushed back and said they'd add value if positioned correctly. **The human was right and the analysis behind the prune recommendation was wrong.** Re-running the query data by intent showed the gig content ranks 4th–8th on comparison queries while sitting at 25th–29th on the head terms it was actually built for. The content was never low-value; it was mispositioned. D-001 exists because of that correction.

## D-006 · Command-center operating model adopted — RULED 2026-08-25

One session plans, spawns, merges, and rules, and does no feature work. All feature work runs in chips in isolated worktrees under `docs/CHIP-PROTOCOL.md`. Chips never commit, never push, never spawn.

**Reasoning:** already earned on this repo. In one wave, three separate chips edited `src/layouts/BlogLayout.astro` because no one had assigned write-ownership. Two chips finished work and never committed it, and it sat undiscovered in worktrees. A history rewrite left a running chip branched from a commit that no longer existed. All three failure modes are addressed by the protocol.

## D-007 · Tax data standard — RULED 2026-08-09, reaffirmed 2026-08-25

Binding rules live in the Tax Data section of `CLAUDE.md` and the Tax Data table in Part 2. Summary: never hardcode an IRS/SSA figure, never invent a figure or citation, primary sources fetched in-session only, compute worked examples by running the calculator, `npm run check:tax-data` enforces it.

**Reasoning:** the calculators computed on 2024 federal data under 2026 headings for two years, across 45 calculators and 13 blog posts. On a YMYL site carrying a live AdSense violation, that is the highest-severity defect class available.

## D-008 · The Ko-fi calculator page is excluded from Wave 1 title changes — RULED 2026-08-25

`src/pages/creator/kofi-calculator.astro` is **not** to be modified by any Wave 1 chip. Its title and meta description stay exactly as they are.

**Reasoning:** it is the best-performing page on the site by a wide margin — position 12.3, 1.54% click-through, and 52 of the site's 106 total clicks over 12 months. Every other page's CTR hypothesis is untested. Rewriting the one page that works, on an untested hypothesis, risks roughly half of all site traffic to learn something the other 14 pages can teach us for free.

**Sequence:** rewrite the other 14 calculator pages, wait for a Search Console pull (~2 weeks), and apply the proven pattern to Ko-fi with evidence rather than theory.

**Rejected:** including it with a documented rollback. Rollback restores the title but not the ranking — Google may re-evaluate the page on the new title before we revert, and recovery is not guaranteed to be symmetric.

## D-009 · Wave 1 runs all four chips concurrently — RULED 2026-08-25

**Reasoning:** file ownership is genuinely disjoint — the two implementation chips touch different file types (`.astro` pages vs `.md` frontmatter) with explicitly named non-overlapping lists, and the two doc chips each create one new file and touch no code. Two of four are docs-only, so the blast radius of a protocol failure is small. The first wave is expected to be rough; surfacing protocol gaps while the stakes are low is the point.

**Follow-up obligation:** every Wave 1 chip's harness-improvement reflections get folded back into `docs/CHIP-PROTOCOL.md` before Wave 2 is spawned. The protocol is a living document; that loop matters more than any single rule in it.

## D-010 · D-008 protects rankings, not falsehoods — RULED 2026-08-25

D-008 (Ko-fi page excluded from Wave 1) covers **the `title` and `description` props and the `<h1>` only** — the ranking-bearing, CTR-experiment surface. It does **not** shield factually wrong body copy, FAQ answers, or worked examples on that page.

`src/pages/creator/kofi-calculator.astro` currently prices Ko-fi Gold at **$6/month** in three places (lines 9, 14, 79) and derives a **$120/month** break-even from it. Verified against Ko-fi's own pricing on 2026-08-25: Gold is **$12/month**, so the real break-even is **$240**. The page also asserts three times that shop sales are "always commission-free regardless of plan tier"; Ko-fi charges 5% on shop sales.

**Reasoning:** a factual correction is not a ranking experiment. The page's ranking rests on its title, which nobody needs to touch. Reading D-008 literally would leave a wrong price for a paid product on the site's most-visited page indefinitely — that is worse than the risk D-008 was written to avoid.

**Rejected:** waiting for the CTR experiment to conclude. Publishing a $6 price for a $12 product is the kind of error that damages trust with the exact audience the site is repositioning around.

## D-011 · Platform fee data gets the tax-data treatment — RULED 2026-08-25

Third-party platform fees are now governed like IRS/SSA figures: single source of truth, primary sources fetched in-session, cited with a verification date, and enforced by a guard.

**Reasoning:** `CHIP-RESEARCH-PAYMENTS` verified 12 first-party sources and found **all four** existing creator calculators computing on wrong fees. Every error but one favours the platform:

| Platform | Modelled | Actual | Severity |
|---|---|---|---|
| Patreon | Lite 5% / Pro 8% / Premium 12% | Those plans do not exist. Mandatory **10%** for anyone joining after 2025-08-04; legacy Founders 5% / Pro 8% / Pro+Merch 11% | **blocker** |
| Gumroad | flat 10%, "no additional fees" | **10% + $0.50/transaction** — 11.7% at the module's own $29 default | **blocker** |
| Ko-fi | Gold $6/mo, shop sales 0% | Gold **$12/mo**; shop sales **5%**; one-off tips **0%** not 5% | high |
| Substack | 10% + 2.9% + $0.30 | missing Stripe's **0.7% Billing fee**; the 0.5% legacy rate expired 2025-06-30 | high |

`patreon-earnings.ts:25` is commented `// Patreon fee structure (2024)`. This is the same defect class as the two-year-stale tax data, in the exact category D-001 names as the site's strategic core. Cross-platform fee math is now the product; wrong fees are not a content bug, they are a product failure.

**Also settled:** `docs/facts/creator-payment-fees.md` is the source of truth. Its 21 open **Verify** rows block downstream copy. A chip that "resolves" a Verify row by choosing the plausible number reintroduces precisely the defect the fact file exists to prevent — three of those rows are load-bearing, including whether Buy Me a Coffee bills Stripe's payout fee to the creator, which is the headline figure a BMC calculator would exist to produce.

## D-012 · CHIP-CTR-CALC is not merged; research precedes writing in sequence, not just in scope — RULED 2026-08-25

The Wave 1 output of `CHIP-CTR-CALC` is **rejected for merge** and will be redone in Wave 2 after fee corrections land.

**Why:** it wrote verified-against-the-code fee figures into 14 page titles and descriptions — including *"Patreon takes 5% (Lite), 8% (Pro), or 12% (Premium)"*. Per D-011 that plan menu does not exist. Merging would have published a fabricated fee structure into the metadata of the site's second-best page. The work was competent; its inputs were wrong.

**Command Center error, recorded plainly:** `CHIP-PROTOCOL.md` §7 says research and writing split across chips, and that a writing chip may write nothing not in the verified fact file. I ran the research chip **concurrently** with a writing chip that depended on its output, so the fact file did not exist when the titles were written. The rule was about scope; it needs to be about ordering too. This is a sequencing failure by the Command Center, not a chip failure — and the fix belongs in the protocol before Wave 2.

**Salvage:** the chip's before/after table in `docs/notes/CHIP-CTR-CALC.md` is a complete rollback record and its length measurements are sound. Wave 2's retitling chip should start from it rather than from scratch.

## D-013 · `formatCurrency` rounds away cents site-wide — RULED 2026-08-25

`formatCurrency()` in `src/lib/utils/formatters.ts` sets `maximumFractionDigits: 0`. It renders **$0.50 as "$1"** and **$25.60 as "$26"**. A `formatCurrencyWithCents()` variant exists in the same file and was in use by 2 of 45 calculator components.

**Two chips found this independently in the same wave**, both only because they measured the *rendered* output rather than reading the source:

- `CHIP-FEE-GUMROAD` built correct source and shipped built HTML reading "10% + **$1**/sale" and "you keep **$26**" — a 100% error on the exact figure that chip existed to publish.
- `CHIP-FEE-PATREON` saw a $0.25 payout fee render as **"-$0"**.

**Measured exposure:** all 45 calculator components import `formatCurrency`; only `SubscriptionAuditCalc.tsx` and `PrintOnDemandCalc.tsx` use the cents variant.

**Reasoning:** this is invisible to source review and to any check that stops at an exit code. It silently corrupts every sub-dollar and cents-sensitive figure on the site — per-sale fees, per-mile rates, per-delivery pay — in the exact category D-001 makes the product. Whole-dollar rounding is correct for headline annual figures and wrong for unit economics, so the fix is per-call-site judgment, not a global swap.

**Sequencing:** *move*-shaped work — 45 files, shallow edits — so per `CHIP-PROTOCOL.md` §7 it runs **serialized, alone**, with no sibling touching a calculator component. Scheduled for W3 as `CHIP-CENTS-SWEEP`. Until then, any chip touching a cents-sensitive figure uses `formatCurrencyWithCents` locally and says so in its notes.

**Rejected:** changing `formatCurrency`'s default to two decimals. That silently adds ".00" to every headline annual and monthly figure across 45 calculators — a large uncontrolled visual change to fix a narrow numeric one.

## D-014 · Confident rows publish arithmetic; Verify rows withhold recommendations — RULED 2026-08-25

When a figure is Confident but its *interpretation* depends on an open Verify row, publish the arithmetic and withhold the advice.

**The case:** Ko-fi Gold costs $12/month and the service fee is 5% — both Confident. The break-even is therefore $240/month, and D-010 states that figure. But **V-K1 is open**: Ko-fi's own Gold page is headed "You no longer need Ko-fi Gold" while its Help Centre fee breakdown omits Gold entirely, so whether Gold is still purchasable is unresolved.

`CHIP-FEE-KOFI` handled this correctly without being told how. It published the dollar arithmetic, surfaced the contradiction from Confident rows, told the reader to check current pricing, and **did not** recommend buying Gold. It asked for a ruling instead of choosing.

**Ruling:** that is the general pattern. D-011's Verify clause blocks *claims that depend on the unresolved fact*, not every sentence in the vicinity of one. Arithmetic from Confident inputs may ship. A recommendation to take an action whose availability is unverified may not.

**Why this matters beyond Ko-fi:** the stricter reading — Verify blocks everything nearby — would have left a $6 price for a $12 product on the site's best page indefinitely, which is the failure D-010 exists to prevent. The looser reading — Verify is advisory — is what produced the Patreon plan menu. This is the line between them.

**Credit where due:** the chip's instinct was better than the instruction it was given. Recorded per the operating model's requirement to say so plainly when a chip is right.

## D-015 · The Command Center pushes verified merges — RULED 2026-08-25

The original operating model was "chips never commit or push; the Command Center merges and verifies; the human pushes." The human has delegated the push. **The Command Center now commits, merges, verifies, and pushes.** Chips still never commit or push.

**The bar for pushing is unchanged and non-negotiable** — Railway auto-deploys from `main`, so a push is a production deploy:

1. Merge verified **by ancestry** (`git branch --contains <sha>`), never by a silent command.
2. `npm run build` — 0 errors, output read, not just the exit code.
3. `npm run check:tax-data` — 0 warnings.
4. A content spot-check of the **built** output in `dist/client/`, not the source. Per D-013, source-level review has already missed a 100% numeric error in this repo.
5. For anything touching a page with existing rankings, the ranking surface is diffed against what is live before pushing.

**Reasoning:** the human-in-the-loop step was catching nothing the verification gates didn't already catch, while a backlog of unpushed correct fixes meant the live site kept serving wrong fee data. The risk being managed is bad merges, and the defense against those is verification, not a second pair of eyes on a green build.

**Still escalated to the human, not decided here:** anything that changes what the site *is* rather than fixing what it says — new URL structures, removing pages, monetization changes, and AdSense review submissions (D-004).

## D-016 · Wrong computations are a distinct defect class from wrong constants — RULED 2026-08-25

Fee and figure governance (D-007, D-011) has so far targeted **stale constants** — values that were once right. `CHIP-RESEARCH-NEWSLETTER` established a second class where **every constant is current and correct, and the published figure is still wrong.**

Two verified instances:

1. `src/content/blog/substack-vs-beehiiv-newsletter-revenue.md:197` publishes *"self-employment tax alone is approximately $3,672 per year"* on $24,000. That is `24000 × 0.153` — it omits the 92.35% adjustment. Correct: **$3,391**. The rate is right, the income is right, the arithmetic step is missing. **`docs/BLOG-TAX-AUDIT.md` is marked closed, so this survived an audit that believed it was finished.**
2. `src/lib/calculators/newsletter-revenue.ts:59-64` adds Stripe's 2.9% on top of Kit's 3.5%, but Kit publishes that rate as **inclusive of card processing**. Both numbers are correct in isolation; stacking them is the defect.

**Ruling:** a denylist cannot catch this class. Verification of any derived public figure must **recompute it**, not match it against known-bad values. `CHIP-PROTOCOL.md`'s "compute worked examples by running the calculator" already says this for chips; it now also binds audits — an audit may not be closed on the basis that no known-bad constant appears.

**`docs/BLOG-TAX-AUDIT.md` is reopened** for the SE-tax class specifically.

## D-017 · The newsletter comparison is unreliable in ranking, not just magnitude — RULED 2026-08-25

`src/lib/calculators/newsletter-revenue.ts` and `substack-vs-beehiiv-newsletter-revenue.md` are treated as producing **unreliable platform rankings**, not merely imprecise numbers, until corrected.

**Reasoning, from verified research:**
- **beehiiv's 0% take rate is real but unreachable on the free plan.** Paid subscriptions require a paid plan; entry is **$49/mo**, and pricing is a **step function of total list size** ($49 → $329 across 1K–100K). The calculator models the 0% and never the $49–$329. There is no "Grow" plan and Max is $109–$459, not $399.
- **Kit's rate is processing-inclusive** and the module double-counts (D-016).
- **The `+ $0.30` per-transaction term is absent from all three branches** — 6% of a $5/month subscription.
- At the module's own defaults it over-states monthly take-home by **$71 / $160 / $45** for Substack / beehiiv / Kit respectively. Because the errors differ per platform, **the winner it picks can be wrong**, which is worse than a uniform offset.

**The $990/month crossover the blog tells readers to act on does not exist at any tier.** Because beehiiv's price moves with list size, the real crossover ranges from **$490/mo** at a 1,000-subscriber list to **$3,290/mo** at 100K. The post's own example at line 81 also inverts its conclusion.

**Sequencing:** `V-N1` — whether Stripe's 0.7% Billing fee applies to beehiiv — is open and load-bearing. Per D-014 the correction may publish both branches labelled, but may not pick one. `CHIP-FEE-NEWSLETTER` also needs `NewsletterRevenueCalc.tsx`, currently owned by `CHIP-CENTS-SWEEP`, so it cannot be spawned until that chip merges.

---

# Part 2 — Standing decisions

Settled. Changing one requires a numbered ruling in Part 1.

## Stack

| Decision | Choice | Why |
|---|---|---|
| Framework | Astro 5 (SSG + per-route SSR) | Islands architecture; mostly-static with interactive widgets |
| UI | React 19 | Calculator interactivity, ecosystem |
| Styling | Tailwind CSS 4 | Rapid development, small bundle |
| Hosting | Railway | GitHub auto-deploy from `main` |
| Analytics | Umami (self-hosted) | Free, privacy-focused, no cookie banner |
| Ads | AdSense (blocked — see D-004) | Journey by Mediavine needs 1,000 sessions/mo; not yet reached |
| Email | **Sparrow API gateway** | Migrated off Resend 2026-04; `src/pages/api/subscribe.ts` |
| Blog | Astro Content Collections | Markdown in `src/content/blog/`, no CMS |
| Domain | calcfalcon.com | Purchased, configured in codebase |

## Architecture

| Decision | Choice | Why |
|---|---|---|
| Database | None | URL params for state sharing |
| Auth | None | No user accounts |
| State | URL params (`?s=` base64, `?mode=`) | Shareable results |
| Build | Static + SSR endpoint | `@astrojs/node`, `prerender = false` per-endpoint |
| Hydration | `client:visible` on pages, `client:load` on embeds | Don't hydrate until scrolled into view |
| Error handling | React `ErrorBoundary` in every calculator | Prevents blank pages on crash |
| Calculator state | `useCalculatorState` hook (all 45 calculators) | Removes ~6 lines of boilerplate each |
| Embed rendering | Explicit if-else chain per component | Astro can't trace `client:load` through dynamic map lookups |
| Tax figures | `shared/tax-brackets.ts`, `shared/mileage-rates.ts`, `shared/retirement-limits.ts` | Single source of truth; figures had drifted across 6+ files |

## Brand

| Decision | Choice |
|---|---|
| Name | CalcFalcon |
| Primary color | Electric Cyan `#06b6d4` — `primary-*` classes |
| Category classes | `freelance-*` `creator-*` `gig-*` `sidehustle-*` `finance-*` |
| Never use | `brand-*` classes — they do not exist |
| Author identity | First name "Ben" only. No last name anywhere in source. No bio page. Never fabricate credentials. |

## URL structure

```
/[category]/[calculator-name]-calculator          # Calculator pages
/embed/[category]/[calculator-name]-calculator    # Embeds (noindex, robots-disallowed)
/blog/[slug]                                      # Articles
```

## Monetization

| Decision | Choice | Why |
|---|---|---|
| Ad slots | `AdSlot.astro`, CLS-safe min-heights | Prevent layout shift |
| Empty ad slots | Render **nothing** — no container, no "Advertisement" label | Empty labeled boxes read as made-for-advertising to a reviewer |
| Auto Ads | Never | They inject into calculator input UI and destroy conversion |
| Affiliate mapping | `calculatorAffiliates` map in `monetization.ts`, rendered via `AffiliateGrid.astro` | Supersedes the per-page `affiliateProduct` prop |
| Dead affiliate URLs | A partner with `#` or empty URL renders nothing | Dead sponsored links were live on 5 pages for months |
| Affiliate links | `rel="nofollow sponsored"` | FTC requirement |
| Email capture | Sparrow API via SSR endpoint | API key stays server-side |

## Tax data (D-007)

| Decision | Choice | Why |
|---|---|---|
| Source of truth | `shared/` modules | Figures duplicated across 6+ files, drifted 2 years stale |
| Year exposure | `TAX_YEAR` / `TAX_DATA_LAST_VERIFIED` drive every `SourcesBlock` | Pages hardcoded `taxYear="2024"` under 2026 blog titles |
| Verification | Primary sources only, fetched in-session | YMYL with a live policy violation |
| Unverifiable figures | Leave old value, label it, report it | A labeled stale figure beats a confident wrong one |
| Enforcement | `npm run check:tax-data`; denylist grows annually | Human review alone already failed once |
| Non-indexed figures | NIIT + Additional Medicare thresholds are statutory | Easy to wrongly re-index during an inflation pass |
| Mileage rate | Use the rate in effect; disclose split-year periods | 2026 split mid-year (72.5¢ → 76¢ on Jul 1) |

---

## Still open

- **Font discrepancy — needs verification.** `CLAUDE.md` says Inter; `BaseLayout.astro` preloads `plus-jakarta-sans-latin.woff2`. One of them is wrong. Assigned to a future chip; do not "fix" either until measured.
- Blog content voice (casual vs professional)
- Social media presence
- The three open questions at the foot of `docs/ROADMAP.md`
