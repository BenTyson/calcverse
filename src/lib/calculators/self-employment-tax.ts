import {
  STANDARD_DEDUCTIONS,
  QBI_THRESHOLDS,
  QBI_MINIMUM_DEDUCTION,
  QBI_MINIMUM_INCOME,
  calculateFederalTax,
  calculateSelfEmploymentTax,
  getMarginalBracket,
  type FilingStatus,
} from './shared/tax-brackets';

/** Whether the trade or business is a "specified service trade or business"
 *  under § 199A(d)(2). Consulting, health, law, accounting, performing arts,
 *  athletics, financial services, investing, and any business whose principal
 *  asset is the reputation or skill of its owners are all SSTBs. */
export type QBIBusinessType = 'non_sstb' | 'sstb';

export interface SelfEmploymentTaxInputs {
  // Quick mode
  annualIncome: number;
  filingStatus: FilingStatus;

  // Advanced mode
  businessExpenses: number;
  stateTaxRate: number;
  otherIncome: number;
  estimatedDeductions: number;
  qualifiedBusinessIncomeDeduction: boolean;
  qbiBusinessType: QBIBusinessType;
  w2WagesPaid: number;
  qualifiedPropertyUBIA: number;
}

/** Everything the UI needs to explain *why* the § 199A deduction came out the
 *  way it did. Every field is derived, never an input. */
export interface QBIDeductionDetail {
  /** QBI after the deductible half of SE tax, before the SSTB haircut. */
  qbi: number;
  /** § 199A(e)(1) taxable income — figured without the § 199A deduction. */
  taxableIncomeBeforeQBI: number;
  threshold: number;
  phaseInEnd: number;
  /** Position in the phase-in range, 0 at the threshold and 1 at its top. */
  phaseInRatio: number;
  inPhaseInRange: boolean;
  abovePhaseInRange: boolean;
  /** § 199A(d)(3)(B) applicable percentage, 0–1. Always 1 for a non-SSTB. */
  sstbApplicablePercent: number;
  /** QBI actually taken into account after the SSTB haircut. */
  adjustedQBI: number;
  /** § 199A(b)(2)(B): greater of 50% of W-2 wages, or 25% of wages + 2.5% UBIA. */
  wageAndUbiaLimit: number;
  /** True when that limit reduced the deduction below a flat 20% of QBI. */
  limitedByWagesOrUbia: boolean;
  /** 20% of adjusted QBI — the § 199A(b)(2)(A) amount, before any limitation. */
  twentyPercentOfQBI: number;
  /** § 199A(a) ceiling: 20% of taxable income minus net capital gain. */
  incomeLimit: number;
  /** True when that ceiling, rather than the QBI component, set the deduction. */
  incomeLimitBinds: boolean;
  /** True when the § 199A(i) $400 floor set the deduction. */
  minimumApplied: boolean;
  deduction: number;
}

export interface SelfEmploymentTaxResults {
  netSEIncome: number;
  socialSecurityTax: number;
  medicareTax: number;
  additionalMedicareTax: number;
  totalSETax: number;
  seDeduction: number;
  federalIncomeTax: number;
  stateTax: number;
  totalTax: number;
  effectiveTaxRate: number;
  marginalBracket: number;
  qbiDeduction: number;
  /** Present whether or not the deduction is switched on, so the UI can
   *  explain what the user would get. */
  qbiDetail: QBIDeductionDetail;
  breakdown: { label: string; value: number }[];
  comparison: { label: string; [key: string]: string | number }[];
}

