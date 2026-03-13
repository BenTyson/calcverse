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
  calculateNewsletterRevenue,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type NewsletterRevenueInputs,
} from '../../lib/calculators/newsletter-revenue';
import { formatCurrency, formatNumber } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

const platformOptions = [
  { value: 'substack', label: 'Substack (10% + Stripe)' },
  { value: 'beehiiv', label: 'Beehiiv (0% + Stripe)' },
  { value: 'convertkit', label: 'ConvertKit (3.5% + Stripe)' },
];

export function NewsletterCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } = useCalculatorState<NewsletterRevenueInputs>(
    DEFAULT_INPUTS,
    QUICK_MODE_DEFAULTS
  );

  const results = calculateNewsletterRevenue(inputs);

  const getResultsText = () =>
    `Newsletter Revenue Calculator (CalcFalcon)\n` +
    `Monthly Net Revenue: ${formatCurrency(results.monthlyNetRevenue)}\n` +
    `Annual Recurring Revenue: ${formatCurrency(results.annualRecurringRevenue)}\n` +
    `Revenue per Subscriber: $${results.revenuePerSubscriber.toFixed(2)}\n` +
    `https://calcfalcon.com/creator/newsletter-revenue-calculator`;

  const showChart = results.breakdown.length > 1;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Subscription revenue only. Switch to Advanced for sponsorships, growth projections, and churn.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Newsletter Basics</h3>

          <NumberInput
            id="totalSubscribers"
            label="Total Subscribers"
            value={inputs.totalSubscribers}
            onChange={(v) => updateInput('totalSubscribers', v)}
            min={100}
            max={500000}
            step={100}
            helpText="Your total email list size (free + paid)"
          />

          <DropdownInput
            id="platform"
            label="Platform"
            value={inputs.platform}
            onChange={(v) => updateInput('platform', v)}
            options={platformOptions}
            helpText="Newsletter platform for paid subscriptions"
          />

          <SliderInput
            id="paidPercent"
            label={<Tooltip text="Percentage of your total subscribers who pay for premium content — 5-10% is typical for established newsletters">Paid Subscriber Rate</Tooltip>}
            value={inputs.paidPercent}
            onChange={(v) => updateInput('paidPercent', v)}
            min={0}
            max={30}
            step={0.5}
            formatValue={(v) => `${v}%`}
            helpText={`${results.paidSubscribers.toLocaleString()} paid subscribers`}
          />

          <CurrencyInput
            id="monthlyPrice"
            label="Monthly Price"
            value={inputs.monthlyPrice}
            onChange={(v) => updateInput('monthlyPrice', v)}
            min={3}
            max={100}
            step={1}
            helpText="Monthly subscription price"
          />
        </div>

        <div className="space-y-4">
          {isAdvanced && (
            <>
              <h3 className="font-semibold text-neutral-900">Growth & Retention</h3>

              <SliderInput
                id="monthlyGrowthRate"
                label="Monthly Growth Rate"
                value={inputs.monthlyGrowthRate}
                onChange={(v) => updateInput('monthlyGrowthRate', v)}
                min={0}
                max={30}
                step={0.5}
                formatValue={(v) => `${v}%`}
                helpText="New subscriber growth per month"
              />

              <SliderInput
                id="churnRate"
                label={<Tooltip text="Monthly percentage of paid subscribers who cancel — 3-5% monthly churn is typical for newsletter subscriptions">Churn Rate</Tooltip>}
                value={inputs.churnRate}
                onChange={(v) => updateInput('churnRate', v)}
                min={0}
                max={15}
                step={0.5}
                formatValue={(v) => `${v}%`}
                helpText="Monthly paid subscriber cancellation rate"
              />

              <SliderInput
                id="annualPlanPercent"
                label={<Tooltip text="Annual subscribers pay for 10 months upfront (2 months free) — locks in revenue but reduces effective monthly rate">Annual Plan Subscribers</Tooltip>}
                value={inputs.annualPlanPercent}
                onChange={(v) => updateInput('annualPlanPercent', v)}
                min={0}
                max={100}
                step={5}
                formatValue={(v) => `${v}%`}
                helpText="Annual plans = 10 months for price of 12"
              />

              <h3 className="font-semibold text-neutral-900 mt-6">Sponsorships</h3>

              <CurrencyInput
                id="sponsorshipCPM"
                label="Sponsorship CPM"
                value={inputs.sponsorshipCPM}
                onChange={(v) => updateInput('sponsorshipCPM', v)}
                min={0}
                max={100}
                step={5}
                helpText="Rate per 1,000 opens ($20-50 typical)"
              />

              <SliderInput
                id="openRate"
                label="Open Rate"
                value={inputs.openRate}
                onChange={(v) => updateInput('openRate', v)}
                min={10}
                max={80}
                step={1}
                formatValue={(v) => `${v}%`}
                helpText="Percentage of subscribers who open each issue"
              />

              <NumberInput
                id="issuesPerMonth"
                label="Issues per Month"
                value={inputs.issuesPerMonth}
                onChange={(v) => updateInput('issuesPerMonth', v)}
                min={1}
                max={30}
                step={1}
                helpText="How many newsletters you send per month"
              />

              <SliderInput
                id="sponsoredIssuesPercent"
                label="Sponsored Issues"
                value={inputs.sponsoredIssuesPercent}
                onChange={(v) => updateInput('sponsoredIssuesPercent', v)}
                min={0}
                max={100}
                step={10}
                formatValue={(v) => `${v}%`}
                helpText="Percentage of issues with a paid sponsor"
              />
            </>
          )}

          {!isAdvanced && (
            <div className="p-4 bg-creator-50 rounded-xl border border-creator-100">
              <h4 className="font-semibold text-creator-900 mb-2">Platform Fee Comparison</h4>
              <p className="text-creator-700 text-sm">
                Substack takes 10% + Stripe (2.9%). Beehiiv charges 0% on their Scale plan + Stripe. ConvertKit takes 3.5% + Stripe. All platforms handle billing, so the real comparison is features vs. fees.
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
            description="After platform and processing fees"
            category="creator"
            highlight
          />
          <ResultCard
            label="Annual Recurring Revenue"
            value={formatCurrency(results.annualRecurringRevenue)}
            numericValue={results.annualRecurringRevenue}
            formatFn={formatCurrency}
            description="Projected yearly"
            category="creator"
          />
          <ResultCard
            label="Revenue per Subscriber"
            value={`$${results.revenuePerSubscriber.toFixed(2)}`}
            description="Net per total subscriber"
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
            { label: `Paid Subscribers (${formatNumber(results.paidSubscribers)})`, value: formatCurrency(results.subscriptionGross) },
            ...(results.sponsorshipRevenue > 0
              ? [{ label: 'Sponsorship Revenue', value: formatCurrency(results.sponsorshipRevenue) }]
              : []),
            { label: 'Total Gross', value: formatCurrency(results.totalGross), highlight: true },
            ...(results.platformFee > 0
              ? [{ label: <Tooltip text="Fee charged by the newsletter platform for handling paid subscriptions and billing">Platform Fee</Tooltip>, value: `-${formatCurrency(results.platformFee)}` }]
              : []),
            ...(results.paymentProcessing > 0
              ? [{ label: 'Payment Processing (Stripe)', value: `-${formatCurrency(results.paymentProcessing)}` }]
              : []),
            { label: 'Net Monthly', value: formatCurrency(results.netMonthly), highlight: true },
          ]}
          category="creator"
        />

        {/* Growth projections (advanced only) */}
        {isAdvanced && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-2">Growth Projections</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <p className="font-medium">6-Month Projection</p>
                <p>{formatNumber(results.projectedPaidSubs6mo)} paid subscribers</p>
              </div>
              <div>
                <p className="font-medium">12-Month Projection</p>
                <p>{formatNumber(results.projectedPaidSubs12mo)} paid subscribers</p>
              </div>
            </div>
            <p className="text-blue-700 text-xs mt-2">
              Based on {inputs.monthlyGrowthRate}% monthly growth minus {inputs.churnRate}% churn
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-creator-50 rounded-xl border border-creator-100">
          <h4 className="font-semibold text-creator-900 mb-2">Newsletter Revenue Tips</h4>
          <ul className="text-creator-700 text-sm space-y-1">
            <li>- Sponsorships often exceed subscription revenue at scale</li>
            <li>- Annual plans reduce churn and improve cash flow</li>
            <li>- Open rate directly impacts sponsorship value — prioritize engagement</li>
            <li>- Diversify with both subscriptions and sponsorships for stability</li>
          </ul>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
