/**
 * IRS optional standard mileage rates for TAX YEAR 2026.
 *
 * ---------------------------------------------------------------------------
 * SOURCES
 * ---------------------------------------------------------------------------
 * [1] IRS Standard mileage rates
 *     https://www.irs.gov/tax-professionals/standard-mileage-rates
 * [2] IRS Notice 2026-10, "2026 Standard Mileage Rates"
 *     https://www.irs.gov/pub/irs-drop/n-26-10.pdf
 *     - 72.5 cents/mile for business use, effective January 1, 2026.
 * [3] Announcement 2026-11, Internal Revenue Bulletin 2026-29 (July 13, 2026)
 *     https://www.irs.gov/irb/2026-29_irb
 *     - Modifies Notice 2026-10. Revised business rate of 76 cents/mile
 *       effective July 1, 2026, in response to fuel price increases.
 *
 * Last verified against the above: August 9, 2026.
 *
 * NOTE — 2026 is a SPLIT-RATE YEAR. Unlike a typical year there is no single
 * annual business mileage rate: mileage driven before July 1 is deducted at
 * 72.5 cents and mileage on or after July 1 at 76 cents. A taxpayer filing for
 * the full year must apportion their miles between the two periods.
 */

export const MILEAGE_TAX_YEAR = '2026';

/** Business use, January 1 – June 30, 2026. IRS Notice 2026-10. [2] */
export const IRS_MILEAGE_RATE_2026_H1 = 0.725;

/** Business use, July 1 – December 31, 2026. Announcement 2026-11. [3] */
export const IRS_MILEAGE_RATE_2026_H2 = 0.76;

/**
 * The rate currently in effect (second half of 2026).
 *
 * The gig calculators estimate a *forward-looking* deduction from miles the
 * user expects to drive, so the rate in effect today is the right default.
 * Users deducting miles driven earlier in 2026 must apply
 * `IRS_MILEAGE_RATE_2026_H1` to that portion instead — the calculators
 * disclose this.
 */
export const IRS_MILEAGE_RATE = IRS_MILEAGE_RATE_2026_H2;
