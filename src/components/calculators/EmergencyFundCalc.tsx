import { useState, useEffect } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { NumberInput } from '../ui/inputs/NumberInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { BarComparisonChart } from '../ui/charts/BarComparisonChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateEmergencyFund,
  DEFAULT_INPUTS,
  type EmergencyFundInputs,
  type IncomeStability,
} from '../../lib/calculators/emergency-fund';
import { formatCurrency, formatDuration } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

const STABILITY_OPTIONS = [
  { value: 'stable', label: 'Stable (W2 employment)' },
  { value: 'moderate', label: 'Moderate (contract work)' },
  { value: 'variable', label: 'Variable (commission-based)' },
  { value: 'freelance', label: 'Freelance / Self-employed' },
];

export function EmergencyFundCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<EmergencyFundInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateEmergencyFund(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof EmergencyFundInputs>(
    key: K,
    value: EmergencyFundInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';

  const getResultsText = () =>
    `Emergency Fund Calculator (CalcFalcon)\n` +
    `Target: ${formatCurrency(results.targetAmount)} (${results.recommendedMonths} months)\n` +
    `Current: ${formatCurrency(inputs.currentFund)} (${results.percentComplete}%)\n` +
    `Gap: ${formatCurrency(results.currentGap)}\n` +
    `Time to Goal: ${formatDuration(results.monthsToGoal)}\n` +
    `https://calcfalcon.com/personal-finance/emergency-fund-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using moderate income stability, no dependents
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Monthly Expenses</h3>
          <CurrencyInput
            id="monthlyExpenses"
            label="Monthly Expenses"
            value={inputs.monthlyExpenses}
            onChange={(v) => updateInput('monthlyExpenses', v)}
            min={500}
            max={30000}
            step={100}
            helpText="Your total monthly living expenses"
          />
          <CurrencyInput
            id="currentFund"
            label="Current Emergency Fund"
            value={inputs.currentFund}
            onChange={(v) => updateInput('currentFund', v)}
            min={0}
            max={500000}
            step={500}
            helpText="Amount you have saved for emergencies"
          />
          <CurrencyInput
            id="monthlySavings"
            label="Monthly Savings Toward Fund"
            value={inputs.monthlySavings}
            onChange={(v) => updateInput('monthlySavings', v)}
            min={0}
            max={10000}
            step={50}
            helpText="How much you can save each month"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Risk Factors' : 'Settings'}
          </h3>
          {isAdvanced && (
            <DropdownInput
              id="incomeStability"
              label="Income Stability"
              value={inputs.incomeStability}
              onChange={(v) => updateInput('incomeStability', v as IncomeStability)}
              options={STABILITY_OPTIONS}
            />
          )}
          {isAdvanced && (
            <NumberInput
              id="dependents"
              label="Number of Dependents"
              value={inputs.dependents}
              onChange={(v) => updateInput('dependents', v)}
              min={0}
              max={10}
              helpText="People who rely on your income"
            />
          )}
          {isAdvanced && (
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.hasPartnerIncome}
                  onChange={(e) => updateInput('hasPartnerIncome', e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-300 text-finance-600 focus:ring-finance-500"
                />
                <span className="font-medium text-neutral-700">Partner has income</span>
              </label>
              <p className="text-xs text-neutral-500 ml-8">
                Reduces recommended months by 1 (minimum 3)
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Emergency Fund Plan</h3>
          <CopyResultsButton getResultsText={getResultsText} category="finance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ResultCard
            label="Target Amount"
            value={formatCurrency(results.targetAmount)}
            numericValue={results.targetAmount}
            formatFn={formatCurrency}
            description={`${results.recommendedMonths} months of expenses`}
            highlight
            size="lg"
            category="finance"
          />
          <ResultCard
            label="Current Gap"
            value={formatCurrency(results.currentGap)}
            numericValue={results.currentGap}
            formatFn={formatCurrency}
            description="Amount still needed"
          />
          <ResultCard
            label="Progress"
            value={`${results.percentComplete}%`}
            description="Of target reached"
          />
          <ResultCard
            label="Time to Goal"
            value={results.monthsToGoal > 0 ? formatDuration(results.monthsToGoal) : 'Funded!'}
            description={results.monthsToGoal > 0 ? `At ${formatCurrency(inputs.monthlySavings)}/mo` : 'You\'ve reached your goal'}
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-neutral-100 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-neutral-600">Progress to Goal</span>
            <span className="font-medium text-neutral-900">{results.percentComplete}%</span>
          </div>
          <div className="h-4 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-finance-500 transition-all duration-500 rounded-full"
              style={{ width: `${results.percentComplete}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-neutral-500 mt-2">
            <span>{formatCurrency(inputs.currentFund)}</span>
            <span>{formatCurrency(results.targetAmount)}</span>
          </div>
        </div>

        <ChartCard title="Current vs Target" category="finance" className="mb-6">
          <BarComparisonChart
            data={[
              {
                label: 'Emergency Fund',
                current: inputs.currentFund,
                target: results.targetAmount,
              },
            ]}
            bars={[
              { dataKey: 'current', label: 'Current Fund' },
              { dataKey: 'target', label: 'Recommended Target' },
            ]}
            category="finance"
          />
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Fund Breakdown"
            category="finance"
            items={[
              { label: 'Monthly Expenses', value: formatCurrency(inputs.monthlyExpenses) },
              { label: <Tooltip text="Based on income stability, dependents, and partner income">Recommended Months</Tooltip>, value: `${results.recommendedMonths} months` },
              { label: 'Target Amount', value: formatCurrency(results.targetAmount), highlight: true },
              { label: 'Currently Saved', value: formatCurrency(inputs.currentFund) },
              { label: 'Remaining Gap', value: formatCurrency(results.currentGap) },
            ]}
          />
          <div className="space-y-4">
            <ResultBreakdown
              title="Savings Plan"
              category="finance"
              items={[
                { label: 'Monthly Savings', value: formatCurrency(inputs.monthlySavings) },
                { label: 'Months to Full Fund', value: results.monthsToGoal > 0 ? `${results.monthsToGoal}` : 'Complete' },
                { label: 'Completion', value: `${results.percentComplete}%`, highlight: true },
              ]}
            />
            <div className="bg-finance-50 rounded-xl p-4 text-sm text-finance-800">
              <strong>Tip:</strong> Keep your emergency fund in a high-yield savings account
              — accessible when you need it, but earning interest while you don't. Avoid
              investing emergency funds in volatile assets.
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
