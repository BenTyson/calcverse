# CalcFalcon

SEO-driven calculator site for freelancers, creators, and gig workers. Generates passive income via display ads + affiliates.

**Domain:** calcfalcon.com
**Stack:** Astro 5 (SSG + SSR hybrid) + React 19 + Tailwind CSS 4
**Hosting:** Railway (auto-deploy from main)
**Live:** 41 calculators, 125 pages (83 indexable + 41 embeds + 1 SSR), 6 sections (5 calculator categories + blog)

## Commands

```bash
npm run dev      # localhost:4321
npm run build    # Must pass before work is complete
npm run preview  # Preview production build
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
| Calculator state hook | `src/hooks/useCalculatorState.ts` |
| Embed routes | `src/pages/embed/[...slug].astro` |
| Monetization config | `src/lib/config/monetization.ts` |
| Email API endpoint | `src/pages/api/subscribe.ts` (SSR, `prerender = false`) |
| Ad slots | `src/components/monetization/AdSlot.astro` |
| Email capture | `src/components/monetization/EmailCapture.tsx` |
| Affiliate card | `src/components/monetization/AffiliateCard.astro` |
| Manual tasks | `docs/ben.md` |

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
- Never hardcode domain URLs — use `Astro.site` with `https://calcfalcon.com` fallback
- Run `/update-phase` after completing any roadmap phase
- Run `/add-calculator` when adding a new calculator (full guided workflow)

## Docs

| Doc | When to read |
|-----|-------------|
| `docs/STATUS.md` | Current state, what's live, what's next |
| `docs/ARCHITECTURE.md` | Deep technical reference |
| `/add-calculator` skill | Full guided workflow for adding calculators |
| `docs/DECISIONS.md` | What's decided (don't re-debate) |
| `docs/ROADMAP.md` | Full implementation plan with phases |
| `docs/CALCULATOR-IDEAS.md` | Backlog of calculator ideas |
