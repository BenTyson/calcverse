export type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_household';

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

// 2024 Federal Tax Brackets
export const TAX_BRACKETS: Record<FilingStatus, TaxBracket[]> = {
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

export const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_household: 21900,
};

// 2024 Long-Term Capital Gains Tax Brackets
export const LONG_TERM_CG_BRACKETS: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { min: 0, max: 47025, rate: 0 },
    { min: 47025, max: 518900, rate: 0.15 },
    { min: 518900, max: Infinity, rate: 0.20 },
  ],
  married_joint: [
    { min: 0, max: 94050, rate: 0 },
    { min: 94050, max: 583750, rate: 0.15 },
    { min: 583750, max: Infinity, rate: 0.20 },
  ],
  married_separate: [
    { min: 0, max: 47025, rate: 0 },
    { min: 47025, max: 291850, rate: 0.15 },
    { min: 291850, max: Infinity, rate: 0.20 },
  ],
  head_household: [
    { min: 0, max: 63000, rate: 0 },
    { min: 63000, max: 551350, rate: 0.15 },
    { min: 551350, max: Infinity, rate: 0.20 },
  ],
};

export const NIIT_RATE = 0.038;

export const NIIT_THRESHOLDS: Record<FilingStatus, number> = {
  single: 200000,
  married_joint: 250000,
  married_separate: 125000,
  head_household: 200000,
};

export function calculateCapitalGainsTax(
  gainAmount: number,
  ordinaryTaxableIncome: number,
  filingStatus: FilingStatus
): number {
  const brackets = LONG_TERM_CG_BRACKETS[filingStatus];
  let tax = 0;
  let gainsRemaining = Math.max(0, gainAmount);

  // Gains "stack" on top of ordinary income in the bracket structure
  let incomeFloor = Math.max(0, ordinaryTaxableIncome);

  for (const bracket of brackets) {
    if (gainsRemaining <= 0) break;

    // How much room is left in this bracket above ordinary income?
    const bracketTop = bracket.max;
    const bracketBottom = Math.max(bracket.min, incomeFloor);

    if (bracketBottom >= bracketTop) continue;

    const room = bracketTop - bracketBottom;
    const taxableInBracket = Math.min(gainsRemaining, room);
    tax += taxableInBracket * bracket.rate;
    gainsRemaining -= taxableInBracket;
    incomeFloor = bracketBottom + taxableInBracket;
  }

  return tax;
}

export const FICA_RATES = {
  SOCIAL_SECURITY_RATE: 0.062,
  MEDICARE_RATE: 0.0145,
  SELF_EMPLOYMENT_TAX_RATE: 0.153,
  SOCIAL_SECURITY_WAGE_BASE: 168600,
  ADDITIONAL_MEDICARE_RATE: 0.009,
  ADDITIONAL_MEDICARE_THRESHOLD: {
    single: 200000,
    married_joint: 250000,
    married_separate: 125000,
    head_household: 200000,
  } as Record<FilingStatus, number>,
} as const;

export function calculateFederalTax(taxableIncome: number, filingStatus: FilingStatus): number {
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

export function getMarginalBracket(taxableIncome: number, filingStatus: FilingStatus): number {
  const brackets = TAX_BRACKETS[filingStatus];
  let marginalRate = 0.10;

  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) {
      marginalRate = bracket.rate;
    }
  }

  return marginalRate;
}

export function calculateSelfEmploymentTax(
  netSEIncome: number,
  filingStatus: FilingStatus = 'single'
): {
  socialSecurityTax: number;
  medicareTax: number;
  additionalMedicareTax: number;
  totalSETax: number;
  seDeduction: number;
} {
  const seIncomeSubjectToTax = netSEIncome * 0.9235;

  const socialSecurityTax =
    Math.min(seIncomeSubjectToTax, FICA_RATES.SOCIAL_SECURITY_WAGE_BASE) * 0.124;
  const medicareTax = seIncomeSubjectToTax * 0.029;

  const threshold = FICA_RATES.ADDITIONAL_MEDICARE_THRESHOLD[filingStatus];
  const additionalMedicareTax =
    seIncomeSubjectToTax > threshold
      ? (seIncomeSubjectToTax - threshold) * FICA_RATES.ADDITIONAL_MEDICARE_RATE
      : 0;

  const totalSETax = socialSecurityTax + medicareTax + additionalMedicareTax;
  const seDeduction = totalSETax / 2;

  return { socialSecurityTax, medicareTax, additionalMedicareTax, totalSETax, seDeduction };
}
