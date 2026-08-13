/**
 * Retirement plan and IRA limits for TAX YEAR 2026.
 *
 * ---------------------------------------------------------------------------
 * SOURCES — every figure below was read from this primary document.
 * Do not change a number here without re-reading it.
 * ---------------------------------------------------------------------------
 *
 * [1] IRS Notice 2025-67, "2026 Amounts Relating to Retirement Plans and IRAs,
 *     as Adjusted for Changes in Cost-of-Living"
 *     https://www.irs.gov/pub/irs-drop/n-25-67.pdf
 *     Every constant in this file is quoted from that notice, which states each
 *     figure as an increase "from <2025 value> to <2026 value>" — so the
 *     superseded values in scripts/check-tax-data.mjs come from it too.
 *
 * Last verified against the above: August 13, 2026.
 *
 * WHY THIS FILE EXISTS: these limits previously lived only in blog prose, in
 * four different posts, and drifted to three different tax years at once. That
 * is the exact rot pattern `npm run check:tax-data` exists to stop. Import from
 * here; never retype a limit into page copy.
 */

/** The tax year every figure in this module represents. */
export const RETIREMENT_LIMITS_TAX_YEAR = '2026';

/** Date these figures were last checked against Notice 2025-67. */
export const RETIREMENT_LIMITS_LAST_VERIFIED = 'August 13, 2026';

/**
 * § 402(g)(1) elective deferral limit — the "employee side" of a Solo 401(k).
 * Notice 2025-67: increased from $23,500 to $24,500. [1]
 */
export const ELECTIVE_DEFERRAL_LIMIT = 24500;

/**
 * § 414(v)(2)(B)(i) age-50 catch-up for 401(k)-type plans.
 * Notice 2025-67: increased from $7,500 to $8,000. [1]
 *
 * Catch-up contributions sit on top of the § 415(c) annual additions limit, so
 * a participant aged 50+ can reach ANNUAL_ADDITIONS_LIMIT + this amount.
 */
export const CATCH_UP_401K = 8000;

/**
 * § 414(v)(2)(E)(i) higher catch-up for participants who attain age 60, 61, 62
 * or 63 during the year. Notice 2025-67: remains $11,250 for 2026. [1]
 */
export const CATCH_UP_401K_AGE_60_63 = 11250;

/**
 * § 415(c)(1)(A) defined contribution annual additions limit — the combined
 * employee + employer ceiling for a Solo 401(k) or SEP-IRA.
 * Notice 2025-67: increased in 2026 from $70,000 to $72,000. [1]
 */
export const ANNUAL_ADDITIONS_LIMIT = 72000;

/**
 * § 219(b)(5)(A) IRA contribution limit (traditional and Roth combined).
 * Notice 2025-67: increased from $7,000 to $7,500. [1]
 */
export const IRA_CONTRIBUTION_LIMIT = 7500;

/**
 * § 219(b)(5)(B)(ii) IRA catch-up for individuals aged 50 or over.
 * Notice 2025-67: increased from $1,000 to $1,100. [1]
 */
export const IRA_CATCH_UP = 1100;

/**
 * § 401(a)(17) annual compensation limit — caps the compensation that can be
 * taken into account when computing the employer-side contribution.
 * Notice 2025-67: increased from $350,000 to $360,000. [1]
 */
export const ANNUAL_COMPENSATION_LIMIT = 360000;

export interface PhaseOutRange {
  /** Full contribution/deduction allowed below this modified AGI. */
  start: number;
  /** No contribution/deduction allowed at or above this modified AGI. */
  end: number;
}

/**
 * § 408A(c)(3)(A) Roth IRA modified-AGI phase-out ranges for 2026.
 * Notice 2025-67 [1]:
 *   - married filing jointly: increased from $236,000–$246,000 to
 *     $242,000–$252,000
 *   - singles and heads of household: increased from $150,000–$165,000 to
 *     $153,000–$168,000
 *   - married filing separately: NOT inflation-indexed, remains $0–$10,000
 */
export const ROTH_IRA_PHASE_OUT: Record<
  'single' | 'married_joint' | 'married_separate' | 'head_household',
  PhaseOutRange
> = {
  single: { start: 153000, end: 168000 },
  married_joint: { start: 242000, end: 252000 },
  // NOT INFLATION-INDEXED — the notice says this range "is not subject to an
  // annual cost-of-living adjustment and remains between $0 and $10,000."
  married_separate: { start: 0, end: 10000 },
  head_household: { start: 153000, end: 168000 },
};

/**
 * § 219(g)(2)(A) traditional IRA deduction phase-out ranges for 2026, for a
 * taxpayer who IS an active participant in a workplace plan. Notice 2025-67 [1]:
 *   - single / head of household: increased from $79,000–$89,000 to
 *     $81,000–$91,000
 *   - married filing jointly (the contributor is the active participant):
 *     increased from $126,000–$146,000 to $129,000–$149,000
 *   - married filing separately: NOT indexed, remains $0–$10,000
 *
 * A freelancer with no workplace plan is not an active participant and has no
 * income limit on deducting a traditional IRA contribution.
 */
export const TRADITIONAL_IRA_DEDUCTION_PHASE_OUT: Record<
  'single' | 'married_joint' | 'married_separate' | 'head_household',
  PhaseOutRange
> = {
  single: { start: 81000, end: 91000 },
  married_joint: { start: 129000, end: 149000 },
  married_separate: { start: 0, end: 10000 },
  head_household: { start: 81000, end: 91000 },
};

/**
 * § 219(g)(7)(A) phase-out for a contributor who is NOT an active participant
 * but whose spouse is. Notice 2025-67: increased from $236,000–$246,000 to
 * $242,000–$252,000. [1]
 */
export const SPOUSAL_IRA_DEDUCTION_PHASE_OUT: PhaseOutRange = {
  start: 242000,
  end: 252000,
};
