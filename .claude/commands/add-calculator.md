Add a new calculator to CalcFalcon. Follow every step — do not skip any.

## Step 0: Gather Requirements

Before writing any code, confirm ALL of the following with the user (or extract from their prompt). Do not assume — ask if unclear.

### Required info:
1. **Calculator name** — e.g., "TaskRabbit Earnings"
2. **Category** — Freelance, Creator, Gig Economy, Side Hustle, or Personal Finance
3. **Page slug** — e.g., `taskrabbit-calculator` (convention: `[name]-calculator`)
4. **All inputs** with default values, min/max, and step
5. **Quick mode inputs** (2-4 fields) vs **Advanced additions** (3-6 more fields)
6. **Calculation logic** — all formulas, constants, edge cases
7. **Results to display** — which is the primary (highlighted, count-up)? Which are secondary? Which are small cards?
8. **Breakdown items** — ordered list with deduction markers
9. **Tooltip(s)** — which financial term(s) need explanation? What text?
10. **Chart** — does this calculator benefit from a chart? If so, which type:
    - `DonutChart` — for fee/revenue splits (e.g., Etsy fees, Ko-fi breakdown)
    - `BarComparisonChart` — for side-by-side or stacked comparisons (e.g., W2 vs 1099, quarterly payments)
    - `ProjectionChart` — for growth over time or goal tracking (e.g., FIRE, Side Hustle Goal)
    - None — simpler calculators (e.g., DoorDash, Uber/Lyft) work fine without charts
11. **Tip box** — what actionable advice goes in the colored tip box? (tax tip, pro tip, rate tip, etc.)
12. **FAQs** — 4 questions with answers (SEO-focused, match "People Also Ask" queries)
13. **Related calculators** — 3-5 cross-links (mix of same-category and cross-category)
14. **SEO title** — under 60 chars, format: "[Name] Calculator - [Value Prop]"
15. **SEO description** — under 160 chars, mentions key outputs

### Decide based on similar calculators:
- **Scope**: Weekly (like DoorDash, Amazon Flex) or Monthly (like Airbnb, Turo)?
- **Input types needed**: CurrencyInput, NumberInput, SliderInput, DropdownInput?
- **Model calculator**: Which existing calc is closest in structure? Read it first.

## Step 1: Read the Model Calculator

Before writing code, read the model calculator's 3 files (logic, UI, page) to match patterns exactly. The model should be the existing calculator most similar in structure.

**Category defaults:**
- Freelance → FreelancerRateCalc or QuarterlyTaxCalc
- Creator → EtsyFeesCalc or YouTubeAdSenseCalc
- Gig Economy → DoorDashCalc (weekly) or AirbnbProfitCalc (monthly)
- Side Hustle → SideHustleGoalCalc
- Personal Finance → FireCalc or SubscriptionAuditCalc

Read all 3 files of the chosen model:
- `src/lib/calculators/[model].ts`
- `src/components/calculators/[Model]Calc.tsx`
- `src/pages/[category]/[model]-calculator.astro`

## Step 2: Create Logic File

**File:** `src/lib/calculators/[name].ts`

Must include:
- `export interface [Name]Inputs { ... }` — all input fields with types
- `export interface [Name]Results { ... }` — all computed results + breakdown array
- `export const DEFAULT_INPUTS: [Name]Inputs = { ... }` — sensible defaults
- `export function calculate[Name](inputs: [Name]Inputs): [Name]Results { ... }` — pure function
- If using DropdownInput, also export the options array: `export const [OPTIONS_NAME] = [...]`

### Rules:
- Round all money outputs: `Math.round(value * 100) / 100`
- Round percentages to 1 decimal: `Math.round(value * 10) / 10`
- Round integer values: `Math.round(value)`
- Use `4.33` for weeks-per-month, `52` for weeks-per-year, `12` for months-per-year
- IRS mileage rate constant: `0.67` (if applicable)
- Break-even calculations use iteration (loop 1 to max), not algebra
- Breakdown array: `{ label: string; amount: number; isDeduction?: boolean }[]`
- No side effects, no DOM access, no imports beyond types

