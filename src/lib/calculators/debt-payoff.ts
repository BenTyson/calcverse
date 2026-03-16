export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

export type PayoffStrategy = 'avalanche' | 'snowball';

export interface DebtPayoffInputs {
  debts: Debt[];
  extraMonthlyPayment: number;
  strategy: PayoffStrategy;
  lumpSumPayment: number;
}

export interface DebtPayoffResult {
  label: string;
  name: string;
  eliminationMonth: number;
}

export interface TimelinePoint {
  month: number;
  withExtra: number;
  minimumOnly: number;
}

export interface DebtPayoffResults {
  payoffMonths: number;
  payoffMonthsMinimumOnly: number;
  totalInterest: number;
  totalInterestMinimumOnly: number;
  interestSaved: number;
  monthsSaved: number;
  totalPaid: number;
  timeline: TimelinePoint[];
  debtOrder: DebtPayoffResult[];
  payoffDate: string;
}

let idCounter = 0;
export function generateId(): string {
  return `debt-${++idCounter}-${Date.now()}`;
}

export const DEFAULT_DEBTS: Debt[] = [
  { id: 'debt-1', name: 'Credit Card', balance: 5000, interestRate: 22, minimumPayment: 150 },
  { id: 'debt-2', name: 'Car Loan', balance: 15000, interestRate: 6.5, minimumPayment: 350 },
  { id: 'debt-3', name: 'Student Loan', balance: 25000, interestRate: 5, minimumPayment: 280 },
];

export const DEFAULT_INPUTS: DebtPayoffInputs = {
  debts: DEFAULT_DEBTS,
  extraMonthlyPayment: 200,
  strategy: 'avalanche',
  lumpSumPayment: 0,
};

export const QUICK_MODE_DEFAULTS: Partial<DebtPayoffInputs> = {
  strategy: 'avalanche',
  lumpSumPayment: 0,
};

function sortDebts(debts: Debt[], strategy: PayoffStrategy): Debt[] {
  return [...debts].sort((a, b) => {
    if (strategy === 'avalanche') return b.interestRate - a.interestRate;
    return a.balance - b.balance;
  });
}

function simulatePayoff(
  debts: Debt[],
  extraMonthly: number,
  strategy: PayoffStrategy,
  lumpSum: number,
): {
  months: number;
  totalInterest: number;
  totalPaid: number;
  timeline: TimelinePoint[];
  debtOrder: DebtPayoffResult[];
  minimumOnlyTimeline?: undefined;
} {
  if (debts.length === 0) {
    return { months: 0, totalInterest: 0, totalPaid: 0, timeline: [], debtOrder: [] };
  }

  const sorted = sortDebts(debts, strategy);
  const balances = new Map<string, number>();
  const paidOff = new Set<string>();
  const debtOrder: DebtPayoffResult[] = [];

  for (const d of debts) {
    balances.set(d.id, d.balance);
  }

  // Apply lump sum to target debt
  if (lumpSum > 0 && sorted.length > 0) {
    const target = sorted[0];
    const currentBal = balances.get(target.id) ?? 0;
    balances.set(target.id, Math.max(0, currentBal - lumpSum));
    if (balances.get(target.id)! <= 0) {
      paidOff.add(target.id);
      debtOrder.push({ label: `Month 0`, name: target.name, eliminationMonth: 0 });
    }
  }

  let month = 0;
  let totalInterest = 0;
  let totalPaid = lumpSum;
  const timeline: TimelinePoint[] = [];
  const MAX_MONTHS = 360;

  // Initial balance
  let totalBalance = 0;
  for (const [, bal] of balances) totalBalance += bal;
  timeline.push({ month: 0, withExtra: totalBalance, minimumOnly: totalBalance });

  while (totalBalance > 0 && month < MAX_MONTHS) {
    month++;

    // Apply interest
    for (const d of debts) {
      if (paidOff.has(d.id)) continue;
      const bal = balances.get(d.id) ?? 0;
      if (bal <= 0) continue;
      const interest = bal * (d.interestRate / 100 / 12);
      balances.set(d.id, bal + interest);
      totalInterest += interest;
    }

    // Pay minimums first
    let extraAvailable = extraMonthly;
    for (const d of debts) {
      if (paidOff.has(d.id)) continue;
      const bal = balances.get(d.id) ?? 0;
      if (bal <= 0) continue;
      const payment = Math.min(d.minimumPayment, bal);
      balances.set(d.id, bal - payment);
      totalPaid += payment;
      if (balances.get(d.id)! <= 0.01) {
        balances.set(d.id, 0);
        paidOff.add(d.id);
        debtOrder.push({ label: `Month ${month}`, name: d.name, eliminationMonth: month });
        // Freed minimum rolls into extra
        extraAvailable += d.minimumPayment;
      }
    }

    // Apply extra to target debt (re-sort remaining)
    const remaining = sortDebts(
      debts.filter((d) => !paidOff.has(d.id) && (balances.get(d.id) ?? 0) > 0),
      strategy
    );

    for (const d of remaining) {
      if (extraAvailable <= 0) break;
      const bal = balances.get(d.id) ?? 0;
      const extraPayment = Math.min(extraAvailable, bal);
      balances.set(d.id, bal - extraPayment);
      totalPaid += extraPayment;
      extraAvailable -= extraPayment;
      if (balances.get(d.id)! <= 0.01) {
        balances.set(d.id, 0);
        paidOff.add(d.id);
        if (!debtOrder.find((o) => o.name === d.name)) {
          debtOrder.push({ label: `Month ${month}`, name: d.name, eliminationMonth: month });
        }
        extraAvailable += d.minimumPayment;
      }
    }

    totalBalance = 0;
    for (const [, bal] of balances) totalBalance += bal;
    timeline.push({ month, withExtra: Math.max(0, Math.round(totalBalance * 100) / 100), minimumOnly: 0 });

    if (totalBalance <= 0.01) break;
  }

  return {
    months: month,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    timeline,
    debtOrder,
  };
}

