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
import { ProjectionChart } from '../ui/charts/ProjectionChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateRentVsBuy,
  DEFAULT_INPUTS,
  type RentVsBuyInputs,
} from '../../lib/calculators/rent-vs-buy';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

const LOAN_TERM_OPTIONS = [
  { value: '15', label: '15 years' },
  { value: '20', label: '20 years' },
  { value: '30', label: '30 years' },
];

export function RentVsBuyCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<RentVsBuyInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateRentVsBuy(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof RentVsBuyInputs>(
    key: K,
    value: RentVsBuyInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';
  const buyBetter = results.totalCostBuy < results.totalCostRent;

  const getResultsText = () =>
    `Rent vs Buy Calculator (CalcFalcon)\n` +
    `Monthly Mortgage: ${formatCurrency(results.monthlyMortgagePayment)}\n` +
    `Monthly Buy Total: ${formatCurrency(results.monthlyBuyTotal)}\n` +
    `${buyBetter ? 'Buying' : 'Renting'} saves ${formatCurrency(Math.abs(results.totalCostBuy - results.totalCostRent))} over ${inputs.yearsToCompare} years\n` +
    `https://calcfalcon.com/personal-finance/rent-vs-buy-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using 30-year loan, 3% rent increase, 1.1% property tax
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Buying</h3>
          <CurrencyInput
            id="homePrice"
            label="Home Price"
            value={inputs.homePrice}
            onChange={(v) => updateInput('homePrice', v)}
            min={50000}
            max={3000000}
            step={10000}
            helpText="Purchase price of the home"
          />
          <SliderInput
            id="downPaymentPercent"
            label="Down Payment"
            value={inputs.downPaymentPercent}
            onChange={(v) => updateInput('downPaymentPercent', v)}
            min={0}
            max={100}
            step={1}
            formatValue={(v) => `${v}% (${formatCurrency(inputs.homePrice * v / 100)})`}
            helpText="Percentage of home price"
          />
          <SliderInput
            id="mortgageRate"
            label="Mortgage Interest Rate"
            value={inputs.mortgageRate}
            onChange={(v) => updateInput('mortgageRate', v)}
            min={2}
            max={12}
            step={0.125}
            formatValue={(v) => `${v}%`}
            helpText="Annual mortgage interest rate"
          />
          {isAdvanced && (
            <DropdownInput
              id="loanTermYears"
              label="Loan Term"
              value={String(inputs.loanTermYears)}
              onChange={(v) => updateInput('loanTermYears', parseInt(v))}
              options={LOAN_TERM_OPTIONS}
            />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Renting</h3>
          <CurrencyInput
            id="monthlyRent"
            label="Monthly Rent"
            value={inputs.monthlyRent}
            onChange={(v) => updateInput('monthlyRent', v)}
            min={300}
            max={10000}
            step={50}
            helpText="Current monthly rent payment"
          />
          <NumberInput
            id="yearsToCompare"
            label="Years to Compare"
            value={inputs.yearsToCompare}
            onChange={(v) => updateInput('yearsToCompare', v)}
            min={1}
            max={30}
            suffix="years"
            helpText="How long you plan to stay"
          />
          {isAdvanced && (
            <SliderInput
              id="rentIncreaseRate"
              label="Annual Rent Increase"
              value={inputs.rentIncreaseRate}
              onChange={(v) => updateInput('rentIncreaseRate', v)}
              min={0}
              max={10}
              step={0.5}
              formatValue={(v) => `${v}%`}
              helpText="Expected annual rent increase"
            />
          )}
        </div>
      </div>

      {isAdvanced && (
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Additional Costs & Returns</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <SliderInput
              id="propertyTaxRate"
              label="Property Tax Rate"
              value={inputs.propertyTaxRate}
              onChange={(v) => updateInput('propertyTaxRate', v)}
              min={0}
              max={4}
              step={0.1}
              formatValue={(v) => `${v}%`}
              helpText="Annual property tax as % of home value"
            />
            <CurrencyInput
              id="homeInsurance"
              label="Annual Home Insurance"
              value={inputs.homeInsurance}
              onChange={(v) => updateInput('homeInsurance', v)}
              min={0}
              max={10000}
              step={100}
              helpText="Annual homeowner's insurance premium"
            />
            <SliderInput
              id="maintenancePercent"
              label="Annual Maintenance"
              value={inputs.maintenancePercent}
              onChange={(v) => updateInput('maintenancePercent', v)}
              min={0}
              max={3}
              step={0.25}
              formatValue={(v) => `${v}%`}
              helpText="Annual maintenance as % of home value"
            />
            <SliderInput
              id="homeAppreciation"
              label="Home Appreciation"
              value={inputs.homeAppreciation}
              onChange={(v) => updateInput('homeAppreciation', v)}
              min={0}
              max={10}
              step={0.5}
              formatValue={(v) => `${v}%`}
              helpText="Expected annual home value increase"
            />
            <SliderInput
              id="investmentReturn"
              label="Investment Return (Renter)"
              value={inputs.investmentReturn}
              onChange={(v) => updateInput('investmentReturn', v)}
              min={0}
              max={15}
              step={0.5}
              formatValue={(v) => `${v}%`}
              helpText="Return on invested savings if renting"
            />
          </div>
        </div>
      )}

      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Comparison Results</h3>
          <CopyResultsButton getResultsText={getResultsText} category="finance" />
        </div>

        {/* Winner Badge */}
        <div className={`mb-6 p-4 rounded-xl ${buyBetter ? 'bg-green-50 border border-green-100' : 'bg-blue-50 border border-blue-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${buyBetter ? 'bg-green-500' : 'bg-blue-500'} text-white font-bold text-xs`}>
              {buyBetter ? 'BUY' : 'RENT'}
            </div>
            <div>
              <p className={`font-semibold ${buyBetter ? 'text-green-800' : 'text-blue-800'}`}>
                {buyBetter ? 'Buying' : 'Renting'} comes out ahead over {inputs.yearsToCompare} years
              </p>
              <p className={`text-sm ${buyBetter ? 'text-green-600' : 'text-blue-600'}`}>
                saving {formatCurrency(Math.abs(results.totalCostBuy - results.totalCostRent))} in net costs
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Monthly Mortgage"
            value={formatCurrency(results.monthlyMortgagePayment)}
            numericValue={results.monthlyMortgagePayment}
            formatFn={formatCurrency}
            description="Principal + interest only"
            category="finance"
          />
          <ResultCard
            label="Monthly Buy Total"
            value={formatCurrency(results.monthlyBuyTotal)}
            numericValue={results.monthlyBuyTotal}
            formatFn={formatCurrency}
            description={<Tooltip text="Mortgage + property tax + insurance + maintenance">All monthly homeowner costs</Tooltip>}
            highlight
            size="lg"
            category="finance"
          />
          <ResultCard
            label="Break-Even Year"
            value={results.breakEvenYear > 0 ? `Year ${results.breakEvenYear}` : 'N/A'}
            description={results.breakEvenYear > 0 ? 'When buying becomes cheaper' : 'Buying doesn\'t break even'}
          />
        </div>

        {results.timeline.length > 1 && (
          <ChartCard title="Cumulative Net Cost Over Time" category="finance" className="mb-6">
            <ProjectionChart
              data={results.timeline.map((t) => ({
                label: `Yr ${t.year}`,
                rentCumulative: t.rentCumulative,
                buyCumulative: t.buyCumulative,
              }))}
              lines={[
                { dataKey: 'rentCumulative', label: 'Rent (net cost)', areaFill: false },
                { dataKey: 'buyCumulative', label: 'Buy (net cost)', areaFill: false },
              ]}
              category="finance"
            />
          </ChartCard>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Buying Costs"
            category="finance"
            items={[
              { label: 'Down Payment', value: formatCurrency(inputs.homePrice * inputs.downPaymentPercent / 100) },
              { label: 'Monthly Mortgage (P&I)', value: formatCurrency(results.monthlyMortgagePayment) },
              { label: <Tooltip text="Property tax + insurance + maintenance">Monthly Extras</Tooltip>, value: formatCurrency(results.monthlyBuyTotal - results.monthlyMortgagePayment) },
              { label: `Net Cost (${inputs.yearsToCompare} yr)`, value: formatCurrency(results.totalCostBuy), highlight: true },
            ]}
          />
          <ResultBreakdown
            title="Renting Costs"
            category="finance"
            items={[
              { label: 'Starting Rent', value: `${formatCurrency(inputs.monthlyRent)}/mo` },
              { label: `Net Cost (${inputs.yearsToCompare} yr)`, value: formatCurrency(results.totalCostRent), highlight: true },
            ]}
          />
        </div>

        <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
          <h4 className="font-semibold text-neutral-900 mb-2">Recommendation</h4>
          <p className="text-neutral-600">{results.recommendation}</p>
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-amber-800 text-sm">
            <strong>Note:</strong> This calculator doesn't account for closing costs, PMI,
            moving expenses, or the emotional value of homeownership. These factors can
            significantly affect your decision.
          </p>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
