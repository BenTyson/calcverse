# CHIP-FEE-GUARD

**Lane:** implementation
**Owns:** `scripts/check-platform-fees.mjs` (new), `scripts/check-tax-data.mjs`, `package.json` (script entries only), `docs/notes/CHIP-FEE-GUARD.md`
**Model:** Opus, medium effort

No file under `src/` was written. Every defect this chip found in `src/` is
reported below and left for the chips that own those files.

---

## What shipped

### `scripts/check-platform-fees.mjs` — new

The guard D-011 says exists. Five checks:

| # | Check | Tier |
|---|---|---|
| 1 | `docs/facts/creator-payment-fees.md` carries a research date; warn past 180 days, error past 365 | warn / error |
| 2 | Every governed fee module exports a `*FEE*_LAST_VERIFIED`, all agree, and all agree with the fact file | error |
| 3 | No calculator module models a covered platform's fees while ungoverned by the fact file | ratcheted |
| 4 | No page hardcodes the fee verification date as a literal | ratcheted |
| 5 | 17 superseded fee values denied in source **and in built HTML** | error / ratcheted |

### `scripts/check-tax-data.mjs` — extended

One new check (#3), covering a defect class no denylist can see — see
"The second defect class" below.

### `package.json`

```
check:fees     node scripts/check-platform-fees.mjs
check          npm run check:tax-data && npm run check:fees
```

---

## Design rationale — one script or two

**Two scripts, one command.** `check:tax-data` is untouched in mission and still
runs standalone; `check:fees` is a sibling; `npm run check` runs both.

The brief framed this as a trade-off — one command is harder to skip, two keep
concerns separate. The aggregate `check` script dissolves it: nobody has to
remember two names, and the two denylists stay apart. They needed to stay apart
for a concrete reason, not a stylistic one: **the two guards need opposite
matching strategies.** Tax figures are distinctive integers matched
unconditionally (`168,600` is never anything else). Platform fees are ordinary
words and one- or two-digit numbers where *every* rule needs proximity context,
corrective-text suppression, and per-rule requires. Merging them would have
meant either bolting the fee machinery onto tax rules that do not need it, or
maintaining two rule engines inside one file.

They also have different sources of truth (`shared/tax-brackets.ts` vs
`docs/facts/creator-payment-fees.md`), different update cadences (annual IRS
publication vs "without notice"), and different escape hatches
(`tax-data-ok` / `fee-data-ok`).

---

## Verifying the brief before encoding it

Per §7, the handover list was checked against the repo rather than trusted. Two
of its four items did not survive:

| Brief said | Repo says | What shipped |
|---|---|---|
| Deny Patreon `0.05` / `0.08` / `0.12` as a plan menu | `0.05` and `0.08` are **current and correct** — Founders 5% and Pro 8% are real closed-legacy plans, live at `patreon-earnings.ts:115-116`. Only 12% is fabricated. | Denies 12% and the *menu presentation*; never denies 0.05 or 0.08. Denying them would have flagged correct code and taught people to disable the guard. |
| Deny Gumroad "flat 10%" | 10% is Gumroad's real percentage component. The defect is the claim of flatness. | Rules target the claim (`flat 10%`, `no hidden charges`, `keep 90%`), never the number. |
| Deny Ko-fi Gold `$6`, `$120` break-even, shop "commission-free" | Confirmed. | Encoded as K1/K2/K3. |
| Deny Substack's expired `0.005` | Confirmed. | Encoded as S1 — but see the false-positive note below; Buy Me a Coffee charges a **real, current** 0.5%, twice. |

---

## Handling corrective text (brief item 4)

The corrected pages now quote the wrong values in order to correct them. There
are **15 such mentions** in the tree. A guard that flags its own fix gets
disabled, so three mechanisms handle it, in order:

1. **Proximity.** Each rule's `requires` are tested against a ±120-character
   window around the match, not the whole line. Blog lines are entire
   paragraphs; whole-line matching flags *"Etsy sellers routinely pay 12% to
   25%"* purely because "Patreon" appears 200 characters away.
2. **Corrective context.** A match is suppressed when its window carries a
   correction marker (`used to`, `no longer`, `legacy`, `expired`, `closed on`,
   `rather than`, …) **or the corrected value itself** — `"$6"` next to `"$12"`
   is a correction, not a price. Suppressions are counted in the success line
   and listed under `FEE_GUARD_EXPLAIN=1`, so the exemption is auditable rather
   than silent.
3. **Escape hatch.** `fee-data-ok` in a comment, mirroring `tax-data-ok`.

Verified: all 15 corrective mentions are ignored, and 6 hand-written corrective
phrasings of the exact defects stay silent while their assertive counterparts
all fire.

---

## What this guard deliberately cannot do

**"Ko-fi Free charges 5% on one-off tips."** A real superseded claim, and the
one rule that was written and then deleted. It is a claim about a *subject*, not
a value: 5% on one-off tips is wrong for Ko-fi Free and correct for Ko-fi
Standard, and the site describes both in near-identical sentences. The first
draft fired on four lines that are all correct, including
`kofi-calculator.astro:93` — *"Standard — $0/month, 5% on every payment type
including one-off tips"*. Nothing short of parsing the subject separates them,
so no rule ships. The reasoning is recorded in the script where the rule would
have been.

---

## Verification

```
npm install                       ok
npm run build                     Complete, 0 errors (145 pages)
npm run check:tax-data            ✓ clean, 3 warnings (new backlog, see below)
npm run check:fees                ✓ clean, 6 warnings (all ratcheted)
npm run check                     both pass
```

Final `check:fees` line:

```
✓ Platform fees clean — verified 2026-08-25, 17 superseded values denied,
  15 corrective mention(s) correctly ignored, 145 built pages scanned.
```

### Proof of catch — the guard has been seen to fail

Three harnesses, all run against a full scratch copy of the tree in the
scratchpad (`src/`, `scripts/`, `docs/facts/` copied out; the real tree never
modified).

**1. Every superseded value reintroduced, one at a time**, written the way a
chip would actually write it — a plain declarative sentence on a calculator
page, no correction markers:

```
BASELINE  exit=0  PASS (guard silent on clean tree)
CAUGHT  P1-menu  P2-plan-name  P3-plan-name-rev  P4-twelve-percent  P5-choose-a-plan
CAUGHT  K1-gold-price  K2-breakeven  K3-shop-free
CAUGHT  S1-billing-legacy  S2-stack-missing-billing  S3-old-nets  S4-effective-range
CAUGHT  G1-flat  G2-approx-ten  G3-no-other-fees  G4-keep-ninety  G5-old-nets
QUIET   6/6 corrective phrasings of those same defects
RESTORED  exit=0  PASS (silent again)
CAUGHT 17/17 reintroduced defects; 6/6 corrective phrasings correctly ignored
```

**This run earned its keep twice.** The first pass caught 16/17. The miss was
`S1-billing-legacy` failing on *"a Billing fee of 0.5% to every recurring
payment"* — a trailing `\b` after `%` in the token, which only matches when a
word character follows, so `0.5% to` silently never matched. The identical bug
was in `P4` and had already made that rule dead on `"12%,"`. Both are fixed and
commented. A guard reviewed only by reading would have shipped two dead rules.

**2. Structural checks** (`proof2.mjs`): fact file aged past 365 days errors;
aged past 180 days warns and still exits 0; research-date line removed errors;
one module drifting to a different date errors; all four agreeing but
contradicting the fact file errors; a module losing its constant errors; a third
hardcoded date trips the ratchet; `fee-data-ok` silences a finding. 8/8.

**3. The two wrong-computation checks** (`proof3.mjs`): a fourth omitted-92.35%
figure errors; the correctly-adjusted figure is silent; a line that states the
adjustment is silent; `tax-data-ok` silences it; a second ungoverned fee module
errors; `fee-data-ok` exempts it; governing the existing one reports the ratchet
can be lowered. 7/7.

---

## Measurements

### Proximity radius — 120 characters

Swept over the real corpus. Ground truth established by hand: 3 genuine stale
fee claims in the tree, 15 corrective mentions that must stay silent.

| radius | false positives | true positives found (of 3) | corrective mentions suppressed |
|---|---|---|---|
| 20 | **2** | 3 | 7 |
| 40 | 0 | **2** | 12 |
| 60 | 0 | 3 | 13 |
| 80 | 0 | 3 | 15 |
| **100–200** | **0** | **3** | **15** |
| 300 | **1** | 3 | 15 |
| 400+ | **1** | 3 | 16 |

At 20 the corrective suppression itself breaks — `patreon-earnings.ts:24` and
the rendered Patreon blog page are no longer recognised as corrections. At 40 a
true positive is lost. At 300 the false positive is
`patreon-fees-and-earnings.md:134`, *"Etsy sellers routinely pay 12% to 25%"*,
flagged because "Patreon" sits ~200 characters away in the same paragraph.

**60–200 is the clean band; 120 is its midpoint.** Chosen for maximum distance
from both failure modes, not by taste.

### Fact-file staleness thresholds — 180 days warn, 365 days error

Neither number is invented.

- **180** is the fact file's own instruction: *"Treat anything older than ~6
  months as suspect."*
- It is corroborated by the observed rate of change. Dated fee-structure changes
  across these five platforms in the 25 months to 2026-08, all from the fact
  file's own citations: Substack's Billing fee 0.5% → 0.7% (2024-07); Gumroad
  becomes merchant of record (2025-01-01); Patreon's one-time-purchase legacy
  cutoff (2025-05-22); Substack grandfathering expires (2025-06-30); Patreon
  closes the plan menu (2025-08-04). **Five material changes in 25 months ≈ one
  every 5 months across the portfolio.** At 180 days you expect ~1.2 unnoticed
  changes; at 365 you expect ~2.4.
- **365** mirrors the tax guard's existing error threshold, so the two guards
  age on the same schedule.

### SE-tax arithmetic check — precision

| Approach | Lines flagged | Precision |
|---|---|---|
| "15.3% mentioned without 92.35% nearby" (the suggested rule) | **62 of 80** | ~5% — unusable |
| Reproduce the wrong arithmetic, 0.5% tolerance | 8 | 38% (3 real, 5 coincidence/legitimate) |
| **Reproduce the wrong arithmetic, 0.12% tolerance, skip lines stating 92.35** | **3 of 47 candidates** | **100%, all 3 hand-checked** |

### Ungoverned fee module check — blast radius

Exactly **5** modules in `src/lib/calculators/` name a covered platform. Four
are governed. The fifth is the defective one. Zero false positives.

---

## The second defect class — wrong computations, not wrong constants

Recorded per the Command Center's mid-task request, including the options
rejected, so the next guard chip starts from this rather than rediscovering it.

Both reported instances were verified against the repo and both are real:

- `substack-vs-beehiiv-newsletter-revenue.md:197` publishes **$3,672**;
  `24000 × 0.153` exactly. Correct: **$3,391**. Wrong by $281/yr, YMYL, and
  `docs/BLOG-TAX-AUDIT.md` records the audit as CLOSED.
- `newsletter-revenue.ts:59-64` stacks Kit's 3.5% and Stripe's 2.9% when Kit
  publishes 3.5% + $0.30 as processing-inclusive.

**Why a denylist is structurally blind to this.** Every constant is current. 15.3%
is right, $24,000 is right, 3.5% is right, 2.9% is right. Checks 1, 2 and 5 of
both guards are *value* checks. This class is a *relationship* defect.

**What was built, and why these two.**

1. **Reproduce the wrong arithmetic and match against it.** For any line with
   SE-tax context and two dollar figures, flag when one figure equals another
   × 15.3% (or ×12 × 15.3%) to within 0.12% *and* does not equal the correctly
   adjusted product. This is decidable rather than heuristic — it fires only
   when the published number literally is the output of the wrong formula. It
   found a **third** instance nobody had reported:
   `time-to-goal-calculator.astro:169`, *"A $1,000 deduction saves roughly $153
   in SE tax"* (should be ~$141), plus
   `self-employment-tax-calculator.astro:160`, *"$3,060"* (should be ~$2,826).
2. **Governed-module coverage** instead of the suggested "flag a platform fee
   and a processing fee summed in one expression". The narrow version needs the
   fact file to record processing-inclusivity per platform, which it does for
   Gumroad and not for Kit — and Kit is not in the fact file **at all**, which
   is itself the D-011 violation and the root cause of the stacking bug. So the
   rule shipped is the general one: any calculator module publishing rates for a
   covered platform must declare a verification date. It catches
   `newsletter-revenue.ts` on the first run.

**Rejected, with the measurement.**

- *"Flag a bare 15.3% / 0.153 without 0.9235 nearby."* 80 lines site-wide
  mention 15.3%; only 18 mention 92.35% on the same line. This flags **62
  lines**, and nearly all are the perfectly true sentence "self-employment tax
  is 15.3%", which does not need the adjustment in the same breath. A 77% flag
  rate on correct content is precisely the guard people turn off.
- *"Flag any hardcoded dollar figure within N words of 'self-employment tax' /
  'you owe'."* That is the 47-line candidate set the arithmetic check already
  starts from — a suspicion, not a finding. The arithmetic check is the same
  idea made decidable, and it reduces 47 suspicions to 3 findings. Shipping the
  broad version instead would have buried them.

**Generalisable lesson for the next guard.** Where a wrong figure is the output
of a known wrong formula, *implement the wrong formula and compare*. It is
cheaper than a denylist, needs no maintenance as the inputs change, and its
false-positive rate is set by a numeric tolerance you can measure rather than by
how well a regex approximates meaning.

---

## Rollback record

No public-facing text was changed. `package.json` gained two script entries;
removing them and deleting `scripts/check-platform-fees.mjs` restores the prior
state exactly. The `check-tax-data.mjs` change is one additive check block plus
one renamed warning header (`"stale figure(s) in blog content"` →
`"tax-data warning(s)"`, because the bucket now holds non-blog findings).

---

## Changelog entry (pre-drafted — Integrator merges this)

```
Add the platform-fee guard required by D-011. `npm run check:fees` denies 17
superseded creator-platform fee values across source and built HTML, checks the
fact file's verification date against a measured staleness threshold, and
requires every fee module to declare and agree on when it was verified.
`npm run check` now runs both guards. The tax guard gains an arithmetic check
for self-employment tax figures computed without the 92.35% adjustment.
```

## Pre-drafted `CLAUDE.md` entries (do not let me edit that file — Integrator's call)

For the **Commands** block:

```bash
npm run check           # Runs both guards — must pass before work is complete
npm run check:fees      # Guard against stale creator-platform fee data
```

For the **Rules** list:

- `npm run check` must pass with 0 errors before work is considered done (it
  runs `check:tax-data` and `check:fees`)
- Never hardcode a creator-platform fee — every figure traces to a Confident row
  in `docs/facts/creator-payment-fees.md` (D-011). `npm run check:fees` enforces
  this.

For a new **Platform Fee Data** section, mirroring the Tax Data one:

- `docs/facts/creator-payment-fees.md` is the single source of truth. Its 21
  open **Verify** rows block downstream copy (D-011); Confident rows may ship
  arithmetic but not recommendations that depend on an unresolved row (D-014).
- When you correct a platform fee, **add the old value to `SUPERSEDED` in
  `scripts/check-platform-fees.mjs`.** The denylist grows by design — that is
  what makes it stronger over time instead of decaying.
- Re-verify every autumn, or whenever the guard warns that the fact file has
  passed 180 days. Fee schedules change without notice: five material changes
  landed across these five platforms in the 25 months to 2026-08.
- Corrective copy is expected and supported. Writing "Gold used to cost $6, it
  is now $12" is fine; the guard recognises correction markers within 120
  characters. If it flags something that genuinely is not a fee claim, append
  `fee-data-ok`.

---

## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| blocker | Second, ungoverned Substack fee implementation still missing the 0.7% Stripe Billing fee — the exact defect Wave 2 fixed in `substack-revenue.ts`. Also stacks Kit's inclusive 3.5% with Stripe's 2.9%. | `src/lib/calculators/newsletter-revenue.ts:47-64` | detected by new guard check, ratcheted; proposed as CHIP-NEWSLETTER-FEES |
| high | Gumroad still published as "a flat 10 percent fee … no hidden charges. On a $29 ebook, Gumroad takes $2.90 and you keep $26.10" (true: $3.40 / $25.60) and "$99 … you keep $89.10" (true: $88.60). CHIP-BLOG-FEE-COPY did not reach this post. | `src/content/blog/best-platforms-selling-digital-products.md:22` | left, not my file; caught by G1/G5; proposed as CHIP-BLOG-GUMROAD-FIX |
| high | SE tax published at $3,672 on $24,000 — the 92.35% adjustment omitted. Correct $3,391. YMYL, and `docs/BLOG-TAX-AUDIT.md` says CLOSED. | `src/content/blog/substack-vs-beehiiv-newsletter-revenue.md:197` | caught by new tax check, ratcheted; proposed as CHIP-SE-ADJUSTMENT |
| high | Same defect, not previously reported: "$20,000 employer contribution … saves roughly $3,060" (≈$2,826) and "A $1,000 deduction saves roughly $153" (≈$141) | `src/pages/freelance/self-employment-tax-calculator.astro:160`, `src/pages/side-hustle/time-to-goal-calculator.astro:169` | found by this chip; same proposed chip |
| medium | "platforms like Patreon take 5% to 12%" — 12% is not a rate Patreon publishes | `src/content/blog/tiktok-creator-earnings.md:103` | caught by P4, ratcheted; fold into CHIP-BLOG-GUMROAD-FIX |
| medium | Gumroad fee understated as "roughly 10%" on a $29 template (true 11.7%) | `src/content/blog/profit-margin-side-hustles.md:61` | caught by G2, ratcheted; same chip |
| medium | `gumroad-calculator.astro` hardcodes the fee verification date as a string literal twice instead of importing `GUMROAD_FEES_LAST_VERIFIED` — the pattern the tax rules explicitly forbid | `src/pages/creator/gumroad-calculator.astro:141,186` | caught by check 4, ratcheted; proposed as CHIP-FEE-DATE-IMPORT |
| low | Four fee modules use four different names for the same constant: `KOFI_FEE_DATA_LAST_VERIFIED`, `PATREON_FEES_LAST_VERIFIED`, `GUMROAD_FEES_LAST_VERIFIED`, bare `FEE_DATA_LAST_VERIFIED` | `src/lib/calculators/*.ts` | worked around (guard matches the shape); proposed as CHIP-FEE-SHARED-MODULE |
| low | Two dead rules shipped in the first draft of my own guard — a trailing `\b` after `%` never matches | fixed here | fixed here |

### 1. What I saw outside my scope

**D-011's "single source of truth" is not yet true in code.** There is no
`shared/platform-fees.ts` the way there is `shared/tax-brackets.ts`. Four
modules each hold their own rates and their own verification-date constant under
four different names, and a fifth module (`newsletter-revenue.ts`) publishes
Substack rates while being governed by nothing at all. That fifth module is the
whole failure mode in miniature: Wave 2 corrected Substack's Billing fee in the
place everyone was looking at, and the same wrong stack is still live in a file
nobody thought to check. Check 3 exists because of it, but the structural fix is
a shared module.

**The blog fee sweep was not exhaustive.** Per §7 — "when you report a class of
defect, enumerate the whole class programmatically" — I swept all 40 posts for
fee claims about the five covered platforms rather than trusting
`CHIP-BLOG-FEE-COPY.md`. Three claims survived, one of which
(`best-platforms-selling-digital-products.md:22`) is a full worked example in
Gumroad's favour with two wrong dollar figures. That post is a
"best platforms" comparison — exactly the cross-platform comparison content
D-001 names as the strategic core.

**`docs/BLOG-TAX-AUDIT.md` is marked CLOSED and should not be.** Three SE-tax
figures on the site are computed without the 92.35% adjustment, two of them on
calculator pages rather than blog posts. The audit closed because it was looking
for *stale constants*; these are *current constants combined wrongly*. Any
future audit doc should say which defect class it closed.

### 2. Risks in what I built

- **The ratchets can be gamed.** Fixing one blog warning while introducing
  another keeps the count at 3 and passes. The findings are printed with
  file:line on every run, so review sees the swap, but the ratchet alone will
  not stop it. A stronger version would key on a content hash rather than a
  count; that was more machinery than the 3-item backlog justifies. **When each
  backlog reaches 0, delete the ratchet rather than leaving it at 0** — the
  in-code comments say so at each site.
- **Corrective suppression trades false positives for false negatives.** A page
  that says "Ko-fi Gold is legacy pricing at $6" would be suppressed by
  `\blegacy\b`. I judged that acceptable — the failure mode this project has
  actually suffered twice is people writing confident wrong facts, not people
  writing confident wrong facts *inside a correction*. `FEE_GUARD_EXPLAIN=1`
  exists so a reviewer can audit exactly what the exemption swallowed.
- **The dist scan is line-based over collapsed HTML.** A whole `<table>` becomes
  one line, so character proximity stops tracking meaning — this produced a real
  false positive (a payout column reading "No fee, no minimum" three cells from
  the word "shop") that I fixed by narrowing the token rather than the radius.
  Future rules added to `SUPERSEDED` should be tested with `dist/` present, not
  just against source.
- **The 0.12% tolerance on the SE check is tight enough to miss a rounded
  figure.** "About $3,700" on $24,000 would not fire. The check is precise, not
  exhaustive, by design; loosening it to 0.5% halves its precision (measured).

### 3. Proposed follow-up chips

| Chip | Scope | Files it would own | Model |
|---|---|---|---|
| **CHIP-NEWSLETTER-FEES** | Bring `newsletter-revenue.ts` under the fact file: add the 0.7% Stripe Billing fee to Substack, resolve the Kit inclusive-vs-stacked question, add a verification date. **Kit/ConvertKit and Beehiiv are not in the fact file at all** — per D-011 this needs a research chip first, and per §7 that chip must merge before this one is spawned. | `src/lib/calculators/newsletter-revenue.ts`, `src/components/calculators/NewsletterRevenueCalc.tsx`, `src/pages/creator/newsletter-revenue-calculator.astro` | Opus, medium |
| **CHIP-RESEARCH-NEWSLETTER-PLATFORMS** | Prerequisite for the above: verified fact rows for Kit/ConvertKit and Beehiiv, especially whether 3.5% + $0.30 is processing-inclusive. Web-capable. | `docs/facts/newsletter-platform-fees.md` | Sonnet, high |
| **CHIP-BLOG-GUMROAD-FIX** | Clear the 3 ratcheted blog fee warnings. All three figures are Confident rows; no Verify row is load-bearing. Then set `RATCHET.blogContent = 0` and delete the ratchet. | `src/content/blog/best-platforms-selling-digital-products.md`, `profit-margin-side-hustles.md`, `tiktok-creator-earnings.md`, `scripts/check-platform-fees.mjs` | Sonnet, medium |
| **CHIP-SE-ADJUSTMENT** | Fix the 3 omitted-92.35% figures **by running `calculateSelfEmploymentTax()` in a scratch script**, not by hand (§8). Reopen or supersede `docs/BLOG-TAX-AUDIT.md`. Then set `SE_BACKLOG = 0`. | the 3 files listed above, `scripts/check-tax-data.mjs`, `docs/BLOG-TAX-AUDIT.md` | Opus, medium |
| **CHIP-FEE-SHARED-MODULE** | Create `src/lib/calculators/shared/platform-fees.ts` with one `PLATFORM_FEES_LAST_VERIFIED` and the rate constants; migrate all five modules and the pages off their local literals. *Move*-shaped: many files, shallow edits — runs **alone** per §7. Absorbs CHIP-FEE-DATE-IMPORT. | `src/lib/calculators/shared/platform-fees.ts`, the 5 fee modules, `src/pages/creator/*-calculator.astro`, `scripts/check-platform-fees.mjs` | Opus, medium |

`CHIP-FEE-DATE-IMPORT` (import the constant into `gumroad-calculator.astro`
instead of hardcoding the date twice) is worth doing standalone only if the
shared-module chip is not scheduled soon.

### 4. Harness improvements

**§7 should say that a guard is not verified until it has been seen to fail.**
This is the analogue of "measure the RENDERED value" for check scripts. My first
draft passed cleanly on the tree and would have merged looking correct; the
proof-of-catch run found **two rules that could never fire** (a trailing `\b`
after `%` — a regex will not match `12%,` — which had silently killed the
Patreon 12% rule and the Substack 0.5% rule). Exit code 0 from a guard is
ambiguous in a way exit code 0 from a build is not: it means either "clean" or
"broken". Suggested wording:

> **A guard is not verified until you have watched it fail.** For any check
> script, reintroduce each defect it claims to catch, confirm it fires, then
> confirm it is silent again. Record the run. A green guard proves nothing on
> its own.

**§7 should also record the "reproduce the wrong formula" technique**, since it
generalises well beyond this chip — see the second-defect-class section above.

**Two things the protocol got exactly right and I want recorded as load-bearing:**
§7's "trust the repo over the notes" was not academic here — two of the four
values my brief told me to deny are *current correct rates*, and encoding them
would have flagged working code. And §8's built-HTML warning had a sibling I
hit: entity-encoded apostrophes are documented, but **collapsed tables** are the
bigger hazard for any proximity-based check.

**Minor:** §8's "worktree-isolated chips cannot use Bash heredocs" is right, and
I would extend it — several ordinary compound shell commands (`cmd && cmd`,
anything with a redirect, a `for` loop) are also refused by the isolation
wrapper. Write scratch `.mjs` files and run them with `node`; it is faster than
discovering the boundary one command at a time.

### 5. Model tier feedback

Opus/medium was right, and I would not go lower. The work looked like "write a
regex denylist" and was actually a precision/recall design problem with a
hostile corpus: "Premium" appears legitimately on 9 pages, "0.5%" is
simultaneously a dead Substack rate and two live Buy Me a Coffee fees, and the
corrected pages quote every wrong value on purpose. The three judgement calls
that mattered — refusing two of the four denylist entries in my own brief,
deleting the Ko-fi tips rule rather than shipping something that flags correct
text, and rejecting the suggested 15.3% rule on a measured 77% flag rate — are
all "don't build the thing you were asked for" calls. A smaller model asked to
implement the brief as written would most likely have implemented it as written.
