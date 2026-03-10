export interface RentVsBuyInputs {
  homePrice: number;
  downPaymentPercent: number;
  mortgageRate: number;
  monthlyRent: number;
  yearsToCompare: number;
  loanTermYears: number;
  rentIncreaseRate: number;
  propertyTaxRate: number;
  homeInsurance: number;
  maintenancePercent: number;
  homeAppreciation: number;
  investmentReturn: number;
}

export interface YearlyComparison {
  year: number;
  rentCumulative: number;
  buyCumulative: number;
  homeEquity: number;
}

export interface RentVsBuyResults {
  monthlyMortgagePayment: number;
  monthlyBuyTotal: number;
  breakEvenYear: number;
  totalCostBuy: number;
  totalCostRent: number;
  recommendation: string;
  timeline: YearlyComparison[];
}

export const DEFAULT_INPUTS: RentVsBuyInputs = {
  homePrice: 350000,
  downPaymentPercent: 20,
  mortgageRate: 6.5,
  monthlyRent: 1800,
  yearsToCompare: 10,
  loanTermYears: 30,
  rentIncreaseRate: 3,
  propertyTaxRate: 1.1,
  homeInsurance: 1500,
  maintenancePercent: 1,
  homeAppreciation: 3,
  investmentReturn: 7,
};

function calculateMonthlyMortgage(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  if (monthlyRate === 0) return principal / numPayments;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

export function calculateRentVsBuy(inputs: RentVsBuyInputs): RentVsBuyResults {
  const downPayment = inputs.homePrice * (inputs.downPaymentPercent / 100);
  const loanAmount = inputs.homePrice - downPayment;
  const monthlyMortgagePayment = calculateMonthlyMortgage(
    loanAmount,
    inputs.mortgageRate,
    inputs.loanTermYears
  );

  const monthlyPropertyTax =
    (inputs.homePrice * (inputs.propertyTaxRate / 100)) / 12;
  const monthlyInsurance = inputs.homeInsurance / 12;
  const monthlyMaintenance =
    (inputs.homePrice * (inputs.maintenancePercent / 100)) / 12;
  const monthlyBuyTotal =
    monthlyMortgagePayment + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance;

  const timeline: YearlyComparison[] = [];
  let rentCumulative = 0;
  let buyCumulative = downPayment; // Opportunity cost of down payment
  let currentRent = inputs.monthlyRent;
  let currentHomeValue = inputs.homePrice;
  let remainingLoan = loanAmount;
  let breakEvenYear = 0;
  let breakEvenFound = false;
  const monthlyRate = inputs.mortgageRate / 100 / 12;

  // Track investment of difference (if renting is cheaper, invest the savings)
  let investmentBalance = 0;
  const monthlyInvestReturn = inputs.investmentReturn / 100 / 12;

  for (let year = 1; year <= inputs.yearsToCompare; year++) {
    // Calculate year's costs
    let yearRentCost = 0;
    let yearBuyCost = 0;

    for (let month = 0; month < 12; month++) {
      yearRentCost += currentRent;

      // Mortgage amortization
      const interestPayment = remainingLoan * monthlyRate;
      const principalPayment = monthlyMortgagePayment - interestPayment;
      remainingLoan = Math.max(0, remainingLoan - principalPayment);

      yearBuyCost +=
        monthlyMortgagePayment + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance;

      // Investment of rent savings (if renting is cheaper)
      const rentSavings = (monthlyMortgagePayment + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance) - currentRent;
      if (rentSavings > 0) {
        investmentBalance += rentSavings;
      }
      investmentBalance *= 1 + monthlyInvestReturn;
    }

    rentCumulative += yearRentCost;
    buyCumulative += yearBuyCost;

    currentHomeValue *= 1 + inputs.homeAppreciation / 100;
    const homeEquity = currentHomeValue - remainingLoan;

    // Net cost of buying = cumulative costs - equity built
    const netBuyCost = buyCumulative - homeEquity;
    // Net cost of renting = cumulative rent - investment gains
    const netRentCost = rentCumulative - investmentBalance;

    timeline.push({
      year,
      rentCumulative: Math.round(netRentCost),
      buyCumulative: Math.round(netBuyCost),
      homeEquity: Math.round(homeEquity),
    });

    if (!breakEvenFound && netBuyCost <= netRentCost) {
      breakEvenYear = year;
      breakEvenFound = true;
    }

    // Increase rent annually
    currentRent *= 1 + inputs.rentIncreaseRate / 100;
  }

  const finalRentCost = timeline[timeline.length - 1]?.rentCumulative ?? 0;
  const finalBuyCost = timeline[timeline.length - 1]?.buyCumulative ?? 0;

  let recommendation: string;
  if (finalBuyCost < finalRentCost) {
    const savings = finalRentCost - finalBuyCost;
    recommendation = `Buying saves you approximately ${formatSimpleCurrency(savings)} over ${inputs.yearsToCompare} years compared to renting, accounting for equity and investment returns.`;
  } else {
    const savings = finalBuyCost - finalRentCost;
    recommendation = `Renting saves you approximately ${formatSimpleCurrency(savings)} over ${inputs.yearsToCompare} years when you invest the difference, though buying builds equity.`;
  }

  return {
    monthlyMortgagePayment: Math.round(monthlyMortgagePayment),
    monthlyBuyTotal: Math.round(monthlyBuyTotal),
    breakEvenYear: breakEvenFound ? breakEvenYear : 0,
    totalCostBuy: Math.round(finalBuyCost),
    totalCostRent: Math.round(finalRentCost),
    recommendation,
    timeline,
  };
}

function formatSimpleCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
