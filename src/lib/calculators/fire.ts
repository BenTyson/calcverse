export interface FireInputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  annualIncome: number;
  savingsRate: number;
  expectedReturn: number;
  inflationRate: number;
  withdrawalRate: number;
}

export interface YearlyProjection {
  age: number;
  year: number;
  savings: number;
  contributions: number;
  growth: number;
}

export interface FireResults {
  fireNumber: number;
  yearsToFire: number;
  monthlyRequired: number;
  annualExpenses: number;
  coastFireAge: number;
  projectedSavingsAtRetirement: number;
  onTrack: boolean;
  timeline: YearlyProjection[];
}

export const DEFAULT_INPUTS: FireInputs = {
  currentAge: 30,
  retirementAge: 55,
  currentSavings: 50000,
  annualIncome: 80000,
  savingsRate: 25,
  expectedReturn: 7,
  inflationRate: 3,
  withdrawalRate: 4,
};

export function calculateFire(inputs: FireInputs): FireResults {
  const annualSavings = inputs.annualIncome * (inputs.savingsRate / 100);
  const annualExpenses = inputs.annualIncome - annualSavings;
  const fireNumber = annualExpenses / (inputs.withdrawalRate / 100);
  const realReturn = (1 + inputs.expectedReturn / 100) / (1 + inputs.inflationRate / 100) - 1;
  const monthlyRequired = annualSavings / 12;

  const targetYears = inputs.retirementAge - inputs.currentAge;
  const timeline: YearlyProjection[] = [];
  let savings = inputs.currentSavings;
  let yearsToFire = targetYears;
  let fireReached = false;

  for (let year = 0; year <= Math.max(targetYears, 50); year++) {
    const growth = savings * realReturn;
    const contributions = year === 0 ? 0 : annualSavings;

    timeline.push({
      age: inputs.currentAge + year,
      year,
      savings: Math.round(savings),
      contributions: Math.round(contributions),
      growth: Math.round(growth),
    });

    if (!fireReached && savings >= fireNumber && year > 0) {
      yearsToFire = year;
      fireReached = true;
    }

    savings += growth + (year === 0 ? 0 : annualSavings);

    if (year >= targetYears && fireReached) break;
    if (year >= 50) break;
  }

  if (!fireReached) {
    yearsToFire = targetYears;
  }

  const projectedSavingsAtRetirement = timeline.find(
    (t) => t.age === inputs.retirementAge
  )?.savings ?? savings;

  // Coast FIRE: age at which current savings alone (no more contributions)
  // will grow to FIRE number by retirement age
  let coastFireAge = inputs.retirementAge;
  if (realReturn > 0) {
    const yearsNeeded = Math.log(fireNumber / inputs.currentSavings) / Math.log(1 + realReturn);
    if (yearsNeeded > 0 && isFinite(yearsNeeded)) {
      const coastAge = inputs.currentAge + Math.ceil(yearsNeeded);
      // Coast FIRE only makes sense if it's before retirement
      if (coastAge <= inputs.retirementAge) {
        // Recalculate with contributions up to coast age
        let coastSavings = inputs.currentSavings;
        for (let y = 1; y <= coastAge - inputs.currentAge; y++) {
          coastSavings = coastSavings * (1 + realReturn) + annualSavings;
        }
        // Check if coast savings can grow to FIRE number without contributions
        const remainingYears = inputs.retirementAge - coastAge;
        const projectedCoast = coastSavings * Math.pow(1 + realReturn, remainingYears);
        if (projectedCoast >= fireNumber) {
          coastFireAge = coastAge;
        }
      }
    }
  }

  return {
    fireNumber: Math.round(fireNumber),
    yearsToFire,
    monthlyRequired: Math.round(monthlyRequired),
    annualExpenses: Math.round(annualExpenses),
    coastFireAge,
    projectedSavingsAtRetirement: Math.round(projectedSavingsAtRetirement),
    onTrack: projectedSavingsAtRetirement >= fireNumber,
    timeline: timeline.slice(0, Math.max(targetYears + 1, yearsToFire + 2)),
  };
}
