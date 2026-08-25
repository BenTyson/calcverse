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
