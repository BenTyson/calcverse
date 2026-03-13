import { ErrorBoundary } from '../ui/ErrorBoundary';
import { NumberInput } from '../ui/inputs/NumberInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { BarComparisonChart } from '../ui/charts/BarComparisonChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateSponsorshipRate,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type SponsorshipRateInputs,
} from '../../lib/calculators/sponsorship-rate';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

const platformOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'blog', label: 'Blog' },
];

const nicheOptions = [
  { value: 'finance', label: 'Finance (1.5x)' },
  { value: 'tech', label: 'Tech (1.3x)' },
  { value: 'beauty', label: 'Beauty (1.1x)' },
  { value: 'fitness', label: 'Fitness (1.0x)' },
  { value: 'travel', label: 'Travel (1.0x)' },
  { value: 'food', label: 'Food (0.95x)' },
  { value: 'lifestyle', label: 'Lifestyle (0.9x)' },
  { value: 'gaming', label: 'Gaming (0.8x)' },
];

const deliverableOptions = [
  { value: 'story', label: 'Story (0.5x)' },
  { value: 'post', label: 'Post (1.0x)' },
  { value: 'reel', label: 'Reel/Short (1.2x)' },
  { value: 'video', label: 'Video (1.5x)' },
  { value: 'integration', label: 'Integration (2.0x)' },
  { value: 'dedicated', label: 'Dedicated (3.0x)' },
];

const exclusivityOptions = [
  { value: 'none', label: 'None (1.0x)' },
  { value: 'category', label: 'Category Exclusive (1.25x)' },
  { value: 'full', label: 'Full Exclusive (1.75x)' },
];

const usageOptions = [
  { value: 'none', label: 'None (1.0x)' },
  { value: 'organic-repost', label: 'Organic Repost (1.15x)' },
  { value: 'paid-ads', label: 'Paid Ads (1.5x)' },
  { value: 'perpetual', label: 'Perpetual (2.0x)' },
];

