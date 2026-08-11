/**
 * Federal tax constants for TAX YEAR 2026.
 *
 * ---------------------------------------------------------------------------
 * SOURCES — every figure below was read from one of these primary documents.
 * Do not change a number here without re-reading the source it came from.
 * ---------------------------------------------------------------------------
 *
 * [1] IRS Rev. Proc. 2025-32 (2026 inflation adjustments, as amended by the
 *     One, Big, Beautiful Bill Act, Pub. L. 119-21)
 *     https://www.irs.gov/pub/irs-drop/rp-25-32.pdf
 *     - § 4.01  Tax rate tables ......... TAX_BRACKETS
 *     - § 4.03  Maximum capital gains ... LONG_TERM_CG_BRACKETS
 *     - § 4.14  Standard deduction ...... STANDARD_DEDUCTIONS
 *     - § 4.26  Qualified business income  QBI_THRESHOLDS
 *
 * [2] IRS Topic no. 751, Social Security and Medicare withholding rates
 *     https://www.irs.gov/taxtopics/tc751
 *     - 2026 Social Security wage base ($184,500), 6.2% / 1.45% rates
 *     The wage base is set by SSA, not the IRS Rev. Proc. — it is the OASDI
 *     contribution and benefit base determined under § 230 of the Social
 *     Security Act and published at 90 FR (Docket No. SSA-2025-0255),
 *     "Cost-of-Living Increase and Other Determinations for 2026."
 *
 * [3] IRS Questions and Answers on the Net Investment Income Tax
 *     https://www.irs.gov/newsroom/questions-and-answers-on-the-net-investment-income-tax
 *     - 3.8% rate and the MAGI thresholds, which that page states explicitly
 *       are NOT indexed for inflation.
 *
 * [4] IRS Topic no. 560, Additional Medicare Tax
 *     https://www.irs.gov/taxtopics/tc560
 *     - 0.9% rate and the statutory thresholds (also not indexed).
 *
 * [5] IRS Instructions for Schedule SE (2025 edition — the 92.35% adjustment
 *     and 15.3% combined rate are statutory and unchanged for 2026)
 *     https://www.irs.gov/pub/irs-pdf/i1040sse.pdf
 *
 * Last verified against the above: August 9, 2026.
 *
 * WHEN UPDATING: bump TAX_YEAR, re-read [1] for the new Rev. Proc., re-read
 * [2] for the new wage base, and update `lastVerified` in the SourcesBlock on
 * every page that renders one (grep for `SourcesBlock`).
 */

/** The tax year every figure in this module represents. Drives the
 *  `taxYear` prop on SourcesBlock so pages can't drift out of sync. */
export const TAX_YEAR = '2026';

/** Date the figures in this module were last checked against the primary
 *  sources listed above. Rendered to users via SourcesBlock. */
export const TAX_DATA_LAST_VERIFIED = 'August 9, 2026';

export type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_household';

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

// 2026 Federal Tax Brackets — Rev. Proc. 2025-32 § 4.01, Tables 1–4. [1]
// The OBBBA (§ 70101) made the seven-rate 10/12/22/24/32/35/37 structure
// permanent, so only the thresholds move with inflation from here.
export const TAX_BRACKETS: Record<FilingStatus, TaxBracket[]> = {
  // Table 3 — Unmarried Individuals
  single: [
    { min: 0, max: 12400, rate: 0.10 },
    { min: 12400, max: 50400, rate: 0.12 },
    { min: 50400, max: 105700, rate: 0.22 },
    { min: 105700, max: 201775, rate: 0.24 },
    { min: 201775, max: 256225, rate: 0.32 },
    { min: 256225, max: 640600, rate: 0.35 },
    { min: 640600, max: Infinity, rate: 0.37 },
  ],
  // Table 1 — Married Filing Jointly and Surviving Spouses
  married_joint: [
    { min: 0, max: 24800, rate: 0.10 },
    { min: 24800, max: 100800, rate: 0.12 },
    { min: 100800, max: 211400, rate: 0.22 },
    { min: 211400, max: 403550, rate: 0.24 },
    { min: 403550, max: 512450, rate: 0.32 },
    { min: 512450, max: 768700, rate: 0.35 },
    { min: 768700, max: Infinity, rate: 0.37 },
  ],
  // Table 4 — Married Filing Separately (diverges from single only at 35%/37%)
  married_separate: [
    { min: 0, max: 12400, rate: 0.10 },
    { min: 12400, max: 50400, rate: 0.12 },
    { min: 50400, max: 105700, rate: 0.22 },
    { min: 105700, max: 201775, rate: 0.24 },
    { min: 201775, max: 256225, rate: 0.32 },
    { min: 256225, max: 384350, rate: 0.35 },
    { min: 384350, max: Infinity, rate: 0.37 },
  ],
  // Table 2 — Heads of Households. Note the 24%/32% breakpoints are $201,750
  // and $256,200 — $25 below the single-filer figures, not a typo.
  head_household: [
    { min: 0, max: 17700, rate: 0.10 },
    { min: 17700, max: 67450, rate: 0.12 },
    { min: 67450, max: 105700, rate: 0.22 },
    { min: 105700, max: 201750, rate: 0.24 },
    { min: 201750, max: 256200, rate: 0.32 },
    { min: 256200, max: 640600, rate: 0.35 },
    { min: 640600, max: Infinity, rate: 0.37 },
  ],
};

