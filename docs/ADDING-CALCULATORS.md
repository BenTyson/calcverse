# Adding New Calculators

## Files to Create (3)

### 1. Logic — `src/lib/calculators/[name].ts`

```typescript
export interface MyCalcInputs {
  revenue: number;
  expenses: number;
  taxRate: number;
}

export interface MyCalcResults {
  netIncome: number;
  breakdown: { label: string; amount: number }[];
}

export const DEFAULT_INPUTS: MyCalcInputs = {
  revenue: 50000,
  expenses: 5000,
  taxRate: 25,
};

export function calculateMyCalc(inputs: MyCalcInputs): MyCalcResults {
  const netIncome = inputs.revenue - inputs.expenses;
  return {
    netIncome,
    breakdown: [
      { label: 'Revenue', amount: inputs.revenue },
      { label: 'Expenses', amount: inputs.expenses },
    ],
  };
}
```

### 2. UI Component — `src/components/calculators/MyCalc.tsx`

```tsx
import { useState, useEffect } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import {
  calculateMyCalc,
  DEFAULT_INPUTS,
  type MyCalcInputs,
} from '../../lib/calculators/my-calc';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function MyCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<MyCalcInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateMyCalc(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof MyCalcInputs>(
    key: K,
    value: MyCalcInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <ModeToggle mode={mode} onChange={setMode} />
          {mode === 'quick' && (
            <p className="text-sm text-neutral-500">Using smart defaults</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <CurrencyInput
            id="revenue"
            label="Annual Revenue"
            value={inputs.revenue}
            onChange={(v) => updateInput('revenue', v)}
            helpText="Your total gross revenue"
          />
          {isAdvanced && (
            <SliderInput
              id="taxRate"
              label="Tax Rate"
              value={inputs.taxRate}
              onChange={(v) => updateInput('taxRate', v)}
              min={10}
              max={50}
              formatValue={(v) => `${v}%`}
              helpText="Your effective tax rate"
            />
          )}
        </div>

        <div className="border-t border-neutral-200 pt-8">
          <ResultCard
            label="Net Income"
            value={formatCurrency(results.netIncome)}
            category="freelance"
            highlight
            size="lg"
          />
          <ResultBreakdown
            title="Breakdown"
            category="freelance"
            items={results.breakdown.map((item) => ({
              label: item.label,
              value: formatCurrency(item.amount),
            }))}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
```

### 3. Page — `src/pages/[category]/[name]-calculator.astro`

```astro
---
import CalculatorLayout from '@layouts/CalculatorLayout.astro';
import { MyCalc } from '@components/calculators/MyCalc';

const faqs = [
  { question: 'How does this work?', answer: 'Explanation here.' },
];

const relatedCalculators = [
  {
    name: 'Related Calc',
    description: 'Short description',
    href: '/category/related-calculator',
    category: 'Category Name',
  },
];
---

<CalculatorLayout
  title="My Calculator - Free Tool"
  description="Calculate X with this free tool."
  calculatorName="My Calculator"
  category="Freelance"
  categorySlug="freelance"
  slug="my-calculator"
  faqs={faqs}
  relatedCalculators={relatedCalculators}
>
  <MyCalc client:visible />
</CalculatorLayout>
```

## Files to Update (2)

### 4. Embed routes — `src/pages/embed/[...slug].astro`

- Add import for the new calculator component
- Add path to `getStaticPaths()` return array
- Add entry to `calculators` object
- Add conditional render: `{calculator.component === 'mycalc' && <MyCalc client:load />}`

Note: Embeds use `client:load`, not `client:visible`.

### 5. Category index — `src/pages/[category]/index.astro`

Add the calculator to the `calculators` array.

## Checklist

- [ ] Logic file: pure function, types, DEFAULT_INPUTS
- [ ] UI component: ErrorBoundary wrapper, ModeToggle, url-state sync
- [ ] Page: CalculatorLayout, `client:visible`, FAQs, relatedCalculators
- [ ] Embed route updated with `client:load`
- [ ] Category index updated
- [ ] Added to relatedCalculators in 2-3 other calculators
- [ ] `npm run build` passes
- [ ] Run `/update-phase` to update docs

## Available Components

### Inputs
| Component | Use Case |
|-----------|----------|
| `NumberInput` | General numbers (prefix/suffix support) |
| `CurrencyInput` | Dollar amounts ($ prefix built-in) |
| `SliderInput` | Percentages, ranges (formatValue for display) |
| `DropdownInput` | Select from options |
| `ModeToggle` | Quick/Advanced toggle (required on all calcs) |

### Results
| Component | Use Case |
|-----------|----------|
| `ResultCard` | Single result. Props: `label, value, description?, category?, highlight?, size?`. Opt-in count-up: add `numericValue` + `formatFn` |
| `ResultBreakdown` | Table of items. Props: `title?, category?, items: {label: ReactNode, value, highlight?}[]`. Label accepts `<Tooltip>` |
| `CopyResultsButton` | Clipboard copy button. Props: `getResultsText: () => string, category?`. Place at top of results section |

### UI Utilities
| Component | Use Case |
|-----------|----------|
| `Tooltip` | Hover/focus tooltip for jargon. Props: `text: string, children: ReactNode`. Wrap breakdown labels: `<Tooltip text="...">Label</Tooltip>` |

### Charts (in `../ui/charts/`)
| Component | Use Case |
|-----------|----------|
| `DonutChart` | Breakdowns (fees, revenue split). Props: `data: {label, value}[]`, `category`, `innerLabel`, `innerValue` |
| `BarComparisonChart` | Side-by-side or stacked comparisons. Props: `data`, `bars: {dataKey, label}[]`, `stacked?` |
| `ProjectionChart` | Growth/timeline data. Props: `data`, `lines: {dataKey, label, areaFill?}[]`, `goalLine?` |
| `ChartCard` | Wrapper card for any chart. Props: `title`, `category?`, `description?` |

### Formatting
```typescript
import { formatCurrency, formatNumber, formatPercent, formatDuration, formatCompactNumber } from '../../lib/utils/formatters';
```

## Category Reference

| Category | URL prefix | CSS class prefix | Color |
|----------|-----------|-----------------|-------|
| Freelance | `/freelance/` | `freelance-*` | Cyan |
| Creator | `/creator/` | `creator-*` | Magenta |
| Gig Economy | `/gig-economy/` | `gig-*` | Emerald |
| Side Hustle | `/side-hustle/` | `sidehustle-*` | Purple |
| Personal Finance | `/personal-finance/` | `finance-*` | Amber |
