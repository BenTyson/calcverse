import { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateAirbnbProfit,
  DEFAULT_INPUTS,
  type AirbnbInputs,
} from '../../lib/calculators/airbnb-profit';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function AirbnbProfitCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<AirbnbInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateAirbnbProfit(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof AirbnbInputs>(
    key: K,
    value: AirbnbInputs[K]
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
            Using standard fee and expense estimates
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Pricing & Bookings</h3>
          <CurrencyInput
            id="nightlyRate"
            label="Nightly Rate"
            value={inputs.nightlyRate}
            onChange={(v) => updateInput('nightlyRate', v)}
            min={25}
            max={1000}
            step={5}
            helpText="Average price per night"
          />
          <SliderInput
            id="occupancy"
            label="Occupancy Rate"
            value={inputs.occupancyRate}
            onChange={(v) => updateInput('occupancyRate', v)}
            min={10}
            max={100}
            step={5}
            formatValue={(v) => `${v}%`}
            helpText="% of nights booked per month"
          />
          {isAdvanced && (
            <CurrencyInput
              id="cleaningFee"
              label="Cleaning Fee (Charged to Guest)"
              value={inputs.cleaningFee}
              onChange={(v) => updateInput('cleaningFee', v)}
              min={0}
              max={500}
              step={5}
              helpText="Fee added to each booking"
            />
          )}
        </div>

        {isAdvanced && (
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Costs & Expenses</h3>
            <SliderInput
              id="airbnbFee"
              label="Airbnb Host Fee"
              value={inputs.airbnbFeePercent}
              onChange={(v) => updateInput('airbnbFeePercent', v)}
              min={0}
              max={15}
              step={0.5}
              formatValue={(v) => `${v}%`}
              helpText="Typically 3% for most hosts"
            />
            <CurrencyInput
              id="cleaningCost"
              label="Cleaning Cost Per Turnover"
              value={inputs.cleaningCost}
              onChange={(v) => updateInput('cleaningCost', v)}
              min={0}
              max={300}
              step={5}
              helpText="What you pay for cleaning"
            />
            <CurrencyInput
              id="supplies"
              label="Monthly Supplies"
              value={inputs.suppliesCost}
              onChange={(v) => updateInput('suppliesCost', v)}
              min={0}
              max={500}
              step={10}
              helpText="Toiletries, linens, consumables"
            />
            <CurrencyInput
              id="utilities"
              label="Monthly Utilities"
              value={inputs.utilitiesCost}
              onChange={(v) => updateInput('utilitiesCost', v)}
              min={0}
              max={1000}
              step={10}
              helpText="Electric, gas, internet, etc."
            />
            <CurrencyInput
              id="mortgage"
              label="Monthly Mortgage/Rent"
              value={inputs.mortgageOrRent}
              onChange={(v) => updateInput('mortgageOrRent', v)}
              min={0}
              max={10000}
              step={50}
              helpText="Property cost (if applicable)"
            />
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <h3 className="font-semibold text-neutral-900 mb-4">Your Profit</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Monthly Net Profit"
            value={formatCurrency(results.monthlyNet)}
            description={`${results.profitMargin}% margin`}
            highlight
            size="lg"
            category="gig"
          />
          <ResultCard
            label="Annual Profit"
            value={formatCurrency(results.annualNet)}
            description="Projected yearly"
          />
          <ResultCard
            label="Break-Even"
            value={`${results.breakEvenOccupancy}%`}
            description="Min occupancy needed"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Monthly Breakdown"
            category="gig"
            items={[
              { label: 'Gross Revenue', value: formatCurrency(results.monthlyGross) },
              { label: 'Airbnb Fee', value: `-${formatCurrency(results.airbnbFee)}` },
              { label: 'Cleaning Costs', value: `-${formatCurrency(results.monthlyCleaningCosts)}` },
              { label: 'Operating Costs', value: `-${formatCurrency(results.monthlyOperatingCosts)}` },
              { label: 'Net Profit', value: formatCurrency(results.monthlyNet), highlight: true },
            ]}
          />
          <div className="space-y-4">
            <ResultCard
              label="Nights Booked/Month"
              value={results.nightsBookedPerMonth.toString()}
              description={`${inputs.occupancyRate}% occupancy`}
              size="sm"
            />
            <ResultCard
              label="Total Monthly Expenses"
              value={formatCurrency(results.totalExpenses)}
              description="All costs combined"
              size="sm"
            />
            <div className="bg-gig-50 rounded-xl p-4 text-sm text-gig-800">
              <strong>Pro tip:</strong> Aim for 50%+ occupancy for profitability.
              Adjust pricing dynamically—raise rates during peak seasons and lower
              during slow periods to maximize occupancy and revenue.
            </div>
          </div>
        </div>

        {/* Quick mode indicator */}
        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Using ${DEFAULT_INPUTS.cleaningFee} cleaning fee, {DEFAULT_INPUTS.airbnbFeePercent}% Airbnb fee, ${DEFAULT_INPUTS.mortgageOrRent}/mo housing cost.{' '}
            <button
              onClick={() => setMode('advanced')}
              className="text-gig-600 hover:underline font-medium"
            >
              Customize these
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
