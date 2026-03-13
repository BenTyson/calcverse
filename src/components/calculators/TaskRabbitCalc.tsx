import { ErrorBoundary } from '../ui/ErrorBoundary';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateTaskRabbitEarnings,
  DEFAULT_INPUTS,
  TASK_CATEGORIES,
  type TaskRabbitInputs,
} from '../../lib/calculators/taskrabbit-earnings';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function TaskRabbitCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } =
    useCalculatorState<TaskRabbitInputs>(DEFAULT_INPUTS);

  const results = calculateTaskRabbitEarnings(inputs);

  const getResultsText = () =>
    `TaskRabbit Earnings Calculator (CalcFalcon)\n` +
    `Weekly Net: ${formatCurrency(results.weeklyNet)}\n` +
    `Effective Hourly: ${formatCurrency(results.effectiveHourlyRate)}\n` +
    `Monthly Net: ${formatCurrency(results.monthlyNet)}\n` +
    `https://calcfalcon.com/gig-economy/taskrabbit-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using 15% service fee, $5 travel, $50/mo supplies
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Task Details</h3>
          <NumberInput
            id="tasksPerWeek"
            label="Tasks Per Week"
            value={inputs.tasksPerWeek}
            onChange={(v) => updateInput('tasksPerWeek', v)}
            min={1}
            max={40}
            step={1}
            suffix="tasks"
            helpText="Number of tasks you complete weekly"
          />
          <CurrencyInput
            id="hourlyRate"
            label="Average Hourly Rate"
            value={inputs.averageHourlyRate}
            onChange={(v) => updateInput('averageHourlyRate', v)}
            min={15}
            max={150}
            step={5}
            helpText="Your rate charged to clients"
          />
          <NumberInput
            id="hoursPerTask"
            label="Average Hours Per Task"
            value={inputs.averageHoursPerTask}
            onChange={(v) => updateInput('averageHoursPerTask', v)}
            min={0.5}
            max={8}
            step={0.5}
            suffix="hours"
            helpText="Typical duration of each task"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Fees & Expenses</h3>
          {isAdvanced && (
            <SliderInput
              id="serviceFee"
              label="TaskRabbit Service Fee"
              value={inputs.serviceFeePercent}
              onChange={(v) => updateInput('serviceFeePercent', v)}
              min={5}
              max={30}
              step={1}
              formatValue={(v) => `${v}%`}
              helpText="Platform fee deducted from earnings"
            />
          )}
          {isAdvanced && (
            <NumberInput
              id="travelTime"
              label="Travel Time Per Task"
              value={inputs.travelTimePerTask}
              onChange={(v) => updateInput('travelTimePerTask', v)}
              min={0}
              max={2}
              step={0.25}
              suffix="hours"
              helpText="Time spent traveling to each task"
            />
          )}
          {isAdvanced && (
            <CurrencyInput
              id="travelCost"
              label="Travel Cost Per Task"
              value={inputs.travelCostPerTask}
              onChange={(v) => updateInput('travelCostPerTask', v)}
              min={0}
              max={30}
              step={1}
              helpText="Gas, transit, or parking per task"
            />
          )}
          {isAdvanced && (
            <CurrencyInput
              id="supplies"
              label="Supplies Cost Per Month"
              value={inputs.suppliesCostPerMonth}
              onChange={(v) => updateInput('suppliesCostPerMonth', v)}
              min={0}
              max={500}
              step={10}
              helpText="Tools, cleaning supplies, materials"
            />
          )}
          {isAdvanced && (
            <DropdownInput
              id="taskCategory"
              label="Task Category"
              value={inputs.taskCategory}
              onChange={(v) => updateInput('taskCategory', v)}
              options={TASK_CATEGORIES}
              helpText="Type of tasks you typically perform"
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
            description="After fees & expenses"
            highlight
            size="lg"
            category="gig"
          />
          <ResultCard
            label="Effective Hourly"
            value={formatCurrency(results.effectiveHourlyRate)}
            description="Including travel time"
          />
          <ResultCard
            label="Per Task Net"
            value={formatCurrency(results.perTaskNet)}
            description="After all deductions"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="Weekly Breakdown"
            category="gig"
            items={[
              { label: 'Task Earnings', value: formatCurrency(results.weeklyGross) },
              { label: <Tooltip text="Platform fee deducted from all task earnings (typically 15%)">Service Fee</Tooltip>, value: `-${formatCurrency(results.serviceFee)}` },
              { label: 'Travel Costs', value: `-${formatCurrency(results.weeklyTravel)}` },
              { label: 'Supplies', value: `-${formatCurrency(results.weeklySupplies)}` },
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
              label="Total Weekly Hours"
              value={results.totalWeeklyHours.toString()}
              description="Including travel time"
              size="sm"
            />
            <div className="bg-gig-50 rounded-xl p-4 text-sm text-gig-800">
              <strong>Rate tip:</strong> Set your rate 20-30% higher than your minimum acceptable hourly
              rate to account for the service fee, travel time, and gaps between tasks.
            </div>
          </div>
        </div>

        {mode === 'quick' && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Using {DEFAULT_INPUTS.serviceFeePercent}% service fee, ${DEFAULT_INPUTS.travelCostPerTask} travel/task, ${DEFAULT_INPUTS.suppliesCostPerMonth}/mo supplies, {DEFAULT_INPUTS.travelTimePerTask}hr travel time.{' '}
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
