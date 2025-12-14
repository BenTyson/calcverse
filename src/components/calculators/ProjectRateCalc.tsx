import { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { NumberInput } from '../ui/inputs/NumberInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateProjectRate,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  COMPLEXITY_OPTIONS,
  RUSH_OPTIONS,
  type ProjectRateInputs,
} from '../../lib/calculators/project-rate';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function ProjectRateCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<ProjectRateInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  useEffect(() => {
    if (mode === 'quick') {
      setInputs((prev) => ({ ...prev, ...QUICK_MODE_DEFAULTS }));
    }
  }, [mode]);

  const results = calculateProjectRate(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof ProjectRateInputs>(
    key: K,
    value: ProjectRateInputs[K]
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
            Includes 2 revisions, 15% scope buffer, 10% profit
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Base Pricing */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Base Pricing</h3>

          <CurrencyInput
            id="hourlyRate"
            label="Your Hourly Rate"
            value={inputs.hourlyRate}
            onChange={(v) => updateInput('hourlyRate', v)}
            min={0}
            max={1000}
            step={5}
            helpText="What you charge per hour"
          />

          <NumberInput
            id="estimatedHours"
            label="Estimated Hours"
            value={inputs.estimatedHours}
            onChange={(v) => updateInput('estimatedHours', v)}
            min={1}
            max={1000}
            step={1}
            suffix=" hrs"
            helpText="Time to complete the project"
          />

          {isAdvanced && (
            <DropdownInput
              id="complexityMultiplier"
              label="Project Complexity"
              value={inputs.complexityMultiplier.toString()}
              onChange={(v) => updateInput('complexityMultiplier', parseFloat(v))}
              options={COMPLEXITY_OPTIONS.map(o => ({ value: o.value.toString(), label: o.label }))}
              helpText="Adjust for technical difficulty"
            />
          )}

          {isAdvanced && (
            <DropdownInput
              id="rushMultiplier"
              label="Timeline"
              value={inputs.rushMultiplier.toString()}
              onChange={(v) => updateInput('rushMultiplier', parseFloat(v))}
              options={RUSH_OPTIONS.map(o => ({ value: o.value.toString(), label: o.label }))}
              helpText="Rush fees for tight deadlines"
            />
          )}
        </div>

        {/* Adjustments */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Adjustments' : 'Project Details'}
          </h3>

          {isAdvanced && (
            <NumberInput
              id="revisionRounds"
              label="Revision Rounds Included"
              value={inputs.revisionRounds}
              onChange={(v) => updateInput('revisionRounds', v)}
              min={0}
              max={10}
              step={1}
              helpText="How many rounds of changes"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="hoursPerRevision"
              label="Hours Per Revision"
              value={inputs.hoursPerRevision}
              onChange={(v) => updateInput('hoursPerRevision', v)}
              min={0}
              max={20}
              step={0.5}
              suffix=" hrs"
              helpText="Average time per revision round"
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
              helpText="Buffer for scope creep/unknowns"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="profitMargin"
              label="Profit Margin"
              value={inputs.profitMargin}
              onChange={(v) => updateInput('profitMargin', v)}
              min={0}
              max={50}
              step={5}
              suffix="%"
              helpText="Additional margin above costs"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="expenses"
              label="Pass-Through Expenses"
              value={inputs.expenses}
              onChange={(v) => updateInput('expenses', v)}
              min={0}
              max={50000}
              step={50}
              helpText="Stock photos, software, etc."
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <h3 className="font-semibold text-neutral-900 mb-4">Your Project Quote</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Project Price"
            value={formatCurrency(results.totalProjectPrice)}
            description="Total quote to client"
            category="freelance"
            highlighted
          />
          <ResultCard
            label="Effective Hourly"
            value={formatCurrency(results.effectiveHourlyRate)}
            description="What you actually earn/hr"
            category="freelance"
          />
          <ResultCard
            label="Base Hours Value"
            value={formatCurrency(results.basePrice)}
            description={`${inputs.estimatedHours} hrs × ${formatCurrency(inputs.hourlyRate)}`}
            category="freelance"
          />
        </div>

        {/* Pricing Tiers */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">Suggested Pricing Tiers</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {results.pricingTiers.map((tier, index) => (
              <div
                key={tier.label}
                className={`p-4 rounded-xl border-2 ${
                  index === 1
                    ? 'border-freelance-500 bg-freelance-50'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${index === 1 ? 'text-freelance-700' : 'text-neutral-700'}`}>
                    {tier.label}
                  </span>
                  {index === 1 && (
                    <span className="text-xs bg-freelance-500 text-white px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className={`text-2xl font-bold ${index === 1 ? 'text-freelance-900' : 'text-neutral-900'}`}>
                  {formatCurrency(tier.price)}
                </p>
                <p className="text-sm text-neutral-500 mt-1">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>

        <ResultBreakdown
          title="Price Breakdown"
          items={[
            { label: `Base (${inputs.estimatedHours} hrs × ${formatCurrency(inputs.hourlyRate)})`, value: formatCurrency(results.basePrice) },
            ...(results.complexityAdjustment > 0 ? [{ label: 'Complexity Adjustment', value: `+${formatCurrency(results.complexityAdjustment)}` }] : []),
            ...(results.rushAdjustment > 0 ? [{ label: 'Rush Fee', value: `+${formatCurrency(results.rushAdjustment)}` }] : []),
            { label: `Revisions (${inputs.revisionRounds} × ${inputs.hoursPerRevision} hrs)`, value: formatCurrency(results.revisionCost) },
            { label: `Scope Buffer (${inputs.scopeBuffer}%)`, value: formatCurrency(results.scopeBufferAmount) },
            { label: `Profit Margin (${inputs.profitMargin}%)`, value: formatCurrency(results.profitAmount) },
            ...(results.expensesTotal > 0 ? [{ label: 'Expenses', value: formatCurrency(results.expensesTotal) }] : []),
            { label: 'Total Project Price', value: formatCurrency(results.totalProjectPrice), highlighted: true },
          ]}
          category="freelance"
        />

        {/* Tips */}
        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <h4 className="font-semibold text-amber-900 mb-2">Pricing Tips</h4>
          <ul className="text-amber-800 text-sm space-y-1">
            <li>• Never quote without understanding full scope - add buffer for unknowns</li>
            <li>• Consider value-based pricing for high-impact projects</li>
            <li>• Rush fees protect your schedule and compensate for stress</li>
            <li>• Always get 30-50% upfront before starting work</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
