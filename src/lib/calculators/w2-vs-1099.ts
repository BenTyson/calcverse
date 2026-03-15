import { STANDARD_DEDUCTIONS, calculateFederalTax, FICA_RATES, type FilingStatus } from './shared/tax-brackets';

export interface W2vs1099Inputs {
  // Quick mode
  annualSalary: number; // W2 salary OR 1099 contract rate (annualized)
  filingStatus: FilingStatus;

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

export function calculateW2vs1099(inputs: W2vs1099Inputs): W2vs1099Results {
  const standardDeduction = STANDARD_DEDUCTIONS[inputs.filingStatus];

  // === W2 CALCULATION ===
  const w2Gross = inputs.annualSalary;

  // Pre-tax deductions reduce taxable income
  const w2TaxableIncome = Math.max(0, w2Gross - inputs.retirementContribution - standardDeduction);

  // Social Security & Medicare (employee portion only)
  const w2SocialSecurity = Math.min(w2Gross, FICA_RATES.SOCIAL_SECURITY_WAGE_BASE) * FICA_RATES.SOCIAL_SECURITY_RATE;
  const w2Medicare = w2Gross * FICA_RATES.MEDICARE_RATE;
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
  const selfEmploymentTax = Math.min(seIncomeSubjectToTax, FICA_RATES.SOCIAL_SECURITY_WAGE_BASE) * 0.124 +
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
