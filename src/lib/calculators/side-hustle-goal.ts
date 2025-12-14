export interface SideHustleGoalInputs {
  goalAmount: number;
  currentSavings: number;
  weeklyHours: number;
  hourlyRate: number;
  monthlyGrowthRate: number;
  expenseRate: number;
}

export interface Milestone {
  percentage: number;
  month: number;
  date: Date;
  amount: number;
}

export interface MonthlyProjection {
  month: number;
  earnings: number;
  cumulative: number;
  rate: number;
}

export interface SideHustleGoalResults {
  monthsToGoal: number;
  targetDate: Date;
  totalEarned: number;
  totalHoursWorked: number;
  timeline: MonthlyProjection[];
  milestones: Milestone[];
  averageMonthlyEarnings: number;
  finalHourlyRate: number;
}

export const DEFAULT_INPUTS: SideHustleGoalInputs = {
  goalAmount: 10000,
  currentSavings: 0,
  weeklyHours: 10,
  hourlyRate: 25,
  monthlyGrowthRate: 5,
  expenseRate: 10,
};

const WEEKS_PER_MONTH = 4.33;
const MAX_MONTHS = 120; // Cap at 10 years

export function calculateSideHustleGoal(
  inputs: SideHustleGoalInputs
): SideHustleGoalResults {
  const remainingGoal = inputs.goalAmount - inputs.currentSavings;

  if (remainingGoal <= 0) {
    return {
      monthsToGoal: 0,
      targetDate: new Date(),
      totalEarned: 0,
      totalHoursWorked: 0,
      timeline: [],
      milestones: [{ percentage: 100, month: 0, date: new Date(), amount: inputs.goalAmount }],
      averageMonthlyEarnings: 0,
      finalHourlyRate: inputs.hourlyRate,
    };
  }

  let cumulative = inputs.currentSavings;
  let month = 0;
  let currentRate = inputs.hourlyRate;
  const timeline: MonthlyProjection[] = [];
  const milestones: Milestone[] = [];
  const milestoneTargets = [25, 50, 75, 100];
  let totalHours = 0;

  // Project month by month until goal is reached
  while (cumulative < inputs.goalAmount && month < MAX_MONTHS) {
    month++;

    // Calculate monthly gross earnings
    const monthlyHours = inputs.weeklyHours * WEEKS_PER_MONTH;
    const grossEarnings = monthlyHours * currentRate;

    // Calculate net after expenses
    const netSaved = grossEarnings * (1 - inputs.expenseRate / 100);

    cumulative += netSaved;
    totalHours += monthlyHours;

    timeline.push({
      month,
      earnings: netSaved,
      cumulative: Math.min(cumulative, inputs.goalAmount),
      rate: currentRate,
    });

    // Check milestones
    const currentPercentage = (cumulative / inputs.goalAmount) * 100;
    for (const target of milestoneTargets) {
      if (
        currentPercentage >= target &&
        !milestones.find((m) => m.percentage === target)
      ) {
        const date = new Date();
        date.setMonth(date.getMonth() + month);
        milestones.push({
          percentage: target,
          month,
          date,
          amount: inputs.goalAmount * (target / 100),
        });
      }
    }

    // Apply growth rate for next month
    currentRate *= 1 + inputs.monthlyGrowthRate / 100;
  }

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + month);

  const totalEarned = cumulative - inputs.currentSavings;
  const averageMonthlyEarnings = month > 0 ? totalEarned / month : 0;

  return {
    monthsToGoal: month,
    targetDate,
    totalEarned: Math.round(totalEarned),
    totalHoursWorked: Math.round(totalHours),
    timeline: timeline.slice(0, 24), // Return first 2 years for display
    milestones,
    averageMonthlyEarnings: Math.round(averageMonthlyEarnings),
    finalHourlyRate: Math.round(currentRate * 100) / 100,
  };
}
