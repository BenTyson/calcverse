// Instacart Shopper Earnings Calculator
// Estimate earnings for Instacart shoppers

export interface InstacartEarningsInputs {
  // Quick mode
  batchesPerWeek: number;
  averageBatchPay: number; // Base pay + tip

  // Advanced mode
  averageBasePay: number;
  averageTip: number;
  averageItems: number;
  milesPerBatch: number;
  gasPrice: number;
  vehicleMPG: number;
  hoursPerWeek: number;
  peakHoursBonus: number; // Extra during busy times
}

export interface InstacartEarningsResults {
  weeklyBatches: number;
  grossWeeklyEarnings: number;
  basePay: number;
  tips: number;
  peakBonuses: number;
  gasExpenses: number;
  netWeeklyEarnings: number;
  netMonthlyEarnings: number;
  netAnnualEarnings: number;
  effectiveHourlyRate: number;
  earningsPerBatch: number;
  earningsPerMile: number;
  breakdown: {
    label: string;
    value: number;
  }[];
}

export function calculateInstacartEarnings(inputs: InstacartEarningsInputs): InstacartEarningsResults {
  const weeklyBatches = inputs.batchesPerWeek;

  // Calculate earnings
  const basePay = weeklyBatches * inputs.averageBasePay;
  const tips = weeklyBatches * inputs.averageTip;
  const peakBonuses = inputs.peakHoursBonus * 4; // Weekly (assuming some peak hours)

  const grossWeeklyEarnings = basePay + tips + peakBonuses;

  // Calculate expenses
  const weeklyMiles = weeklyBatches * inputs.milesPerBatch;
  const gallonsUsed = weeklyMiles / inputs.vehicleMPG;
  const gasExpenses = gallonsUsed * inputs.gasPrice;

  // Net earnings
  const netWeeklyEarnings = grossWeeklyEarnings - gasExpenses;
  const netMonthlyEarnings = netWeeklyEarnings * 4.33;
  const netAnnualEarnings = netWeeklyEarnings * 52;

  // Rates
  const effectiveHourlyRate = inputs.hoursPerWeek > 0 ? netWeeklyEarnings / inputs.hoursPerWeek : 0;
  const earningsPerBatch = weeklyBatches > 0 ? netWeeklyEarnings / weeklyBatches : 0;
  const earningsPerMile = weeklyMiles > 0 ? netWeeklyEarnings / weeklyMiles : 0;

  return {
    weeklyBatches,
    grossWeeklyEarnings,
    basePay,
    tips,
    peakBonuses,
    gasExpenses,
    netWeeklyEarnings,
    netMonthlyEarnings,
    netAnnualEarnings,
    effectiveHourlyRate,
    earningsPerBatch,
    earningsPerMile,
    breakdown: [
      { label: 'Base Pay', value: basePay },
      { label: 'Tips', value: tips },
      { label: 'Peak Bonuses', value: peakBonuses },
      { label: 'Gas Expenses', value: -gasExpenses },
    ],
  };
}

export const DEFAULT_INPUTS: InstacartEarningsInputs = {
  batchesPerWeek: 25,
  averageBatchPay: 15, // Combined base + tip for quick mode
  averageBasePay: 8,
  averageTip: 7,
  averageItems: 30,
  milesPerBatch: 5,
  gasPrice: 3.50,
  vehicleMPG: 28,
  hoursPerWeek: 25,
  peakHoursBonus: 10,
};

export const QUICK_MODE_DEFAULTS: Partial<InstacartEarningsInputs> = {
  averageBasePay: 8,
  averageTip: 7,
  averageItems: 30,
  milesPerBatch: 5,
  gasPrice: 3.50,
  vehicleMPG: 28,
  hoursPerWeek: 25,
  peakHoursBonus: 0,
};
