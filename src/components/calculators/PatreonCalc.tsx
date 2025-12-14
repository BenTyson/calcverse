import { useState, useEffect } from 'react';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculatePatreonEarnings,
  DEFAULT_INPUTS,
  type PatreonInputs,
} from '../../lib/calculators/patreon-earnings';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

const feeTierOptions = [
  { value: 'lite', label: 'Lite (5%)' },
  { value: 'pro', label: 'Pro (8%)' },
  { value: 'premium', label: 'Premium (12%)' },
];

export function PatreonCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<PatreonInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculatePatreonEarnings(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof PatreonInputs>(
    key: K,
    value: PatreonInputs[K]
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
            Using Pro tier (8% fee) and 5% monthly churn
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Patron Stats</h3>
          <NumberInput
            id="patrons"
            label="Number of Patrons"
            value={inputs.numberOfPatrons}
            onChange={(v) => updateInput('numberOfPatrons', v)}
            min={0}
            max={100000}
            step={10}
            helpText="Total active paying patrons"
          />
          <CurrencyInput
            id="pledge"
            label="Average Pledge Amount"
            value={inputs.averagePledge}
            onChange={(v) => updateInput('averagePledge', v)}
            min={1}
            max={1000}
            step={1}
            helpText="Average monthly contribution per patron"
          />
        </div>

        {isAdvanced && (
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Plan & Growth</h3>
            <DropdownInput
              id="feeTier"
              label="Patreon Plan"
              value={inputs.feeTier}
              onChange={(v) => updateInput('feeTier', v as 'lite' | 'pro' | 'premium')}
              options={feeTierOptions}
              helpText="Your Patreon membership tier"
            />
            <SliderInput
              id="churnRate"
              label="Monthly Churn Rate"
              value={inputs.churnRate}
              onChange={(v) => updateInput('churnRate', v)}
              min={0}
              max={20}
              step={1}
              formatValue={(v) => `${v}%`}
              helpText="% of patrons who cancel each month"
            />
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <h3 className="font-semibold text-neutral-900 mb-4">Your Earnings</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Monthly Net"
            value={formatCurrency(results.monthlyNet)}
            description="After all fees"
            highlight
            size="lg"
            category="creator"
          />
          <ResultCard
            label="Annual Earnings"
            value={formatCurrency(results.annualNet)}
            description="Projected yearly"
          />
          <ResultCard
            label="Effective Fee"
            value={`${results.effectiveFeePct}%`}
            description="Total fees percentage"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Fee Breakdown"
            category="creator"
            items={[
              {
                label: 'Monthly Gross',
                value: formatCurrency(results.monthlyGross),
              },
              {
                label: `Patreon Fee`,
                value: `-${formatCurrency(results.patreonFee)}`,
              },
              {
                label: 'Payment Processing',
                value: `-${formatCurrency(results.paymentProcessingFee)}`,
              },
              {
                label: 'Net Earnings',
                value: formatCurrency(results.monthlyNet),
                highlight: true,
              },
            ]}
          />
          <div className="space-y-4">
            {isAdvanced && (
              <>
                <ResultCard
                  label="Projected Patrons (6 mo)"
                  value={results.projectedPatrons6Mo.toLocaleString()}
                  description={`With ${inputs.churnRate}% monthly churn`}
                  size="sm"
                />
                <ResultCard
                  label="Projected Patrons (12 mo)"
                  value={results.projectedPatrons12Mo.toLocaleString()}
                  description="Without new growth"
                  size="sm"
                />
              </>
            )}
            <div className="bg-creator-50 rounded-xl p-4 text-sm text-creator-800">
              <strong>Pro tip:</strong> Reduce churn by engaging regularly with
              patrons and offering exclusive content. Even a 1% churn reduction
              significantly impacts annual revenue.
            </div>
          </div>
        </div>

        {/* Quick mode indicator */}
        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Based on Pro tier (8% + payment processing) and {DEFAULT_INPUTS.churnRate}% monthly churn.{' '}
            <button
              onClick={() => setMode('advanced')}
              className="text-creator-600 hover:underline font-medium"
            >
              Customize these
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
