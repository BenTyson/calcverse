#!/usr/bin/env node
/**
 * Stale platform-fee guard.  (DECISIONS.md D-011)
 *
 * D-011 put third-party creator-platform fees under the same regime as IRS/SSA
 * figures: single source of truth, primary sources fetched in-session, cited
 * with a verification date, "and enforced by a guard". This is that guard.
 *
 * WHY IT EXISTS
 * -------------
 * CHIP-RESEARCH-PAYMENTS verified 12 first-party sources and found ALL FOUR
 * creator calculators computing on wrong fees. Every error but one favoured the
 * platform. Patreon shipped a plan menu ("Lite 5% / Pro 8% / Premium 12%") that
 * has not existed since 2025-08-04; Ko-fi priced a $12 product at $6; Gumroad
 * published "flat 10%, you keep $0.90" when the real rate is 10% + $0.50;
 * Substack omitted Stripe's 0.7% Billing fee. Human review caught none of it.
 *
 * Wave 2 corrected the code and most of the copy. Nothing stopped a future chip
 * putting any of it back. Now something does.
 *
 * HOW TO KEEP THIS USEFUL
 * -----------------------
 * This mirrors scripts/check-tax-data.mjs deliberately: a SUPERSEDED denylist
 * that GROWS every time a fee figure is corrected. When you correct a platform
 * fee, add the old value here. The denylist getting longer is the point.
 *
 * WHAT MAKES THIS HARDER THAN THE TAX GUARD
 * -----------------------------------------
 * Tax figures are distinctive numbers ($168,600). Platform fees are ordinary
 * words and small numbers. "Premium" is a Patreon plan that never existed AND a
 * pricing tier on 8 other pages on this site, a Printify plan, a YouTube
 * product, and a t-shirt. "0.5%" is Substack's dead legacy Billing rate AND Buy
 * Me a Coffee's live recurring surcharge. "10%" is wrong for Gumroad and right
 * for Substack and Patreon.
 *
 * Worse: the corrected pages now *quote the wrong value in order to correct it*
 * — "the old Lite / Pro / Premium menu was closed on August 4, 2025". A guard
 * that flags its own fix is a guard someone disables. Three mechanisms handle
 * this, in order:
 *
 *   1. PROXIMITY. Every rule's `requires` are tested against a window of
 *      +/- RADIUS characters around the match, not the whole line. Blog lines
 *      are whole paragraphs; whole-line matching flags "Etsy sellers pay 12% to
 *      25%" merely because the word Patreon appears 200 characters away.
 *   2. CORRECTIVE CONTEXT. A match is suppressed when the same window carries a
 *      correction marker ("used to", "no longer", "legacy", "expired") or the
 *      corrected value itself ("$6 ... $12"). Suppressions are counted and
 *      listed under FEE_GUARD_EXPLAIN=1 — the exemption is auditable, never
 *      silent.
 *   3. ESCAPE HATCH. Append `fee-data-ok` in a comment, exactly as the tax
 *      guard's `tax-data-ok` works.
 *
 * Run: npm run check:fees      (or npm run check, which runs both guards)
 * Tune: FEE_GUARD_RADIUS=n FEE_GUARD_EXPLAIN=1 npm run check:fees
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const FACT_FILE = 'docs/facts/creator-payment-fees.md';

/**
 * Proximity radius in characters. See "Measurements" in
 * docs/notes/CHIP-FEE-GUARD.md — chosen by sweeping 40..400 over the real
 * corpus and taking the widest value that still separates the 3 known true
 * positives from the 14 known corrective lines.
 */
const RADIUS = Number(process.env.FEE_GUARD_RADIUS ?? 120);
const EXPLAIN = process.env.FEE_GUARD_EXPLAIN === '1';

/**
 * Ratchets. These are counts of KNOWN, PRE-EXISTING problems that this guard
 * reports as warnings rather than errors, so that it passes on the tree as it
 * stands. The number may only ever go DOWN. Exceeding it is an error, so a new
 * instance of an old defect still fails the build.
 *
 * When a category reaches 0, delete its ratchet and promote it to an error.
 */
