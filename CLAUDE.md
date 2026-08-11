# CalcFalcon

SEO-driven calculator site for freelancers, creators, and gig workers. Generates passive income via display ads + affiliates.

**Domain:** calcfalcon.com
**Stack:** Astro 5 (SSG + SSR hybrid) + React 19 + Tailwind CSS 4
**Hosting:** Railway (auto-deploy from main)
**Live:** 45 calculators, 141 pages (95 indexable + 45 embeds + 1 SSR), 6 sections (5 calculator categories + blog)

## Commands

```bash
npm run dev             # localhost:4321
npm run build           # Must pass before work is complete
npm run preview         # Preview production build
npm run check:tax-data  # Guard against stale IRS/SSA figures — must pass too
```

## Architecture (3-Layer Pattern)

Every calculator has 3 files:

| Layer | Path | What |
|-------|------|------|
| Logic | `src/lib/calculators/*.ts` | Pure functions, types, `DEFAULT_INPUTS` |
| UI | `src/components/calculators/*.tsx` | React component, wraps in `<ErrorBoundary>`, uses shared inputs |
| Page | `src/pages/[category]/[slug].astro` | Astro wrapper with `CalculatorLayout`, uses `client:visible` |

**Shared inputs:** `NumberInput`, `CurrencyInput`, `SliderInput`, `DropdownInput`, `ModeToggle` (in `src/components/ui/inputs/`)
**Shared results:** `ResultCard`, `ResultBreakdown`, `CopyResultsButton` (in `src/components/ui/results/`)
**Shared charts:** `DonutChart`, `BarComparisonChart`, `ProjectionChart`, `ChartCard` (in `src/components/ui/charts/`)
**Shared UI:** `Tooltip` (in `src/components/ui/Tooltip.tsx`)
**Hooks:** `useCalculatorState` (in `src/hooks/useCalculatorState.ts`), `useCountUp` (in `src/hooks/useCountUp.ts`)
**URL state:** Base64-encoded in `?s=` param, mode in `?mode=` param
**Embeds:** `/embed/[category]/[slug]` — uses `client:load` (not `client:visible`), minimal layout, noindex

## Key Files

| Purpose | File |
|---------|------|
| Site config | `astro.config.mjs` (site: calcfalcon.com) |
| Base layout | `src/layouts/BaseLayout.astro` |
| Calculator layout | `src/layouts/CalculatorLayout.astro` |
| Blog layout | `src/layouts/BlogLayout.astro` |
| Embed layout | `src/layouts/EmbedLayout.astro` |
| Content config | `src/content.config.ts` |
| Design system | `src/styles/global.css` |
| SEO schemas | `src/lib/seo/schema.ts` |
| URL state | `src/lib/utils/url-state.ts` |
| Formatters | `src/lib/utils/formatters.ts` |
| Error boundary | `src/components/ui/ErrorBoundary.tsx` |
| Chart colors | `src/lib/utils/chart-colors.ts` |
| Category styles | `src/lib/utils/category-styles.ts` |
| Shared tax brackets | `src/lib/calculators/shared/tax-brackets.ts` |
| Shared mileage rates | `src/lib/calculators/shared/mileage-rates.ts` |
| Stale tax-data guard | `scripts/check-tax-data.mjs` |
| Calculator state hook | `src/hooks/useCalculatorState.ts` |
| Embed routes | `src/pages/embed/[...slug].astro` |
| Monetization config | `src/lib/config/monetization.ts` |
| Email API endpoint | `src/pages/api/subscribe.ts` (SSR, `prerender = false`, uses Sparrow API) |
| Ad slots | `src/components/monetization/AdSlot.astro` |
| Email capture | `src/components/monetization/EmailCapture.tsx` |
| Affiliate card | `src/components/monetization/AffiliateCard.astro` |
| Analytics | `src/lib/utils/analytics.ts` (Umami event tracking helper) |
| Manual tasks | `docs/ben.md` |
| OG image converter | `scripts/convert-og-images.mjs` |
| PWA manifest | `public/manifest.json` |
| Service worker | `public/sw.js` |
| Ads.txt | `public/ads.txt` (IAB ads.txt for ad buyers) |

## Design System

