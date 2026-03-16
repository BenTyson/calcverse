import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { ProjectionChart } from '../ui/charts/ProjectionChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateBreakEven,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type BreakEvenInputs,
} from '../../lib/calculators/break-even';
import { formatCurrency, formatNumber } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function BreakEvenCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } =
    useCalculatorState<BreakEvenInputs>(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  const results = calculateBreakEven(inputs);

  const getResultsText = () =>
    `Break-Even Calculator (CalcFalcon)\n` +
    `Break-Even Units: ${formatNumber(results.breakEvenUnits)}\n` +
    `Break-Even Revenue: ${formatCurrency(results.breakEvenRevenue)}\n` +
    `Contribution Margin: ${formatCurrency(results.contributionMargin)}/unit\n` +
    `https://calcfalcon.com/freelance/break-even-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            No target profit or tax rate
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Costs</h3>
          <CurrencyInput
            id="fixedCosts"
            label="Fixed Costs"
            value={inputs.fixedCosts}
            onChange={(v) => updateInput('fixedCosts', v)}
            min={0}
            max={1000000}
            step={100}
            helpText="Monthly costs that don't change with volume (rent, software, salaries)"
          />
          <CurrencyInput
            id="variableCostPerUnit"
            label="Variable Cost Per Unit"
            value={inputs.variableCostPerUnit}
            onChange={(v) => updateInput('variableCostPerUnit', v)}
            min={0}
            max={10000}
            step={1}
            helpText="Cost to produce or deliver one additional unit"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Revenue</h3>
          <CurrencyInput
            id="pricePerUnit"
            label="Price Per Unit"
            value={inputs.pricePerUnit}
            onChange={(v) => updateInput('pricePerUnit', v)}
            min={0}
            max={100000}
            step={1}
            helpText="Selling price per unit, product, or service"
          />

          {isAdvanced && (
            <>
              <CurrencyInput
                id="targetProfit"
                label="Target Profit"
                value={inputs.targetProfit}
                onChange={(v) => updateInput('targetProfit', v)}
                min={0}
                max={1000000}
                step={500}
                helpText="Desired profit above break-even (after tax)"
              />
              <SliderInput
                id="taxRate"
                label="Tax Rate"
                value={inputs.taxRate}
                onChange={(v) => updateInput('taxRate', v)}
                min={0}
                max={50}
                step={1}
                formatValue={(v) => `${v}%`}
                helpText="Estimated tax rate on profits"
              />
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Break-Even Analysis</h3>
          <CopyResultsButton getResultsText={getResultsText} category="freelance" />
        </div>

        <div className={`grid sm:grid-cols-2 ${isAdvanced ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 mb-6`}>
          <ResultCard
            label="Break-Even Units"
            value={formatNumber(results.breakEvenUnits)}
            description="Units to cover all costs"
            highlight
            category="freelance"
          />
          <ResultCard
            label="Break-Even Revenue"
            value={formatCurrency(results.breakEvenRevenue)}
            numericValue={results.breakEvenRevenue}
            formatFn={formatCurrency}
            description="Revenue needed to break even"
          />
          <ResultCard
            label="Contribution Margin"
            value={formatCurrency(results.contributionMargin)}
            description={`${results.contributionMarginRatio}% of price`}
          />
          {isAdvanced && results.targetProfitUnits > 0 && (
            <ResultCard
              label="Target Profit Units"
              value={formatNumber(results.targetProfitUnits)}
              description={`${formatCurrency(results.targetProfitRevenue)} revenue`}
            />
          )}
        </div>

        {results.projectionData.length > 1 && (
          <ChartCard title="Revenue vs Total Cost" category="freelance" className="mb-6">
            <ProjectionChart
              data={results.projectionData.map((d) => ({
                label: d.label,
                revenue: d.revenue,
                totalCost: d.totalCost,
              }))}
              lines={[
                { dataKey: 'revenue', label: 'Revenue', areaFill: true },
                { dataKey: 'totalCost', label: 'Total Cost', dashed: true },
              ]}
              category="freelance"
            />
          </ChartCard>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Cost Structure"
            category="freelance"
            items={[
              { label: 'Fixed Costs', value: formatCurrency(inputs.fixedCosts) },
              { label: 'Variable Cost/Unit', value: formatCurrency(inputs.variableCostPerUnit) },
              { label: 'Price/Unit', value: formatCurrency(inputs.pricePerUnit) },
              { label: <Tooltip text="The amount each unit contributes to covering fixed costs after its variable cost is paid. Higher contribution margin means fewer units needed to break even.">Contribution Margin</Tooltip>, value: `${formatCurrency(results.contributionMargin)}/unit (${results.contributionMarginRatio}%)`, highlight: true },
            ]}
          />
          <div className="space-y-4">
            {inputs.pricePerUnit <= inputs.variableCostPerUnit && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <p className="text-red-800 font-semibold">Price is at or below variable cost</p>
                <p className="text-red-600 text-sm mt-1">
                  You'll never break even — each unit sold increases your loss. Raise prices or reduce variable costs.
                </p>
              </div>
            )}
            {results.breakEvenUnits > 0 && inputs.pricePerUnit > inputs.variableCostPerUnit && (
              <div className="bg-freelance-50 rounded-xl p-4 text-sm text-freelance-800">
                <strong>Insight:</strong> After selling {formatNumber(results.breakEvenUnits)} units, every additional
                sale contributes {formatCurrency(results.contributionMargin)} directly to profit.
                {isAdvanced && results.targetProfitUnits > 0 && (
                  <> To earn {formatCurrency(inputs.targetProfit)} after tax, you need {formatNumber(results.targetProfitUnits)} units.</>
                )}
              </div>
            )}
            <div className="bg-freelance-50 rounded-xl p-4 text-sm text-freelance-800">
              <strong>Tip:</strong> Reduce your break-even point by lowering fixed costs, reducing variable costs per unit,
              or increasing your price. Even small changes in contribution margin compound across volume.
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
