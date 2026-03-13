import { ErrorBoundary } from '../ui/ErrorBoundary';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { DonutChart } from '../ui/charts/DonutChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateOnlineCourseRevenue,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type OnlineCourseInputs,
} from '../../lib/calculators/online-course-revenue';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

const platformOptions = [
  { value: 'teachable', label: 'Teachable (5% + Stripe)' },
  { value: 'udemy', label: 'Udemy (blended rate)' },
  { value: 'skillshare', label: 'Skillshare (~$2/referral)' },
  { value: 'self-hosted', label: 'Self-Hosted (Stripe only)' },
];

export function OnlineCourseCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } = useCalculatorState<OnlineCourseInputs>(
    DEFAULT_INPUTS,
    QUICK_MODE_DEFAULTS
  );

  const results = calculateOnlineCourseRevenue(inputs);

  const getResultsText = () =>
    `Online Course Revenue Calculator (CalcFalcon)\n` +
    `Monthly Net Revenue: ${formatCurrency(results.monthlyNetRevenue)}\n` +
    `Annual Revenue: ${formatCurrency(results.annualRevenue)}\n` +
    `Revenue per Student: ${formatCurrency(results.revenuePerStudent)}\n` +
    `https://calcfalcon.com/creator/online-course-revenue-calculator`;

  const showChart = results.breakdown.length > 1;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Course sales only. Switch to Advanced for subscriptions, launches, and ad spend.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Course Sales</h3>

          <CurrencyInput
            id="coursePrice"
            label="Course Price"
            value={inputs.coursePrice}
            onChange={(v) => updateInput('coursePrice', v)}
            min={9}
            max={2000}
            step={1}
            helpText="One-time price for your course"
          />

          <NumberInput
            id="monthlySales"
            label="Monthly Sales"
            value={inputs.monthlySales}
            onChange={(v) => updateInput('monthlySales', v)}
            min={0}
            max={1000}
            step={1}
            helpText="New students enrolling per month"
          />

          <DropdownInput
            id="platform"
            label="Platform"
            value={inputs.platform}
            onChange={(v) => updateInput('platform', v)}
            options={platformOptions}
            helpText="Each platform has different fee structures"
          />

          {inputs.platform === 'udemy' && (
            <SliderInput
              id="udemyOrganicPercent"
              label={<Tooltip text="Udemy takes 63% of organic sales (found via Udemy search/browse) but only 3% of instructor-brought sales (your own marketing links)">Udemy Organic Sales</Tooltip>}
              value={inputs.udemyOrganicPercent}
              onChange={(v) => updateInput('udemyOrganicPercent', v)}
              min={0}
              max={100}
              step={5}
              formatValue={(v) => `${v}%`}
              helpText="63% fee on organic, 3% on instructor-brought"
            />
          )}
        </div>

        <div className="space-y-4">
          {isAdvanced && (
            <>
              <h3 className="font-semibold text-neutral-900">Additional Revenue</h3>

              <NumberInput
                id="subscriptionStudents"
                label="Subscription Members"
                value={inputs.subscriptionStudents}
                onChange={(v) => updateInput('subscriptionStudents', v)}
                min={0}
                max={5000}
                step={1}
                helpText="Active monthly subscription members"
              />

              <CurrencyInput
                id="subscriptionPrice"
                label="Subscription Price"
                value={inputs.subscriptionPrice}
                onChange={(v) => updateInput('subscriptionPrice', v)}
                min={5}
                max={200}
                step={1}
                helpText="Monthly membership fee"
              />

              <NumberInput
                id="launchStudents"
                label="Launch Cohort Size"
                value={inputs.launchStudents}
                onChange={(v) => updateInput('launchStudents', v)}
                min={0}
                max={2000}
                step={10}
                helpText="Students from a one-time launch (amortized over 12 months)"
              />

              <CurrencyInput
                id="launchPrice"
                label="Launch Price"
                value={inputs.launchPrice}
                onChange={(v) => updateInput('launchPrice', v)}
                min={50}
                max={5000}
                step={10}
                helpText="Price for launch cohort enrollment"
              />

              <h3 className="font-semibold text-neutral-900 mt-6">Costs & Metrics</h3>

              <SliderInput
                id="refundRate"
                label={<Tooltip text="Percentage of course purchases refunded — online courses typically see 5-10% refund rates within the guarantee period">Refund Rate</Tooltip>}
                value={inputs.refundRate}
                onChange={(v) => updateInput('refundRate', v)}
                min={0}
                max={20}
                step={1}
                formatValue={(v) => `${v}%`}
                helpText="Typical online course refund rate is 5-10%"
              />

              <SliderInput
                id="completionRate"
                label="Completion Rate"
                value={inputs.completionRate}
                onChange={(v) => updateInput('completionRate', v)}
                min={5}
                max={100}
                step={5}
                formatValue={(v) => `${v}%`}
                helpText="Industry average is ~30% — higher rates drive better reviews"
              />

              <CurrencyInput
                id="adSpend"
                label="Monthly Ad Spend"
                value={inputs.adSpend}
                onChange={(v) => updateInput('adSpend', v)}
                min={0}
                max={10000}
                step={50}
                helpText="Monthly advertising budget for course promotion"
              />
            </>
          )}

          {!isAdvanced && (
            <div className="p-4 bg-creator-50 rounded-xl border border-creator-100">
              <h4 className="font-semibold text-creator-900 mb-2">Platform Fee Comparison</h4>
              <p className="text-creator-700 text-sm">
                Self-hosted keeps the most revenue (just 2.9% Stripe). Teachable charges 5% + Stripe. Udemy takes 63% of organic sales but provides marketplace traffic. Choose based on whether you bring your own audience or need discovery.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Revenue Estimate</h3>
          <CopyResultsButton getResultsText={getResultsText} category="creator" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Monthly Net Revenue"
            value={formatCurrency(results.monthlyNetRevenue)}
            numericValue={results.monthlyNetRevenue}
            formatFn={formatCurrency}
            description="After all fees and costs"
            category="creator"
            highlight
          />
          <ResultCard
            label="Annual Revenue"
            value={formatCurrency(results.annualRevenue)}
            numericValue={results.annualRevenue}
            formatFn={formatCurrency}
            description="Projected yearly"
            category="creator"
          />
          <ResultCard
            label="Revenue per Student"
            value={formatCurrency(results.revenuePerStudent)}
            numericValue={results.revenuePerStudent}
            formatFn={formatCurrency}
            description="Net per monthly student"
            category="creator"
          />
        </div>

        {showChart && (
          <ChartCard title="Revenue Sources" category="creator" className="mb-6">
            <DonutChart
              data={results.breakdown.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
              category="creator"
              innerLabel="Gross"
              innerValue={formatCurrency(results.totalGross)}
            />
          </ChartCard>
        )}

        <ResultBreakdown
          title="Revenue Breakdown"
          items={[
            { label: 'Course Sales (Gross)', value: formatCurrency(results.courseSalesGross) },
            ...(results.subscriptionRevenue > 0
              ? [{ label: 'Subscription Revenue', value: formatCurrency(results.subscriptionRevenue) }]
              : []),
            ...(results.launchRevenue > 0
              ? [{ label: 'Launch Revenue (amortized)', value: formatCurrency(results.launchRevenue) }]
              : []),
            { label: 'Total Gross', value: formatCurrency(results.totalGross), highlight: true },
            ...(results.platformFee > 0
              ? [{ label: <Tooltip text="Fee charged by the course platform for hosting, payment processing, and marketplace access">Platform Fee</Tooltip>, value: `-${formatCurrency(results.platformFee)}` }]
              : []),
            ...(results.paymentProcessing > 0
              ? [{ label: 'Payment Processing', value: `-${formatCurrency(results.paymentProcessing)}` }]
              : []),
            ...(results.refundAmount > 0
              ? [{ label: `Refunds (${inputs.refundRate}%)`, value: `-${formatCurrency(results.refundAmount)}` }]
              : []),
            ...(inputs.adSpend > 0
              ? [{ label: 'Ad Spend', value: `-${formatCurrency(inputs.adSpend)}` }]
              : []),
            { label: 'Net Monthly', value: formatCurrency(results.netMonthly), highlight: true },
          ]}
          category="creator"
        />

        <div className="mt-6 p-4 bg-creator-50 rounded-xl border border-creator-100">
          <h4 className="font-semibold text-creator-900 mb-2">Course Revenue Tips</h4>
          <ul className="text-creator-700 text-sm space-y-1">
            <li>- Self-hosted courses keep the most revenue — build an audience first, then migrate</li>
            <li>- Combine evergreen course sales with a membership for recurring revenue</li>
            <li>- Launch cohorts create urgency and higher price tolerance</li>
            <li>- Improve completion rates with community, accountability, and shorter modules</li>
          </ul>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