- **Primary:** Electric Cyan (#06b6d4) — use `primary-*` classes
- **Categories:** Freelance=`freelance-*` (Cyan), Creator=`creator-*` (Magenta), Gig=`gig-*` (Emerald), SideHustle=`sidehustle-*` (Purple), Finance=`finance-*` (Amber)
- **Font:** Inter (self-hosted WOFF2)
- **Cards:** `card-elevated`, `card-elevated-lg`
- **Gradients:** `text-gradient`, `bg-gradient-[category]`
- **NEVER** use `brand-*` classes — they don't exist. Use `primary-*` instead.

## Rules

- All calculators must have Quick/Advanced mode via `ModeToggle`
- All calculator `.tsx` files must wrap return JSX in `<ErrorBoundary>`
- Calculator pages use `client:visible`. Only embeds use `client:load`.
- All inputs should have `aria-describedby` linking to helpText
- `npm run build` must pass with 0 errors before work is considered done
- `npm run check:tax-data` must pass with 0 errors before work is considered done
- Never hardcode domain URLs — use `Astro.site` with `https://calcfalcon.com` fallback
- Never hardcode an IRS/SSA figure — import it (see **Tax Data** below)
- Run `/update-phase` after completing any roadmap phase
- Run `/add-calculator` when adding a new calculator (full guided workflow)

## Tax Data

This is YMYL content. Wrong tax figures are the single highest-risk defect on
this site — AdSense rejected the domain for "Low value content" while the
calculators were computing on 2024 data under 2026 headings.

**Current state:** TY2026, verified 2026-08-09 against IRS Rev. Proc. 2025-32,
IRS Notice 2025-67, IRS Notice 2026-10 + Announcement 2026-11, and the SSA
OASDI base determination. Full citations live at the top of
`src/lib/calculators/shared/tax-brackets.ts`.

### Rules

1. **Never hardcode an IRS/SSA figure.** Not in `.ts`, not in `.tsx`, not in
   `.astro` page copy. Import from `shared/tax-brackets.ts` or
   `shared/mileage-rates.ts`. If the figure isn't there yet, add it there with a
   citation. `npm run check:tax-data` enforces this.
2. **Never pass `taxYear` / `lastVerified` as string literals** to
   `SourcesBlock`. Import `TAX_YEAR` and `TAX_DATA_LAST_VERIFIED` so one edit
   updates every page.
3. **Every figure comes from a primary source you actually fetched** —
   irs.gov, ssa.gov, or the Federal Register. Never from memory, never from a
   tax-prep blog, never by applying an inflation factor to last year's number.
   If you can't verify it, leave the old value and say so. A stale figure that
   is labeled is far less harmful than a confident wrong one.
4. **Cite only URLs you loaded in that session.** A citation you didn't open is
   worse than no citation.
5. **Some figures are NOT inflation-indexed** and must not be "corrected":
   NIIT thresholds ($200k/$250k/$125k) and Additional Medicare Tax thresholds
   are fixed in statute. Both are commented as such in the module.
6. **Check for legislative change, not just inflation.** Re-indexing last
   year's shape is not enough — OBBBA (Pub. L. 119-21) changed the standard
   deduction base and added a §199A minimum deduction. Verify current law.
7. **Body copy counts.** Worked examples in `.astro` prose and FAQ answers are
   where stale numbers hide — the build never catches them. Compute worked
   examples by *running the calculator*, not by hand.

### Annual update procedure (~1 hour, do it each autumn)

1. Fetch the new IRS Revenue Procedure (published ~October for the next tax
   year) and the SSA OASDI base determination. Read them; don't trust summaries.
2. Update `shared/tax-brackets.ts` + `shared/mileage-rates.ts`, bump `TAX_YEAR`
   and `TAX_DATA_LAST_VERIFIED`, and refresh the source comment block.
3. **Move the superseded values into the `SUPERSEDED` denylist in
   `scripts/check-tax-data.mjs`.** This is what makes the guard stronger every
   year instead of decaying.
4. Verify: the bracket arrays must reproduce the Rev. Proc.'s own cumulative
   "$X plus Y% of the excess" constants. If all of them match, every threshold
   is right.
5. Update the `sources` array on each page with a `SourcesBlock`.
6. Run `npm run build` and `npm run check:tax-data`.
7. Work the blog backlog — see `docs/BLOG-TAX-AUDIT.md`.

### Known gaps (not modeled)

- QBI is a flat 20% with no phase-out or SSTB limit; over-states the deduction
  for service businesses above the threshold.
- OBBBA §199A minimum deduction ($400) not applied.
- "No tax on tips" (up to $25,000, TY2025–2028) not modeled — this affects the
  gig calculators, which currently over-state tax for tipped workers.
- "No tax on overtime" (up to $12,500 / $25,000 joint) not modeled.

## Docs

| Doc | When to read |
|-----|-------------|
| `docs/STATUS.md` | Current state, what's live, what's next |
| `docs/ARCHITECTURE.md` | Deep technical reference |
| `docs/REVENUE-ROADMAP.md` | Revenue phases R1-R9 (affiliate, email, PDF, B2B, SEO, sponsorships) |
| `/add-calculator` skill | Full guided workflow for adding calculators |
| `docs/BLOG-TAX-AUDIT.md` | Blog posts with stale tax figures (open backlog) |
| `docs/DECISIONS.md` | What's decided (don't re-debate) |
| `docs/ROADMAP.md` | Full implementation plan with phases |
| `docs/CALCULATOR-IDEAS.md` | Backlog of calculator ideas |

## Analytics

**Provider:** Umami (self-hosted at umami-production-3685.up.railway.app)
- Website ID: 789f1a13-f7d2-4a67-8888-2b5934ba4a94
- Script: Loaded in `src/layouts/BaseLayout.astro` (PROD-gated, lines 65–67)
- Event tracking: Use `src/lib/utils/analytics.ts` `track()` helper