function simulateMinimumOnly(debts: Debt[]): { months: number; totalInterest: number; timeline: number[] } {
  if (debts.length === 0) return { months: 0, totalInterest: 0, timeline: [0] };

  const balances = new Map<string, number>();
  const paidOff = new Set<string>();

  for (const d of debts) {
    balances.set(d.id, d.balance);
  }

  let month = 0;
  let totalInterest = 0;
  const timeline: number[] = [];
  const MAX_MONTHS = 360;

  let totalBalance = 0;
  for (const [, bal] of balances) totalBalance += bal;
  timeline.push(totalBalance);

  while (totalBalance > 0 && month < MAX_MONTHS) {
    month++;

    for (const d of debts) {
      if (paidOff.has(d.id)) continue;
      const bal = balances.get(d.id) ?? 0;
      if (bal <= 0) continue;
      const interest = bal * (d.interestRate / 100 / 12);
      balances.set(d.id, bal + interest);
      totalInterest += interest;
    }

    for (const d of debts) {
      if (paidOff.has(d.id)) continue;
      const bal = balances.get(d.id) ?? 0;
      if (bal <= 0) continue;
      const payment = Math.min(d.minimumPayment, bal);
      balances.set(d.id, bal - payment);
      if (balances.get(d.id)! <= 0.01) {
        balances.set(d.id, 0);
        paidOff.add(d.id);
      }
    }

    totalBalance = 0;
    for (const [, bal] of balances) totalBalance += bal;
    timeline.push(Math.max(0, Math.round(totalBalance * 100) / 100));

    if (totalBalance <= 0.01) break;
  }

  return { months: month, totalInterest: Math.round(totalInterest * 100) / 100, timeline };
}

export function calculateDebtPayoff(inputs: DebtPayoffInputs): DebtPayoffResults {
  const validDebts = inputs.debts.filter((d) => d.balance > 0);

  if (validDebts.length === 0) {
    return {
      payoffMonths: 0,
      payoffMonthsMinimumOnly: 0,
      totalInterest: 0,
      totalInterestMinimumOnly: 0,
      interestSaved: 0,
      monthsSaved: 0,
      totalPaid: 0,
      timeline: [{ month: 0, withExtra: 0, minimumOnly: 0 }],
      debtOrder: [],
      payoffDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
  }

  const result = simulatePayoff(validDebts, inputs.extraMonthlyPayment, inputs.strategy, inputs.lumpSumPayment);
  const minOnly = simulateMinimumOnly(validDebts);

  // Merge timelines
  const maxMonths = Math.max(result.timeline.length, minOnly.timeline.length);
  const timeline: TimelinePoint[] = [];
  for (let i = 0; i < maxMonths; i++) {
    timeline.push({
      month: i,
      withExtra: i < result.timeline.length ? result.timeline[i].withExtra : 0,
      minimumOnly: i < minOnly.timeline.length ? minOnly.timeline[i] : 0,
    });
  }

  // Sample timeline to keep chart manageable (max ~60 points)
  const sampledTimeline = sampleTimeline(timeline);

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + result.months);
  const payoffDateStr = payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return {
    payoffMonths: result.months,
    payoffMonthsMinimumOnly: minOnly.months,
    totalInterest: result.totalInterest,
    totalInterestMinimumOnly: minOnly.totalInterest,
    interestSaved: Math.max(0, minOnly.totalInterest - result.totalInterest),
    monthsSaved: Math.max(0, minOnly.months - result.months),
    totalPaid: result.totalPaid,
    timeline: sampledTimeline,
    debtOrder: result.debtOrder,
    payoffDate: payoffDateStr,
  };
}

function sampleTimeline(timeline: TimelinePoint[]): TimelinePoint[] {
  if (timeline.length <= 60) return timeline;

  const step = Math.ceil(timeline.length / 60);
  const sampled: TimelinePoint[] = [timeline[0]];
  for (let i = step; i < timeline.length - 1; i += step) {
    sampled.push(timeline[i]);
  }
  sampled.push(timeline[timeline.length - 1]);
  return sampled;
}