const RATCHET = {
  // src/content/blog — 3 fee claims CHIP-BLOG-FEE-COPY did not reach.
  // See docs/notes/CHIP-FEE-GUARD.md; proposed as CHIP-BLOG-GUMROAD-FIX.
  blogContent: 3,
  // src/pages/creator/gumroad-calculator.astro hardcodes the fee verification
  // date as a string literal in 2 places instead of importing
  // GUMROAD_FEES_LAST_VERIFIED. Proposed as CHIP-FEE-DATE-IMPORT.
  hardcodedDate: 2,
  // src/lib/calculators/newsletter-revenue.ts is a second, ungoverned Substack
  // fee implementation, still missing the 0.7% Stripe Billing fee that
  // substack-revenue.ts was corrected for. Proposed as CHIP-NEWSLETTER-FEES.
  ungovernedFeeModule: 1,
};

// ---------------------------------------------------------------------------
// Corrective-context markers, applied to EVERY rule.
// A window carrying one of these is describing a fee that WAS wrong, which is
// exactly what the corrected pages do. Deliberately conservative: each entry
// was checked against the 3 known true positives to confirm it does not
// suppress them.
// ---------------------------------------------------------------------------
const CORRECTIVE = [
  /\bused to\b/i,
  /\bno longer\b/i,
  /\bpreviously\b/i,
  /\bformerly\b/i,
  /\bclosed (on|to|its)\b/i,
  /\bwas closed\b/i,
  /\bexpired\b/i,
  /\blegacy\b/i,
  /\bgrandfather/i,
  /\bout of date\b/i,
  /\bearlier version\b/i,
  /\bretired\b/i,
  /\bdiscontinued\b/i,
  /\b(does|do) not exist\b/i,
  /\bnowhere\b/i,
  /\bnot a rate\b/i,
  /\b(is|are|was|were) not\b/i,
  /\bisn.t\b/i,
  /\brather than\b/i,
  /\binstead of\b/i,
  /\bNOT \$/,
  /\bif you have seen\b/i,
  /\bstill quote\b/i,
  /\bused to make\b/i,
  /\bthis module previously\b/i,
];

