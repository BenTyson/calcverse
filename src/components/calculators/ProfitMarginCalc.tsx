import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { NumberInput } from '../ui/inputs/NumberInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { DonutChart } from '../ui/charts/DonutChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateProfitMargin,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type ProfitMarginInputs,
} from '../../lib/calculators/profit-margin';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function ProfitMarginCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } =
    useCalculatorState<ProfitMarginInputs>(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  const results = calculateProfitMargin(inputs);

  const getResultsText = () => {
    let text = `Profit Margin Calculator (CalcFalcon)\n` +
      `Gross Margin: ${results.grossMargin.toFixed(1)}%\n`;
    if (isAdvanced) {
      text += `Operating Margin: ${results.operatingMargin.toFixed(1)}%\n` +
        `Net Margin: ${results.netMargin.toFixed(1)}%\n` +
        `Net Profit: ${formatCurrency(results.netProfit)}\n`;
    } else {
      text += `Gross Profit: ${formatCurrency(results.grossProfit)}\n`;
    }
    text += `https://calcfalcon.com/side-hustle/profit-margin-calculator`;
    return text;
  };

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Gross margin only. Switch to Advanced for full P&L analysis.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Revenue & COGS</h3>

          <CurrencyInput
            id="revenue"
            label="Revenue"
            value={inputs.revenue}
            onChange={(v) => updateInput('revenue', v)}
            min={0}
            max={10000000}
            step={500}
            helpText="Total sales revenue for the period"
          />

          <CurrencyInput
            id="costOfGoods"
            label="Cost of Goods Sold (COGS)"
            value={inputs.costOfGoods}
            onChange={(v) => updateInput('costOfGoods', v)}
            min={0}
            max={10000000}
            step={500}
            helpText="Direct costs to produce or acquire goods"
          />

          {isAdvanced && (
            <NumberInput
              id="unitsSold"
              label="Units Sold"
              value={inputs.unitsSold}
              onChange={(v) => updateInput('unitsSold', v)}
              min={0}
              max={1000000}
              step={1}
              helpText="Number of units sold (for per-unit profit)"
            />
          )}
        </div>

        {isAdvanced && (
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Expenses & Tax</h3>

            <CurrencyInput
              id="operatingExpenses"
              label="Operating Expenses"
              value={inputs.operatingExpenses}
              onChange={(v) => updateInput('operatingExpenses', v)}
              min={0}
              max={5000000}
              step={500}
              helpText="Rent, software, salaries, utilities, etc."
            />

            <CurrencyInput
              id="otherExpenses"
              label="Other Expenses"
              value={inputs.otherExpenses}
              onChange={(v) => updateInput('otherExpenses', v)}
              min={0}
              max={1000000}
              step={100}
              helpText="Marketing, interest, miscellaneous costs"
            />

            <SliderInput
              id="taxRate"
              label="Tax Rate"
              value={inputs.taxRate}
              onChange={(v) => updateInput('taxRate', v)}
              min={0}
              max={50}
              step={0.5}
              suffix="%"
              helpText="Effective tax rate on profits"
            />
          </div>
        )}
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Profit Margins</h3>
          <CopyResultsButton getResultsText={getResultsText} category="sidehustle" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Gross Margin"
            value={`${results.grossMargin.toFixed(1)}%`}
            description={`Gross Profit: ${formatCurrency(results.grossProfit)}`}
            category="sidehustle"
            highlight
          />
          {isAdvanced && (
            <ResultCard
              label="Operating Margin"
              value={`${results.operatingMargin.toFixed(1)}%`}
              description={`Operating Profit: ${formatCurrency(results.operatingProfit)}`}
              category="sidehustle"
            />
          )}
          {isAdvanced && (
            <ResultCard
              label="Net Margin"
              value={`${results.netMargin.toFixed(1)}%`}
              description={`Net Profit: ${formatCurrency(results.netProfit)}`}
              category="sidehustle"
            />
          )}
        </div>

        {isAdvanced && inputs.unitsSold > 0 && (
          <div className="mb-6 p-4 bg-sidehustle-50 rounded-xl border border-sidehustle-100">
            <p className="text-sidehustle-800 font-medium">
              Profit Per Unit: {formatCurrency(results.profitPerUnit)}
            </p>
            <p className="text-sidehustle-600 text-sm mt-1">
              Based on {inputs.unitsSold.toLocaleString()} units sold
            </p>
          </div>
        )}

        {isAdvanced && results.breakEvenRevenue > 0 && (
          <div className="mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <p className="text-neutral-800 font-medium">
              Break-Even Revenue: {formatCurrency(results.breakEvenRevenue)}
            </p>
            <p className="text-neutral-600 text-sm mt-1">
              Revenue needed to cover all costs including tax
            </p>
          </div>
        )}

        {isAdvanced && results.donutData.length > 1 && (
          <ChartCard title="Cost Breakdown" category="sidehustle">
            <DonutChart
              data={results.donutData}
              category="sidehustle"
              formatValue={formatCurrency}
              innerLabel="Net Margin"
              innerValue={`${results.netMargin.toFixed(1)}%`}
            />
          </ChartCard>
        )}

        <ResultBreakdown
          title="Profit & Loss Breakdown"
          items={results.breakdown.map((item) => ({
            label: item.label === 'Gross Profit'
              ? <Tooltip text="Revenue minus cost of goods sold">{item.label}</Tooltip>
              : item.label === 'Operating Profit'
              ? <Tooltip text="Gross profit minus operating expenses">{item.label}</Tooltip>
              : item.label === 'Net Profit'
              ? <Tooltip text="Final profit after all expenses and taxes">{item.label}</Tooltip>
              : item.label === 'Cost of Goods Sold'
              ? <Tooltip text="Direct costs: materials, manufacturing, wholesale price">{item.label}</Tooltip>
              : item.label,
            value: item.value < 0 ? `-${formatCurrency(Math.abs(item.value))}` : formatCurrency(item.value),
            highlight: item.label === 'Net Profit',
          }))}
          category="sidehustle"
        />
      </div>
    </div>
    </ErrorBoundary>
  );
}
