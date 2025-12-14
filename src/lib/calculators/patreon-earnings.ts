export interface PatreonInputs {
  numberOfPatrons: number;
  averagePledge: number;
  feeTier: 'lite' | 'pro' | 'premium';
  churnRate: number; // monthly churn percentage
}

export interface PatreonResults {
  monthlyGross: number;
  patreonFee: number;
  paymentProcessingFee: number;
  totalFees: number;
  monthlyNet: number;
  annualNet: number;
  effectiveFeePct: number;
  projectedPatrons6Mo: number;
  projectedPatrons12Mo: number;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

// Patreon fee structure (2024)
// Lite: 5% + payment processing
// Pro: 8% + payment processing
// Premium: 12% + payment processing
// Payment Processing: ~2.9% + $0.30 per transaction
const PATREON_FEE_RATES: Record<string, number> = {
  lite: 0.05,
  pro: 0.08,
  premium: 0.12,
};

const PAYMENT_PROCESSING_RATE = 0.029;
const PAYMENT_PROCESSING_FLAT = 0.30;

export const DEFAULT_INPUTS: PatreonInputs = {
  numberOfPatrons: 100,
  averagePledge: 5,
  feeTier: 'pro',
  churnRate: 5,
};

export function calculatePatreonEarnings(
  inputs: PatreonInputs
): PatreonResults {
  // Calculate monthly gross
  const monthlyGross = inputs.numberOfPatrons * inputs.averagePledge;

  // Calculate Patreon platform fee
  const patreonFeeRate = PATREON_FEE_RATES[inputs.feeTier];
  const patreonFee = monthlyGross * patreonFeeRate;

  // Calculate payment processing fee
  // Note: Payment processing is per transaction, so we multiply flat fee by patron count
  const paymentProcessingPct = monthlyGross * PAYMENT_PROCESSING_RATE;
  const paymentProcessingFlat = inputs.numberOfPatrons * PAYMENT_PROCESSING_FLAT;
  const paymentProcessingFee = paymentProcessingPct + paymentProcessingFlat;

  // Calculate totals
  const totalFees = patreonFee + paymentProcessingFee;
  const monthlyNet = monthlyGross - totalFees;
  const annualNet = monthlyNet * 12;
  const effectiveFeePct = monthlyGross > 0 ? (totalFees / monthlyGross) * 100 : 0;

  // Project patron counts with churn
  // Using compound decay: P(t) = P0 * (1 - churnRate)^t
  const monthlyRetention = 1 - inputs.churnRate / 100;
  const projectedPatrons6Mo = Math.round(inputs.numberOfPatrons * Math.pow(monthlyRetention, 6));
  const projectedPatrons12Mo = Math.round(inputs.numberOfPatrons * Math.pow(monthlyRetention, 12));

  return {
    monthlyGross: Math.round(monthlyGross * 100) / 100,
    patreonFee: Math.round(patreonFee * 100) / 100,
    paymentProcessingFee: Math.round(paymentProcessingFee * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
    monthlyNet: Math.round(monthlyNet * 100) / 100,
    annualNet: Math.round(annualNet * 100) / 100,
    effectiveFeePct: Math.round(effectiveFeePct * 10) / 10,
    projectedPatrons6Mo,
    projectedPatrons12Mo,
    breakdown: [
      { label: 'Monthly Gross', amount: Math.round(monthlyGross * 100) / 100 },
      { label: `Patreon Fee (${patreonFeeRate * 100}%)`, amount: Math.round(patreonFee * 100) / 100, isDeduction: true },
      { label: 'Payment Processing', amount: Math.round(paymentProcessingFee * 100) / 100, isDeduction: true },
    ],
  };
}