// ---------------------------------------------------------------------------
// SUPERSEDED platform-fee values.
//
// `token`    the stale value itself (global regex; every occurrence is tested)
// `requires` ALL must match the +/-RADIUS window around the token
// `corrected` ANY match in the window means this is corrective text — suppress
// `label`    what the reader is told
// `scopes`   'src' and/or 'dist'. Numeric-literal rules are src-only, because
//            built HTML carries serialized island props where a bare 0.12 means
//            nothing.
//
// VERIFIED AGAINST THE REPO, NOT AGAINST THE HANDOVER NOTE. Two claims in the
// brief for this guard did not survive checking, and are recorded here rather
// than encoded:
//
//   * "Patreon 0.05 / 0.08 / 0.12" — 0.05 and 0.08 are NOT superseded. Founders
//     5% and Pro 8% are real, current, closed-to-new legacy plans, live in
//     src/lib/calculators/patreon-earnings.ts:115-116. Denying them would flag
//     correct code. Only 12% is fabricated (Patreon publishes no 12% rate), and
//     only the *menu presentation* of the three is the defect.
//   * "Gumroad as a flat 10%" — 10% is Gumroad's real percentage component. The
//     defect is the claim of flatness / no additional charge, so the rules
//     target the claim, never the number.
// ---------------------------------------------------------------------------
const SUPERSEDED = [
  // ---- Patreon ----------------------------------------------------------
  {
    id: 'P1-menu',
    label: 'Patreon Lite/Pro/Premium plan menu — closed 2025-08-04, and "Lite" and "Premium" appear nowhere in Patreon\'s fee documentation',
    token: /\bLite\b[^.]{0,60}\bPro\b[^.]{0,60}\bPremium\b/gi,
    requires: [],
    scopes: ['src', 'dist'],
  },
  {
    id: 'P2-plan-name',
    label: 'Patreon plan named "Lite" or "Premium" — no such plan exists; the plans are Standard 10% and legacy Founders/Pro/Pro+Merch',
    token: /\b(Lite|Premium)\b\s*(?:plan|tier)?\s*(?:\(|at\s+|:\s*|,\s*|—\s*)?\s*\$?\d{1,2}(?:\.\d+)?\s*%/gi,
    requires: [/patreon/i],
    scopes: ['src', 'dist'],
  },
  {
    id: 'P3-plan-name-rev',
    label: 'Patreon fee rate labelled with a plan name that does not exist ("5% (Lite)", "12% Premium")',
    token: /\d{1,2}(?:\.\d+)?\s*%\s*\(?\s*(Lite|Premium)\b\)?/gi,
    requires: [/patreon/i],
    scopes: ['src', 'dist'],
  },
  {
    id: 'P4-twelve-percent',
    label: 'Patreon 12% — not a rate Patreon publishes. Standard is 10%; the legacy ceiling is 11% (Pro + Merch)',
    // No trailing \b: "%" is a non-word character, so `%\b` only matches when a
    // word character follows. "12%," silently failed to match until this was
    // caught by running the guard against a line known to be wrong.
    token: /(?:\b12\s*%|\b12 percent\b|\b0\.12\b)/gi,
    requires: [/patreon/i, /\b(fee|rate|take|takes|cut|charge|charges|plan|platform|pay|pays)\b/i],
    scopes: ['src', 'dist'],
  },
  {
    id: 'P5-choose-a-plan',
    label: 'Patreon presented as offering a plan choice — since 2025-08-04 every new creator is on the mandatory 10% standard plan',
    token: /\b(choose|choosing|pick|picking|select|selecting|switch to)\b[^.]{0,50}\bPatreon\b[^.]{0,20}\bplan/gi,
    requires: [],
    scopes: ['src', 'dist'],
  },

  // ---- Ko-fi ------------------------------------------------------------
  {
    id: 'K1-gold-price',
    label: 'Ko-fi Gold priced at $6/month — Gold is $12/month',
    token: /\$6(?:\.00)?\b(?!\d)/g,
    requires: [/\bGold\b/],
    corrected: [/\$12\b/],
    scopes: ['src', 'dist'],
  },
  {
    id: 'K2-breakeven',
    label: 'Ko-fi Gold break-even of $120/month — derived from the wrong $6 price; $12 / 5% = $240/month',
    // (?![,.\d]) so "$120,000" in an unrelated S-corp example is not a $120
    // break-even. That false positive was live until the guard was run.
    token: /\$120\b(?![,.\d])/g,
    requires: [/\bbreak-?even\b|\bpays for itself\b/i],
    corrected: [/\$240\b/],
    scopes: ['src', 'dist'],
  },
  {
    id: 'K3-shop-free',
    label: 'Ko-fi shop sales described as commission-free — shop sales are 5% on both Ko-fi Free and Standard',
    // "no fee" was an alternative here until the dist scan flagged
    // "…memberships, commissions and shop | … | No fee, no minimum" — a payout
    // column three table cells away from the word "shop", collapsed onto one
    // line of built HTML. Character proximity stops tracking meaning when a
    // whole table is one line, so the token has to carry the claim itself.
    token: /\b(?:commission-free|0\s*%\s*commission|zero (?:platform )?fees?)\b/gi,
    requires: [/\bshop\b/i, /ko-?fi/i],
    scopes: ['src', 'dist'],
  },
  // NOT ENCODED, deliberately: "Ko-fi Free charges 5% on one-off tips".
  // This is a real superseded claim, but it is a claim about a SUBJECT, not a
  // value: 5% on one-off tips is wrong for Ko-fi Free and correct for Ko-fi
  // Standard, and the two are described in near-identical sentences. A first
  // draft of this rule fired on four lines that are all correct, including
  // "Standard — $0/month, 5% on every payment type including one-off tips".
  // Nothing short of parsing the subject of the sentence separates them, so no
  // rule ships. See docs/notes/CHIP-FEE-GUARD.md, "What this guard cannot do".

  // ---- Substack ---------------------------------------------------------
  {
    id: 'S1-billing-legacy',
    label: 'Stripe Billing fee of 0.5% — the legacy rate, expired 2025-06-30. Every Substack creator now pays 0.7%',
    // No trailing \b after "%" — see the note on P4. This rule silently failed
    // on "a Billing fee of 0.5% to every recurring payment" until the
    // proof-of-catch run tried to reintroduce the defect and nothing happened.
    token: /(?:\b0\.5\s*%|\b0\.005\b)/g,
    // "Billing" only, NOT "stripe". Buy Me a Coffee charges a real, current
    // 0.5% Stripe PAYOUT PROCESSING fee and a real 0.5% recurring surcharge
    // (fact file §4). Requiring "stripe" flagged both. Stripe Billing is a
    // named product and is the word that separates the dead rate from the live
    // ones.
    requires: [/\bbilling\b/i],
    corrected: [/\b0\.7\s*%|\b0\.007\b/],
    scopes: ['src'],
  },
  {
    id: 'S2-stack-missing-billing',
    label: 'Substack fee stack quoted without Stripe\'s 0.7% Billing fee — the total is 13.6% + $0.30, not 12.9% + $0.30',
    token: /10\s*%\s*\+\s*2\.9\s*%\s*\+\s*\$?0\.30/gi,
    requires: [/substack/i],
    corrected: [/0\.7\s*%/],
    scopes: ['src', 'dist'],
  },
  {
    id: 'S3-old-nets',
    label: 'Substack worked example computed without the 0.7% Billing fee ($8.71 / $4.22 / $43.55 were $8.34 / $4.02 / $42.90)',
    token: /\$(?:8\.71|4\.22|43\.55)\b/g,
    requires: [/substack/i],
    scopes: ['src', 'dist'],
  },
  {
    id: 'S4-effective-range',
    label: 'Substack effective fee quoted as 12-14% — the real range is 13.9-19.6% at the price points the pages use',
    token: /\b12\s*(?:-|–|to)\s*14\s*%/gi,
    requires: [/substack/i],
    scopes: ['src', 'dist'],
  },

  // ---- Gumroad ----------------------------------------------------------
  {
    id: 'G1-flat',
    label: 'Gumroad described as a flat 10% — the rate is 10% + $0.50 per transaction, so the effective rate depends on price (11.7% at $29)',
    token: /\b(?:flat|straight|simple|just|only)\s+10\s*(?:%|percent)|10\s*(?:%|percent)\s+flat\b/gi,
    requires: [/gumroad/i],
    corrected: [/\$0\.50/],
    scopes: ['src', 'dist'],
  },
  {
    id: 'G2-approx-ten',
    label: 'Gumroad fee approximated as 10% with no per-transaction component — omits the $0.50',
    token: /\b(?:roughly|about|around|approximately)\s+10\s*(?:%|percent)/gi,
    requires: [/gumroad/i],
    corrected: [/\$0\.50/],
    scopes: ['src', 'dist'],
  },
  {
    id: 'G3-no-other-fees',
    label: 'Gumroad claimed to have no additional charges — the $0.50 per transaction is an additional charge',
    token: /\bno (?:hidden|additional|extra|other)\s+(?:charges?|fees?|costs?)\b/gi,
    requires: [/gumroad/i],
    corrected: [/\$0\.50/],
    scopes: ['src', 'dist'],
  },
  {
    id: 'G4-keep-ninety',
    label: 'Gumroad take-home computed at a flat 90% — omits the $0.50 per transaction',
    token: /\b(?:keeps?|keeping|take home|takes home|receives?)\s+(?:\$(?:0\.90|26\.10|89\.10)\b|90\s*%|90 percent\b)/gi,
    requires: [/gumroad/i],
    scopes: ['src', 'dist'],
  },
  {
    id: 'G5-old-nets',
    label: 'Gumroad worked example computed without the $0.50 ($26.10 on a $29 sale is $25.60; $89.10 on a $99 sale is $88.60)',
    token: /\$(?:26\.10|89\.10|2\.90)\b/g,
    requires: [/gumroad/i],
    scopes: ['src', 'dist'],
  },
];

// ---------------------------------------------------------------------------

function walk(dir, exts, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, exts, out);
    else if (exts.test(entry)) out.push(full);
  }
  return out;
}

