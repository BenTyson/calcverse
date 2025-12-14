export interface UberLyftInputs {
  grossWeeklyEarnings: number;
  milesDriven: number;
  hoursWorked: number;
  gasPrice: number;
  vehicleMpg: number;
  maintenanceCostPerMile: number; // oil, tires, repairs
  platform: 'uber' | 'lyft' | 'both';
}

export interface UberLyftResults {
  weeklyGross: number;
  weeklyGasCost: number;
  weeklyMaintenance: number;
  weeklyDepreciation: number;
  totalExpenses: number;
  weeklyNet: number;
  monthlyNet: number;
  annualNet: number;
  effectiveHourlyRate: number;
  costPerMile: number;
  irsMileageDeduction: number;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

// IRS mileage rate 2024: $0.67/mile
const IRS_MILEAGE_RATE = 0.67;

// Average depreciation per mile (varies by vehicle)
const DEPRECIATION_PER_MILE = 0.15;

export const DEFAULT_INPUTS: UberLyftInputs = {
  grossWeeklyEarnings: 800,
  milesDriven: 500,
  hoursWorked: 30,
  gasPrice: 3.50,
  vehicleMpg: 28,
  maintenanceCostPerMile: 0.05,
  platform: 'uber',
};

export function calculateUberLyftEarnings(
  inputs: UberLyftInputs
): UberLyftResults {
  // Calculate gas costs
  const gallonsUsed = inputs.milesDriven / inputs.vehicleMpg;
  const weeklyGasCost = gallonsUsed * inputs.gasPrice;

  // Calculate maintenance costs
  const weeklyMaintenance = inputs.milesDriven * inputs.maintenanceCostPerMile;

  // Calculate depreciation
  const weeklyDepreciation = inputs.milesDriven * DEPRECIATION_PER_MILE;

  // Total expenses
  const totalExpenses = weeklyGasCost + weeklyMaintenance + weeklyDepreciation;

  // Net earnings
  const weeklyNet = inputs.grossWeeklyEarnings - totalExpenses;
  const monthlyNet = weeklyNet * 4.33;
  const annualNet = weeklyNet * 52;

  // Hourly rate
  const effectiveHourlyRate = inputs.hoursWorked > 0
    ? weeklyNet / inputs.hoursWorked
    : 0;

  // Cost per mile
  const costPerMile = inputs.milesDriven > 0
    ? totalExpenses / inputs.milesDriven
    : 0;

  // IRS mileage deduction
  const irsMileageDeduction = inputs.milesDriven * IRS_MILEAGE_RATE;

  return {
    weeklyGross: Math.round(inputs.grossWeeklyEarnings * 100) / 100,
    weeklyGasCost: Math.round(weeklyGasCost * 100) / 100,
    weeklyMaintenance: Math.round(weeklyMaintenance * 100) / 100,
    weeklyDepreciation: Math.round(weeklyDepreciation * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    weeklyNet: Math.round(weeklyNet * 100) / 100,
    monthlyNet: Math.round(monthlyNet * 100) / 100,
    annualNet: Math.round(annualNet * 100) / 100,
    effectiveHourlyRate: Math.round(effectiveHourlyRate * 100) / 100,
    costPerMile: Math.round(costPerMile * 100) / 100,
    irsMileageDeduction: Math.round(irsMileageDeduction * 100) / 100,
    breakdown: [
      { label: 'Weekly Gross', amount: Math.round(inputs.grossWeeklyEarnings * 100) / 100 },
      { label: 'Gas Cost', amount: Math.round(weeklyGasCost * 100) / 100, isDeduction: true },
      { label: 'Maintenance', amount: Math.round(weeklyMaintenance * 100) / 100, isDeduction: true },
      { label: 'Depreciation', amount: Math.round(weeklyDepreciation * 100) / 100, isDeduction: true },
      { label: 'IRS Mileage Deduction', amount: Math.round(irsMileageDeduction * 100) / 100 },
    ],
  };
}
