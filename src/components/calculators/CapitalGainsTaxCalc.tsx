import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { BarComparisonChart } from '../ui/charts/BarComparisonChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateCapitalGainsTaxResults,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type CapitalGainsTaxInputs,
} from '../../lib/calculators/capital-gains-tax';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

const FILING_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married Filing Jointly' },
  { value: 'married_separate', label: 'Married Filing Separately' },
  { value: 'head_household', label: 'Head of Household' },
];

const HOLDING_PERIOD_OPTIONS = [
  { value: 'long', label: 'Long-Term (1+ year)' },
  { value: 'short', label: 'Short-Term (< 1 year)' },
];

export function CapitalGainsTaxCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } =
    useCalculatorState<CapitalGainsTaxInputs>(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  const results = calculateCapitalGainsTaxResults(inputs);

  const getResultsText = () =>
    `Capital Gains Tax Calculator (CalcFalcon)\n` +
    `Capital Gains Tax: ${formatCurrency(results.totalTax)}\n` +
    `Effective Rate: ${results.effectiveRate.toFixed(1)}%\n` +
    `Net Gain: ${formatCurrency(results.netGain)}\n` +
    `https://calcfalcon.com/personal-finance/capital-gains-tax-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using $75K ordinary income, 5% state tax, no losses
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Investment Details</h3>

          <CurrencyInput
            id="gainAmount"
            label="Capital Gain Amount"
            value={inputs.gainAmount}
            onChange={(v) => updateInput('gainAmount', v)}
            min={0}
            max={5000000}
            step={5000}
            helpText="Total profit from selling investments"
          />

          <DropdownInput
            id="holdingPeriod"
            label="Holding Period"
            value={inputs.holdingPeriod}
            onChange={(v) => updateInput('holdingPeriod', v as CapitalGainsTaxInputs['holdingPeriod'])}
            options={HOLDING_PERIOD_OPTIONS}
            helpText="How long you held the investment before selling"
          />

          <DropdownInput
            id="filingStatus"
            label="Filing Status"
            value={inputs.filingStatus}
            onChange={(v) => updateInput('filingStatus', v as CapitalGainsTaxInputs['filingStatus'])}
            options={FILING_STATUS_OPTIONS}
            helpText="Your tax filing status"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Income & Adjustments' : 'Tax Settings'}
          </h3>

          {isAdvanced && (
            <CurrencyInput
              id="ordinaryIncome"
              label="Ordinary Income (W2, business)"
              value={inputs.ordinaryIncome}
              onChange={(v) => updateInput('ordinaryIncome', v)}
              min={0}
              max={2000000}
              step={5000}
              helpText="Non-investment income used for bracket stacking"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="capitalLosses"
              label="Capital Losses"
              value={inputs.capitalLosses}
              onChange={(v) => updateInput('capitalLosses', v)}
              min={0}
              max={5000000}
              step={1000}
              helpText="Losses from other investment sales this year"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="stateTaxRate"
              label="State Tax Rate"
              value={inputs.stateTaxRate}
              onChange={(v) => updateInput('stateTaxRate', v)}
              min={0}
              max={15}
              step={0.1}
              formatValue={(v) => `${v}%`}
              helpText="Your state's capital gains tax rate (0% for TX, FL, etc.)"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Capital Gains Tax</h3>
          <CopyResultsButton getResultsText={getResultsText} category="finance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Capital Gains Tax"
            value={formatCurrency(results.totalTax)}
            numericValue={results.totalTax}
            formatFn={formatCurrency}
            description={`On ${formatCurrency(results.netGain)} net gain`}
            category="finance"
            highlight
          />
          <ResultCard
            label="Effective Rate"
            value={`${results.effectiveRate.toFixed(1)}%`}
            description={inputs.holdingPeriod === 'long' ? `${results.longTermRate.toFixed(1)}% federal rate` : 'Taxed as ordinary income'}
            category="finance"
          />
          <ResultCard
            label="Long-Term Savings"
            value={inputs.holdingPeriod === 'long' && results.taxSavingsFromLongTerm > 0
              ? formatCurrency(results.taxSavingsFromLongTerm)
              : inputs.holdingPeriod === 'short'
              ? formatCurrency(results.shortTermTax - results.longTermTax)
              : '$0'}
            numericValue={inputs.holdingPeriod === 'long'
              ? results.taxSavingsFromLongTerm
              : results.shortTermTax - results.longTermTax}
            formatFn={formatCurrency}
            description={inputs.holdingPeriod === 'short' ? 'Hold 1+ year to save this' : 'Saved vs short-term rates'}
            category="finance"
          />
        </div>

        {results.niitTax > 0 && (
          <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-amber-800 font-medium">
              Net Investment Income Tax: {formatCurrency(results.niitTax)}
            </p>
            <p className="text-amber-600 text-sm mt-1">
              The 3.8% NIIT applies because your income exceeds the threshold for your filing status
            </p>
          </div>
        )}

        <ChartCard title="Short-Term vs Long-Term Comparison" category="finance">
          <BarComparisonChart
            data={results.comparison}
            bars={[
              { dataKey: 'federal', label: 'Federal Tax' },
              { dataKey: 'niit', label: 'NIIT (3.8%)' },
              { dataKey: 'state', label: 'State Tax' },
            ]}
            category="finance"
            stacked
          />
        </ChartCard>

        <ResultBreakdown
          title="Detailed Tax Breakdown"
          items={results.breakdown.map((item) => ({
            label: item.label === 'Net Investment Income Tax (3.8%)'
              ? <Tooltip text="An additional 3.8% tax on investment income for high earners above the MAGI threshold">{item.label}</Tooltip>
              : item.label.startsWith('Federal Tax (long-term')
              ? <Tooltip text="Long-term capital gains are taxed at preferential rates (0%, 15%, or 20%) that stack on top of your ordinary income">{item.label}</Tooltip>
              : item.label === 'Capital Losses'
              ? <Tooltip text="Capital losses offset gains dollar-for-dollar. Excess losses up to $3,000/year can offset ordinary income.">{item.label}</Tooltip>
              : item.label === 'Savings vs Short-Term'
              ? <Tooltip text="Amount saved by holding investments longer than one year for preferential tax rates">{item.label}</Tooltip>
              : item.label,
            value: formatCurrency(Math.abs(item.value)),
            highlight: item.label === 'Total Tax',
          }))}
          category="finance"
        />
      </div>
    </div>
    </ErrorBoundary>
  );
}
