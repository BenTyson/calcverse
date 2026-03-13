export interface FreelanceRetirementInputs {
  annualIncome: number;
  annualContribution: number;
  currentSavings: number;
  accountType: 'solo_401k' | 'sep_ira' | 'traditional_ira' | 'roth_ira';
  currentAge: number;
  retirementAge: number;
  expectedReturn: number;
  taxBracket: number;
}

export interface AccountComparison {
  type: string;
  maxContribution: number;
  taxSavings: number;
  projectedBalance: number;
}

export interface FreelanceRetirementResults {
  maxContribution: number;
  effectiveContribution: number;
  annualTaxSavings: number;
  projectedBalance: number;
  totalContributions: number;
  totalGrowth: number;
  yearsToRetirement: number;
  effectiveContributionRate: number;
  accountComparison: AccountComparison[];
  breakdown: { label: string; amount: number; isDeduction?: boolean }[];
}

export const ACCOUNT_TYPE_OPTIONS = [
  { value: 'solo_401k', label: 'Solo 401(k)' },
  { value: 'sep_ira', label: 'SEP-IRA' },
  { value: 'traditional_ira', label: 'Traditional IRA' },
  { value: 'roth_ira', label: 'Roth IRA' },
];

// 2024 contribution limits
const SOLO_401K_EMPLOYEE_LIMIT = 23500;
const SOLO_401K_TOTAL_LIMIT = 69000;
const SOLO_401K_CATCHUP = 7500;
const SEP_IRA_LIMIT = 69000;
const IRA_LIMIT = 7000;
const IRA_CATCHUP = 1000;
const CATCHUP_AGE = 50;

function getMaxContribution(
  accountType: FreelanceRetirementInputs['accountType'],
  netSeIncome: number,
  age: number
): number {
  const isCatchUp = age >= CATCHUP_AGE;

  switch (accountType) {
    case 'solo_401k': {
      const employeeLimit = SOLO_401K_EMPLOYEE_LIMIT + (isCatchUp ? SOLO_401K_CATCHUP : 0);
      const employerLimit = netSeIncome * 0.25;
      return Math.min(employeeLimit + employerLimit, SOLO_401K_TOTAL_LIMIT + (isCatchUp ? SOLO_401K_CATCHUP : 0));
    }
    case 'sep_ira':
      return Math.min(netSeIncome * 0.25, SEP_IRA_LIMIT);
    case 'traditional_ira':
    case 'roth_ira':
      return IRA_LIMIT + (isCatchUp ? IRA_CATCHUP : 0);
  }
}

function projectBalance(
  currentSavings: number,
  annualContribution: number,
  years: number,
  annualReturn: number
): number {
  const r = annualReturn / 100;
  if (r === 0) return currentSavings + annualContribution * years;
  const growthFactor = Math.pow(1 + r, years);
  return currentSavings * growthFactor + annualContribution * ((growthFactor - 1) / r);
}

export function calculateFreelanceRetirement(inputs: FreelanceRetirementInputs): FreelanceRetirementResults {
  const netSeIncome = inputs.annualIncome * 0.9235;
  const yearsToRetirement = Math.max(0, inputs.retirementAge - inputs.currentAge);

  const maxContribution = getMaxContribution(inputs.accountType, netSeIncome, inputs.currentAge);
  const effectiveContribution = Math.min(inputs.annualContribution, maxContribution);

  const isDeductible = inputs.accountType !== 'roth_ira';
  const annualTaxSavings = isDeductible
    ? Math.round(effectiveContribution * (inputs.taxBracket / 100) * 100) / 100
    : 0;

  const projectedBalance = Math.round(
    projectBalance(inputs.currentSavings, effectiveContribution, yearsToRetirement, inputs.expectedReturn)
  );
  const totalContributions = inputs.currentSavings + effectiveContribution * yearsToRetirement;
  const totalGrowth = projectedBalance - totalContributions;
  const effectiveContributionRate =
    inputs.annualIncome > 0
      ? Math.round((effectiveContribution / inputs.annualIncome) * 1000) / 10
      : 0;

  const accountTypes: FreelanceRetirementInputs['accountType'][] = [
    'solo_401k',
    'sep_ira',
    'traditional_ira',
    'roth_ira',
  ];

  const accountComparison: AccountComparison[] = accountTypes.map((type) => {
    const max = getMaxContribution(type, netSeIncome, inputs.currentAge);
    const contrib = Math.min(inputs.annualContribution, max);
    const deductible = type !== 'roth_ira';
    const taxSav = deductible ? Math.round(contrib * (inputs.taxBracket / 100) * 100) / 100 : 0;
    const projected = Math.round(
      projectBalance(inputs.currentSavings, contrib, yearsToRetirement, inputs.expectedReturn)
    );
    const label = ACCOUNT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
    return { type: label, maxContribution: Math.round(max), taxSavings: taxSav, projectedBalance: projected };
  });

  return {
    maxContribution: Math.round(maxContribution),
    effectiveContribution: Math.round(effectiveContribution * 100) / 100,
    annualTaxSavings,
    projectedBalance,
    totalContributions: Math.round(totalContributions),
    totalGrowth: Math.round(totalGrowth),
    yearsToRetirement,
    effectiveContributionRate,
    accountComparison,
    breakdown: [
      { label: 'Current Savings', amount: inputs.currentSavings },
      { label: 'Annual Contribution', amount: effectiveContribution },
      { label: 'Max Allowed Contribution', amount: Math.round(maxContribution) },
      { label: 'Annual Tax Savings', amount: annualTaxSavings },
      { label: 'Total Contributions', amount: Math.round(totalContributions) },
      { label: 'Investment Growth', amount: Math.round(totalGrowth) },
    ],
  };
}

export const DEFAULT_INPUTS: FreelanceRetirementInputs = {
  annualIncome: 75000,
  annualContribution: 10000,
  currentSavings: 25000,
  accountType: 'solo_401k',
  currentAge: 35,
  retirementAge: 65,
  expectedReturn: 7,
  taxBracket: 22,
};

export const QUICK_MODE_DEFAULTS: Partial<FreelanceRetirementInputs> = {
  accountType: 'solo_401k',
  currentAge: 35,
  retirementAge: 65,
  expectedReturn: 7,
  taxBracket: 22,
};
