# CHIP-RESEARCH-PAYMENTS

**Lane:** spec/docs
**Owns:** `docs/facts/creator-payment-fees.md`, `docs/notes/CHIP-RESEARCH-PAYMENTS.md`
**Model:** Opus, medium effort
**Date:** 2026-08-25

## What shipped

- **`docs/facts/creator-payment-fees.md`** (new) — verified fee fact file for
  Ko-fi, Patreon, Buy Me a Coffee, Gumroad and Substack. Twelve first-party
  sources loaded this session, listed with URL and access method. Claims split
  Confident / Verify per the mandated format. Sections: source manifest, one
  section per platform (platform fee by state, processing, payout, currency,
  creator-vs-supporter incidence), a cross-platform incidence matrix, a
  read-only code cross-check, and a consolidated list of 21 open Verify rows.
- **`docs/notes/CHIP-RESEARCH-PAYMENTS.md`** (new) — this file.

**Production code was untouched.** No file under `src/`, `scripts/`, or any
shared doc was modified. `src/lib/calculators/*.ts` and
`src/pages/creator/*.astro` were opened **read-only** for the cross-check.
No commits, no pushes, no chips spawned.

## Verification

Spec/docs lane, so the bar is internal consistency plus every code claim
checked against the code.

- **Sources.** Twelve URLs loaded on 2026-08-25 and read in full. Every figure
  in the fact file traces to a numbered source (S1–S12). No citation appears
  that I did not open. Where a search engine surfaced a plausible figure I
  could not load the underlying page for, the row is marked **Verify** rather
  than promoted — this happened for the Gumroad payout minimum, where search
  results claimed both $10 and $100 and the actual page (S11) resolved it to
  **$100**. That single case is why the "load it yourself" rule earns its keep.
- **Code claims.** Read `kofi-earnings.ts`, `patreon-earnings.ts`,
  `gumroad-revenue.ts`, `substack-revenue.ts` in full, and grepped the four
  corresponding `src/pages/creator/*.astro` pages for fee strings. Every
  file:line reference in the fact file and in the findings table below was read
  before being cited.
- **No BMC module.** `ls src/lib/calculators/` returned 46 entries; no
  `buymeacoffee*`, `bmc*`, or `coffee*` file exists. Confirmed by listing, not
  inferred.
- **Derived arithmetic** was computed with `python3`, not by hand, per the
  CLAUDE.md rule about worked examples. Verified: Substack corrected nets
  ($5 → $4.02 / 19.6%; $10 → $8.34 / 16.6%; $50 → $42.90 / 14.2%;
  $100 → $86.10 / 13.9%); Gumroad effective rates ($5 → 20.0%; $29 → 11.7%;
  $100 → 10.5%); Ko-fi Gold break-even at $12/mo against 5% → **$240/month**;
  BMC additive gross-up 25 × 1.029 + 0.30 = 26.025, matching BMC's published
  $26.03 (a true gross-up would give $26.06 — the additive form is correct).
- `npm run build` / `check:tax-data` **not run** — no `src/` changes, and this
  chip's worktree has no `node_modules`. Nothing it produced can affect either.

## Measurements

- **Source freshness, measured not assumed.** Patreon's fee article (S5) carries
  `updated_at` 2026-08-25 and `edited_at` 2026-08-03 — current. BMC's fee
  article (S7) is dated 2026-03-18 — current. Substack's (S12) says "Updated 8
  months ago" and its most recent dated fact is July 2024 — flagged V-S5. Ko-fi
  and Gumroad publish no date; treated as current-as-served.
- **Materiality of the Gumroad `+$0.50`,** measured across the price range the
  calculator actually serves rather than asserted: 20.0% at $5, 15.0% at $10,
  11.7% at the module's own default $29, 10.5% at $100. The omission is largest
  exactly where Gumroad's typical product sits.

## Changelog entry (pre-drafted — Integrator merges this, do not write it to shared docs yourself)

- **Verified creator-payment fee data** — new `docs/facts/creator-payment-fees.md`
  covering Ko-fi, Patreon, Buy Me a Coffee, Gumroad and Substack against 12
  first-party sources. Downstream comparison and calculator chips may write
  nothing that is not in it. The audit found four of four existing creator
  calculators computing on stale or incorrect fee constants — Patreon's plan
  menu no longer exists, Gumroad is missing a per-transaction fee, Substack is
  missing a processing fee, and Ko-fi has the wrong fee on the wrong products —
  plus body copy on the site's best-performing page quoting a $12 product at $6.

