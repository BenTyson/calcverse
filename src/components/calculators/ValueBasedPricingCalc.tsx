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
  calculateValueBasedPricing,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  CONFIDENCE_OPTIONS,
  type ValueBasedPricingInputs,
} from '../../lib/calculators/value-based-pricing';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function ValueBasedPricingCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } = useCalculatorState(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  const results = calculateValueBasedPricing(inputs);

  const premiumSign = results.premiumPercent >= 0 ? '+' : '';
  const getResultsText = () =>
    `Value-Based Pricing Calculator (CalcFalcon)\n` +
    `Value-Based Price: ${formatCurrency(results.valueBasedPrice)}\n` +
    `Effective Hourly Rate: ${formatCurrency(results.effectiveHourlyRate)}\n` +
    `Premium Over Hourly: ${premiumSign}${results.premiumPercent}%\n` +
    `https://calcfalcon.com/freelance/value-based-pricing-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using $100/hr rate, 4 weeks, 2 revisions, 15% buffer, medium confidence
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Value Estimate</h3>

          <CurrencyInput
            id="estimatedClientValue"
            label="Estimated Client Value"
            value={inputs.estimatedClientValue}
            onChange={(v) => updateInput('estimatedClientValue', v)}
            min={0}
            max={1000000}
            step={5000}
            helpText="Total value your work creates for the client"
          />

          <SliderInput
            id="valueSharePercent"
            label="Your Value Share"
            value={inputs.valueSharePercent}
            onChange={(v) => updateInput('valueSharePercent', v)}
            min={5}
            max={50}
            step={1}
            suffix="%"
            helpText="Percentage of client value you capture as your fee"
          />

          <NumberInput
            id="estimatedHours"
            label="Estimated Hours"
            value={inputs.estimatedHours}
            onChange={(v) => updateInput('estimatedHours', v)}
            min={1}
            max={500}
            step={5}
            suffix="hours"
            helpText="Estimated hours to complete the project"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Project Details' : 'Details'}
          </h3>

          {isAdvanced && (
            <CurrencyInput
              id="hourlyRate"
              label="Your Standard Hourly Rate"
              value={inputs.hourlyRate}
              onChange={(v) => updateInput('hourlyRate', v)}
              min={0}
              max={500}
              step={5}
              helpText="For comparison with value-based price"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="projectDurationWeeks"
              label="Project Duration"
              value={inputs.projectDurationWeeks}
              onChange={(v) => updateInput('projectDurationWeeks', v)}
              min={1}
              max={52}
              step={1}
              suffix="weeks"
              helpText="Expected timeline for the project"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="revisionRounds"
              label="Revision Rounds"
              value={inputs.revisionRounds}
              onChange={(v) => updateInput('revisionRounds', v)}
              min={0}
              max={5}
              step={1}
              suffix="rounds"
              helpText="Each round adds ~15% of project time"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="scopeBuffer"
              label="Scope Buffer"
              value={inputs.scopeBuffer}
              onChange={(v) => updateInput('scopeBuffer', v)}
              min={0}
              max={50}
              step={5}
              suffix="%"
              helpText="Extra time buffer for scope creep"
            />
          )}

          {isAdvanced && (
            <DropdownInput
              id="confidenceLevel"
              label="Confidence Level"
              value={inputs.confidenceLevel}
              onChange={(v) => updateInput('confidenceLevel', v as ValueBasedPricingInputs['confidenceLevel'])}
              options={CONFIDENCE_OPTIONS}
              helpText="How confident are you in the value estimate?"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Pricing Analysis</h3>
          <CopyResultsButton getResultsText={getResultsText} category="freelance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Value-Based Price"
            value={formatCurrency(results.valueBasedPrice)}
            numericValue={results.valueBasedPrice}
            formatFn={formatCurrency}
            description={`${inputs.valueSharePercent}% of ${formatCurrency(inputs.estimatedClientValue)} value`}
            category="freelance"
            highlight
          />
          <ResultCard
            label="Effective Hourly Rate"
            value={formatCurrency(results.effectiveHourlyRate)}
            description={`Over ${results.totalEstimatedHours} estimated hours`}
            category="freelance"
          />
          <ResultCard
            label="Premium Over Hourly"
            value={`${premiumSign}${results.premiumPercent}%`}
            description={`${premiumSign}${formatCurrency(results.premiumOverHourly)} vs hourly billing`}
            category="freelance"
          />
        </div>

        <ChartCard title="Value-Based vs Hourly Pricing" category="freelance">
          <BarComparisonChart
            data={[
              {
                label: 'Pricing Comparison',
                valueBased: results.valueBasedPrice,
                hourly: results.hourlyComparison,
              },
            ]}
            bars={[
              { dataKey: 'valueBased', label: 'Value-Based' },
              { dataKey: 'hourly', label: 'Hourly Rate' },
            ]}
            category="freelance"
          />
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <ResultBreakdown
            title="Pricing Breakdown"
            items={[
              { label: 'Client Value Created', value: formatCurrency(inputs.estimatedClientValue) },
              { label: <Tooltip text="Pricing based on the value delivered to the client rather than time spent — aligns your incentives with client outcomes">Value-Based Price</Tooltip>, value: formatCurrency(results.valueBasedPrice), highlight: true },
              { label: 'Hourly Billing Equivalent', value: formatCurrency(results.hourlyComparison) },
              { label: 'Premium', value: `${premiumSign}${formatCurrency(results.premiumOverHourly)}` },
            ]}
            category="freelance"
          />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ResultCard
                label="Price Per Week"
                value={formatCurrency(results.pricePerWeek)}
                description={`Over ${inputs.projectDurationWeeks} weeks`}
                category="freelance"
                size="sm"
              />
              <ResultCard
                label="Total Hours"
                value={`${results.totalEstimatedHours}`}
                description="With buffer + revisions"
                category="freelance"
                size="sm"
              />
            </div>

            <div className="bg-freelance-50 rounded-xl p-4 text-sm text-freelance-800">
              <p className="font-medium mb-1">Pricing tip</p>
              <p>
                Value-based pricing works best when you can quantify the outcome — like
                revenue generated, time saved, or cost reduced. Start with a discovery
                call to understand the client's expected ROI before proposing a price.
              </p>
            </div>
          </div>
        </div>

        {mode === 'quick' && (
          <div className="mt-6 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-600">
            <p>
              Quick mode assumes $100/hr comparison rate, 4-week project, 2 revision rounds, 15% scope buffer, medium confidence.{' '}
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
