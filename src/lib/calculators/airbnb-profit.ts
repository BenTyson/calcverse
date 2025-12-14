export interface AirbnbInputs {
  nightlyRate: number;
  occupancyRate: number; // percentage
  cleaningFee: number; // charged to guest
  airbnbFeePercent: number; // host fee (typically 3%)
  cleaningCost: number; // actual cost per turnover
  suppliesCost: number; // monthly supplies
  utilitiesCost: number; // monthly utilities
  mortgageOrRent: number; // monthly
}

export interface AirbnbResults {
  monthlyGross: number;
  airbnbFee: number;
  monthlyCleaningCosts: number;
  monthlyOperatingCosts: number;
  totalExpenses: number;
  monthlyNet: number;
  annualNet: number;
  breakEvenOccupancy: number;
  profitMargin: number;
  nightsBookedPerMonth: number;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

// Average nights per month
const DAYS_PER_MONTH = 30.4;

export const DEFAULT_INPUTS: AirbnbInputs = {
  nightlyRate: 150,
  occupancyRate: 65,
  cleaningFee: 75,
  airbnbFeePercent: 3,
  cleaningCost: 50,
  suppliesCost: 100,
  utilitiesCost: 150,
  mortgageOrRent: 1500,
};

export function calculateAirbnbProfit(
  inputs: AirbnbInputs
): AirbnbResults {
  // Calculate nights booked per month
  const nightsBookedPerMonth = Math.round(DAYS_PER_MONTH * (inputs.occupancyRate / 100));

  // Calculate gross revenue (nightly rate + cleaning fee per stay)
  // Assume average stay is 3 nights
  const avgStayLength = 3;
  const bookingsPerMonth = nightsBookedPerMonth / avgStayLength;
  const nightlyRevenue = nightsBookedPerMonth * inputs.nightlyRate;
  const cleaningRevenue = bookingsPerMonth * inputs.cleaningFee;
  const monthlyGross = nightlyRevenue + cleaningRevenue;

  // Airbnb host fee (typically 3% of booking subtotal)
  const airbnbFee = monthlyGross * (inputs.airbnbFeePercent / 100);

  // Cleaning costs (per turnover)
  const monthlyCleaningCosts = bookingsPerMonth * inputs.cleaningCost;

  // Monthly operating costs
  const monthlyOperatingCosts = inputs.suppliesCost + inputs.utilitiesCost + inputs.mortgageOrRent;

  // Total expenses
  const totalExpenses = airbnbFee + monthlyCleaningCosts + monthlyOperatingCosts;

  // Net profit
  const monthlyNet = monthlyGross - totalExpenses;
  const annualNet = monthlyNet * 12;

  // Profit margin
  const profitMargin = monthlyGross > 0 ? (monthlyNet / monthlyGross) * 100 : 0;

  // Calculate break-even occupancy
  // At break-even: gross = expenses
  // Gross = (days * occ% * nightlyRate) + (days * occ% / avgStay * cleaningFee)
  // Fixed expenses = airbnbFee% * gross + (occ% based cleaning) + fixed operating
  // This is complex, so we'll iterate
  let breakEvenOccupancy = 0;
  for (let occ = 1; occ <= 100; occ++) {
    const testNights = DAYS_PER_MONTH * (occ / 100);
    const testBookings = testNights / avgStayLength;
    const testGross = testNights * inputs.nightlyRate + testBookings * inputs.cleaningFee;
    const testExpenses = testGross * (inputs.airbnbFeePercent / 100) +
      testBookings * inputs.cleaningCost +
      monthlyOperatingCosts;
    if (testGross >= testExpenses) {
      breakEvenOccupancy = occ;
      break;
    }
  }

  return {
    monthlyGross: Math.round(monthlyGross * 100) / 100,
    airbnbFee: Math.round(airbnbFee * 100) / 100,
    monthlyCleaningCosts: Math.round(monthlyCleaningCosts * 100) / 100,
    monthlyOperatingCosts: Math.round(monthlyOperatingCosts * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    monthlyNet: Math.round(monthlyNet * 100) / 100,
    annualNet: Math.round(annualNet * 100) / 100,
    breakEvenOccupancy,
    profitMargin: Math.round(profitMargin * 10) / 10,
    nightsBookedPerMonth,
    breakdown: [
      { label: 'Nightly Revenue', amount: Math.round(nightlyRevenue * 100) / 100 },
      { label: 'Cleaning Fees Collected', amount: Math.round(cleaningRevenue * 100) / 100 },
      { label: 'Monthly Gross', amount: Math.round(monthlyGross * 100) / 100 },
      { label: 'Airbnb Fee', amount: Math.round(airbnbFee * 100) / 100, isDeduction: true },
      { label: 'Cleaning Costs', amount: Math.round(monthlyCleaningCosts * 100) / 100, isDeduction: true },
      { label: 'Operating Costs', amount: Math.round(monthlyOperatingCosts * 100) / 100, isDeduction: true },
    ],
  };
}
