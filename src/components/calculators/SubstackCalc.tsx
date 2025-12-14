import { useState, useEffect } from 'react';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateSubstackRevenue,
  DEFAULT_INPUTS,
  type SubstackInputs,
} from '../../lib/calculators/substack-revenue';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function SubstackCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<SubstackInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateSubstackRevenue(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof SubstackInputs>(
    key: K,
    value: SubstackInputs[K]
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
            Using 5% conversion, 4% churn, 30% annual plans
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Subscriber Stats</h3>
          <NumberInput
            id="paidSubs"
            label="Paid Subscribers"
            value={inputs.paidSubscribers}
            onChange={(v) => updateInput('paidSubscribers', v)}
            min={0}
            max={100000}
            step={10}
            suffix="subscribers"
            helpText="Current paying subscribers"
          />
          <CurrencyInput
            id="price"
            label="Monthly Subscription Price"
            value={inputs.monthlyPrice}
            onChange={(v) => updateInput('monthlyPrice', v)}
            min={1}
            max={100}
            step={1}
            helpText="Price for monthly subscribers"
          />
        </div>

        {isAdvanced && (
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Growth & Retention</h3>
            <NumberInput
              id="freeSubs"
              label="Free Subscribers"
              value={inputs.freeSubscribers}
              onChange={(v) => updateInput('freeSubscribers', v)}
              min={0}
              max={1000000}
              step={100}
              suffix="subscribers"
              helpText="Email list / free tier"
            />
            <SliderInput
              id="conversionRate"
              label="Annual Conversion Rate"
              value={inputs.conversionRate}
              onChange={(v) => updateInput('conversionRate', v)}
              min={0}
              max={20}
              step={0.5}
              formatValue={(v) => `${v}%`}
              helpText="% of free that convert per year"
            />
            <SliderInput
              id="churnRate"
              label="Monthly Churn Rate"
              value={inputs.churnRate}
              onChange={(v) => updateInput('churnRate', v)}
              min={0}
              max={15}
              step={0.5}
              formatValue={(v) => `${v}%`}
              helpText="% who cancel each month"
            />
            <SliderInput
              id="annualPct"
              label="Annual Plan %"
              value={inputs.annualPlanPercent}
              onChange={(v) => updateInput('annualPlanPercent', v)}
              min={0}
              max={100}
              step={5}
              formatValue={(v) => `${v}%`}
              helpText="% on annual vs monthly plans"
            />
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <h3 className="font-semibold text-neutral-900 mb-4">Your Revenue</h3>
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
            label="Annual Revenue"
            value={formatCurrency(results.annualNet)}
            description="Projected yearly"
          />
          <ResultCard
            label="Per Subscriber"
            value={formatCurrency(results.revenuePerSubscriber)}
            description="Monthly net/subscriber"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Fee Breakdown"
            category="creator"
            items={[
              { label: 'Monthly Gross', value: formatCurrency(results.monthlyGross) },
              { label: 'Substack Fee (10%)', value: `-${formatCurrency(results.substackFee)}` },
              { label: 'Stripe Fees', value: `-${formatCurrency(results.stripeFee)}` },
              { label: 'Net Revenue', value: formatCurrency(results.monthlyNet), highlight: true },
            ]}
          />
          <div className="space-y-4">
            <ResultCard
              label="Effective Fee Rate"
              value={`${results.effectiveFeePct}%`}
              description="Total fees as % of gross"
              size="sm"
            />
            {isAdvanced && (
              <>
                <ResultCard
                  label="Projected Paid (6 mo)"
                  value={results.projectedPaid6Mo.toLocaleString()}
                  description="With conversions & churn"
                  size="sm"
                />
                <ResultCard
                  label="Projected Paid (12 mo)"
                  value={results.projectedPaid12Mo.toLocaleString()}
                  description="Based on current rates"
                  size="sm"
                />
              </>
            )}
            <div className="bg-creator-50 rounded-xl p-4 text-sm text-creator-800">
              <strong>Pro tip:</strong> Push annual subscriptions—you get 10 months
              of revenue upfront and annual subscribers churn at 1/3 the rate of
              monthly subscribers.
            </div>
          </div>
        </div>

        {/* Quick mode indicator */}
        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Using {DEFAULT_INPUTS.freeSubscribers.toLocaleString()} free subscribers, {DEFAULT_INPUTS.conversionRate}% conversion, {DEFAULT_INPUTS.churnRate}% churn, {DEFAULT_INPUTS.annualPlanPercent}% annual plans.{' '}
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
