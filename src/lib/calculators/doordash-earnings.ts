export interface DoorDashInputs {
  deliveriesPerWeek: number;
  averageTip: number;
  basePayPerDelivery: number;
  milesPerDelivery: number;
  gasPrice: number;
  vehicleMpg: number;
  activeHoursPerWeek: number;
}

export interface DoorDashResults {
  weeklyGross: number;
  weeklyGasCost: number;
  weeklyMiles: number;
  weeklyNet: number;
  monthlyNet: number;
  annualNet: number;
  earningsPerDelivery: number;
  effectiveHourlyRate: number;
  costPerMile: number;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

// IRS standard mileage rate for 2024: $0.67/mile
// This covers gas, maintenance, depreciation, insurance
const IRS_MILEAGE_RATE = 0.67;

export const DEFAULT_INPUTS: DoorDashInputs = {
  deliveriesPerWeek: 30,
  averageTip: 4,
  basePayPerDelivery: 3,
  milesPerDelivery: 5,
  gasPrice: 3.50,
  vehicleMpg: 25,
  activeHoursPerWeek: 15,
};

export function calculateDoorDashEarnings(
  inputs: DoorDashInputs
): DoorDashResults {
  // Calculate weekly gross earnings
  const earningsPerDelivery = inputs.basePayPerDelivery + inputs.averageTip;
  const weeklyGross = inputs.deliveriesPerWeek * earningsPerDelivery;

  // Calculate gas costs
  const weeklyMiles = inputs.deliveriesPerWeek * inputs.milesPerDelivery;
  const gallonsUsed = weeklyMiles / inputs.vehicleMpg;
  const weeklyGasCost = gallonsUsed * inputs.gasPrice;

  // For simplicity, using gas cost only (not full IRS mileage rate)
  // Users can see the IRS deduction separately
  const weeklyNet = weeklyGross - weeklyGasCost;
  const monthlyNet = weeklyNet * 4.33; // Average weeks per month
  const annualNet = weeklyNet * 52;

  // Calculate hourly rate
  const effectiveHourlyRate = inputs.activeHoursPerWeek > 0
    ? weeklyNet / inputs.activeHoursPerWeek
    : 0;

  // Cost per mile (gas only)
  const costPerMile = inputs.vehicleMpg > 0
    ? inputs.gasPrice / inputs.vehicleMpg
    : 0;

  // IRS mileage deduction value (for tax purposes)
  const irsDeductionValue = weeklyMiles * IRS_MILEAGE_RATE;

  return {
    weeklyGross: Math.round(weeklyGross * 100) / 100,
    weeklyGasCost: Math.round(weeklyGasCost * 100) / 100,
    weeklyMiles: Math.round(weeklyMiles),
    weeklyNet: Math.round(weeklyNet * 100) / 100,
    monthlyNet: Math.round(monthlyNet * 100) / 100,
    annualNet: Math.round(annualNet * 100) / 100,
    earningsPerDelivery: Math.round(earningsPerDelivery * 100) / 100,
    effectiveHourlyRate: Math.round(effectiveHourlyRate * 100) / 100,
    costPerMile: Math.round(costPerMile * 100) / 100,
    breakdown: [
      { label: 'Base Pay', amount: Math.round(inputs.deliveriesPerWeek * inputs.basePayPerDelivery * 100) / 100 },
      { label: 'Tips', amount: Math.round(inputs.deliveriesPerWeek * inputs.averageTip * 100) / 100 },
      { label: 'Weekly Gross', amount: Math.round(weeklyGross * 100) / 100 },
      { label: 'Gas Cost', amount: Math.round(weeklyGasCost * 100) / 100, isDeduction: true },
      { label: 'IRS Mileage Deduction', amount: Math.round(irsDeductionValue * 100) / 100 },
    ],
  };
}
