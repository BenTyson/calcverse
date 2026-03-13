import { ErrorBoundary } from '../ui/ErrorBoundary';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateDoorDashEarnings,
  DEFAULT_INPUTS,
  type DoorDashInputs,
} from '../../lib/calculators/doordash-earnings';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function DoorDashCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } =
    useCalculatorState<DoorDashInputs>(DEFAULT_INPUTS);

  const results = calculateDoorDashEarnings(inputs);

  const getResultsText = () =>
    `DoorDash Earnings Calculator (CalcFalcon)\n` +
    `Weekly Net: ${formatCurrency(results.weeklyNet)}\n` +
    `Effective Hourly: ${formatCurrency(results.effectiveHourlyRate)}\n` +
    `Monthly Net: ${formatCurrency(results.monthlyNet)}\n` +
    `https://calcfalcon.com/gig-economy/doordash-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using $3 base pay, 5 miles/delivery, 25 MPG
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Delivery Stats</h3>
          <NumberInput
            id="deliveries"
            label="Deliveries Per Week"
            value={inputs.deliveriesPerWeek}
            onChange={(v) => updateInput('deliveriesPerWeek', v)}
            min={1}
            max={200}
            step={1}
            suffix="deliveries"
            helpText="Total deliveries you complete weekly"
          />
          <CurrencyInput
            id="avgTip"
            label="Average Tip Per Delivery"
            value={inputs.averageTip}
            onChange={(v) => updateInput('averageTip', v)}
            min={0}
            max={50}
            step={0.5}
            helpText="Your typical tip amount"
          />
          {isAdvanced && (
            <CurrencyInput
              id="basePay"
              label="Base Pay Per Delivery"
              value={inputs.basePayPerDelivery}
              onChange={(v) => updateInput('basePayPerDelivery', v)}
              min={2}
              max={15}
              step={0.25}
              helpText="DoorDash base pay (usually $2-4)"
            />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Vehicle & Time</h3>
          {isAdvanced && (
            <NumberInput
              id="miles"
              label="Miles Per Delivery"
              value={inputs.milesPerDelivery}
              onChange={(v) => updateInput('milesPerDelivery', v)}
              min={1}
              max={20}
              step={0.5}
              suffix="miles"
              helpText="Average total miles per delivery"
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
              min={10}
              max={60}
              suffix="mpg"
              helpText="Your car's fuel efficiency"
            />
          )}
          <NumberInput
            id="hours"
            label="Active Hours Per Week"
            value={inputs.activeHoursPerWeek}
            onChange={(v) => updateInput('activeHoursPerWeek', v)}
            min={1}
            max={60}
            suffix="hours"
            helpText="Time spent actively dashing"
          />
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Earnings</h3>
          <CopyResultsButton getResultsText={getResultsText} category="gig" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Weekly Net"
            value={formatCurrency(results.weeklyNet)}
            numericValue={results.weeklyNet}
            formatFn={formatCurrency}
            description="After gas costs"
            highlight
            size="lg"
            category="gig"
          />
          <ResultCard
            label="Effective Hourly"
            value={formatCurrency(results.effectiveHourlyRate)}
            description="Net earnings/hour"
          />
          <ResultCard
            label="Per Delivery"
            value={formatCurrency(results.earningsPerDelivery)}
            description="Base + tip avg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Weekly Breakdown"
            category="gig"
            items={[
              { label: 'Base Pay', value: formatCurrency(inputs.deliveriesPerWeek * inputs.basePayPerDelivery) },
              { label: 'Tips', value: formatCurrency(inputs.deliveriesPerWeek * inputs.averageTip) },
              { label: 'Gross Earnings', value: formatCurrency(results.weeklyGross) },
              { label: 'Gas Cost', value: `-${formatCurrency(results.weeklyGasCost)}` },
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
              label="Weekly Miles"
              value={results.weeklyMiles.toLocaleString()}
              description={`${formatCurrency(results.costPerMile)}/mile gas`}
              size="sm"
            />
            <div className="bg-gig-50 rounded-xl p-4 text-sm text-gig-800">
              <strong>Tax tip:</strong> Track your miles! The <Tooltip text="You can deduct $0.67 per business mile driven instead of tracking actual vehicle expenses">IRS mileage deduction</Tooltip> allows $0.67/mile
              for 2024. At {results.weeklyMiles} miles/week, that's{' '}
              {formatCurrency(results.weeklyMiles * 0.67 * 52)}/year in deductions.
            </div>
          </div>
        </div>

        {/* Quick mode indicator */}
        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Using ${DEFAULT_INPUTS.basePayPerDelivery} base pay, {DEFAULT_INPUTS.milesPerDelivery} miles/delivery, ${DEFAULT_INPUTS.gasPrice}/gal, {DEFAULT_INPUTS.vehicleMpg} MPG.{' '}
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
    </ErrorBoundary>
  );
}
