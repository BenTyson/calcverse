export interface ResellingProfitInputs {
  purchasePrice: number;
  sellingPrice: number;
  platform: string;
  shippingCost: number;
  platformFeePercent: number;
  paymentProcessingPercent: number;
  shippingMaterialCost: number;
  hoursSpentSourcing: number;
  desiredHourlyRate: number;
}

export interface ResellingProfitResults {
  netProfit: number;
  profitMargin: number;
  roi: number;
  platformFee: number;
  processingFee: number;
  totalDeductions: number;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

export const PLATFORM_PRESETS: Record<string, { platformFee: number; processingFee: number }> = {
  ebay: { platformFee: 13.25, processingFee: 0 },
  poshmark: { platformFee: 20, processingFee: 0 },
  mercari: { platformFee: 10, processingFee: 2.9 },
  'fb-marketplace': { platformFee: 5, processingFee: 0 },
};

export const PLATFORMS = [
  { value: 'ebay', label: 'eBay' },
  { value: 'poshmark', label: 'Poshmark' },
  { value: 'mercari', label: 'Mercari' },
  { value: 'fb-marketplace', label: 'FB Marketplace' },
];

export const DEFAULT_INPUTS: ResellingProfitInputs = {
  purchasePrice: 15,
  sellingPrice: 40,
  platform: 'ebay',
  shippingCost: 8,
  platformFeePercent: 13.25,
  paymentProcessingPercent: 0,
  shippingMaterialCost: 2,
  hoursSpentSourcing: 1,
  desiredHourlyRate: 20,
};

export function calculateResellingProfit(
  inputs: ResellingProfitInputs
): ResellingProfitResults {
  const platformFee = inputs.sellingPrice * (inputs.platformFeePercent / 100);
  const processingFee = inputs.sellingPrice * (inputs.paymentProcessingPercent / 100);
  const totalDeductions = inputs.purchasePrice + platformFee + processingFee + inputs.shippingCost + inputs.shippingMaterialCost;
  const netProfit = inputs.sellingPrice - totalDeductions;
  const profitMargin = inputs.sellingPrice > 0 ? (netProfit / inputs.sellingPrice) * 100 : 0;
  const investmentCost = inputs.purchasePrice + inputs.shippingMaterialCost;
  const roi = investmentCost > 0 ? (netProfit / investmentCost) * 100 : 0;

  return {
    netProfit: Math.round(netProfit * 100) / 100,
    profitMargin: Math.round(profitMargin * 10) / 10,
    roi: Math.round(roi * 10) / 10,
    platformFee: Math.round(platformFee * 100) / 100,
    processingFee: Math.round(processingFee * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    breakdown: [
      { label: 'Selling Price', amount: Math.round(inputs.sellingPrice * 100) / 100 },
      { label: 'Purchase Price', amount: Math.round(inputs.purchasePrice * 100) / 100, isDeduction: true },
      { label: 'Platform Fee', amount: Math.round(platformFee * 100) / 100, isDeduction: true },
      ...(processingFee > 0 ? [{ label: 'Processing Fee', amount: Math.round(processingFee * 100) / 100, isDeduction: true }] : []),
      { label: 'Shipping Cost', amount: Math.round(inputs.shippingCost * 100) / 100, isDeduction: true },
      ...(inputs.shippingMaterialCost > 0 ? [{ label: 'Materials', amount: Math.round(inputs.shippingMaterialCost * 100) / 100, isDeduction: true }] : []),
    ],
  };
}
