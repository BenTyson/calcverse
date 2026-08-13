import {
  STANDARD_DEDUCTIONS,
  calculateFederalTax,
  calculateSelfEmploymentTax,
  getMarginalBracket,
  type FilingStatus,
} from './shared/tax-brackets';

export interface SelfEmploymentTaxInputs {
  // Quick mode
  annualIncome: number;
  filingStatus: FilingStatus;

  // Advanced mode
  businessExpenses: number;
  stateTaxRate: number;
  otherIncome: number;
  estimatedDeductions: number;
  qualifiedBusinessIncomeDeduction: boolean;
}

export interface SelfEmploymentTaxResults {
  netSEIncome: number;
  socialSecurityTax: number;
  medicareTax: number;
  additionalMedicareTax: number;
  totalSETax: number;
  seDeduction: number;
  federalIncomeTax: number;
  stateTax: number;
  totalTax: number;
  effectiveTaxRate: number;
  marginalBracket: number;
  qbiDeduction: number;
  breakdown: { label: string; value: number }[];
  comparison: { label: string; [key: string]: string | number }[];
}

export function calculateSelfEmploymentTaxResults(inputs: SelfEmploymentTaxInputs): SelfEmploymentTaxResults {
  const netSEIncome = Math.max(0, inputs.annualIncome - inputs.businessExpenses);

  const seTax = calculateSelfEmploymentTax(netSEIncome, inputs.filingStatus);

  const totalIncome = netSEIncome + inputs.otherIncome;
  const agi = totalIncome - seTax.seDeduction;

  const standardDeduction = STANDARD_DEDUCTIONS[inputs.filingStatus];
  const deductions = Math.max(standardDeduction, inputs.estimatedDeductions);

  // § 199A QBI deduction. Two things this must get right, both of which the
  // earlier "20% of net income, capped at AGI" version got wrong — it
  // overstated the deduction by ~30% at $100k and so understated tax owed:
  //
  //  1. QBI is net business income REDUCED by the deductible half of SE tax.
  //     Instructions for Form 8995 list "deductible part of self-employment
  //     tax" among the items that reduce QBI.
  //     https://www.irs.gov/instructions/i8995
  //  2. The deduction is the LESSER of 20% of QBI and 20% of taxable income
  //     figured BEFORE the QBI deduction, minus net capital gain. For a solo
  //     filer the second ceiling usually binds, because the standard deduction
  //     has already come off.
  //     https://www.irs.gov/newsroom/qualified-business-income-deduction
  //
  // Still not modeled (see the disclosure on this calculator): the SSTB
  // limitation and the phase-out above QBI_THRESHOLDS, and the § 199A(i)
  // minimum deduction. Net capital gain is assumed to be zero — this
  // calculator has no capital gains input.
  const qbi = Math.max(0, netSEIncome - seTax.seDeduction);
  const taxableIncomeBeforeQBI = Math.max(0, agi - deductions);
  const qbiDeduction = inputs.qualifiedBusinessIncomeDeduction
    ? Math.min(qbi * 0.20, taxableIncomeBeforeQBI * 0.20)
    : 0;

  const taxableIncome = Math.max(0, taxableIncomeBeforeQBI - qbiDeduction);

  const federalIncomeTax = calculateFederalTax(taxableIncome, inputs.filingStatus);
  const stateTax = taxableIncome * (inputs.stateTaxRate / 100);
  const totalTax = seTax.totalSETax + federalIncomeTax + stateTax;
  const effectiveTaxRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;
  const marginalBracket = getMarginalBracket(taxableIncome, inputs.filingStatus);

  const breakdown: { label: string; value: number }[] = [
    { label: 'Gross Self-Employment Income', value: inputs.annualIncome },
    { label: 'Business Expenses', value: -inputs.businessExpenses },
    { label: 'Net SE Income', value: netSEIncome },
    { label: 'Social Security Tax (12.4%)', value: seTax.socialSecurityTax },
    { label: 'Medicare Tax (2.9%)', value: seTax.medicareTax },
  ];

  if (seTax.additionalMedicareTax > 0) {
    breakdown.push({ label: 'Additional Medicare Tax (0.9%)', value: seTax.additionalMedicareTax });
  }

  breakdown.push(
    { label: 'Total Self-Employment Tax', value: seTax.totalSETax },
    { label: 'SE Tax Deduction (50%)', value: -seTax.seDeduction },
  );

  if (qbiDeduction > 0) {
    breakdown.push({ label: 'QBI Deduction (20%)', value: -qbiDeduction });
  }

  breakdown.push(
    { label: 'Federal Income Tax', value: federalIncomeTax },
    { label: 'State Tax', value: stateTax },
    { label: 'Total Tax Burden', value: totalTax },
  );

  const comparison = [
    {
      label: 'Tax Breakdown',
      socialSecurity: seTax.socialSecurityTax,
      medicare: seTax.medicareTax + seTax.additionalMedicareTax,
      federal: federalIncomeTax,
      state: stateTax,
    },
  ];

  return {
    netSEIncome,
    socialSecurityTax: seTax.socialSecurityTax,
    medicareTax: seTax.medicareTax,
    additionalMedicareTax: seTax.additionalMedicareTax,
    totalSETax: seTax.totalSETax,
    seDeduction: seTax.seDeduction,
    federalIncomeTax,
    stateTax,
    totalTax,
    effectiveTaxRate,
    marginalBracket,
    qbiDeduction,
    breakdown,
    comparison,
  };
}

export const DEFAULT_INPUTS: SelfEmploymentTaxInputs = {
  annualIncome: 85000,
  filingStatus: 'single',
  businessExpenses: 10000,
  stateTaxRate: 5,
  otherIncome: 0,
  estimatedDeductions: 0,
  qualifiedBusinessIncomeDeduction: false,
};

export const QUICK_MODE_DEFAULTS: Partial<SelfEmploymentTaxInputs> = {
  businessExpenses: 10000,
  stateTaxRate: 5,
  otherIncome: 0,
  estimatedDeductions: 0,
  qualifiedBusinessIncomeDeduction: false,
};
