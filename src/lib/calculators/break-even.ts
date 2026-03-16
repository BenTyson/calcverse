export interface BreakEvenInputs {
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
  targetProfit: number;
  taxRate: number;
  maxUnits: number;
}

export interface BreakEvenResults {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
  targetProfitUnits: number;
  targetProfitRevenue: number;
  projectionData: { label: string; revenue: number; totalCost: number }[];
}

export function calculateBreakEven(inputs: BreakEvenInputs): BreakEvenResults {
  const { fixedCosts, variableCostPerUnit, pricePerUnit, targetProfit, taxRate } = inputs;

  const contributionMargin = pricePerUnit - variableCostPerUnit;
  const contributionMarginRatio = pricePerUnit > 0 ? (contributionMargin / pricePerUnit) * 100 : 0;

  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;

  // Target profit units (pre-tax)
  const preTaxTargetProfit = taxRate > 0 ? targetProfit / (1 - taxRate / 100) : targetProfit;
  const targetProfitUnits = contributionMargin > 0
    ? Math.ceil((fixedCosts + preTaxTargetProfit) / contributionMargin)
    : 0;
  const targetProfitRevenue = targetProfitUnits * pricePerUnit;

  // Build projection data - show from 0 to 2x break-even (or maxUnits)
  const maxDisplayUnits = Math.max(
    inputs.maxUnits,
    breakEvenUnits > 0 ? Math.ceil(breakEvenUnits * 2) : 100,
  );
  const step = Math.max(1, Math.floor(maxDisplayUnits / 30));
  const projectionData: { label: string; revenue: number; totalCost: number }[] = [];

  for (let units = 0; units <= maxDisplayUnits; units += step) {
    projectionData.push({
      label: `${units}`,
      revenue: units * pricePerUnit,
      totalCost: fixedCosts + units * variableCostPerUnit,
    });
  }

  // Ensure break-even point is in the data
  if (breakEvenUnits > 0 && !projectionData.find((p) => p.label === `${breakEvenUnits}`)) {
    projectionData.push({
      label: `${breakEvenUnits}`,
      revenue: breakEvenUnits * pricePerUnit,
      totalCost: fixedCosts + breakEvenUnits * variableCostPerUnit,
    });
    projectionData.sort((a, b) => parseInt(a.label) - parseInt(b.label));
  }

  return {
    breakEvenUnits,
    breakEvenRevenue: Math.round(breakEvenRevenue * 100) / 100,
    contributionMargin: Math.round(contributionMargin * 100) / 100,
    contributionMarginRatio: Math.round(contributionMarginRatio * 10) / 10,
    targetProfitUnits,
    targetProfitRevenue: Math.round(targetProfitRevenue * 100) / 100,
    projectionData,
  };
}

export const DEFAULT_INPUTS: BreakEvenInputs = {
  fixedCosts: 5000,
  variableCostPerUnit: 15,
  pricePerUnit: 50,
  targetProfit: 3000,
  taxRate: 25,
  maxUnits: 0,
};

export const QUICK_MODE_DEFAULTS: Partial<BreakEvenInputs> = {
  targetProfit: 0,
  taxRate: 0,
  maxUnits: 0,
};
