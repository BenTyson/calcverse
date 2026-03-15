export interface ProfitMarginInputs {
  // Quick mode
  revenue: number;
  costOfGoods: number;

  // Advanced mode
  operatingExpenses: number;
  otherExpenses: number;
  unitsSold: number;
  taxRate: number;
}

export interface ProfitMarginResults {
  grossProfit: number;
  grossMargin: number;
  operatingProfit: number;
  operatingMargin: number;
  netProfit: number;
  netMargin: number;
  profitPerUnit: number;
  breakEvenRevenue: number;
  taxAmount: number;
  breakdown: { label: string; value: number }[];
  donutData: { label: string; value: number }[];
}

export function calculateProfitMargin(inputs: ProfitMarginInputs): ProfitMarginResults {
  const grossProfit = inputs.revenue - inputs.costOfGoods;
  const grossMargin = inputs.revenue > 0 ? (grossProfit / inputs.revenue) * 100 : 0;

  const operatingProfit = grossProfit - inputs.operatingExpenses;
  const operatingMargin = inputs.revenue > 0 ? (operatingProfit / inputs.revenue) * 100 : 0;

  const preTexProfit = operatingProfit - inputs.otherExpenses;
  const taxAmount = Math.max(0, preTexProfit * (inputs.taxRate / 100));
  const netProfit = preTexProfit - taxAmount;
  const netMargin = inputs.revenue > 0 ? (netProfit / inputs.revenue) * 100 : 0;

  const profitPerUnit = inputs.unitsSold > 0 ? netProfit / inputs.unitsSold : 0;

  const totalCosts = inputs.costOfGoods + inputs.operatingExpenses + inputs.otherExpenses;
  const effectiveMargin = inputs.revenue > 0
    ? (inputs.revenue - totalCosts) / inputs.revenue
    : 0;
  const breakEvenRevenue = effectiveMargin > 0
    ? totalCosts / (1 - inputs.taxRate / 100)
    : 0;

  const breakdown: { label: string; value: number }[] = [
    { label: 'Revenue', value: inputs.revenue },
    { label: 'Cost of Goods Sold', value: -inputs.costOfGoods },
    { label: 'Gross Profit', value: grossProfit },
  ];

  if (inputs.operatingExpenses > 0) {
    breakdown.push(
      { label: 'Operating Expenses', value: -inputs.operatingExpenses },
      { label: 'Operating Profit', value: operatingProfit },
    );
  }

  if (inputs.otherExpenses > 0) {
    breakdown.push({ label: 'Other Expenses', value: -inputs.otherExpenses });
  }

  if (taxAmount > 0) {
    breakdown.push({ label: 'Taxes', value: -taxAmount });
  }

  breakdown.push({ label: 'Net Profit', value: netProfit });

  const donutData: { label: string; value: number }[] = [];
  if (inputs.costOfGoods > 0) donutData.push({ label: 'COGS', value: inputs.costOfGoods });
  if (inputs.operatingExpenses > 0) donutData.push({ label: 'Operating', value: inputs.operatingExpenses });
  if (inputs.otherExpenses > 0) donutData.push({ label: 'Other', value: inputs.otherExpenses });
  if (taxAmount > 0) donutData.push({ label: 'Tax', value: taxAmount });
  if (netProfit > 0) donutData.push({ label: 'Profit', value: netProfit });

  return {
    grossProfit,
    grossMargin,
    operatingProfit,
    operatingMargin,
    netProfit,
    netMargin,
    profitPerUnit,
    breakEvenRevenue,
    taxAmount,
    breakdown,
    donutData,
  };
}

export const DEFAULT_INPUTS: ProfitMarginInputs = {
  revenue: 10000,
  costOfGoods: 4000,
  operatingExpenses: 1500,
  otherExpenses: 500,
  unitsSold: 100,
  taxRate: 15,
};

export const QUICK_MODE_DEFAULTS: Partial<ProfitMarginInputs> = {
  operatingExpenses: 0,
  otherExpenses: 0,
  unitsSold: 0,
  taxRate: 0,
};
