# Calcverse Architecture

## Directory Structure

```
calcverse/
├── src/
│   ├── components/
│   │   ├── calculators/          # React calculator components (16)
│   │   │   ├── FreelancerRateCalc.tsx
│   │   │   ├── QuarterlyTaxCalc.tsx
│   │   │   ├── W2vs1099Calc.tsx
│   │   │   ├── ProjectRateCalc.tsx
│   │   │   ├── YouTubeAdSenseCalc.tsx
│   │   │   ├── TwitchRevenueCalc.tsx
│   │   │   ├── PodcastSponsorshipCalc.tsx
│   │   │   ├── PatreonCalc.tsx
│   │   │   ├── KofiCalc.tsx
│   │   │   ├── EtsyFeesCalc.tsx
│   │   │   ├── SubstackCalc.tsx
│   │   │   ├── DoorDashCalc.tsx
│   │   │   ├── UberLyftCalc.tsx
│   │   │   ├── InstacartCalc.tsx
│   │   │   ├── AirbnbProfitCalc.tsx
│   │   │   └── SideHustleGoalCalc.tsx
│   │   ├── ui/
│   │   │   ├── inputs/           # Reusable input components
│   │   │   │   ├── NumberInput.tsx
│   │   │   │   ├── CurrencyInput.tsx
│   │   │   │   ├── SliderInput.tsx
│   │   │   │   ├── DropdownInput.tsx
│   │   │   │   └── ModeToggle.tsx     # Quick/Advanced toggle
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
│   │   ├── calculators/          # Pure calculation logic (16)
│   │   │   ├── freelancer-rate.ts
│   │   │   ├── quarterly-tax.ts
│   │   │   ├── w2-vs-1099.ts
│   │   │   ├── project-rate.ts
│   │   │   ├── youtube-adsense.ts
│   │   │   ├── twitch-revenue.ts
│   │   │   ├── podcast-sponsorship.ts
│   │   │   ├── patreon-earnings.ts
│   │   │   ├── kofi-earnings.ts
│   │   │   ├── etsy-fees.ts
│   │   │   ├── substack-revenue.ts
│   │   │   ├── doordash-earnings.ts
│   │   │   ├── uber-lyft-earnings.ts
│   │   │   ├── instacart-earnings.ts
│   │   │   ├── airbnb-profit.ts
│   │   │   └── side-hustle-goal.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts     # Number/currency formatting
│   │   │   └── url-state.ts      # URL state encoding + mode
│   │   └── seo/
│   │       └── schema.ts         # Schema.org generators
│   ├── pages/
│   │   ├── index.astro           # Homepage
│   │   ├── privacy.astro         # Privacy Policy (AdSense req)
│   │   ├── terms.astro           # Terms of Service (AdSense req)
│   │   ├── freelance/
│   │   │   ├── index.astro       # Category page
│   │   │   ├── hourly-rate-calculator.astro
│   │   │   ├── quarterly-tax-calculator.astro
│   │   │   ├── w2-vs-1099-calculator.astro
│   │   │   └── project-rate-calculator.astro
│   │   ├── creator/
│   │   │   ├── index.astro
│   │   │   ├── youtube-adsense-calculator.astro
│   │   │   ├── twitch-calculator.astro
│   │   │   ├── podcast-calculator.astro
│   │   │   ├── patreon-calculator.astro
│   │   │   ├── kofi-calculator.astro
│   │   │   ├── etsy-fee-calculator.astro
│   │   │   └── substack-calculator.astro
│   │   ├── gig-economy/
│   │   │   ├── index.astro
│   │   │   ├── doordash-calculator.astro
│   │   │   ├── uber-lyft-calculator.astro
│   │   │   ├── instacart-calculator.astro
│   │   │   └── airbnb-calculator.astro
│   │   ├── side-hustle/
│   │   │   ├── index.astro
│   │   │   └── time-to-goal-calculator.astro
│   │   └── embed/
│   │       └── [...slug].astro   # Embed routes (16 calculators)
│   └── styles/
│       └── global.css            # Tailwind + custom theme
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── og-images/                # Social share images
├── docs/
│   ├── CALCVERSE.md              # Project overview
│   └── session-start/            # Agent documentation
├── astro.config.mjs              # Site config (production URL set)
├── railway.json                  # Railway deployment config
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

// Mode (Quick/Advanced) is also stored in URL
url.searchParams.set('mode', 'advanced'); // or omit for 'quick'
```

Every calculator:
1. Reads initial state from URL on mount
2. Updates URL when state changes
3. Generates shareable links with state
4. Persists Quick/Advanced mode preference in URL

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
  site: 'https://calcverse-production.up.railway.app',  // Production URL
  integrations: [react(), sitemap({ filter: ... })],
  vite: { plugins: [tailwindcss()] },
});
```

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npx serve dist -l 3000",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100
  }
}
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
├── _astro/           # JS bundles
├── [pages]/          # Static HTML (39 pages total)
├── sitemap-*.xml     # Auto-generated
├── robots.txt
└── og-images/
```

**39 pages total:**
- 1 homepage
- 4 category index pages
- 16 calculator pages
- 16 embed pages
- 2 legal pages (privacy, terms)
