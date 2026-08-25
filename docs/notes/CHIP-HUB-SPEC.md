# CHIP-HUB-SPEC

**Lane:** spec/docs
**Owns:** `docs/specs/comparison-hub.md`, `docs/notes/CHIP-HUB-SPEC.md`
**Model:** Fable 5, high effort

**Production code was untouched.** No file under `src/`, `scripts/`, or
`public/` was created or modified. The only writes are the two files this
chip owns.

## What shipped

- `docs/specs/comparison-hub.md` — the comparison-hub architecture spec.
  Core decisions, each argued against alternatives in the spec:
  - **Engine abstraction:** normalized per-hub inputs + one adapter per
    platform that maps onto the platform's *native* `Inputs` type and calls
    the **existing** pure `calculateX()` functions unchanged. Rejected a
    generic normalized fee model (duplicates live math → drift, the tax-data
    failure mode replayed) and a mass refactor onto shared input types
    (move-shaped, serializes everything, destroys the bespoke inputs).
    Invariant this buys: the hub's number provably equals the single
    calculator's number — and each platform row deep-links into its full
    calculator pre-filled via the existing `?s=`/`encodeState` machinery.
  - **New files only** for the hub build (`src/lib/hubs/`,
    `src/components/hubs/`, `src/layouts/HubLayout.astro`,
    `src/pages/compare/`) — maximally parallel-safe. One deliberate
    exception: extracting platform fee constants into a cited
    `src/lib/platforms/platform-fees.ts` registry edits 4 creator calc
    modules (extract-shaped, exclusive grant, own chip).
  - **URL:** `/compare/[hub-slug]` — flagged as a standing-decision change
    needing a ruling.
  - **First hub:** creator payments; full build spec including adapter
    mapping table, Quick/Advanced input set, and a per-platform
    "matching net" verification requirement.
  - **Sequencing:** 5 scoped follow-up chips with exact file ownership
    (§10 of the spec); hot spots (`CalculatorLayout.astro`,
    `monetization.ts`, `calculators.ts`, embed chain) all deferred to
    serialized chips or avoided via new registries.

## Verification

Spec-lane bar: every code claim checked against the file it names. Files
read end-to-end or in relevant part are listed at the top of the spec
(19 source files). Non-obvious claims verified by direct read:

- `useCalculatorState.ts` lines 13–17: quick-mode `useEffect` overwrites
  URL-decoded state with `QUICK_MODE_DEFAULTS` after mount — basis for the
  `?mode=advanced` deep-link requirement.
- `print-on-demand-profit.ts`: per-platform cost tables + royalty-vs-cost
  model switch — the in-repo precedent for multi-platform logic.
- `patreon-earnings.ts` line 25: fee comment self-labeled "(2024)".
- `astro.config.mjs` line 16: sitemap filter excludes only `/embed/`.
- `package.json`: no test runner exists (build + check:tax-data only).
- Blog dir: 5 comparison-shaped posts exist (`kofi-vs-patreon-comparison.md`
  etc.) — basis for the cannibalization section.
- `grep -rn "calcfalcon.com" src/components/calculators/*.tsx` — basis for
  the dead-URL findings below.

`npm run build` not run: no code changed; the worktree has no
`node_modules` and installing to verify an unchanged build adds nothing.

## Measurements

No behavior-gating thresholds chosen. Traffic figures quoted in the spec
(36% vs 3% top-10 rate, 38% creator pageviews, position values) are taken
from the spawn prompt, `docs/ROADMAP.md`, and the `monetization.ts` comment
block — not independently re-measured; the spec marks the GSC URL-level
breakdown (which *pages* hold the comparison rankings) as data only the
Command Center has, and gates a ruling on it.

## Changelog entry (pre-drafted — Integrator merges this, do not write it to shared docs yourself)

- docs(specs): comparison-hub architecture spec — adapter-per-platform engine
  over existing calculator functions, `/compare/[hub-slug]` routing proposal,
  platform-fee registry with tax-data-grade governance, creator-payments hub
  build spec, and 5 scoped follow-up chips (CHIP-HUB-SPEC).

## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| high | Copy-results text ships dead URLs on 3 calculators: `/creator/ko-fi-calculator` (real: `kofi-calculator`), `/gig-economy/airbnb-profit-calculator` (real: `airbnb-calculator`), `/creator/twitch-revenue-calculator` (real: `twitch-calculator`). Users pasting results share 404 links — Ko-fi is the site's best-performing page | `src/components/calculators/KofiCalc.tsx:34`, `AirbnbProfitCalc.tsx:28`, `TwitchRevenueCalc.tsx:41` | proposed as CHIP-COPYLINK-FIX |
| medium | Quick-mode share links silently lose advanced-field state: `useCalculatorState`'s quick-mode effect overwrites URL-decoded inputs with `QUICK_MODE_DEFAULTS` on mount. Also makes hub deep links fragile (spec works around it with `?mode=advanced`) | `src/hooks/useCalculatorState.ts:13-17` | left: behavior change needs a ruling; workaround specced |
| medium | Platform fee constants have no governance: hardcoded per-module, uncited, no last-verified date; Patreon's are self-labeled "(2024)" on a YMYL money page | `src/lib/calculators/patreon-earnings.ts:25`, `kofi-earnings.ts:39-42`, `substack-revenue.ts:28-32`, `print-on-demand-profit.ts:39-81` | structural fix specced (§5, CHIP-FEES-CREATOR); figure verification is CHIP-RESEARCH-PAYMENTS's lane |
| medium | New hub pages can cannibalize the blog posts that hold the site's only proven comparison rankings (5 vs-shaped posts found) | `src/content/blog/kofi-vs-patreon-comparison.md` and 4 siblings; spec §8 | left: needs GSC URL data + ruling |
| low | All 45 calc components hardcode `https://calcfalcon.com` in `getResultsText` — letter-violation of the no-hardcoded-domain rule (client components can't use `Astro.site`; `window.location.origin` would work) | `src/components/calculators/*.tsx` | left: cosmetic unless domain ever changes; fold into CHIP-COPYLINK-FIX |
| low | No test infrastructure exists (no runner in `package.json`), so the hub's core invariant (hub net === calculator net) can only be verified manually | `package.json` | left: noted in spec DoD; adding a runner is its own decision |

### 1. What I saw outside my scope

The findings table covers it. The dead copy-link URLs are the one thing I'd
escalate: they are live today, on the highest-traffic page, and every
share-by-paste propagates a 404. Fix is three one-line string edits (plus
optionally the `window.location.origin` cleanup across all 45).

Also worth knowing: three calculators (`print-on-demand-profit`,
`newsletter-revenue`, `online-course-revenue`, `reselling-profit`) already
contain multi-platform fee models behind a dropdown — the hub thesis has
working in-repo precedent, which raised my confidence in D-001 considerably.

### 2. Risks in what I produced

- The adapter mappings in §9 (how one scenario projects onto five business
  models) are editorial judgment. I specced them as *displayed assumptions*
  precisely because I don't fully trust any single mapping; an implementation
  chip should feel free to argue with the specific mappings, not with the
  pattern.
- I recommend creator-payments first partly on the 38% pageview figure from
  the `monetization.ts` comment — I did not independently verify it against
  Umami.
- The `/compare/` URL proposal is taste plus argument, not data. If the
  Command Center's GSC data shows the ranking comparison pages live at
  `/blog/...`, option (b) (301 blog → hub) may beat my recommended (c).

### 3. Proposed follow-up chips

Fully scoped in spec §10 (CHIP-FEES-CREATOR, CHIP-HUB-BUILD, CHIP-FEE-GUARD,
CHIP-HUB-LINKS, CHIP-HUB-NAV, each with exact file ownership). Plus from the
findings: **CHIP-COPYLINK-FIX** (implementation, low tier — owns the three
named `.tsx` files, or all 45 if the `origin` cleanup rides along; no other
files). Model recommendations are in the spec table per the standing
memory rule.

### 4. Harness improvements

- **My worktree predates the command-center docs.** `docs/CHIP-PROTOCOL.md`,
  the new `CLAUDE.md`, `ROADMAP.md`, and rulings D-001+ do not exist at my
  branch point (6db616d); I read them from the main checkout, read-only. The
  protocol's "your copy may predate the ruling" note covers DECISIONS.md but
  not the protocol file itself being absent. Suggest: spawn chips from a
  commit that includes the protocol, or state in the spawn prompt that the
  docs must be read from the main checkout path.
- The spawn prompt told me to create `docs/specs/` and `docs/notes/` files
  but neither directory existed in my worktree — fine, I created them, but a
  chip with a stricter reading of "write only the named files" might have
  stalled on whether `mkdir` counts. Cheap to pre-create the dirs.

### 5. Model tier feedback

Fable/high was right for this: the value was in rejecting two plausible
architectures and finding the cannibalization trap, not in the writing.
A lower tier would likely have produced a workable adapter design but
missed the quick-mode URL-state clobbering and the blog-collision issue,
both of which change the sequencing.
