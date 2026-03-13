import { useState, useEffect } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { NumberInput } from '../ui/inputs/NumberInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { DonutChart } from '../ui/charts/DonutChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateMeetingCost,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type MeetingCostInputs,
} from '../../lib/calculators/meeting-cost';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function MeetingCostCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<MeetingCostInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  useEffect(() => {
    if (mode === 'quick') {
      setInputs((prev) => ({ ...prev, ...QUICK_MODE_DEFAULTS }));
    }
  }, [mode]);

  const results = calculateMeetingCost(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof MeetingCostInputs>(
    key: K,
    value: MeetingCostInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';

  const getResultsText = () =>
    `Meeting Cost Calculator (CalcFalcon)\n` +
    `Annual Meeting Cost: ${formatCurrency(results.annualMeetingCost)}\n` +
    `Cost Per Meeting: ${formatCurrency(results.costPerMeeting)}\n` +
    `% of Work Week: ${results.percentOfWorkWeek}%\n` +
    `https://calcfalcon.com/freelance/meeting-cost-calculator`;

  const timeBreakdownData = [
    { label: 'Meeting Time', value: inputs.meetingDuration },
    { label: 'Prep Time', value: inputs.prepTime },
    { label: 'Follow-up', value: inputs.followUpTime },
    { label: 'Recovery', value: inputs.recoveryTime },
  ].filter((d) => d.value > 0);

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using 3 attendees, 10 min prep, 15 min follow-up, 48 weeks
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Your Time</h3>

          <CurrencyInput
            id="hourlyRate"
            label="Your Hourly Rate"
            value={inputs.hourlyRate}
            onChange={(v) => updateInput('hourlyRate', v)}
            min={0}
            max={500}
            step={5}
            helpText="Your billable rate or equivalent salary rate"
          />

          <NumberInput
            id="meetingDuration"
            label="Meeting Duration"
            value={inputs.meetingDuration}
            onChange={(v) => updateInput('meetingDuration', v)}
            min={15}
            max={240}
            step={15}
            suffix="min"
            helpText="Average length of each meeting"
          />

          <NumberInput
            id="meetingsPerWeek"
            label="Meetings Per Week"
            value={inputs.meetingsPerWeek}
            onChange={(v) => updateInput('meetingsPerWeek', v)}
            min={1}
            max={30}
            step={1}
            suffix="meetings"
            helpText="Total meetings in a typical week"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Meeting Details' : 'Details'}
          </h3>

          {isAdvanced && (
            <NumberInput
              id="attendees"
              label="Attendees Per Meeting"
              value={inputs.attendees}
              onChange={(v) => updateInput('attendees', v)}
              min={1}
              max={20}
              step={1}
              suffix="people"
              helpText="Average number of people in each meeting"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="avgAttendeeRate"
              label="Average Attendee Rate"
              value={inputs.avgAttendeeRate}
              onChange={(v) => updateInput('avgAttendeeRate', v)}
              min={0}
              max={500}
              step={5}
              helpText="Average hourly rate of other attendees"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="prepTime"
              label="Prep Time"
              value={inputs.prepTime}
              onChange={(v) => updateInput('prepTime', v)}
              min={0}
              max={60}
              step={5}
              suffix="min"
              helpText="Time spent preparing before each meeting"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="followUpTime"
              label="Follow-up Time"
              value={inputs.followUpTime}
              onChange={(v) => updateInput('followUpTime', v)}
              min={0}
              max={60}
              step={5}
              suffix="min"
              helpText="Time spent on action items and notes after"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="recoveryTime"
              label="Recovery Time"
              value={inputs.recoveryTime}
              onChange={(v) => updateInput('recoveryTime', v)}
              min={0}
              max={30}
              step={5}
              suffix="min"
              helpText="Time to refocus after context switching"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="weeksPerYear"
              label="Working Weeks Per Year"
              value={inputs.weeksPerYear}
              onChange={(v) => updateInput('weeksPerYear', v)}
              min={40}
              max={52}
              step={1}
              suffix="weeks"
              helpText="Weeks worked per year (excluding vacation)"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Meeting Cost Analysis</h3>
          <CopyResultsButton getResultsText={getResultsText} category="freelance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Annual Meeting Cost"
            value={formatCurrency(results.annualMeetingCost)}
            numericValue={results.annualMeetingCost}
            formatFn={formatCurrency}
            description={`${results.annualMeetingHours} hours per year`}
            category="freelance"
            highlight
          />
          <ResultCard
            label="Cost Per Meeting"
            value={formatCurrency(results.costPerMeeting)}
            description={`${results.totalTimePerMeeting} min total time`}
            category="freelance"
          />
          <ResultCard
            label="% of Work Week"
            value={`${results.percentOfWorkWeek}%`}
            description={`${results.weeklyMeetingHours} hours/week in meetings`}
            category="freelance"
          />
        </div>

        <ChartCard title="Time Per Meeting Breakdown" category="freelance">
          <DonutChart
            data={timeBreakdownData}
            category="freelance"
            formatValue={(v) => `${v} min`}
            innerLabel="Total"
            innerValue={`${results.totalTimePerMeeting} min`}
          />
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <ResultBreakdown
            title="Cost Breakdown (Per Meeting)"
            items={results.breakdown.map((item) => ({
              label: item.label === 'Context Switching'
                ? <Tooltip text="The time needed to refocus after a meeting — studies show 15-25 minutes on average">Context Switching</Tooltip>
                : item.label,
              value: formatCurrency(item.amount),
            }))}
            category="freelance"
          />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ResultCard
                label="Annual Hours"
                value={`${results.annualMeetingHours}`}
                description="Hours in meetings/year"
                category="freelance"
                size="sm"
              />
              <ResultCard
                label="Opportunity Cost"
                value={formatCurrency(results.annualOpportunityCost)}
                description="Billable work missed"
                category="freelance"
                size="sm"
              />
            </div>

            <div className="bg-freelance-50 rounded-xl p-4 text-sm text-freelance-800">
              <p className="font-medium mb-1">Pro tip</p>
              <p>
                The average professional spends 31 hours per month in meetings.
                Consider setting &quot;no meeting&quot; days, defaulting to 25-minute meetings
                instead of 30, and requiring agendas for all meetings to cut costs.
              </p>
            </div>
          </div>
        </div>

        {mode === 'quick' && (
          <div className="mt-6 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-600">
            <p>
              Quick mode assumes 3 attendees at $75/hr, 10 min prep, 15 min follow-up, 10 min recovery, 48 working weeks.{' '}
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
