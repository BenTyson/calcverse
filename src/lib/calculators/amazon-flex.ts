export interface AmazonFlexInputs {
  blocksPerWeek: number;
  averagePayPerBlock: number;
  milesPerBlock: number;
  averageTipsPerBlock: number;
  hoursPerBlock: number;
  gasPrice: number;
  vehicleMpg: number;
  maintenanceCostPerMile: number;
}

export interface AmazonFlexResults {
  weeklyGross: number;
  weeklyGasCost: number;
  weeklyMaintenance: number;
  weeklyNet: number;
  monthlyNet: number;
  annualNet: number;
  effectiveHourlyRate: number;
  perBlockNet: number;
  weeklyMiles: number;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

const IRS_MILEAGE_RATE = 0.67;

export const DEFAULT_INPUTS: AmazonFlexInputs = {
  blocksPerWeek: 5,
  averagePayPerBlock: 72,
  milesPerBlock: 40,
  averageTipsPerBlock: 5,
  hoursPerBlock: 4,
  gasPrice: 3.50,
  vehicleMpg: 25,
  maintenanceCostPerMile: 0.05,
};

export function calculateAmazonFlex(
  inputs: AmazonFlexInputs
): AmazonFlexResults {
  const weeklyBlockPay = inputs.blocksPerWeek * inputs.averagePayPerBlock;
  const weeklyTips = inputs.blocksPerWeek * inputs.averageTipsPerBlock;
  const weeklyGross = weeklyBlockPay + weeklyTips;

  const weeklyMiles = inputs.blocksPerWeek * inputs.milesPerBlock;
  const gallonsUsed = inputs.vehicleMpg > 0 ? weeklyMiles / inputs.vehicleMpg : 0;
  const weeklyGasCost = gallonsUsed * inputs.gasPrice;

  const weeklyMaintenance = weeklyMiles * inputs.maintenanceCostPerMile;

  const weeklyNet = weeklyGross - weeklyGasCost - weeklyMaintenance;
  const monthlyNet = weeklyNet * 4.33;
  const annualNet = weeklyNet * 52;

  const totalWeeklyHours = inputs.blocksPerWeek * inputs.hoursPerBlock;
  const effectiveHourlyRate = totalWeeklyHours > 0 ? weeklyNet / totalWeeklyHours : 0;

  const perBlockNet = inputs.blocksPerWeek > 0 ? weeklyNet / inputs.blocksPerWeek : 0;

  const irsDeductionValue = weeklyMiles * IRS_MILEAGE_RATE;

  return {
    weeklyGross: Math.round(weeklyGross * 100) / 100,
    weeklyGasCost: Math.round(weeklyGasCost * 100) / 100,
    weeklyMaintenance: Math.round(weeklyMaintenance * 100) / 100,
    weeklyNet: Math.round(weeklyNet * 100) / 100,
    monthlyNet: Math.round(monthlyNet * 100) / 100,
    annualNet: Math.round(annualNet * 100) / 100,
    effectiveHourlyRate: Math.round(effectiveHourlyRate * 100) / 100,
    perBlockNet: Math.round(perBlockNet * 100) / 100,
    weeklyMiles: Math.round(weeklyMiles),
    breakdown: [
      { label: 'Block Pay', amount: Math.round(weeklyBlockPay * 100) / 100 },
      { label: 'Tips', amount: Math.round(weeklyTips * 100) / 100 },
      { label: 'Weekly Gross', amount: Math.round(weeklyGross * 100) / 100 },
      { label: 'Gas Cost', amount: Math.round(weeklyGasCost * 100) / 100, isDeduction: true },
      { label: 'Maintenance', amount: Math.round(weeklyMaintenance * 100) / 100, isDeduction: true },
      { label: 'IRS Mileage Deduction', amount: Math.round(irsDeductionValue * 100) / 100 },
    ],
  };
}