/**
 * The § 199A qualified business income deduction, including the SSTB
 * limitation and the phase-out of both limitations across the phase-in range.
 *
 * ---------------------------------------------------------------------------
 * SOURCES — read in session on August 13, 2026. Every rule below is quoted
 * from one of these; do not change the arithmetic without re-reading them.
 * ---------------------------------------------------------------------------
 *
 * [A] 26 U.S.C. § 199A (current through Pub. L. 119-21, the OBBBA)
 *     https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section199A
 *     - (b)(2)   QBI component = lesser of 20% of QBI, or the greater of 50%
 *                of W-2 wages / 25% of W-2 wages + 2.5% of UBIA.
 *     - (b)(3)(A) That wage-and-UBIA limit does not apply at or below the
 *                threshold amount.
 *     - (b)(3)(B) Between the threshold and the top of the phase-in range the
 *                limit phases in: reduce 20% of QBI by
 *                (20% of QBI - wage/UBIA limit) x (excess / phase-in range).
 *     - (d)(3)(A) An SSTB is still a qualified trade or business while taxable
 *                income is BELOW threshold + range, but only the "applicable
 *                percentage" of its QBI, W-2 wages and UBIA is taken into
 *                account. At or above the top, it is not a qualified trade or
 *                business at all and generates no deduction.
 *     - (d)(3)(B) applicable percentage = 100% reduced (not below zero) by
 *                (taxable income - threshold) / phase-in range.
 *     - (e)(1)   Taxable income here is figured WITHOUT the § 199A deduction.
 *     - (i)      Minimum deduction: the greater of the computed deduction or
 *                $400, for a taxpayer with at least $1,000 of aggregate QBI
 *                from active qualified trades or businesses.
 *
 * [B] IRS Rev. Proc. 2025-32 § 4.26 — the TY2026 threshold and phase-in range
 *     amounts, which it ties to § 199A(e)(2), (b)(3)(B) and (d)(3)(A).
 *     https://www.irs.gov/pub/irs-drop/rp-25-32.pdf
 *     Those figures live in QBI_THRESHOLDS; the range width is derived as
 *     phaseInEnd - threshold rather than restated here.
 *     § 2.12 of the same Rev. Proc. is the source for the $400 / $1,000
 *     minimum-deduction amounts in QBI_MINIMUM_DEDUCTION / QBI_MINIMUM_INCOME.
 *
 * [C] IRS Form 8995-A (2025), Parts II-IV, and Schedule A
 *     https://www.irs.gov/pub/irs-pdf/f8995a.pdf
 *     The line-by-line arithmetic this function reproduces: Part II lines 3-13
 *     (wage/UBIA limit), Part III lines 17-26 (phased-in reduction), Part IV
 *     lines 32-37 (the 20%-of-taxable-income ceiling).
 *
 * [D] IRS Instructions for Form 8995-A (2025)
 *     https://www.irs.gov/pub/irs-pdf/i8995a.pdf
 *     Lists consulting among the SSTB fields, and confirms QBI is reduced by
 *     the deductible part of self-employment tax.
 *
 * [E] IRS, Section 199A QBI deduction FAQs
 *     https://www.irs.gov/newsroom/tax-cuts-and-jobs-act-provision-11011-section-199a-qualified-business-income-deduction-faqs
 *     Confirms the three zones and that every test uses taxable income before
 *     the QBI deduction.
 *
 * NOT MODELLED — see the disclosure rendered on the calculator page:
 * net capital gain is assumed to be zero (there is no capital gains input, so
 * the § 199A(a) ceiling is 20% of taxable income); aggregation of multiple
 * businesses, REIT/PTP income, qualified business loss carryforwards, patron
 * reductions, and the de minimis SSTB rules for businesses under and over
 * $25 million of gross receipts. The § 199A(i) floor assumes the taxpayer
 * materially participates, which is true of a working freelancer.
 */