const errors = [];
const warnings = [];
const suppressed = [];

function windowAround(line, index, length) {
  return line.slice(Math.max(0, index - RADIUS), index + length + RADIUS);
}

function scanText(text, rel, scope, bucket) {
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    // Escape hatch, and don't flag this file's own denylist.
    if (/fee-data-ok|check-platform-fees|SUPERSEDED/.test(line)) return;

    for (const rule of SUPERSEDED) {
      if (!rule.scopes.includes(scope)) continue;
      rule.token.lastIndex = 0;
      let m;
      while ((m = rule.token.exec(line)) !== null) {
        if (m[0].length === 0) { rule.token.lastIndex++; continue; }
        const win = windowAround(line, m.index, m[0].length);
        if (!(rule.requires ?? []).every((r) => r.test(win))) continue;

        const corrective =
          CORRECTIVE.find((r) => r.test(win)) ??
          (rule.corrected ?? []).find((r) => r.test(win));
        if (corrective) {
          suppressed.push(`${rel}:${i + 1} [${rule.id}] "${m[0]}" — corrective context (${corrective})`);
          continue;
        }

        bucket.push({
          key: `${rule.id}|${m[0].toLowerCase().replace(/\s+/g, ' ')}`,
          text: `${rel}:${i + 1} [${rule.id}] "${m[0]}" — ${rule.label}`,
        });
        return; // one finding per line is enough to send someone to look
      }
    }
  });
}

