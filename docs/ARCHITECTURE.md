# CalcFalcon Architecture

## Directory Structure

```
calcfalcon/
├── src/
│   ├── components/
│   │   ├── calculators/          # React calculator components (16)
│   │   ├── ui/
│   │   │   ├── ErrorBoundary.tsx # Error boundary wrapper
│   │   │   ├── inputs/           # Reusable input components
│   │   │   │   ├── NumberInput.tsx
│   │   │   │   ├── CurrencyInput.tsx
│   │   │   │   ├── SliderInput.tsx
│   │   │   │   ├── DropdownInput.tsx
│   │   │   │   └── ModeToggle.tsx
│   │   │   └── results/
│   │   │       ├── ResultCard.tsx
│   │   │       └── ResultBreakdown.tsx
│   │   ├── calculator/           # Astro wrapper components
│   │   │   ├── ShareButtons.astro
│   │   │   ├── EmbedCodeGenerator.astro
│   │   │   └── RelatedCalculators.astro
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   └── Footer.astro
│   │   └── seo/
│   │       └── SchemaOrg.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Site-wide (skip-to-content, fonts, meta)
│   │   ├── CalculatorLayout.astro # Calculator pages (breadcrumbs, share, FAQs)
│   │   └── EmbedLayout.astro     # Embed pages (minimal, noindex)
│   ├── lib/
│   │   ├── calculators/          # Pure calculation logic (16 files)
│   │   ├── utils/
│   │   │   ├── formatters.ts     # formatCurrency, formatNumber, formatPercent, etc.
│   │   │   └── url-state.ts      # getInitialState, updateUrlState, getInitialMode
│   │   └── seo/
│   │       └── schema.ts         # Schema.org generators
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── privacy.astro
│   │   ├── terms.astro
│   │   ├── freelance/            # 1 index + 4 calculators
│   │   ├── creator/              # 1 index + 7 calculators
│   │   ├── gig-economy/          # 1 index + 4 calculators
│   │   ├── side-hustle/          # 1 index + 1 calculator
│   │   └── embed/
│   │       └── [...slug].astro   # All 16 embed routes
│   └── styles/
│       └── global.css            # Tailwind config + design system
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── og-images/
├── astro.config.mjs
├── railway.json
├── tsconfig.json
└── CLAUDE.md
```

## 3-Layer Calculator Pattern

```
Logic (pure TS)          →  UI (React)               →  Page (Astro)
src/lib/calculators/         src/components/calculators/   src/pages/[cat]/[slug].astro

- Input/output types     →  - useState + useEffect    →  - CalculatorLayout wrapper
- DEFAULT_INPUTS         →  - ErrorBoundary wrapper   →  - FAQs array
- calculate*() function  →  - Shared input components →  - relatedCalculators array
- No React, no DOM       →  - URL state sync          →  - client:visible directive
                         →  - ModeToggle (Quick/Adv)  →  - SEO props
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

### ModeToggle

Renders as `role="radiogroup"` with `role="radio"` + `aria-checked` buttons.

## Configuration

### astro.config.mjs
```javascript
site: 'https://calcfalcon.com'
integrations: [react(), sitemap({ filter: excludes /embed/ })]
vite: { plugins: [tailwindcss()] }
```

### Path Aliases (tsconfig.json)
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@lib/*` → `src/lib/*`
- `@layouts/*` → `src/layouts/*`

### railway.json
```json
{ "deploy": { "startCommand": "npx serve dist -l 3000" } }
```

## Build Output

40 static HTML pages in `dist/`. Auto-generated sitemap at `/sitemap-index.xml`.
