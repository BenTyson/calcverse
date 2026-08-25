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
  calculatePatreonEarnings,
  DEFAULT_INPUTS,
  PATREON_LEGACY_CUTOFF,
  type PatreonInputs,
  type PatreonPlan,
  type PatreonPayoutMethod,
} from '../../lib/calculators/patreon-earnings';
import { formatCurrency, formatCurrencyWithCents } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

// Patreon closed its plan menu on 2025-08-04. The standard 10% plan is the only
// one a creator can join; the rest are held only by grandfathered creators.
// See the source block in src/lib/calculators/patreon-earnings.ts.
const planOptions = [
  { value: 'standard', label: 'Standard — 10% (current plan)' },
  { value: 'legacy_founders', label: 'Legacy: Founders — 5% (closed since 2019)' },
  { value: 'legacy_pro', label: 'Legacy: Pro — 8% (closed)' },
  { value: 'legacy_pro_merch', label: 'Legacy: Pro + Merch — 11% (closed)' },
];

const payoutMethodOptions = [
  { value: 'direct_deposit', label: 'Direct deposit — $0.25 per payout' },
  { value: 'paypal', label: 'PayPal — 1% per payout ($0.25 min, $20 cap)' },
  { value: 'payoneer', label: 'Payoneer Wallet — $1.00 per payout' },
];

export function PatreonCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } = useCalculatorState<PatreonInputs>(DEFAULT_INPUTS);

  const results = calculatePatreonEarnings(inputs);
  const isLegacyPlan = inputs.plan !== 'standard';

  const getResultsText = () =>
    `Patreon Earnings Calculator (CalcFalcon)\n` +
    `Plan: ${results.planLabel}\n` +
    `Monthly Net: ${formatCurrency(results.monthlyNet)}\n` +
    `Annual Earnings: ${formatCurrency(results.annualNet)}\n` +
    `Effective Fee: ${results.effectiveFeePct}%\n` +
    `https://calcfalcon.com/creator/patreon-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using the standard 10% plan and 5% monthly churn
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
            <h3 className="font-semibold text-neutral-900">Plan &amp; Growth</h3>
            <DropdownInput
              id="plan"
              label="Patreon Plan"
              value={inputs.plan}
              onChange={(v) => updateInput('plan', v as PatreonPlan)}
              options={planOptions}
              helpText={`Every creator who published a page after ${PATREON_LEGACY_CUTOFF} is on the standard 10% plan. The legacy plans are closed — pick one only if you are already grandfathered in.`}
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
            <SliderInput
              id="crossCurrencyPct"
              label="Patrons Paying in Another Currency"
              value={inputs.crossCurrencyPct}
              onChange={(v) => updateInput('crossCurrencyPct', v)}
              min={0}
              max={100}
              step={5}
              formatValue={(v) => `${v}%`}
              helpText="Patreon charges 2.5% when a patron pays in a currency other than your payout currency"
            />
            <DropdownInput
              id="payoutMethod"
              label="Payout Method"
              value={inputs.payoutMethod}
              onChange={(v) => updateInput('payoutMethod', v as PatreonPayoutMethod)}
              options={payoutMethodOptions}
              helpText="Charged when money leaves Patreon. Assumes one payout per month. PayPal payouts need a $10 balance; Payoneer Wallet needs $25."
            />
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Earnings</h3>
          <CopyResultsButton getResultsText={getResultsText} category="creator" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Monthly Net"
            value={formatCurrency(results.monthlyNet)}
            numericValue={results.monthlyNet}
            formatFn={formatCurrency}
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
                label: `Patreon Fee (${results.planRatePct}%)`,
                value: `-${formatCurrency(results.patreonFee)}`,
              },
              {
                label: (
                  <Tooltip
                    text={`Credit card, Apple Pay and US PayPal/Venmo transaction fees: ${results.processingRateLabel}.${
                      results.micropaymentApplied
                        ? ' The legacy micropayment rate applies because your average pledge is $3 or less.'
                        : ''
                    }`}
                  >
                    Payment Processing
                  </Tooltip>
                ),
                value: `-${formatCurrency(results.paymentProcessingFee)}`,
              },
              ...(results.currencyConversionFee > 0
                ? [
                    {
                      label: (
                        <Tooltip text="Patreon charges 2.5% when a patron pays in a currency other than your payout currency.">
                          Currency Conversion
                        </Tooltip>
                      ),
                      value: `-${formatCurrencyWithCents(results.currencyConversionFee)}`,
                    },
                  ]
                : []),
              ...(results.payoutFee > 0
                ? [
                    {
                      label: (
                        <Tooltip text="Charged when the balance leaves Patreon. Assumes one payout per month.">
                          Payout Fee
                        </Tooltip>
                      ),
                      value: `-${formatCurrencyWithCents(results.payoutFee)}`,
                    },
                  ]
                : []),
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
            {isLegacyPlan && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                <strong>Legacy plan selected.</strong> {results.planLabel} is
                closed to new creators. You keep it only if you were already on
                it and have not unpublished or republished your page — doing
                either moves you to the standard 10% plan permanently.
              </div>
            )}
            <div className="bg-creator-50 rounded-xl p-4 text-sm text-creator-800">
              <strong>Pro tip:</strong> The $0.30 per-transaction processing fee
              is what hurts small pledges. The standard plan has no micropayment
              rate, so a $1 pledge gives up 32.9% to processing alone before
              Patreon's 10% is applied — against 17.9% at $2 and 5.9% at $10.
              Nudging patrons toward higher tiers or annual billing moves your
              take-home faster than anything else you control.
            </div>
          </div>
        </div>

        {/* Quick mode indicator */}
        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Based on the standard 10% plan, US card payment processing, and{' '}
            {DEFAULT_INPUTS.churnRate}% monthly churn.{' '}
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
    </ErrorBoundary>
  );
}
