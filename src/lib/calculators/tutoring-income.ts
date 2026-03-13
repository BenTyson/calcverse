export interface TutoringIncomeInputs {
  hourlyRate: number;
  hoursPerWeek: number;
  platform: string;
  studentsPerWeek: number;
  platformFeePercent: number;
  prepTimeRatio: number;
  travelCostPerSession: number;
  materialsCostPerMonth: number;
  cancellationRatePercent: number;
}

export interface TutoringIncomeResults {
  weeklyGross: number;
  weeklyNet: number;
  monthlyNet: number;
  effectiveHourlyRate: number;
  annualProjection: number;
  platformFees: number;
  travelCosts: number;
  materialsCosts: number;
  cancellationLoss: number;
  totalWeeklyHours: number;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

export const TUTORING_PLATFORMS = [
  { value: 'independent', label: 'Independent' },
  { value: 'wyzant', label: 'Wyzant' },
  { value: 'varsity-tutors', label: 'Varsity Tutors' },
  { value: 'tutor-com', label: 'Tutor.com' },
];

export const PLATFORM_PRESETS: Record<string, { platformFee: number }> = {
  independent: { platformFee: 0 },
  wyzant: { platformFee: 25 },
  'varsity-tutors': { platformFee: 25 },
  'tutor-com': { platformFee: 20 },
};

export const DEFAULT_INPUTS: TutoringIncomeInputs = {
  hourlyRate: 50,
  hoursPerWeek: 10,
  platform: 'independent',
  studentsPerWeek: 5,
  platformFeePercent: 0,
  prepTimeRatio: 10,
  travelCostPerSession: 0,
  materialsCostPerMonth: 30,
  cancellationRatePercent: 5,
};

export function calculateTutoringIncome(
  inputs: TutoringIncomeInputs
): TutoringIncomeResults {
  const weeklyGross = inputs.hourlyRate * inputs.hoursPerWeek;

  const cancellationLoss = weeklyGross * (inputs.cancellationRatePercent / 100);
  const adjustedGross = weeklyGross - cancellationLoss;

  const platformFees = adjustedGross * (inputs.platformFeePercent / 100);
  const travelCosts = inputs.travelCostPerSession * inputs.studentsPerWeek;
  const materialsCosts = inputs.materialsCostPerMonth / 4.33;

  const weeklyNet = adjustedGross - platformFees - travelCosts - materialsCosts;
  const monthlyNet = weeklyNet * 4.33;
  const annualProjection = weeklyNet * 52;

  const prepHoursPerWeek = inputs.hoursPerWeek * (inputs.prepTimeRatio / 60);
  const totalWeeklyHours = inputs.hoursPerWeek + prepHoursPerWeek;
  const effectiveHourlyRate = totalWeeklyHours > 0 ? weeklyNet / totalWeeklyHours : 0;

  return {
    weeklyGross: Math.round(weeklyGross * 100) / 100,
    weeklyNet: Math.round(weeklyNet * 100) / 100,
    monthlyNet: Math.round(monthlyNet * 100) / 100,
    effectiveHourlyRate: Math.round(effectiveHourlyRate * 100) / 100,
    annualProjection: Math.round(annualProjection * 100) / 100,
    platformFees: Math.round(platformFees * 100) / 100,
    travelCosts: Math.round(travelCosts * 100) / 100,
    materialsCosts: Math.round(materialsCosts * 100) / 100,
    cancellationLoss: Math.round(cancellationLoss * 100) / 100,
    totalWeeklyHours: Math.round(totalWeeklyHours * 10) / 10,
    breakdown: [
      { label: 'Tutoring Earnings', amount: Math.round(weeklyGross * 100) / 100 },
      { label: 'Cancellation Adjustment', amount: Math.round(cancellationLoss * 100) / 100, isDeduction: true },
      { label: 'Platform Fee', amount: Math.round(platformFees * 100) / 100, isDeduction: true },
      { label: 'Travel Costs', amount: Math.round(travelCosts * 100) / 100, isDeduction: true },
      { label: 'Materials', amount: Math.round(materialsCosts * 100) / 100, isDeduction: true },
    ],
  };
}
