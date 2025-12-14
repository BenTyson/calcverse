# Calcverse Architecture

## Directory Structure

```
calcverse/
├── src/
│   ├── components/
│   │   ├── calculators/          # React calculator components
│   │   │   ├── FreelancerRateCalc.tsx
│   │   │   ├── YouTubeAdSenseCalc.tsx
│   │   │   └── SideHustleGoalCalc.tsx
│   │   ├── ui/
│   │   │   ├── inputs/           # Reusable input components
│   │   │   │   ├── NumberInput.tsx
│   │   │   │   ├── CurrencyInput.tsx
│   │   │   │   ├── SliderInput.tsx
│   │   │   │   └── DropdownInput.tsx
│   │   │   └── results/          # Reusable result components
│   │   │       ├── ResultCard.tsx
│   │   │       └── ResultBreakdown.tsx
│   │   ├── calculator/           # Calculator wrapper components
│   │   │   ├── ShareButtons.astro
│   │   │   ├── EmbedCodeGenerator.astro
│   │   │   └── RelatedCalculators.astro
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   └── Footer.astro
│   │   └── seo/
│   │       └── SchemaOrg.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Site-wide layout
│   │   ├── CalculatorLayout.astro # Calculator pages
│   │   └── EmbedLayout.astro     # Embed pages (minimal)
│   ├── lib/
│   │   ├── calculators/          # Pure calculation logic
│   │   │   ├── freelancer-rate.ts
│   │   │   ├── youtube-adsense.ts
│   │   │   └── side-hustle-goal.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts     # Number/currency formatting
│   │   │   └── url-state.ts      # URL state encoding
│   │   └── seo/
│   │       └── schema.ts         # Schema.org generators
│   ├── pages/
│   │   ├── index.astro           # Homepage
│   │   ├── freelance/
│   │   │   ├── index.astro       # Category page
│   │   │   └── hourly-rate-calculator.astro
│   │   ├── creator/
│   │   │   ├── index.astro
│   │   │   └── youtube-adsense-calculator.astro
│   │   ├── side-hustle/
│   │   │   ├── index.astro
│   │   │   └── time-to-goal-calculator.astro
│   │   └── embed/
│   │       └── [...slug].astro   # Embed routes
│   └── styles/
│       └── global.css            # Tailwind + custom theme
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── og-images/                # Social share images
├── docs/
│   ├── CALCVERSE.md              # Project overview
│   └── session-start/            # Agent documentation
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## Key Patterns

### 1. Calculator Architecture

Each calculator has 3 parts:

```
1. Logic (src/lib/calculators/*.ts)
   - Pure TypeScript functions
   - Input/output interfaces
   - Default values
   - No React, no side effects

2. UI Component (src/components/calculators/*.tsx)
   - React component
   - Uses reusable inputs from ui/inputs/
   - Manages state with useState
   - Syncs state to URL via url-state.ts

3. Page (src/pages/[category]/[calculator].astro)
   - Uses CalculatorLayout
   - Passes FAQs and related calculators
   - Mounts React component with client:load
```

### 2. URL State Sharing

Results are shareable via URL parameters:

```typescript
// src/lib/utils/url-state.ts

// Encode state to URL
const encoded = btoa(JSON.stringify(state));
url.searchParams.set('s', encoded);

// Decode state from URL
const decoded = JSON.parse(atob(encoded));
```

Every calculator:
1. Reads initial state from URL on mount
2. Updates URL when state changes
3. Generates shareable links with state

### 3. SEO Infrastructure

Each calculator page has:
- Title: "[Name] - Free [Use Case] Calculator"
- Meta description
- Canonical URL
- Open Graph tags
- Schema.org WebApplication markup
- Schema.org FAQPage markup
- Breadcrumb schema

```typescript
// src/lib/seo/schema.ts
generateWebApplicationSchema({ name, description, url, category })
generateFAQSchema([{ question, answer }])
generateBreadcrumbSchema([{ name, url }])
```

### 4. Embed System

Every calculator has an embeddable version:
- URL: `/embed/[category]/[calculator]`
- Uses minimal EmbedLayout (no header/footer)
- Excluded from sitemap
- Embed code generated on each calculator page

### 5. Component Reusability

**Input Components** (`src/components/ui/inputs/`):
- `NumberInput` - Basic number with prefix/suffix
- `CurrencyInput` - Dollar-formatted input
- `SliderInput` - Range slider with formatted value
- `DropdownInput` - Select dropdown

All inputs follow the same pattern:
```typescript
interface Props {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  helpText?: string;
}
```

**Result Components** (`src/components/ui/results/`):
- `ResultCard` - Single result with label, value, description
- `ResultBreakdown` - Table of line items

## Configuration Files

### astro.config.mjs
```javascript
export default defineConfig({
  site: 'https://calcverse.example.com',  // Update when domain set
  integrations: [react(), sitemap({ filter: ... })],
  vite: { plugins: [tailwindcss()] },
});
```

### tsconfig.json
Path aliases configured:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@lib/*` → `src/lib/*`
- `@layouts/*` → `src/layouts/*`

### Tailwind (src/styles/global.css)
Custom brand colors defined in `@theme`:
- `brand-50` through `brand-900` (blue scale)

## Build Output

```
dist/
├── _astro/           # JS bundles (~60KB gzipped total)
├── [pages]/          # Static HTML
├── sitemap-*.xml     # Auto-generated
├── robots.txt
└── og-images/
```

Total build size: ~460KB
