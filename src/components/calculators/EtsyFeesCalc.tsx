import { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateEtsyFees,
  DEFAULT_INPUTS,
  type EtsyFeeInputs,
} from '../../lib/calculators/etsy-fees';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function EtsyFeesCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<EtsyFeeInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateEtsyFees(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof EtsyFeeInputs>(
    key: K,
    value: EtsyFeeInputs[K]
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
            Using default shipping and no ads
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Pricing</h3>
          <CurrencyInput
            id="itemPrice"
            label="Item Price"
            value={inputs.itemPrice}
            onChange={(v) => updateInput('itemPrice', v)}
            min={0.20}
            max={10000}
            step={1}
            helpText="Your listing price for the item"
          />
          <CurrencyInput
            id="shippingCharged"
            label="Shipping Charged to Buyer"
            value={inputs.shippingCharged}
            onChange={(v) => updateInput('shippingCharged', v)}
            min={0}
            max={500}
            step={0.5}
            helpText="What you charge customers for shipping"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Costs</h3>
          {isAdvanced && (
            <CurrencyInput
              id="itemCost"
              label="Item Cost (COGS)"
              value={inputs.itemCost}
              onChange={(v) => updateInput('itemCost', v)}
              min={0}
              max={5000}
              step={0.5}
              helpText="Materials and labor to make the item"
            />
          )}
          {isAdvanced && (
            <CurrencyInput
              id="shippingCost"
              label="Actual Shipping Cost"
              value={inputs.shippingCost}
              onChange={(v) => updateInput('shippingCost', v)}
              min={0}
              max={500}
              step={0.5}
              helpText="What you actually pay to ship"
            />
          )}
        </div>
      </div>

      {/* Advanced: Advertising Options */}
      {isAdvanced && (
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Advertising</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <SliderInput
              id="etsyAds"
              label="Etsy Ads Budget"
              value={inputs.etsyAdsPercent}
              onChange={(v) => updateInput('etsyAdsPercent', v)}
              min={0}
              max={15}
              step={1}
              formatValue={(v) => v === 0 ? 'Off' : `${v}%`}
              helpText="On-platform advertising"
            />
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.offsiteAdsOptedIn}
                  onChange={(e) => updateInput('offsiteAdsOptedIn', e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-300 text-creator-600 focus:ring-creator-500"
                />
                <span className="font-medium text-neutral-700">Offsite Ads (12%)</span>
              </label>
              <p className="text-xs text-neutral-500 ml-8">
                Charged only when a sale comes from Google, Facebook, etc.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-neutral-200 pt-8">
        <h3 className="font-semibold text-neutral-900 mb-4">Per-Item Analysis</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Net Profit"
            value={formatCurrency(results.netProfit)}
            description="After all fees & costs"
            highlight
            size="lg"
            category="creator"
          />
          <ResultCard
            label="Total Fees"
            value={formatCurrency(results.totalFees)}
            description={`${results.feePercentage}% of sale`}
          />
          <ResultCard
            label="Profit Margin"
            value={`${results.profitMargin}%`}
            description="Of gross revenue"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Fee Breakdown"
            category="creator"
            items={[
              { label: 'Listing Fee', value: formatCurrency(results.listingFee) },
              { label: 'Transaction Fee (6.5%)', value: formatCurrency(results.transactionFee) },
              { label: 'Payment Processing', value: formatCurrency(results.paymentProcessingFee) },
              ...(results.etsyAdsFee > 0 ? [{ label: 'Etsy Ads', value: formatCurrency(results.etsyAdsFee) }] : []),
              ...(results.offsiteAdsFee > 0 ? [{ label: 'Offsite Ads', value: formatCurrency(results.offsiteAdsFee) }] : []),
              { label: 'Total Fees', value: formatCurrency(results.totalFees), highlight: true },
            ]}
          />
          <div className="space-y-4">
            <ResultCard
              label="Gross Revenue"
              value={formatCurrency(results.grossRevenue)}
              description="Item + shipping"
              size="sm"
            />
            {isAdvanced && (
              <ResultCard
                label="Total Costs"
                value={formatCurrency(inputs.itemCost + inputs.shippingCost)}
                description="COGS + shipping"
                size="sm"
              />
            )}
            <div className="bg-creator-50 rounded-xl p-4 text-sm text-creator-800">
              <strong>Tip:</strong> Factor in Etsy fees when pricing your items.
              At minimum, add 10-12% to cover platform fees, plus your desired
              profit margin.
            </div>
          </div>
        </div>

        {/* Quick mode indicator */}
        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Using ${DEFAULT_INPUTS.itemCost} item cost, ${DEFAULT_INPUTS.shippingCost} shipping cost, no ads.{' '}
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
