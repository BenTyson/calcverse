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

  // QBI deduction (20% of qualified business income, capped at taxable income)
  const qbiDeduction = inputs.qualifiedBusinessIncomeDeduction
    ? Math.min(netSEIncome * 0.20, Math.max(0, agi))
    : 0;

  const standardDeduction = STANDARD_DEDUCTIONS[inputs.filingStatus];
  const deductions = Math.max(standardDeduction, inputs.estimatedDeductions);
  const taxableIncome = Math.max(0, agi - deductions - qbiDeduction);

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