// ---- Check 1: fact-file freshness -----------------------------------------
// docs/facts/creator-payment-fees.md is the single source of truth (D-011).
// Its own instruction: "Treat anything older than ~6 months as suspect."
let researchDate = null;
const factPath = join(ROOT, FACT_FILE);
if (!existsSync(factPath)) {
  errors.push(
    `${FACT_FILE} is missing. It is the single source of truth for platform ` +
      `fees under D-011; nothing may publish a fee figure without it.`
  );
} else {
  const fact = readFileSync(factPath, 'utf8');
  researchDate = fact.match(/\*\*Research date:\*\*\s*(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
  if (!researchDate) {
    errors.push(`${FACT_FILE} must carry a "**Research date:** YYYY-MM-DD" line.`);
  } else {
    const ageDays = Math.round((Date.now() - new Date(researchDate).getTime()) / 86_400_000);
    if (ageDays > 365) {
      errors.push(
        `Platform fee data was last verified ${researchDate} (${ageDays} days ago). ` +
          `On the observed rate of change (5 material fee changes across these 5 ` +
          `platforms in the 25 months to 2026-08), roughly two have landed since. ` +
          `Re-fetch every platform's own pricing page and update ${FACT_FILE}.`
      );
    } else if (ageDays > 180) {
      warnings.push(
        `Platform fee data is ${ageDays} days old (verified ${researchDate}). ` +
          `${FACT_FILE} says to treat anything past ~6 months as suspect, and on ` +
          `the observed rate of change one material change is due. Re-verify before ` +
          `publishing new fee copy.`
      );
    }
  }
}

// ---- Check 2: per-module verification dates agree --------------------------
// There is no shared fee module (see Reflections). Four calculators each carry
// their own *_FEES_LAST_VERIFIED literal, so they can silently drift apart and
// away from the fact file. Until a shared module exists, enforce agreement.
const FEE_MODULES = [
  'src/lib/calculators/kofi-earnings.ts',
  'src/lib/calculators/patreon-earnings.ts',
  'src/lib/calculators/substack-revenue.ts',
  'src/lib/calculators/gumroad-revenue.ts',
];
const FEE_DATE_CONST = /export const \w*FEE\w*_LAST_VERIFIED\s*=\s*'([^']+)'/;
// Any other calculator module that declares a fee verification date is governed
// too, and its date is checked alongside the required four. Discovering these
// rather than listing them means a module cannot opt into the constant while
// escaping the agreement check.
const governedModules = new Set(FEE_MODULES);
for (const file of walk(join(SRC, 'lib/calculators'), /\.ts$/)) {
  const rel = relative(ROOT, file);
  if (FEE_DATE_CONST.test(readFileSync(file, 'utf8'))) governedModules.add(rel);
}

const seenDates = new Map();
for (const rel of governedModules) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) {
    errors.push(`${rel} is missing — expected a fee module exporting *_FEES_LAST_VERIFIED.`);
    continue;
  }
  // The four modules use four different names for the same thing:
  // KOFI_FEE_DATA_LAST_VERIFIED, PATREON_FEES_LAST_VERIFIED,
  // GUMROAD_FEES_LAST_VERIFIED, and a bare FEE_DATA_LAST_VERIFIED in Substack.
  // Match the shape rather than the names, and see Reflections for the cleanup.
  const m = readFileSync(p, 'utf8').match(FEE_DATE_CONST);
  if (!m) {
    errors.push(
      `${rel} does not export a *FEE*_LAST_VERIFIED constant. Every fee module ` +
        `must state when its rates were last checked against a primary source.`
    );
    continue;
  }
  seenDates.set(rel, m[1]);
}
const distinct = [...new Set(seenDates.values())];
if (distinct.length > 1) {
  errors.push(
    `Fee modules disagree on when fees were last verified: ` +
      [...seenDates].map(([f, d]) => `${f} = "${d}"`).join('; ') +
      `. All four rates were verified in one pass; they must carry one date.`
  );
} else if (distinct.length === 1 && researchDate) {
  const codeDate = new Date(distinct[0]);
  const factDate = new Date(researchDate);
  if (Number.isNaN(codeDate.getTime())) {
    errors.push(`*_FEES_LAST_VERIFIED is "${distinct[0]}", which is not a parseable date.`);
  } else if (Math.abs(codeDate.getTime() - factDate.getTime()) > 86_400_000) {
    errors.push(
      `Fee modules say verified "${distinct[0]}" but ${FACT_FILE} says ${researchDate}. ` +
        `The code must not claim a verification the fact file does not support.`
    );
  }
}

