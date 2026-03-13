import { ErrorBoundary } from '../ui/ErrorBoundary';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { DonutChart } from '../ui/charts/DonutChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateKofiEarnings,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type KofiEarningsInputs,
} from '../../lib/calculators/kofi-earnings';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function KofiCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } = useCalculatorState<KofiEarningsInputs>(
    DEFAULT_INPUTS,
    QUICK_MODE_DEFAULTS
  );

  const results = calculateKofiEarnings(inputs);

  const getResultsText = () =>
    `Ko-fi Earnings Calculator (CalcFalcon)\n` +
    `Monthly Take-Home: ${formatCurrency(results.netMonthly)}\n` +
    `Annual Earnings: ${formatCurrency(results.netAnnual)}\n` +
    `Total Fees: ${results.feePercentage.toFixed(1)}%\n` +
    `https://calcfalcon.com/creator/ko-fi-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using $5 avg donation, free account (5% fee)
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Donations & Memberships */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Support</h3>

          <NumberInput
            id="monthlyDonations"
            label="Donations Per Month"
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
              label="Average Donation Amount"
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

        {/* Shop & Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Shop & Commissions' : 'Account Settings'}
          </h3>

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
            <div className="p-4 bg-neutral-50 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.goldMember}
                  onChange={(e) => updateInput('goldMember', e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-300 text-creator-600 focus:ring-creator-500"
                />
                <div>
                  <span className="font-medium text-neutral-900">Ko-fi Gold Member</span>
                  <p className="text-sm text-neutral-500">$6/month for 0% platform fees</p>
                </div>
              </label>
            </div>
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
              helpText="PayPal/Stripe fee (~2.9%)"
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
            { label: 'Donation Revenue', value: formatCurrency(results.donationRevenue) },
            { label: 'Membership Revenue', value: formatCurrency(results.membershipRevenue) },
            ...(results.shopRevenue > 0 ? [{ label: 'Shop Sales', value: formatCurrency(results.shopRevenue) }] : []),
            ...(results.commissionRevenue > 0 ? [{ label: 'Commission Revenue', value: formatCurrency(results.commissionRevenue) }] : []),
            { label: 'Gross Monthly', value: formatCurrency(results.grossMonthly), highlight: true },
            { label: <Tooltip text="Ko-fi takes 5% on free accounts, 0% for Gold members ($6/mo)">Platform Fees ({inputs.goldMember ? '0%' : '5%'})</Tooltip>, value: `-${formatCurrency(results.platformFees)}` },
            { label: <Tooltip text="PayPal or Stripe processing fees (~2.9% + $0.30)">Payment Processing</Tooltip>, value: `-${formatCurrency(results.paymentProcessingFees)}` },
            { label: 'Net Monthly', value: formatCurrency(results.netMonthly), highlight: true },
          ]}
          category="creator"
        />

        {/* Ko-fi Gold Comparison */}
        {!inputs.goldMember && results.platformFees > 6 && (
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="font-semibold text-amber-900 mb-2">Ko-fi Gold Worth It?</h4>
            <p className="text-amber-800 text-sm">
              You're paying <strong>{formatCurrency(results.platformFees)}</strong> in platform fees.
              Ko-fi Gold costs $6/month and removes the 5% fee.
              {results.platformFees > 6 && (
                <span className="block mt-1">
                  <strong>You'd save {formatCurrency(results.platformFees - 6)}/month</strong> by upgrading!
                </span>
              )}
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-creator-50 rounded-xl border border-creator-100">
          <h4 className="font-semibold text-creator-900 mb-2">Ko-fi Tips</h4>
          <ul className="text-creator-700 text-sm space-y-1">
            <li>• Ko-fi takes 0% from shop sales (only payment processing)</li>
            <li>• Gold members get 0% platform fees, custom page URL, and more</li>
            <li>• Memberships provide predictable recurring income</li>
            <li>• Link your Ko-fi everywhere: bio, video descriptions, website</li>
          </ul>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
