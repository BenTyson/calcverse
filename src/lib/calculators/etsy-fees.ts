export interface EtsyFeeInputs {
  itemPrice: number;
  shippingCharged: number;
  shippingCost: number;
  itemCost: number; // cost of goods
  etsyAdsPercent: number; // 0-15%
  offsiteAdsOptedIn: boolean;
}

export interface EtsyFeeResults {
  listingFee: number;
  transactionFee: number;
  paymentProcessingFee: number;
  etsyAdsFee: number;
  offsiteAdsFee: number;
  totalFees: number;
  grossRevenue: number;
  netProfit: number;
  profitMargin: number;
  feePercentage: number;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

// Etsy Fee Structure (2024)
// Listing Fee: $0.20 per item
// Transaction Fee: 6.5% of (item price + shipping charged)
// Payment Processing: 3% + $0.25
// Offsite Ads: 12% for shops under $10k/year, 15% for shops over $10k/year (if opted in)
// Etsy Ads: Variable % (you set budget)

const LISTING_FEE = 0.20;
const TRANSACTION_FEE_RATE = 0.065;
const PAYMENT_PROCESSING_RATE = 0.03;
const PAYMENT_PROCESSING_FLAT = 0.25;
const OFFSITE_ADS_RATE = 0.12; // Using lower rate as default

export const DEFAULT_INPUTS: EtsyFeeInputs = {
  itemPrice: 25,
  shippingCharged: 5,
  shippingCost: 3,
  itemCost: 8,
  etsyAdsPercent: 0,
  offsiteAdsOptedIn: false,
};

export function calculateEtsyFees(
  inputs: EtsyFeeInputs
): EtsyFeeResults {
  const grossRevenue = inputs.itemPrice + inputs.shippingCharged;

  // Listing fee (per item)
  const listingFee = LISTING_FEE;

  // Transaction fee (6.5% of total)
  const transactionFee = grossRevenue * TRANSACTION_FEE_RATE;

  // Payment processing (3% + $0.25)
  const paymentProcessingFee = grossRevenue * PAYMENT_PROCESSING_RATE + PAYMENT_PROCESSING_FLAT;

  // Etsy Ads (if enabled)
  const etsyAdsFee = inputs.etsyAdsPercent > 0
    ? grossRevenue * (inputs.etsyAdsPercent / 100)
    : 0;

  // Offsite Ads (if opted in and sale came from offsite ad)
  // Note: This is only charged when a sale comes from an offsite ad
  // For calculation purposes, we'll show it as potential fee
  const offsiteAdsFee = inputs.offsiteAdsOptedIn
    ? grossRevenue * OFFSITE_ADS_RATE
    : 0;

  // Total fees
  const totalFees = listingFee + transactionFee + paymentProcessingFee + etsyAdsFee + offsiteAdsFee;

  // Calculate profit
  const totalCosts = inputs.itemCost + inputs.shippingCost;
  const netProfit = grossRevenue - totalFees - totalCosts;
  const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
  const feePercentage = grossRevenue > 0 ? (totalFees / grossRevenue) * 100 : 0;

  return {
    listingFee: Math.round(listingFee * 100) / 100,
    transactionFee: Math.round(transactionFee * 100) / 100,
    paymentProcessingFee: Math.round(paymentProcessingFee * 100) / 100,
    etsyAdsFee: Math.round(etsyAdsFee * 100) / 100,
    offsiteAdsFee: Math.round(offsiteAdsFee * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
    grossRevenue: Math.round(grossRevenue * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    profitMargin: Math.round(profitMargin * 10) / 10,
    feePercentage: Math.round(feePercentage * 10) / 10,
    breakdown: [
      { label: 'Gross Revenue', amount: Math.round(grossRevenue * 100) / 100 },
      { label: 'Listing Fee', amount: Math.round(listingFee * 100) / 100, isDeduction: true },
      { label: 'Transaction Fee (6.5%)', amount: Math.round(transactionFee * 100) / 100, isDeduction: true },
      { label: 'Payment Processing', amount: Math.round(paymentProcessingFee * 100) / 100, isDeduction: true },
      ...(etsyAdsFee > 0 ? [{ label: 'Etsy Ads', amount: Math.round(etsyAdsFee * 100) / 100, isDeduction: true }] : []),
      ...(offsiteAdsFee > 0 ? [{ label: 'Offsite Ads (12%)', amount: Math.round(offsiteAdsFee * 100) / 100, isDeduction: true }] : []),
      { label: 'Item Cost', amount: Math.round(inputs.itemCost * 100) / 100, isDeduction: true },
      { label: 'Shipping Cost', amount: Math.round(inputs.shippingCost * 100) / 100, isDeduction: true },
    ],
  };
}
