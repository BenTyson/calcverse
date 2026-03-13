import { ErrorBoundary } from '../ui/ErrorBoundary';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { DonutChart } from '../ui/charts/DonutChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateTikTokEarnings,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type TikTokEarningsInputs,
} from '../../lib/calculators/tiktok-earnings';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function TikTokCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } = useCalculatorState<TikTokEarningsInputs>(
    DEFAULT_INPUTS,
    QUICK_MODE_DEFAULTS
  );

  const results = calculateTikTokEarnings(inputs);

  const getResultsText = () =>
    `TikTok Earnings Calculator (CalcFalcon)\n` +
    `Monthly Earnings: ${formatCurrency(results.totalMonthly)}\n` +
    `Annual Earnings: ${formatCurrency(results.totalAnnual)}\n` +
    `Per Video: ${formatCurrency(results.perVideo)}\n` +
    `https://calcfalcon.com/creator/tiktok-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Creator Fund only. Switch to Advanced for brand deals and LIVE gifts.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Video Performance</h3>

          <NumberInput
            id="viewsPerVideo"
            label="Average Views Per Video"
            value={inputs.viewsPerVideo}
            onChange={(v) => updateInput('viewsPerVideo', v)}
            min={0}
            max={10000000}
            step={5000}
            helpText="Average views each video gets"
          />

          <NumberInput
            id="videosPerWeek"
            label="Videos Per Week"
            value={inputs.videosPerWeek}
            onChange={(v) => updateInput('videosPerWeek', v)}
            min={1}
            max={50}
            step={1}
            helpText="How many videos you post weekly"
          />

          <SliderInput
            id="rpm"
            label={<><Tooltip text="Revenue Per Mille — what TikTok pays per 1,000 qualified views through the Creator Fund">RPM</Tooltip> (per 1K views)</>}
            value={inputs.rpm}
            onChange={(v) => updateInput('rpm', v)}
            min={0.01}
            max={0.10}
            step={0.01}
            formatValue={(v) => `$${v.toFixed(2)}`}
            helpText="TikTok Creator Fund typically pays $0.02-$0.05 per 1K views"
          />
        </div>

        <div className="space-y-4">
          {isAdvanced && (
            <>
              <h3 className="font-semibold text-neutral-900">Brand Deals</h3>

              <CurrencyInput
                id="brandDealRate"
                label="Average Brand Deal Rate"
                value={inputs.brandDealRate}
                onChange={(v) => updateInput('brandDealRate', v)}
                min={0}
                max={50000}
                step={50}
                helpText="What you charge per sponsored post"
              />

              <NumberInput
                id="brandDealsPerMonth"
                label="Brand Deals Per Month"
                value={inputs.brandDealsPerMonth}
                onChange={(v) => updateInput('brandDealsPerMonth', v)}
                min={0}
                max={20}
                step={1}
                helpText="Sponsored posts per month"
              />
            </>
          )}

          {isAdvanced && (
            <>
              <h3 className="font-semibold text-neutral-900 mt-6">LIVE Streaming</h3>

              <NumberInput
                id="liveHoursPerWeek"
                label="LIVE Hours Per Week"
                value={inputs.liveHoursPerWeek}
                onChange={(v) => updateInput('liveHoursPerWeek', v)}
                min={0}
                max={40}
                step={1}
                helpText="Hours spent streaming LIVE weekly"
              />

              <CurrencyInput
                id="avgGiftsPerHour"
                label="Average Gifts Per Hour"
                value={inputs.avgGiftsPerHour}
                onChange={(v) => updateInput('avgGiftsPerHour', v)}
                min={0}
                max={500}
                step={5}
                helpText="Dollar value of gifts received per hour"
              />
            </>
          )}

          {isAdvanced && (
            <>
              <h3 className="font-semibold text-neutral-900 mt-6">Growth</h3>

              <SliderInput
                id="engagementRate"
                label={<Tooltip text="Percentage of viewers who like, comment, or share — higher engagement can attract more brand deals">Engagement Rate</Tooltip>}
                value={inputs.engagementRate}
                onChange={(v) => updateInput('engagementRate', v)}
                min={1}
                max={20}
                step={0.5}
                formatValue={(v) => `${v}%`}
                helpText="Like, comment, and share rate"
              />

              <SliderInput
                id="monthlyGrowthRate"
                label="Monthly Growth Rate"
                value={inputs.monthlyGrowthRate}
                onChange={(v) => updateInput('monthlyGrowthRate', v)}
                min={0}
                max={30}
                step={1}
                formatValue={(v) => `${v}%`}
                helpText="Expected monthly audience growth"
              />
            </>
          )}

          {!isAdvanced && (
            <div className="p-4 bg-creator-50 rounded-xl border border-creator-100">
              <h4 className="font-semibold text-creator-900 mb-2">TikTok Creator Fund</h4>
              <p className="text-creator-700 text-sm">
                The <Tooltip text="TikTok's program that pays creators based on video views — requires 10K+ followers and 100K+ views in the last 30 days">Creator Fund</Tooltip> pays
                based on qualified views. Rates vary by region but typically range from $0.02-$0.05 per 1,000 views.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Estimated Earnings</h3>
          <CopyResultsButton getResultsText={getResultsText} category="creator" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Monthly Earnings"
            value={formatCurrency(results.totalMonthly)}
            numericValue={results.totalMonthly}
            formatFn={formatCurrency}
            description={`From ${Math.round(results.monthlyViews).toLocaleString()} monthly views`}
            category="creator"
            highlight
          />
          <ResultCard
            label="Annual Earnings"
            value={formatCurrency(results.totalAnnual)}
            numericValue={results.totalAnnual}
            formatFn={formatCurrency}
            description="Projected yearly"
            category="creator"
          />
          <ResultCard
            label="Per Video"
            value={formatCurrency(results.perVideo)}
            description={`${inputs.videosPerWeek} videos/week`}
            category="creator"
          />
        </div>

        {/* DonutChart — only when multiple revenue streams > 0 */}
        {results.breakdown.length > 1 && (
          <ChartCard title="Revenue Sources" category="creator" className="mb-6">
            <DonutChart
              data={results.breakdown.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
              category="creator"
              innerLabel="Monthly"
              innerValue={formatCurrency(results.totalMonthly)}
            />
          </ChartCard>
        )}

        <ResultBreakdown
          title="Earnings Breakdown"
          items={[
            {
              label: <Tooltip text="Revenue from TikTok's Creator Fund based on qualified video views">Creator Fund</Tooltip>,
              value: formatCurrency(results.creatorFundRevenue),
            },
            ...(results.brandDealRevenue > 0
              ? [{ label: 'Brand Deals', value: formatCurrency(results.brandDealRevenue) }]
              : []),
            ...(results.liveGiftRevenue > 0
              ? [{ label: 'LIVE Gifts', value: formatCurrency(results.liveGiftRevenue) }]
              : []),
            { label: 'Total Monthly', value: formatCurrency(results.totalMonthly), highlight: true },
            { label: 'Total Annual', value: formatCurrency(results.totalAnnual) },
          ]}
          category="creator"
        />

        {/* Growth projection (advanced only) */}
        {isAdvanced && inputs.monthlyGrowthRate > 0 && (
          <div className="mt-6">
            <ResultBreakdown
              title="12-Month Growth Projection"
              items={[
                { label: 'Month 1', value: formatCurrency(results.growthProjection[0].earnings) },
                { label: 'Month 3', value: formatCurrency(results.growthProjection[2].earnings) },
                { label: 'Month 6', value: formatCurrency(results.growthProjection[5].earnings) },
                { label: 'Month 12', value: formatCurrency(results.growthProjection[11].earnings), highlight: true },
              ]}
              category="creator"
            />
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-creator-50 rounded-xl border border-creator-100">
          <h4 className="font-semibold text-creator-900 mb-2">Maximizing TikTok Earnings</h4>
          <ul className="text-creator-700 text-sm space-y-1">
            <li>- The Creator Fund alone won't replace a full-time income — diversify with brand deals</li>
            <li>- Brands pay based on engagement rate, not just followers — quality over quantity</li>
            <li>- LIVE streaming builds deeper audience connection and generates gift revenue</li>
            <li>- Post consistently (1-3x daily) during peak hours for maximum growth</li>
          </ul>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
