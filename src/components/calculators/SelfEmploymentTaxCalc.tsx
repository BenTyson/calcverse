import { ErrorBoundary } from '../ui/ErrorBoundary';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
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
  calculateSelfEmploymentTaxResults,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type SelfEmploymentTaxInputs,
} from '../../lib/calculators/self-employment-tax';
import { formatCurrency } from '../../lib/utils/formatters';
import { useCalculatorState } from '../../hooks/useCalculatorState';

const FILING_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married Filing Jointly' },
  { value: 'married_separate', label: 'Married Filing Separately' },
  { value: 'head_household', label: 'Head of Household' },
];

const BUSINESS_TYPE_OPTIONS = [
  { value: 'sstb', label: 'Specified service business (consulting, health, law, finance…)' },
  { value: 'non_sstb', label: 'Any other trade or business' },
];

export function SelfEmploymentTaxCalc() {
  const { mode, setMode, inputs, updateInput, isAdvanced } =
    useCalculatorState<SelfEmploymentTaxInputs>(DEFAULT_INPUTS, QUICK_MODE_DEFAULTS);

  const results = calculateSelfEmploymentTaxResults(inputs);
  const qbi = results.qbiDetail;
  const aboveThreshold = qbi.taxableIncomeBeforeQBI > qbi.threshold;
  const isSSTB = inputs.qbiBusinessType === 'sstb';

  const getResultsText = () =>
    `Self-Employment Tax Calculator (CalcFalcon)\n` +
    `Total SE Tax: ${formatCurrency(results.totalSETax)}\n` +
    `Federal Income Tax: ${formatCurrency(results.federalIncomeTax)}\n` +
    `Total Tax Burden: ${formatCurrency(results.totalTax)}\n` +
    `Effective Tax Rate: ${results.effectiveTaxRate.toFixed(1)}%\n` +
    `https://calcfalcon.com/freelance/self-employment-tax-calculator`;

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using 5% state tax, standard deduction, no QBI
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Income</h3>

          <CurrencyInput
            id="annualIncome"
            label="Annual Self-Employment Income"
            value={inputs.annualIncome}
            onChange={(v) => updateInput('annualIncome', v)}
            min={0}
            max={1000000}
            step={5000}
            helpText="Gross income from self-employment before expenses"
          />

          <DropdownInput
            id="filingStatus"
            label="Filing Status"
            value={inputs.filingStatus}
            onChange={(v) => updateInput('filingStatus', v as SelfEmploymentTaxInputs['filingStatus'])}
            options={FILING_STATUS_OPTIONS}
            helpText="Your tax filing status"
          />

          {isAdvanced && (
            <CurrencyInput
              id="otherIncome"
              label="Other Income (W2, investments)"
              value={inputs.otherIncome}
              onChange={(v) => updateInput('otherIncome', v)}
              min={0}
              max={500000}
              step={1000}
              helpText="Non-SE income subject to tax"
            />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Deductions & Settings' : 'Tax Settings'}
          </h3>

          {isAdvanced && (
            <CurrencyInput
              id="businessExpenses"
              label="Business Expenses"
              value={inputs.businessExpenses}
              onChange={(v) => updateInput('businessExpenses', v)}
              min={0}
              max={500000}
              step={500}
              helpText="Deductible expenses (home office, supplies, etc.)"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="estimatedDeductions"
              label="Itemized Deductions"
              value={inputs.estimatedDeductions}
              onChange={(v) => updateInput('estimatedDeductions', v)}
              min={0}
              max={100000}
              step={500}
              helpText="If higher than standard deduction"
            />
          )}

          {isAdvanced && (
            <SliderInput
              id="stateTaxRate"
              label="State Tax Rate"
              value={inputs.stateTaxRate}
              onChange={(v) => updateInput('stateTaxRate', v)}
              min={0}
              max={15}
              step={0.1}
              suffix="%"
              helpText="Your state's income tax rate (0% for TX, FL, etc.)"
            />
          )}

          {isAdvanced && (
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
              <input
                type="checkbox"
                id="qbiToggle"
                checked={inputs.qualifiedBusinessIncomeDeduction}
                onChange={(e) => updateInput('qualifiedBusinessIncomeDeduction', e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-freelance-600 focus:ring-freelance-500"
                aria-describedby="qbiHelp"
              />
              <label htmlFor="qbiToggle" className="text-sm font-medium text-neutral-700">
                <Tooltip text="The Section 199A deduction: up to 20% of qualified business income. Above the income threshold it is limited by the type of business you run and the W-2 wages your business pays.">
                  QBI Deduction (Section 199A)
                </Tooltip>
              </label>
              <span id="qbiHelp" className="sr-only">Qualified Business Income deduction under Section 199A</span>
            </div>
          )}

          {isAdvanced && inputs.qualifiedBusinessIncomeDeduction && (
            <DropdownInput
              id="qbiBusinessType"
              label="Type of Business (for QBI)"
              value={inputs.qbiBusinessType}
              onChange={(v) => updateInput('qbiBusinessType', v as SelfEmploymentTaxInputs['qbiBusinessType'])}
              options={BUSINESS_TYPE_OPTIONS}
              helpText="Consulting, health, law, accounting, financial services, athletics, performing arts — and any business trading on the owner's reputation or skill — are specified service businesses. This only changes your result above the income threshold."
            />
          )}

          {isAdvanced && inputs.qualifiedBusinessIncomeDeduction && aboveThreshold && (
            <>
              <CurrencyInput
                id="w2WagesPaid"
                label="W-2 Wages Paid by the Business"
                value={inputs.w2WagesPaid}
                onChange={(v) => updateInput('w2WagesPaid', v)}
                min={0}
                max={1000000}
                step={5000}
                helpText="Wages on payroll, not your own draw. A sole proprietor with no employees enters $0."
              />
              <CurrencyInput
                id="qualifiedPropertyUBIA"
                label="Business Property (UBIA)"
                value={inputs.qualifiedPropertyUBIA}
                onChange={(v) => updateInput('qualifiedPropertyUBIA', v)}
                min={0}
                max={5000000}
                step={10000}
                helpText="Original cost of depreciable property still in its recovery period. Usually $0 for a service business."
              />
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Your Self-Employment Tax</h3>
          <CopyResultsButton getResultsText={getResultsText} category="freelance" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ResultCard
            label="Total SE Tax"
            value={formatCurrency(results.totalSETax)}
            numericValue={results.totalSETax}
            formatFn={formatCurrency}
            description="Social Security + Medicare"
            category="freelance"
            highlight
          />
          <ResultCard
            label="Federal Income Tax"
            value={formatCurrency(results.federalIncomeTax)}
            numericValue={results.federalIncomeTax}
            formatFn={formatCurrency}
            description={`Marginal bracket: ${(results.marginalBracket * 100).toFixed(0)}%`}
            category="freelance"
          />
          <ResultCard
            label="Total Tax Burden"
            value={formatCurrency(results.totalTax)}
            numericValue={results.totalTax}
            formatFn={formatCurrency}
            description={`Effective rate: ${results.effectiveTaxRate.toFixed(1)}%`}
            category="freelance"
          />
        </div>

        {results.seDeduction > 0 && (
          <div className="mb-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
            <p className="text-primary-800 font-medium">
              SE Tax Deduction: {formatCurrency(results.seDeduction)}
            </p>
            <p className="text-primary-600 text-sm mt-1">
              You can deduct 50% of your SE tax from your adjusted gross income
            </p>
          </div>
        )}

        {inputs.qualifiedBusinessIncomeDeduction && aboveThreshold && (
          <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-amber-900 font-medium">
              {qbi.deduction > 0
                ? `QBI deduction limited to ${formatCurrency(qbi.deduction)}`
                : 'No QBI deduction at this income level'}
            </p>
            <p className="text-amber-800 text-sm mt-1">
              Your taxable income before the QBI deduction is{' '}
              {formatCurrency(qbi.taxableIncomeBeforeQBI)}, above the{' '}
              {formatCurrency(qbi.threshold)} threshold for your filing status. Above that
              point Section 199A starts limiting the deduction, and the limits are fully
              phased in at {formatCurrency(qbi.phaseInEnd)}.
            </p>
            <ul className="text-amber-800 text-sm mt-2 space-y-1 list-disc list-inside">
              {isSSTB && qbi.abovePhaseInRange && (
                <li>
                  A specified service business stops being a qualified trade or business
                  entirely at {formatCurrency(qbi.phaseInEnd)}, so none of its income
                  counts.
                </li>
              )}
              {isSSTB && qbi.inPhaseInRange && (
                <li>
                  Only {(qbi.sstbApplicablePercent * 100).toFixed(1)}% of your business
                  income counts as qualified business income, because a specified service
                  business phases out across this range.
                </li>
              )}
              {qbi.limitedByWagesOrUbia && !(isSSTB && qbi.abovePhaseInRange) && (
                <li>
                  {inputs.w2WagesPaid === 0 && inputs.qualifiedPropertyUBIA === 0
                    ? 'Your business pays no W-2 wages and holds no qualifying property, so the payroll cap on the deduction is $0'
                    : `Your business pays ${formatCurrency(inputs.w2WagesPaid)} in W-2 wages, which sets the payroll cap at ${formatCurrency(qbi.wageAndUbiaLimit)}`}
                  {qbi.abovePhaseInRange
                    ? '. That cap is fully in force at this income level.'
                    : ', phased in across this range.'}
                </li>
              )}
              {qbi.incomeLimitBinds && (
                <li>
                  The deduction is also capped at 20% of taxable income, or{' '}
                  {formatCurrency(qbi.incomeLimit)}.
                </li>
              )}
              {qbi.minimumApplied && (
                <li>
                  The computed deduction fell below the Section 199A(i) minimum, so you get
                  the {formatCurrency(qbi.deduction)} floor instead.
                </li>
              )}
            </ul>
          </div>
        )}

        <ChartCard title="Tax Breakdown by Type" category="freelance">
          <BarComparisonChart
            data={[
              {
                label: 'Your Taxes',
                socialSecurity: results.socialSecurityTax,
                medicare: results.medicareTax + results.additionalMedicareTax,
                federal: results.federalIncomeTax,
                state: results.stateTax,
              },
            ]}
            bars={[
              { dataKey: 'socialSecurity', label: 'Social Security' },
              { dataKey: 'medicare', label: 'Medicare' },
              { dataKey: 'federal', label: 'Federal Income' },
              { dataKey: 'state', label: 'State' },
            ]}
            category="freelance"
            stacked
          />
        </ChartCard>

        <ResultBreakdown
          title="Detailed Tax Breakdown"
          items={results.breakdown.map((item) => ({
            label: item.label === 'Net SE Income'
              ? <Tooltip text="Gross income minus business expenses">{item.label}</Tooltip>
              : item.label === 'Total Self-Employment Tax'
              ? <Tooltip text="Combined Social Security (12.4%) and Medicare (2.9%) tax on 92.35% of net SE income">{item.label}</Tooltip>
              : item.label === 'SE Tax Deduction (50%)'
              ? <Tooltip text="Half of your SE tax is deductible from adjusted gross income">{item.label}</Tooltip>
              : item.label === 'QBI Deduction (Section 199A)'
              ? <Tooltip text="Up to 20% of qualified business income, after the specified-service and W-2 wage limits and the 20%-of-taxable-income cap">{item.label}</Tooltip>
              : item.label,
            value: formatCurrency(Math.abs(item.value)),
            highlight: item.label === 'Total Tax Burden',
          }))}
          category="freelance"
        />

        <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
          <h4 className="font-semibold text-neutral-900 mb-2">Schedule SE Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-500">Net SE Income (92.35%):</span>
              <span className="ml-2 font-medium">{formatCurrency(results.netSEIncome * 0.9235)}</span>
            </div>
            <div>
              <span className="text-neutral-500">SS Tax (12.4%):</span>
              <span className="ml-2 font-medium">{formatCurrency(results.socialSecurityTax)}</span>
            </div>
            <div>
              <span className="text-neutral-500">Medicare Tax (2.9%):</span>
              <span className="ml-2 font-medium">{formatCurrency(results.medicareTax)}</span>
            </div>
            {results.additionalMedicareTax > 0 && (
              <div>
                <span className="text-neutral-500">Addl. Medicare (0.9%):</span>
                <span className="ml-2 font-medium">{formatCurrency(results.additionalMedicareTax)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
