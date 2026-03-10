export type SubFrequency = 'monthly' | 'annual';
export type SubCategory = 'essential' | 'nice-to-have' | 'unnecessary';

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  frequency: SubFrequency;
  category: SubCategory;
}

export interface SubscriptionAuditInputs {
  subscriptions: Subscription[];
}

export interface SubscriptionAuditResults {
  totalMonthly: number;
  totalAnnual: number;
  essentialMonthly: number;
  niceToHaveMonthly: number;
  unnecessaryMonthly: number;
  potentialSavings: number;
  potentialAnnualSavings: number;
  subscriptionCount: number;
}

let idCounter = 0;
export function generateId(): string {
  return `sub-${++idCounter}-${Date.now()}`;
}

export const DEFAULT_SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub-1', name: 'Netflix', cost: 15.99, frequency: 'monthly', category: 'nice-to-have' },
  { id: 'sub-2', name: 'Spotify', cost: 10.99, frequency: 'monthly', category: 'nice-to-have' },
  { id: 'sub-3', name: 'iCloud', cost: 2.99, frequency: 'monthly', category: 'essential' },
  { id: 'sub-4', name: 'Gym', cost: 40, frequency: 'monthly', category: 'nice-to-have' },
  { id: 'sub-5', name: 'Adobe Creative Cloud', cost: 54.99, frequency: 'monthly', category: 'essential' },
  { id: 'sub-6', name: 'Meal Kit Service', cost: 60, frequency: 'monthly', category: 'unnecessary' },
];

export const DEFAULT_INPUTS: SubscriptionAuditInputs = {
  subscriptions: DEFAULT_SUBSCRIPTIONS,
};

function toMonthly(cost: number, frequency: SubFrequency): number {
  return frequency === 'annual' ? cost / 12 : cost;
}

export function calculateSubscriptionAudit(
  inputs: SubscriptionAuditInputs
): SubscriptionAuditResults {
  let essentialMonthly = 0;
  let niceToHaveMonthly = 0;
  let unnecessaryMonthly = 0;

  for (const sub of inputs.subscriptions) {
    const monthly = toMonthly(sub.cost, sub.frequency);
    switch (sub.category) {
      case 'essential':
        essentialMonthly += monthly;
        break;
      case 'nice-to-have':
        niceToHaveMonthly += monthly;
        break;
      case 'unnecessary':
        unnecessaryMonthly += monthly;
        break;
    }
  }

  const totalMonthly = essentialMonthly + niceToHaveMonthly + unnecessaryMonthly;
  const potentialSavings = unnecessaryMonthly + niceToHaveMonthly;

  return {
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    totalAnnual: Math.round(totalMonthly * 12 * 100) / 100,
    essentialMonthly: Math.round(essentialMonthly * 100) / 100,
    niceToHaveMonthly: Math.round(niceToHaveMonthly * 100) / 100,
    unnecessaryMonthly: Math.round(unnecessaryMonthly * 100) / 100,
    potentialSavings: Math.round(potentialSavings * 100) / 100,
    potentialAnnualSavings: Math.round(potentialSavings * 12 * 100) / 100,
    subscriptionCount: inputs.subscriptions.length,
  };
}