## Step 3: Create UI Component

**File:** `src/components/calculators/[Name]Calc.tsx`

### Structure (copy from model, adapt):

```
imports (React, ErrorBoundary, inputs, results, Tooltip, calc function, formatters, url-state)

export function [Name]Calc() {
  // State: mode, inputs (from url-state)
  // Compute: results
  // Effect: sync url-state
  // Helper: updateInput generic
  // Helper: getResultsText (for CopyResultsButton)

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Mode Toggle + quick mode description */}
        {/* Input grid (md:grid-cols-2) with section headers */}
        {/* Results section (border-t) */}
        {/*   - CopyResultsButton */}
        {/*   - Primary results grid (sm:grid-cols-3) */}
        {/*   - Chart (if applicable, in ChartCard) */}
        {/*   - Detail grid (md:grid-cols-2): ResultBreakdown + small cards + tip box */}
        {/*   - Quick mode footer with "Customize these" button */}
      </div>
    </ErrorBoundary>
  );
}
```

### Required patterns:
- `useState<'quick' | 'advanced'>(() => getInitialMode())`
- `useState<[Name]Inputs>(() => getInitialState(DEFAULT_INPUTS))`
- `useEffect(() => { updateUrlState(inputs, mode); }, [inputs, mode]);`
- Generic `updateInput` helper with `<K extends keyof [Name]Inputs>`
- `getResultsText()` returns multi-line string with calc name, key results, and canonical URL
- Advanced-only inputs wrapped in `{isAdvanced && ( ... )}`
- Primary ResultCard gets: `highlight`, `size="lg"`, `category="[cat]"`, `numericValue`, `formatFn`
- Tip box uses `bg-[cat]-50 rounded-xl p-4 text-sm text-[cat]-800`
- Quick mode footer shows defaults and links to advanced mode
- All inputs have `helpText` prop

### Chart integration (if applicable):
- Import the chart component and `ChartCard`
- If using category colors: `import { getCategoryColors } from '../../lib/utils/chart-colors'`
- Place chart between primary results and detail grid
- Wrap in `<ChartCard title="..." category="[cat]">`

### Tooltip integration:
- Import `Tooltip` from `../ui/Tooltip`
- Use in ResultBreakdown labels: `label: <Tooltip text="explanation">Term</Tooltip>`
- Keep tooltip text concise (1 sentence)

## Step 4: Create Astro Page

**File:** `src/pages/[category-slug]/[page-slug].astro`

Must include:
- `CalculatorLayout` with all props: title, description, calculatorName, category, categorySlug, slug, faqs, relatedCalculators
- Calculator component with `client:visible`
- `<Fragment slot="content">` with 3-4 paragraph "How to Use" section in `prose prose-neutral max-w-none`
- 4 FAQs (question + answer objects)
- 3-5 relatedCalculators (name, description, href, category)

### "How to Use" content guidelines:
- Paragraph 1: Quick mode — what to enter, typical ranges
- Paragraph 2: Advanced mode — what extra inputs do, why they matter
- Paragraph 3: Key insight — which result number matters most and why
- Paragraph 4: Practical advice — tax tips, strategy, optimization

### FAQ guidelines:
- Target "People Also Ask" queries for the platform/topic
- First FAQ: "How much does [platform] pay/take?"
- Include one FAQ about taxes/deductions
- Keep answers 2-4 sentences, factual, with specific numbers

### Category reference:

| Category | `category` prop | `categorySlug` prop | CSS prefix |
|----------|----------------|---------------------|------------|
| Freelance | "Freelance" | "freelance" | `freelance-*` |
| Creator | "Creator" | "creator" | `creator-*` |
| Gig Economy | "Gig Economy" | "gig-economy" | `gig-*` |
| Side Hustle | "Side Hustle" | "side-hustle" | `sidehustle-*` |
| Personal Finance | "Personal Finance" | "personal-finance" | `finance-*` |

## Step 5: Wire Up Embed Route

**File:** `src/pages/embed/[...slug].astro`

