import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { NumberInput } from '../ui/inputs/NumberInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { ProjectionChart } from '../ui/charts/ProjectionChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateSavingsGoal,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type SavingsGoalInputs,
} from '../../lib/calculators/savings-goal';
import { formatCurrency, formatDuration } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function SavingsGoalCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } =
    useCalculatorState<SavingsGoalInputs>(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  const results = calculateSavingsGoal(inputs);

  const getResultsText = () =>
    `Savings Goal Calculator (CalcFalcon)\n` +
    `Monthly Savings Needed: ${formatCurrency(results.monthlySavingsNeeded)}\n` +
    `Total Contributions: ${formatCurrency(results.totalContributions)}\n` +
    `Interest Earned: ${formatCurrency(results.interestEarned)}\n` +
    `Time to Goal: ${formatDuration(results.monthsToGoal)}\n` +
    `https://calcfalcon.com/personal-finance/savings-goal-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            No inflation adjustment or income buffer
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Your Goal</h3>
          <CurrencyInput
            id="targetAmount"
            label="Target Amount"
            value={inputs.targetAmount}
            onChange={(v) => updateInput('targetAmount', v)}
            min={100}
            max={1000000}
            step={1000}
            helpText="How much you want to save"
          />
          <CurrencyInput
            id="currentSavings"
            label="Current Savings"
            value={inputs.currentSavings}
            onChange={(v) => updateInput('currentSavings', v)}
            min={0}
            max={1000000}
            step={500}
            helpText="Amount you've already saved toward this goal"
          />
          <NumberInput
            id="targetMonths"
            label="Target Timeline"
            value={inputs.targetMonths}
            onChange={(v) => updateInput('targetMonths', v)}
            min={1}
            max={360}
            step={1}
            suffix="months"
            helpText="When you want to reach your goal"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Savings Details</h3>
          <CurrencyInput
            id="monthlyContribution"
            label="Current Monthly Savings"
            value={inputs.monthlyContribution}
            onChange={(v) => updateInput('monthlyContribution', v)}
            min={0}
            max={50000}
            step={50}
            helpText="What you're currently saving per month"
          />
          <SliderInput
            id="annualInterestRate"
            label="Annual Interest Rate"
            value={inputs.annualInterestRate}
            onChange={(v) => updateInput('annualInterestRate', v)}
            min={0}
            max={15}
            step={0.25}
            formatValue={(v) => `${v}%`}
            helpText="Expected return on your savings (HYSA ~5%, stocks ~7-10%)"
          />

          {isAdvanced && (
            <>
              <SliderInput
                id="inflationRate"
                label="Inflation Rate"
                value={inputs.inflationRate}
                onChange={(v) => updateInput('inflationRate', v)}
                min={0}
                max={10}
                step={0.5}
                formatValue={(v) => `${v}%`}
                helpText="Adjusts target for purchasing power (3% typical)"
              />
              <SliderInput
                id="irregularIncomeBuffer"
                label="Irregular Income Buffer"
                value={inputs.irregularIncomeBuffer}
                onChange={(v) => updateInput('irregularIncomeBuffer', v)}
                min={0}
                max={50}
                step={5}
                formatValue={(v) => `${v}%`}
                helpText="Extra savings buffer for freelancers with variable income"
              />
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Savings Plan</h3>
          <CopyResultsButton getResultsText={getResultsText} category="finance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ResultCard
            label="Monthly Savings Needed"
            value={formatCurrency(results.monthlySavingsNeeded)}
            numericValue={results.monthlySavingsNeeded}
            formatFn={formatCurrency}
            description={`To reach goal in ${formatDuration(inputs.targetMonths)}`}
            highlight
            category="finance"
          />
          <ResultCard
            label="Time to Goal"
            value={formatDuration(results.monthsToGoal)}
            description={results.goalReachable ? 'On track' : 'Adjust savings or timeline'}
          />
          <ResultCard
            label="Total Contributions"
            value={formatCurrency(results.totalContributions)}
            numericValue={results.totalContributions}
            formatFn={formatCurrency}
            description="From your savings"
          />
          <ResultCard
            label="Interest Earned"
            value={formatCurrency(results.interestEarned)}
            numericValue={results.interestEarned}
            formatFn={formatCurrency}
            description="From compounding"
          />
        </div>

        {results.projectionData.length > 1 && (
          <ChartCard title="Savings Growth Projection" category="finance" className="mb-6">
            <ProjectionChart
              data={results.projectionData.map((d) => ({
                label: d.label,
                savings: d.savings,
              }))}
              lines={[
                { dataKey: 'savings', label: 'Your Savings', areaFill: true },
              ]}
              category="finance"
              goalLine={{
                value: isAdvanced && results.inflationAdjustedTarget !== inputs.targetAmount
                  ? results.inflationAdjustedTarget
                  : inputs.targetAmount,
                label: 'Goal',
              }}
            />
          </ChartCard>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Savings Breakdown"
            category="finance"
            items={[
              { label: 'Target Amount', value: formatCurrency(inputs.targetAmount) },
              ...(isAdvanced && results.inflationAdjustedTarget !== inputs.targetAmount
                ? [{ label: <Tooltip text="Your target adjusted for inflation to maintain the same purchasing power">Inflation-Adjusted Target</Tooltip>, value: formatCurrency(results.inflationAdjustedTarget) }]
                : []),
              { label: 'Current Savings', value: formatCurrency(inputs.currentSavings) },
              { label: 'Amount Remaining', value: formatCurrency(Math.max(0, inputs.targetAmount - inputs.currentSavings)) },
              { label: 'Monthly Savings Needed', value: formatCurrency(results.monthlySavingsNeeded), highlight: true },
              ...(isAdvanced && results.bufferAdjustedMonthly > results.monthlySavingsNeeded
                ? [{ label: <Tooltip text="Recommended monthly amount with buffer for months when freelance income is lower than expected">With Income Buffer</Tooltip>, value: formatCurrency(results.bufferAdjustedMonthly) }]
                : []),
            ]}
          />
          <div className="space-y-4">
            {!results.goalReachable && inputs.monthlyContribution > 0 && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-amber-800 font-semibold">Current pace won't reach your goal in time</p>
                <p className="text-amber-600 text-sm mt-1">
                  At {formatCurrency(inputs.monthlyContribution)}/month, you'll reach your goal in{' '}
                  {formatDuration(results.monthsToGoal)} instead of {formatDuration(inputs.targetMonths)}.
                  Consider saving {formatCurrency(results.monthlySavingsNeeded)}/month to stay on track.
                </p>
              </div>
            )}
            {results.goalReachable && results.interestEarned > 0 && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-green-800 font-semibold">
                  Compounding adds {formatCurrency(results.interestEarned)} to your goal
                </p>
                <p className="text-green-600 text-sm mt-1">
                  That's money working for you without any extra effort.
                </p>
              </div>
            )}
            <div className="bg-finance-50 rounded-xl p-4 text-sm text-finance-800">
              <strong>Tip:</strong> Freelancers with{' '}
              <Tooltip text="Income that varies month-to-month, common for freelancers, consultants, and gig workers">
                irregular income
              </Tooltip>{' '}
              should add a 10-20% buffer to monthly savings targets. Save more in good months to cover
              lean periods. Use advanced mode to calculate your buffered amount.
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
