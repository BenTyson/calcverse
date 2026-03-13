export interface FreelanceWritingRateInputs {
  wordCount: number;
  hoursToWrite: number;
  desiredHourlyRate: number;
  experienceLevel: string;
  researchHours: number;
  revisionRounds: number;
  revisionHoursPerRound: number;
  adminTimePercent: number;
  clientAcquisitionCost: number;
}

export interface FreelanceWritingRateResults {
  perWordRate: number;
  perArticleRate: number;
  effectiveHourlyRate: number;
  monthlyIncome4: number;
  monthlyIncome8: number;
  totalHours: number;
  writingHours: number;
  researchHours: number;
  revisionHours: number;
  adminHours: number;
  breakdown: {
    label: string;
    amount: number;
  }[];
}

export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
];

export const DEFAULT_INPUTS: FreelanceWritingRateInputs = {
  wordCount: 1500,
  hoursToWrite: 4,
  desiredHourlyRate: 50,
  experienceLevel: 'intermediate',
  researchHours: 1,
  revisionRounds: 1,
  revisionHoursPerRound: 0.5,
  adminTimePercent: 10,
  clientAcquisitionCost: 0,
};

export function formatPerWordRate(rate: number): string {
  return `$${rate.toFixed(4)}`;
}

export function calculateFreelanceWritingRate(
  inputs: FreelanceWritingRateInputs
): FreelanceWritingRateResults {
  const writingHours = inputs.hoursToWrite;
  const researchHours = inputs.researchHours;
  const revisionHours = inputs.revisionRounds * inputs.revisionHoursPerRound;
  const totalProductiveHours = writingHours + researchHours + revisionHours;
  const adminHours = totalProductiveHours * (inputs.adminTimePercent / 100);
  const totalHours = totalProductiveHours + adminHours;

  const perArticleRate = totalHours * inputs.desiredHourlyRate + inputs.clientAcquisitionCost;
  const perWordRate = inputs.wordCount > 0 ? perArticleRate / inputs.wordCount : 0;
  const effectiveHourlyRate = totalHours > 0 ? perArticleRate / totalHours : 0;
  const monthlyIncome4 = perArticleRate * 4;
  const monthlyIncome8 = perArticleRate * 8;

  return {
    perWordRate: Math.round(perWordRate * 10000) / 10000,
    perArticleRate: Math.round(perArticleRate * 100) / 100,
    effectiveHourlyRate: Math.round(effectiveHourlyRate * 100) / 100,
    monthlyIncome4: Math.round(monthlyIncome4 * 100) / 100,
    monthlyIncome8: Math.round(monthlyIncome8 * 100) / 100,
    totalHours: Math.round(totalHours * 100) / 100,
    writingHours: Math.round(writingHours * 100) / 100,
    researchHours: Math.round(researchHours * 100) / 100,
    revisionHours: Math.round(revisionHours * 100) / 100,
    adminHours: Math.round(adminHours * 100) / 100,
    breakdown: [
      { label: 'Writing Hours', amount: Math.round(writingHours * 100) / 100 },
      { label: 'Research Hours', amount: Math.round(researchHours * 100) / 100 },
      { label: 'Revision Hours', amount: Math.round(revisionHours * 100) / 100 },
      { label: 'Admin Hours', amount: Math.round(adminHours * 100) / 100 },
      { label: 'Total Hours', amount: Math.round(totalHours * 100) / 100 },
    ],
  };
}
