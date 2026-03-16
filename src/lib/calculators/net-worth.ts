export type AssetCategory = 'cash' | 'investments' | 'real-estate' | 'vehicles' | 'other';
export type LiabilityCategory = 'mortgage' | 'student-loans' | 'credit-cards' | 'auto-loans' | 'other';

export interface Asset {
  id: string;
  name: string;
  value: number;
  category: AssetCategory;
  growthRate: number;
}

export interface Liability {
  id: string;
  name: string;
  balance: number;
  category: LiabilityCategory;
  interestRate: number;
}

export interface NetWorthInputs {
  assets: Asset[];
  liabilities: Liability[];
  projectionYears: number;
  annualContributions: number;
}

export interface AllocationItem {
  label: string;
  value: number;
}

export interface NetWorthResults {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetAllocation: AllocationItem[];
  liabilityBreakdown: AllocationItem[];
  debtToAssetRatio: number;
  projectedNetWorth: number;
  projectionData: { label: string; netWorth: number }[];
}

let idCounter = 0;
export function generateAssetId(): string {
  return `asset-${++idCounter}-${Date.now()}`;
}

let liabIdCounter = 0;
export function generateLiabilityId(): string {
  return `liab-${++liabIdCounter}-${Date.now()}`;
}

export const ASSET_CATEGORY_LABELS: Record<AssetCategory, string> = {
  'cash': 'Cash & Savings',
  'investments': 'Investments',
  'real-estate': 'Real Estate',
  'vehicles': 'Vehicles',
  'other': 'Other Assets',
};

export const LIABILITY_CATEGORY_LABELS: Record<LiabilityCategory, string> = {
  'mortgage': 'Mortgage',
  'student-loans': 'Student Loans',
  'credit-cards': 'Credit Cards',
  'auto-loans': 'Auto Loans',
  'other': 'Other Debts',
};

export const ASSET_CATEGORY_OPTIONS = Object.entries(ASSET_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const LIABILITY_CATEGORY_OPTIONS = Object.entries(LIABILITY_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const DEFAULT_ASSETS: Asset[] = [
  { id: 'asset-1', name: 'Checking Account', value: 5000, category: 'cash', growthRate: 0 },
  { id: 'asset-2', name: 'Savings Account', value: 15000, category: 'cash', growthRate: 4.5 },
  { id: 'asset-3', name: '401(k)', value: 45000, category: 'investments', growthRate: 7 },
  { id: 'asset-4', name: 'Brokerage Account', value: 20000, category: 'investments', growthRate: 7 },
  { id: 'asset-5', name: 'Home', value: 350000, category: 'real-estate', growthRate: 3 },
  { id: 'asset-6', name: 'Car', value: 18000, category: 'vehicles', growthRate: -15 },
];

export const DEFAULT_LIABILITIES: Liability[] = [
  { id: 'liab-1', name: 'Mortgage', balance: 280000, category: 'mortgage', interestRate: 6.5 },
  { id: 'liab-2', name: 'Student Loans', balance: 25000, category: 'student-loans', interestRate: 5 },
  { id: 'liab-3', name: 'Credit Card', balance: 3000, category: 'credit-cards', interestRate: 22 },
];

export const DEFAULT_INPUTS: NetWorthInputs = {
  assets: DEFAULT_ASSETS,
  liabilities: DEFAULT_LIABILITIES,
  projectionYears: 10,
  annualContributions: 12000,
};

export const QUICK_MODE_DEFAULTS: Partial<NetWorthInputs> = {
  projectionYears: 10,
  annualContributions: 0,
};

function groupByCategory<T extends { category: string }>(
  items: T[],
  valueKey: 'value' | 'balance',
  labels: Record<string, string>,
): AllocationItem[] {
  const groups = new Map<string, number>();
  for (const item of items) {
    const current = groups.get(item.category) ?? 0;
    groups.set(item.category, current + (item as unknown as Record<string, number>)[valueKey]);
  }
  return Array.from(groups.entries())
    .filter(([, v]) => v > 0)
    .map(([cat, val]) => ({ label: labels[cat] ?? cat, value: val }))
    .sort((a, b) => b.value - a.value);
}

export function calculateNetWorth(inputs: NetWorthInputs): NetWorthResults {
  const totalAssets = inputs.assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = inputs.liabilities.reduce((sum, l) => sum + l.balance, 0);
  const netWorth = totalAssets - totalLiabilities;

  const assetAllocation = groupByCategory(inputs.assets, 'value', ASSET_CATEGORY_LABELS);
  const liabilityBreakdown = groupByCategory(inputs.liabilities, 'balance', LIABILITY_CATEGORY_LABELS);

  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  // Projection: grow assets by their individual rates, reduce liabilities by payments
  const projectionData: { label: string; netWorth: number }[] = [
    { label: 'Now', netWorth },
  ];

  let projAssets = inputs.assets.map((a) => ({ ...a }));
  let projLiabilities = inputs.liabilities.map((l) => ({ ...l }));

  for (let year = 1; year <= inputs.projectionYears; year++) {
    // Grow assets
    for (const a of projAssets) {
      a.value = a.value * (1 + a.growthRate / 100);
    }

    // Add annual contributions proportionally to investment assets
    const investmentAssets = projAssets.filter((a) => a.category === 'investments');
    if (investmentAssets.length > 0 && inputs.annualContributions > 0) {
      const perAsset = inputs.annualContributions / investmentAssets.length;
      for (const a of investmentAssets) {
        a.value += perAsset;
      }
    }

    // Simple liability reduction: assume minimum payments reduce balance
    for (const l of projLiabilities) {
      // Rough estimate: assume 2% of balance paid annually minimum
      const payment = Math.max(l.balance * 0.02, 0);
      const interest = l.balance * (l.interestRate / 100);
      l.balance = Math.max(0, l.balance + interest - payment - (inputs.annualContributions > 0 ? 0 : 0));
      // For simplicity in projection, just accrue interest (liabilities persist unless actively paid)
      // This gives a conservative projection
    }

    const yearAssets = projAssets.reduce((s, a) => s + Math.max(0, a.value), 0);
    const yearLiabilities = projLiabilities.reduce((s, l) => s + l.balance, 0);
    projectionData.push({
      label: `Year ${year}`,
      netWorth: Math.round(yearAssets - yearLiabilities),
    });
  }

  const projectedNetWorth = projectionData[projectionData.length - 1].netWorth;

  return {
    totalAssets: Math.round(totalAssets),
    totalLiabilities: Math.round(totalLiabilities),
    netWorth: Math.round(netWorth),
    assetAllocation,
    liabilityBreakdown,
    debtToAssetRatio: Math.round(debtToAssetRatio * 10) / 10,
    projectedNetWorth: Math.round(projectedNetWorth),
    projectionData,
  };
}
