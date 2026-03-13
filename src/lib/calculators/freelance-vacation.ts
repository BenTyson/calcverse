export interface FreelanceVacationInputs {
  monthlyIncome: number;
  vacationDays: number;
  dailyTravelBudget: number;
  workDaysPerWeek: number;
  catchUpDays: number;
  healthInsuranceCost: number;
  otherFixedCosts: number;
  savingsBuffer: number;
  vacationsPerYear: number;
}

export interface FreelanceVacationResults {
  dailyRate: number;
  lostIncomePerYear: number;
  travelCostsPerYear: number;
  fixedCostsDuringVacation: number;
  catchUpCost: number;
  totalVacationCost: number;
  totalWithBuffer: number;
  monthlySavingsNeeded: number;
  perVacationCost: number;
  costPerVacationDay: number;
  breakdown: { label: string; amount: number; isDeduction?: boolean }[];
}

export function calculateFreelanceVacation(inputs: FreelanceVacationInputs): FreelanceVacationResults {
  const annualIncome = inputs.monthlyIncome * 12;
  const workDaysPerYear = inputs.workDaysPerWeek * 52;
  const dailyRate = workDaysPerYear > 0 ? annualIncome / workDaysPerYear : 0;

  const lostIncomePerYear = dailyRate * inputs.vacationDays;
  const travelCostsPerYear = inputs.dailyTravelBudget * inputs.vacationDays;

  const dailyFixedCosts = (inputs.healthInsuranceCost + inputs.otherFixedCosts) / 30;
  const fixedCostsDuringVacation = dailyFixedCosts * inputs.vacationDays;

  const catchUpCost = dailyRate * inputs.catchUpDays * inputs.vacationsPerYear;

  const totalVacationCost = lostIncomePerYear + travelCostsPerYear + fixedCostsDuringVacation + catchUpCost;
  const bufferAmount = totalVacationCost * (inputs.savingsBuffer / 100);
  const totalWithBuffer = totalVacationCost + bufferAmount;

  const monthlySavingsNeeded = totalWithBuffer / 12;
  const perVacationCost =
    inputs.vacationsPerYear > 0 ? totalWithBuffer / inputs.vacationsPerYear : totalWithBuffer;
  const costPerVacationDay = inputs.vacationDays > 0 ? totalWithBuffer / inputs.vacationDays : 0;

  return {
    dailyRate: Math.round(dailyRate * 100) / 100,
    lostIncomePerYear: Math.round(lostIncomePerYear * 100) / 100,
    travelCostsPerYear: Math.round(travelCostsPerYear * 100) / 100,
    fixedCostsDuringVacation: Math.round(fixedCostsDuringVacation * 100) / 100,
    catchUpCost: Math.round(catchUpCost * 100) / 100,
    totalVacationCost: Math.round(totalVacationCost * 100) / 100,
    totalWithBuffer: Math.round(totalWithBuffer * 100) / 100,
    monthlySavingsNeeded: Math.round(monthlySavingsNeeded * 100) / 100,
    perVacationCost: Math.round(perVacationCost * 100) / 100,
    costPerVacationDay: Math.round(costPerVacationDay * 100) / 100,
    breakdown: [
      { label: 'Lost Income', amount: Math.round(lostIncomePerYear * 100) / 100 },
      { label: 'Travel Costs', amount: Math.round(travelCostsPerYear * 100) / 100 },
      { label: 'Fixed Costs During Vacation', amount: Math.round(fixedCostsDuringVacation * 100) / 100 },
      { label: 'Catch-Up Time Cost', amount: Math.round(catchUpCost * 100) / 100 },
      { label: 'Safety Buffer', amount: Math.round(bufferAmount * 100) / 100 },
    ],
  };
}

export const DEFAULT_INPUTS: FreelanceVacationInputs = {
  monthlyIncome: 6000,
  vacationDays: 15,
  dailyTravelBudget: 150,
  workDaysPerWeek: 5,
  catchUpDays: 3,
  healthInsuranceCost: 400,
  otherFixedCosts: 200,
  savingsBuffer: 10,
  vacationsPerYear: 2,
};

export const QUICK_MODE_DEFAULTS: Partial<FreelanceVacationInputs> = {
  workDaysPerWeek: 5,
  catchUpDays: 3,
  healthInsuranceCost: 400,
  otherFixedCosts: 200,
  savingsBuffer: 10,
  vacationsPerYear: 2,
};
