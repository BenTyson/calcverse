import { ErrorBoundary } from '../ui/ErrorBoundary';
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
  calculateConsultingFee,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  EXPERIENCE_OPTIONS,
  INDUSTRY_OPTIONS,
  type ConsultingFeeInputs,
  type ExperienceLevel,
  type Industry,
} from '../../lib/calculators/consulting-fee';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function ConsultingFeeCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } =
    useCalculatorState<ConsultingFeeInputs>(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  const results = calculateConsultingFee(inputs);

  const getResultsText = () =>
    `Consulting Fee Calculator (CalcFalcon)\n` +
    `Hourly Rate: ${formatCurrency(results.hourlyRate)}\n` +
    `Daily Rate: ${formatCurrency(results.dailyRate)}\n` +
    `Project Rate: ${formatCurrency(results.projectRate)}\n` +
    `Monthly Retainer: ${formatCurrency(results.monthlyRetainer)}\n` +
    `https://calcfalcon.com/freelance/consulting-fee-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Standard value, no travel/rush premiums
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Your Profile</h3>
          <DropdownInput
            id="experienceLevel"
            label="Experience Level"
            value={inputs.experienceLevel}
            onChange={(v) => updateInput('experienceLevel', v as ExperienceLevel)}
            options={EXPERIENCE_OPTIONS}
            helpText="Years of professional consulting experience"
          />
          <DropdownInput
            id="industry"
            label="Industry"
            value={inputs.industry}
            onChange={(v) => updateInput('industry', v as Industry)}
            options={INDUSTRY_OPTIONS}
            helpText="Your primary consulting industry"
          />
          <SliderInput
            id="locationFactor"
            label="Location Factor"
            value={inputs.locationFactor}
            onChange={(v) => updateInput('locationFactor', v)}
            min={60}
            max={160}
            step={5}
            formatValue={(v) => `${v}%`}
            helpText="100% = average US market. Higher for NYC/SF, lower for smaller markets"
          />
          <SliderInput
            id="specializationPremium"
            label="Specialization Premium"
            value={inputs.specializationPremium}
            onChange={(v) => updateInput('specializationPremium', v)}
            min={0}
            max={100}
            step={5}
            formatValue={(v) => `${v}%`}
            helpText="Premium for niche expertise or rare skills"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Engagement Details</h3>
          <NumberInput
            id="hoursPerDay"
            label="Hours Per Day"
            value={inputs.hoursPerDay}
            onChange={(v) => updateInput('hoursPerDay', v)}
            min={1}
            max={12}
            step={1}
            suffix="hours"
            helpText="Billable hours per day for daily rate"
          />
          <NumberInput
            id="daysPerProject"
            label="Days Per Project"
            value={inputs.daysPerProject}
            onChange={(v) => updateInput('daysPerProject', v)}
            min={1}
            max={120}
            step={1}
            suffix="days"
            helpText="Typical project length in working days"
          />
          <NumberInput
            id="monthlyHours"
            label="Retainer Hours/Month"
            value={inputs.monthlyHours}
            onChange={(v) => updateInput('monthlyHours', v)}
            min={5}
            max={160}
            step={5}
            suffix="hours"
            helpText="Hours included in a monthly retainer"
          />

          {isAdvanced && (
            <>
              <SliderInput
                id="valueMultiplier"
                label="Value Multiplier"
                value={inputs.valueMultiplier}
                onChange={(v) => updateInput('valueMultiplier', v)}
                min={50}
                max={200}
                step={5}
                formatValue={(v) => `${v}%`}
                helpText="Adjust for high-value engagements (>100%) or competitive pricing (<100%)"
              />
              <SliderInput
                id="travelPremium"
                label="Travel Premium"
                value={inputs.travelPremium}
                onChange={(v) => updateInput('travelPremium', v)}
                min={0}
                max={100}
                step={5}
                formatValue={(v) => `${v}%`}
                helpText="Additional charge for on-site travel engagements"
              />
              <SliderInput
                id="rushMultiplier"
                label="Rush Rate"
                value={inputs.rushMultiplier}
                onChange={(v) => updateInput('rushMultiplier', v)}
                min={100}
                max={250}
                step={10}
                formatValue={(v) => `${v}%`}
                helpText="Multiplier for expedited or urgent work"
              />
              <NumberInput
                id="billableWeeksPerYear"
                label="Billable Weeks/Year"
                value={inputs.billableWeeksPerYear}
                onChange={(v) => updateInput('billableWeeksPerYear', v)}
                min={20}
                max={52}
                step={1}
                suffix="weeks"
                helpText="Weeks per year you expect to bill (for annual projection)"
              />
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Consulting Rates</h3>
          <CopyResultsButton getResultsText={getResultsText} category="freelance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ResultCard
            label="Hourly Rate"
            value={formatCurrency(results.hourlyRate)}
            numericValue={results.hourlyRate}
            formatFn={formatCurrency}
            description="Per hour"
            highlight
            category="freelance"
          />
          <ResultCard
            label="Daily Rate"
            value={formatCurrency(results.dailyRate)}
            numericValue={results.dailyRate}
            formatFn={formatCurrency}
            description={`${inputs.hoursPerDay} hours/day`}
          />
          <ResultCard
            label="Project Rate"
            value={formatCurrency(results.projectRate)}
            numericValue={results.projectRate}
            formatFn={formatCurrency}
            description={`${inputs.daysPerProject} days`}
          />
          <ResultCard
            label="Monthly Retainer"
            value={formatCurrency(results.monthlyRetainer)}
            numericValue={results.monthlyRetainer}
            formatFn={formatCurrency}
            description={`${inputs.monthlyHours} hours/month`}
          />
        </div>

        <ChartCard title="Rate Comparison" category="freelance" className="mb-6">
          <BarComparisonChart
            data={results.comparisonData.map((d) => ({
              label: d.label,
              rate: d.rate,
            }))}
            bars={[
              { dataKey: 'rate', label: 'Recommended Rate' },
            ]}
            category="freelance"
          />
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Rate Calculation"
            category="freelance"
            items={results.breakdown.map((b) => ({
              label: b.label,
              value: b.value,
            }))}
          />
          <div className="space-y-4">
            {isAdvanced && (
              <ResultBreakdown
                title="Premium Rates"
                category="freelance"
                items={[
                  { label: <Tooltip text="Higher rate charged for work that needs to be done on a compressed timeline">Rush Rate</Tooltip>, value: formatCurrency(results.rushHourlyRate) + '/hr' },
                  { label: 'Annual Revenue Projection', value: formatCurrency(results.annualRevenue), highlight: true },
                ]}
              />
            )}
            <div className="bg-freelance-50 rounded-xl p-4 text-sm text-freelance-800">
              <strong>Tip:</strong>{' '}
              <Tooltip text="A retainer is a recurring fee a client pays to reserve your availability for a set number of hours each month">
                Retainer
              </Tooltip>{' '}
              arrangements provide predictable income. Offer a 10-15% discount on your hourly rate for retainer
              commitments to incentivize longer-term engagements.
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
