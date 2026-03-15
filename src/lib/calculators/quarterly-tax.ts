import { STANDARD_DEDUCTIONS, calculateFederalTax, type FilingStatus } from './shared/tax-brackets';

export interface QuarterlyTaxInputs {
  // Quick mode
  annualIncome: number;
  filingStatus: FilingStatus;

  // Advanced mode
  businessExpenses: number;
  selfEmploymentTaxRate: number; // Default 15.3%
  stateTaxRate: number;
  otherIncome: number; // W2, investments, etc.
  estimatedDeductions: number;
  alreadyPaid: number; // Taxes already paid this year
}

export interface QuarterlyTaxResults {
  netSelfEmploymentIncome: number;
  selfEmploymentTax: number;
  federalIncomeTax: number;
  stateTax: number;
  totalAnnualTax: number;
  quarterlyPayment: number;
  remainingQuarterlyPayment: number;
  effectiveTaxRate: number;
  breakdown: {
    label: string;
    value: number;
  }[];
}

export function calculateQuarterlyTax(inputs: QuarterlyTaxInputs): QuarterlyTaxResults {
  // Calculate net self-employment income
  const netSelfEmploymentIncome = Math.max(0, inputs.annualIncome - inputs.businessExpenses);

  // Self-employment tax (Social Security + Medicare)
  // Only 92.35% of net SE income is subject to SE tax
  const seIncomeSubjectToTax = netSelfEmploymentIncome * 0.9235;
  const selfEmploymentTax = seIncomeSubjectToTax * (inputs.selfEmploymentTaxRate / 100);

  // Deductible portion of SE tax (50% is deductible)
  const seDeduction = selfEmploymentTax / 2;

  // Total income for federal tax purposes
  const totalIncome = netSelfEmploymentIncome + inputs.otherIncome;

  // Adjusted Gross Income
  const agi = totalIncome - seDeduction;

  // Use standard deduction or estimated deductions (whichever is higher)
  const standardDeduction = STANDARD_DEDUCTIONS[inputs.filingStatus];
  const deductions = Math.max(standardDeduction, inputs.estimatedDeductions);

  // Taxable income
  const taxableIncome = Math.max(0, agi - deductions);

  // Federal income tax
  const federalIncomeTax = calculateFederalTax(taxableIncome, inputs.filingStatus);

  // State tax (simplified - flat rate on taxable income)
  const stateTax = taxableIncome * (inputs.stateTaxRate / 100);

  // Total annual tax liability
  const totalAnnualTax = selfEmploymentTax + federalIncomeTax + stateTax;

  // Quarterly payment (divide by 4)
  const quarterlyPayment = totalAnnualTax / 4;

  // Remaining quarterly payments (accounting for already paid)
  const remainingTax = Math.max(0, totalAnnualTax - inputs.alreadyPaid);
  // Assume 4 quarters, calculate remaining payments
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
  const remainingQuarters = Math.max(1, 5 - currentQuarter);
  const remainingQuarterlyPayment = remainingTax / remainingQuarters;

  // Effective tax rate
  const effectiveTaxRate = totalIncome > 0 ? (totalAnnualTax / totalIncome) * 100 : 0;

  return {
    netSelfEmploymentIncome,
    selfEmploymentTax,
    federalIncomeTax,
    stateTax,
    totalAnnualTax,
    quarterlyPayment,
    remainingQuarterlyPayment,
    effectiveTaxRate,
    breakdown: [
      { label: 'Self-Employment Tax', value: selfEmploymentTax },
      { label: 'Federal Income Tax', value: federalIncomeTax },
      { label: 'State Tax', value: stateTax },
      { label: 'SE Tax Deduction', value: -seDeduction },
    ],
  };
}

export const DEFAULT_INPUTS: QuarterlyTaxInputs = {
  annualIncome: 75000,
  filingStatus: 'single',
  businessExpenses: 10000,
  selfEmploymentTaxRate: 15.3,
  stateTaxRate: 5,
  otherIncome: 0,
  estimatedDeductions: 0,
  alreadyPaid: 0,
};

export const QUICK_MODE_DEFAULTS: Partial<QuarterlyTaxInputs> = {
  businessExpenses: 10000,
  selfEmploymentTaxRate: 15.3,
  stateTaxRate: 5,
  otherIncome: 0,
  estimatedDeductions: 0,
  alreadyPaid: 0,
};
