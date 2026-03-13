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
  calculateFreelanceWritingRate,
  DEFAULT_INPUTS,
  EXPERIENCE_LEVELS,
  formatPerWordRate,
  type FreelanceWritingRateInputs,
} from '../../lib/calculators/freelance-writing-rate';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function FreelanceWritingRateCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } =
    useCalculatorState<FreelanceWritingRateInputs>(DEFAULT_INPUTS);

  const results = calculateFreelanceWritingRate(inputs);

  const getResultsText = () =>
    `Freelance Writing Rate Calculator (CalcFalcon)\n` +
    `Per-Word Rate: ${formatPerWordRate(results.perWordRate)}\n` +
    `Per-Article Rate: ${formatCurrency(results.perArticleRate)}\n` +
    `Effective Hourly: ${formatCurrency(results.effectiveHourlyRate)}\n` +
    `Monthly (4 articles): ${formatCurrency(results.monthlyIncome4)}\n` +
    `Monthly (8 articles): ${formatCurrency(results.monthlyIncome8)}\n` +
    `https://calcfalcon.com/side-hustle/freelance-writing-rate-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using 1hr research, 1 revision, 10% admin time
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Article Details</h3>
          <NumberInput
            id="wordCount"
            label="Word Count"
            value={inputs.wordCount}
            onChange={(v) => updateInput('wordCount', v)}
            min={100}
            max={10000}
            step={100}
            suffix="words"
            helpText="Target word count for the article"
          />
          <NumberInput
            id="hoursToWrite"
            label="Hours to Write"
            value={inputs.hoursToWrite}
            onChange={(v) => updateInput('hoursToWrite', v)}
            min={0.5}
            max={40}
            step={0.5}
            suffix="hrs"
            helpText="Time spent writing the first draft"
          />
          <CurrencyInput
            id="desiredHourlyRate"
            label="Desired Hourly Rate"
            value={inputs.desiredHourlyRate}
            onChange={(v) => updateInput('desiredHourlyRate', v)}
            min={10}
            max={500}
            step={5}
            helpText="Your target hourly rate for writing work"
          />
          <DropdownInput
            id="experienceLevel"
            label="Experience Level"
            value={inputs.experienceLevel}
            onChange={(v) => updateInput('experienceLevel', v)}
            options={EXPERIENCE_LEVELS}
            helpText="Your writing experience level"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Time & Expenses</h3>
          {isAdvanced && (
            <NumberInput
              id="researchHours"
              label="Research Hours"
              value={inputs.researchHours}
              onChange={(v) => updateInput('researchHours', v)}
              min={0}
              max={20}
              step={0.5}
              suffix="hrs"
              helpText="Time spent researching the topic"
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
              helpText="Number of revision cycles with the client"
            />
          )}
          {isAdvanced && (
            <NumberInput
              id="revisionHoursPerRound"
              label="Hours Per Revision"
              value={inputs.revisionHoursPerRound}
              onChange={(v) => updateInput('revisionHoursPerRound', v)}
              min={0}
              max={8}
              step={0.5}
              suffix="hrs"
              helpText="Time spent on each round of revisions"
            />
          )}
          {isAdvanced && (
            <SliderInput
              id="adminTimePercent"
              label="Admin Time"
              value={inputs.adminTimePercent}
              onChange={(v) => updateInput('adminTimePercent', v)}
              min={0}
              max={30}
              step={1}
              formatValue={(v) => `${v}%`}
              helpText="Time for emails, invoicing, client calls"
            />
          )}
          {isAdvanced && (
            <CurrencyInput
              id="clientAcquisitionCost"
              label="Client Acquisition Cost"
              value={inputs.clientAcquisitionCost}
              onChange={(v) => updateInput('clientAcquisitionCost', v)}
              min={0}
              max={500}
              step={5}
              helpText="Cost to land this client (pitching, samples)"
            />
          )}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Writing Rate</h3>
          <CopyResultsButton getResultsText={getResultsText} category="sidehustle" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label={
              <Tooltip text="Industry rates range from $0.03/word (beginner) to $1.00+/word (expert)">
                Per-Word Rate
              </Tooltip>
            }
            value={formatPerWordRate(results.perWordRate)}
            highlight
            size="lg"
            category="sidehustle"
          />
          <ResultCard
            label="Per-Article Rate"
            value={formatCurrency(results.perArticleRate)}
            numericValue={results.perArticleRate}
            formatFn={formatCurrency}
            description={`For ${inputs.wordCount} words`}
          />
          <ResultCard
            label={
              <Tooltip text="Your actual hourly rate after accounting for all time spent">
                Effective Hourly Rate
              </Tooltip>
            }
            value={formatCurrency(results.effectiveHourlyRate)}
            numericValue={results.effectiveHourlyRate}
            formatFn={formatCurrency}
            description="After all time included"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <ResultCard
            label="Monthly Income (4 articles)"
            value={formatCurrency(results.monthlyIncome4)}
            numericValue={results.monthlyIncome4}
            formatFn={formatCurrency}
            description="Part-time writing pace"
            size="sm"
          />
          <ResultCard
            label="Monthly Income (8 articles)"
            value={formatCurrency(results.monthlyIncome8)}
            numericValue={results.monthlyIncome8}
            formatFn={formatCurrency}
            description="More active writing pace"
            size="sm"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Time Breakdown"
            category="sidehustle"
            items={[
              { label: 'Writing', value: `${results.writingHours} hrs` },
              ...(results.researchHours > 0
                ? [{ label: 'Research', value: `${results.researchHours} hrs` }]
                : []),
              ...(results.revisionHours > 0
                ? [{ label: 'Revisions', value: `${results.revisionHours} hrs` }]
                : []),
              ...(results.adminHours > 0
                ? [{ label: 'Admin', value: `${results.adminHours} hrs` }]
                : []),
              { label: 'Total Hours', value: `${results.totalHours} hrs`, highlight: true },
            ]}
          />
          <div className="space-y-4">
            <div className="bg-sidehustle-50 rounded-xl p-4 text-sm text-sidehustle-800">
              <strong>Rate tip:</strong> Expert writers charge $0.25-$1.00+/word. If your rate is
              below $0.10/word, you're likely undercharging.
            </div>
          </div>
        </div>

        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Using {DEFAULT_INPUTS.researchHours}hr research, {DEFAULT_INPUTS.revisionRounds} revision round, {DEFAULT_INPUTS.adminTimePercent}% admin time.{' '}
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
