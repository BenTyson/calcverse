# Blog post tax-figure audit — RESOLVED 2026-08-09, follow-ups closed 2026-08-13

Status: **closed.** All 35 guard warnings are gone; `npm run check:tax-data`
exits clean with zero warnings and zero errors. 13 posts were corrected to
TY2026 and stamped `updatedDate: 2026-08-09`. The three follow-up items are
closed too — see "Round 2" below, which also covers two stale figures found on
a live calculator page.

Every figure below was taken from `src/lib/calculators/shared/tax-brackets.ts`
and `src/lib/calculators/shared/mileage-rates.ts` — the sources of truth — not
re-researched. Every worked example was recomputed by running the actual
calculator logic (`calculateFederalTax`, `calculateSelfEmploymentTax`,
`calculateCapitalGainsTax`, `STANDARD_DEDUCTIONS`, `FICA_RATES`), not by hand.

TY2026 reference values used:
- SS wage base $184,500
- Mileage **split year**: $0.725 Jan 1–Jun 30, $0.76 Jul 1–Dec 31
- Std deduction single $16,100
- QBI threshold $201,750 single / $403,500 MFJ
- LTCG 0% cap single $49,450, 15% cap $545,500
- Solo 401(k) $24,500 employee / $72,000 combined; IRA $7,500 (+$1,100 catch-up)

## Posts corrected

| Post | What changed |
|---|---|
| `self-employment-tax-guide.md` | SS wage base ×3, mileage → split rate, QBI thresholds, Solo 401(k) limits, wage-base worked example rebuilt, effective-rate claim corrected |
| `w2-vs-1099-tax-difference.md` | SS wage base, **entire $100k side-by-side example rebuilt** on the $16,100 standard deduction, QBI threshold, mileage, Solo 401(k) limits |
| `freelance-retirement-planning.md` | Every Solo 401(k) / SEP / IRA limit and all derived contribution and tax-savings arithmetic |
| `capital-gains-tax-freelancers.md` | LTCG breakpoints, both bracket-stacking examples recomputed |
| `uber-lyft-driver-earnings.md` | Mileage → split rate ×3, weekly/annual deduction recomputed |
| `side-hustle-taxes.md` | Mileage → split rate ×2, 12,000-mile deduction, **SS cap interaction example reversed** |
| `gig-delivery-apps-compared.md` | Mileage → split rate, per-app weekly vehicle costs, 12,000-mile deduction and tax saving |
| `quarterly-tax-guide-freelancers.md` | SS wage base, **income-tax example was wrong for every tax year** — rebuilt |
| `tutoring-side-hustle-earnings.md` | "67 cents per mile in 2026" — missed by the original audit *and* by the guard |
| `doordash-driver-earnings.md` | Mileage → split rate |
| `reselling-profit-guide.md` | Mileage → split rate |
| `net-worth-freelancers.md` | Solo 401(k) employee deferral |
| `how-to-calculate-freelance-rate.md` | SS wage base |

## Guard hardened

`scripts/check-tax-data.mjs` gained `67 cents` and `65.5 cents` patterns. The
denylist had `$0.67` but only the spelled-out `70 cents`, so a
"67 cents per mile in 2026" in `tutoring-side-hustle-earnings.md` passed
undetected through both the guard and the original audit.

## Round 2 — the three open items, closed 2026-08-13

All three were resolved against **IRS Notice 2025-67** ("2026 Amounts Relating
to Retirement Plans and IRAs", https://www.irs.gov/pub/irs-drop/n-25-67.pdf),
the **IRS QBI deduction page**, and the **Instructions for Form 8995** — all
three fetched and read in that session.

**1. Roth IRA MAGI phase-out — fixed.** `freelance-retirement-planning.md` had
"$161,000 in 2025 … above $146,000 phases down," which were TY2024 figures and
wrong for their own stated year. Correct 2026 (§ 408A(c)(3)(A)): singles and
heads of household **$153,000–$168,000**, married filing jointly
**$242,000–$252,000**, married filing separately $0–$10,000 (not indexed).

**2. QBI worked example — rewritten, and the calculator was wrong too.** The
old "$17,700 … saving $3,900" reconciled with nothing. The real § 199A answer
for the $100k contractor: QBI $92,935, first ceiling $18,587, second ceiling
(20% of the $76,835 taxable income figured before the deduction) **$15,367** —
which binds. Tax saving **$3,381**.

Chasing that exposed a defect in `self-employment-tax.ts`: it computed QBI as
`min(20% of net SE income, AGI)`, which both skipped the SE-tax reduction to
QBI and used the wrong second ceiling. At $100k it returned a $20,000 deduction
against a correct $15,367 — a 30% overstatement that **understated tax owed**.
Fixed, with both IRS URLs cited inline. The calculator now agrees with the blog
post to the dollar.

**3. Retirement limits now live in `shared/retirement-limits.ts`.** Created
from Notice 2025-67 with per-constant § citations. `freelance-retirement.ts`
imports from it instead of redeclaring six local constants; output is
byte-identical. Added to `SOURCE_OF_TRUTH` in the guard.

### What the new guard patterns caught immediately

Adding the IRA phase-out figures to `SUPERSEDED` flagged
`src/pages/freelance/freelance-retirement-calculator.astro` — a **live
calculator page**, so an error not a warning. Two genuinely stale statutory
limits were hiding there that no previous pass had found:

- "The **$7,000** annual limit is achievable" → $7,500. The old `$7,000` context
  regex required "IRA limit" to be adjacent and missed it.
- "you could contribute up to **$61,000**" → $59,131. $61,000 is the **TY2022**
  § 415(c) limit — four years stale on a live page.
- Also corrected there: a SEP-IRA example that applied 25% to gross rather than
  to 92.35%-adjusted net income ($20,000 → $18,470), which disagreed with the
  page's own calculator.

## Still open — do NOT guess these

**Nothing blocking.** The remaining § 199A gaps (SSTB limitation, phase-out
above the QBI threshold, the OBBBA § 199A(i) $400 minimum, and the assumption
that net capital gain is zero) are unchanged, disclosed on the calculator, and
listed under "Known gaps" in CLAUDE.md.

## Freshness pass only — no tax-figure errors

`best-platforms-selling-digital-products.md` · `consulting-rates-by-industry-2026.md` ·
`etsy-fees-explained.md` · `freelance-writing-rates-2026.md` ·
`podcaster-sponsorship-earnings.md` · `print-on-demand-2026.md` · `rent-vs-buy-2026.md` ·
`tiktok-creator-earnings.md` · `youtube-adsense-rates-by-niche.md`

Market/platform-rate data, not IRS figures. Nothing here is factually wrong on
tax law.
