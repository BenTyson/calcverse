export interface TuroInputs {
  dailyRentalRate: number;
  daysRentedPerMonth: number;
  turoHostFeePercent: number;
  carPayment: number;
  insurance: number;
  maintenancePerMonth: number;
  cleaningCostPerRental: number;
  depreciationPerMonth: number;
}

export interface TuroResults {
  monthlyGross: number;
  turoFee: number;
  monthlyCleaningCost: number;
  operatingCosts: number;
  totalExpenses: number;
  monthlyNet: number;
  annualNet: number;
  profitMargin: number;
  breakEvenDays: number;
  rentalsPerMonth: number;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

const AVG_RENTAL_LENGTH = 3;

export const DEFAULT_INPUTS: TuroInputs = {
  dailyRentalRate: 60,
  daysRentedPerMonth: 15,
  turoHostFeePercent: 25,
  carPayment: 400,
  insurance: 150,
  maintenancePerMonth: 75,
  cleaningCostPerRental: 20,
  depreciationPerMonth: 100,
};

export function calculateTuroProfit(
  inputs: TuroInputs
): TuroResults {
  const rentalsPerMonth = inputs.daysRentedPerMonth / AVG_RENTAL_LENGTH;
  const monthlyGross = inputs.dailyRentalRate * inputs.daysRentedPerMonth;

  const turoFee = monthlyGross * (inputs.turoHostFeePercent / 100);

  const monthlyCleaningCost = rentalsPerMonth * inputs.cleaningCostPerRental;

  const operatingCosts = inputs.carPayment + inputs.insurance + inputs.maintenancePerMonth + inputs.depreciationPerMonth;

  const totalExpenses = turoFee + monthlyCleaningCost + operatingCosts;

  const monthlyNet = monthlyGross - totalExpenses;
  const annualNet = monthlyNet * 12;

  const profitMargin = monthlyGross > 0 ? (monthlyNet / monthlyGross) * 100 : 0;

  let breakEvenDays = 0;
  for (let days = 1; days <= 31; days++) {
    const testRentals = days / AVG_RENTAL_LENGTH;
    const testGross = inputs.dailyRentalRate * days;
    const testTuroFee = testGross * (inputs.turoHostFeePercent / 100);
    const testCleaning = testRentals * inputs.cleaningCostPerRental;
    const testExpenses = testTuroFee + testCleaning + operatingCosts;
    if (testGross >= testExpenses) {
      breakEvenDays = days;
      break;
    }
  }

  return {
    monthlyGross: Math.round(monthlyGross * 100) / 100,
    turoFee: Math.round(turoFee * 100) / 100,
    monthlyCleaningCost: Math.round(monthlyCleaningCost * 100) / 100,
    operatingCosts: Math.round(operatingCosts * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    monthlyNet: Math.round(monthlyNet * 100) / 100,
    annualNet: Math.round(annualNet * 100) / 100,
    profitMargin: Math.round(profitMargin * 10) / 10,
    breakEvenDays,
    rentalsPerMonth: Math.round(rentalsPerMonth * 10) / 10,
    breakdown: [
      { label: 'Rental Revenue', amount: Math.round(monthlyGross * 100) / 100 },
      { label: 'Turo Fee', amount: Math.round(turoFee * 100) / 100, isDeduction: true },
      { label: 'Cleaning Costs', amount: Math.round(monthlyCleaningCost * 100) / 100, isDeduction: true },
      { label: 'Operating Costs', amount: Math.round(operatingCosts * 100) / 100, isDeduction: true },
    ],
  };
}
