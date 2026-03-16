import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import { CopyResultsButton } from '../ui/results/CopyResultsButton';
import { ChartCard } from '../ui/charts/ChartCard';
import { ProjectionChart } from '../ui/charts/ProjectionChart';
import { Tooltip } from '../ui/Tooltip';
import {
  calculateDebtPayoff,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  generateId,
  type Debt,
  type DebtPayoffInputs,
  type PayoffStrategy,
} from '../../lib/calculators/debt-payoff';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';
import { Plus, X } from 'lucide-react';

const STRATEGY_OPTIONS = [
  { value: 'avalanche', label: 'Avalanche (highest rate first)' },
  { value: 'snowball', label: 'Snowball (lowest balance first)' },
];

export function DebtPayoffCalc() {
  const { mode, setMode, inputs, setInputs, updateInput, isAdvanced } =
    useCalculatorState<DebtPayoffInputs>(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  const results = calculateDebtPayoff(inputs);

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setInputs((prev) => ({
      ...prev,
      debts: prev.debts.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  };

  const addDebt = () => {
    setInputs((prev) => ({
      ...prev,
      debts: [
        ...prev.debts,
        {
          id: generateId(),
          name: '',
          balance: 0,
          interestRate: 0,
          minimumPayment: 0,
        },
      ],
    }));
  };

  const removeDebt = (id: string) => {
    setInputs((prev) => ({
      ...prev,
      debts: prev.debts.filter((d) => d.id !== id),
    }));
  };

  const getResultsText = () =>
    `Debt Payoff Calculator (CalcFalcon)\n` +
    `Debt Free: ${results.payoffDate}\n` +
    `Total Interest: ${formatCurrency(results.totalInterest)}\n` +
    `Interest Saved: ${formatCurrency(results.interestSaved)}\n` +
    `Months Saved: ${results.monthsSaved}\n` +
    `https://calcfalcon.com/personal-finance/debt-payoff-calculator`;

  const formatMonths = (months: number): string => {
    const years = Math.floor(months / 12);
    const remaining = months % 12;
    if (years === 0) return `${remaining}mo`;
    if (remaining === 0) return `${years}yr`;
    return `${years}yr ${remaining}mo`;
  };

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using avalanche strategy, no lump sum
          </p>
        )}
      </div>

      {/* Debt List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900">Your Debts</h3>
          <span className="text-sm text-neutral-500">{inputs.debts.length} debts</span>
        </div>

        {/* Header Row */}
        <div className="grid gap-3 text-xs font-medium text-neutral-500 uppercase tracking-wider px-1 grid-cols-[1fr_100px_80px_100px_32px]">
          <span>Name</span>
          <span>Balance</span>
          <span>Rate</span>
          <span>Min Payment</span>
          <span></span>
        </div>

        {inputs.debts.map((debt) => (
          <div
            key={debt.id}
            className="grid gap-3 items-center p-2 rounded-lg border border-neutral-200 bg-white grid-cols-[1fr_100px_80px_100px_32px]"
          >
            <input
              type="text"
              value={debt.name}
              onChange={(e) => updateDebt(debt.id, { name: e.target.value })}
              placeholder="Debt name"
              className="px-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
            />
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
              <input
                type="number"
                value={debt.balance || ''}
                onChange={(e) => updateDebt(debt.id, { balance: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min={0}
                className="w-full pl-6 pr-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
              />
            </div>
            <div className="relative">
              <input
                type="number"
                value={debt.interestRate || ''}
                onChange={(e) => updateDebt(debt.id, { interestRate: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min={0}
                max={99}
                step={0.1}
                className="w-full px-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">%</span>
            </div>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
              <input
                type="number"
                value={debt.minimumPayment || ''}
                onChange={(e) => updateDebt(debt.id, { minimumPayment: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min={0}
                className="w-full pl-6 pr-2 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-finance-500 bg-white"
              />
            </div>
            <button
              onClick={() => removeDebt(debt.id)}
              className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              aria-label={`Remove ${debt.name}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={addDebt}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-finance-600 hover:text-finance-700 hover:bg-finance-50 rounded-lg border border-dashed border-finance-300 transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Debt
        </button>
      </div>

      {/* Payment Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Extra Payment</h3>
          <CurrencyInput
            id="extraMonthlyPayment"
            label="Extra Monthly Payment"
            value={inputs.extraMonthlyPayment}
            onChange={(v) => updateInput('extraMonthlyPayment', v)}
            min={0}
            max={10000}
            step={50}
            helpText="Additional amount above minimums each month"
          />
        </div>

        {isAdvanced && (
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Strategy</h3>
            <DropdownInput
              id="strategy"
              label="Payoff Strategy"
              value={inputs.strategy}
              onChange={(v) => updateInput('strategy', v as PayoffStrategy)}
              options={STRATEGY_OPTIONS}
              helpText="How to prioritize which debt to pay first"
            />
            <CurrencyInput
              id="lumpSumPayment"
              label="One-Time Lump Sum"
              value={inputs.lumpSumPayment}
              onChange={(v) => updateInput('lumpSumPayment', v)}
              min={0}
              max={100000}
              step={500}
              helpText="One-time extra payment applied to target debt now"
            />
          </div>
        )}
      </div>

      {/* Results */}
      <div className="border-t border-neutral-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Payoff Plan</h3>
          <CopyResultsButton getResultsText={getResultsText} category="finance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ResultCard
            label="Debt Free Date"
            value={results.payoffDate}
            description={formatMonths(results.payoffMonths)}
            highlight
            category="finance"
          />
          <ResultCard
            label="Total Interest"
            value={formatCurrency(results.totalInterest)}
            numericValue={results.totalInterest}
            formatFn={formatCurrency}
            description="With extra payments"
          />
          <ResultCard
            label="Interest Saved"
            value={formatCurrency(results.interestSaved)}
            numericValue={results.interestSaved}
            formatFn={formatCurrency}
            description="vs minimum payments only"
          />
          <ResultCard
            label="Months Saved"
            value={`${results.monthsSaved}`}
            description={`${formatMonths(results.payoffMonthsMinimumOnly)} without extra`}
          />
        </div>

        {results.timeline.length > 1 && (
          <ChartCard title="Debt Payoff Projection" category="finance" className="mb-6">
            <ProjectionChart
              data={results.timeline.map((t) => ({
                label: `Mo ${t.month}`,
                withExtra: t.withExtra,
                minimumOnly: t.minimumOnly,
              }))}
              lines={[
                { dataKey: 'withExtra', label: 'With Extra Payments', areaFill: true },
                { dataKey: 'minimumOnly', label: 'Minimum Only', dashed: true },
              ]}
              category="finance"
              goalLine={{
                value: 0,
                label: 'Debt Free',
              }}
            />
          </ChartCard>
        )}

        {results.interestSaved > 0 && (
          <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
            <p className="text-green-800 font-semibold">
              You'll save {formatCurrency(results.interestSaved)} in interest and be debt-free {results.monthsSaved} months sooner!
            </p>
            <p className="text-green-600 text-sm mt-1">
              By paying an extra {formatCurrency(inputs.extraMonthlyPayment)}/month using the {inputs.strategy} method
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {results.debtOrder.length > 0 && (
            <ResultBreakdown
              title="Payoff Order"
              category="finance"
              items={results.debtOrder.map((d) => ({
                label: <Tooltip text={inputs.strategy === 'avalanche' ? 'Avalanche method: pay off highest interest rate first to minimize total interest paid' : 'Snowball method: pay off smallest balance first for quick psychological wins'}>{d.name}</Tooltip>,
                value: d.eliminationMonth === 0 ? 'Lump sum' : `Month ${d.eliminationMonth} (${formatMonths(d.eliminationMonth)})`,
                highlight: d === results.debtOrder[results.debtOrder.length - 1],
              }))}
            />
          )}
          <div className="space-y-4">
            <ResultBreakdown
              title="Payment Summary"
              category="finance"
              items={[
                { label: 'Total Monthly Minimums', value: formatCurrency(inputs.debts.reduce((sum, d) => sum + d.minimumPayment, 0)) },
                { label: 'Extra Payment', value: formatCurrency(inputs.extraMonthlyPayment) },
                { label: 'Total Monthly Payment', value: formatCurrency(inputs.debts.reduce((sum, d) => sum + d.minimumPayment, 0) + inputs.extraMonthlyPayment), highlight: true },
                { label: <Tooltip text="Total interest without extra payments">Interest (minimums only)</Tooltip>, value: formatCurrency(results.totalInterestMinimumOnly) },
                { label: 'Interest (with extra)', value: formatCurrency(results.totalInterest) },
              ]}
            />
            <div className="bg-finance-50 rounded-xl p-4 text-sm text-finance-800">
              <strong>Tip:</strong> The avalanche method saves the most money on interest, while the snowball method
              gives quicker wins by eliminating smaller debts first. Pick the one that keeps you motivated.
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
