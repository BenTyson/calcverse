// Print-on-Demand Profit Calculator
// Calculate per-unit and monthly profit for POD products

export interface PrintOnDemandInputs {
  // Quick mode
  platform: string;
  productType: string;
  sellingPrice: number;
  monthlySales: number;

  // Advanced mode
  shippingCharged: number;
  marketplace: string;
  adSpend: number;
  designCost: number;
  returnRate: number;
  numberOfDesigns: number;
}

export interface PrintOnDemandResults {
  profitPerUnit: number;
  monthlyNetProfit: number;
  profitMargin: number;
  baseCost: number;
  shippingCost: number;
  marketplaceFee: number;
  grossPerUnit: number;
  monthlyGross: number;
  monthlyReturns: number;
  annualProfit: number;
  breakdown: {
    label: string;
    value: number;
    percentage: number;
  }[];
}

// Base production costs by platform + product
const BASE_COSTS: Record<string, Record<string, number>> = {
  printful: {
    tshirt: 12.95,
    hoodie: 25.95,
    mug: 7.95,
    poster: 8.95,
    'phone-case': 10.95,
    'tote-bag': 14.95,
    sticker: 2.50,
  },
  printify: {
    tshirt: 9.50,
    hoodie: 22.00,
    mug: 5.50,
    poster: 6.50,
    'phone-case': 8.50,
    'tote-bag': 11.00,
    sticker: 1.80,
  },
  'merch-by-amazon': {
    tshirt: 0,
    hoodie: 0,
    mug: 0,
    poster: 0,
    'phone-case': 0,
    'tote-bag': 0,
    sticker: 0,
  },
};

// Merch by Amazon uses royalty model (percentage of price)
const MERCH_ROYALTY_RATE = 0.325;

// Shipping costs by product type
const SHIPPING_COSTS: Record<string, number> = {
  tshirt: 4.50,
  hoodie: 6.50,
  mug: 5.50,
  poster: 4.00,
  'phone-case': 3.50,
  'tote-bag': 4.50,
  sticker: 1.50,
};

// Marketplace fees
function getMarketplaceFee(marketplace: string, sellingPrice: number, shippingCharged: number): number {
  const total = sellingPrice + shippingCharged;
  switch (marketplace) {
    case 'etsy':
      // Listing $0.20 + transaction 6.5% + processing 3% + $0.25
      return 0.20 + total * 0.065 + total * 0.03 + 0.25;
    case 'amazon':
      // 15% referral fee
      return total * 0.15;
    default:
      return 0; // own store, no marketplace fee
  }
}

export function calculatePrintOnDemand(inputs: PrintOnDemandInputs): PrintOnDemandResults {
  const isMerch = inputs.platform === 'merch-by-amazon';

  // Base production cost
  const baseCost = isMerch
    ? 0
    : (BASE_COSTS[inputs.platform]?.[inputs.productType] ?? 10);

  // Shipping cost (platform pays for Merch)
  const shippingCost = isMerch ? 0 : (SHIPPING_COSTS[inputs.productType] ?? 4);

  // Gross per unit
  const grossPerUnit = inputs.sellingPrice + inputs.shippingCharged;

  // Marketplace fee
  const marketplaceFee = getMarketplaceFee(inputs.marketplace, inputs.sellingPrice, inputs.shippingCharged);

  // Profit per unit
  let profitPerUnit: number;
  if (isMerch) {
    // Merch by Amazon: royalty model
    profitPerUnit = inputs.sellingPrice * MERCH_ROYALTY_RATE;
  } else {
    profitPerUnit = grossPerUnit - baseCost - shippingCost - marketplaceFee;
  }

  // Monthly calculations
  const monthlyGross = grossPerUnit * inputs.monthlySales;
  const returnRateDecimal = inputs.returnRate / 100;
  const effectiveSales = inputs.monthlySales * (1 - returnRateDecimal);
  const monthlyReturns = inputs.monthlySales * returnRateDecimal * grossPerUnit;

  const monthlyNetProfit = profitPerUnit * effectiveSales - inputs.adSpend - inputs.designCost;
  const profitMargin = grossPerUnit > 0 ? (profitPerUnit / grossPerUnit) * 100 : 0;
  const annualProfit = monthlyNetProfit * 12;

  // Cost breakdown per unit (for DonutChart)
  const breakdownItems = isMerch
    ? [
        { label: 'Amazon Cut', value: inputs.sellingPrice * (1 - MERCH_ROYALTY_RATE) },
        { label: 'Your Royalty', value: profitPerUnit },
      ]
    : [
        { label: 'Production Cost', value: baseCost },
        { label: 'Shipping Cost', value: shippingCost },
        ...(marketplaceFee > 0 ? [{ label: 'Marketplace Fee', value: marketplaceFee }] : []),
        { label: 'Profit', value: Math.max(0, profitPerUnit) },
      ];

  const total = breakdownItems.reduce((sum, item) => sum + item.value, 0);
  const breakdown = breakdownItems
    .filter((item) => item.value > 0)
    .map((item) => ({
      label: item.label,
      value: Math.round(item.value * 100) / 100,
      percentage: total > 0 ? (item.value / total) * 100 : 0,
    }));

  return {
    profitPerUnit: Math.round(profitPerUnit * 100) / 100,
    monthlyNetProfit: Math.round(monthlyNetProfit * 100) / 100,
    profitMargin: Math.round(profitMargin * 10) / 10,
    baseCost: Math.round(baseCost * 100) / 100,
    shippingCost: Math.round(shippingCost * 100) / 100,
    marketplaceFee: Math.round(marketplaceFee * 100) / 100,
    grossPerUnit: Math.round(grossPerUnit * 100) / 100,
    monthlyGross: Math.round(monthlyGross * 100) / 100,
    monthlyReturns: Math.round(monthlyReturns * 100) / 100,
    annualProfit: Math.round(annualProfit * 100) / 100,
    breakdown,
  };
}

export const DEFAULT_INPUTS: PrintOnDemandInputs = {
  platform: 'printful',
  productType: 'tshirt',
  sellingPrice: 29,
  monthlySales: 20,
  shippingCharged: 5,
  marketplace: 'own-store',
  adSpend: 0,
  designCost: 0,
  returnRate: 3,
  numberOfDesigns: 5,
};

export const QUICK_MODE_DEFAULTS: Partial<PrintOnDemandInputs> = {
  shippingCharged: 5,
  marketplace: 'own-store',
  adSpend: 0,
  designCost: 0,
  returnRate: 3,
  numberOfDesigns: 5,
};
