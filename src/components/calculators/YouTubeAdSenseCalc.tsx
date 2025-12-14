import { useState, useEffect } from 'react';
import { NumberInput } from '../ui/inputs/NumberInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateYouTubeRevenue,
  DEFAULT_INPUTS,
  NICHE_CPMS,
  LOCATION_MULTIPLIERS,
  type YouTubeAdSenseInputs,
} from '../../lib/calculators/youtube-adsense';
import { formatCurrency, formatCompactNumber } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState } from '../../lib/utils/url-state';

const nicheOptions = Object.entries(NICHE_CPMS).map(([value, data]) => ({
  value,
  label: data.label,
}));

const locationOptions = Object.entries(LOCATION_MULTIPLIERS).map(([value, data]) => ({
  value,
  label: data.label,
}));

export function YouTubeAdSenseCalc() {
  const [inputs, setInputs] = useState<YouTubeAdSenseInputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  const results = calculateYouTubeRevenue(inputs);

  useEffect(() => {
    updateUrlState(inputs);
  }, [inputs]);

  const updateInput = <K extends keyof YouTubeAdSenseInputs>(
    key: K,
    value: YouTubeAdSenseInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const formatRange = (low: number, high: number) =>
    `${formatCurrency(Math.round(low))} - ${formatCurrency(Math.round(high))}`;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Channel Stats</h3>
          <NumberInput
            id="monthlyViews"
            label="Monthly Views"
            value={inputs.monthlyViews}
            onChange={(v) => updateInput('monthlyViews', v)}
            min={0}
            max={100000000}
            step={10000}
            helpText="Total views across all videos per month"
          />
          <NumberInput
            id="uploads"
            label="Videos Per Month"
            value={inputs.uploadsPerMonth}
            onChange={(v) => updateInput('uploadsPerMonth', v)}
            min={1}
            max={100}
            suffix="videos"
            helpText="How many videos you publish monthly"
          />
          <SliderInput
            id="watchTime"
            label="Average View Duration"
            value={inputs.averageViewDuration}
            onChange={(v) => updateInput('averageViewDuration', v)}
            min={10}
            max={100}
            step={5}
            formatValue={(v) => `${v}%`}
            helpText="% of video watched on average"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Content & Audience</h3>
          <DropdownInput
            id="niche"
            label="Content Niche"
            value={inputs.niche}
            onChange={(v) => updateInput('niche', v)}
            options={nicheOptions}
            helpText="Your primary content category"
          />
          <DropdownInput
            id="location"
            label="Primary Audience Location"
            value={inputs.audienceLocation}
            onChange={(v) => updateInput('audienceLocation', v)}
            options={locationOptions}
            helpText="Where most of your viewers are from"
          />
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Estimated Earnings</h3>

        <div className="bg-gradient-to-r from-brand-50 to-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Monthly Earnings Range</p>
          <p className="text-3xl font-bold text-brand-700">
            {formatRange(results.monthlyEarnings.low, results.monthlyEarnings.high)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Estimated: {formatCurrency(Math.round(results.monthlyEarnings.mid))}/month
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Annual Earnings (Est.)"
            value={formatCurrency(Math.round(results.annualEarnings.mid))}
            description={formatRange(results.annualEarnings.low, results.annualEarnings.high)}
          />
          <ResultCard
            label="Per Video (Est.)"
            value={formatCurrency(Math.round(results.earningsPerVideo.mid))}
            description="Average per upload"
          />
          <ResultCard
            label="RPM (Est.)"
            value={`$${results.estimatedRPM.mid.toFixed(2)}`}
            description="Revenue per 1K views"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResultBreakdown
            title="CPM by Niche"
            items={Object.entries(NICHE_CPMS)
              .slice(0, 6)
              .map(([key, data]) => ({
                label: data.label,
                value: `$${data.low} - $${data.high}`,
                highlight: key === inputs.niche,
              }))}
          />
          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-xl p-4 text-sm text-yellow-800">
              <strong>Note:</strong> These are estimates based on industry averages.
              Actual earnings vary based on advertiser demand, seasonality, and
              individual channel metrics.
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
              <strong>To increase earnings:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Target higher-CPM niches like finance or tech</li>
                <li>Create longer videos (8+ min) for mid-roll ads</li>
                <li>Build a US/UK audience</li>
                <li>Improve watch time and engagement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
