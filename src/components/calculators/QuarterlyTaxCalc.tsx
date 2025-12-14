import { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateQuarterlyTax,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type QuarterlyTaxInputs,
} from '../../lib/calculators/quarterly-tax';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

const FILING_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married Filing Jointly' },
  { value: 'married_separate', label: 'Married Filing Separately' },
  { value: 'head_household', label: 'Head of Household' },
];

export function QuarterlyTaxCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<QuarterlyTaxInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  // Apply quick mode defaults when switching modes
  useEffect(() => {
    if (mode === 'quick') {
      setInputs((prev) => ({ ...prev, ...QUICK_MODE_DEFAULTS }));
    }
  }, [mode]);

  const results = calculateQuarterlyTax(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof QuarterlyTaxInputs>(
    key: K,
    value: QuarterlyTaxInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';

  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using 15.3% SE tax, 5% state tax, standard deduction
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Income Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Income</h3>

          <CurrencyInput
            id="annualIncome"
            label="Annual Freelance Income"
            value={inputs.annualIncome}
            onChange={(v) => updateInput('annualIncome', v)}
            min={0}
            max={1000000}
            step={5000}
            helpText="Total expected freelance/self-employment income"
          />

          <DropdownInput
            id="filingStatus"
            label="Filing Status"
            value={inputs.filingStatus}
            onChange={(v) => updateInput('filingStatus', v as QuarterlyTaxInputs['filingStatus'])}
            options={FILING_STATUS_OPTIONS}
            helpText="Your tax filing status"
          />

          {isAdvanced && (
            <CurrencyInput
              id="otherIncome"
              label="Other Income (W2, investments)"
              value={inputs.otherIncome}
              onChange={(v) => updateInput('otherIncome', v)}
              min={0}
              max={500000}
              step={1000}
              helpText="Non-freelance income subject to tax"
            />
          )}
        </div>

        {/* Expenses & Deductions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Deductions & Expenses' : 'Tax Settings'}
          </h3>

          {isAdvanced && (
            <CurrencyInput
              id="businessExpenses"
              label="Business Expenses"
              value={inputs.businessExpenses}
              onChange={(v) => updateInput('businessExpenses', v)}
              min={0}
              max={200000}
              step={500}
              helpText="Deductible business expenses"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="estimatedDeductions"
              label="Itemized Deductions"
              value={inputs.estimatedDeductions}
              onChange={(v) => updateInput('estimatedDeductions', v)}
              min={0}
              max={100000}
              step={500}
              helpText="If higher than standard deduction"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="selfEmploymentTaxRate"
              label="Self-Employment Tax Rate"
              value={inputs.selfEmploymentTaxRate}
              onChange={(v) => updateInput('selfEmploymentTaxRate', v)}
              min={0}
              max={20}
              step={0.1}
              suffix="%"
              helpText="Social Security (12.4%) + Medicare (2.9%)"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="stateTaxRate"
              label="State Tax Rate"
              value={inputs.stateTaxRate}
              onChange={(v) => updateInput('stateTaxRate', v)}
              min={0}
              max={15}
              step={0.1}
              suffix="%"
              helpText="Your state's income tax rate (0% for TX, FL, etc.)"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="alreadyPaid"
              label="Taxes Already Paid This Year"
              value={inputs.alreadyPaid}
              onChange={(v) => updateInput('alreadyPaid', v)}
              min={0}
              max={200000}
              step={500}
              helpText="Estimated payments already made"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <h3 className="font-semibold text-neutral-900 mb-4">Your Estimated Taxes</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Quarterly Payment"
            value={formatCurrency(results.quarterlyPayment)}
            description="Pay this each quarter"
            category="freelance"
            highlighted
          />
          <ResultCard
            label="Total Annual Tax"
            value={formatCurrency(results.totalAnnualTax)}
            description="Federal + State + SE"
            category="freelance"
          />
          <ResultCard
            label="Effective Tax Rate"
            value={`${results.effectiveTaxRate.toFixed(1)}%`}
            description="Total tax / Total income"
            category="freelance"
          />
        </div>

        {isAdvanced && inputs.alreadyPaid > 0 && (
          <div className="mb-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
            <p className="text-primary-800 font-medium">
              Adjusted Quarterly Payment: {formatCurrency(results.remainingQuarterlyPayment)}
            </p>
            <p className="text-primary-600 text-sm mt-1">
              Based on {formatCurrency(inputs.alreadyPaid)} already paid this year
            </p>
          </div>
        )}

        <ResultBreakdown
          title="Tax Breakdown"
          items={[
            { label: 'Gross Freelance Income', value: formatCurrency(inputs.annualIncome) },
            { label: 'Business Expenses', value: `-${formatCurrency(inputs.businessExpenses)}` },
            { label: 'Net Self-Employment Income', value: formatCurrency(results.netSelfEmploymentIncome), highlighted: true },
            { label: 'Self-Employment Tax', value: formatCurrency(results.selfEmploymentTax) },
            { label: 'Federal Income Tax', value: formatCurrency(results.federalIncomeTax) },
            { label: 'State Tax', value: formatCurrency(results.stateTax) },
            { label: 'Total Annual Tax', value: formatCurrency(results.totalAnnualTax), highlighted: true },
          ]}
          category="freelance"
        />

        {/* Due Date Reminder */}
        <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
          <h4 className="font-semibold text-neutral-900 mb-2">Quarterly Due Dates</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-neutral-500">Q1:</span>
              <span className="ml-2 font-medium">Apr 15</span>
            </div>
            <div>
              <span className="text-neutral-500">Q2:</span>
              <span className="ml-2 font-medium">Jun 15</span>
            </div>
            <div>
              <span className="text-neutral-500">Q3:</span>
              <span className="ml-2 font-medium">Sep 15</span>
            </div>
            <div>
              <span className="text-neutral-500">Q4:</span>
              <span className="ml-2 font-medium">Jan 15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