// 2026 standard deduction — Rev. Proc. 2025-32 § 4.14(1). [1]
// OBBBA § 70102 made the TCJA increases permanent and further raised the base
// amounts, so these are larger than a pure inflation adjustment would give.
export const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = {
  single: 16100,
  married_joint: 32200,
  married_separate: 16100,
  head_household: 24150,
};

// 2026 Long-Term Capital Gains brackets — Rev. Proc. 2025-32 § 4.03. [1]
// The Rev. Proc. states a "maximum zero rate amount" and a "maximum 15 percent
// rate amount"; those are the two breakpoints below.
export const LONG_TERM_CG_BRACKETS: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { min: 0, max: 49450, rate: 0 },
    { min: 49450, max: 545500, rate: 0.15 },
    { min: 545500, max: Infinity, rate: 0.20 },
  ],
  married_joint: [
    { min: 0, max: 98900, rate: 0 },
    { min: 98900, max: 613700, rate: 0.15 },
    { min: 613700, max: Infinity, rate: 0.20 },
  ],
  married_separate: [
    { min: 0, max: 49450, rate: 0 },
    { min: 49450, max: 306850, rate: 0.15 },
    { min: 306850, max: Infinity, rate: 0.20 },
  ],
  head_household: [
    { min: 0, max: 66200, rate: 0 },
    { min: 66200, max: 579600, rate: 0.15 },
    { min: 579600, max: Infinity, rate: 0.20 },
  ],
};

export const NIIT_RATE = 0.038;

// NOT INFLATION-INDEXED. These thresholds are fixed in statute (§ 1411(b)) and
// have not moved since the tax took effect in 2013. The IRS NIIT Q&A [3] says
// so in terms: "these threshold amounts are not indexed for inflation." They
// are correspondingly absent from Rev. Proc. 2025-32's adjusted-items list.
// Do NOT "update" these during a future inflation pass.
export const NIIT_THRESHOLDS: Record<FilingStatus, number> = {
  single: 200000,
  married_joint: 250000,
  married_separate: 125000,
  head_household: 200000,
};

// 2026 § 199A qualified business income thresholds — Rev. Proc. 2025-32
// § 4.26. [1] Above `threshold` the deduction begins to phase out (and is
// limited/denied for a specified service trade or business); the phase-out is
// complete at `phaseInEnd`.
//
// NOTE: these are published for reference. The self-employment-tax calculator
// currently applies a flat 20% QBI deduction and does NOT model this phase-out
// or the SSTB limitation — see the disclosure on that calculator.
export interface QBIThreshold {
  threshold: number;
  phaseInEnd: number;
}

export const QBI_THRESHOLDS: Record<FilingStatus, QBIThreshold> = {
  single: { threshold: 201750, phaseInEnd: 276750 },
  married_joint: { threshold: 403500, phaseInEnd: 553500 },
  married_separate: { threshold: 201775, phaseInEnd: 276775 },
  head_household: { threshold: 201750, phaseInEnd: 276750 },
};

/** OBBBA § 70105 added a § 199A(i) minimum deduction of $400 for taxpayers
 *  with at least $1,000 of qualified business income, effective for taxable
 *  years beginning after December 31, 2025. Both amounts are inflation-
 *  adjusted for years after 2026. Rev. Proc. 2025-32 § 2.12. [1] */
