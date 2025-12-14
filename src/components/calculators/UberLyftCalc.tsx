import { useState, useEffect } from 'react';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateUberLyftEarnings,
  DEFAULT_INPUTS,
  type UberLyftInputs,
} from '../../lib/calculators/uber-lyft-earnings';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

const platformOptions = [
  { value: 'uber', label: 'Uber' },
  { value: 'lyft', label: 'Lyft' },
  { value: 'both', label: 'Both Platforms' },
];

export function UberLyftCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<UberLyftInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateUberLyftEarnings(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof UberLyftInputs>(
    key: K,
    value: UberLyftInputs[K]
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
            Using 28 MPG, $3.50/gal, $0.05/mile maintenance
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Earnings & Activity</h3>
          <CurrencyInput
            id="grossEarnings"
            label="Gross Weekly Earnings"
            value={inputs.grossWeeklyEarnings}
            onChange={(v) => updateInput('grossWeeklyEarnings', v)}
            min={0}
            max={5000}
            step={50}
            helpText="Total earnings before expenses (from app)"
          />
          <NumberInput
            id="miles"
            label="Miles Driven Per Week"
            value={inputs.milesDriven}
            onChange={(v) => updateInput('milesDriven', v)}
            min={0}
            max={2000}
            step={10}
            suffix="miles"
            helpText="Total miles while online"
          />
          {isAdvanced && (
            <NumberInput
              id="hours"
              label="Hours Worked Per Week"
              value={inputs.hoursWorked}
              onChange={(v) => updateInput('hoursWorked', v)}
              min={1}
              max={80}
              suffix="hours"
              helpText="Total hours while online"
            />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Vehicle & Costs</h3>
          {isAdvanced && (
            <DropdownInput
              id="platform"
              label="Platform"
              value={inputs.platform}
              onChange={(v) => updateInput('platform', v as 'uber' | 'lyft' | 'both')}
              options={platformOptions}
              helpText="Which rideshare service(s)"
            />
          )}
          {isAdvanced && (
            <CurrencyInput
              id="gasPrice"
              label="Gas Price Per Gallon"
              value={inputs.gasPrice}
              onChange={(v) => updateInput('gasPrice', v)}
              min={2}
              max={8}
              step={0.1}
              helpText="Current price at the pump"
            />
          )}
          {isAdvanced && (
            <NumberInput
              id="mpg"
              label="Vehicle MPG"
              value={inputs.vehicleMpg}
              onChange={(v) => updateInput('vehicleMpg', v)}
              min={15}
              max={60}
              suffix="mpg"
              helpText="Your car's fuel efficiency"
            />
          )}
          {isAdvanced && (
            <CurrencyInput
              id="maintenance"
              label="Maintenance Cost Per Mile"
              value={inputs.maintenanceCostPerMile}
              onChange={(v) => updateInput('maintenanceCostPerMile', v)}
              min={0}
              max={0.30}
              step={0.01}
              helpText="Oil, tires, repairs averaged"
            />
          )}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <h3 className="font-semibold text-neutral-900 mb-4">Your Earnings</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Weekly Net"
            value={formatCurrency(results.weeklyNet)}
            description="After all expenses"
            highlight
            size="lg"
            category="gig"
          />
          <ResultCard
            label="Effective Hourly"
            value={formatCurrency(results.effectiveHourlyRate)}
            description={`${inputs.hoursWorked} hrs/week`}
          />
          <ResultCard
            label="Cost Per Mile"
            value={formatCurrency(results.costPerMile)}
            description="Total vehicle cost"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Weekly Expense Breakdown"
            category="gig"
            items={[
              { label: 'Gross Earnings', value: formatCurrency(results.weeklyGross) },
              { label: 'Gas Cost', value: `-${formatCurrency(results.weeklyGasCost)}` },
              { label: 'Maintenance', value: `-${formatCurrency(results.weeklyMaintenance)}` },
              { label: 'Depreciation', value: `-${formatCurrency(results.weeklyDepreciation)}` },
              { label: 'Net Earnings', value: formatCurrency(results.weeklyNet), highlight: true },
            ]}
          />
          <div className="space-y-4">
            <ResultCard
              label="Monthly Net"
              value={formatCurrency(results.monthlyNet)}
              description="4.33 weeks average"
              size="sm"
            />
            <ResultCard
              label="Annual Net"
              value={formatCurrency(results.annualNet)}
              description="52 weeks"
              size="sm"
            />
            <ResultCard
              label="Weekly IRS Deduction"
              value={formatCurrency(results.irsMileageDeduction)}
              description={`${inputs.milesDriven} mi x $0.67`}
              size="sm"
            />
            <div className="bg-gig-50 rounded-xl p-4 text-sm text-gig-800">
              <strong>Tax tip:</strong> Your annual mileage deduction could be{' '}
              {formatCurrency(results.irsMileageDeduction * 52)}. This is usually
              better than deducting actual expenses. Keep detailed mileage logs!
            </div>
          </div>
        </div>

        {/* Quick mode indicator */}
        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Using {DEFAULT_INPUTS.vehicleMpg} MPG, ${DEFAULT_INPUTS.gasPrice}/gal, ${DEFAULT_INPUTS.maintenanceCostPerMile}/mile maintenance, {DEFAULT_INPUTS.hoursWorked} hours/week.{' '}
            <button
              onClick={() => setMode('advanced')}
              className="text-gig-600 hover:underline font-medium"
            >
              Customize these
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
