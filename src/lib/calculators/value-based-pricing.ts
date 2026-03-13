export interface ValueBasedPricingInputs {
  estimatedClientValue: number;
  valueSharePercent: number;
  estimatedHours: number;
  hourlyRate: number;
  projectDurationWeeks: number;
  revisionRounds: number;
  scopeBuffer: number;
  confidenceLevel: 'high' | 'medium' | 'low';
}

export interface ValueBasedPricingResults {
  valueBasedPrice: number;
  hourlyEquivalent: number;
  hourlyComparison: number;
  premiumOverHourly: number;
  premiumPercent: number;
  adjustedPrice: number;
  effectiveHourlyRate: number;
  pricePerWeek: number;
  totalEstimatedHours: number;
  breakdown: { label: string; amount: number; isDeduction?: boolean }[];
}

export const CONFIDENCE_OPTIONS = [
  { value: 'high', label: 'High (proven results)' },
  { value: 'medium', label: 'Medium (reasonable estimate)' },
  { value: 'low', label: 'Low (speculative)' },
];

const CONFIDENCE_MULTIPLIERS: Record<string, number> = {
  high: 1.0,
  medium: 0.85,
  low: 0.7,
};

export function calculateValueBasedPricing(inputs: ValueBasedPricingInputs): ValueBasedPricingResults {
  const basePrice = inputs.estimatedClientValue * (inputs.valueSharePercent / 100);

  const revisionHours = inputs.estimatedHours * 0.15 * inputs.revisionRounds;
  const bufferedHours = inputs.estimatedHours * (1 + inputs.scopeBuffer / 100);
  const totalEstimatedHours = bufferedHours + revisionHours;

  const confidenceMultiplier = CONFIDENCE_MULTIPLIERS[inputs.confidenceLevel] ?? 0.85;
  const adjustedPrice = basePrice * confidenceMultiplier;
  const valueBasedPrice = Math.round(adjustedPrice * 100) / 100;

  const hourlyComparison = Math.round(inputs.hourlyRate * totalEstimatedHours * 100) / 100;
  const effectiveHourlyRate =
    totalEstimatedHours > 0 ? Math.round((valueBasedPrice / totalEstimatedHours) * 100) / 100 : 0;
  const premiumOverHourly = Math.round((valueBasedPrice - hourlyComparison) * 100) / 100;
  const premiumPercent =
    hourlyComparison > 0 ? Math.round((premiumOverHourly / hourlyComparison) * 1000) / 10 : 0;

  const pricePerWeek =
    inputs.projectDurationWeeks > 0
      ? Math.round((valueBasedPrice / inputs.projectDurationWeeks) * 100) / 100
      : valueBasedPrice;

  const confidenceAdjustment = Math.round((adjustedPrice - basePrice) * 100) / 100;

  return {
    valueBasedPrice,
    hourlyEquivalent: effectiveHourlyRate,
    hourlyComparison,
    premiumOverHourly,
    premiumPercent,
    adjustedPrice: valueBasedPrice,
    effectiveHourlyRate,
    pricePerWeek,
    totalEstimatedHours: Math.round(totalEstimatedHours * 10) / 10,
    breakdown: [
      { label: 'Client Value Created', amount: inputs.estimatedClientValue },
      { label: `Your Value Share (${inputs.valueSharePercent}%)`, amount: Math.round(basePrice * 100) / 100 },
      ...(confidenceAdjustment !== 0
        ? [{ label: 'Confidence Adjustment', amount: confidenceAdjustment, isDeduction: confidenceAdjustment < 0 }]
        : []),
      { label: 'Hourly Rate Equivalent', amount: hourlyComparison },
      { label: 'Premium Over Hourly', amount: premiumOverHourly },
    ],
  };
}

export const DEFAULT_INPUTS: ValueBasedPricingInputs = {
  estimatedClientValue: 50000,
  valueSharePercent: 15,
  estimatedHours: 40,
  hourlyRate: 100,
  projectDurationWeeks: 4,
  revisionRounds: 2,
  scopeBuffer: 15,
  confidenceLevel: 'medium',
};

export const QUICK_MODE_DEFAULTS: Partial<ValueBasedPricingInputs> = {
  hourlyRate: 100,
  projectDurationWeeks: 4,
  revisionRounds: 2,
  scopeBuffer: 15,
  confidenceLevel: 'medium',
};
