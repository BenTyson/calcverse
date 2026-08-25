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
  calculateGumroadRevenue,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type GumroadRevenueInputs,
} from '../../lib/calculators/gumroad-revenue';
// formatCurrency rounds to whole dollars — it renders $0.50 as "$1". Every
// per-transaction and per-sale figure on this calculator MUST use
// formatCurrencyWithCents, or the $0.50 fee this page exists to surface
// disappears into a rounding artefact.
import { formatCurrency, formatCurrencyWithCents, formatNumber } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function GumroadCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } = useCalculatorState<GumroadRevenueInputs>(
    DEFAULT_INPUTS,
    QUICK_MODE_DEFAULTS
  );

  const results = calculateGumroadRevenue(inputs);

  const feeLabel = `${inputs.gumroadFee}% + ${formatCurrencyWithCents(inputs.gumroadFlatFee)}/sale`;
  const txnCount = formatNumber(
    results.billableTransactions,
    Number.isInteger(results.billableTransactions) ? 0 : 1
  );

  const getResultsText = () =>
    `Gumroad Revenue Calculator (CalcFalcon)\n` +
    `Monthly Net Revenue: ${formatCurrency(results.netMonthly)}\n` +
    `Annual Revenue: ${formatCurrency(results.netAnnual)}\n` +
    `Gumroad Fee: ${feeLabel} = ${results.gumroadEffectiveRate.toFixed(1)}% effective\n` +
    `Effective Fee Rate (all deductions): ${results.effectiveFeeRate.toFixed(1)}%\n` +
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
            label={<Tooltip text="Gumroad's direct-sales rate is 10% plus $0.50 per transaction. Gumroad is the merchant of record, so that covers payment processing — but the $0.50 is a real, separate charge.">Gumroad Fee (%)</Tooltip>}
            value={inputs.gumroadFee}
            onChange={(v) => updateInput('gumroadFee', v)}
            min={5}
            max={30}
            step={0.5}
            formatValue={(v) => `${v}%`}
            helpText="Standard direct-sales rate is 10%"
          />

          <CurrencyInput
            id="gumroadFlatFee"
            label="Per-Transaction Fee"
            value={inputs.gumroadFlatFee}
            onChange={(v) => updateInput('gumroadFlatFee', v)}
            min={0}
            max={5}
            step={0.05}
            helpText="Gumroad charges $0.50 on top of the percentage, on every transaction"
          />

          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-sm text-neutral-700">
            At {formatCurrencyWithCents(inputs.productPrice)}, Gumroad's {feeLabel} works out to{' '}
            <strong>{results.perSaleFeeRate.toFixed(1)}%</strong> — you keep{' '}
            <strong>{formatCurrencyWithCents(results.netPerSale)}</strong> per sale.
          </div>
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

              <DropdownInput
                id="flatFeeOnMemberships"
                label="$0.50 on each renewal?"
                value={inputs.flatFeeOnMemberships}
                onChange={(v) => updateInput('flatFeeOnMemberships', v as 'yes' | 'no')}
                options={[
                  { value: 'yes', label: 'Yes — charge it on every renewal' },
                  { value: 'no', label: 'No — percentage only on renewals' },
                ]}
                helpText="Gumroad publishes its fee as per-transaction but does not say whether the $0.50 recurs on membership renewals. We default to charging it."
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
                Gumroad charges <strong>10% + $0.50 per transaction</strong> on direct sales. There is no monthly cost and no separate card-processing charge — Gumroad is the merchant of record, so that one line is the whole fee. But the $0.50 means your real rate depends on price: it is 11.7% on a $29 product and 20% on a $5 one.
              </p>
              <p className="text-creator-700 text-sm mt-2">
                Gumroad also publishes a <strong>30% per-transaction</strong> rate for new customers who find you through its Discover marketplace. This calculator models direct sales only.
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
            description={`${formatCurrency(results.totalDeductions)}/month in fees, refunds and commissions`}
            category="creator"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <ResultCard
            label="Gumroad's Real Rate"
            value={`${results.perSaleFeeRate.toFixed(1)}%`}
            description={`${feeLabel} on a ${formatCurrencyWithCents(inputs.productPrice)} sale`}
            category="creator"
          />
          <ResultCard
            label="You Keep Per Sale"
            value={formatCurrencyWithCents(results.netPerSale)}
            numericValue={results.netPerSale}
            formatFn={formatCurrencyWithCents}
            description={`After ${formatCurrencyWithCents(results.feePerSale)} in Gumroad fees`}
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
            { label: 'Product Sales (Gross)', value: formatCurrencyWithCents(results.productGross) },
            ...(results.membershipGross > 0
              ? [{ label: 'Membership Revenue', value: formatCurrencyWithCents(results.membershipGross) }]
              : []),
            { label: 'Total Gross', value: formatCurrencyWithCents(results.totalGross), highlight: true },
            ...(results.refundAmount > 0
              ? [{ label: 'Refunds', value: `-${formatCurrencyWithCents(results.refundAmount)}` }]
              : []),
            {
              label: (
                <Tooltip text="Gumroad's percentage covers payment processing — Gumroad is the merchant of record, so there is no separate card fee.">
                  Gumroad Fee ({inputs.gumroadFee}%)
                </Tooltip>
              ),
              value: `-${formatCurrencyWithCents(results.gumroadPercentFeeAmount)}`,
            },
            ...(results.gumroadFlatFeeAmount > 0
              ? [
                  {
                    label: (
                      <Tooltip text="Gumroad charges $0.50 on top of the percentage, on every transaction. This is what makes the real rate depend on your price.">
                        Per-Transaction Fees ({txnCount} x{' '}
                        {formatCurrencyWithCents(inputs.gumroadFlatFee)})
                      </Tooltip>
                    ),
                    value: `-${formatCurrencyWithCents(results.gumroadFlatFeeAmount)}`,
                  },
                ]
              : []),
            ...(results.affiliateCost > 0
              ? [{ label: 'Affiliate Commissions', value: `-${formatCurrencyWithCents(results.affiliateCost)}` }]
              : []),
            { label: 'Net Monthly', value: formatCurrencyWithCents(results.netMonthly), highlight: true },
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
            <li>- Price higher than you think — the $0.50 per transaction costs you 10% of a $5 sale but only 0.5% of a $100 one</li>
            <li>- Bundle instead of splitting — one $50 order pays the $0.50 once; five $10 orders pay it five times</li>
            <li>- Use Gumroad's built-in affiliate program to expand your reach</li>
            <li>- Gumroad holds your balance until it reaches $100, so plan cashflow around the payout minimum</li>
            <li>- Build an email list — it's your most valuable asset on Gumroad</li>
          </ul>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
