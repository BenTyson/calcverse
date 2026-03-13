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
  calculateFreelanceVacation,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type FreelanceVacationInputs,
} from '../../lib/calculators/freelance-vacation';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function FreelanceVacationCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } = useCalculatorState(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  const results = calculateFreelanceVacation(inputs);

  const getResultsText = () =>
    `Freelance Vacation Fund Calculator (CalcFalcon)\n` +
    `Monthly Savings Needed: ${formatCurrency(results.monthlySavingsNeeded)}\n` +
    `Total Annual Cost: ${formatCurrency(results.totalWithBuffer)}\n` +
    `Cost Per Vacation Day: ${formatCurrency(results.costPerVacationDay)}\n` +
    `https://calcfalcon.com/freelance/freelance-vacation-calculator`;

  const costBreakdownData = results.breakdown.filter((d) => d.amount > 0);

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using 5-day work week, 3 catch-up days, $400 insurance, 10% buffer
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Income & Time Off</h3>

          <CurrencyInput
            id="monthlyIncome"
            label="Monthly Freelance Income"
            value={inputs.monthlyIncome}
            onChange={(v) => updateInput('monthlyIncome', v)}
            min={0}
            max={50000}
            step={500}
            helpText="Average monthly income from freelance work"
          />

          <NumberInput
            id="vacationDays"
            label="Vacation Days Per Year"
            value={inputs.vacationDays}
            onChange={(v) => updateInput('vacationDays', v)}
            min={1}
            max={60}
            step={1}
            suffix="days"
            helpText="Total days off you want per year"
          />

          <CurrencyInput
            id="dailyTravelBudget"
            label="Daily Travel Budget"
            value={inputs.dailyTravelBudget}
            onChange={(v) => updateInput('dailyTravelBudget', v)}
            min={0}
            max={1000}
            step={25}
            helpText="Average daily spending while on vacation"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Cost Details' : 'Details'}
          </h3>

          {isAdvanced && (
            <NumberInput
              id="workDaysPerWeek"
              label="Work Days Per Week"
              value={inputs.workDaysPerWeek}
              onChange={(v) => updateInput('workDaysPerWeek', v)}
              min={3}
              max={7}
              step={1}
              suffix="days"
              helpText="Your normal working days per week"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="catchUpDays"
              label="Catch-Up Days Per Trip"
              value={inputs.catchUpDays}
              onChange={(v) => updateInput('catchUpDays', v)}
              min={0}
              max={10}
              step={1}
              suffix="days"
              helpText="Days to clear backlog after each trip"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="healthInsuranceCost"
              label="Monthly Health Insurance"
              value={inputs.healthInsuranceCost}
              onChange={(v) => updateInput('healthInsuranceCost', v)}
              min={0}
              max={2000}
              step={50}
              helpText="Still owed during time off"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="otherFixedCosts"
              label="Other Monthly Fixed Costs"
              value={inputs.otherFixedCosts}
              onChange={(v) => updateInput('otherFixedCosts', v)}
              min={0}
              max={1000}
              step={25}
              helpText="Tools, subscriptions, coworking — still owed during time off"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="savingsBuffer"
              label="Safety Buffer"
              value={inputs.savingsBuffer}
              onChange={(v) => updateInput('savingsBuffer', v)}
              min={0}
              max={30}
              step={5}
              suffix="%"
              helpText="Extra cushion above calculated amount"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="vacationsPerYear"
              label="Separate Trips Per Year"
              value={inputs.vacationsPerYear}
              onChange={(v) => updateInput('vacationsPerYear', v)}
              min={1}
              max={6}
              step={1}
              suffix="trips"
              helpText="Number of separate vacation trips"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Vacation Fund Plan</h3>
          <CopyResultsButton getResultsText={getResultsText} category="freelance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Monthly Savings Needed"
            value={formatCurrency(results.monthlySavingsNeeded)}
            numericValue={results.monthlySavingsNeeded}
            formatFn={formatCurrency}
            description="Set aside each month"
            category="freelance"
            highlight
          />
          <ResultCard
            label="Total Annual Cost"
            value={formatCurrency(results.totalWithBuffer)}
            description={`${inputs.vacationDays} days off with ${inputs.savingsBuffer}% buffer`}
            category="freelance"
          />
          <ResultCard
            label="Cost Per Day Off"
            value={formatCurrency(results.costPerVacationDay)}
            description="True cost of each vacation day"
            category="freelance"
          />
        </div>

        <ChartCard title="Vacation Cost Breakdown" category="freelance">
          <DonutChart
            data={costBreakdownData.map((d) => ({ label: d.label, value: d.amount }))}
            category="freelance"
            formatValue={formatCurrency}
            innerLabel="Total"
            innerValue={formatCurrency(results.totalWithBuffer)}
          />
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <ResultBreakdown
            title="Cost Breakdown"
            items={[
              { label: 'Lost Income', value: formatCurrency(results.lostIncomePerYear) },
              { label: 'Travel Costs', value: formatCurrency(results.travelCostsPerYear) },
              { label: 'Fixed Costs During Vacation', value: formatCurrency(results.fixedCostsDuringVacation) },
              { label: <Tooltip text="The time needed to clear your backlog and respond to client requests after returning from vacation">Catch-Up Time Cost</Tooltip>, value: formatCurrency(results.catchUpCost) },
              { label: 'Safety Buffer', value: formatCurrency(results.totalWithBuffer - results.totalVacationCost) },
              { label: 'Total', value: formatCurrency(results.totalWithBuffer), highlight: true },
            ]}
            category="freelance"
          />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ResultCard
                label="Per-Trip Cost"
                value={formatCurrency(results.perVacationCost)}
                description={`${inputs.vacationsPerYear} trip${inputs.vacationsPerYear !== 1 ? 's' : ''}/year`}
                category="freelance"
                size="sm"
              />
              <ResultCard
                label="Your Daily Rate"
                value={formatCurrency(results.dailyRate)}
                description="Income per work day"
                category="freelance"
                size="sm"
              />
            </div>

            <div className="bg-freelance-50 rounded-xl p-4 text-sm text-freelance-800">
              <p className="font-medium mb-1">Planning tip</p>
              <p>
                Set up automatic transfers of {formatCurrency(results.monthlySavingsNeeded)} into
                a dedicated vacation fund each month. Many freelancers underestimate
                vacation costs by forgetting about lost income, ongoing fixed costs,
                and the ramp-up time needed after returning.
              </p>
            </div>
          </div>
        </div>

        {mode === 'quick' && (
          <div className="mt-6 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-600">
            <p>
              Quick mode assumes 5-day work week, 3 catch-up days per trip, $400/mo insurance, $200/mo fixed costs, 10% buffer, 2 trips/year.{' '}
              <button
                onClick={() => setMode('advanced')}
                className="text-freelance-600 font-medium hover:underline"
              >
                Customize these →
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
}
