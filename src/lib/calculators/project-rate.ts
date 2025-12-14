// Project Rate Calculator
// Convert hourly rate to project-based pricing

export interface ProjectRateInputs {
  // Quick mode
  hourlyRate: number;
  estimatedHours: number;

  // Advanced mode
  complexityMultiplier: number; // 1.0 = standard, 1.25 = complex, 1.5 = very complex
  rushMultiplier: number; // 1.0 = standard, 1.25 = rush, 1.5 = urgent
  revisionRounds: number;
  hoursPerRevision: number;
  scopeBuffer: number; // Percentage buffer for scope creep (e.g., 20%)
  expenses: number; // Pass-through costs
  profitMargin: number; // Additional profit margin percentage
}

export interface ProjectRateResults {
  basePrice: number;
  complexityAdjustment: number;
  rushAdjustment: number;
  revisionCost: number;
  scopeBufferAmount: number;
  expensesTotal: number;
  profitAmount: number;
  totalProjectPrice: number;
  effectiveHourlyRate: number;
  pricePerDeliverable: number;
  breakdown: {
    label: string;
    value: number;
  }[];
  pricingTiers: {
    label: string;
    price: number;
    description: string;
  }[];
}

export function calculateProjectRate(inputs: ProjectRateInputs): ProjectRateResults {
  // Base price from hourly rate
  const basePrice = inputs.hourlyRate * inputs.estimatedHours;

  // Complexity adjustment (applied to base)
  const complexityAdjustment = basePrice * (inputs.complexityMultiplier - 1);

  // Rush adjustment (applied to base)
  const rushAdjustment = basePrice * (inputs.rushMultiplier - 1);

  // Revision costs
  const revisionCost = inputs.revisionRounds * inputs.hoursPerRevision * inputs.hourlyRate;

  // Subtotal before buffer and margin
  const subtotal = basePrice + complexityAdjustment + rushAdjustment + revisionCost;

  // Scope buffer
  const scopeBufferAmount = subtotal * (inputs.scopeBuffer / 100);

  // Subtotal with buffer
  const subtotalWithBuffer = subtotal + scopeBufferAmount;

  // Expenses (pass-through)
  const expensesTotal = inputs.expenses;

  // Profit margin (applied to subtotal with buffer, not expenses)
  const profitAmount = subtotalWithBuffer * (inputs.profitMargin / 100);

  // Total project price
  const totalProjectPrice = subtotalWithBuffer + profitAmount + expensesTotal;

  // Effective hourly rate (total / estimated hours)
  const totalHours = inputs.estimatedHours + (inputs.revisionRounds * inputs.hoursPerRevision);
  const effectiveHourlyRate = totalProjectPrice / totalHours;

  // Price per deliverable (assuming project is one deliverable)
  const pricePerDeliverable = totalProjectPrice;

  // Generate pricing tiers (budget, standard, premium)
  const pricingTiers = [
    {
      label: 'Budget',
      price: Math.round(totalProjectPrice * 0.75),
      description: 'Reduced scope, fewer revisions',
    },
    {
      label: 'Standard',
      price: Math.round(totalProjectPrice),
      description: 'Full scope as estimated',
    },
    {
      label: 'Premium',
      price: Math.round(totalProjectPrice * 1.35),
      description: 'Priority delivery, extra revisions',
    },
  ];

  return {
    basePrice,
    complexityAdjustment,
    rushAdjustment,
    revisionCost,
    scopeBufferAmount,
    expensesTotal,
    profitAmount,
    totalProjectPrice,
    effectiveHourlyRate,
    pricePerDeliverable,
    breakdown: [
      { label: 'Base Price (Hours × Rate)', value: basePrice },
      { label: 'Complexity Adjustment', value: complexityAdjustment },
      { label: 'Rush Fee', value: rushAdjustment },
      { label: 'Revision Budget', value: revisionCost },
      { label: 'Scope Buffer', value: scopeBufferAmount },
      { label: 'Profit Margin', value: profitAmount },
      { label: 'Expenses', value: expensesTotal },
    ],
    pricingTiers,
  };
}

export const DEFAULT_INPUTS: ProjectRateInputs = {
  hourlyRate: 100,
  estimatedHours: 20,
  complexityMultiplier: 1.0,
  rushMultiplier: 1.0,
  revisionRounds: 2,
  hoursPerRevision: 2,
  scopeBuffer: 15,
  expenses: 0,
  profitMargin: 10,
};

export const QUICK_MODE_DEFAULTS: Partial<ProjectRateInputs> = {
  complexityMultiplier: 1.0,
  rushMultiplier: 1.0,
  revisionRounds: 2,
  hoursPerRevision: 2,
  scopeBuffer: 15,
  expenses: 0,
  profitMargin: 10,
};

export const COMPLEXITY_OPTIONS = [
  { value: 1.0, label: 'Standard' },
  { value: 1.15, label: 'Moderate (+15%)' },
  { value: 1.25, label: 'Complex (+25%)' },
  { value: 1.5, label: 'Very Complex (+50%)' },
];

export const RUSH_OPTIONS = [
  { value: 1.0, label: 'Standard Timeline' },
  { value: 1.25, label: 'Rush (+25%)' },
  { value: 1.5, label: 'Urgent (+50%)' },
  { value: 2.0, label: 'Emergency (+100%)' },
];
