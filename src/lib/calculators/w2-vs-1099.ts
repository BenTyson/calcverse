// W2 vs 1099 Comparison Calculator
// Compare take-home pay between W2 employment and 1099 contractor work

export interface W2vs1099Inputs {
  // Quick mode
  annualSalary: number; // W2 salary OR 1099 contract rate (annualized)
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_household';

  // Advanced mode
  employerBenefitsValue: number; // Health insurance, 401k match, etc.
  businessExpenses1099: number;
  stateTaxRate: number;
  retirementContribution: number; // Pre-tax 401k for W2
  healthInsuranceCost1099: number; // What you'd pay as contractor
}

export interface W2vs1099Results {
  w2: {
    grossIncome: number;
    federalTax: number;
    stateTax: number;
    socialSecurityMedicare: number;
    retirement: number;
    netIncome: number;
    totalBenefitsValue: number;
    effectiveTaxRate: number;
  };
  contractor: {
    grossIncome: number;
    businessExpenses: number;
    selfEmploymentTax: number;
    federalTax: number;
    stateTax: number;
    healthInsurance: number;
    netIncome: number;
    effectiveTaxRate: number;
  };
  difference: number;
  breakEvenRate: number;
  recommendation: string;
}

// 2024 Federal Tax Brackets (simplified - single)
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

const STANDARD_DEDUCTIONS = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_household: 21900,
};

// FICA rates
const SOCIAL_SECURITY_RATE = 0.062; // Employee portion
const MEDICARE_RATE = 0.0145; // Employee portion
const SELF_EMPLOYMENT_TAX_RATE = 0.153; // Full 15.3%
const SOCIAL_SECURITY_WAGE_BASE = 168600; // 2024

function calculateFederalTax(taxableIncome: number, filingStatus: W2vs1099Inputs['filingStatus']): number {
  const brackets = TAX_BRACKETS[filingStatus];
  let tax = 0;
  let remainingIncome = Math.max(0, taxableIncome);

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return tax;
}

export function calculateW2vs1099(inputs: W2vs1099Inputs): W2vs1099Results {
  const standardDeduction = STANDARD_DEDUCTIONS[inputs.filingStatus];

  // === W2 CALCULATION ===
  const w2Gross = inputs.annualSalary;

  // Pre-tax deductions reduce taxable income
  const w2TaxableIncome = Math.max(0, w2Gross - inputs.retirementContribution - standardDeduction);

  // Social Security & Medicare (employee portion only)
  const w2SocialSecurity = Math.min(w2Gross, SOCIAL_SECURITY_WAGE_BASE) * SOCIAL_SECURITY_RATE;
  const w2Medicare = w2Gross * MEDICARE_RATE;
  const w2FICA = w2SocialSecurity + w2Medicare;

  // Federal and state income tax
  const w2FederalTax = calculateFederalTax(w2TaxableIncome, inputs.filingStatus);
  const w2StateTax = w2TaxableIncome * (inputs.stateTaxRate / 100);

  // Net income (salary - all taxes - retirement contribution)
  const w2NetIncome = w2Gross - w2FederalTax - w2StateTax - w2FICA - inputs.retirementContribution;
  const w2EffectiveTaxRate = ((w2Gross - w2NetIncome) / w2Gross) * 100;

  // === 1099 CALCULATION ===
  const contractorGross = inputs.annualSalary;

  // Business expenses reduce taxable income
  const netSelfEmploymentIncome = Math.max(0, contractorGross - inputs.businessExpenses1099);

  // Self-employment tax (on 92.35% of net SE income)
  const seIncomeSubjectToTax = netSelfEmploymentIncome * 0.9235;
  const selfEmploymentTax = Math.min(seIncomeSubjectToTax, SOCIAL_SECURITY_WAGE_BASE) * 0.124 +
    seIncomeSubjectToTax * 0.029; // SS (12.4%) + Medicare (2.9%)

  // Deductible portion of SE tax
  const seDeduction = selfEmploymentTax / 2;

  // Health insurance deduction (self-employed can deduct this)
  const healthDeduction = inputs.healthInsuranceCost1099;

  // Taxable income
  const contractorAGI = netSelfEmploymentIncome - seDeduction - healthDeduction;
  const contractorTaxableIncome = Math.max(0, contractorAGI - standardDeduction);

  // Federal and state taxes
  const contractorFederalTax = calculateFederalTax(contractorTaxableIncome, inputs.filingStatus);
  const contractorStateTax = contractorTaxableIncome * (inputs.stateTaxRate / 100);

  // Net income
  const contractorNetIncome = contractorGross -
    inputs.businessExpenses1099 -
    selfEmploymentTax -
    contractorFederalTax -
    contractorStateTax -
    inputs.healthInsuranceCost1099;

  const contractorEffectiveTaxRate = ((contractorGross - contractorNetIncome) / contractorGross) * 100;

  // === COMPARISON ===
  // Add benefits value to W2 for true comparison
  const w2TotalValue = w2NetIncome + inputs.employerBenefitsValue;
  const difference = contractorNetIncome - w2TotalValue;

  // Calculate break-even rate (what 1099 rate equals W2 total value)
  // This is approximate - solving for the rate that yields same net income
  const breakEvenMultiplier = w2TotalValue / (contractorNetIncome || 1);
  const breakEvenRate = inputs.annualSalary * (breakEvenMultiplier > 0 ? breakEvenMultiplier : 1.3);

  // Generate recommendation
  let recommendation: string;
  if (difference > 5000) {
    recommendation = '1099 contractor work comes out ahead by a significant margin at this rate.';
  } else if (difference > 0) {
    recommendation = '1099 is slightly better, but W2 benefits like job security and employer contributions may offset the difference.';
  } else if (difference > -5000) {
    recommendation = 'W2 employment is slightly better when accounting for benefits. Consider the value of stability and employer-provided insurance.';
  } else {
    recommendation = 'W2 employment provides better total compensation at these rates. You\'d need a higher contractor rate to match.';
  }

  return {
    w2: {
      grossIncome: w2Gross,
      federalTax: w2FederalTax,
      stateTax: w2StateTax,
      socialSecurityMedicare: w2FICA,
      retirement: inputs.retirementContribution,
      netIncome: w2NetIncome,
      totalBenefitsValue: inputs.employerBenefitsValue,
      effectiveTaxRate: w2EffectiveTaxRate,
    },
    contractor: {
      grossIncome: contractorGross,
      businessExpenses: inputs.businessExpenses1099,
      selfEmploymentTax,
      federalTax: contractorFederalTax,
      stateTax: contractorStateTax,
      healthInsurance: inputs.healthInsuranceCost1099,
      netIncome: contractorNetIncome,
      effectiveTaxRate: contractorEffectiveTaxRate,
    },
    difference,
    breakEvenRate,
    recommendation,
  };
}

export const DEFAULT_INPUTS: W2vs1099Inputs = {
  annualSalary: 100000,
  filingStatus: 'single',
  employerBenefitsValue: 15000, // Health insurance + 401k match
  businessExpenses1099: 5000,
  stateTaxRate: 5,
  retirementContribution: 6000,
  healthInsuranceCost1099: 6000, // ~$500/month
};

export const QUICK_MODE_DEFAULTS: Partial<W2vs1099Inputs> = {
  employerBenefitsValue: 15000,
  businessExpenses1099: 5000,
  stateTaxRate: 5,
  retirementContribution: 6000,
  healthInsuranceCost1099: 6000,
};
