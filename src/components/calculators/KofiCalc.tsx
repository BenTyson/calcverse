import { useEffect } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { DonutChart } from '../ui/charts/DonutChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateKofiEarnings,
  resolveKofiPlan,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  KOFI_GOLD_MONTHLY_COST,
  type KofiEarningsInputs,
  type KofiPlan,
} from '../../lib/calculators/kofi-earnings';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

const PLAN_OPTIONS: { value: KofiPlan; label: string }[] = [
  { value: 'standard', label: 'Standard — $0/mo, 5% on everything' },
  { value: 'free', label: 'Ko-fi Free — $0/mo, 0% on one-off tips, 5% on the rest' },
  { value: 'gold', label: `Ko-fi Gold — $${KOFI_GOLD_MONTHLY_COST}/mo, 0% service fee` },
];

const PLAN_LABELS: Record<KofiPlan, string> = {
  standard: 'Standard',
  free: 'Ko-fi Free',
  gold: 'Ko-fi Gold',
};

/** Percent shown next to "Service Fees" in the breakdown, per plan. */
const PLAN_FEE_SUMMARY: Record<KofiPlan, string> = {
  standard: '5% on all',
  free: '5% except tips',
  gold: '0%',
};

export function KofiCalc() {
  const { mode, setMode, inputs, setInputs, updateInput, isAdvanced } =
    useCalculatorState<KofiEarningsInputs>(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  // Migrate `?s=` links shared before 2026-08-25, when the only fee choice was
  // a `goldMember` boolean. `true` is unambiguous; `false` conflated Free and
  // Standard, so it is left to fall through to the Standard default.
  useEffect(() => {
    if (inputs.goldMember === true) {
      setInputs((prev) => ({ ...prev, plan: 'gold', goldMember: undefined }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const plan = resolveKofiPlan(inputs);
  const results = calculateKofiEarnings(inputs);

  const getResultsText = () => {
    // Derived from the live URL so this can never drift out of sync with the
    // route again — the literal below is only a server-render fallback. The
    // `/embed` prefix is stripped so a copy from an embedded widget shares the
    // real, indexable page rather than the noindex embed.
    const pageUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname.replace(/^\/embed/, '')}`
        : 'https://calcfalcon.com/creator/kofi-calculator';

    return (
      `Ko-fi Earnings Calculator (CalcFalcon)\n` +
      `Plan: ${PLAN_LABELS[plan]}\n` +
      `Monthly Take-Home: ${formatCurrency(results.netMonthly)}\n` +
      `Annual Earnings: ${formatCurrency(results.netAnnual)}\n` +
      `Total Fees: ${results.feePercentage.toFixed(1)}%\n` +
      pageUrl
    );
  };

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using $5 avg tip and ~2.9% + $0.30 processing
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Support */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Support</h3>

          <NumberInput
            id="monthlyDonations"
            label="One-Off Tips Per Month"
            value={inputs.monthlyDonations}
            onChange={(v) => updateInput('monthlyDonations', v)}
            min={0}
            max={1000}
            step={1}
            helpText="One-time 'coffees' received"
          />

          {isAdvanced && (
            <CurrencyInput
              id="avgDonationAmount"
              label="Average Tip Amount"
              value={inputs.avgDonationAmount}
              onChange={(v) => updateInput('avgDonationAmount', v)}
              min={1}
              max={100}
              step={1}
              helpText="Default coffee is $3-5"
            />
          )}

          <NumberInput
            id="membershipCount"
            label="Monthly Members"
            value={inputs.membershipCount}
            onChange={(v) => updateInput('membershipCount', v)}
            min={0}
            max={10000}
            step={1}
            helpText="Recurring supporters"
          />

          {isAdvanced && (
            <CurrencyInput
              id="membershipPrice"
              label="Membership Price"
              value={inputs.membershipPrice}
              onChange={(v) => updateInput('membershipPrice', v)}
              min={1}
              max={100}
              step={1}
              helpText="Monthly membership tier price"
            />
          )}
        </div>

        {/* Plan, Shop & Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Plan, Shop & Commissions' : 'Your Ko-fi Plan'}
          </h3>

          <DropdownInput
            id="plan"
            label="Ko-fi Plan"
            value={plan}
            onChange={(v) => updateInput('plan', v as KofiPlan)}
            options={PLAN_OPTIONS}
            helpText="New Ko-fi creators start on Standard, with everything unlocked and a 5% service fee. Ko-fi Free charges 0% on one-off tips but 5% on memberships, commissions and shop sales, and locks some features."
          />

          {isAdvanced && (
            <NumberInput
              id="shopSalesPerMonth"
              label="Shop Orders Per Month"
              value={inputs.shopSalesPerMonth}
              onChange={(v) => updateInput('shopSalesPerMonth', v)}
              min={0}
              max={500}
              step={1}
              helpText="Digital products, merch, etc."
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="avgOrderValue"
              label="Average Order Value"
              value={inputs.avgOrderValue}
              onChange={(v) => updateInput('avgOrderValue', v)}
              min={1}
              max={500}
              step={1}
              helpText="Average shop purchase"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="commissionSales"
              label="Commission Sales Per Month"
              value={inputs.commissionSales}
              onChange={(v) => updateInput('commissionSales', v)}
              min={0}
              max={10000}
              step={50}
              helpText="Art commissions, custom work"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="paypalFeeRate"
              label="Payment Processing Rate"
              value={inputs.paypalFeeRate}
              onChange={(v) => updateInput('paypalFeeRate', v)}
              min={2}
              max={4}
              step={0.1}
              suffix="%"
              helpText="Your own PayPal or Stripe rate — Ko-fi says it is usually around 3% + $0.30"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Estimated Earnings</h3>
          <CopyResultsButton getResultsText={getResultsText} category="creator" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Monthly Take-Home"
            value={formatCurrency(results.netMonthly)}
            numericValue={results.netMonthly}
            formatFn={formatCurrency}
            description="After all fees"
            category="creator"
            highlight
          />
          <ResultCard
            label="Annual Earnings"
            value={formatCurrency(results.netAnnual)}
            description="Projected yearly"
            category="creator"
          />
          <ResultCard
            label="Total Fees"
            value={`${results.feePercentage.toFixed(1)}%`}
            description={formatCurrency(results.totalFees) + '/month'}
            category="creator"
          />
        </div>

        {/* Revenue Breakdown Visual */}
        {results.breakdown.length > 0 && (
          <ChartCard title="Revenue Sources" category="creator" className="mb-6">
            <DonutChart
              data={results.breakdown.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
              category="creator"
              innerLabel="Monthly"
              innerValue={formatCurrency(results.netMonthly)}
            />
          </ChartCard>
        )}

        <ResultBreakdown
          title="Earnings Breakdown"
          items={[
            { label: 'Tip Revenue', value: formatCurrency(results.donationRevenue) },
            { label: 'Membership Revenue', value: formatCurrency(results.membershipRevenue) },
            ...(results.shopRevenue > 0 ? [{ label: 'Shop Sales', value: formatCurrency(results.shopRevenue) }] : []),
            ...(results.commissionRevenue > 0 ? [{ label: 'Commission Revenue', value: formatCurrency(results.commissionRevenue) }] : []),
            { label: 'Gross Monthly', value: formatCurrency(results.grossMonthly), highlight: true },
            {
              label: (
                <Tooltip text="Ko-fi's service fee is 5% on Standard (every payment type) and 5% on Ko-fi Free for memberships, commissions and shop sales — but 0% on one-off tips. Ko-fi Gold is 0% on everything.">
                  Ko-fi Service Fee ({PLAN_FEE_SUMMARY[plan]})
                </Tooltip>
              ),
              value: `-${formatCurrency(results.platformFees)}`,
            },
            ...(results.goldSubscriptionCost > 0
              ? [{
                  label: (
                    <Tooltip text={`Ko-fi Gold is a $${KOFI_GOLD_MONTHLY_COST}/month subscription. It is a real cost, so it is subtracted from take-home here.`}>
                      Ko-fi Gold Subscription
                    </Tooltip>
                  ),
                  value: `-${formatCurrency(results.goldSubscriptionCost)}`,
                }]
              : []),
            {
              label: (
                <Tooltip text="Ko-fi does not process payments. Supporters pay your own PayPal or Stripe account, and you pay that processor's normal rate — Ko-fi says usually around 3% + $0.30. Ko-fi charges no payout fee and has no payout minimum.">
                  Payment Processing
                </Tooltip>
              ),
              value: `-${formatCurrency(results.paymentProcessingFees)}`,
            },
            { label: 'Net Monthly', value: formatCurrency(results.netMonthly), highlight: true },
          ]}
          category="creator"
        />

        {/* Ko-fi Gold comparison — arithmetic only. Ko-fi's own pages disagree
            about whether Gold is still offered to new creators, so this states
            the difference and does not recommend buying it. */}
        {plan !== 'gold' && results.platformFees > KOFI_GOLD_MONTHLY_COST && (
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="font-semibold text-amber-900 mb-2">How Ko-fi Gold compares</h4>
            <p className="text-amber-800 text-sm">
              You are paying <strong>{formatCurrency(results.platformFees)}</strong>/month in Ko-fi
              service fees. Ko-fi Gold costs <strong>${KOFI_GOLD_MONTHLY_COST}/month</strong> and
              removes the service fee entirely, so on these numbers the difference is{' '}
              <strong>{formatCurrency(results.platformFees - KOFI_GOLD_MONTHLY_COST)}/month</strong> in
              Gold&rsquo;s favour. Payment processing is unchanged either way.
              <span className="block mt-2 text-xs">
                Ko-fi is de-emphasising Gold — its Gold page is headed &ldquo;You no longer need
                Ko-fi Gold&rdquo; and the Help Centre fee breakdown lists only Free and Standard.
                Check Ko-fi&rsquo;s own pricing page for what you can actually sign up for today.
              </span>
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-creator-50 rounded-xl border border-creator-100">
          <h4 className="font-semibold text-creator-900 mb-2">Ko-fi Tips</h4>
          <ul className="text-creator-700 text-sm space-y-1">
            <li>• On Ko-fi Free, one-off tips carry a 0% service fee — you only pay your own processor</li>
            <li>• Shop sales and commissions are 5% on both Free and Standard, not 0%</li>
            <li>• Standard unlocks every feature for $0/month, but charges 5% on tips too</li>
            <li>• Ko-fi never holds your money: no payout fee, no payout minimum</li>
            <li>• Memberships provide predictable recurring income</li>
          </ul>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
