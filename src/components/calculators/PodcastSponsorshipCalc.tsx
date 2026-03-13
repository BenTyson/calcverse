import { ErrorBoundary } from '../ui/ErrorBoundary';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { Tooltip } from '../ui/Tooltip';
import {
  calculatePodcastSponsorship,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  CPM_BENCHMARKS,
  type PodcastSponsorshipInputs,
} from '../../lib/calculators/podcast-sponsorship';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

export function PodcastSponsorshipCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } = useCalculatorState<PodcastSponsorshipInputs>(
    DEFAULT_INPUTS,
    QUICK_MODE_DEFAULTS
  );

  const results = calculatePodcastSponsorship(inputs);

  const getResultsText = () =>
    `Podcast Sponsorship Calculator (CalcFalcon)\n` +
    `Monthly Revenue: ${formatCurrency(results.netMonthly)}\n` +
    `Annual Revenue: ${formatCurrency(results.netAnnual)}\n` +
    `Effective CPM: ${formatCurrency(results.effectiveCPM)}\n` +
    `https://calcfalcon.com/creator/podcast-sponsorship-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using $25 CPM, 4 ad spots, 70% fill rate
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Audience */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Audience</h3>

          <NumberInput
            id="downloadsPerEpisode"
            label="Downloads Per Episode"
            value={inputs.downloadsPerEpisode}
            onChange={(v) => updateInput('downloadsPerEpisode', v)}
            min={0}
            max={1000000}
            step={500}
            helpText="Average within first 30 days"
          />

          <NumberInput
            id="episodesPerMonth"
            label="Episodes Per Month"
            value={inputs.episodesPerMonth}
            onChange={(v) => updateInput('episodesPerMonth', v)}
            min={1}
            max={30}
            step={1}
            helpText="How often you publish"
          />

          {isAdvanced && (
            <CurrencyInput
              id="cpmRate"
              label="CPM Rate"
              value={inputs.cpmRate}
              onChange={(v) => updateInput('cpmRate', v)}
              min={5}
              max={100}
              step={5}
              helpText="Cost per 1000 downloads"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="fillRate"
              label="Fill Rate"
              value={inputs.fillRate}
              onChange={(v) => updateInput('fillRate', v)}
              min={0}
              max={100}
              step={5}
              suffix="%"
              helpText="% of ad inventory sold"
            />
          )}
        </div>

        {/* Ad Spots & Revenue */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Ad Inventory' : 'Additional Revenue'}
          </h3>

          {isAdvanced && (
            <NumberInput
              id="preRollSpots"
              label="Pre-Roll Spots"
              value={inputs.preRollSpots}
              onChange={(v) => updateInput('preRollSpots', v)}
              min={0}
              max={3}
              step={1}
              helpText="15-30 sec ads at start"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="midRollSpots"
              label="Mid-Roll Spots"
              value={inputs.midRollSpots}
              onChange={(v) => updateInput('midRollSpots', v)}
              min={0}
              max={5}
              step={1}
              helpText="60 sec ads (highest CPM)"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="postRollSpots"
              label="Post-Roll Spots"
              value={inputs.postRollSpots}
              onChange={(v) => updateInput('postRollSpots', v)}
              min={0}
              max={2}
              step={1}
              helpText="15-30 sec ads at end"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="affiliateRevenue"
              label="Monthly Affiliate Revenue"
              value={inputs.affiliateRevenue}
              onChange={(v) => updateInput('affiliateRevenue', v)}
              min={0}
              max={10000}
              step={50}
              helpText="Promo codes, affiliate links"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="premiumSubscribers"
              label="Premium Subscribers"
              value={inputs.premiumSubscribers}
              onChange={(v) => updateInput('premiumSubscribers', v)}
              min={0}
              max={10000}
              step={10}
              helpText="Paid subscribers (Patreon, etc.)"
            />
          )}

          {isAdvanced && inputs.premiumSubscribers > 0 && (
            <CurrencyInput
              id="premiumPrice"
              label="Premium Sub Price"
              value={inputs.premiumPrice}
              onChange={(v) => updateInput('premiumPrice', v)}
              min={1}
              max={50}
              step={1}
              helpText="Monthly subscription price"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Estimated Revenue</h3>
          <CopyResultsButton getResultsText={getResultsText} category="creator" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ResultCard
            label="Monthly Revenue"
            value={formatCurrency(results.netMonthly)}
            numericValue={results.netMonthly}
            formatFn={formatCurrency}
            description="Total estimated earnings"
            category="creator"
            highlight
          />
          <ResultCard
            label="Annual Revenue"
            value={formatCurrency(results.netAnnual)}
            description="Projected yearly"
            category="creator"
          />
          <ResultCard
            label="Effective CPM"
            value={formatCurrency(results.effectiveCPM)}
            description="Actual $/1000 downloads"
            category="creator"
          />
          <ResultCard
            label="Monthly Downloads"
            value={results.monthlyDownloads.toLocaleString()}
            description={`${inputs.episodesPerMonth} episodes`}
            category="creator"
          />
        </div>

        {/* Revenue Breakdown Visual */}
        {results.breakdown.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-neutral-700 mb-3">Revenue Sources</h4>
            <div className="h-8 rounded-lg overflow-hidden flex">
              {results.breakdown.map((item, index) => {
                const colors = ['bg-creator-500', 'bg-creator-400', 'bg-creator-300', 'bg-creator-200', 'bg-creator-100'];
                return (
                  <div
                    key={item.label}
                    className={`${colors[index]} flex items-center justify-center text-white text-xs font-medium`}
                    style={{ width: `${Math.max(item.percentage, 5)}%` }}
                    title={`${item.label}: ${formatCurrency(item.value)}`}
                  >
                    {item.percentage > 15 && item.label.split(' ')[0]}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-sm">
              {results.breakdown.map((item, index) => {
                const colors = ['bg-creator-500', 'bg-creator-400', 'bg-creator-300', 'bg-creator-200', 'bg-creator-100'];
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded ${colors[index]}`}></span>
                    <span className="text-neutral-600">{item.label}: {formatCurrency(item.value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ResultBreakdown
          title="Revenue Breakdown"
          items={[
            { label: <Tooltip text="15-30 sec ads before the episode starts">Pre-Roll Ads ({inputs.preRollSpots} spots)</Tooltip>, value: formatCurrency(results.preRollRevenue) },
            { label: <Tooltip text="60 sec ads mid-episode — highest CPM placement">Mid-Roll Ads ({inputs.midRollSpots} spots)</Tooltip>, value: formatCurrency(results.midRollRevenue) },
            { label: <Tooltip text="15-30 sec ads at the end of the episode">Post-Roll Ads ({inputs.postRollSpots} spots)</Tooltip>, value: formatCurrency(results.postRollRevenue) },
            { label: 'Total Ad Revenue', value: formatCurrency(results.totalAdRevenue), highlight: true },
            ...(results.affiliateRevenue > 0 ? [{ label: 'Affiliate Revenue', value: formatCurrency(results.affiliateRevenue) }] : []),
            ...(results.premiumRevenue > 0 ? [{ label: 'Premium Subscriptions', value: formatCurrency(results.premiumRevenue) }] : []),
            { label: 'Total Monthly Revenue', value: formatCurrency(results.grossMonthly), highlight: true },
          ]}
          category="creator"
        />

        {/* CPM Benchmarks */}
        <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
          <h4 className="font-semibold text-neutral-900 mb-3">CPM Benchmarks by Niche</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {CPM_BENCHMARKS.map((item) => (
              <div key={item.niche} className="flex justify-between">
                <span className="text-neutral-600">{item.niche}</span>
                <span className="font-medium text-neutral-900">{item.cpm}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-creator-50 rounded-xl border border-creator-100">
          <h4 className="font-semibold text-creator-900 mb-2">Monetization Tips</h4>
          <ul className="text-creator-700 text-sm space-y-1">
            <li>• Mid-roll ads pay the highest CPM (listeners are most engaged)</li>
            <li>• Direct sponsorships often pay 2-3x network rates</li>
            <li>• You typically need 5,000+ downloads/episode to attract sponsors</li>
            <li>• Niche audiences (business, tech) command premium CPMs</li>
          </ul>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
