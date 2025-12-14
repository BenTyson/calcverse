import { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { NumberInput } from '../ui/inputs/NumberInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateFreelancerRate,
  DEFAULT_INPUTS,
  type FreelancerRateInputs,
} from '../../lib/calculators/freelancer-rate';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function FreelancerRateCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<FreelancerRateInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateFreelancerRate(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof FreelancerRateInputs>(
    key: K,
    value: FreelancerRateInputs[K]
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
            Using smart defaults for tax rates and expenses
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Income Goals</h3>
          <CurrencyInput
            id="desiredIncome"
            label="Desired Annual Take-Home"
            value={inputs.desiredAnnualIncome}
            onChange={(v) => updateInput('desiredAnnualIncome', v)}
            min={0}
            max={500000}
            step={5000}
            helpText="Your target net income after all taxes"
          />

          {/* Advanced: Business Expenses */}
          {isAdvanced && (
            <CurrencyInput
              id="expenses"
              label="Annual Business Expenses"
              value={inputs.annualBusinessExpenses}
              onChange={(v) => updateInput('annualBusinessExpenses', v)}
              min={0}
              max={100000}
              step={500}
              helpText="Software, equipment, marketing, etc."
            />
          )}

          {/* Advanced: Profit Margin */}
          {isAdvanced && (
            <SliderInput
              id="profitMargin"
              label="Profit Margin"
              value={inputs.profitMargin}
              onChange={(v) => updateInput('profitMargin', v)}
              min={0}
              max={50}
              step={5}
              formatValue={(v) => `${v}%`}
              helpText="Buffer for savings, growth, and unexpected costs"
            />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Work Schedule</h3>
          <NumberInput
            id="billableHours"
            label="Billable Hours Per Week"
            value={inputs.billableHoursPerWeek}
            onChange={(v) => updateInput('billableHoursPerWeek', v)}
            min={1}
            max={60}
            suffix="hours"
            helpText="Hours you can actually bill (not admin time)"
          />

          {/* Advanced: Weeks Worked */}
          {isAdvanced && (
            <NumberInput
              id="weeksWorked"
              label="Weeks Worked Per Year"
              value={inputs.weeksWorkedPerYear}
              onChange={(v) => updateInput('weeksWorkedPerYear', v)}
              min={1}
              max={52}
              suffix="weeks"
              helpText="Account for vacation, sick days, holidays"
            />
          )}
        </div>
      </div>

      {/* Advanced: Tax Rates Section */}
      {isAdvanced && (
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Tax Rates</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <SliderInput
              id="seTax"
              label="Self-Employment Tax Rate"
              value={inputs.selfEmploymentTaxRate}
              onChange={(v) => updateInput('selfEmploymentTaxRate', v)}
              min={0}
              max={20}
              step={0.1}
              formatValue={(v) => `${v}%`}
              helpText="US default is 15.3%"
            />
            <SliderInput
              id="incomeTax"
              label="Effective Income Tax Rate"
              value={inputs.effectiveTaxRate}
              onChange={(v) => updateInput('effectiveTaxRate', v)}
              min={0}
              max={50}
              step={1}
              formatValue={(v) => `${v}%`}
              helpText="Your overall income tax bracket"
            />
          </div>
        </div>
      )}

      <div className="border-t border-neutral-200 pt-8">
        <h3 className="font-semibold text-neutral-900 mb-4">Your Rates</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Hourly Rate"
            value={formatCurrency(results.hourlyRate)}
            description="Minimum to charge"
            highlight
            size="lg"
            category="freelance"
          />
          <ResultCard
            label="Daily Rate"
            value={formatCurrency(results.dailyRate)}
            description="8-hour day"
          />
          <ResultCard
            label="Monthly Revenue"
            value={formatCurrency(results.monthlyRevenue)}
            description="Gross income"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Annual Breakdown"
            category="freelance"
            items={[
              ...results.breakdown.map((item) => ({
                label: item.label,
                value: formatCurrency(item.amount),
              })),
              {
                label: 'Total Annual Revenue',
                value: formatCurrency(results.annualRevenue),
                highlight: true,
              },
            ]}
          />
          <div className="space-y-4">
            <ResultCard
              label="Effective Hourly (After Tax)"
              value={formatCurrency(results.effectiveHourlyAfterTax)}
              description="What you actually keep per hour"
              size="sm"
            />
            <ResultCard
              label="Total Taxes"
              value={formatCurrency(results.totalTaxes)}
              description="SE Tax + Income Tax"
              size="sm"
            />
            <div className="bg-primary-50 rounded-xl p-4 text-sm text-primary-800">
              <strong>Pro tip:</strong> Consider charging 10-20% more for rush jobs
              or difficult clients.
            </div>
          </div>
        </div>

        {/* Quick mode indicator */}
        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Based on {DEFAULT_INPUTS.weeksWorkedPerYear} work weeks, {DEFAULT_INPUTS.selfEmploymentTaxRate}% SE tax, {DEFAULT_INPUTS.effectiveTaxRate}% income tax, ${DEFAULT_INPUTS.annualBusinessExpenses.toLocaleString()} expenses, and {DEFAULT_INPUTS.profitMargin}% profit margin.{' '}
            <button
              onClick={() => setMode('advanced')}
              className="text-primary-600 hover:underline font-medium"
            >
              Customize these
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
