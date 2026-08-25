# Chip Protocol

**If you are an agent session working on CalcFalcon and you were given a scoped job, you are a chip. Read this file first, in full, before touching anything.**

This is a living document. Every wave folds its lessons back in. If you hit something this protocol didn't warn you about, say so in your Reflections — that is how this file gets better.

---

## 1. What a chip is

CalcFalcon runs a command-center model. One session — the **Command Center** — plans, spawns, merges, and rules. It does no feature work. All feature work happens in **chips**: focused agent sessions, each with one scoped job, each in its own git worktree.

You are one chip. You have no visibility into your siblings. That is the whole reason the rules below exist.

---

## 2. Write-ownership — the rule that makes concurrency safe

**Your spawn prompt names the exact files you own. Write only those.**

Not "files in this area." The named list. If the job seems to require editing a file you weren't given, **stop and report it in Reflections** rather than editing it. A sibling chip probably owns it right now.

Your spawn prompt also carries an explicit **do-not-touch list** naming sibling chips' files. Respect it literally.

### Known collision hot spots in this repo

These files are edited by many features and are where collisions actually happen. They are almost never granted to more than one chip in a wave:

| File | Why it collides |
|---|---|
| `src/layouts/BlogLayout.astro` | CTAs, bylines, ad slots, schema all live here — three chips edited it in one wave once |
| `src/layouts/CalculatorLayout.astro` | Ads, affiliates, related links, sources blocks |
| `src/layouts/BaseLayout.astro` | Meta tags, analytics, ad loader |
| `src/lib/config/monetization.ts` | Affiliate map + AdSense config |
| `src/lib/config/calculators.ts` | The calculator registry — every new calculator touches it |
| `src/pages/embed/[...slug].astro` | Explicit if-else chain; every new calculator touches it |
| `src/content.config.ts` | Blog schema |
| Category index pages (`src/pages/*/index.astro`) | Counts and listings |

If your job needs one of these and you weren't granted it, that is a sequencing problem for the Command Center to solve, not something to work around.

---

## 3. Never write shared docs

