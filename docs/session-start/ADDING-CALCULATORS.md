# Adding New Calculators

Follow this guide to add a new calculator to Calcverse.

## Overview

Adding a calculator requires 3 files:
1. **Logic** - `src/lib/calculators/[name].ts`
2. **UI Component** - `src/components/calculators/[Name]Calc.tsx`
3. **Page** - `src/pages/[category]/[name]-calculator.astro`

Plus updating the embed routes.

## Step-by-Step Guide

### Step 1: Create the Calculator Logic

Create `src/lib/calculators/[name].ts`:

```typescript
// Example: src/lib/calculators/quarterly-tax.ts

// 1. Define input interface
export interface QuarterlyTaxInputs {
  quarterlyIncome: number;
  businessExpenses: number;
  selfEmploymentTaxRate: number;
  estimatedTaxRate: number;
}

// 2. Define output interface
export interface QuarterlyTaxResults {
  quarterlyTaxDue: number;
  annualProjection: number;
  breakdown: { label: string; amount: number }[];
}

// 3. Define defaults
export const DEFAULT_INPUTS: QuarterlyTaxInputs = {
  quarterlyIncome: 25000,
  businessExpenses: 2000,
  selfEmploymentTaxRate: 15.3,
  estimatedTaxRate: 22,
};

// 4. Create pure calculation function
export function calculateQuarterlyTax(
  inputs: QuarterlyTaxInputs
): QuarterlyTaxResults {
  const netIncome = inputs.quarterlyIncome - inputs.businessExpenses;
  const seTax = netIncome * (inputs.selfEmploymentTaxRate / 100);
  const incomeTax = netIncome * (inputs.estimatedTaxRate / 100);
  const quarterlyTaxDue = seTax + incomeTax;

  return {
    quarterlyTaxDue: Math.round(quarterlyTaxDue),
    annualProjection: Math.round(quarterlyTaxDue * 4),
    breakdown: [
      { label: 'Net Income', amount: netIncome },
      { label: 'Self-Employment Tax', amount: Math.round(seTax) },
      { label: 'Income Tax', amount: Math.round(incomeTax) },
    ],
  };
}
```

### Step 2: Create the React Component

Create `src/components/calculators/[Name]Calc.tsx`:

```typescript
// Example: src/components/calculators/QuarterlyTaxCalc.tsx

import { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateQuarterlyTax,
  DEFAULT_INPUTS,
  type QuarterlyTaxInputs,
} from '../../lib/calculators/quarterly-tax';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState } from '../../lib/utils/url-state';

export function QuarterlyTaxCalc() {
  // 1. Initialize state from URL or defaults
  const [inputs, setInputs] = useState<QuarterlyTaxInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  // 2. Calculate results
  const results = calculateQuarterlyTax(inputs);

  // 3. Sync state to URL
  useEffect(() => {
    updateUrlState(inputs);
  }, [inputs]);

  // 4. Update helper
  const updateInput = <K extends keyof QuarterlyTaxInputs>(
    key: K,
    value: QuarterlyTaxInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  // 5. Render UI
  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-6">
        <CurrencyInput
          id="income"
          label="Quarterly Income"
          value={inputs.quarterlyIncome}
          onChange={(v) => updateInput('quarterlyIncome', v)}
        />
        {/* Add more inputs... */}
      </div>

      {/* Results */}
      <div className="border-t pt-8">
        <ResultCard
          label="Quarterly Tax Due"
          value={formatCurrency(results.quarterlyTaxDue)}
          highlight
        />
        <ResultBreakdown
          title="Breakdown"
          items={results.breakdown.map((item) => ({
            label: item.label,
            value: formatCurrency(item.amount),
          }))}
        />
      </div>
    </div>
  );
}
```

### Step 3: Create the Page

Create `src/pages/[category]/[name]-calculator.astro`:

```astro
---
// Example: src/pages/freelance/quarterly-tax-calculator.astro

import CalculatorLayout from '@layouts/CalculatorLayout.astro';
import { QuarterlyTaxCalc } from '@components/calculators/QuarterlyTaxCalc';

const faqs = [
  {
    question: 'When are quarterly taxes due?',
    answer: 'Quarterly estimated taxes are due April 15, June 15, September 15, and January 15 of the following year.',
  },
  {
    question: 'How do I calculate quarterly taxes?',
    answer: 'Estimate your annual income, subtract business expenses, then apply your self-employment tax rate (15.3%) and income tax rate.',
  },
  // Add 2-4 more FAQs
];

const relatedCalculators = [
  {
    name: 'Freelancer Hourly Rate',
    description: 'Calculate your ideal hourly rate',
    href: '/freelance/hourly-rate-calculator',
    category: 'Freelance',
  },
  // Add 1-2 more related calculators
];
---

<CalculatorLayout
  title="Quarterly Tax Calculator - Estimate Your Payments"
  description="Calculate your quarterly estimated tax payments as a freelancer. Free tool for self-employed tax planning."
  calculatorName="Quarterly Tax Calculator"
  category="Freelance"
  categorySlug="freelance"
  slug="quarterly-tax-calculator"
  faqs={faqs}
  relatedCalculators={relatedCalculators}
>
  <QuarterlyTaxCalc client:load />
</CalculatorLayout>
```

### Step 4: Add to Embed Routes

Update `src/pages/embed/[...slug].astro`:

```astro
---
// Add import
import { QuarterlyTaxCalc } from '@components/calculators/QuarterlyTaxCalc';

// Add to getStaticPaths
export function getStaticPaths() {
  return [
    // ... existing paths
    { params: { slug: 'freelance/quarterly-tax-calculator' } },
  ];
}

// Add to calculators object
const calculators = {
  // ... existing calculators
  'freelance/quarterly-tax-calculator': {
    title: 'Quarterly Tax Calculator',
    component: 'quarterlytax',
  },
};
---

<!-- Add conditional render -->
{calculator.component === 'quarterlytax' && <QuarterlyTaxCalc client:load />}
```

### Step 5: Update Category Page (Optional)

Add to `src/pages/[category]/index.astro` calculator list.

### Step 6: Update Related Calculators

Add the new calculator to `relatedCalculators` arrays in other calculators where relevant.

## Available Input Components

| Component | Import | Use Case |
|-----------|--------|----------|
| `NumberInput` | `@components/ui/inputs/NumberInput` | General numbers with prefix/suffix |
| `CurrencyInput` | `@components/ui/inputs/CurrencyInput` | Dollar amounts |
| `SliderInput` | `@components/ui/inputs/SliderInput` | Percentages, ranges |
| `DropdownInput` | `@components/ui/inputs/DropdownInput` | Select from options |

## Available Result Components

| Component | Import | Use Case |
|-----------|--------|----------|
| `ResultCard` | `@components/ui/results/ResultCard` | Single highlighted result |
| `ResultBreakdown` | `@components/ui/results/ResultBreakdown` | Table of line items |

## Formatting Utilities

```typescript
import {
  formatCurrency,      // $1,234
  formatNumber,        // 1,234
  formatPercent,       // 12.3%
  formatDuration,      // 1 year, 3 months
  formatCompactNumber  // 1.2K, 3.4M
} from '../../lib/utils/formatters';
```

## SEO Checklist

- [ ] Title follows pattern: "[Calculator Name] - [Benefit/Action]"
- [ ] Description includes target keyword and value prop
- [ ] 3-5 FAQs with common user questions
- [ ] Related calculators linked
- [ ] Category page updated

## Testing Checklist

- [ ] Calculator produces correct results
- [ ] URL state updates when inputs change
- [ ] Shared URL restores correct state
- [ ] Embed version works
- [ ] Mobile responsive
- [ ] No console errors
