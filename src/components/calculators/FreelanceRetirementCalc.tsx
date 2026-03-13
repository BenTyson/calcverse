import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { NumberInput } from '../ui/inputs/NumberInput';
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
  calculateFreelanceRetirement,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  ACCOUNT_TYPE_OPTIONS,
  type FreelanceRetirementInputs,
} from '../../lib/calculators/freelance-retirement';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function FreelanceRetirementCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } = useCalculatorState(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  const results = calculateFreelanceRetirement(inputs);

  const getResultsText = () =>
    `Freelance Retirement Calculator (CalcFalcon)\n` +
    `Projected Balance: ${formatCurrency(results.projectedBalance)}\n` +
    `Annual Tax Savings: ${formatCurrency(results.annualTaxSavings)}\n` +
    `Max Contribution: ${formatCurrency(results.maxContribution)}\n` +
    `https://calcfalcon.com/freelance/freelance-retirement-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using Solo 401(k), age 35, 7% return, 22% tax bracket
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Savings</h3>

          <CurrencyInput
            id="annualIncome"
            label="Annual Self-Employment Income"
            value={inputs.annualIncome}
            onChange={(v) => updateInput('annualIncome', v)}
            min={0}
            max={500000}
            step={5000}
            helpText="Gross income from freelance or self-employment"
          />

          <CurrencyInput
            id="annualContribution"
            label="Annual Contribution"
            value={inputs.annualContribution}
            onChange={(v) => updateInput('annualContribution', v)}
            min={0}
            max={76500}
            step={500}
            helpText="How much you plan to contribute per year"
          />

          <CurrencyInput
            id="currentSavings"
            label="Current Retirement Savings"
            value={inputs.currentSavings}
            onChange={(v) => updateInput('currentSavings', v)}
            min={0}
            max={5000000}
            step={1000}
            helpText="Total already saved across retirement accounts"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Account Settings' : 'Settings'}
          </h3>

          {isAdvanced && (
            <DropdownInput
              id="accountType"
              label="Account Type"
              value={inputs.accountType}
              onChange={(v) => updateInput('accountType', v as FreelanceRetirementInputs['accountType'])}
              options={ACCOUNT_TYPE_OPTIONS}
              helpText="Type of retirement account to analyze"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="currentAge"
              label="Current Age"
              value={inputs.currentAge}
              onChange={(v) => updateInput('currentAge', v)}
              min={18}
              max={70}
              step={1}
              suffix="years"
              helpText="Your current age"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="retirementAge"
              label="Retirement Age"
              value={inputs.retirementAge}
              onChange={(v) => updateInput('retirementAge', v)}
              min={50}
              max={80}
              step={1}
              suffix="years"
              helpText="Age you plan to retire"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="expectedReturn"
              label="Expected Annual Return"
              value={inputs.expectedReturn}
              onChange={(v) => updateInput('expectedReturn', v)}
              min={1}
              max={15}
              step={0.5}
              suffix="%"
              helpText="Average annual investment return (7% is historical stock market average)"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="taxBracket"
              label="Federal Tax Bracket"
              value={inputs.taxBracket}
              onChange={(v) => updateInput('taxBracket', v)}
              min={10}
              max={37}
              step={1}
              suffix="%"
              helpText="Your marginal federal tax rate"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Retirement Projection</h3>
          <CopyResultsButton getResultsText={getResultsText} category="freelance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Projected Balance"
            value={formatCurrency(results.projectedBalance)}
            numericValue={results.projectedBalance}
            formatFn={formatCurrency}
            description={`At age ${inputs.retirementAge}`}
            category="freelance"
            highlight
          />
          <ResultCard
            label="Annual Tax Savings"
            value={formatCurrency(results.annualTaxSavings)}
            description="Deduction from taxable income"
            category="freelance"
          />
          <ResultCard
            label="Max Contribution"
            value={formatCurrency(results.maxContribution)}
            description={ACCOUNT_TYPE_OPTIONS.find((o) => o.value === inputs.accountType)?.label ?? ''}
            category="freelance"
          />
        </div>

        <ChartCard title="Account Type Comparison — Max Contributions" category="freelance">
          <BarComparisonChart
            data={results.accountComparison.map((a) => ({
              label: a.type,
              maxContribution: a.maxContribution,
            }))}
            bars={[{ dataKey: 'maxContribution', label: 'Max Contribution' }]}
            category="freelance"
          />
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <ResultBreakdown
            title="Contribution Breakdown"
            items={[
              { label: 'Annual Contribution', value: formatCurrency(results.effectiveContribution) },
              { label: <Tooltip text="The most you can contribute to this account type based on your income and IRS limits">Max Allowed</Tooltip>, value: formatCurrency(results.maxContribution) },
              { label: <Tooltip text="Tax savings from deductible contributions — Roth contributions are not deductible">Annual Tax Savings</Tooltip>, value: formatCurrency(results.annualTaxSavings) },
              { label: 'Contribution Rate', value: `${results.effectiveContributionRate}%` },
            ]}
            category="freelance"
          />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ResultCard
                label="Years to Retirement"
                value={`${results.yearsToRetirement}`}
                description={`Age ${inputs.currentAge} → ${inputs.retirementAge}`}
                category="freelance"
                size="sm"
              />
              <ResultCard
                label="Total Growth"
                value={formatCurrency(results.totalGrowth)}
                description="Investment returns earned"
                category="freelance"
                size="sm"
              />
            </div>

            <div className="bg-freelance-50 rounded-xl p-4 text-sm text-freelance-800">
              <p className="font-medium mb-1">Tax tip</p>
              <p>
                A Solo 401(k) allows the highest contribution limits for self-employed
                workers — up to $69,000/year. If you're 50 or older, catch-up
                contributions add another $7,500. SEP-IRAs are simpler but cap at 25%
                of net earnings.
              </p>
            </div>
          </div>
        </div>

        {mode === 'quick' && (
          <div className="mt-6 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-600">
            <p>
              Quick mode assumes Solo 401(k), age 35 retiring at 65, 7% annual return, 22% tax bracket.{' '}
              <button
                onClick={() => setMode('advanced')}
                className="text-freelance-600 font-medium hover:underline"
              >
                Customize these →
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
}
