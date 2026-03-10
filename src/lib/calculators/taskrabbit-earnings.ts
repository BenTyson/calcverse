export interface TaskRabbitInputs {
  tasksPerWeek: number;
  averageHourlyRate: number;
  averageHoursPerTask: number;
  serviceFeePercent: number;
  travelTimePerTask: number;
  travelCostPerTask: number;
  suppliesCostPerMonth: number;
  taskCategory: string;
}

export interface TaskRabbitResults {
  weeklyGross: number;
  serviceFee: number;
  weeklyTravel: number;
  weeklySupplies: number;
  weeklyNet: number;
  monthlyNet: number;
  annualNet: number;
  effectiveHourlyRate: number;
  perTaskNet: number;
  totalWeeklyHours: number;
  breakdown: {
    label: string;
    amount: number;
    isDeduction?: boolean;
  }[];
}

export const DEFAULT_INPUTS: TaskRabbitInputs = {
  tasksPerWeek: 8,
  averageHourlyRate: 40,
  averageHoursPerTask: 2,
  serviceFeePercent: 15,
  travelTimePerTask: 0.5,
  travelCostPerTask: 5,
  suppliesCostPerMonth: 50,
  taskCategory: 'general',
};

export const TASK_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'handyman', label: 'Handyman' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'moving', label: 'Moving' },
  { value: 'furniture-assembly', label: 'Furniture Assembly' },
  { value: 'yard-work', label: 'Yard Work' },
];

export function calculateTaskRabbitEarnings(
  inputs: TaskRabbitInputs
): TaskRabbitResults {
  const weeklyGross = inputs.tasksPerWeek * inputs.averageHourlyRate * inputs.averageHoursPerTask;

  const serviceFee = weeklyGross * (inputs.serviceFeePercent / 100);

  const weeklyTravel = inputs.tasksPerWeek * inputs.travelCostPerTask;

  const weeklySupplies = inputs.suppliesCostPerMonth / 4.33;

  const weeklyNet = weeklyGross - serviceFee - weeklyTravel - weeklySupplies;
  const monthlyNet = weeklyNet * 4.33;
  const annualNet = weeklyNet * 52;

  const totalWeeklyHours = inputs.tasksPerWeek * (inputs.averageHoursPerTask + inputs.travelTimePerTask);
  const effectiveHourlyRate = totalWeeklyHours > 0 ? weeklyNet / totalWeeklyHours : 0;

  const perTaskNet = inputs.tasksPerWeek > 0 ? weeklyNet / inputs.tasksPerWeek : 0;

  return {
    weeklyGross: Math.round(weeklyGross * 100) / 100,
    serviceFee: Math.round(serviceFee * 100) / 100,
    weeklyTravel: Math.round(weeklyTravel * 100) / 100,
    weeklySupplies: Math.round(weeklySupplies * 100) / 100,
    weeklyNet: Math.round(weeklyNet * 100) / 100,
    monthlyNet: Math.round(monthlyNet * 100) / 100,
    annualNet: Math.round(annualNet * 100) / 100,
    effectiveHourlyRate: Math.round(effectiveHourlyRate * 100) / 100,
    perTaskNet: Math.round(perTaskNet * 100) / 100,
    totalWeeklyHours: Math.round(totalWeeklyHours * 10) / 10,
    breakdown: [
      { label: 'Task Earnings', amount: Math.round(weeklyGross * 100) / 100 },
      { label: 'Service Fee', amount: Math.round(serviceFee * 100) / 100, isDeduction: true },
      { label: 'Travel Costs', amount: Math.round(weeklyTravel * 100) / 100, isDeduction: true },
      { label: 'Supplies', amount: Math.round(weeklySupplies * 100) / 100, isDeduction: true },
    ],
  };
}