export function calculateQBIDeduction(params: {
  qbi: number;
  taxableIncomeBeforeQBI: number;
  filingStatus: FilingStatus;
  isSSTB: boolean;
  w2Wages: number;
  ubia: number;
}): QBIDeductionDetail {
  const qbi = Math.max(0, params.qbi);
  const taxableIncomeBeforeQBI = Math.max(0, params.taxableIncomeBeforeQBI);
  const { threshold, phaseInEnd } = QBI_THRESHOLDS[params.filingStatus];

  // § 199A(b)(3)(B)(ii)(II) and (d)(3)(B)(ii) both divide by the same width —
  // $75,000, or $150,000 on a joint return. Deriving it keeps the figure in
  // the shared module instead of restating it here.
  const phaseInRange = phaseInEnd - threshold;
  const excessOverThreshold = Math.max(0, taxableIncomeBeforeQBI - threshold);
  const phaseInRatio = phaseInRange > 0 ? Math.min(1, excessOverThreshold / phaseInRange) : 0;

  const atOrBelowThreshold = taxableIncomeBeforeQBI <= threshold;
  const abovePhaseInRange = taxableIncomeBeforeQBI >= phaseInEnd;
  const inPhaseInRange = !atOrBelowThreshold && !abovePhaseInRange;

  // § 199A(d)(3). Below the threshold an SSTB is unaffected. Inside the range
  // only the applicable percentage counts. At or above the top of the range an
  // SSTB is not a qualified trade or business, so nothing counts.
  let sstbApplicablePercent = 1;
  if (params.isSSTB) {
    sstbApplicablePercent = abovePhaseInRange ? 0 : 1 - phaseInRatio;
  }

  const adjustedQBI = qbi * sstbApplicablePercent;
  const adjustedW2Wages = Math.max(0, params.w2Wages) * sstbApplicablePercent;
  const adjustedUBIA = Math.max(0, params.ubia) * sstbApplicablePercent;

  // § 199A(b)(2)(A) and (B) — Form 8995-A Part II lines 3-10.
  const twentyPercentOfQBI = adjustedQBI * 0.20;
  const wageAndUbiaLimit = Math.max(
    adjustedW2Wages * 0.50,
    adjustedW2Wages * 0.25 + adjustedUBIA * 0.025
  );

  // Form 8995-A Part II line 13: the greater of the capped amount (line 11) and
  // the phased-in amount (line 26). Below the threshold the cap is switched off
  // entirely by § 199A(b)(3)(A).
  let qbiComponent: number;
  if (atOrBelowThreshold) {
    qbiComponent = twentyPercentOfQBI;
  } else if (inPhaseInRange && wageAndUbiaLimit < twentyPercentOfQBI) {
    const excessAmount = twentyPercentOfQBI - wageAndUbiaLimit;
    qbiComponent = twentyPercentOfQBI - excessAmount * phaseInRatio;
  } else {
    qbiComponent = Math.min(twentyPercentOfQBI, wageAndUbiaLimit);
  }

  // § 199A(a) / Form 8995-A Part IV lines 33-37. Net capital gain is zero
  // because this calculator has no capital gains input.
  const incomeLimit = taxableIncomeBeforeQBI * 0.20;
  let deduction = Math.min(qbiComponent, incomeLimit);
  const incomeLimitBinds = incomeLimit < qbiComponent;

  // § 199A(i). The floor sits on top of the finished subsection (a) deduction,
  // and keys off QBI from *qualified* trades or businesses — so a fully
  // phased-out SSTB, which is no longer one, cannot reach it.
  const minimumApplied =
    adjustedQBI >= QBI_MINIMUM_INCOME && deduction < QBI_MINIMUM_DEDUCTION;
  if (minimumApplied) {
    deduction = QBI_MINIMUM_DEDUCTION;
  }

  return {
    qbi,
    taxableIncomeBeforeQBI,
    threshold,
    phaseInEnd,
    phaseInRatio,
    inPhaseInRange,
    abovePhaseInRange,
    sstbApplicablePercent,
    adjustedQBI,
    wageAndUbiaLimit,
    limitedByWagesOrUbia: !atOrBelowThreshold && qbiComponent < twentyPercentOfQBI,
    twentyPercentOfQBI,
    incomeLimit,
    incomeLimitBinds,
    minimumApplied,
    deduction,
  };
}