Make 4 edits:
1. Add import: `import { [Name]Calc } from '@components/calculators/[Name]Calc';`
2. Add to `getStaticPaths()`: `{ params: { slug: '[category-slug]/[page-slug]' } },`
3. Add to `calculators` record: `'[category-slug]/[page-slug]': { title: '[Calculator Name]', component: '[key]' },`
4. Add render: `{calculator.component === '[key]' && <[Name]Calc client:load />}`

Note: Embeds use `client:load`, NOT `client:visible`.

## Step 6: Update Category Index

**File:** `src/pages/[category-slug]/index.astro`

- Add to the `calculators` array: `{ name: '...', description: '...', href: '/...' }`
- If there's an `upcomingCalculators` array, remove this calculator from it
- If `upcomingCalculators` becomes empty, remove the entire "Coming Soon" section

## Step 7: Update Homepage Counts

**File:** `src/pages/index.astro`

- Update the category `count` in the `categories` array
- Update "X free calculators" in the hero badge
- Update "X free calculators" in the CTA section

## Step 8: Add Cross-Links

Update `relatedCalculators` in 2-3 **existing** calculator pages to link to the new one.

Choose calculators that are:
- Same category (most relevant)
- Cross-category but topically related (e.g., gig calc → quarterly tax)
- High-traffic pages that would benefit from internal linking

## Step 9: Build Verification

Run `npm run build` and confirm:
- 0 errors
- New page appears in build output
- New embed page appears in build output
- Page count increased correctly

## Step 10: Blog Article Consideration

After the calculator is built, evaluate whether a companion blog article should be created. If yes, add it to `docs/ROADMAP.md` under the appropriate phase, or note it for the user.

**Create a blog article when:**
- The topic has high search volume (e.g., "how much do TaskRabbit taskers make")
- The platform is complex enough to warrant a deep explainer
- There's a natural "pillar content" angle (guide, comparison, breakdown)

**Blog article format** (for future creation):
- File: `src/content/blog/[slug].md`
- Frontmatter: title, description, date, author, category, calculatorSlug, readTime
- Content: 1500-2500 words, includes a CTA linking to the calculator
- Add to the blog index automatically via Content Collections

**Skip a blog article when:**
- The calculator is a minor variant of an existing one
- The topic is too niche for meaningful search traffic

Note for user: "Consider adding a blog article for [topic]. Added to roadmap." or "No blog article needed — too similar to existing [article]."

## Step 11: Update Docs

Run `/update-phase` to update STATUS.md, ROADMAP.md, and MEMORY.md.

Or if adding a single calculator outside of a phase, manually update:
- `docs/STATUS.md` — calculator count, add to category table
- MEMORY.md — update calculator count, note any new patterns

---

## Quick Reference: Input Component Selection

| Data type | Component | When to use |
|-----------|-----------|-------------|
| Dollar amounts | `CurrencyInput` | Revenue, costs, fees, payments |
| Counts, hours, miles | `NumberInput` | With `suffix` prop for units |
| Percentages, bounded ranges | `SliderInput` | Fee %, tax rate, occupancy |
| Categorical choices | `DropdownInput` | Task type, vehicle type, plan tier |

## Quick Reference: Chart Selection

| Pattern | Chart | Examples |
|---------|-------|----------|
| Fee/revenue split | `DonutChart` | Etsy fees, Ko-fi breakdown |
| A vs B comparison | `BarComparisonChart` | W2 vs 1099, quarterly payments |
| Growth over time | `ProjectionChart` | FIRE trajectory, savings goal |
| Simple earnings calc | None | DoorDash, Uber, Amazon Flex |

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Logic file | `src/lib/calculators/kebab-case.ts` | `amazon-flex.ts` |
| UI component | `src/components/calculators/PascalCaseCalc.tsx` | `AmazonFlexCalc.tsx` |
| Page file | `src/pages/[cat]/kebab-calculator.astro` | `amazon-flex-calculator.astro` |
| Interface | `PascalCaseInputs` / `PascalCaseResults` | `AmazonFlexInputs` |
| Function | `calculatePascalCase` | `calculateAmazonFlex` |
| Export name | `function PascalCaseCalc()` | `AmazonFlexCalc` |
