export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'expert' | 'thought-leader';
export type Industry = 'technology' | 'marketing' | 'finance' | 'healthcare' | 'legal' | 'design' | 'management' | 'other';

export interface ConsultingFeeInputs {
  experienceLevel: ExperienceLevel;
  industry: Industry;
  locationFactor: number;
  specializationPremium: number;
  hoursPerDay: number;
  daysPerProject: number;
  monthlyHours: number;
  valueMultiplier: number;
  travelPremium: number;
  rushMultiplier: number;
  billableWeeksPerYear: number;
}

export interface ConsultingFeeResults {
  hourlyRate: number;
  dailyRate: number;
  projectRate: number;
  monthlyRetainer: number;
  rushHourlyRate: number;
  annualRevenue: number;
  comparisonData: { label: string; rate: number }[];
  breakdown: { label: string; value: string }[];
}

export const EXPERIENCE_OPTIONS = [
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-Level (3-5 years)' },
  { value: 'senior', label: 'Senior (6-10 years)' },
  { value: 'expert', label: 'Expert (10-15 years)' },
  { value: 'thought-leader', label: 'Thought Leader (15+ years)' },
];

export const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology' },
  { value: 'marketing', label: 'Marketing & PR' },
  { value: 'finance', label: 'Finance & Accounting' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'legal', label: 'Legal' },
  { value: 'design', label: 'Design & Creative' },
  { value: 'management', label: 'Management Consulting' },
  { value: 'other', label: 'Other' },
];

const BASE_RATES: Record<ExperienceLevel, number> = {
  'junior': 75,
  'mid': 125,
  'senior': 200,
  'expert': 300,
  'thought-leader': 450,
};

const INDUSTRY_MULTIPLIERS: Record<Industry, number> = {
  'technology': 1.15,
  'marketing': 1.0,
  'finance': 1.2,
  'healthcare': 1.1,
  'legal': 1.25,
  'design': 0.95,
  'management': 1.3,
  'other': 1.0,
};

export function calculateConsultingFee(inputs: ConsultingFeeInputs): ConsultingFeeResults {
  const baseRate = BASE_RATES[inputs.experienceLevel];
  const industryMultiplier = INDUSTRY_MULTIPLIERS[inputs.industry];
  const locationMultiplier = inputs.locationFactor / 100;
  const specPremium = 1 + inputs.specializationPremium / 100;
  const valueMultiplier = inputs.valueMultiplier / 100;

  const hourlyRate = Math.round(baseRate * industryMultiplier * locationMultiplier * specPremium * valueMultiplier);
  const dailyRate = Math.round(hourlyRate * inputs.hoursPerDay);
  const projectRate = Math.round(dailyRate * inputs.daysPerProject);
  const monthlyRetainer = Math.round(hourlyRate * inputs.monthlyHours);
  const rushHourlyRate = Math.round(hourlyRate * (inputs.rushMultiplier / 100));
  const annualRevenue = Math.round(hourlyRate * inputs.hoursPerDay * 5 * inputs.billableWeeksPerYear);

  const travelRate = Math.round(hourlyRate * (1 + inputs.travelPremium / 100));

  const breakdown: { label: string; value: string }[] = [
    { label: 'Base Rate', value: `$${baseRate}/hr` },
    { label: 'Industry Multiplier', value: `${industryMultiplier}x` },
    { label: 'Location Factor', value: `${inputs.locationFactor}%` },
    { label: 'Specialization Premium', value: `+${inputs.specializationPremium}%` },
  ];

  if (inputs.valueMultiplier !== 100) {
    breakdown.push({ label: 'Value Multiplier', value: `${inputs.valueMultiplier}%` });
  }

  if (inputs.travelPremium > 0) {
    breakdown.push({ label: 'Travel Rate', value: `$${travelRate}/hr` });
  }

  const comparisonData = [
    { label: 'Hourly', rate: hourlyRate },
    { label: 'Daily', rate: dailyRate },
    { label: 'Project', rate: projectRate },
    { label: 'Retainer', rate: monthlyRetainer },
  ];

  return {
    hourlyRate,
    dailyRate,
    projectRate,
    monthlyRetainer,
    rushHourlyRate,
    annualRevenue,
    comparisonData,
    breakdown,
  };
}

export const DEFAULT_INPUTS: ConsultingFeeInputs = {
  experienceLevel: 'senior',
  industry: 'technology',
  locationFactor: 100,
  specializationPremium: 10,
  hoursPerDay: 8,
  daysPerProject: 10,
  monthlyHours: 40,
  valueMultiplier: 100,
  travelPremium: 25,
  rushMultiplier: 150,
  billableWeeksPerYear: 46,
};

export const QUICK_MODE_DEFAULTS: Partial<ConsultingFeeInputs> = {
  valueMultiplier: 100,
  travelPremium: 0,
  rushMultiplier: 150,
  billableWeeksPerYear: 46,
};
