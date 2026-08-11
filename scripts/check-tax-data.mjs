#!/usr/bin/env node
/**
 * Stale tax-data guard.
 *
 * Two failure modes this catches, both of which actually happened:
 *   1. A calculator hardcodes an IRS/SSA figure instead of importing it, so the
 *      annual update misses it. (The 2024 -> 2026 pass found $0.67/mile copied
 *      into 6 files and $168,600 typed into page copy.)
 *   2. The shared module itself goes un-reviewed for years while blog titles
 *      advertise the current year.
 *
 * HOW TO KEEP THIS USEFUL: when you update the shared modules for a new tax
 * year, move the OLD values into SUPERSEDED below. The guard then permanently
 * blocks anyone from reintroducing them. The denylist grows by design.
 *
 * Run: npm run check:tax-data
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');

// Files allowed to contain tax figures as literals — the sources of truth.
const SOURCE_OF_TRUTH = [
  'src/lib/calculators/shared/tax-brackets.ts',
  'src/lib/calculators/shared/mileage-rates.ts',
];

/**
 * Superseded IRS/SSA figures. Each entry is a value that was correct for some
 * past year and must never appear in code or page copy again.
 * Append to this when you roll the tax year forward.
 *
 * Round numbers like 70,000 and 0.70 are also ordinary salaries, down payments,
 * and fee multipliers — those entries carry a `context` regex that the same line
 * must ALSO match before it counts. Distinctive figures need no context.
 */
// Deliberately narrow: "$0.70" on a line about gas cost per mile is not a
// mileage RATE. Require the line to be talking about the IRS deduction.
const MILEAGE_CTX = /IRS|deduct|standard mileage/i;
const RETIREMENT_CTX = /401|IRA|SEP|contribut|deferral|catch-up|retirement limit/i;

const SUPERSEDED = [
  // Social Security wage base — distinctive enough to match unconditionally
  { pattern: /\b168[,.]?600\b/, label: 'SS wage base $168,600 (TY2024)' },
  { pattern: /\b160[,.]?200\b/, label: 'SS wage base $160,200 (TY2023)' },
  { pattern: /\b176[,.]?100\b/, label: 'SS wage base $176,100 (TY2025)' },
  // IRS standard mileage rate — needs mileage context
  { pattern: /\$?0\.67\b/, label: 'mileage rate $0.67 (TY2024)', context: MILEAGE_CTX },
  { pattern: /\$?0\.70\b(?!\d)/, label: 'mileage rate $0.70 (TY2025)', context: MILEAGE_CTX },
  { pattern: /\$?0\.655\b/, label: 'mileage rate $0.655 (TY2023)', context: MILEAGE_CTX },
  { pattern: /\b70 cents\b/i, label: 'mileage rate 70 cents (TY2025)', context: MILEAGE_CTX },
  // Standard deduction
  { pattern: /\b14[,.]?600\b/, label: 'std deduction $14,600 single (TY2024)' },
  { pattern: /\b29[,.]?200\b/, label: 'std deduction $29,200 MFJ (TY2024)' },
  { pattern: /\b21[,.]?900\b/, label: 'std deduction $21,900 HoH (TY2024)' },
  { pattern: /\b15[,.]?750\b/, label: 'std deduction $15,750 single (TY2025)' },
  // QBI / SSTB thresholds
  { pattern: /\b191[,.]?950\b/, label: 'QBI threshold $191,950 (TY2024)' },
  { pattern: /\b383[,.]?900\b/, label: 'QBI threshold $383,900 (TY2024)' },
  // Long-term capital gains breakpoints
  { pattern: /\b47[,.]?025\b/, label: 'LTCG 0% cap $47,025 single (TY2024)' },
  { pattern: /\b94[,.]?050\b/, label: 'LTCG 0% cap $94,050 MFJ (TY2024)' },
  { pattern: /\b518[,.]?900\b/, label: 'LTCG 15% cap $518,900 single (TY2024)' },
  { pattern: /\b48[,.]?350\b/, label: 'LTCG 0% cap $48,350 single (TY2025)' },
  { pattern: /\b533[,.]?400\b/, label: 'LTCG 15% cap $533,400 single (TY2025)' },
  // Retirement contribution limits — need retirement context
  { pattern: /\b69[,.]?000\b/, label: 'DC annual additions $69,000 (TY2024)', context: RETIREMENT_CTX },
  { pattern: /\b70[,.]?000\b/, label: 'DC annual additions $70,000 (TY2025)', context: RETIREMENT_CTX },
  { pattern: /\b23[,.]?500\b/, label: 'elective deferral $23,500 (TY2025)', context: RETIREMENT_CTX },
  { pattern: /\b7[,.]?000\b/, label: 'IRA limit $7,000 (TY2025)', context: /IRA (limit|contribut)|contribut\w* .{0,30}\bIRA/i },
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|astro|md)$/.test(entry)) out.push(full);
  }
  return out;
}

