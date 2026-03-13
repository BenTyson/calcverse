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
  calculatePrintOnDemand,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type PrintOnDemandInputs,
} from '../../lib/calculators/print-on-demand-profit';
import { formatCurrency, formatCurrencyWithCents } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

const platformOptions = [
  { value: 'printful', label: 'Printful' },
  { value: 'printify', label: 'Printify' },
  { value: 'merch-by-amazon', label: 'Merch by Amazon' },
];

const productOptions = [
  { value: 'tshirt', label: 'T-Shirt' },
  { value: 'hoodie', label: 'Hoodie' },
  { value: 'mug', label: 'Mug' },
  { value: 'poster', label: 'Poster' },
  { value: 'phone-case', label: 'Phone Case' },
  { value: 'tote-bag', label: 'Tote Bag' },
  { value: 'sticker', label: 'Sticker' },
];

const marketplaceOptions = [
  { value: 'own-store', label: 'Own Store (no marketplace fees)' },
  { value: 'etsy', label: 'Etsy (6.5% + 3% + listing)' },
  { value: 'amazon', label: 'Amazon (15% referral)' },
];

export function PrintOnDemandCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } = useCalculatorState<PrintOnDemandInputs>(
    DEFAULT_INPUTS,
    QUICK_MODE_DEFAULTS
  );

  const results = calculatePrintOnDemand(inputs);

  const getResultsText = () =>
    `Print-on-Demand Profit Calculator (CalcFalcon)\n` +
    `Profit per Unit: ${formatCurrencyWithCents(results.profitPerUnit)}\n` +
    `Monthly Net Profit: ${formatCurrency(results.monthlyNetProfit)}\n` +
    `Profit Margin: ${results.profitMargin.toFixed(1)}%\n` +
    `https://calcfalcon.com/creator/print-on-demand-profit-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Per-unit profit estimate. Switch to Advanced for marketplace fees, ads, and returns.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Product Details</h3>

          <DropdownInput
            id="platform"
            label="POD Platform"
            value={inputs.platform}
            onChange={(v) => updateInput('platform', v)}
            options={platformOptions}
            helpText="Print-on-demand fulfillment provider"
          />

          <DropdownInput
            id="productType"
            label="Product Type"
            value={inputs.productType}
            onChange={(v) => updateInput('productType', v)}
            options={productOptions}
            helpText="Base cost varies by product and platform"
          />

          <CurrencyInput
            id="sellingPrice"
            label="Selling Price"
            value={inputs.sellingPrice}
            onChange={(v) => updateInput('sellingPrice', v)}
            min={5}
            max={200}
            step={1}
            helpText="Your retail price to the customer"
          />

          <NumberInput
            id="monthlySales"
            label="Monthly Sales"
            value={inputs.monthlySales}
            onChange={(v) => updateInput('monthlySales', v)}
            min={0}
            max={5000}
            step={1}
            helpText="Expected units sold per month"
          />
        </div>

        <div className="space-y-4">
          {isAdvanced && (
            <>
              <h3 className="font-semibold text-neutral-900">Sales Channel</h3>

              <CurrencyInput
                id="shippingCharged"
                label="Shipping Charged to Customer"
                value={inputs.shippingCharged}
                onChange={(v) => updateInput('shippingCharged', v)}
                min={0}
                max={20}
                step={0.5}
                helpText="Amount you charge for shipping"
              />

              <DropdownInput
                id="marketplace"
                label="Marketplace"
                value={inputs.marketplace}
                onChange={(v) => updateInput('marketplace', v)}
                options={marketplaceOptions}
                helpText="Marketplace fees are on top of POD production costs"
              />

              <h3 className="font-semibold text-neutral-900 mt-6">Costs & Returns</h3>

              <CurrencyInput
                id="adSpend"
                label="Monthly Ad Spend"
                value={inputs.adSpend}
                onChange={(v) => updateInput('adSpend', v)}
                min={0}
                max={5000}
                step={10}
                helpText="Monthly advertising budget"
              />

              <CurrencyInput
                id="designCost"
                label="Monthly Design Costs"
                value={inputs.designCost}
                onChange={(v) => updateInput('designCost', v)}
                min={0}
                max={500}
                step={5}
                helpText="Cost for new designs per month"
              />

              <SliderInput
                id="returnRate"
                label={<Tooltip text="Percentage of orders returned — POD products typically see 3-5% returns for apparel, less for accessories">Return Rate</Tooltip>}
                value={inputs.returnRate}
                onChange={(v) => updateInput('returnRate', v)}
                min={0}
                max={15}
                step={0.5}
                formatValue={(v) => `${v}%`}
                helpText="Typical POD return rate is 3-5%"
              />

              <NumberInput
                id="numberOfDesigns"
                label="Active Designs"
                value={inputs.numberOfDesigns}
                onChange={(v) => updateInput('numberOfDesigns', v)}
                min={1}
                max={100}
                step={1}
                helpText="Number of unique designs in your store"
              />
            </>
          )}

          {!isAdvanced && (
            <div className="p-4 bg-creator-50 rounded-xl border border-creator-100">
              <h4 className="font-semibold text-creator-900 mb-2">Production Cost Comparison</h4>
              <p className="text-creator-700 text-sm">
                Printify is typically cheapest for base production. Printful offers better quality and branding options at a higher cost. Merch by Amazon uses a royalty model (32.5%) — no upfront costs but lower margins on premium items.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Profit Estimate</h3>
          <CopyResultsButton getResultsText={getResultsText} category="creator" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Profit per Unit"
            value={formatCurrencyWithCents(results.profitPerUnit)}
            numericValue={results.profitPerUnit}
            formatFn={formatCurrencyWithCents}
            description="After all costs and fees"
            category="creator"
            highlight
          />
          <ResultCard
            label="Monthly Net Profit"
            value={formatCurrency(results.monthlyNetProfit)}
            numericValue={results.monthlyNetProfit}
            formatFn={formatCurrency}
            description={`${inputs.monthlySales} sales/month`}
            category="creator"
          />
          <ResultCard
            label="Profit Margin"
            value={`${results.profitMargin.toFixed(1)}%`}
            description={`${formatCurrency(results.annualProfit)}/year projected`}
            category="creator"
          />
        </div>

        <ChartCard title="Cost Breakdown per Unit" category="creator" className="mb-6">
          <DonutChart
            data={results.breakdown.map((item) => ({
              label: item.label,
              value: item.value,
            }))}
            category="creator"
            innerLabel="Price"
            innerValue={formatCurrencyWithCents(results.grossPerUnit)}
          />
        </ChartCard>

        <ResultBreakdown
          title="Profit Breakdown"
          items={[
            { label: 'Selling Price', value: formatCurrencyWithCents(inputs.sellingPrice) },
            { label: 'Shipping Charged', value: formatCurrencyWithCents(inputs.shippingCharged) },
            { label: 'Gross per Unit', value: formatCurrencyWithCents(results.grossPerUnit), highlight: true },
            ...(results.baseCost > 0
              ? [{ label: 'Production Cost', value: `-${formatCurrencyWithCents(results.baseCost)}` }]
              : []),
            ...(results.shippingCost > 0
              ? [{ label: 'Shipping Cost', value: `-${formatCurrencyWithCents(results.shippingCost)}` }]
              : []),
            ...(results.marketplaceFee > 0
              ? [{ label: <Tooltip text="Transaction, processing, and listing fees charged by the marketplace">Marketplace Fees</Tooltip>, value: `-${formatCurrencyWithCents(results.marketplaceFee)}` }]
              : []),
            { label: 'Profit per Unit', value: formatCurrencyWithCents(results.profitPerUnit), highlight: true },
            { label: `Monthly Sales (${inputs.monthlySales} units)`, value: formatCurrency(results.monthlyGross) },
            ...(results.monthlyReturns > 0
              ? [{ label: `Returns (${inputs.returnRate}%)`, value: `-${formatCurrency(results.monthlyReturns)}` }]
              : []),
            ...(inputs.adSpend > 0
              ? [{ label: 'Ad Spend', value: `-${formatCurrency(inputs.adSpend)}` }]
              : []),
            ...(inputs.designCost > 0
              ? [{ label: 'Design Costs', value: `-${formatCurrency(inputs.designCost)}` }]
              : []),
            { label: 'Monthly Net Profit', value: formatCurrency(results.monthlyNetProfit), highlight: true },
          ]}
          category="creator"
        />

        <div className="mt-6 p-4 bg-creator-50 rounded-xl border border-creator-100">
          <h4 className="font-semibold text-creator-900 mb-2">POD Pricing Tips</h4>
          <ul className="text-creator-700 text-sm space-y-1">
            <li>- Aim for at least 30% profit margin after all costs</li>
            <li>- Offer free shipping by building the cost into your product price</li>
            <li>- Test designs with mockups before investing in ads</li>
            <li>- Niche designs with loyal audiences outperform generic trendy designs</li>
          </ul>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
