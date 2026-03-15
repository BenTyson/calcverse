import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { BarComparisonChart } from '../ui/charts/BarComparisonChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateSelfEmploymentTaxResults,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type SelfEmploymentTaxInputs,
} from '../../lib/calculators/self-employment-tax';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

const FILING_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married Filing Jointly' },
  { value: 'married_separate', label: 'Married Filing Separately' },
  { value: 'head_household', label: 'Head of Household' },
];

export function SelfEmploymentTaxCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } =
    useCalculatorState<SelfEmploymentTaxInputs>(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  const results = calculateSelfEmploymentTaxResults(inputs);

  const getResultsText = () =>
    `Self-Employment Tax Calculator (CalcFalcon)\n` +
    `Total SE Tax: ${formatCurrency(results.totalSETax)}\n` +
    `Federal Income Tax: ${formatCurrency(results.federalIncomeTax)}\n` +
    `Total Tax Burden: ${formatCurrency(results.totalTax)}\n` +
    `Effective Tax Rate: ${results.effectiveTaxRate.toFixed(1)}%\n` +
    `https://calcfalcon.com/freelance/self-employment-tax-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using 5% state tax, standard deduction, no QBI
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Income</h3>

          <CurrencyInput
            id="annualIncome"
            label="Annual Self-Employment Income"
            value={inputs.annualIncome}
            onChange={(v) => updateInput('annualIncome', v)}
            min={0}
            max={1000000}
            step={5000}
            helpText="Gross income from self-employment before expenses"
          />

          <DropdownInput
            id="filingStatus"
            label="Filing Status"
            value={inputs.filingStatus}
            onChange={(v) => updateInput('filingStatus', v as SelfEmploymentTaxInputs['filingStatus'])}
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
              helpText="Non-SE income subject to tax"
            />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Deductions & Settings' : 'Tax Settings'}
          </h3>

          {isAdvanced && (
            <CurrencyInput
              id="businessExpenses"
              label="Business Expenses"
              value={inputs.businessExpenses}
              onChange={(v) => updateInput('businessExpenses', v)}
              min={0}
              max={500000}
              step={500}
              helpText="Deductible expenses (home office, supplies, etc.)"
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
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
              <input
                type="checkbox"
                id="qbiToggle"
                checked={inputs.qualifiedBusinessIncomeDeduction}
                onChange={(e) => updateInput('qualifiedBusinessIncomeDeduction', e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-freelance-600 focus:ring-freelance-500"
                aria-describedby="qbiHelp"
              />
              <label htmlFor="qbiToggle" className="text-sm font-medium text-neutral-700">
                <Tooltip text="Deduct 20% of qualified business income (Section 199A). Available to most sole proprietors, partnerships, and S-corps below income thresholds.">
                  QBI Deduction (20%)
                </Tooltip>
              </label>
              <span id="qbiHelp" className="sr-only">Qualified Business Income deduction under Section 199A</span>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Self-Employment Tax</h3>
          <CopyResultsButton getResultsText={getResultsText} category="freelance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Total SE Tax"
            value={formatCurrency(results.totalSETax)}
            numericValue={results.totalSETax}
            formatFn={formatCurrency}
            description="Social Security + Medicare"
            category="freelance"
            highlight
          />
          <ResultCard
            label="Federal Income Tax"
            value={formatCurrency(results.federalIncomeTax)}
            numericValue={results.federalIncomeTax}
            formatFn={formatCurrency}
            description={`Marginal bracket: ${(results.marginalBracket * 100).toFixed(0)}%`}
            category="freelance"
          />
          <ResultCard
            label="Total Tax Burden"
            value={formatCurrency(results.totalTax)}
            numericValue={results.totalTax}
            formatFn={formatCurrency}
            description={`Effective rate: ${results.effectiveTaxRate.toFixed(1)}%`}
            category="freelance"
          />
        </div>

        {results.seDeduction > 0 && (
          <div className="mb-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
            <p className="text-primary-800 font-medium">
              SE Tax Deduction: {formatCurrency(results.seDeduction)}
            </p>
            <p className="text-primary-600 text-sm mt-1">
              You can deduct 50% of your SE tax from your adjusted gross income
            </p>
          </div>
        )}

        <ChartCard title="Tax Breakdown by Type" category="freelance">
          <BarComparisonChart
            data={[
              {
                label: 'Your Taxes',
                socialSecurity: results.socialSecurityTax,
                medicare: results.medicareTax + results.additionalMedicareTax,
                federal: results.federalIncomeTax,
                state: results.stateTax,
              },
            ]}
            bars={[
              { dataKey: 'socialSecurity', label: 'Social Security' },
              { dataKey: 'medicare', label: 'Medicare' },
              { dataKey: 'federal', label: 'Federal Income' },
              { dataKey: 'state', label: 'State' },
            ]}
            category="freelance"
            stacked
          />
        </ChartCard>

        <ResultBreakdown
          title="Detailed Tax Breakdown"
          items={results.breakdown.map((item) => ({
            label: item.label === 'Net SE Income'
              ? <Tooltip text="Gross income minus business expenses">{item.label}</Tooltip>
              : item.label === 'Total Self-Employment Tax'
              ? <Tooltip text="Combined Social Security (12.4%) and Medicare (2.9%) tax on 92.35% of net SE income">{item.label}</Tooltip>
              : item.label === 'SE Tax Deduction (50%)'
              ? <Tooltip text="Half of your SE tax is deductible from adjusted gross income">{item.label}</Tooltip>
              : item.label === 'QBI Deduction (20%)'
              ? <Tooltip text="Section 199A deduction: 20% of qualified business income">{item.label}</Tooltip>
              : item.label,
            value: formatCurrency(Math.abs(item.value)),
            highlight: item.label === 'Total Tax Burden',
          }))}
          category="freelance"
        />

        <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
          <h4 className="font-semibold text-neutral-900 mb-2">Schedule SE Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-500">Net SE Income (92.35%):</span>
              <span className="ml-2 font-medium">{formatCurrency(results.netSEIncome * 0.9235)}</span>
            </div>
            <div>
              <span className="text-neutral-500">SS Tax (12.4%):</span>
              <span className="ml-2 font-medium">{formatCurrency(results.socialSecurityTax)}</span>
            </div>
            <div>
              <span className="text-neutral-500">Medicare Tax (2.9%):</span>
              <span className="ml-2 font-medium">{formatCurrency(results.medicareTax)}</span>
            </div>
            {results.additionalMedicareTax > 0 && (
              <div>
                <span className="text-neutral-500">Addl. Medicare (0.9%):</span>
                <span className="ml-2 font-medium">{formatCurrency(results.additionalMedicareTax)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