const errors = [];
const warnings = [];

// ---- Check 1: shared module freshness -------------------------------------
const brackets = readFileSync(join(SRC, 'lib/calculators/shared/tax-brackets.ts'), 'utf8');
const taxYear = brackets.match(/export const TAX_YEAR = '(\d{4})'/)?.[1];
const verified = brackets.match(/export const TAX_DATA_LAST_VERIFIED = '([^']+)'/)?.[1];

if (!taxYear || !verified) {
  errors.push('tax-brackets.ts must export TAX_YEAR and TAX_DATA_LAST_VERIFIED');
} else {
  const currentYear = new Date().getFullYear();
  if (Number(taxYear) < currentYear) {
    errors.push(
      `TAX_YEAR is ${taxYear} but it is now ${currentYear}. Re-verify against the ` +
        `current IRS Revenue Procedure and SSA wage base, then bump TAX_YEAR.`
    );
  }
  const ageDays = (Date.now() - new Date(verified).getTime()) / 86_400_000;
  if (ageDays > 365) {
    errors.push(
      `TAX_DATA_LAST_VERIFIED is "${verified}" (${Math.round(ageDays)} days ago). ` +
        `Re-verify every figure against primary sources and update the date.`
    );
  }
}

// ---- Check 2: superseded figures outside the sources of truth --------------
for (const file of walk(SRC)) {
  const rel = relative(ROOT, file);
  if (SOURCE_OF_TRUTH.includes(rel)) continue;
  const isBlog = rel.startsWith('src/content/');
  const lines = readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, i) => {
    // Escape hatch: append `tax-data-ok` in a comment when a number genuinely
    // isn't a tax figure (a salary example, a fee multiplier, a gas cost).
    if (/check-tax-data|SUPERSEDED|tax-data-ok/.test(line)) return;
    for (const { pattern, label, context } of SUPERSEDED) {
      if (pattern.test(line) && (!context || context.test(line))) {
        const msg = `${rel}:${i + 1} — ${label}`;
        (isBlog ? warnings : errors).push(msg);
        break;
      }
    }
  });
}

// ---- Check 3: SourcesBlock must use the constants, not literals ------------
for (const file of walk(join(SRC, 'pages'))) {
  const rel = relative(ROOT, file);
  const text = readFileSync(file, 'utf8');
  if (!text.includes('<SourcesBlock')) continue;
  if (/taxYear="/.test(text) || /lastVerified="/.test(text)) {
    errors.push(
      `${rel} — SourcesBlock uses a string literal. Import TAX_YEAR / ` +
        `TAX_DATA_LAST_VERIFIED from shared/tax-brackets instead.`
    );
  }
}

// ---- Report ---------------------------------------------------------------
if (warnings.length) {
  console.log(`\n⚠  ${warnings.length} stale figure(s) in blog content (known backlog):`);
  for (const w of warnings.slice(0, 40)) console.log(`   ${w}`);
  if (warnings.length > 40) console.log(`   ...and ${warnings.length - 40} more`);
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} tax-data problem(s) in code and page copy:\n`);
  for (const e of errors) console.error(`   ${e}`);
  console.error(
    `\nFix: import the figure from src/lib/calculators/shared/ instead of ` +
      `hardcoding it.\nIf a figure genuinely belongs in a shared module, add it ` +
      `there with a source citation.\n`
  );
  process.exit(1);
}

console.log(
  `\n✓ Tax data clean — TY${taxYear}, verified ${verified}, ` +
    `no superseded figures outside the shared modules.` +
    (warnings.length ? ` (${warnings.length} blog warnings above.)` : '')
);
