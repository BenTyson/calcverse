export type IncomeStability = 'stable' | 'moderate' | 'variable' | 'freelance';

export interface EmergencyFundInputs {
  monthlyExpenses: number;
  currentFund: number;
  monthlySavings: number;
  incomeStability: IncomeStability;
  dependents: number;
  hasPartnerIncome: boolean;
}

export interface EmergencyFundResults {
  recommendedMonths: number;
  targetAmount: number;
  currentGap: number;
  monthsToGoal: number;
  percentComplete: number;
}

const STABILITY_MONTHS: Record<IncomeStability, number> = {
  stable: 3,
  moderate: 4,
  variable: 6,
  freelance: 9,
};

export const DEFAULT_INPUTS: EmergencyFundInputs = {
  monthlyExpenses: 3500,
  currentFund: 2000,
  monthlySavings: 500,
  incomeStability: 'moderate',
  dependents: 0,
  hasPartnerIncome: false,
};

export function calculateEmergencyFund(
  inputs: EmergencyFundInputs
): EmergencyFundResults {
  let recommendedMonths = STABILITY_MONTHS[inputs.incomeStability];

  // Add 1 month per dependent (up to 3 extra)
  recommendedMonths += Math.min(inputs.dependents, 3);

  // Reduce by 1 if partner has income (minimum 3 months)
  if (inputs.hasPartnerIncome) {
    recommendedMonths = Math.max(3, recommendedMonths - 1);
  }

  const targetAmount = inputs.monthlyExpenses * recommendedMonths;
  const currentGap = Math.max(0, targetAmount - inputs.currentFund);
  const monthsToGoal =
    inputs.monthlySavings > 0 ? Math.ceil(currentGap / inputs.monthlySavings) : 0;
  const percentComplete = targetAmount > 0
    ? Math.min(100, Math.round((inputs.currentFund / targetAmount) * 100))
    : 100;

  return {
    recommendedMonths,
    targetAmount,
    currentGap,
    monthsToGoal,
    percentComplete,
  };
}
