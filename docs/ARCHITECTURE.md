# CalcFalcon Architecture

## Directory Structure

```
calcfalcon/
├── src/
│   ├── components/
│   │   ├── calculators/          # React calculator components (33)
│   │   ├── ui/
│   │   │   ├── ErrorBoundary.tsx # Error boundary wrapper
│   │   │   ├── Tooltip.tsx      # Accessible hover/focus tooltip
│   │   │   ├── inputs/           # Reusable input components
│   │   │   │   ├── NumberInput.tsx
│   │   │   │   ├── CurrencyInput.tsx
│   │   │   │   ├── SliderInput.tsx
│   │   │   │   ├── DropdownInput.tsx
│   │   │   │   └── ModeToggle.tsx
│   │   │   ├── results/
│   │   │   │   ├── ResultCard.tsx        # Supports count-up via numericValue/formatFn
│   │   │   │   ├── ResultBreakdown.tsx   # label accepts ReactNode (for Tooltip)
│   │   │   │   └── CopyResultsButton.tsx # Clipboard copy with Lucide icons
│   │   │   └── charts/
│   │   │       ├── ChartCard.tsx          # Wrapper card with title
│   │   │       ├── DonutChart.tsx         # Pie/donut breakdowns
│   │   │       ├── BarComparisonChart.tsx # Side-by-side or stacked bars
│   │   │       └── ProjectionChart.tsx    # Area/line with goal line
│   │   ├── monetization/
│   │   │   ├── AdSlot.astro             # CLS-safe ad placeholders
│   │   │   ├── EmailCapture.tsx         # React email form (inline/compact)
│   │   │   ├── AffiliateCard.astro      # Partner recommendation card
│   │   │   └── AffiliateDisclosure.astro # FTC disclosure text
│   │   ├── calculator/           # Astro wrapper components
│   │   │   ├── ShareButtons.astro
│   │   │   ├── EmbedCodeGenerator.astro
│   │   │   └── RelatedCalculators.astro
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   └── Footer.astro
│   │   └── seo/
│   │       └── SchemaOrg.astro
│   ├── content/
│   │   └── blog/                  # Markdown articles (8)
│   ├── content.config.ts          # Content Collections schema (glob loader)
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Site-wide (skip-to-content, fonts, meta, ogType)
│   │   ├── BlogLayout.astro      # Blog articles (breadcrumbs, category badge, read time, CTA)
│   │   ├── CalculatorLayout.astro # Calculator pages (breadcrumbs, share, FAQs)
│   │   └── EmbedLayout.astro     # Embed pages (minimal, noindex)
│   ├── hooks/
│   │   ├── useCalculatorState.ts # Shared mode/inputs/URL state hook (all 33 calcs)
│   │   └── useCountUp.ts         # rAF count-up animation hook
│   ├── lib/
│   │   ├── calculators/          # Pure calculation logic (33 files)
│   │   ├── config/
│   │   │   └── monetization.ts   # Affiliate URLs, AdSense publisher ID
│   │   ├── utils/
│   │   │   ├── formatters.ts     # formatCurrency, formatNumber, formatPercent, etc.
│   │   │   ├── url-state.ts      # getInitialState, updateUrlState, getInitialMode
│   │   │   ├── chart-colors.ts   # getCategoryColors(), ChartCategory type
│   │   │   └── category-styles.ts # CATEGORY_GRADIENTS, CATEGORY_GLOWS, CATEGORY_COLORS
│   │   └── seo/
│   │       └── schema.ts         # Schema.org generators
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── privacy.astro
│   │   ├── terms.astro
│   │   ├── blog/
│   │   │   ├── index.astro       # Blog listing
│   │   │   └── [slug].astro      # Article pages (from Content Collections)
│   │   ├── api/
│   │   │   └── subscribe.ts      # SSR endpoint (prerender = false)
│   │   ├── freelance/            # 1 index + 8 calculators
│   │   ├── creator/              # 1 index + 9 calculators
│   │   ├── gig-economy/          # 1 index + 7 calculators
│   │   ├── side-hustle/          # 1 index + 5 calculators
│   │   ├── personal-finance/     # 1 index + 4 calculators
│   │   └── embed/
│   │       └── [...slug].astro   # All 33 embed routes
│   └── styles/
│       └── global.css            # Tailwind config + design system
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── og-images/
│   └── downloads/                # Lead magnets (PDFs)
├── astro.config.mjs
├── railway.json
├── tsconfig.json
└── CLAUDE.md
```

