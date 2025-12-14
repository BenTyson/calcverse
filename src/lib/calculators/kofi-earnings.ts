// Ko-fi Earnings Calculator
// Estimate Ko-fi creator earnings from donations, memberships, and shop sales

export interface KofiEarningsInputs {
  // Quick mode
  monthlyDonations: number; // One-time "coffees"
  membershipCount: number;

  // Advanced mode
  avgDonationAmount: number; // Default $3 per coffee
  membershipPrice: number;
  shopSalesPerMonth: number;
  avgOrderValue: number;
  commissionSales: number; // Custom commissions
  goldMember: boolean; // Ko-fi Gold (0% platform fee vs 5%)
  paypalFeeRate: number; // PayPal/Stripe fees
}

export interface KofiEarningsResults {
  donationRevenue: number;
  membershipRevenue: number;
  shopRevenue: number;
  commissionRevenue: number;
  grossMonthly: number;
  platformFees: number;
  paymentProcessingFees: number;
  totalFees: number;
  netMonthly: number;
  netAnnual: number;
  feePercentage: number;
  breakdown: {
    label: string;
    value: number;
    percentage: number;
  }[];
}

// Ko-fi fee structure
const KOFI_FREE_FEE = 0.05; // 5% on free accounts
const KOFI_GOLD_FEE = 0; // 0% for Gold members ($6/month)
const PAYMENT_PROCESSING_BASE = 0.029; // ~2.9%
const PAYMENT_PROCESSING_FIXED = 0.30; // + $0.30 per transaction

export function calculateKofiEarnings(inputs: KofiEarningsInputs): KofiEarningsResults {
  // Calculate revenue streams
  const donationRevenue = inputs.monthlyDonations * inputs.avgDonationAmount;
  const membershipRevenue = inputs.membershipCount * inputs.membershipPrice;
  const shopRevenue = inputs.shopSalesPerMonth * inputs.avgOrderValue;
  const commissionRevenue = inputs.commissionSales;

  const grossMonthly = donationRevenue + membershipRevenue + shopRevenue + commissionRevenue;

  // Platform fees (Ko-fi takes cut from donations and memberships, not shop)
  const platformFeeRate = inputs.goldMember ? KOFI_GOLD_FEE : KOFI_FREE_FEE;
  const platformFees = (donationRevenue + membershipRevenue) * platformFeeRate;

  // Payment processing fees (on all transactions)
  // Estimate number of transactions
  const numDonations = inputs.monthlyDonations;
  const numMemberships = inputs.membershipCount; // Monthly recurring
  const numShopOrders = inputs.shopSalesPerMonth;
  const numCommissions = inputs.commissionSales > 0 ? Math.ceil(inputs.commissionSales / 100) : 0;
  const totalTransactions = numDonations + numMemberships + numShopOrders + numCommissions;

  const paymentProcessingFees =
    (grossMonthly * (inputs.paypalFeeRate / 100)) +
    (totalTransactions * PAYMENT_PROCESSING_FIXED);

  const totalFees = platformFees + paymentProcessingFees;
  const netMonthly = grossMonthly - totalFees;
  const netAnnual = netMonthly * 12;

  const feePercentage = grossMonthly > 0 ? (totalFees / grossMonthly) * 100 : 0;

  // Revenue breakdown
  const breakdown = [
    { label: 'Donations', value: donationRevenue, percentage: grossMonthly > 0 ? (donationRevenue / grossMonthly) * 100 : 0 },
    { label: 'Memberships', value: membershipRevenue, percentage: grossMonthly > 0 ? (membershipRevenue / grossMonthly) * 100 : 0 },
    { label: 'Shop Sales', value: shopRevenue, percentage: grossMonthly > 0 ? (shopRevenue / grossMonthly) * 100 : 0 },
    { label: 'Commissions', value: commissionRevenue, percentage: grossMonthly > 0 ? (commissionRevenue / grossMonthly) * 100 : 0 },
  ].filter(item => item.value > 0);

  return {
    donationRevenue,
    membershipRevenue,
    shopRevenue,
    commissionRevenue,
    grossMonthly,
    platformFees,
    paymentProcessingFees,
    totalFees,
    netMonthly,
    netAnnual,
    feePercentage,
    breakdown,
  };
}

export const DEFAULT_INPUTS: KofiEarningsInputs = {
  monthlyDonations: 20,
  membershipCount: 10,
  avgDonationAmount: 5,
  membershipPrice: 5,
  shopSalesPerMonth: 5,
  avgOrderValue: 15,
  commissionSales: 0,
  goldMember: false,
  paypalFeeRate: 2.9,
};

export const QUICK_MODE_DEFAULTS: Partial<KofiEarningsInputs> = {
  avgDonationAmount: 5,
  membershipPrice: 5,
  shopSalesPerMonth: 0,
  avgOrderValue: 15,
  commissionSales: 0,
  goldMember: false,
  paypalFeeRate: 2.9,
};
