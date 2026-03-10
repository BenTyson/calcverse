import { useState, useEffect } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateTuroProfit,
  DEFAULT_INPUTS,
  type TuroInputs,
} from '../../lib/calculators/turo-profit';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function TuroProfitCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<TuroInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateTuroProfit(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof TuroInputs>(
    key: K,
    value: TuroInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';

  const getResultsText = () =>
    `Turo Profit Calculator (CalcFalcon)\n` +
    `Monthly Net: ${formatCurrency(results.monthlyNet)}\n` +
    `Annual Profit: ${formatCurrency(results.annualNet)}\n` +
    `Break-Even: ${results.breakEvenDays} days/month\n` +
    `https://calcfalcon.com/gig-economy/turo-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using standard fees and expense estimates
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Rental Pricing</h3>
          <CurrencyInput
            id="dailyRate"
            label="Daily Rental Rate"
            value={inputs.dailyRentalRate}
            onChange={(v) => updateInput('dailyRentalRate', v)}
            min={20}
            max={500}
            step={5}
            helpText="Average price per day"
          />
          <SliderInput
            id="daysRented"
            label="Days Rented Per Month"
            value={inputs.daysRentedPerMonth}
            onChange={(v) => updateInput('daysRentedPerMonth', v)}
            min={0}
            max={30}
            step={1}
            formatValue={(v) => `${v} days`}
            helpText="Average days your car is booked"
          />
        </div>

        {isAdvanced && (
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Costs & Expenses</h3>
            <SliderInput
              id="turoFee"
              label="Turo Host Fee"
              value={inputs.turoHostFeePercent}
              onChange={(v) => updateInput('turoHostFeePercent', v)}
              min={10}
              max={35}
              step={1}
              formatValue={(v) => `${v}%`}
              helpText="Varies by protection plan (10-35%)"
            />
            <CurrencyInput
              id="carPayment"
              label="Monthly Car Payment"
              value={inputs.carPayment}
              onChange={(v) => updateInput('carPayment', v)}
              min={0}
              max={2000}
              step={25}
              helpText="Loan or lease payment"
            />
            <CurrencyInput
              id="insurance"
              label="Monthly Insurance"
              value={inputs.insurance}
              onChange={(v) => updateInput('insurance', v)}
              min={0}
              max={500}
              step={10}
              helpText="Personal auto insurance"
            />
            <CurrencyInput
              id="maintenance"
              label="Monthly Maintenance"
              value={inputs.maintenancePerMonth}
              onChange={(v) => updateInput('maintenancePerMonth', v)}
              min={0}
              max={500}
              step={10}
              helpText="Oil, tires, detailing, repairs"
            />
            <CurrencyInput
              id="cleaning"
              label="Cleaning Cost Per Rental"
              value={inputs.cleaningCostPerRental}
              onChange={(v) => updateInput('cleaningCostPerRental', v)}
              min={0}
              max={100}
              step={5}
              helpText="Interior cleaning between guests"
            />
            <CurrencyInput
              id="depreciation"
              label="Monthly Depreciation"
              value={inputs.depreciationPerMonth}
              onChange={(v) => updateInput('depreciationPerMonth', v)}
              min={0}
              max={500}
              step={10}
              helpText="Estimated monthly value loss"
            />
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Profit</h3>
          <CopyResultsButton getResultsText={getResultsText} category="gig" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Monthly Net Profit"
            value={formatCurrency(results.monthlyNet)}
            numericValue={results.monthlyNet}
            formatFn={formatCurrency}
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
            value={`${results.breakEvenDays} days`}
            description="Min days rented needed"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Monthly Breakdown"
            category="gig"
            items={[
              { label: 'Rental Revenue', value: formatCurrency(results.monthlyGross) },
              { label: <Tooltip text="Platform fee varies by protection plan level (10-35%)">Turo Fee</Tooltip>, value: `-${formatCurrency(results.turoFee)}` },
              { label: 'Cleaning Costs', value: `-${formatCurrency(results.monthlyCleaningCost)}` },
              { label: 'Operating Costs', value: `-${formatCurrency(results.operatingCosts)}` },
              { label: 'Net Profit', value: formatCurrency(results.monthlyNet), highlight: true },
            ]}
          />
          <div className="space-y-4">
            <ResultCard
              label="Profit Margin"
              value={`${results.profitMargin}%`}
              description="Net / gross revenue"
              size="sm"
            />
            <ResultCard
              label="Rentals/Month"
              value={results.rentalsPerMonth.toString()}
              description="Based on 3-day avg rental"
              size="sm"
            />
            <ResultCard
              label="Total Expenses"
              value={formatCurrency(results.totalExpenses)}
              description="All costs combined"
              size="sm"
            />
            <div className="bg-gig-50 rounded-xl p-4 text-sm text-gig-800">
              <strong>Pro tip:</strong> Lower protection plans have smaller fees (10-15%) but less
              coverage. Higher plans (25-35%) give more peace of mind. Factor in your car's
              value and risk tolerance when choosing.
            </div>
          </div>
        </div>

        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Using {DEFAULT_INPUTS.turoHostFeePercent}% Turo fee, ${DEFAULT_INPUTS.carPayment}/mo payment, ${DEFAULT_INPUTS.insurance}/mo insurance, ${DEFAULT_INPUTS.maintenancePerMonth}/mo maintenance.{' '}
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
    </ErrorBoundary>
  );
}
