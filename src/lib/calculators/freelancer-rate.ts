export interface FreelancerRateInputs {
  desiredAnnualIncome: number;
  annualBusinessExpenses: number;
  selfEmploymentTaxRate: number;
  effectiveTaxRate: number;
  billableHoursPerWeek: number;
  weeksWorkedPerYear: number;
  profitMargin: number;
}

export interface FreelancerRateResults {
  hourlyRate: number;
  dailyRate: number;
  monthlyRevenue: number;
  annualRevenue: number;
  totalTaxes: number;
  effectiveHourlyAfterTax: number;
  breakdown: {
    label: string;
    amount: number;
  }[];
}

export const DEFAULT_INPUTS: FreelancerRateInputs = {
  desiredAnnualIncome: 80000,
  annualBusinessExpenses: 5000,
  selfEmploymentTaxRate: 15.3,
  effectiveTaxRate: 22,
  billableHoursPerWeek: 30,
  weeksWorkedPerYear: 48,
  profitMargin: 20,
};

export function calculateFreelancerRate(
  inputs: FreelancerRateInputs
): FreelancerRateResults {
  // Step 1: Calculate total annual billable hours
  const totalBillableHours =
    inputs.billableHoursPerWeek * inputs.weeksWorkedPerYear;

  // Step 2: Calculate gross income needed (before taxes)
  const combinedTaxRate =
    (inputs.selfEmploymentTaxRate + inputs.effectiveTaxRate) / 100;
  const incomeBeforeTaxes = inputs.desiredAnnualIncome / (1 - combinedTaxRate);

  // Step 3: Add expenses and profit margin
  const totalWithExpenses = incomeBeforeTaxes + inputs.annualBusinessExpenses;
  const profitMultiplier = 1 / (1 - inputs.profitMargin / 100);
  const totalWithProfit = totalWithExpenses * profitMultiplier;

  // Step 4: Calculate hourly rate
  const hourlyRate = totalWithProfit / totalBillableHours;

  // Calculate other metrics
  const seTax = incomeBeforeTaxes * (inputs.selfEmploymentTaxRate / 100);
  const incomeTax = incomeBeforeTaxes * (inputs.effectiveTaxRate / 100);
  const totalTaxes = seTax + incomeTax;
  const effectiveHourlyAfterTax = inputs.desiredAnnualIncome / totalBillableHours;
  const profitAmount =
    totalWithExpenses * (inputs.profitMargin / 100) * profitMultiplier;

  return {
    hourlyRate: Math.ceil(hourlyRate),
    dailyRate: Math.ceil(hourlyRate * 8),
    monthlyRevenue: Math.ceil(totalWithProfit / 12),
    annualRevenue: Math.ceil(totalWithProfit),
    totalTaxes: Math.ceil(totalTaxes),
    effectiveHourlyAfterTax: Math.round(effectiveHourlyAfterTax),
    breakdown: [
      { label: 'Target Take-Home', amount: inputs.desiredAnnualIncome },
      { label: 'Self-Employment Tax', amount: Math.ceil(seTax) },
      { label: 'Income Tax', amount: Math.ceil(incomeTax) },
      { label: 'Business Expenses', amount: inputs.annualBusinessExpenses },
      { label: 'Profit Margin', amount: Math.ceil(profitAmount) },
    ],
  };
}