---

## Reflections

| Severity | Finding | Location | Status |
|---|---|---|---|
| blocker | Patreon plan menu no longer exists. Code offers Lite 5% / Pro 8% / Premium 12%; the real plans are standard **10%** (mandatory for every creator publishing after 2025-08-04) and closed legacy Founders 5% / Pro 8% / Pro+Merch 11%. "Lite" and "Premium" appear nowhere in Patreon's current fee docs. **The rate every new Patreon creator actually pays cannot be selected in the calculator.** | `src/lib/calculators/patreon-earnings.ts:30-34` | proposed as CHIP-FEE-CORRECT-PATREON |
| blocker | Patreon page copy advises readers to *choose* between plans none of them can access: "Start with Lite (5%)", "Most creators benefit from the Pro plan at 8%", "Only consider Premium at 12%", plus a three-column comparison table. Advice to take a nonexistent action, on a YMYL-adjacent money page, under a live AdSense violation. | `src/pages/creator/patreon-calculator.astro:9,24,72,89,91,102,107-109,120` | proposed as CHIP-FEE-CORRECT-PATREON |
| blocker | Gumroad fee modelled as flat 10%; actual is **10% + $0.50 per transaction**. Understates the fee on every result — 11.7% at the module's own default $29 price, 20% at $5. The 30% Discover marketplace rate is absent entirely. | `src/lib/calculators/gumroad-revenue.ts:39,77` | proposed as CHIP-FEE-CORRECT-GUMROAD |
| high | Ko-fi Gold priced at **$6/month** in page copy; actual is **$12/month**. The derived "$120/month break-even" advice is consequently half the real figure ($240). This is the site's best-performing page — 52 of 106 total clicks (D-008). | `src/pages/creator/kofi-calculator.astro:9,14,79,92,158,162` | proposed as CHIP-FEE-CORRECT-KOFI — **see D-008 conflict note below** |
| high | Ko-fi fee applied to the wrong products in both directions: charged 5% on one-off tips (Ko-fi Free charges **0%**), and 0% on shop/commissions (actually **5%** on every plan but Gold). Page copy asserts three times that shop sales are "always commission-free regardless of plan tier". | `src/lib/calculators/kofi-earnings.ts:39,55`; `src/pages/creator/kofi-calculator.astro:76,79,92` | proposed as CHIP-FEE-CORRECT-KOFI |
| high | Substack missing Stripe's **0.7% Billing fee** on recurring payments. The 0.5% legacy rate expired 2025-06-30, so there is no creator for whom omitting it is correct. Every worked example on the page is understated: $10/mo shown as $8.71 net, actually **$8.34**. | `src/lib/calculators/substack-revenue.ts:29-32`; `src/pages/creator/substack-calculator.astro:9,72,98,120` | proposed as CHIP-FEE-CORRECT-SUBSTACK |
| high | Ko-fi now has **three** fee states (Free 0%-on-tips / Standard 5%-on-everything / Gold $12 for 0%). Standard is the default for new creators and cannot be expressed by the boolean `goldMember` flag. Gold's $12/mo is also never subtracted from net. | `src/lib/calculators/kofi-earnings.ts:15,40` | proposed as CHIP-FEE-CORRECT-KOFI |
| high | **No Buy Me a Coffee calculator exists.** Confirmed by listing `src/lib/calculators/` — no `buymeacoffee*`/`bmc*`/`coffee*` module. 357 impressions at position 17 land on nothing. | `src/lib/calculators/` (absence) | proposed as CHIP-CALC-BMC (the wave's stated build target) |
| medium | Patreon's own fee article contradicts itself: the one-time-purchase section says the platform fee is "between 5% and 12%", but the legacy plan table in the same article tops out at 11%. Recorded as V-P1; neither bound is publishable. | fact file §3, V-P1 | left: upstream ambiguity, needs Patreon support to resolve |
| medium | BMC's fee article is ambiguous on whether Stripe's **0.5% payout processing fee** is billed to the creator on top of 5% + 2.9% + $0.30, or recovered through the +1%/+0.5% surcharges. This changes BMC's headline take rate. Recorded as V-B3. | fact file §4, V-B3 | left: blocks the BMC effective-rate claim — **CHIP-CALC-BMC must not guess** |
| medium | Patreon standard plan has **no micropayment rate** — a $1 pledge is charged 2.9% + $0.30, a ~32.9% effective processing rate. Legacy plans keep 5% + $0.10 at ≤$3. This inversion (the new plan is far worse for small pledges) is the most decision-relevant Patreon fact found and appears nowhere on the site. | fact file §3 | left: content opportunity, not a defect |
| medium | `substack-revenue.ts:49` hardcodes `annualPrice = monthlyPrice * 10` as a "standard 2-month discount". Substack mandates no such ratio; creators set both prices freely. A modelling assumption presented as a platform rule. | `src/lib/calculators/substack-revenue.ts:49` | left: modelling choice, fold into CHIP-FEE-CORRECT-SUBSTACK |
| low | `gumroad-revenue.ts:76` comment "Gumroad fee (includes payment processing)" is **correct** — Gumroad became merchant of record 2025-01-01 and publishes no separate processing fee. Noted so a later chip does not "fix" a right thing. | `src/lib/calculators/gumroad-revenue.ts:76` | left: verified correct, do not change |
| low | Gumroad affiliate commission is modelled as coming off the creator's share (`gumroad-revenue.ts:80-81`, echoed at page L80). Plausible but **not verified** against any Gumroad page. Recorded as V-G3. | `src/lib/calculators/gumroad-revenue.ts:80-81` | left: unverified assumption, flagged |
| low | This worktree was branched two commits behind `main` and shipped a `CLAUDE.md` with no CHIP-PROTOCOL section and a `docs/` with no `CHIP-PROTOCOL.md`, `DECISIONS.md` rulings, `facts/`, `notes/`, or `specs/`. Protocol and rulings were read from the main checkout instead. | worktree `agent-ab8db71bdbb101fb8` | left: reported, see Harness improvements |

### 1. What I saw outside my scope

The thing worth saying plainly: **I was asked to check four fee constants and
found that all four calculators are wrong, and that the prose around them is
wrong in the same direction.** This is not four independent slips. It is the
same failure mode as the two-year-stale tax data, in the category D-001 just
declared the site's strategic core.

The pattern is consistent and it has a shape. Every error understates the
platform's fee or overstates the creator's take-home, except the Ko-fi tip fee,
which overstates. That is what you would expect from figures written once from
memory and never re-verified: the fixed per-transaction components get dropped
(Gumroad's $0.50, Substack's 0.7%) because percentages are what people remember,
and plan menus get frozen at whatever they were when the page was drafted.

Two of these have moved from "stale figure" to something worse. Patreon's page
does not merely quote an old rate — it **counsels a purchase decision between
three plans, two of which have never existed under those names and none of which
a reader can select.** Gumroad's page states "for every $1 you charge, you keep
$0.90" and then builds a competitor comparison table quoting rivals *with* their
fixed fees and Gumroad *without* its own. A reviewer looking for original,
trustworthy value would read that as the opposite.

And the sharpest one: the Ko-fi page — the site's single best performer, 52 of
106 total clicks — tells creators that Ko-fi Gold costs $6/month when it costs
$12, and derives a break-even threshold of $120/month from that wrong price when
the real figure is $240. A creator who follows that advice upgrades at half the
revenue that justifies it. It also asserts, three separate times, that Ko-fi shop
sales are commission-free "regardless of plan tier"; they are 5% on every plan
except Gold.

There is also an opportunity buried in the corrections. Patreon's standard 10%
plan **abolished the micropayment rate**, so a $1 pledge now carries 2.9% + $0.30
— about 32.9% in processing alone — while legacy creators still get 5% + $0.10.
Small-pledge Patreon creators got materially worse off in a way no platform will
publish a comparison about. That is precisely the D-001 thesis in miniature, and
it is sitting unused.

### 2. Risks in what I built

- **Twenty-one Verify rows are open and three of them are load-bearing.** V-B3
  (does BMC bill the 0.5% payout fee to the creator?) blocks any BMC
  effective-rate headline — which is the number the new calculator exists to
  produce. V-K1 (is Ko-fi Gold genuinely still purchasable at $12?) blocks any
  Gold break-even claim; Ko-fi's own pages disagree with each other, with
  `ko-fi.com/gold` headlined "You no longer need Ko-fi Gold" while its FAQ says
  you can still join. V-P1 is Patreon contradicting itself in one article
  (5–12% vs a table topping out at 11%). **A writing chip that "resolves" any of
  these by picking the plausible-looking number reintroduces exactly the defect
  this file exists to prevent.**
- **Patreon's data came through a Zendesk JSON API endpoint,** because the
  canonical HTML page is Cloudflare-gated *and* `patreon.com` is blocked by
  browsing policy in the browser pane. The JSON is Patreon's own first-party
  article body and carries a same-day `updated_at`, so I am confident in the
  content — but it is a less conventional route than the other eleven sources
  and a reviewer should know that.
- **International coverage is thin by design.** I captured Patreon's full
  non-USD processing tables and Gumroad's country payout minimums, but skipped
  the per-currency Payoneer/PayPal payout tables (V-P4). A US-audience hub does
  not need them; a global one does.
- **These are all point-in-time reads.** Patreon restructured its entire pricing
  on 2025-08-04 and Gumroad became merchant of record on 2025-01-01 — both
  inside the window in which this site's copy went unrevised. Whatever ships
  from this file needs a re-verification cadence, not a one-time correction.

### 3. Proposed follow-up chips

Ordered by severity. The four correction chips touch disjoint file sets and
could run concurrently; **CHIP-CALC-BMC should wait** for the corrections so it
inherits a correct comparison baseline rather than a contradictory one.

| Chip | Owns | Job |
|---|---|---|
| **CHIP-FEE-CORRECT-PATREON** | `src/lib/calculators/patreon-earnings.ts`, `src/components/calculators/PatreonCalc.tsx`, `src/pages/creator/patreon-calculator.astro` | Replace the Lite/Pro/Premium menu with standard 10% + legacy Founders 5% / Pro 8% / Pro+Merch 11%, gated on publish date. Add the 2.5% currency conversion fee and payout fees. Rewrite all plan-choice advice — no reader can choose. Highest severity of the four. |
| **CHIP-FEE-CORRECT-GUMROAD** | `src/lib/calculators/gumroad-revenue.ts`, `src/components/calculators/GumroadCalc.tsx`, `src/pages/creator/gumroad-calculator.astro` | Add the `+$0.50` per transaction and a Discover-vs-direct toggle (30% vs 10%+$0.50). Fix the "keep $0.90 of every $1" claim and the comparison table's like-for-unlike framing. Add the $100 payout minimum. Leave the merchant-of-record comment alone — it is correct. |
| **CHIP-FEE-CORRECT-SUBSTACK** | `src/lib/calculators/substack-revenue.ts`, `src/components/calculators/SubstackCalc.tsx`, `src/pages/creator/substack-calculator.astro` | Add Stripe's 0.7% Billing fee. Recompute every worked example by running the calculator (corrected values are in the fact file §7). Make the annual-price ratio an input rather than a hardcoded ×10. Smallest diff of the four. |
| **CHIP-FEE-CORRECT-KOFI** | `src/lib/calculators/kofi-earnings.ts`, `src/components/calculators/KofiCalc.tsx`, `src/pages/creator/kofi-calculator.astro` (**body copy only — title and meta description untouched per D-008**) | Model three states (Free / Standard / Gold) instead of a boolean. Charge 0% on one-off tips under Free, 5% on shop and commissions everywhere but Gold. Subtract Gold's $12/mo from net. Fix the $6 price and the $120 break-even. **Needs V-K1 resolved before any Gold break-even claim ships.** Needs a Command Center ruling first — see §4. |
| **CHIP-CALC-BMC** | `src/lib/calculators/buymeacoffee-earnings.ts`, `src/components/calculators/BuyMeACoffeeCalc.tsx`, `src/pages/creator/buymeacoffee-calculator.astro`, plus registry entries the Command Center assigns | Build the missing calculator against fact file §4. Distinctive feature to model: the creator-vs-supporter fee toggle, using the additive form (`amount × 1.029 + 0.30`) that reproduces BMC's own $25 → $26.03 example. **Blocked on V-B3** for any headline effective-rate figure. Touches `src/lib/config/calculators.ts` and `src/pages/embed/[...slug].astro` — both named collision hot spots in CHIP-PROTOCOL §2, so it must run alone or with those explicitly granted. |
| **CHIP-RESEARCH-PAYMENTS-2** | `docs/facts/creator-payment-fees.md` (append only) | Close the 21 Verify rows, prioritising V-B3, V-K1, V-P1. Needs the `patreon.com` browsing-policy block lifted, or the Zendesk JSON route documented as standard. |

### 4. D-008 conflict — needs a ruling, flagging rather than acting

D-008 bars Wave 1 chips from modifying `src/pages/creator/kofi-calculator.astro`,
reasoning that its title and meta description are the only proven CTR asset on
the site and rewriting them on an untested hypothesis risks half of all traffic.

That reasoning is about **title and meta**. What I found is in the **body copy**:
a $6 price that is really $12, a $120 break-even that is really $240, and a
"shop sales are always commission-free" claim repeated three times that is simply
false. Those are not SEO experiments — they are wrong facts on the page that gets
the most eyes, on a domain carrying a live "low value content" violation.

I did not touch the file, and I am not asking to. But D-008 as written does not
distinguish the two, and a chip reading it literally would leave the errors in
place indefinitely. **This needs an explicit ruling** on whether body-copy
factual corrections are in or out of D-008's scope. My read is that leaving them
is the larger risk — a factual correction to prose is not a ranking experiment,
and the page's ranking rests on its title, which nobody needs to touch.

### 5. Harness improvements

- **My worktree was two commits behind `main` and did not contain the protocol
  I was told to read.** `docs/CHIP-PROTOCOL.md` did not exist in it; neither did
  `docs/facts/`, `docs/notes/`, `docs/specs/`, the D-001…D-009 rulings, or the
  command-center `CLAUDE.md`. I read them from the main checkout instead and
  created `docs/facts/` and `docs/notes/` myself. **This is a silent failure
  mode**: a chip that trusted its own worktree would have concluded the protocol
  didn't apply. Worth adding to CHIP-PROTOCOL §8 "Environment traps": *verify
  `docs/CHIP-PROTOCOL.md` exists in your worktree; if it doesn't, your branch
  predates the operating model — read it from the main checkout and say so.*
  Better: have the Command Center create worktrees from the current `main` tip.
- **A research chip needs a documented Cloudflare playbook.** Five of the twelve
  sources — `ko-fi.com`, `help.ko-fi.com`, `support.patreon.com`,
  `support.substack.com`, `help.gumroad.com` — return 403 to WebFetch and to
  `curl`. WebFetch is the obvious first reach and it fails on most creator-economy
  documentation. The working ladder, worth writing into the protocol: WebFetch →
  browser tools → Zendesk `/api/v2/help_center/en-us/articles/<id>.json` for
  Zendesk-hosted help centres. Without it every research chip rediscovers this.
- **`patreon.com` and `support.patreon.com` are blocked by browsing policy** in
  the browser pane while being fetchable via WebFetch and curl. On a project whose
  second-largest traffic source is Patreon queries, that is a standing
  obstacle — I only got the authoritative fee tables via the JSON API. Worth
  raising with the human as an allowlist question.
- **Bash sandbox rejected two commands as "too complex to verify"** — a `for`
  loop over curl, and a `grep` with an `-oE` alternation pattern. Neither wrote
  anything. Both had to be split into separate calls. Not blocking, but a
  research chip runs a lot of read-only shell and should expect to write it
  flat.
- **The fact-table format held up well and I'd keep it verbatim.** The
  Confident/Verify split did real work: search results confidently told me
  Gumroad's payout minimum was $10, and the actual page said $100. Under a
  format that let me record a plausible number without a loaded source, that
  error ships. One addition worth making to CHIP-PROTOCOL §7: require the fact
  file to record **how** each source was loaded, not just the URL — the next
  chip re-verifying these will hit the same 403 wall and the access method is
  half the value of the citation.

### 6. Model tier feedback

Opus/medium was right for this. The research itself is mechanical, but two parts
were not: noticing that Ko-fi's help-centre breakdown table silently contradicts
its own pricing page and its own Gold page about whether Gold still exists, and
recognising that the Patreon page's defect is categorically worse than a stale
number — it recommends a purchase decision between options that cannot be
selected. A cheaper tier would plausibly have logged "Patreon fee: 10%, code says
8%, update the constant" and moved on, leaving the advisory copy and the whole
legacy-plan structure intact.

The one place I'd have wanted more budget is closing the Verify rows. Several
(V-B3, V-K1) likely need a second research pass with account-level access or a
support inquiry, which is a different kind of work rather than a deeper version
of this one — hence CHIP-RESEARCH-PAYMENTS-2 rather than a request to re-run
this chip hotter.
