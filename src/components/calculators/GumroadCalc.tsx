import { useState, useEffect } from 'react';
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
  calculateGumroadRevenue,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type GumroadRevenueInputs,
} from '../../lib/calculators/gumroad-revenue';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function GumroadCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<GumroadRevenueInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  useEffect(() => {
    if (mode === 'quick') {
      setInputs((prev) => ({ ...prev, ...QUICK_MODE_DEFAULTS }));
    }
  }, [mode]);

  const results = calculateGumroadRevenue(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof GumroadRevenueInputs>(
    key: K,
    value: GumroadRevenueInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';

  const getResultsText = () =>
    `Gumroad Revenue Calculator (CalcFalcon)\n` +
    `Monthly Net Revenue: ${formatCurrency(results.netMonthly)}\n` +
    `Annual Revenue: ${formatCurrency(results.netAnnual)}\n` +
    `Effective Fee Rate: ${results.effectiveFeeRate.toFixed(1)}%\n` +
    `https://calcfalcon.com/creator/gumroad-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Product sales only. Switch to Advanced for memberships and affiliates.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Product Sales</h3>

          <CurrencyInput
            id="productPrice"
            label="Product Price"
            value={inputs.productPrice}
            onChange={(v) => updateInput('productPrice', v)}
            min={1}
            max={5000}
            step={1}
            helpText="Price of your digital product"
          />

          <NumberInput
            id="monthlySales"
            label="Monthly Sales"
            value={inputs.monthlySales}
            onChange={(v) => updateInput('monthlySales', v)}
            min={0}
            max={10000}
            step={1}
            helpText="Number of products sold per month"
          />

          <SliderInput
            id="gumroadFee"
            label={<Tooltip text="Gumroad charges a flat 10% fee that includes payment processing — no additional transaction fees">Gumroad Fee</Tooltip>}
            value={inputs.gumroadFee}
            onChange={(v) => updateInput('gumroadFee', v)}
            min={5}
            max={15}
            step={0.5}
            formatValue={(v) => `${v}%`}
            helpText="Standard rate is 10% (includes payment processing)"
          />
        </div>

        <div className="space-y-4">
          {isAdvanced && (
            <>
              <h3 className="font-semibold text-neutral-900">Memberships</h3>

              <NumberInput
                id="memberCount"
                label="Active Members"
                value={inputs.memberCount}
                onChange={(v) => updateInput('memberCount', v)}
                min={0}
                max={10000}
                step={1}
                helpText="Current paying membership subscribers"
              />

              <CurrencyInput
                id="memberPrice"
                label="Membership Price"
                value={inputs.memberPrice}
                onChange={(v) => updateInput('memberPrice', v)}
                min={1}
                max={200}
                step={1}
                helpText="Monthly membership fee"
              />
            </>
          )}

          {isAdvanced && (
            <>
              <h3 className="font-semibold text-neutral-900 mt-6">Affiliates & Refunds</h3>

              <SliderInput
                id="affiliateRate"
                label={<Tooltip text="Commission percentage you pay to affiliates who refer sales — typically 25-50% on digital products">Affiliate Commission</Tooltip>}
                value={inputs.affiliateRate}
                onChange={(v) => updateInput('affiliateRate', v)}
                min={0}
                max={50}
                step={5}
                formatValue={(v) => `${v}%`}
                helpText="Commission paid to affiliates per sale"
              />

              <SliderInput
                id="affiliatePercent"
                label="Sales via Affiliates"
                value={inputs.affiliatePercent}
                onChange={(v) => updateInput('affiliatePercent', v)}
                min={0}
                max={50}
                step={1}
                formatValue={(v) => `${v}%`}
                helpText="Percentage of product sales from affiliate referrals"
              />

              <SliderInput
                id="refundRate"
                label={<Tooltip text="Percentage of product sales that get refunded — digital products typically see 2-5% refund rates">Refund Rate</Tooltip>}
                value={inputs.refundRate}
                onChange={(v) => updateInput('refundRate', v)}
                min={0}
                max={15}
                step={0.5}
                formatValue={(v) => `${v}%`}
                helpText="Typical digital product refund rate is 2-5%"
              />
            </>
          )}

          {isAdvanced && (
            <>
              <h3 className="font-semibold text-neutral-900 mt-6">Email List</h3>

              <NumberInput
                id="emailListSize"
                label="Email List Size"
                value={inputs.emailListSize}
                onChange={(v) => updateInput('emailListSize', v)}
                min={0}
                max={100000}
                step={100}
                helpText="Total email subscribers"
              />

              <SliderInput
                id="conversionRate"
                label={<Tooltip text="Percentage of email subscribers who purchase — a healthy list converts at 1-3%">Conversion Rate</Tooltip>}
                value={inputs.conversionRate}
                onChange={(v) => updateInput('conversionRate', v)}
                min={0.5}
                max={10}
                step={0.5}
                formatValue={(v) => `${v}%`}
                helpText="Email list to purchase conversion rate"
              />
            </>
          )}

          {!isAdvanced && (
            <div className="p-4 bg-creator-50 rounded-xl border border-creator-100">
              <h4 className="font-semibold text-creator-900 mb-2">Gumroad Fee Structure</h4>
              <p className="text-creator-700 text-sm">
                Gumroad charges a flat 10% fee on all transactions. This includes payment processing — no hidden charges. Compare this to Etsy (6.5% + listing fees) or Shopify (2.9% + monthly plan).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Revenue Estimate</h3>
          <CopyResultsButton getResultsText={getResultsText} category="creator" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Monthly Net Revenue"
            value={formatCurrency(results.netMonthly)}
            numericValue={results.netMonthly}
            formatFn={formatCurrency}
            description="After all fees and deductions"
            category="creator"
            highlight
          />
          <ResultCard
            label="Annual Revenue"
            value={formatCurrency(results.netAnnual)}
            numericValue={results.netAnnual}
            formatFn={formatCurrency}
            description="Projected yearly"
            category="creator"
          />
          <ResultCard
            label="Effective Fee Rate"
            value={`${results.effectiveFeeRate.toFixed(1)}%`}
            description={`${formatCurrency(results.totalDeductions)}/month in fees`}
            category="creator"
          />
        </div>

        {/* DonutChart — only when both products and memberships > 0 */}
        {results.breakdown.length > 1 && (
          <ChartCard title="Revenue Sources" category="creator" className="mb-6">
            <DonutChart
              data={results.breakdown.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
              category="creator"
              innerLabel="Gross"
              innerValue={formatCurrency(results.totalGross)}
            />
          </ChartCard>
        )}

        <ResultBreakdown
          title="Revenue Breakdown"
          items={[
            { label: 'Product Sales (Gross)', value: formatCurrency(results.productGross) },
            ...(results.membershipGross > 0
              ? [{ label: 'Membership Revenue', value: formatCurrency(results.membershipGross) }]
              : []),
            { label: 'Total Gross', value: formatCurrency(results.totalGross), highlight: true },
            ...(results.refundAmount > 0
              ? [{ label: 'Refunds', value: `-${formatCurrency(results.refundAmount)}` }]
              : []),
            {
              label: <Tooltip text="Gumroad's flat fee includes payment processing — no additional transaction fees">Gumroad Fee ({inputs.gumroadFee}%)</Tooltip>,
              value: `-${formatCurrency(results.gumroadFeeAmount)}`,
            },
            ...(results.affiliateCost > 0
              ? [{ label: 'Affiliate Commissions', value: `-${formatCurrency(results.affiliateCost)}` }]
              : []),
            { label: 'Net Monthly', value: formatCurrency(results.netMonthly), highlight: true },
          ]}
          category="creator"
        />

        {/* Email list potential (advanced only) */}
        {isAdvanced && inputs.emailListSize > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-2">Email List Revenue Potential</h4>
            <p className="text-blue-800 text-sm">
              With {inputs.emailListSize.toLocaleString()} subscribers at a {inputs.conversionRate}% conversion rate,
              each launch could generate <strong>{formatCurrency(results.emailListPotential)}</strong> in revenue.
              Building your email list is the highest-leverage growth activity for Gumroad sellers.
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-creator-50 rounded-xl border border-creator-100">
          <h4 className="font-semibold text-creator-900 mb-2">Gumroad Selling Tips</h4>
          <ul className="text-creator-700 text-sm space-y-1">
            <li>- Price higher than you think — digital products have near-zero marginal cost</li>
            <li>- Use Gumroad's built-in affiliate program to expand your reach</li>
            <li>- Offer product bundles to increase average order value</li>
            <li>- Build an email list — it's your most valuable asset on Gumroad</li>
          </ul>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
