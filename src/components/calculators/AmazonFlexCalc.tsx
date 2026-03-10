import { useState, useEffect } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateAmazonFlex,
  DEFAULT_INPUTS,
  type AmazonFlexInputs,
} from '../../lib/calculators/amazon-flex';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function AmazonFlexCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<AmazonFlexInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateAmazonFlex(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof AmazonFlexInputs>(
    key: K,
    value: AmazonFlexInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';

  const getResultsText = () =>
    `Amazon Flex Calculator (CalcFalcon)\n` +
    `Weekly Net: ${formatCurrency(results.weeklyNet)}\n` +
    `Effective Hourly: ${formatCurrency(results.effectiveHourlyRate)}\n` +
    `Monthly Net: ${formatCurrency(results.monthlyNet)}\n` +
    `https://calcfalcon.com/gig-economy/amazon-flex-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using $5 tips, 4 hrs/block, $3.50/gal, 25 MPG
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Block Details</h3>
          <NumberInput
            id="blocks"
            label="Blocks Per Week"
            value={inputs.blocksPerWeek}
            onChange={(v) => updateInput('blocksPerWeek', v)}
            min={1}
            max={30}
            step={1}
            suffix="blocks"
            helpText="Number of delivery blocks you work weekly"
          />
          <CurrencyInput
            id="payPerBlock"
            label="Average Pay Per Block"
            value={inputs.averagePayPerBlock}
            onChange={(v) => updateInput('averagePayPerBlock', v)}
            min={18}
            max={200}
            step={1}
            helpText="Base pay per block (typically $54-108)"
          />
          <NumberInput
            id="milesPerBlock"
            label="Miles Per Block"
            value={inputs.milesPerBlock}
            onChange={(v) => updateInput('milesPerBlock', v)}
            min={5}
            max={100}
            step={5}
            suffix="miles"
            helpText="Average miles driven per block"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Vehicle & Expenses</h3>
          {isAdvanced && (
            <CurrencyInput
              id="tips"
              label="Average Tips Per Block"
              value={inputs.averageTipsPerBlock}
              onChange={(v) => updateInput('averageTipsPerBlock', v)}
              min={0}
              max={50}
              step={1}
              helpText="Tips from Fresh/Whole Foods deliveries"
            />
          )}
          {isAdvanced && (
            <NumberInput
              id="hoursPerBlock"
              label="Hours Per Block"
              value={inputs.hoursPerBlock}
              onChange={(v) => updateInput('hoursPerBlock', v)}
              min={1}
              max={8}
              step={0.5}
              suffix="hours"
              helpText="Duration of each delivery block"
            />
          )}
          {isAdvanced && (
            <CurrencyInput
              id="gasPrice"
              label="Gas Price Per Gallon"
              value={inputs.gasPrice}
              onChange={(v) => updateInput('gasPrice', v)}
              min={2}
              max={8}
              step={0.1}
              helpText="Current price at the pump"
            />
          )}
          {isAdvanced && (
            <NumberInput
              id="mpg"
              label="Vehicle MPG"
              value={inputs.vehicleMpg}
              onChange={(v) => updateInput('vehicleMpg', v)}
              min={10}
              max={60}
              suffix="mpg"
              helpText="Your car's fuel efficiency"
            />
          )}
          {isAdvanced && (
            <CurrencyInput
              id="maintenance"
              label="Maintenance Cost Per Mile"
              value={inputs.maintenanceCostPerMile}
              onChange={(v) => updateInput('maintenanceCostPerMile', v)}
              min={0}
              max={0.25}
              step={0.01}
              helpText="Oil, tires, brakes, etc."
            />
          )}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Earnings</h3>
          <CopyResultsButton getResultsText={getResultsText} category="gig" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Weekly Net"
            value={formatCurrency(results.weeklyNet)}
            numericValue={results.weeklyNet}
            formatFn={formatCurrency}
            description="After gas & maintenance"
            highlight
            size="lg"
            category="gig"
          />
          <ResultCard
            label="Effective Hourly"
            value={formatCurrency(results.effectiveHourlyRate)}
            description="Net earnings/hour"
          />
          <ResultCard
            label="Per Block Net"
            value={formatCurrency(results.perBlockNet)}
            description="After expenses"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Weekly Breakdown"
            category="gig"
            items={[
              { label: 'Block Pay', value: formatCurrency(inputs.blocksPerWeek * inputs.averagePayPerBlock) },
              { label: 'Tips', value: formatCurrency(inputs.blocksPerWeek * inputs.averageTipsPerBlock) },
              { label: 'Gross Earnings', value: formatCurrency(results.weeklyGross) },
              { label: 'Gas Cost', value: `-${formatCurrency(results.weeklyGasCost)}` },
              { label: 'Maintenance', value: `-${formatCurrency(results.weeklyMaintenance)}` },
              { label: 'Net Earnings', value: formatCurrency(results.weeklyNet), highlight: true },
            ]}
          />
          <div className="space-y-4">
            <ResultCard
              label="Monthly Net"
              value={formatCurrency(results.monthlyNet)}
              description="4.33 weeks average"
              size="sm"
            />
            <ResultCard
              label="Annual Net"
              value={formatCurrency(results.annualNet)}
              description="52 weeks"
              size="sm"
            />
            <ResultCard
              label="Weekly Miles"
              value={results.weeklyMiles.toLocaleString()}
              description={`${inputs.blocksPerWeek} blocks x ${inputs.milesPerBlock} miles`}
              size="sm"
            />
            <div className="bg-gig-50 rounded-xl p-4 text-sm text-gig-800">
              <strong>Tax tip:</strong> Track your miles! The <Tooltip text="You can deduct $0.67 per business mile driven instead of tracking actual vehicle expenses">IRS mileage deduction</Tooltip> allows $0.67/mile
              for 2024. At {results.weeklyMiles} miles/week, that's{' '}
              {formatCurrency(results.weeklyMiles * 0.67 * 52)}/year in deductions.
            </div>
          </div>
        </div>

        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Using ${DEFAULT_INPUTS.averageTipsPerBlock} tips/block, {DEFAULT_INPUTS.hoursPerBlock} hrs/block, ${DEFAULT_INPUTS.gasPrice}/gal, {DEFAULT_INPUTS.vehicleMpg} MPG, ${DEFAULT_INPUTS.maintenanceCostPerMile}/mi maintenance.{' '}
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
