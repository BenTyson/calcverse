import { useState, useEffect } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { NumberInput } from '../ui/inputs/NumberInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { DonutChart } from '../ui/charts/DonutChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateResellingProfit,
  DEFAULT_INPUTS,
  PLATFORMS,
  PLATFORM_PRESETS,
  type ResellingProfitInputs,
} from '../../lib/calculators/reselling-profit';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function ResellingProfitCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<ResellingProfitInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateResellingProfit(inputs);

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

  const updateInput = <K extends keyof ResellingProfitInputs>(
    key: K,
    value: ResellingProfitInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';

  const platformLabel = PLATFORMS.find((p) => p.value === inputs.platform)?.label ?? inputs.platform;

  const getResultsText = () =>
    `Reselling Profit Calculator (CalcFalcon)\n` +
    `Net Profit: ${formatCurrency(results.netProfit)}\n` +
    `Profit Margin: ${results.profitMargin}%\n` +
    `ROI: ${results.roi}%\n` +
    `Platform: ${platformLabel}\n` +
    `https://calcfalcon.com/side-hustle/reselling-profit-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using default fees for {platformLabel}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Item Details</h3>
          <CurrencyInput
            id="purchasePrice"
            label="Purchase Price"
            value={inputs.purchasePrice}
            onChange={(v) => updateInput('purchasePrice', v)}
            min={0}
            max={10000}
            step={1}
            helpText="What you paid to acquire the item"
          />
          <CurrencyInput
            id="sellingPrice"
            label="Selling Price"
            value={inputs.sellingPrice}
            onChange={(v) => updateInput('sellingPrice', v)}
            min={0}
            max={50000}
            step={1}
            helpText="Your listing price for the item"
          />
          <DropdownInput
            id="platform"
            label="Selling Platform"
            value={inputs.platform}
            onChange={(v) => updateInput('platform', v)}
            options={PLATFORMS}
            helpText="Platform fees are set automatically"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Costs</h3>
          <CurrencyInput
            id="shippingCost"
            label="Shipping Cost"
            value={inputs.shippingCost}
            onChange={(v) => updateInput('shippingCost', v)}
            min={0}
            max={500}
            step={0.5}
            helpText="Cost to ship the item to buyer"
          />
          {isAdvanced && (
            <SliderInput
              id="platformFeePercent"
              label="Platform Fee"
              value={inputs.platformFeePercent}
              onChange={(v) => updateInput('platformFeePercent', v)}
              min={0}
              max={30}
              step={0.25}
              formatValue={(v) => `${v}%`}
              helpText="Override the default platform fee"
            />
          )}
          {isAdvanced && (
            <SliderInput
              id="paymentProcessingPercent"
              label="Payment Processing Fee"
              value={inputs.paymentProcessingPercent}
              onChange={(v) => updateInput('paymentProcessingPercent', v)}
              min={0}
              max={5}
              step={0.1}
              formatValue={(v) => `${v}%`}
              helpText="Additional payment processing fee"
            />
          )}
          {isAdvanced && (
            <CurrencyInput
              id="shippingMaterialCost"
              label="Packaging Materials"
              value={inputs.shippingMaterialCost}
              onChange={(v) => updateInput('shippingMaterialCost', v)}
              min={0}
              max={50}
              step={0.5}
              helpText="Boxes, tape, bubble wrap, etc."
            />
          )}
        </div>
      </div>

      {isAdvanced && (
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Time Investment</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <NumberInput
              id="hoursSpentSourcing"
              label="Hours Spent Sourcing"
              value={inputs.hoursSpentSourcing}
              onChange={(v) => updateInput('hoursSpentSourcing', v)}
              min={0}
              max={40}
              step={0.5}
              suffix="hrs"
              helpText="Time finding, listing, and shipping"
            />
            <CurrencyInput
              id="desiredHourlyRate"
              label="Desired Hourly Rate"
              value={inputs.desiredHourlyRate}
              onChange={(v) => updateInput('desiredHourlyRate', v)}
              min={0}
              max={200}
              step={5}
              helpText="Your target hourly earnings"
            />
          </div>
        </div>
      )}

      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Per-Item Analysis</h3>
          <CopyResultsButton getResultsText={getResultsText} category="sidehustle" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Net Profit"
            value={formatCurrency(results.netProfit)}
            numericValue={results.netProfit}
            formatFn={formatCurrency}
            description="After all fees & costs"
            highlight
            size="lg"
            category="sidehustle"
          />
          <ResultCard
            label={<><Tooltip text="Percentage of selling price kept as profit">Profit Margin</Tooltip></>}
            value={`${results.profitMargin}%`}
            description="Of selling price"
          />
          <ResultCard
            label={<><Tooltip text="Return on investment based on purchase price and materials">ROI</Tooltip></>}
            value={`${results.roi}%`}
            description="On invested cost"
          />
        </div>

        <ChartCard title="Cost Breakdown" category="sidehustle">
          <DonutChart
            data={[
              { label: 'Profit', value: Math.max(0, results.netProfit) },
              { label: 'Platform Fee', value: results.platformFee },
              ...(results.processingFee > 0 ? [{ label: 'Processing Fee', value: results.processingFee }] : []),
              { label: 'COGS', value: inputs.purchasePrice },
              { label: 'Shipping', value: inputs.shippingCost + inputs.shippingMaterialCost },
            ]}
            category="sidehustle"
            innerLabel="Net Profit"
            innerValue={formatCurrency(results.netProfit)}
          />
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Profit Breakdown"
            category="sidehustle"
            items={[
              { label: 'Selling Price', value: formatCurrency(inputs.sellingPrice) },
              { label: 'Purchase Price', value: `-${formatCurrency(inputs.purchasePrice)}` },
              { label: <Tooltip text={`Fee charged by ${platformLabel} for selling on their platform`}>Platform Fee ({inputs.platformFeePercent}%)</Tooltip>, value: `-${formatCurrency(results.platformFee)}` },
              ...(results.processingFee > 0 ? [{ label: 'Processing Fee', value: `-${formatCurrency(results.processingFee)}` }] : []),
              { label: 'Shipping Cost', value: `-${formatCurrency(inputs.shippingCost)}` },
              ...(inputs.shippingMaterialCost > 0 ? [{ label: 'Materials', value: `-${formatCurrency(inputs.shippingMaterialCost)}` }] : []),
              { label: 'Net Profit', value: formatCurrency(results.netProfit), highlight: true },
            ]}
          />
          <div className="space-y-4">
            {isAdvanced && inputs.hoursSpentSourcing > 0 && (
              <ResultCard
                label="Effective Hourly Rate"
                value={formatCurrency(results.netProfit / inputs.hoursSpentSourcing)}
                description={`Based on ${inputs.hoursSpentSourcing} hrs`}
                size="sm"
              />
            )}
            {isAdvanced && inputs.hoursSpentSourcing > 0 && (
              <ResultCard
                label="Meets Hourly Goal"
                value={results.netProfit / inputs.hoursSpentSourcing >= inputs.desiredHourlyRate ? 'Yes' : 'No'}
                description={`Target: ${formatCurrency(inputs.desiredHourlyRate)}/hr`}
                size="sm"
              />
            )}
            <div className="bg-sidehustle-50 rounded-xl p-4 text-sm text-sidehustle-800">
              <strong>Tip:</strong> Track your sourcing time — many resellers underestimate labor costs.
            </div>
          </div>
        </div>

        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Using {platformLabel} fees ({inputs.platformFeePercent}%), ${DEFAULT_INPUTS.shippingMaterialCost} materials, {DEFAULT_INPUTS.hoursSpentSourcing}hr sourcing.{' '}
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
