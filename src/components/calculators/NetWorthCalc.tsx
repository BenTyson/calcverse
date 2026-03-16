import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { NumberInput } from '../ui/inputs/NumberInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { DonutChart } from '../ui/charts/DonutChart';
import { ProjectionChart } from '../ui/charts/ProjectionChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateNetWorth,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  generateAssetId,
  generateLiabilityId,
  ASSET_CATEGORY_OPTIONS,
  LIABILITY_CATEGORY_OPTIONS,
  type Asset,
  type Liability,
  type NetWorthInputs,
  type AssetCategory,
  type LiabilityCategory,
} from '../../lib/calculators/net-worth';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';
import { Plus, X } from 'lucide-react';

export function NetWorthCalc() {
  const { mode, setMode, inputs, setInputs, updateInput, isAdvanced } =
    useCalculatorState<NetWorthInputs>(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  const results = calculateNetWorth(inputs);

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setInputs((prev) => ({
      ...prev,
      assets: prev.assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  };

  const addAsset = () => {
    setInputs((prev) => ({
      ...prev,
      assets: [
        ...prev.assets,
        { id: generateAssetId(), name: '', value: 0, category: 'cash' as AssetCategory, growthRate: 0 },
      ],
    }));
  };

  const removeAsset = (id: string) => {
    setInputs((prev) => ({
      ...prev,
      assets: prev.assets.filter((a) => a.id !== id),
    }));
  };

  const updateLiability = (id: string, updates: Partial<Liability>) => {
    setInputs((prev) => ({
      ...prev,
      liabilities: prev.liabilities.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  };

  const addLiability = () => {
    setInputs((prev) => ({
      ...prev,
      liabilities: [
        ...prev.liabilities,
        { id: generateLiabilityId(), name: '', balance: 0, category: 'other' as LiabilityCategory, interestRate: 0 },
      ],
    }));
  };

  const removeLiability = (id: string) => {
    setInputs((prev) => ({
      ...prev,
      liabilities: prev.liabilities.filter((l) => l.id !== id),
    }));
  };

  const getResultsText = () =>
    `Net Worth Calculator (CalcFalcon)\n` +
    `Total Assets: ${formatCurrency(results.totalAssets)}\n` +
    `Total Liabilities: ${formatCurrency(results.totalLiabilities)}\n` +
    `Net Worth: ${formatCurrency(results.netWorth)}\n` +
    `https://calcfalcon.com/personal-finance/net-worth-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            No growth projection, no contributions
          </p>
        )}
      </div>

      {/* Assets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900">Assets</h3>
          <span className="text-sm text-neutral-500">{inputs.assets.length} items</span>
        </div>

        <div className={`grid gap-3 text-xs font-medium text-neutral-500 uppercase tracking-wider px-1 ${isAdvanced ? 'grid-cols-[1fr_100px_110px_80px_32px]' : 'grid-cols-[1fr_100px_110px_32px]'}`}>
          <span>Name</span>
          <span>Value</span>
          <span>Category</span>
          {isAdvanced && <span>Growth</span>}
          <span></span>
        </div>

        {inputs.assets.map((asset) => (
          <div
            key={asset.id}
            className={`grid gap-3 items-center p-2 rounded-lg border border-neutral-200 bg-white ${isAdvanced ? 'grid-cols-[1fr_100px_110px_80px_32px]' : 'grid-cols-[1fr_100px_110px_32px]'}`}
          >
            <input
              type="text"
              value={asset.name}
              onChange={(e) => updateAsset(asset.id, { name: e.target.value })}
              placeholder="Asset name"
              className="px-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
            />
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
              <input
                type="number"
                value={asset.value || ''}
                onChange={(e) => updateAsset(asset.id, { value: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min={0}
                className="w-full pl-6 pr-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
              />
            </div>
            <select
              value={asset.category}
              onChange={(e) => updateAsset(asset.id, { category: e.target.value as AssetCategory })}
              className="px-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
            >
              {ASSET_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {isAdvanced && (
              <div className="relative">
                <input
                  type="number"
                  value={asset.growthRate || ''}
                  onChange={(e) => updateAsset(asset.id, { growthRate: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  step={0.5}
                  className="w-full px-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">%</span>
              </div>
            )}
            <button
              onClick={() => removeAsset(asset.id)}
              className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              aria-label={`Remove ${asset.name}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={addAsset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-finance-600 hover:text-finance-700 hover:bg-finance-50 rounded-lg border border-dashed border-finance-300 transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      {/* Liabilities */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900">Liabilities</h3>
          <span className="text-sm text-neutral-500">{inputs.liabilities.length} items</span>
        </div>

        <div className={`grid gap-3 text-xs font-medium text-neutral-500 uppercase tracking-wider px-1 ${isAdvanced ? 'grid-cols-[1fr_100px_110px_80px_32px]' : 'grid-cols-[1fr_100px_110px_32px]'}`}>
          <span>Name</span>
          <span>Balance</span>
          <span>Category</span>
          {isAdvanced && <span>Rate</span>}
          <span></span>
        </div>

        {inputs.liabilities.map((liability) => (
          <div
            key={liability.id}
            className={`grid gap-3 items-center p-2 rounded-lg border border-neutral-200 bg-white ${isAdvanced ? 'grid-cols-[1fr_100px_110px_80px_32px]' : 'grid-cols-[1fr_100px_110px_32px]'}`}
          >
            <input
              type="text"
              value={liability.name}
              onChange={(e) => updateLiability(liability.id, { name: e.target.value })}
              placeholder="Liability name"
              className="px-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
            />
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
              <input
                type="number"
                value={liability.balance || ''}
                onChange={(e) => updateLiability(liability.id, { balance: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min={0}
                className="w-full pl-6 pr-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
              />
            </div>
            <select
              value={liability.category}
              onChange={(e) => updateLiability(liability.id, { category: e.target.value as LiabilityCategory })}
              className="px-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
            >
              {LIABILITY_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {isAdvanced && (
              <div className="relative">
                <input
                  type="number"
                  value={liability.interestRate || ''}
                  onChange={(e) => updateLiability(liability.id, { interestRate: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  step={0.1}
                  className="w-full px-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">%</span>
              </div>
            )}
            <button
              onClick={() => removeLiability(liability.id)}
              className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              aria-label={`Remove ${liability.name}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={addLiability}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-finance-600 hover:text-finance-700 hover:bg-finance-50 rounded-lg border border-dashed border-finance-300 transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Liability
        </button>
      </div>

      {/* Advanced: Projection Settings */}
      {isAdvanced && (
        <div className="grid md:grid-cols-2 gap-6">
          <NumberInput
            id="projectionYears"
            label="Projection Years"
            value={inputs.projectionYears}
            onChange={(v) => updateInput('projectionYears', v)}
            min={1}
            max={30}
            step={1}
            suffix="years"
            helpText="How far ahead to project net worth growth"
          />
          <CurrencyInput
            id="annualContributions"
            label="Annual Contributions"
            value={inputs.annualContributions}
            onChange={(v) => updateInput('annualContributions', v)}
            min={0}
            max={100000}
            step={1000}
            helpText="Annual amount added to investment accounts"
          />
        </div>
      )}

      {/* Results */}
      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Net Worth</h3>
          <CopyResultsButton getResultsText={getResultsText} category="finance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ResultCard
            label="Net Worth"
            value={formatCurrency(results.netWorth)}
            numericValue={results.netWorth}
            formatFn={formatCurrency}
            highlight
            category="finance"
          />
          <ResultCard
            label="Total Assets"
            value={formatCurrency(results.totalAssets)}
            numericValue={results.totalAssets}
            formatFn={formatCurrency}
            description={`${inputs.assets.length} assets`}
          />
          <ResultCard
            label="Total Liabilities"
            value={formatCurrency(results.totalLiabilities)}
            numericValue={results.totalLiabilities}
            formatFn={formatCurrency}
            description={`${inputs.liabilities.length} debts`}
          />
          <ResultCard
            label="Debt-to-Asset Ratio"
            value={`${results.debtToAssetRatio}%`}
            description={results.debtToAssetRatio < 50 ? 'Healthy' : 'High'}
          />
        </div>

        {results.assetAllocation.length > 0 && (
          <ChartCard title="Asset Allocation" category="finance" className="mb-6">
            <DonutChart
              data={results.assetAllocation}
              category="finance"
            />
          </ChartCard>
        )}

        {isAdvanced && results.projectionData.length > 1 && (
          <ChartCard title="Net Worth Projection" category="finance" className="mb-6">
            <ProjectionChart
              data={results.projectionData.map((d) => ({
                label: d.label,
                netWorth: d.netWorth,
              }))}
              lines={[
                { dataKey: 'netWorth', label: 'Projected Net Worth', areaFill: true },
              ]}
              category="finance"
            />
          </ChartCard>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {results.assetAllocation.length > 0 && (
            <ResultBreakdown
              title="Asset Breakdown"
              category="finance"
              items={results.assetAllocation.map((a) => ({
                label: a.label,
                value: formatCurrency(a.value),
              }))}
            />
          )}
          <div className="space-y-4">
            {results.liabilityBreakdown.length > 0 && (
              <ResultBreakdown
                title="Liability Breakdown"
                category="finance"
                items={results.liabilityBreakdown.map((l) => ({
                  label: l.label,
                  value: formatCurrency(l.value),
                }))}
              />
            )}
            {isAdvanced && results.projectedNetWorth > results.netWorth && (
              <div className="bg-finance-50 rounded-xl p-4 text-sm text-finance-800">
                <strong>Projection:</strong> In {inputs.projectionYears} years, your net worth could reach{' '}
                {formatCurrency(results.projectedNetWorth)} with current growth rates
                {inputs.annualContributions > 0 && ` and ${formatCurrency(inputs.annualContributions)}/year contributions`}.
              </div>
            )}
            <div className="bg-finance-50 rounded-xl p-4 text-sm text-finance-800">
              <strong>Tip:</strong>{' '}
              <Tooltip text="Net worth = total assets minus total liabilities. It's the single best measure of your overall financial health.">
                Net worth
              </Tooltip>{' '}
              is the clearest snapshot of your financial health. Track it monthly to see your progress and identify where to focus.
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
