import { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { NumberInput } from '../ui/inputs/NumberInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateSideHustleGoal,
  DEFAULT_INPUTS,
  type SideHustleGoalInputs,
} from '../../lib/calculators/side-hustle-goal';
import { formatCurrency, formatDuration, formatNumber } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState } from '../../lib/utils/url-state';

export function SideHustleGoalCalc() {
  const [inputs, setInputs] = useState<SideHustleGoalInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateSideHustleGoal(inputs);

  useEffect(() => {
    updateUrlState(inputs);
  }, [inputs]);

  const updateInput = <K extends keyof SideHustleGoalInputs>(
    key: K,
    value: SideHustleGoalInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const progressPercentage = Math.min(
    (inputs.currentSavings / inputs.goalAmount) * 100,
    100
  );

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Your Goal</h3>
          <CurrencyInput
            id="goalAmount"
            label="Target Amount"
            value={inputs.goalAmount}
            onChange={(v) => updateInput('goalAmount', v)}
            min={100}
            max={1000000}
            step={1000}
            helpText="Your financial goal"
          />
          <CurrencyInput
            id="currentSavings"
            label="Already Saved"
            value={inputs.currentSavings}
            onChange={(v) => updateInput('currentSavings', v)}
            min={0}
            max={inputs.goalAmount}
            step={100}
            helpText="Amount you've already saved toward this goal"
          />

          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(inputs.goalAmount - inputs.currentSavings)} remaining
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Side Hustle Details</h3>
          <NumberInput
            id="weeklyHours"
            label="Hours Per Week"
            value={inputs.weeklyHours}
            onChange={(v) => updateInput('weeklyHours', v)}
            min={1}
            max={40}
            suffix="hours"
            helpText="Time you can dedicate weekly"
          />
          <CurrencyInput
            id="hourlyRate"
            label="Starting Hourly Rate"
            value={inputs.hourlyRate}
            onChange={(v) => updateInput('hourlyRate', v)}
            min={1}
            max={500}
            step={5}
            helpText="Your current effective hourly rate"
          />
          <SliderInput
            id="growthRate"
            label="Monthly Growth Rate"
            value={inputs.monthlyGrowthRate}
            onChange={(v) => updateInput('monthlyGrowthRate', v)}
            min={0}
            max={20}
            step={1}
            formatValue={(v) => `${v}%`}
            helpText="Expected monthly rate increase"
          />
          <SliderInput
            id="expenseRate"
            label="Expense/Tax Rate"
            value={inputs.expenseRate}
            onChange={(v) => updateInput('expenseRate', v)}
            min={0}
            max={50}
            step={5}
            formatValue={(v) => `${v}%`}
            helpText="% going to taxes and expenses"
          />
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Your Timeline</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ResultCard
            label="Time to Goal"
            value={formatDuration(results.monthsToGoal)}
            highlight
            size="md"
          />
          <ResultCard
            label="Target Date"
            value={formatDate(results.targetDate)}
            size="sm"
          />
          <ResultCard
            label="Total Hours"
            value={formatNumber(results.totalHoursWorked)}
            description="hours of work"
            size="sm"
          />
          <ResultCard
            label="Avg Monthly"
            value={formatCurrency(results.averageMonthlyEarnings)}
            description="net earnings"
            size="sm"
          />
        </div>

        {results.milestones.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Milestones</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {results.milestones.map((milestone) => (
                <div
                  key={milestone.percentage}
                  className="bg-green-50 border border-green-200 rounded-lg p-3"
                >
                  <p className="text-green-800 font-semibold">
                    {milestone.percentage}% - {formatCurrency(milestone.amount)}
                  </p>
                  <p className="text-sm text-green-600">
                    Month {milestone.month} ({formatDate(milestone.date)})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {results.timeline.length > 0 && (
            <ResultBreakdown
              title="Monthly Projection (First Year)"
              items={results.timeline.slice(0, 12).map((m) => ({
                label: `Month ${m.month}`,
                value: `${formatCurrency(Math.round(m.earnings))} (${formatCurrency(Math.round(m.cumulative))} total)`,
                highlight: results.milestones.some((ms) => ms.month === m.month),
              }))}
            />
          )}

          <div className="space-y-4">
            <ResultBreakdown
              title="Summary"
              items={[
                { label: 'Starting Rate', value: formatCurrency(inputs.hourlyRate) + '/hr' },
                { label: 'Final Rate', value: formatCurrency(results.finalHourlyRate) + '/hr' },
                { label: 'Total Earned', value: formatCurrency(results.totalEarned) },
                {
                  label: 'Effective Hourly',
                  value: formatCurrency(
                    results.totalHoursWorked > 0
                      ? results.totalEarned / results.totalHoursWorked
                      : 0
                  ) + '/hr',
                  highlight: true,
                },
              ]}
            />

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
              <strong>Tips to reach your goal faster:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Increase your hourly rate by adding skills</li>
                <li>Find ways to add 2-3 more hours per week</li>
                <li>Reduce expenses to keep more earnings</li>
                <li>Consider productizing your services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