export function SponsorshipRateCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } = useCalculatorState<SponsorshipRateInputs>(
    DEFAULT_INPUTS,
    QUICK_MODE_DEFAULTS
  );

  const results = calculateSponsorshipRate(inputs);

  const getResultsText = () =>
    `Sponsorship Rate Calculator (CalcFalcon)\n` +
    `Suggested Rate: ${formatCurrency(results.suggestedRate)}\n` +
    `Package Total: ${formatCurrency(results.packageTotal)}\n` +
    `Effective CPM: $${results.effectiveCPM.toFixed(2)}\n` +
    `https://calcfalcon.com/creator/sponsorship-rate-calculator`;

  const chartData = [
    { label: 'Low', value: results.lowRate },
    { label: 'Your Rate', value: results.suggestedRate },
    { label: 'High', value: results.highRate },
  ];

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Basic rate estimate. Switch to Advanced for niche, deliverable type, and usage rights.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Audience</h3>

          <DropdownInput
            id="platform"
            label="Platform"
            value={inputs.platform}
            onChange={(v) => updateInput('platform', v)}
            options={platformOptions}
            helpText="Platform where the sponsored content will be posted"
          />

          <NumberInput
            id="followers"
            label="Followers / Subscribers"
            value={inputs.followers}
            onChange={(v) => updateInput('followers', v)}
            min={100}
            max={10000000}
            step={1000}
            helpText="Total audience size on this platform"
          />

          <SliderInput
            id="engagementRate"
            label={<Tooltip text="Percentage of followers who actively engage (like, comment, share) with your content — 1-3% is typical, 5%+ is excellent">Engagement Rate</Tooltip>}
            value={inputs.engagementRate}
            onChange={(v) => updateInput('engagementRate', v)}
            min={0.5}
            max={15}
            step={0.5}
            formatValue={(v) => `${v}%`}
            helpText="Average engagement rate across recent posts"
          />
        </div>

        <div className="space-y-4">
          {isAdvanced && (
            <>
              <h3 className="font-semibold text-neutral-900">Deal Details</h3>

              <DropdownInput
                id="niche"
                label="Niche"
                value={inputs.niche}
                onChange={(v) => updateInput('niche', v)}
                options={nicheOptions}
                helpText="Finance and tech niches command premium rates"
              />

              <DropdownInput
                id="deliverableType"
                label="Deliverable Type"
                value={inputs.deliverableType}
                onChange={(v) => updateInput('deliverableType', v)}
                options={deliverableOptions}
                helpText="Type of content you'll create for the brand"
              />

              <DropdownInput
                id="exclusivity"
                label="Exclusivity"
                value={inputs.exclusivity}
                onChange={(v) => updateInput('exclusivity', v)}
                options={exclusivityOptions}
                helpText="Prevents working with competing brands — charge a premium"
              />

              <DropdownInput
                id="usageRights"
                label="Usage Rights"
                value={inputs.usageRights}
                onChange={(v) => updateInput('usageRights', v)}
                options={usageOptions}
                helpText="Paid ads usage should cost more than organic reposting"
              />

              <NumberInput
                id="numberOfDeliverables"
                label="Number of Deliverables"
                value={inputs.numberOfDeliverables}
                onChange={(v) => updateInput('numberOfDeliverables', v)}
                min={1}
                max={10}
                step={1}
                helpText="Multi-post packages get a 10%/unit bulk discount"
              />

              <NumberInput
                id="turnaroundDays"
                label="Turnaround (days)"
                value={inputs.turnaroundDays}
                onChange={(v) => updateInput('turnaroundDays', v)}
                min={1}
                max={60}
                step={1}
                helpText="Under 7 days adds a 1.5x rush premium"
              />
            </>
          )}

          {!isAdvanced && (
            <div className="p-4 bg-creator-50 rounded-xl border border-creator-100">
              <h4 className="font-semibold text-creator-900 mb-2">How Rates Are Calculated</h4>
              <p className="text-creator-700 text-sm">
                Base rate uses industry CPE (cost per engagement) benchmarks by platform, then adjusts for your audience size and engagement rate. Advanced mode adds niche premiums, deliverable type multipliers, exclusivity, and usage rights.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Rate Estimate</h3>
          <CopyResultsButton getResultsText={getResultsText} category="creator" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Suggested Rate"
            value={formatCurrency(results.suggestedRate)}
            numericValue={results.suggestedRate}
            formatFn={formatCurrency}
            description="Per deliverable"
            category="creator"
            highlight
          />
          <ResultCard
            label="Package Total"
            value={formatCurrency(results.packageTotal)}
            numericValue={results.packageTotal}
            formatFn={formatCurrency}
            description={`${inputs.numberOfDeliverables} deliverable${inputs.numberOfDeliverables > 1 ? 's' : ''}`}
            category="creator"
          />
          <ResultCard
            label="Effective CPM"
            value={`$${results.effectiveCPM.toFixed(2)}`}
            description="Cost per 1,000 followers"
            category="creator"
          />
        </div>

        <ChartCard title="Market Rate Range" category="creator" className="mb-6">
          <BarComparisonChart
            data={chartData}
            bars={[{ dataKey: 'value', label: 'Rate' }]}
            category="creator"
            formatValue={formatCurrency}
          />
        </ChartCard>

        <ResultBreakdown
          title="Rate Breakdown"
          items={[
            { label: 'Base Rate', value: formatCurrency(results.baseRate) },
            ...(results.nicheMultiplier !== 1.0
              ? [{ label: `Niche Adjustment (${results.nicheMultiplier}x)`, value: formatCurrency(Math.round(results.baseRate * results.nicheMultiplier)) }]
              : []),
            ...(results.deliverableMultiplier !== 1.0
              ? [{ label: `Deliverable Type (${results.deliverableMultiplier}x)`, value: `${results.deliverableMultiplier}x` }]
              : []),
            ...(results.exclusivityMultiplier !== 1.0
              ? [{ label: <Tooltip text="Premium charged for not working with competing brands during the campaign period">Exclusivity Premium ({results.exclusivityMultiplier}x)</Tooltip>, value: `${results.exclusivityMultiplier}x` }]
              : []),
            ...(results.usageMultiplier !== 1.0
              ? [{ label: <Tooltip text="Additional fee for the brand to reuse your content beyond the original post">Usage Rights ({results.usageMultiplier}x)</Tooltip>, value: `${results.usageMultiplier}x` }]
              : []),
            ...(results.rushMultiplier > 1.0
              ? [{ label: 'Rush Premium (1.5x)', value: '1.5x' }]
              : []),
            { label: 'Per Deliverable Rate', value: formatCurrency(results.perDeliverableRate), highlight: true },
            ...(results.bulkDiscount > 0
              ? [{ label: 'Bulk Discount', value: `-${formatCurrency(results.bulkDiscount)}` }]
              : []),
            { label: 'Package Total', value: formatCurrency(results.packageTotal), highlight: true },
          ]}
          category="creator"
        />

        <div className="mt-6 p-4 bg-creator-50 rounded-xl border border-creator-100">
          <h4 className="font-semibold text-creator-900 mb-2">Negotiation Tips</h4>
          <ul className="text-creator-700 text-sm space-y-1">
            <li>- Always charge separately for exclusivity and usage rights</li>
            <li>- Rush fees protect your schedule and compensate for rearranging priorities</li>
            <li>- Offer package deals (3+ posts) at a slight discount to secure longer partnerships</li>
            <li>- Your rate should increase as your engagement rate grows, not just your follower count</li>
          </ul>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