export function calculateSelfEmploymentTaxResults(inputs: SelfEmploymentTaxInputs): SelfEmploymentTaxResults {
  const netSEIncome = Math.max(0, inputs.annualIncome - inputs.businessExpenses);

  const seTax = calculateSelfEmploymentTax(netSEIncome, inputs.filingStatus);

  const totalIncome = netSEIncome + inputs.otherIncome;
  const agi = totalIncome - seTax.seDeduction;

  const standardDeduction = STANDARD_DEDUCTIONS[inputs.filingStatus];
  const deductions = Math.max(standardDeduction, inputs.estimatedDeductions);

  // § 199A QBI deduction. QBI is net business income REDUCED by the deductible
  // half of SE tax — the Instructions for Form 8995 list "deductible part of
  // self-employment tax" among the items that reduce it.
  // https://www.irs.gov/instructions/i8995
  // Everything else — the wage/UBIA limit, the SSTB haircut, the phase-out of
  // both across the range, the 20%-of-taxable-income ceiling and the § 199A(i)
  // floor — lives in calculateQBIDeduction above, with its sources.
  const qbi = Math.max(0, netSEIncome - seTax.seDeduction);
  const taxableIncomeBeforeQBI = Math.max(0, agi - deductions);
  const qbiDetail = calculateQBIDeduction({
    qbi,
    taxableIncomeBeforeQBI,
    filingStatus: inputs.filingStatus,
    isSSTB: inputs.qbiBusinessType === 'sstb',
    w2Wages: inputs.w2WagesPaid,
    ubia: inputs.qualifiedPropertyUBIA,
  });
  const qbiDeduction = inputs.qualifiedBusinessIncomeDeduction ? qbiDetail.deduction : 0;

  const taxableIncome = Math.max(0, taxableIncomeBeforeQBI - qbiDeduction);

  const federalIncomeTax = calculateFederalTax(taxableIncome, inputs.filingStatus);
  const stateTax = taxableIncome * (inputs.stateTaxRate / 100);
  const totalTax = seTax.totalSETax + federalIncomeTax + stateTax;
  const effectiveTaxRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;
  const marginalBracket = getMarginalBracket(taxableIncome, inputs.filingStatus);

  const breakdown: { label: string; value: number }[] = [
    { label: 'Gross Self-Employment Income', value: inputs.annualIncome },
    { label: 'Business Expenses', value: -inputs.businessExpenses },
    { label: 'Net SE Income', value: netSEIncome },
    { label: 'Social Security Tax (12.4%)', value: seTax.socialSecurityTax },
    { label: 'Medicare Tax (2.9%)', value: seTax.medicareTax },
  ];

  if (seTax.additionalMedicareTax > 0) {
    breakdown.push({ label: 'Additional Medicare Tax (0.9%)', value: seTax.additionalMedicareTax });
  }

  breakdown.push(
    { label: 'Total Self-Employment Tax', value: seTax.totalSETax },
    { label: 'SE Tax Deduction (50%)', value: -seTax.seDeduction },
  );

  if (qbiDeduction > 0) {
    breakdown.push({ label: 'QBI Deduction (Section 199A)', value: -qbiDeduction });
  }

  breakdown.push(
    { label: 'Federal Income Tax', value: federalIncomeTax },
    { label: 'State Tax', value: stateTax },
    { label: 'Total Tax Burden', value: totalTax },
  );

  const comparison = [
    {
      label: 'Tax Breakdown',
      socialSecurity: seTax.socialSecurityTax,
      medicare: seTax.medicareTax + seTax.additionalMedicareTax,
      federal: federalIncomeTax,
      state: stateTax,
    },
  ];

  return {
    netSEIncome,
    socialSecurityTax: seTax.socialSecurityTax,
    medicareTax: seTax.medicareTax,
    additionalMedicareTax: seTax.additionalMedicareTax,
    totalSETax: seTax.totalSETax,
    seDeduction: seTax.seDeduction,
    federalIncomeTax,
    stateTax,
    totalTax,
    effectiveTaxRate,
    marginalBracket,
    qbiDeduction,
    qbiDetail,
    breakdown,
    comparison,
  };
}

export const DEFAULT_INPUTS: SelfEmploymentTaxInputs = {
  annualIncome: 85000,
  filingStatus: 'single',
  businessExpenses: 10000,
  stateTaxRate: 5,
  otherIncome: 0,
  estimatedDeductions: 0,
  qualifiedBusinessIncomeDeduction: false,
  // A freelancer or consultant reading this page is far more likely to be an
  // SSTB than not, and guessing wrong in that direction overstates the
  // deduction — the exact failure this models away.
  qbiBusinessType: 'sstb',
  // A solo freelancer has no payroll and no qualified property. These matter
  // only above the threshold, where they can zero the deduction outright.
  w2WagesPaid: 0,
  qualifiedPropertyUBIA: 0,
};

export const QUICK_MODE_DEFAULTS: Partial<SelfEmploymentTaxInputs> = {
  businessExpenses: 10000,
  stateTaxRate: 5,
  otherIncome: 0,
  estimatedDeductions: 0,
  qualifiedBusinessIncomeDeduction: false,
  qbiBusinessType: 'sstb',
  w2WagesPaid: 0,
  qualifiedPropertyUBIA: 0,
};
