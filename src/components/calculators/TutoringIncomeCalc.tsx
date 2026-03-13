import { useState, useEffect } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateTutoringIncome,
  DEFAULT_INPUTS,
  TUTORING_PLATFORMS,
  PLATFORM_PRESETS,
  type TutoringIncomeInputs,
} from '../../lib/calculators/tutoring-income';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function TutoringIncomeCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<TutoringIncomeInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateTutoringIncome(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  useEffect(() => {
    const preset = PLATFORM_PRESETS[inputs.platform];
    if (preset) {
      setInputs((prev) => ({ ...prev, platformFeePercent: preset.platformFee }));
    }
  }, [inputs.platform]);

  const updateInput = <K extends keyof TutoringIncomeInputs>(
    key: K,
    value: TutoringIncomeInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';

  const getResultsText = () =>
    `Tutoring Income Calculator (CalcFalcon)\n` +
    `Weekly Net: ${formatCurrency(results.weeklyNet)}\n` +
    `Monthly Net: ${formatCurrency(results.monthlyNet)}\n` +
    `Effective Hourly: ${formatCurrency(results.effectiveHourlyRate)}\n` +
    `https://calcfalcon.com/side-hustle/tutoring-income-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using 0% platform fee, 10 min/hr prep, 5% cancellation rate
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Session Details</h3>
          <CurrencyInput
            id="hourlyRate"
            label="Hourly Rate"
            value={inputs.hourlyRate}
            onChange={(v) => updateInput('hourlyRate', v)}
            min={15}
            max={200}
            step={5}
            helpText="Your per-hour tutoring rate"
          />
          <NumberInput
            id="hoursPerWeek"
            label="Hours Per Week"
            value={inputs.hoursPerWeek}
            onChange={(v) => updateInput('hoursPerWeek', v)}
            min={1}
            max={40}
            step={1}
            suffix="hrs"
            helpText="Total tutoring hours per week"
          />
          <DropdownInput
            id="platform"
            label="Tutoring Platform"
            value={inputs.platform}
            onChange={(v) => updateInput('platform', v)}
            options={TUTORING_PLATFORMS}
            helpText="Platform used to find students"
          />
          <NumberInput
            id="studentsPerWeek"
            label="Students Per Week"
            value={inputs.studentsPerWeek}
            onChange={(v) => updateInput('studentsPerWeek', v)}
            min={1}
            max={30}
            step={1}
            suffix="students"
            helpText="Number of unique students you see weekly"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Fees & Expenses</h3>
          {isAdvanced && (
            <SliderInput
              id="platformFee"
              label="Platform Fee"
              value={inputs.platformFeePercent}
              onChange={(v) => updateInput('platformFeePercent', v)}
              min={0}
              max={40}
              step={1}
              formatValue={(v) => `${v}%`}
              helpText="Fee charged by your tutoring platform"
            />
          )}
          {isAdvanced && (
            <SliderInput
              id="prepTime"
              label="Prep Time"
              value={inputs.prepTimeRatio}
              onChange={(v) => updateInput('prepTimeRatio', v)}
              min={0}
              max={30}
              step={5}
              formatValue={(v) => `${v} min/hr`}
              helpText="Prep time per hour of tutoring"
            />
          )}
          {isAdvanced && (
            <CurrencyInput
              id="travelCost"
              label="Travel Cost Per Session"
              value={inputs.travelCostPerSession}
              onChange={(v) => updateInput('travelCostPerSession', v)}
              min={0}
              max={30}
              step={1}
              helpText="Gas, transit, or parking per student visit"
            />
          )}
          {isAdvanced && (
            <CurrencyInput
              id="materials"
              label="Materials Cost Per Month"
              value={inputs.materialsCostPerMonth}
              onChange={(v) => updateInput('materialsCostPerMonth', v)}
              min={0}
              max={200}
              step={5}
              helpText="Textbooks, worksheets, supplies"
            />
          )}
          {isAdvanced && (
            <SliderInput
              id="cancellationRate"
              label="Cancellation Rate"
              value={inputs.cancellationRatePercent}
              onChange={(v) => updateInput('cancellationRatePercent', v)}
              min={0}
              max={30}
              step={1}
              formatValue={(v) => `${v}%`}
              helpText="Percentage of sessions cancelled without pay"
            />
          )}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Earnings</h3>
          <CopyResultsButton getResultsText={getResultsText} category="sidehustle" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Weekly Net"
            value={formatCurrency(results.weeklyNet)}
            numericValue={results.weeklyNet}
            formatFn={formatCurrency}
            description="After fees & expenses"
            highlight
            size="lg"
            category="sidehustle"
          />
          <ResultCard
            label="Monthly Net"
            value={formatCurrency(results.monthlyNet)}
            description="4.33 weeks average"
          />
          <ResultCard
            label={<><Tooltip text="Your actual hourly rate including prep time">Effective Hourly</Tooltip></>}
            value={formatCurrency(results.effectiveHourlyRate)}
            description="Including prep time"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Weekly Breakdown"
            category="sidehustle"
            items={[
              { label: 'Tutoring Earnings', value: formatCurrency(results.weeklyGross) },
              ...(results.cancellationLoss > 0
                ? [{ label: 'Cancellations', value: `-${formatCurrency(results.cancellationLoss)}` }]
                : []),
              ...(results.platformFees > 0
                ? [{ label: <Tooltip text="Fee charged by your tutoring platform for connecting you with students">Platform Fee</Tooltip>, value: `-${formatCurrency(results.platformFees)}` }]
                : []),
              ...(results.travelCosts > 0
                ? [{ label: 'Travel Costs', value: `-${formatCurrency(results.travelCosts)}` }]
                : []),
              { label: 'Materials', value: `-${formatCurrency(results.materialsCosts)}` },
              { label: 'Net Earnings', value: formatCurrency(results.weeklyNet), highlight: true },
            ]}
          />
          <div className="space-y-4">
            <ResultCard
              label="Annual Projection"
              value={formatCurrency(results.annualProjection)}
              description="52 weeks"
              size="sm"
            />
            <ResultCard
              label="Total Weekly Hours"
              value={results.totalWeeklyHours.toString()}
              description="Including prep time"
              size="sm"
            />
            <div className="bg-sidehustle-50 rounded-xl p-4 text-sm text-sidehustle-800">
              <strong>Platform tip:</strong> Independent tutors keep 100% but must find clients.
              Platform tutors trade 20-25% fees for steady leads.
            </div>
          </div>
        </div>

        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Using {DEFAULT_INPUTS.platformFeePercent}% platform fee, {DEFAULT_INPUTS.prepTimeRatio} min/hr prep, {DEFAULT_INPUTS.cancellationRatePercent}% cancellation rate, ${DEFAULT_INPUTS.materialsCostPerMonth}/mo materials.{' '}
            <button
              onClick={() => setMode('advanced')}
              className="text-sidehustle-600 hover:underline font-medium"
            >
              Customize these
            </button>
          </p>
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
}
