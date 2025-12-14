import { useState, useEffect } from 'react';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateInstacartEarnings,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type InstacartEarningsInputs,
} from '../../lib/calculators/instacart-earnings';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function InstacartCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<InstacartEarningsInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  useEffect(() => {
    if (mode === 'quick') {
      setInputs((prev) => ({ ...prev, ...QUICK_MODE_DEFAULTS }));
    }
  }, [mode]);

  // In quick mode, split batch pay into base + tip
  const effectiveInputs = mode === 'quick'
    ? {
        ...inputs,
        averageBasePay: inputs.averageBatchPay * 0.5,
        averageTip: inputs.averageBatchPay * 0.5,
      }
    : inputs;

  const results = calculateInstacartEarnings(effectiveInputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof InstacartEarningsInputs>(
    key: K,
    value: InstacartEarningsInputs[K]
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
            Using $3.50/gal, 28 MPG, 5 mi/batch
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Batches */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Batches</h3>

          <NumberInput
            id="batchesPerWeek"
            label="Batches Per Week"
            value={inputs.batchesPerWeek}
            onChange={(v) => updateInput('batchesPerWeek', v)}
            min={1}
            max={100}
            step={1}
            helpText="Orders completed weekly"
          />

          {mode === 'quick' ? (
            <CurrencyInput
              id="averageBatchPay"
              label="Average Batch Pay (incl. tip)"
              value={inputs.averageBatchPay}
              onChange={(v) => updateInput('averageBatchPay', v)}
              min={5}
              max={50}
              step={1}
              helpText="Base pay + tip per batch"
            />
          ) : (
            <>
              <CurrencyInput
                id="averageBasePay"
                label="Average Base Pay"
                value={inputs.averageBasePay}
                onChange={(v) => updateInput('averageBasePay', v)}
                min={5}
                max={30}
                step={0.5}
                helpText="Instacart batch payment"
              />
              <CurrencyInput
                id="averageTip"
                label="Average Tip"
                value={inputs.averageTip}
                onChange={(v) => updateInput('averageTip', v)}
                min={0}
                max={30}
                step={0.5}
                helpText="Customer tips"
              />
            </>
          )}

          {isAdvanced && (
            <NumberInput
              id="averageItems"
              label="Average Items Per Batch"
              value={inputs.averageItems}
              onChange={(v) => updateInput('averageItems', v)}
              min={5}
              max={100}
              step={5}
              helpText="Affects shopping time"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="peakHoursBonus"
              label="Weekly Peak Hour Bonuses"
              value={inputs.peakHoursBonus}
              onChange={(v) => updateInput('peakHoursBonus', v)}
              min={0}
              max={100}
              step={5}
              helpText="Extra from busy periods"
            />
          )}
        </div>

        {/* Expenses & Time */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Expenses & Time' : 'Time Estimate'}
          </h3>

          {isAdvanced && (
            <NumberInput
              id="hoursPerWeek"
              label="Hours Worked Per Week"
              value={inputs.hoursPerWeek}
              onChange={(v) => updateInput('hoursPerWeek', v)}
              min={1}
              max={80}
              step={1}
              suffix=" hrs"
              helpText="Active shopping hours"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="milesPerBatch"
              label="Average Miles Per Batch"
              value={inputs.milesPerBatch}
              onChange={(v) => updateInput('milesPerBatch', v)}
              min={1}
              max={20}
              step={0.5}
              suffix=" mi"
              helpText="Store to delivery"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="gasPrice"
              label="Gas Price"
              value={inputs.gasPrice}
              onChange={(v) => updateInput('gasPrice', v)}
              min={2}
              max={7}
              step={0.1}
              helpText="Per gallon"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="vehicleMPG"
              label="Vehicle MPG"
              value={inputs.vehicleMPG}
              onChange={(v) => updateInput('vehicleMPG', v)}
              min={15}
              max={50}
              step={1}
              suffix=" mpg"
              helpText="Your car's fuel efficiency"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <h3 className="font-semibold text-neutral-900 mb-4">Estimated Earnings</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ResultCard
            label="Weekly Earnings"
            value={formatCurrency(results.netWeeklyEarnings)}
            description="After gas expenses"
            category="gig"
            highlighted
          />
          <ResultCard
            label="Monthly Earnings"
            value={formatCurrency(results.netMonthlyEarnings)}
            description="4.33 weeks"
            category="gig"
          />
          <ResultCard
            label="Hourly Rate"
            value={formatCurrency(results.effectiveHourlyRate)}
            description="Net per hour worked"
            category="gig"
          />
          <ResultCard
            label="Per Batch"
            value={formatCurrency(results.earningsPerBatch)}
            description="Net per order"
            category="gig"
          />
        </div>

        <ResultBreakdown
          title="Weekly Breakdown"
          items={[
            { label: `Base Pay (${inputs.batchesPerWeek} batches)`, value: formatCurrency(results.basePay) },
            { label: 'Tips', value: formatCurrency(results.tips) },
            ...(results.peakBonuses > 0 ? [{ label: 'Peak Hour Bonuses', value: formatCurrency(results.peakBonuses) }] : []),
            { label: 'Gross Weekly', value: formatCurrency(results.grossWeeklyEarnings), highlighted: true },
            { label: 'Gas Expenses', value: `-${formatCurrency(results.gasExpenses)}` },
            { label: 'Net Weekly', value: formatCurrency(results.netWeeklyEarnings), highlighted: true },
          ]}
          category="gig"
        />

        {/* Annual Projection */}
        <div className="mt-6 p-4 bg-gig-50 rounded-xl border border-gig-100">
          <h4 className="font-semibold text-gig-900 mb-2">Annual Projection</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gig-600 text-sm">Gross Annual</p>
              <p className="text-gig-900 font-bold text-xl">{formatCurrency(results.grossWeeklyEarnings * 52)}</p>
            </div>
            <div>
              <p className="text-gig-600 text-sm">Net Annual (after gas)</p>
              <p className="text-gig-900 font-bold text-xl">{formatCurrency(results.netAnnualEarnings)}</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <h4 className="font-semibold text-amber-900 mb-2">Maximize Your Earnings</h4>
          <ul className="text-amber-800 text-sm space-y-1">
            <li>• Work during peak hours (mornings, evenings, weekends) for better batch offers</li>
            <li>• Focus on high-tip customers - check tip % before accepting</li>
            <li>• Learn store layouts to shop faster</li>
            <li>• Track mileage for tax deductions (currently $0.67/mile)</li>
            <li>• Avoid low-paying multi-batch orders unless tips are good</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