Chips do **not** write: `CLAUDE.md`, `README.md`, `docs/STATUS.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, or any other cross-cutting doc.

Instead, write a **pre-drafted entry** into your own notes file. A serialized **Integrator** chip merges those into the real docs, running alone, last, after the wave finishes.

You own exactly one doc: `docs/notes/<CHIP-NAME>.md`.

---

## 4. Never commit, never push, never spawn

- **No commits.** Leave your work uncommitted in the worktree. The Command Center commits and merges. The human pushes.
- **No pushing.** Ever.
- **No spawning other chips.** You lack the global view — a chip you spawn can't be given the sibling do-not-touch list, so it will collide with work it never knew existed. Propose follow-ups in Reflections; the Command Center places them.
- **Never self-assign a version, phase, or wave number.** Concurrent chips can't see each other and will pick the same one. Write a title; the Integrator numbers it.

---

## 5. Verification lanes

State your lane at the top of your notes. The bar differs.

### Implementation lane
Touching `src/`. You must run and read the output of:

```bash
npm install          # worktrees often start without node_modules
npm run build        # must pass with 0 errors
npm run check:tax-data   # must pass with 0 warnings
```

Plus a real runtime check of what you built — load the affected page and confirm the behavior, don't infer it from the code. Exit code alone is not verification; read the output.

### Spec / docs lane
No `src/` changes. Bar is internal consistency, and **every claim you make about the code is checked against the code**. Do not describe a file you did not open. Note explicitly that production code was untouched.

### Prototype / spike lane
Visual or output judgement. State plainly that production code was untouched and what would need to happen to productionize.

---

## 6. Reflections — mandatory, and the highest-value thing you produce

Every chip ends its notes with a Reflections section. This is not boilerplate. In practice the most valuable findings on this project come from chips noticing things nobody asked them to look at — a dead config map that had never been wired up, a live dead link, two-year-stale tax data. None of those were in anyone's spawn prompt.

**Open with a findings table.** Without it, blockers get buried.

```markdown
## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| blocker | Affiliate map never consumed by any component | src/lib/config/monetization.ts:15 | proposed as CHIP-AFFILIATE-WIRE |
| high | Blog CTA ignores calculatorSlugs array; 9 posts render no CTA | src/layouts/BlogLayout.astro:15 | fixed here |
| medium | 19 calculators under 10 visitors in 5 months | — | left: needs product ruling |
| low | `formatCompactNumber` imported but unused | src/components/calculators/YouTubeAdSenseCalc.tsx | left: cosmetic |
```

Severity is `blocker` / `high` / `medium` / `low`. Status is `fixed here` / `left, why` / `proposed as CHIP-NAME`.

Then prose covering:
1. **What you saw outside your scope** — anything that looked wrong, stale, duplicated, or surprising.
2. **Risks in what you built** — what you're unsure about, what you'd want reviewed, what could break.
3. **Proposed follow-up chips** — name them, scope them, say what files they'd own.
4. **Harness improvements** — what this protocol failed to warn you about. What tripped you up.
5. **Model tier feedback** — if the work needed a different tier than you were given, say so.

---

## 7. Rules learned the hard way

**Measure before choosing a threshold.** Any number that gates behavior gets measured against the real distribution first, and the measurement goes in your notes. This turns taste calls into arithmetic.

**Don't trust "dead code" reports — including your own.** Verify by basename *and* relative path, across `src/`, `scripts/`, and tests. Prefer un-exporting to deleting.

**Trust the repo over the notes.** Notes are written in good faith and are sometimes wrong about filenames, counts, and what shipped. Verify before relying on another chip's claims.

**Rulings are quoted, not cited.** Your worktree may hold a copy of `DECISIONS.md` that predates the ruling being cited at you. If a spawn prompt quotes ruling text, that quoted text wins over your local copy.

**Refactoring splits in two, and the halves never run concurrently.** *Move* work (renames, reorganization) touches many files shallowly and conflicts with everything — it gets serialized into a chip running alone. *Extract* work (deduplication, splitting modules) touches few files deeply and parallelizes fine in disjoint zones.

**Public factual copy ships with a fact table.** Claims split into Confident vs Verify, with sources. Unverified rows block the copy.

**Research and writing split across chips.** A web-capable research chip produces a verified fact file; the writing chip may write nothing that isn't in it.

---

## 8. CalcFalcon-specific hazards

### Tax and financial figures — YMYL, highest bar on the project

This site publishes tax and earnings guidance. Wrong figures here are the single highest-risk defect, and the domain already carries a live AdSense "low value content" violation. See the Tax Data section of `CLAUDE.md`, which is binding.

- **Never hardcode an IRS/SSA figure.** Import from `src/lib/calculators/shared/tax-brackets.ts`, `shared/mileage-rates.ts`, or `shared/retirement-limits.ts`. `npm run check:tax-data` enforces this.
- **Never invent a number or a citation.** Every figure comes from a primary source (irs.gov, ssa.gov, Federal Register) fetched in your session. If you can't verify it, leave the old value and report it. A labeled stale figure beats a confident wrong one.
- **Never fabricate credentials.** Do not write "CPA", "CFP", or any licensed designation for anyone. Lived experience is a legitimate signal; a made-up license is fraud.
- **Compute worked examples by running the calculator**, not by hand. Import the real function in a scratch script. Hand arithmetic on tax math is how wrong numbers get published.

### Design system
- **Never use `brand-*` Tailwind classes.** They don't exist. Use `primary-*`.
- Category colors: `freelance-*` cyan, `creator-*` magenta, `gig-*` emerald, `sidehustle-*` purple, `finance-*` amber.
- Reuse `card-elevated` / `card-elevated-lg`.

### Architecture invariants
- Every calculator is 3 files: logic (`src/lib/calculators/`), UI (`src/components/calculators/`), page (`src/pages/[category]/`).
- Calculator `.tsx` files wrap their return JSX in `<ErrorBoundary>`.
- Calculator pages use `client:visible`; **only** embeds use `client:load`.
- Never hardcode domain URLs — use `Astro.site` with a `https://calcfalcon.com` fallback.
- Affiliate links keep `rel="nofollow sponsored"` (FTC requirement, not style).

### Environment traps
Recorded as hit, so the next chip doesn't rediscover them:

- **Fresh worktrees have no `node_modules`.** Run `npm install` before anything else, or `astro` is "command not found".
- **Node 20 here does not support `--experimental-strip-types`.** To execute a `.ts` module in a scratch script, use `npx tsx`.
- **A worktree branched before a history rewrite carries the old commits.** If the Command Center rewrote history, your branch needs rebasing — it will handle it; just don't force anything.
- Railway auto-deploys from `main`. Nothing you do reaches production, but a careless push would.

---

## 9. Notes file template

```markdown
# CHIP-NAME

**Lane:** implementation | spec/docs | prototype
**Owns:** <exact files from the spawn prompt>
**Model:** <tier you ran at>

## What shipped
<what you actually changed, file by file>

## Verification
<commands run and what the output said — not just "passed">

## Measurements
<any threshold you chose, and the distribution you measured it against>

## Changelog entry (pre-drafted — Integrator merges this, do not write it to shared docs yourself)
<one or two lines in the project's changelog voice>

## Reflections
<findings table, then the five prose sections from §6>
```
