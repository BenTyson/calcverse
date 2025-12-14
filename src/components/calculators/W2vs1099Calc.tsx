import { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/inputs/CurrencyInput';
import { SliderInput } from '../ui/inputs/SliderInput';
import { DropdownInput } from '../ui/inputs/DropdownInput';
import { ModeToggle } from '../ui/inputs/ModeToggle';
import { ResultCard } from '../ui/results/ResultCard';
import { ResultBreakdown } from '../ui/results/ResultBreakdown';
import {
  calculateW2vs1099,
  DEFAULT_INPUTS,
  QUICK_MODE_DEFAULTS,
  type W2vs1099Inputs,
} from '../../lib/calculators/w2-vs-1099';
import { formatCurrency } from '../../lib/utils/formatters';
import { getInitialState, updateUrlState, getInitialMode } from '../../lib/utils/url-state';

const FILING_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married Filing Jointly' },
  { value: 'married_separate', label: 'Married Filing Separately' },
  { value: 'head_household', label: 'Head of Household' },
];

export function W2vs1099Calc() {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<W2vs1099Inputs>(() =>
    getInitialState(DEFAULT_INPUTS)
  );

  useEffect(() => {
    if (mode === 'quick') {
      setInputs((prev) => ({ ...prev, ...QUICK_MODE_DEFAULTS }));
    }
  }, [mode]);

  const results = calculateW2vs1099(inputs);

  useEffect(() => {
    updateUrlState(inputs, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof W2vs1099Inputs>(
    key: K,
    value: W2vs1099Inputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';
  const w2Better = results.difference < 0;

  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'quick' && (
          <p className="text-sm text-neutral-500">
            Using typical benefits ($15K), 5% state tax
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Income Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Compensation</h3>

          <CurrencyInput
            id="annualSalary"
            label="Annual Salary / Contract Rate"
            value={inputs.annualSalary}
            onChange={(v) => updateInput('annualSalary', v)}
            min={0}
            max={500000}
            step={5000}
            helpText="Same amount for both scenarios"
          />

          <DropdownInput
            id="filingStatus"
            label="Filing Status"
            value={inputs.filingStatus}
            onChange={(v) => updateInput('filingStatus', v as W2vs1099Inputs['filingStatus'])}
            options={FILING_STATUS_OPTIONS}
          />

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
              helpText="0% for TX, FL, WA, etc."
            />
          )}
        </div>

        {/* W2 & 1099 Specifics */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">
            {isAdvanced ? 'Benefits & Expenses' : 'Tax Settings'}
          </h3>

          {isAdvanced && (
            <CurrencyInput
              id="employerBenefitsValue"
              label="W2 Employer Benefits Value"
              value={inputs.employerBenefitsValue}
              onChange={(v) => updateInput('employerBenefitsValue', v)}
              min={0}
              max={50000}
              step={1000}
              helpText="Health insurance, 401k match, etc."
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="retirementContribution"
              label="W2 Pre-Tax 401k Contribution"
              value={inputs.retirementContribution}
              onChange={(v) => updateInput('retirementContribution', v)}
              min={0}
              max={23000}
              step={500}
              helpText="Your contribution (not employer match)"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="businessExpenses1099"
              label="1099 Business Expenses"
              value={inputs.businessExpenses1099}
              onChange={(v) => updateInput('businessExpenses1099', v)}
              min={0}
              max={50000}
              step={500}
              helpText="Deductible business expenses"
            />
          )}

          {isAdvanced && (
            <CurrencyInput
              id="healthInsuranceCost1099"
              label="1099 Health Insurance Cost"
              value={inputs.healthInsuranceCost1099}
              onChange={(v) => updateInput('healthInsuranceCost1099', v)}
              min={0}
              max={24000}
              step={500}
              helpText="Annual cost to self-insure"
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-6 border-t border-neutral-100">
        <h3 className="font-semibold text-neutral-900 mb-4">Comparison Results</h3>

        {/* Winner Badge */}
        <div className={`mb-6 p-4 rounded-xl ${w2Better ? 'bg-blue-50 border border-blue-100' : 'bg-green-50 border border-green-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${w2Better ? 'bg-blue-500' : 'bg-green-500'} text-white font-bold`}>
              {w2Better ? 'W2' : '1099'}
            </div>
            <div>
              <p className={`font-semibold ${w2Better ? 'text-blue-800' : 'text-green-800'}`}>
                {w2Better ? 'W2 Employment' : '1099 Contractor'} comes out ahead
              </p>
              <p className={`text-sm ${w2Better ? 'text-blue-600' : 'text-green-600'}`}>
                by {formatCurrency(Math.abs(results.difference))} per year
              </p>
            </div>
          </div>
        </div>

        {/* Side by Side Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* W2 Column */}
          <div className="bg-blue-50 rounded-xl p-5">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">W2</span>
              Employee
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-700">Gross Salary</span>
                <span className="font-medium text-blue-900">{formatCurrency(results.w2.grossIncome)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">Federal Tax</span>
                <span className="text-blue-800">-{formatCurrency(results.w2.federalTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">State Tax</span>
                <span className="text-blue-800">-{formatCurrency(results.w2.stateTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">FICA (SS + Medicare)</span>
                <span className="text-blue-800">-{formatCurrency(results.w2.socialSecurityMedicare)}</span>
              </div>
              {results.w2.retirement > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">401k Contribution</span>
                  <span className="text-blue-800">-{formatCurrency(results.w2.retirement)}</span>
                </div>
              )}
              <div className="border-t border-blue-200 pt-3 flex justify-between">
                <span className="font-semibold text-blue-900">Net Take-Home</span>
                <span className="font-bold text-blue-900">{formatCurrency(results.w2.netIncome)}</span>
              </div>
              {results.w2.totalBenefitsValue > 0 && (
                <div className="flex justify-between text-sm bg-blue-100 -mx-5 px-5 py-2 mt-2">
                  <span className="text-blue-700">+ Benefits Value</span>
                  <span className="font-medium text-blue-800">+{formatCurrency(results.w2.totalBenefitsValue)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">Effective Tax Rate</span>
                <span className="text-blue-800">{results.w2.effectiveTaxRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* 1099 Column */}
          <div className="bg-green-50 rounded-xl p-5">
            <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">1099</span>
              Contractor
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-700">Gross Income</span>
                <span className="font-medium text-green-900">{formatCurrency(results.contractor.grossIncome)}</span>
              </div>
              {results.contractor.businessExpenses > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Business Expenses</span>
                  <span className="text-green-800">-{formatCurrency(results.contractor.businessExpenses)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Self-Employment Tax</span>
                <span className="text-green-800">-{formatCurrency(results.contractor.selfEmploymentTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Federal Tax</span>
                <span className="text-green-800">-{formatCurrency(results.contractor.federalTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">State Tax</span>
                <span className="text-green-800">-{formatCurrency(results.contractor.stateTax)}</span>
              </div>
              {results.contractor.healthInsurance > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Health Insurance</span>
                  <span className="text-green-800">-{formatCurrency(results.contractor.healthInsurance)}</span>
                </div>
              )}
              <div className="border-t border-green-200 pt-3 flex justify-between">
                <span className="font-semibold text-green-900">Net Take-Home</span>
                <span className="font-bold text-green-900">{formatCurrency(results.contractor.netIncome)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Effective Tax Rate</span>
                <span className="text-green-800">{results.contractor.effectiveTaxRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-4 bg-neutral-50 rounded-xl">
          <h4 className="font-semibold text-neutral-900 mb-2">Recommendation</h4>
          <p className="text-neutral-600">{results.recommendation}</p>
          {!w2Better && (
            <p className="text-sm text-neutral-500 mt-2">
              To match W2 total value, you'd need a contractor rate of approximately {formatCurrency(results.breakEvenRate)}.
            </p>
          )}
        </div>

        {/* Key Insight */}
        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-amber-800 text-sm">
            <strong>Remember:</strong> This comparison assumes the same gross amount. In reality, contractors
            often negotiate higher rates (typically 15-30% more) to account for self-employment tax and lack of benefits.
          </p>
        </div>
      </div>
    </div>
  );
}
