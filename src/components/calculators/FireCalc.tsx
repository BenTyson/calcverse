import { useState, useEffect } from 'react';
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
  calculateFire,
  DEFAULT_INPUTS,
  type FireInputs,
} from '../../lib/calculators/fire';
import { formatCurrency, formatNumber } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function FireCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<FireInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateFire(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof FireInputs>(
    key: K,
    value: FireInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';

  const getResultsText = () =>
    `FIRE Calculator (CalcFalcon)\n` +
    `FIRE Number: ${formatCurrency(results.fireNumber)}\n` +
    `Years to FIRE: ${results.yearsToFire}\n` +
    `Monthly Savings Needed: ${formatCurrency(results.monthlyRequired)}\n` +
    `https://calcfalcon.com/personal-finance/fire-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using 7% return, 3% inflation, 4% withdrawal rate
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Your Situation</h3>
          <NumberInput
            id="currentAge"
            label="Current Age"
            value={inputs.currentAge}
            onChange={(v) => updateInput('currentAge', v)}
            min={18}
            max={70}
            helpText="Your current age"
          />
          <NumberInput
            id="retirementAge"
            label="Target Retirement Age"
            value={inputs.retirementAge}
            onChange={(v) => updateInput('retirementAge', v)}
            min={inputs.currentAge + 1}
            max={80}
            helpText="When you want to reach FIRE"
          />
          <CurrencyInput
            id="currentSavings"
            label="Current Savings"
            value={inputs.currentSavings}
            onChange={(v) => updateInput('currentSavings', v)}
            min={0}
            max={5000000}
            step={5000}
            helpText="Total invested assets today"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Income & Savings</h3>
          <CurrencyInput
            id="annualIncome"
            label="Annual Income"
            value={inputs.annualIncome}
            onChange={(v) => updateInput('annualIncome', v)}
            min={10000}
            max={1000000}
            step={5000}
            helpText="Your gross annual income"
          />
          <SliderInput
            id="savingsRate"
            label="Savings Rate"
            value={inputs.savingsRate}
            onChange={(v) => updateInput('savingsRate', v)}
            min={5}
            max={80}
            step={1}
            formatValue={(v) => `${v}%`}
            helpText="Percentage of income you save and invest"
          />
          {isAdvanced && (
            <SliderInput
              id="expectedReturn"
              label="Expected Annual Return"
              value={inputs.expectedReturn}
              onChange={(v) => updateInput('expectedReturn', v)}
              min={1}
              max={15}
              step={0.5}
              formatValue={(v) => `${v}%`}
              helpText="Average annual investment return"
            />
          )}
          {isAdvanced && (
            <SliderInput
              id="inflationRate"
              label="Inflation Rate"
              value={inputs.inflationRate}
              onChange={(v) => updateInput('inflationRate', v)}
              min={0}
              max={8}
              step={0.5}
              formatValue={(v) => `${v}%`}
              helpText="Expected average annual inflation"
            />
          )}
          {isAdvanced && (
            <SliderInput
              id="withdrawalRate"
              label="Withdrawal Rate"
              value={inputs.withdrawalRate}
              onChange={(v) => updateInput('withdrawalRate', v)}
              min={2}
              max={6}
              step={0.25}
              formatValue={(v) => `${v}%`}
              helpText="Annual withdrawal rate in retirement (4% is standard)"
            />
          )}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your FIRE Plan</h3>
          <CopyResultsButton getResultsText={getResultsText} category="finance" />
        </div>

        <div className={`grid sm:grid-cols-2 ${isAdvanced ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 mb-6`}>
          <ResultCard
            label="FIRE Number"
            value={formatCurrency(results.fireNumber)}
            numericValue={results.fireNumber}
            formatFn={formatCurrency}
            description={<Tooltip text="The total amount you need invested to live off withdrawals indefinitely">Annual expenses / withdrawal rate</Tooltip>}
            highlight
            category="finance"
          />
          <ResultCard
            label="Years to FIRE"
            value={formatNumber(results.yearsToFire)}
            description={`Retire at age ${inputs.currentAge + results.yearsToFire}`}
          />
          <ResultCard
            label="Monthly Savings"
            value={formatCurrency(results.monthlyRequired)}
            numericValue={results.monthlyRequired}
            formatFn={formatCurrency}
            description="Required monthly savings"
          />
          {isAdvanced && (
            <ResultCard
              label="Coast FIRE Age"
              value={formatNumber(results.coastFireAge)}
              description={<Tooltip text="Age at which you can stop saving and still reach FIRE by retirement through investment growth alone">Stop saving, still reach FIRE</Tooltip>}
            />
          )}
        </div>

        {results.timeline.length > 1 && (
          <ChartCard title="Savings Projection" category="finance" className="mb-6">
            <ProjectionChart
              data={results.timeline.map((t) => ({
                label: `Age ${t.age}`,
                savings: t.savings,
              }))}
              lines={[
                { dataKey: 'savings', label: 'Portfolio Value', areaFill: true },
              ]}
              category="finance"
              goalLine={{
                value: results.fireNumber,
                label: `FIRE: ${formatCurrency(results.fireNumber)}`,
              }}
            />
          </ChartCard>
        )}

        <div className={`mb-6 p-4 rounded-xl ${results.onTrack ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}`}>
          <p className={`font-semibold ${results.onTrack ? 'text-green-800' : 'text-amber-800'}`}>
            {results.onTrack
              ? `You're on track! At this rate, you'll reach your FIRE number by age ${inputs.currentAge + results.yearsToFire}.`
              : `At your current savings rate, you'll have ${formatCurrency(results.projectedSavingsAtRetirement)} by age ${inputs.retirementAge} — ${formatCurrency(results.fireNumber - results.projectedSavingsAtRetirement)} short of your FIRE number.`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Annual Breakdown"
            category="finance"
            items={[
              { label: 'Annual Income', value: formatCurrency(inputs.annualIncome) },
              { label: <Tooltip text="Annual income minus savings">Annual Expenses</Tooltip>, value: formatCurrency(results.annualExpenses) },
              { label: 'Annual Savings', value: formatCurrency(inputs.annualIncome * inputs.savingsRate / 100) },
              { label: 'Monthly Savings', value: formatCurrency(results.monthlyRequired), highlight: true },
            ]}
          />
          <div className="space-y-4">
            <ResultBreakdown
              title="FIRE Summary"
              category="finance"
              items={[
                { label: <Tooltip text="Total investments needed = annual expenses / withdrawal rate">FIRE Number</Tooltip>, value: formatCurrency(results.fireNumber), highlight: true },
                { label: 'Current Progress', value: `${Math.min(100, Math.round((inputs.currentSavings / results.fireNumber) * 100))}%` },
                { label: 'Projected at Retirement', value: formatCurrency(results.projectedSavingsAtRetirement) },
              ]}
            />
            <div className="bg-finance-50 rounded-xl p-4 text-sm text-finance-800">
              <strong>Tip:</strong> Increasing your savings rate by 5% can shave years off your
              FIRE timeline. Focus on the savings rate — it's the most powerful lever.
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
