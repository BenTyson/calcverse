import { useState, useEffect } from 'react';
import { NumberInput } from '../ui/inputs/NumberInput';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateTwitchRevenue,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  distributeSubs,
  type TwitchRevenueInputs,
} from '../../lib/calculators/twitch-revenue';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

export function TwitchRevenueCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<TwitchRevenueInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  useEffect(() => {
    if (mode === 'quick') {
      setInputs((prev) => ({ ...prev, ...QUICK_MODE_DEFAULTS }));
    }
  }, [mode]);

  // In quick mode, distribute subs automatically
  const effectiveInputs = mode === 'quick'
    ? {
        ...inputs,
        ...distributeSubs(inputs.subscriberCount),
        bitsPerMonth: inputs.averageViewers * 25, // Rough estimate: 25 bits per viewer
      }
    : inputs;

  const results = calculateTwitchRevenue(effectiveInputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof TwitchRevenueInputs>(
    key: K,
    value: TwitchRevenueInputs[K]
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
            Using 50/50 split, estimated bits & ads
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Audience Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Audience</h3>

          <NumberInput
            id="averageViewers"
            label="Average Concurrent Viewers"
            value={inputs.averageViewers}
            onChange={(v) => updateInput('averageViewers', v)}
            min={0}
            max={100000}
            step={10}
            helpText="Average viewers during streams"
          />

          {mode === 'quick' ? (
            <NumberInput
              id="subscriberCount"
              label="Total Subscribers"
              value={inputs.subscriberCount}
              onChange={(v) => updateInput('subscriberCount', v)}
              min={0}
              max={50000}
              step={10}
              helpText="All subscription tiers combined"
            />
          ) : (
            <>
              <NumberInput
                id="tier1Subs"
                label="Tier 1 Subs ($4.99)"
                value={inputs.tier1Subs}
                onChange={(v) => updateInput('tier1Subs', v)}
                min={0}
                max={50000}
                step={5}
              />
              <NumberInput
                id="tier2Subs"
                label="Tier 2 Subs ($9.99)"
                value={inputs.tier2Subs}
                onChange={(v) => updateInput('tier2Subs', v)}
                min={0}
                max={10000}
                step={1}
              />
              <NumberInput
                id="tier3Subs"
                label="Tier 3 Subs ($24.99)"
                value={inputs.tier3Subs}
                onChange={(v) => updateInput('tier3Subs', v)}
                min={0}
                max={5000}
                step={1}
              />
            </>
          )}
        </div>

        {/* Revenue Sources */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Additional Revenue' : 'Stream Schedule'}
          </h3>

          {isAdvanced && (
            <NumberInput
              id="streamHoursPerWeek"
              label="Stream Hours Per Week"
              value={inputs.streamHoursPerWeek}
              onChange={(v) => updateInput('streamHoursPerWeek', v)}
              min={0}
              max={168}
              step={1}
              suffix=" hrs"
              helpText="Affects ad revenue calculation"
            />
          )}

          {isAdvanced && (
            <NumberInput
              id="bitsPerMonth"
              label="Bits Received Per Month"
              value={inputs.bitsPerMonth}
              onChange={(v) => updateInput('bitsPerMonth', v)}
              min={0}
              max={1000000}
              step={500}
              helpText="1000 bits = $10 to you"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="adRevenuePerHour"
              label="Ad Revenue Per Hour"
              value={inputs.adRevenuePerHour}
              onChange={(v) => updateInput('adRevenuePerHour', v)}
              min={0}
              max={50}
              step={0.5}
              helpText="Typical: $2-5 for small streamers"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="sponsorshipRevenue"
              label="Monthly Sponsorship Revenue"
              value={inputs.sponsorshipRevenue}
              onChange={(v) => updateInput('sponsorshipRevenue', v)}
              min={0}
              max={100000}
              step={100}
              helpText="Brand deals, affiliate income, etc."
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="twitchCut"
              label="Twitch's Cut"
              value={inputs.twitchCut}
              onChange={(v) => updateInput('twitchCut', v)}
              min={30}
              max={50}
              step={5}
              suffix="%"
              helpText="Standard: 50%, Top Partners: 30%"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <h3 className="font-semibold text-neutral-900 mb-4">Estimated Earnings</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Monthly Revenue"
            value={formatCurrency(results.netMonthly)}
            description="After Twitch's cut"
            category="creator"
            highlighted
          />
          <ResultCard
            label="Annual Revenue"
            value={formatCurrency(results.netAnnual)}
            description="Projected yearly earnings"
            category="creator"
          />
          <ResultCard
            label="Revenue Per Viewer"
            value={formatCurrency(results.revenuePerViewer)}
            description="Monthly per avg viewer"
            category="creator"
          />
        </div>

        {/* Revenue Breakdown Visual */}
        {results.breakdown.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-neutral-700 mb-3">Revenue Sources</h4>
            <div className="h-8 rounded-lg overflow-hidden flex">
              {results.breakdown.map((item, index) => {
                const colors = ['bg-creator-500', 'bg-creator-400', 'bg-creator-300', 'bg-creator-200'];
                return (
                  <div
                    key={item.label}
                    className={`${colors[index]} flex items-center justify-center text-white text-xs font-medium`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.label}: ${formatCurrency(item.value)}`}
                  >
                    {item.percentage > 15 && item.label}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-sm">
              {results.breakdown.map((item, index) => {
                const colors = ['bg-creator-500', 'bg-creator-400', 'bg-creator-300', 'bg-creator-200'];
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
          title="Detailed Breakdown"
          items={[
            { label: 'Tier 1 Sub Revenue', value: formatCurrency(results.subscriptionRevenue.tier1) },
            { label: 'Tier 2 Sub Revenue', value: formatCurrency(results.subscriptionRevenue.tier2) },
            { label: 'Tier 3 Sub Revenue', value: formatCurrency(results.subscriptionRevenue.tier3) },
            { label: 'Total Sub Revenue', value: formatCurrency(results.subscriptionRevenue.total), highlighted: true },
            { label: 'Bits Revenue', value: formatCurrency(results.bitsRevenue) },
            { label: 'Ad Revenue', value: formatCurrency(results.adRevenue) },
            { label: 'Sponsorships', value: formatCurrency(results.sponsorshipRevenue) },
            { label: 'Twitch Fees (Subs Only)', value: `-${formatCurrency(results.twitchFees)}` },
            { label: 'Net Monthly Revenue', value: formatCurrency(results.netMonthly), highlighted: true },
          ]}
          category="creator"
        />

        {/* Tips */}
        <div className="mt-6 p-4 bg-creator-50 rounded-xl border border-creator-100">
          <h4 className="font-semibold text-creator-900 mb-2">Growth Tips</h4>
          <ul className="text-creator-700 text-sm space-y-1">
            <li>• Top Partners can negotiate a 70/30 split (vs standard 50/50)</li>
            <li>• Prime subs count the same as Tier 1 subs</li>
            <li>• Bits revenue goes 100% to you (Twitch takes cut from buyer)</li>
            <li>• Consistent streaming schedule helps grow subscriber count</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
