import { useState, useEffect } from 'react';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateKofiEarnings,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type KofiEarningsInputs,
} from '../../lib/calculators/kofi-earnings';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function KofiCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<KofiEarningsInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  useEffect(() => {
    if (mode === 'quick') {
      setInputs((prev) => ({ ...prev, ...QUICK_MODE_DEFAULTS }));
    }
  }, [mode]);

  const results = calculateKofiEarnings(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof KofiEarningsInputs>(
    key: K,
    value: KofiEarningsInputs[K]
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
        <h3 className="font-semibold text-neutral-900 mb-4">Estimated Earnings</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Monthly Take-Home"
            value={formatCurrency(results.netMonthly)}
            description="After all fees"
            category="creator"
            highlighted
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
          <div className="mb-6">
            <h4 className="text-sm font-medium text-neutral-700 mb-3">Revenue Sources</h4>
            <div className="h-8 rounded-lg overflow-hidden flex">
              {results.breakdown.map((item, index) => {
                const colors = ['bg-creator-500', 'bg-creator-400', 'bg-creator-300', 'bg-creator-200'];
                return (
                  <div
                    key={item.label}
                    className={`${colors[index]} flex items-center justify-center text-white text-xs font-medium`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.label}: ${formatCurrency(item.value)}`}
                  >
                    {item.percentage > 20 && item.label}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-sm">
              {results.breakdown.map((item, index) => {
                const colors = ['bg-creator-500', 'bg-creator-400', 'bg-creator-300', 'bg-creator-200'];
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded ${colors[index]}`}></span>
                    <span className="text-neutral-600">{item.label}: {formatCurrency(item.value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ResultBreakdown
          title="Earnings Breakdown"
          items={[
            { label: 'Donation Revenue', value: formatCurrency(results.donationRevenue) },
            { label: 'Membership Revenue', value: formatCurrency(results.membershipRevenue) },
            ...(results.shopRevenue > 0 ? [{ label: 'Shop Sales', value: formatCurrency(results.shopRevenue) }] : []),
            ...(results.commissionRevenue > 0 ? [{ label: 'Commission Revenue', value: formatCurrency(results.commissionRevenue) }] : []),
            { label: 'Gross Monthly', value: formatCurrency(results.grossMonthly), highlighted: true },
            { label: `Platform Fees (${inputs.goldMember ? '0%' : '5%'})`, value: `-${formatCurrency(results.platformFees)}` },
            { label: 'Payment Processing', value: `-${formatCurrency(results.paymentProcessingFees)}` },
            { label: 'Net Monthly', value: formatCurrency(results.netMonthly), highlighted: true },
          ]}
          category="creator"
        />

        {/* Ko-fi Gold Comparison */}
        {!inputs.goldMember && results.platformFees > 6 && (
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="font-semibold text-amber-900 mb-2">💡 Ko-fi Gold Worth It?</h4>
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
  );
}