// ---- Check 3: every module modelling a covered platform must be governed ---
/**
 * D-011 says the fee data has a SINGLE source of truth. That only holds if
 * every module publishing one of these platforms' rates is actually governed by
 * it. `newsletter-revenue.ts` models Substack's fee stack as 10% + 2.9% —
 * correct constants, but the same defect Wave 2 fixed in substack-revenue.ts
 * (Stripe's 0.7% Billing fee is missing), in a second implementation nobody
 * corrected because nobody knew it was there.
 *
 * Rule: a calculator module that names a covered platform AND publishes a rate
 * literal must appear in FEE_MODULES, i.e. must carry a verification date.
 * MEASURED: exactly 5 modules in src/lib/calculators/ name a covered platform.
 * Four are in FEE_MODULES; the fifth is the defective one. No false positives.
 */
const COVERED_PLATFORMS = /\b(ko-?fi|patreon|substack|gumroad|buy ?me ?a ?coffee)\b/i;
const ungoverned = [];
for (const file of walk(join(SRC, 'lib/calculators'), /\.ts$/)) {
  const rel = relative(ROOT, file);
  if (governedModules.has(rel) || rel.includes('/shared/')) continue;
  const text = readFileSync(file, 'utf8');
  if (/fee-data-ok/.test(text)) continue;
  if (!COVERED_PLATFORMS.test(text)) continue;
  // Only care if it actually publishes a rate, not if it merely name-drops.
  if (!/\b0\.\d{2,3}\b|\b\d{1,2}(?:\.\d)?\s*%/.test(text)) continue;
  ungoverned.push(
    `${rel} models fees for a platform covered by ${FACT_FILE} but is not a ` +
      `governed fee module: it exports no *FEE*_LAST_VERIFIED and is not listed ` +
      `in FEE_MODULES in this script. A second, ungoverned implementation of a ` +
      `fee is how a corrected rate stays wrong in one place. Either bring it ` +
      `under the fact file (add the constant, add it to FEE_MODULES) or stop ` +
      `publishing rates from it.`
  );
}

// ---- Check 4: verification date hardcoded in page copy ---------------------
// Same rule the tax guard applies to SourcesBlock: one edit must update every
// page. Ratcheted, because gumroad-calculator.astro already does this twice.
const hardcodedDate = [];
if (distinct.length === 1) {
  const literal = distinct[0];
  for (const file of walk(join(SRC, 'pages'), /\.astro$/)) {
    const rel = relative(ROOT, file);
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (/fee-data-ok/.test(line)) return;
        if (!line.includes(literal)) return;
        if (/import\b|_FEES_LAST_VERIFIED\s*=/.test(line)) return;
        hardcodedDate.push(
          `${rel}:${i + 1} — fee verification date "${literal}" hardcoded. Import ` +
            `the *_FEES_LAST_VERIFIED constant from the calculator's module instead.`
        );
      });
  }
}

// ---- Check 4: superseded fee values in source ------------------------------
const blogFindings = [];
const codeFindings = [];
for (const file of walk(SRC, /\.(ts|tsx|astro|md|mdx)$/)) {
  const rel = relative(ROOT, file);
  const isBlog = rel.startsWith('src/content/');
  scanText(readFileSync(file, 'utf8'), rel, 'src', isBlog ? blogFindings : codeFindings);
}