export const QBI_MINIMUM_DEDUCTION = 400;
export const QBI_MINIMUM_INCOME = 1000;

export function calculateCapitalGainsTax(
  gainAmount: number,
  ordinaryTaxableIncome: number,
  filingStatus: FilingStatus
): number {
  const brackets = LONG_TERM_CG_BRACKETS[filingStatus];
  let tax = 0;
  let gainsRemaining = Math.max(0, gainAmount);

  // Gains "stack" on top of ordinary income in the bracket structure
  let incomeFloor = Math.max(0, ordinaryTaxableIncome);

  for (const bracket of brackets) {
    if (gainsRemaining <= 0) break;

    // How much room is left in this bracket above ordinary income?
    const bracketTop = bracket.max;
    const bracketBottom = Math.max(bracket.min, incomeFloor);

    if (bracketBottom >= bracketTop) continue;

    const room = bracketTop - bracketBottom;
    const taxableInBracket = Math.min(gainsRemaining, room);
    tax += taxableInBracket * bracket.rate;
    gainsRemaining -= taxableInBracket;
    incomeFloor = bracketBottom + taxableInBracket;
  }

  return tax;
}

export const FICA_RATES = {
  // Statutory rates — unchanged. IRS Topic no. 751 [2] and Schedule SE
  // instructions [5].
  SOCIAL_SECURITY_RATE: 0.062,
  MEDICARE_RATE: 0.0145,
  SELF_EMPLOYMENT_TAX_RATE: 0.153,

  // 2026 OASDI contribution and benefit base. Set by SSA under § 230 of the
  // Social Security Act, not by the IRS Rev. Proc. — confirmed at $184,500 in
  // IRS Topic no. 751 [2] and in SSA's "Cost-of-Living Increase and Other
  // Determinations for 2026" (Docket No. SSA-2025-0255). Was $176,100 in 2025.
  SOCIAL_SECURITY_WAGE_BASE: 184500,

  // NOT INFLATION-INDEXED. The 0.9% Additional Medicare Tax thresholds are
  // fixed in statute (§ 3101(b)(2), added by the ACA) and have never been
  // adjusted. Absent from Rev. Proc. 2025-32's adjusted-items list. See IRS
  // Topic no. 560 [4]. Do NOT "update" these during a future inflation pass.
  ADDITIONAL_MEDICARE_RATE: 0.009,
  ADDITIONAL_MEDICARE_THRESHOLD: {
    single: 200000,
    married_joint: 250000,
    married_separate: 125000,
    head_household: 200000,
  } as Record<FilingStatus, number>,
} as const;

export function calculateFederalTax(taxableIncome: number, filingStatus: FilingStatus): number {
  const brackets = TAX_BRACKETS[filingStatus];
  let tax = 0;
  let remainingIncome = Math.max(0, taxableIncome);

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return tax;
}

export function getMarginalBracket(taxableIncome: number, filingStatus: FilingStatus): number {
  const brackets = TAX_BRACKETS[filingStatus];
  let marginalRate = 0.10;

  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) {
      marginalRate = bracket.rate;
    }
  }

  return marginalRate;
}

export function calculateSelfEmploymentTax(
  netSEIncome: number,
  filingStatus: FilingStatus = 'single'
): {
  socialSecurityTax: number;
  medicareTax: number;
  additionalMedicareTax: number;
  totalSETax: number;
  seDeduction: number;
} {
  const seIncomeSubjectToTax = netSEIncome * 0.9235;

  const socialSecurityTax =
    Math.min(seIncomeSubjectToTax, FICA_RATES.SOCIAL_SECURITY_WAGE_BASE) * 0.124;
  const medicareTax = seIncomeSubjectToTax * 0.029;

  const threshold = FICA_RATES.ADDITIONAL_MEDICARE_THRESHOLD[filingStatus];
  const additionalMedicareTax =
    seIncomeSubjectToTax > threshold
      ? (seIncomeSubjectToTax - threshold) * FICA_RATES.ADDITIONAL_MEDICARE_RATE
      : 0;

  const totalSETax = socialSecurityTax + medicareTax + additionalMedicareTax;
  const seDeduction = totalSETax / 2;

  return { socialSecurityTax, medicareTax, additionalMedicareTax, totalSETax, seDeduction };
}
