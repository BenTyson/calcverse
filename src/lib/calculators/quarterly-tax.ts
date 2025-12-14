// Quarterly Tax Estimator Calculator
// Helps freelancers estimate quarterly estimated tax payments

export interface QuarterlyTaxInputs {
  // Quick mode
  annualIncome: number;
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_household';

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

// 2024 Federal Tax Brackets (simplified)
const TAX_BRACKETS = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  married_joint: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
  married_separate: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 365600, rate: 0.35 },
    { min: 365600, max: Infinity, rate: 0.37 },
  ],
  head_household: [
    { min: 0, max: 16550, rate: 0.10 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
};

// Standard deductions for 2024
const STANDARD_DEDUCTIONS = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_household: 21900,
};

function calculateFederalTax(taxableIncome: number, filingStatus: QuarterlyTaxInputs['filingStatus']): number {
  const brackets = TAX_BRACKETS[filingStatus];
  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return tax;
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
