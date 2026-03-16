export interface SavingsGoalInputs {
  targetAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  annualInterestRate: number;
  targetMonths: number;
  inflationRate: number;
  irregularIncomeBuffer: number;
}

export interface SavingsGoalResults {
  monthlySavingsNeeded: number;
  totalContributions: number;
  interestEarned: number;
  monthsToGoal: number;
  projectedTotal: number;
  inflationAdjustedTarget: number;
  bufferAdjustedMonthly: number;
  projectionData: { label: string; savings: number }[];
  goalReachable: boolean;
}

export function calculateSavingsGoal(inputs: SavingsGoalInputs): SavingsGoalResults {
  const { targetAmount, currentSavings, monthlyContribution, annualInterestRate, targetMonths, inflationRate, irregularIncomeBuffer } = inputs;

  const monthlyRate = annualInterestRate / 100 / 12;

  // Inflation-adjusted target
  const years = targetMonths / 12;
  const inflationAdjustedTarget = inflationRate > 0
    ? targetAmount * Math.pow(1 + inflationRate / 100, years)
    : targetAmount;

  // Calculate monthly savings needed to hit target in targetMonths
  const amountNeeded = inflationAdjustedTarget - currentSavings * Math.pow(1 + monthlyRate, targetMonths);
  let monthlySavingsNeeded: number;
  if (monthlyRate > 0) {
    const factor = (Math.pow(1 + monthlyRate, targetMonths) - 1) / monthlyRate;
    monthlySavingsNeeded = factor > 0 ? Math.max(0, amountNeeded / factor) : 0;
  } else {
    monthlySavingsNeeded = targetMonths > 0 ? Math.max(0, amountNeeded / targetMonths) : 0;
  }

  monthlySavingsNeeded = Math.round(monthlySavingsNeeded * 100) / 100;

  // Apply irregular income buffer
  const bufferMultiplier = 1 + irregularIncomeBuffer / 100;
  const bufferAdjustedMonthly = Math.round(monthlySavingsNeeded * bufferMultiplier * 100) / 100;

  // Calculate months to goal with current contribution
  let monthsToGoal = 0;
  let balance = currentSavings;
  const effectiveMonthly = monthlyContribution > 0 ? monthlyContribution : monthlySavingsNeeded;
  const MAX_MONTHS = 600; // 50 years cap

  if (currentSavings >= targetAmount) {
    monthsToGoal = 0;
  } else if (effectiveMonthly <= 0 && monthlyRate <= 0) {
    monthsToGoal = MAX_MONTHS;
  } else {
    balance = currentSavings;
    while (balance < inflationAdjustedTarget && monthsToGoal < MAX_MONTHS) {
      monthsToGoal++;
      balance = balance * (1 + monthlyRate) + effectiveMonthly;
    }
  }

  // Build projection data
  const projectionData: { label: string; savings: number }[] = [];
  balance = currentSavings;
  const displayMonths = Math.min(Math.max(targetMonths, monthsToGoal), MAX_MONTHS);
  const step = Math.max(1, Math.floor(displayMonths / 40));

  for (let m = 0; m <= displayMonths; m += step) {
    if (m === 0) {
      projectionData.push({ label: 'Now', savings: Math.round(balance) });
      continue;
    }
    // Compute balance at month m
    let bal = currentSavings;
    for (let i = 0; i < m; i++) {
      bal = bal * (1 + monthlyRate) + effectiveMonthly;
    }
    const yearLabel = m >= 12 ? `${(m / 12).toFixed(1)}yr` : `${m}mo`;
    projectionData.push({ label: yearLabel, savings: Math.round(bal) });
  }

  // Ensure final month is included
  if (displayMonths > 0) {
    let finalBal = currentSavings;
    for (let i = 0; i < displayMonths; i++) {
      finalBal = finalBal * (1 + monthlyRate) + effectiveMonthly;
    }
    const lastLabel = displayMonths >= 12 ? `${(displayMonths / 12).toFixed(1)}yr` : `${displayMonths}mo`;
    const lastEntry = projectionData[projectionData.length - 1];
    if (lastEntry.label !== lastLabel) {
      projectionData.push({ label: lastLabel, savings: Math.round(finalBal) });
    }
  }

  // Total contributions and interest
  const totalContributions = effectiveMonthly * Math.min(monthsToGoal, targetMonths);
  let finalBalance = currentSavings;
  for (let i = 0; i < Math.min(monthsToGoal, targetMonths); i++) {
    finalBalance = finalBalance * (1 + monthlyRate) + effectiveMonthly;
  }
  const interestEarned = Math.max(0, finalBalance - currentSavings - totalContributions);
  const goalReachable = monthsToGoal <= targetMonths || currentSavings >= targetAmount;

  return {
    monthlySavingsNeeded,
    totalContributions: Math.round(totalContributions),
    interestEarned: Math.round(interestEarned),
    monthsToGoal: Math.min(monthsToGoal, MAX_MONTHS),
    projectedTotal: Math.round(finalBalance),
    inflationAdjustedTarget: Math.round(inflationAdjustedTarget),
    bufferAdjustedMonthly,
    projectionData,
    goalReachable,
  };
}

export const DEFAULT_INPUTS: SavingsGoalInputs = {
  targetAmount: 25000,
  currentSavings: 3000,
  monthlyContribution: 500,
  annualInterestRate: 5,
  targetMonths: 36,
  inflationRate: 0,
  irregularIncomeBuffer: 0,
};

export const QUICK_MODE_DEFAULTS: Partial<SavingsGoalInputs> = {
  inflationRate: 0,
  irregularIncomeBuffer: 0,
};
