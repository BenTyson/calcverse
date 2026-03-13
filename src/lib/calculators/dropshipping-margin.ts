export interface DropshippingMarginInputs {
  sellingPrice: number;
  supplierCost: number;
  adSpendPerSale: number;
  ordersPerMonth: number;
  platform: string;
  platformFeePercent: number;
  paymentProcessingPercent: number;
  returnRatePercent: number;
  refundRatePercent: number;
  monthlyFixedCosts: number;
}

export interface DropshippingMarginResults {
  profitPerOrder: number;
  monthlyProfit: number;
  profitMargin: number;
  breakEvenOrders: number;
  roas: number;
  monthlyRevenue: number;
  totalPerOrderCosts: number;
  platformFee: number;
  processingFee: number;
  returnCost: number;
  refundCost: number;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

export const DROPSHIP_PLATFORMS = [
  { value: 'shopify', label: 'Shopify' },
  { value: 'woocommerce', label: 'WooCommerce' },
  { value: 'amazon', label: 'Amazon' },
];

export const PLATFORM_PRESETS: Record<string, { platformFee: number; processingFee: number }> = {
  shopify: { platformFee: 0, processingFee: 2.9 },
  woocommerce: { platformFee: 0, processingFee: 2.9 },
  amazon: { platformFee: 15, processingFee: 0 },
};

export const DEFAULT_INPUTS: DropshippingMarginInputs = {
  sellingPrice: 39.99,
  supplierCost: 12,
  adSpendPerSale: 8,
  ordersPerMonth: 100,
  platform: 'shopify',
  platformFeePercent: 0,
  paymentProcessingPercent: 2.9,
  returnRatePercent: 5,
  refundRatePercent: 3,
  monthlyFixedCosts: 79,
};

export function calculateDropshippingMargin(
  inputs: DropshippingMarginInputs
): DropshippingMarginResults {
  const {
    sellingPrice,
    supplierCost,
    adSpendPerSale,
    ordersPerMonth,
    platformFeePercent,
    paymentProcessingPercent,
    returnRatePercent,
    refundRatePercent,
    monthlyFixedCosts,
  } = inputs;

  const platformFee = sellingPrice * (platformFeePercent / 100);
  const processingFee = sellingPrice * (paymentProcessingPercent / 100);
  const returnCost = sellingPrice * (returnRatePercent / 100);
  const refundCost = sellingPrice * (refundRatePercent / 100);

  const totalPerOrderCosts =
    supplierCost + adSpendPerSale + platformFee + processingFee + returnCost + refundCost;
  const profitPerOrder = sellingPrice - totalPerOrderCosts;
  const monthlyRevenue = sellingPrice * ordersPerMonth;
  const monthlyProfit = profitPerOrder * ordersPerMonth - monthlyFixedCosts;
  const profitMargin = sellingPrice > 0 ? (profitPerOrder / sellingPrice) * 100 : 0;
  const breakEvenOrders = profitPerOrder > 0 ? Math.ceil(monthlyFixedCosts / profitPerOrder) : -1;
  const roas = adSpendPerSale > 0 ? sellingPrice / adSpendPerSale : 0;

  return {
    profitPerOrder: Math.round(profitPerOrder * 100) / 100,
    monthlyProfit: Math.round(monthlyProfit * 100) / 100,
    profitMargin: Math.round(profitMargin * 10) / 10,
    breakEvenOrders,
    roas: Math.round(roas * 100) / 100,
    monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
    totalPerOrderCosts: Math.round(totalPerOrderCosts * 100) / 100,
    platformFee: Math.round(platformFee * 100) / 100,
    processingFee: Math.round(processingFee * 100) / 100,
    returnCost: Math.round(returnCost * 100) / 100,
    refundCost: Math.round(refundCost * 100) / 100,
    breakdown: [
      { label: 'Selling Price', amount: Math.round(sellingPrice * 100) / 100 },
      { label: 'Supplier Cost', amount: Math.round(supplierCost * 100) / 100, isDeduction: true },
      { label: 'Ad Spend', amount: Math.round(adSpendPerSale * 100) / 100, isDeduction: true },
      { label: 'Platform Fee', amount: Math.round(platformFee * 100) / 100, isDeduction: true },
      { label: 'Processing Fee', amount: Math.round(processingFee * 100) / 100, isDeduction: true },
      { label: 'Returns', amount: Math.round(returnCost * 100) / 100, isDeduction: true },
      { label: 'Refunds', amount: Math.round(refundCost * 100) / 100, isDeduction: true },
    ],
  };
}
