import { useState, useEffect } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { DonutChart } from '../ui/charts/DonutChart';
import {
  calculateSubscriptionAudit,
  DEFAULT_SUBSCRIPTIONS,
  generateId,
  type Subscription,
  type SubscriptionAuditInputs,
  type SubFrequency,
  type SubCategory,
} from '../../lib/calculators/subscription-audit';
import { formatCurrency, formatCurrencyWithCents } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';
import { Plus, X } from 'lucide-react';

export function SubscriptionAuditCalc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<SubscriptionAuditInputs>(() =>
    getInitialState({ subscriptions: DEFAULT_SUBSCRIPTIONS })
  );

  const results = calculateSubscriptionAudit(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const isAdvanced = mode === 'advanced';

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setInputs((prev) => ({
      subscriptions: prev.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, ...updates } : sub
      ),
    }));
  };

  const addSubscription = () => {
    setInputs((prev) => ({
      subscriptions: [
        ...prev.subscriptions,
        {
          id: generateId(),
          name: '',
          cost: 0,
          frequency: 'monthly' as SubFrequency,
          category: 'nice-to-have' as SubCategory,
        },
      ],
    }));
  };

  const removeSubscription = (id: string) => {
    setInputs((prev) => ({
      subscriptions: prev.subscriptions.filter((sub) => sub.id !== id),
    }));
  };

  const getResultsText = () =>
    `Subscription Audit (CalcFalcon)\n` +
    `Total Monthly: ${formatCurrencyWithCents(results.totalMonthly)}\n` +
    `Total Annual: ${formatCurrency(results.totalAnnual)}\n` +
    `Potential Monthly Savings: ${formatCurrencyWithCents(results.potentialSavings)}\n` +
    `https://calcfalcon.com/personal-finance/subscription-audit-calculator`;

  const categoryColors: Record<SubCategory, { bg: string; text: string; border: string }> = {
    essential: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'nice-to-have': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    unnecessary: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            All subscriptions treated as "nice-to-have"
          </p>
        )}
      </div>

      {/* Subscription List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900">Your Subscriptions</h3>
          <span className="text-sm text-neutral-500">{inputs.subscriptions.length} active</span>
        </div>

        {/* Header Row */}
        <div className={`grid gap-3 text-xs font-medium text-neutral-500 uppercase tracking-wider px-1 ${isAdvanced ? 'grid-cols-[1fr_100px_100px_130px_32px]' : 'grid-cols-[1fr_100px_100px_32px]'}`}>
          <span>Name</span>
          <span>Cost</span>
          <span>Frequency</span>
          {isAdvanced && <span>Priority</span>}
          <span></span>
        </div>

        {inputs.subscriptions.map((sub) => (
          <div
            key={sub.id}
            className={`grid gap-3 items-center p-2 rounded-lg border ${
              isAdvanced
                ? `grid-cols-[1fr_100px_100px_130px_32px] ${categoryColors[sub.category].border} ${categoryColors[sub.category].bg}`
                : 'grid-cols-[1fr_100px_100px_32px] border-neutral-200 bg-white'
            }`}
          >
            <input
              type="text"
              value={sub.name}
              onChange={(e) => updateSubscription(sub.id, { name: e.target.value })}
              placeholder="Service name"
              className="px-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
            />
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
              <input
                type="number"
                value={sub.cost || ''}
                onChange={(e) =>
                  updateSubscription(sub.id, {
                    cost: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                min={0}
                step={0.01}
                className="w-full pl-6 pr-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
              />
            </div>
            <select
              value={sub.frequency}
              onChange={(e) =>
                updateSubscription(sub.id, {
                  frequency: e.target.value as SubFrequency,
                })
              }
              className="px-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
            {isAdvanced && (
              <select
                value={sub.category}
                onChange={(e) =>
                  updateSubscription(sub.id, {
                    category: e.target.value as SubCategory,
                  })
                }
                className={`px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 ${categoryColors[sub.category].border} ${categoryColors[sub.category].text} bg-white`}
              >
                <option value="essential">Essential</option>
                <option value="nice-to-have">Nice to Have</option>
                <option value="unnecessary">Unnecessary</option>
              </select>
            )}
            <button
              onClick={() => removeSubscription(sub.id)}
              className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              aria-label={`Remove ${sub.name}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={addSubscription}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-finance-600 hover:text-finance-700 hover:bg-finance-50 rounded-lg border border-dashed border-finance-300 transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Subscription
        </button>
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Audit Results</h3>
          <CopyResultsButton getResultsText={getResultsText} category="finance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ResultCard
            label="Total Monthly"
            value={formatCurrencyWithCents(results.totalMonthly)}
            numericValue={results.totalMonthly}
            formatFn={formatCurrencyWithCents}
            highlight
            size="lg"
            category="finance"
          />
          <ResultCard
            label="Total Annual"
            value={formatCurrency(results.totalAnnual)}
            numericValue={results.totalAnnual}
            formatFn={formatCurrency}
          />
          <ResultCard
            label="Potential Savings"
            value={`${formatCurrencyWithCents(results.potentialSavings)}/mo`}
            description={isAdvanced ? 'Unnecessary + nice-to-have' : 'All subscriptions'}
          />
          <ResultCard
            label="Annual Savings"
            value={formatCurrency(results.potentialAnnualSavings)}
            description="If you cut non-essentials"
          />
        </div>

        {isAdvanced && (
          <ChartCard title="Spending by Priority" category="finance" className="mb-6">
            <DonutChart
              data={[
                { label: 'Essential', value: results.essentialMonthly },
                { label: 'Nice to Have', value: results.niceToHaveMonthly },
                { label: 'Unnecessary', value: results.unnecessaryMonthly },
              ]}
              category="finance"
              innerLabel="Monthly Total"
              innerValue={formatCurrencyWithCents(results.totalMonthly)}
            />
          </ChartCard>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {isAdvanced && (
            <ResultBreakdown
              title="By Priority"
              category="finance"
              items={[
                { label: 'Essential', value: `${formatCurrencyWithCents(results.essentialMonthly)}/mo` },
                { label: 'Nice to Have', value: `${formatCurrencyWithCents(results.niceToHaveMonthly)}/mo` },
                { label: 'Unnecessary', value: `${formatCurrencyWithCents(results.unnecessaryMonthly)}/mo` },
                { label: 'Potential Savings', value: `${formatCurrencyWithCents(results.potentialSavings)}/mo`, highlight: true },
              ]}
            />
          )}
          <div className="space-y-4">
            <ResultBreakdown
              title="Annual Impact"
              category="finance"
              items={[
                { label: 'Total Annual Spend', value: formatCurrency(results.totalAnnual) },
                { label: 'Annual Savings Potential', value: formatCurrency(results.potentialAnnualSavings), highlight: true },
                { label: 'Subscriptions', value: `${results.subscriptionCount}` },
              ]}
            />
            <div className="bg-finance-50 rounded-xl p-4 text-sm text-finance-800">
              <strong>Tip:</strong> Review your subscriptions quarterly. Cancel anything you
              haven't used in the last 30 days. Many services offer annual plans at a discount
              if you decide to keep them.
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
