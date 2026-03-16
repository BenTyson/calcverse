import {
  STANDARD_DEDUCTIONS,
  NIIT_RATE,
  NIIT_THRESHOLDS,
  calculateFederalTax,
  calculateCapitalGainsTax,
  type FilingStatus,
} from './shared/tax-brackets';

export interface CapitalGainsTaxInputs {
  // Quick mode
  gainAmount: number;
  holdingPeriod: 'short' | 'long';
  filingStatus: FilingStatus;

  // Advanced mode
  ordinaryIncome: number;
  capitalLosses: number;
  stateTaxRate: number;
}

export interface CapitalGainsTaxResults {
  netGain: number;
  federalTax: number;
  niitTax: number;
  stateTax: number;
  totalTax: number;
  effectiveRate: number;
  taxSavingsFromLongTerm: number;
  longTermRate: number;
  shortTermTax: number;
  longTermTax: number;
  comparison: { label: string; federal: number; niit: number; state: number }[];
  breakdown: { label: string; value: number }[];
}

export function calculateCapitalGainsTaxResults(inputs: CapitalGainsTaxInputs): CapitalGainsTaxResults {
  // Apply capital losses against gains (excess limited to $3K against ordinary income per IRS)
  const netGain = Math.max(0, inputs.gainAmount - inputs.capitalLosses);

  // Calculate ordinary taxable income (for bracket stacking)
  const standardDeduction = STANDARD_DEDUCTIONS[inputs.filingStatus];
  const ordinaryTaxableIncome = Math.max(0, inputs.ordinaryIncome - standardDeduction);

  // NIIT applies on lesser of: net investment income or MAGI above threshold
  const magi = inputs.ordinaryIncome + netGain;
  const niitThreshold = NIIT_THRESHOLDS[inputs.filingStatus];
  const niitBase = Math.min(netGain, Math.max(0, magi - niitThreshold));
  const niitTax = niitBase * NIIT_RATE;

  // Short-term: taxed as ordinary income
  const shortTermFederalTax = netGain > 0
    ? calculateFederalTax(ordinaryTaxableIncome + netGain, inputs.filingStatus) -
      calculateFederalTax(ordinaryTaxableIncome, inputs.filingStatus)
    : 0;

  // Long-term: taxed at preferential rates (stacked on ordinary income)
  const longTermFederalTax = netGain > 0
    ? calculateCapitalGainsTax(netGain, ordinaryTaxableIncome, inputs.filingStatus)
    : 0;

  const isShortTerm = inputs.holdingPeriod === 'short';
  const federalTax = isShortTerm ? shortTermFederalTax : longTermFederalTax;

  const stateTax = netGain * (inputs.stateTaxRate / 100);
  const totalTax = federalTax + niitTax + stateTax;
  const effectiveRate = netGain > 0 ? (totalTax / netGain) * 100 : 0;

  const taxSavingsFromLongTerm = isShortTerm
    ? 0
    : (shortTermFederalTax - longTermFederalTax);

  // Effective long-term rate for display
  const longTermRate = netGain > 0 ? (longTermFederalTax / netGain) * 100 : 0;

  // Short-term total for comparison
  const shortTermTotal = shortTermFederalTax + niitTax + stateTax;
  const longTermTotal = longTermFederalTax + niitTax + stateTax;

  const comparison = [
    {
      label: 'Short-Term (< 1 year)',
      federal: shortTermFederalTax,
      niit: niitTax,
      state: stateTax,
    },
    {
      label: 'Long-Term (1+ year)',
      federal: longTermFederalTax,
      niit: niitTax,
      state: stateTax,
    },
  ];

  const breakdown: { label: string; value: number }[] = [
    { label: 'Capital Gains', value: inputs.gainAmount },
  ];

  if (inputs.capitalLosses > 0) {
    breakdown.push({ label: 'Capital Losses', value: -inputs.capitalLosses });
    breakdown.push({ label: 'Net Capital Gain', value: netGain });
  }

  breakdown.push(
    { label: `Federal Tax (${isShortTerm ? 'short-term' : 'long-term'})`, value: federalTax },
  );

  if (niitTax > 0) {
    breakdown.push({ label: 'Net Investment Income Tax (3.8%)', value: niitTax });
  }

  if (stateTax > 0) {
    breakdown.push({ label: 'State Tax', value: stateTax });
  }

  breakdown.push({ label: 'Total Tax', value: totalTax });

  if (!isShortTerm && taxSavingsFromLongTerm > 0) {
    breakdown.push({ label: 'Savings vs Short-Term', value: -taxSavingsFromLongTerm });
  }

  return {
    netGain,
    federalTax,
    niitTax,
    stateTax,
    totalTax,
    effectiveRate,
    taxSavingsFromLongTerm,
    longTermRate,
    shortTermTax: shortTermTotal,
    longTermTax: longTermTotal,
    comparison,
    breakdown,
  };
}

export const DEFAULT_INPUTS: CapitalGainsTaxInputs = {
  gainAmount: 50000,
  holdingPeriod: 'long',
  filingStatus: 'single',
  ordinaryIncome: 75000,
  capitalLosses: 0,
  stateTaxRate: 5,
};

export const QUICK_MODE_DEFAULTS: Partial<CapitalGainsTaxInputs> = {
  ordinaryIncome: 75000,
  capitalLosses: 0,
  stateTaxRate: 5,
};