## 3-Layer Calculator Pattern

```
Logic (pure TS)          →  UI (React)               →  Page (Astro)
src/lib/calculators/         src/components/calculators/   src/pages/[cat]/[slug].astro

- Input/output types     →  - useCalculatorState hook →  - CalculatorLayout wrapper
- DEFAULT_INPUTS         →  - ErrorBoundary wrapper   →  - FAQs array
- calculate*() function  →  - Shared input components →  - relatedCalculators array
- No React, no DOM       →  - ModeToggle (Quick/Adv)  →  - client:visible directive
                         →                             →  - SEO props
```

## URL State

```typescript
// State encoded as base64 in ?s= parameter
const encoded = btoa(JSON.stringify(inputs));
url.searchParams.set('s', encoded);

// Mode stored separately
url.searchParams.set('mode', 'advanced'); // omit for 'quick'
```

Every calculator reads state from URL on mount and updates URL on input change.

## SEO Infrastructure

Each calculator page generates:
- `<title>`, `<meta description>`, canonical URL, OG tags
- Schema.org: WebApplication + FAQPage + BreadcrumbList
- Sitemap inclusion (embeds excluded)

```typescript
// src/lib/seo/schema.ts
generateWebApplicationSchema({ name, description, url, category })
generateFAQSchema([{ question, answer }])
generateBreadcrumbSchema([{ name, url }])
generateArticleSchema({ headline, description, url, publishedDate, updatedDate?, category })
```

## Embed System

Every calculator has an embeddable version at `/embed/[category]/[slug]`:
- Minimal layout (no header/footer)
- `noindex, nofollow`
- `client:load` (immediate hydration for iframe context)
- Embed code generator on each calculator page

## Component API

### Input Components

All inputs follow this pattern:
```typescript
{
  id: string;        // HTML id + aria-describedby prefix
  label: string;     // Label text
  value: number;     // Controlled value
  onChange: (v) => void;
  helpText?: string; // Linked via aria-describedby="{id}-help"
}
```

### Result Components

- `ResultCard`: Single result with `label`, `value`, `description`, `category` (for color), `highlight` (for emphasis), `size` ("sm" | "lg")
- `ResultBreakdown`: List of `{ label, value, highlight? }` items with `title` and `category`

### Chart Components

All charts use Recharts, category-aware colors from `chart-colors.ts`, and `formatCurrency` tooltips.

- `DonutChart`: `data: {label, value}[]`, `category`, `innerLabel`, `innerValue`. Filters out zero values.
- `BarComparisonChart`: `data: {label, ...keys}[]`, `bars: {dataKey, label}[]`, `stacked?: boolean`. Side-by-side or stacked.
- `ProjectionChart`: `data: {label, ...keys}[]`, `lines: {dataKey, label, areaFill?, dashed?}[]`, `goalLine?: {value, label}`.
- `ChartCard`: Wrapper with `title`, `description?`, `category?`.

### ModeToggle

Renders as `role="radiogroup"` with `role="radio"` + `aria-checked` buttons.

## Configuration

### astro.config.mjs
```javascript
site: 'https://calcfalcon.com'
adapter: node({ mode: 'standalone' })  // For SSR endpoints
integrations: [react(), sitemap({ filter: excludes /embed/ })]
vite: { plugins: [tailwindcss()] }
```

Pages default to static (prerendered). Individual pages opt out with `export const prerender = false` for SSR.

### Path Aliases (tsconfig.json)
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@lib/*` → `src/lib/*`
- `@layouts/*` → `src/layouts/*`

### railway.json
```json
{ "deploy": { "startCommand": "node ./dist/server/entry.mjs" } }
```

Note: Start command changed from `npx serve` to node server entry for SSR support.

### Environment Variables
- `RESEND_API_KEY` — Resend API key for email capture
- `RESEND_AUDIENCE_ID` — Resend audience ID for contact list

## Build Output

84 prerendered HTML pages + 1 SSR endpoint in `dist/`. Auto-generated sitemap at `/sitemap-index.xml` (embeds excluded).
