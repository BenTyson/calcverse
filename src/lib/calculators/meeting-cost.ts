export interface MeetingCostInputs {
  hourlyRate: number;
  meetingDuration: number;
  meetingsPerWeek: number;
  attendees: number;
  avgAttendeeRate: number;
  prepTime: number;
  followUpTime: number;
  recoveryTime: number;
  weeksPerYear: number;
}

export interface MeetingCostResults {
  costPerMeeting: number;
  totalTimePerMeeting: number;
  weeklyMeetingCost: number;
  weeklyMeetingHours: number;
  annualMeetingCost: number;
  annualMeetingHours: number;
  opportunityCostPerMeeting: number;
  annualOpportunityCost: number;
  percentOfWorkWeek: number;
  breakdown: { label: string; amount: number; isDeduction?: boolean }[];
}

export function calculateMeetingCost(inputs: MeetingCostInputs): MeetingCostResults {
  const totalTimePerMeeting =
    inputs.meetingDuration + inputs.prepTime + inputs.followUpTime + inputs.recoveryTime;

  const yourCostPerMeeting = (totalTimePerMeeting / 60) * inputs.hourlyRate;
  const attendeeCostPerMeeting =
    (inputs.meetingDuration / 60) * inputs.avgAttendeeRate * Math.max(0, inputs.attendees - 1);
  const costPerMeeting = yourCostPerMeeting + attendeeCostPerMeeting;

  const weeklyMeetingCost = costPerMeeting * inputs.meetingsPerWeek;
  const weeklyMeetingHours = (totalTimePerMeeting * inputs.meetingsPerWeek) / 60;

  const annualMeetingCost = Math.round(weeklyMeetingCost * inputs.weeksPerYear * 100) / 100;
  const annualMeetingHours = Math.round(weeklyMeetingHours * inputs.weeksPerYear * 10) / 10;

  const opportunityCostPerMeeting = (totalTimePerMeeting / 60) * inputs.hourlyRate;
  const annualOpportunityCost = Math.round(
    opportunityCostPerMeeting * inputs.meetingsPerWeek * inputs.weeksPerYear * 100
  ) / 100;

  const percentOfWorkWeek = Math.round((weeklyMeetingHours / 40) * 1000) / 10;

  const meetingTimeCost = (inputs.meetingDuration / 60) * inputs.hourlyRate;
  const prepTimeCost = (inputs.prepTime / 60) * inputs.hourlyRate;
  const followUpCost = (inputs.followUpTime / 60) * inputs.hourlyRate;
  const recoveryCost = (inputs.recoveryTime / 60) * inputs.hourlyRate;

  return {
    costPerMeeting: Math.round(costPerMeeting * 100) / 100,
    totalTimePerMeeting,
    weeklyMeetingCost: Math.round(weeklyMeetingCost * 100) / 100,
    weeklyMeetingHours: Math.round(weeklyMeetingHours * 10) / 10,
    annualMeetingCost,
    annualMeetingHours,
    opportunityCostPerMeeting: Math.round(opportunityCostPerMeeting * 100) / 100,
    annualOpportunityCost,
    percentOfWorkWeek,
    breakdown: [
      { label: 'Meeting Time', amount: Math.round(meetingTimeCost * 100) / 100 },
      { label: 'Prep Time', amount: Math.round(prepTimeCost * 100) / 100 },
      { label: 'Follow-up Time', amount: Math.round(followUpCost * 100) / 100 },
      { label: 'Context Switching', amount: Math.round(recoveryCost * 100) / 100 },
      { label: 'Other Attendees', amount: Math.round(attendeeCostPerMeeting * 100) / 100 },
    ],
  };
}

export const DEFAULT_INPUTS: MeetingCostInputs = {
  hourlyRate: 100,
  meetingDuration: 60,
  meetingsPerWeek: 5,
  attendees: 3,
  avgAttendeeRate: 75,
  prepTime: 10,
  followUpTime: 15,
  recoveryTime: 10,
  weeksPerYear: 48,
};

export const QUICK_MODE_DEFAULTS: Partial<MeetingCostInputs> = {
  attendees: 3,
  avgAttendeeRate: 75,
  prepTime: 10,
  followUpTime: 15,
  recoveryTime: 10,
  weeksPerYear: 48,
};