// ---- Check 5: superseded fee values in RENDERED output ---------------------
// CHIP-PROTOCOL §5: measure the rendered value, never the source value. A fee
// claim can be composed at render time — from a frontmatter `description`, a
// layout, or a serialized island prop — and a source-only scan reads as clean.
// Wave 2 found the dead Patreon plan menu living in exactly that gap.
//
// Only findings with no source-level counterpart are reported, so this check
// surfaces what source scanning MISSED rather than restating it. Skipped when
// dist/ is absent; run `npm run build` first for full coverage.
let distFiles = 0;
const distFindings = [];
if (existsSync(DIST)) {
  for (const file of walk(DIST, /\.html$/)) {
    distFiles++;
    scanText(readFileSync(file, 'utf8'), relative(ROOT, file), 'dist', distFindings);
  }
}
const seenInSource = new Set([...blogFindings, ...codeFindings].map((f) => f.key));
const renderOnly = distFindings.filter((f) => !seenInSource.has(f.key));
codeFindings.push(
  ...renderOnly.map((f) => ({
    ...f,
    text: `${f.text}  [render-only: no source line matches — check frontmatter, layout, or island props]`,
  }))
);

// ---- Report ---------------------------------------------------------------
if (EXPLAIN && suppressed.length) {
  console.log(`\nℹ  ${suppressed.length} match(es) suppressed as corrective text:`);
  for (const s of suppressed) console.log(`   ${s}`);
}

errors.push(...codeFindings.map((f) => f.text));

if (blogFindings.length > RATCHET.blogContent) {
  errors.push(
    `${blogFindings.length} stale fee claim(s) in src/content/ but the ratchet ` +
      `allows ${RATCHET.blogContent}. A NEW one was introduced — fix it, or if you ` +
      `fixed one and the count still rose, fix both. This number may only go down.`
  );
} else if (blogFindings.length < RATCHET.blogContent) {
  warnings.push(
    `Blog fee backlog is down to ${blogFindings.length} (ratchet says ` +
      `${RATCHET.blogContent}). Lower RATCHET.blogContent in this file to lock the ` +
      `gain in — at 0, delete the ratchet and let src/content/ error like the rest.`
  );
}
warnings.push(...blogFindings.map((f) => `${f.text}  [blog backlog]`));

if (ungoverned.length > RATCHET.ungovernedFeeModule) {
  errors.push(
    `${ungoverned.length} ungoverned fee module(s) but the ratchet allows ` +
      `${RATCHET.ungovernedFeeModule}. A NEW one was added.`
  );
} else if (ungoverned.length < RATCHET.ungovernedFeeModule) {
  warnings.push(
    `Ungoverned fee modules down to ${ungoverned.length} (ratchet says ` +
      `${RATCHET.ungovernedFeeModule}). Lower RATCHET.ungovernedFeeModule to lock it in.`
  );
}
warnings.push(...ungoverned);

if (hardcodedDate.length > RATCHET.hardcodedDate) {
  errors.push(
    `${hardcodedDate.length} hardcoded fee verification date(s) but the ratchet ` +
      `allows ${RATCHET.hardcodedDate}. Import the constant instead.`
  );
} else if (hardcodedDate.length < RATCHET.hardcodedDate) {
  warnings.push(
    `Hardcoded fee dates down to ${hardcodedDate.length} (ratchet says ` +
      `${RATCHET.hardcodedDate}). Lower RATCHET.hardcodedDate to lock the gain in.`
  );
}
warnings.push(...hardcodedDate);

if (warnings.length) {
  console.log(`\n⚠  ${warnings.length} platform-fee warning(s):`);
  for (const w of warnings) console.log(`   ${w}`);
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} platform-fee problem(s):\n`);
  for (const e of errors) console.error(`   ${e}`);
  console.error(
    `\nEvery fee figure on this site must trace to a Confident row in ` +
      `${FACT_FILE}\n(DECISIONS.md D-011). Do not resolve a Verify row by picking ` +
      `the plausible number.\nIf a flagged line is genuinely not a platform-fee ` +
      `claim, append \`fee-data-ok\` in a comment.\n`
  );
  process.exit(1);
}

console.log(
  `\n✓ Platform fees clean — verified ${researchDate}, ` +
    `${SUPERSEDED.length} superseded values denied, ` +
    `${suppressed.length} corrective mention(s) correctly ignored` +
    (distFiles ? `, ${distFiles} built pages scanned` : `, dist/ not built (source only)`) +
    (warnings.length ? `. ${warnings.length} warning(s) above.` : '.')
);
