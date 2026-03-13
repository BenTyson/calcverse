import { useState, useEffect } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { NumberInput } from '../ui/inputs/NumberInput';
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
  calculateDropshippingMargin,
  DEFAULT_INPUTS,
  DROPSHIP_PLATFORMS,
  PLATFORM_PRESETS,
  type DropshippingMarginInputs,
} from '../../lib/calculators/dropshipping-margin';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function DropshippingMarginCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<DropshippingMarginInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateDropshippingMargin(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  useEffect(() => {
    const preset = PLATFORM_PRESETS[inputs.platform];
    if (preset) {
      setInputs((prev) => ({
        ...prev,
        platformFeePercent: preset.platformFee,
        paymentProcessingPercent: preset.processingFee,
      }));
    }
  }, [inputs.platform]);

  const updateInput = <K extends keyof DropshippingMarginInputs>(
    key: K,
    value: DropshippingMarginInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';

  const getResultsText = () =>
    `Dropshipping Margin Calculator (CalcFalcon)\n` +
    `Profit Per Order: ${formatCurrency(results.profitPerOrder)}\n` +
    `Monthly Profit: ${formatCurrency(results.monthlyProfit)}\n` +
    `Profit Margin: ${results.profitMargin}%\n` +
    `ROAS: ${results.roas.toFixed(1)}x\n` +
    `https://calcfalcon.com/side-hustle/dropshipping-margin-calculator`;

  const donutData = [
    ...(results.profitPerOrder > 0 ? [{ label: 'Profit', value: results.profitPerOrder }] : []),
    { label: 'Supplier Cost', value: inputs.supplierCost },
    { label: 'Ad Spend', value: inputs.adSpendPerSale },
    ...(results.platformFee > 0 ? [{ label: 'Platform Fee', value: results.platformFee }] : []),
    ...(results.processingFee > 0 ? [{ label: 'Processing Fee', value: results.processingFee }] : []),
    ...(results.returnCost > 0 ? [{ label: 'Returns', value: results.returnCost }] : []),
    ...(results.refundCost > 0 ? [{ label: 'Refunds', value: results.refundCost }] : []),
  ];

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using default platform fees, return/refund rates, and fixed costs
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Revenue</h3>
          <CurrencyInput
            id="sellingPrice"
            label="Selling Price"
            value={inputs.sellingPrice}
            onChange={(v) => updateInput('sellingPrice', v)}
            min={0.01}
            max={10000}
            step={1}
            helpText="Your product listing price"
          />
          <NumberInput
            id="ordersPerMonth"
            label="Orders Per Month"
            value={inputs.ordersPerMonth}
            onChange={(v) => updateInput('ordersPerMonth', v)}
            min={1}
            max={10000}
            step={10}
            suffix="orders"
            helpText="Expected monthly order volume"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Costs</h3>
          <CurrencyInput
            id="supplierCost"
            label="Supplier Cost"
            value={inputs.supplierCost}
            onChange={(v) => updateInput('supplierCost', v)}
            min={0}
            max={5000}
            step={0.5}
            helpText="What you pay the supplier per item"
          />
          <CurrencyInput
            id="adSpendPerSale"
            label="Ad Spend Per Sale"
            value={inputs.adSpendPerSale}
            onChange={(v) => updateInput('adSpendPerSale', v)}
            min={0}
            max={500}
            step={0.5}
            helpText="Average advertising cost to acquire one sale"
          />
        </div>
      </div>

      {/* Advanced Options */}
      {isAdvanced && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Platform</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <DropdownInput
                id="platform"
                label="Platform"
                value={inputs.platform}
                onChange={(v) => updateInput('platform', v)}
                options={DROPSHIP_PLATFORMS}
                helpText="Auto-sets typical fee rates"
              />
              <CurrencyInput
                id="monthlyFixedCosts"
                label="Monthly Fixed Costs"
                value={inputs.monthlyFixedCosts}
                onChange={(v) => updateInput('monthlyFixedCosts', v)}
                min={0}
                max={5000}
                step={1}
                helpText="Platform subscription, tools, apps"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Fees</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <SliderInput
                id="platformFeePercent"
                label="Platform Fee"
                value={inputs.platformFeePercent}
                onChange={(v) => updateInput('platformFeePercent', v)}
                min={0}
                max={20}
                step={0.5}
                formatValue={(v) => `${v}%`}
                helpText="Marketplace commission per sale"
              />
              <SliderInput
                id="paymentProcessingPercent"
                label="Payment Processing"
                value={inputs.paymentProcessingPercent}
                onChange={(v) => updateInput('paymentProcessingPercent', v)}
                min={0}
                max={5}
                step={0.1}
                formatValue={(v) => `${v}%`}
                helpText="Credit card / payment gateway fee"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Returns & Refunds</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <SliderInput
                id="returnRatePercent"
                label="Return Rate"
                value={inputs.returnRatePercent}
                onChange={(v) => updateInput('returnRatePercent', v)}
                min={0}
                max={20}
                step={1}
                formatValue={(v) => `${v}%`}
                helpText="Percentage of orders returned"
              />
              <SliderInput
                id="refundRatePercent"
                label="Refund Rate"
                value={inputs.refundRatePercent}
                onChange={(v) => updateInput('refundRatePercent', v)}
                min={0}
                max={15}
                step={1}
                formatValue={(v) => `${v}%`}
                helpText="Percentage of orders refunded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Profitability Analysis</h3>
          <CopyResultsButton getResultsText={getResultsText} category="sidehustle" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Profit Per Order"
            value={formatCurrency(results.profitPerOrder)}
            numericValue={results.profitPerOrder}
            formatFn={formatCurrency}
            description="After all per-order costs"
            highlight
            size="lg"
            category="sidehustle"
          />
          <ResultCard
            label="Monthly Profit"
            value={formatCurrency(results.monthlyProfit)}
            description={`From ${inputs.ordersPerMonth} orders`}
          />
          <ResultCard
            label={<><Tooltip text="Percentage of selling price retained as profit after all per-order costs">Profit Margin</Tooltip></>}
            value={`${results.profitMargin}%`}
            description="Per-order margin"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <ResultCard
            label="Break-Even Orders"
            value={results.breakEvenOrders === -1 ? 'N/A' : `${results.breakEvenOrders}`}
            description={results.breakEvenOrders === -1 ? 'Not profitable per order' : `${results.breakEvenOrders} orders/mo to cover fixed costs`}
          />
          <ResultCard
            label={<><Tooltip text="Return on Ad Spend — revenue generated per dollar of ad spend">ROAS</Tooltip></>}
            value={`${results.roas.toFixed(1)}x`}
            description="Revenue per ad dollar"
          />
        </div>

        <ChartCard title="Cost Breakdown" category="sidehustle">
          <DonutChart
            data={donutData}
            category="sidehustle"
            innerLabel="Per Order"
            innerValue={formatCurrency(results.profitPerOrder)}
          />
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Per-Order Breakdown"
            category="sidehustle"
            items={[
              { label: 'Selling Price', value: formatCurrency(inputs.sellingPrice) },
              { label: <Tooltip text="Cost paid to supplier for the product">Supplier Cost</Tooltip>, value: `-${formatCurrency(inputs.supplierCost)}` },
              { label: <Tooltip text="Average advertising cost per acquired sale">Ad Spend</Tooltip>, value: `-${formatCurrency(inputs.adSpendPerSale)}` },
              { label: <Tooltip text="Marketplace commission on each sale">Platform Fee</Tooltip>, value: `-${formatCurrency(results.platformFee)}` },
              { label: <Tooltip text="Credit card or payment gateway fee">Processing Fee</Tooltip>, value: `-${formatCurrency(results.processingFee)}` },
              { label: <Tooltip text="Average cost of returned orders spread across all orders">Returns</Tooltip>, value: `-${formatCurrency(results.returnCost)}` },
              { label: <Tooltip text="Average cost of refunded orders spread across all orders">Refunds</Tooltip>, value: `-${formatCurrency(results.refundCost)}` },
              { label: 'Profit Per Order', value: formatCurrency(results.profitPerOrder), highlight: true },
            ]}
          />
          <div className="space-y-4">
            <ResultCard
              label="Monthly Revenue"
              value={formatCurrency(results.monthlyRevenue)}
              description={`${inputs.ordersPerMonth} orders x ${formatCurrency(inputs.sellingPrice)}`}
              size="sm"
            />
            <ResultCard
              label="Total Per-Order Costs"
              value={formatCurrency(results.totalPerOrderCosts)}
              description="All costs before fixed expenses"
              size="sm"
            />
            <div className="bg-sidehustle-50 rounded-xl p-4 text-sm text-sidehustle-800">
              <strong>Tip:</strong> Most successful dropshippers target 15-30% profit margins.
              Below 15%, one bad return can wipe your profits.
            </div>
          </div>
        </div>

        {/* Quick mode indicator */}
        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Using {DEFAULT_INPUTS.platformFeePercent}% platform fee, {DEFAULT_INPUTS.paymentProcessingPercent}% processing, {DEFAULT_INPUTS.returnRatePercent}% returns, {DEFAULT_INPUTS.refundRatePercent}% refunds, ${DEFAULT_INPUTS.monthlyFixedCosts}/mo fixed costs.{' '}
            <button
              onClick={() => setMode('advanced')}
              className="text-sidehustle-600 hover:underline font-medium"
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
