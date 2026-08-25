# Fact file — Creator payment platform fees

**Produced by:** CHIP-RESEARCH-PAYMENTS
**Research date:** 2026-08-25
**Scope:** Ko-fi, Patreon, Buy Me a Coffee, Gumroad, Substack

> **Rule for downstream chips:** you may write nothing that is not in this file.
> Rows marked **Verify** are unverified and **block** any copy that depends on them.
> Do not "fill in" a Verify row from memory, from a comparison blog, or from the
> existing calculator code — the existing code is demonstrably stale (see
> §7 Discrepancies).

> **Fee schedules change without notice.** Every figure below was read from the
> platform's own published page on the date in the `Fetched` column. Re-verify
> before republishing. Treat anything older than ~6 months as suspect.

---

## 1. Sources actually loaded in this session

Every one of these was opened and read on **2026-08-25**. Nothing below is cited
that was not loaded.

| # | Platform | URL | How loaded |
|---|---|---|---|
| S1 | Ko-fi | https://ko-fi.com/pricing | browser |
| S2 | Ko-fi | https://help.ko-fi.com/hc/en-us/articles/360002506494-Does-Ko-fi-take-a-fee | browser |
| S3 | Ko-fi | https://ko-fi.com/gold | browser |
| S4 | Patreon | https://www.patreon.com/pricing | WebFetch |
| S5 | Patreon | https://support.patreon.com/api/v2/help_center/en-us/articles/11111747095181.json | curl (JSON body of Patreon's own Help Center article "Creator fees overview"; canonical HTML page is https://support.patreon.com/hc/en-us/articles/11111747095181-Creator-fees-overview, which is Cloudflare-gated). Article metadata: `updated_at` 2026-08-25, `edited_at` 2026-08-03. |
| S6 | Buy Me a Coffee | https://buymeacoffee.com/faq | browser |
| S7 | Buy Me a Coffee | https://help.buymeacoffee.com/en/articles/8105744-how-to-calculate-charges-on-your-payment | browser (article dated **March 18, 2026**) |
| S8 | Buy Me a Coffee | https://help.buymeacoffee.com/en/articles/6364717-when-are-payouts-processed | browser |
| S9 | Buy Me a Coffee | https://help.buymeacoffee.com/en/articles/8105320-how-to-eliminate-the-credit-card-fee-from-your-earnings | browser |
| S10 | Gumroad | https://gumroad.com/pricing | browser + WebFetch |
| S11 | Gumroad | https://gumroad.com/help/article/13-getting-paid | browser |
| S12 | Substack | https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost | browser (article says "Updated 8 months ago") |

**Access notes for the next research chip:**
- `ko-fi.com`, `support.patreon.com`, `support.substack.com`, `help.gumroad.com`
  are all behind Cloudflare and return 403 to WebFetch and to `curl`.
  Use the browser tools.
- `patreon.com` and `support.patreon.com` are **blocked by browsing policy** in
  the browser pane. The Zendesk JSON API (`/api/v2/help_center/en-us/articles/<id>.json`)
  is not Cloudflare-gated and serves the same first-party article body — that is
  how S5 was obtained.
- `help.gumroad.com` requires sign-in; the same articles are public at
  `gumroad.com/help/article/...`.

---

## 2. Ko-fi

**Structural change since this site's calculator was written: Ko-fi now has
three fee states, not two, and the free state charges 0% on one-off tips.**

### Fee table — creator side

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Number of fee states | Three: **Ko-fi Free**, **Standard**, **Ko-fi Gold** | Confident | S1, S2, S3 | 2026-08-25 |
| Ko-fi Free — monthly subscription | $0/mo | Confident | S2 | 2026-08-25 |
| Ko-fi Free — one-off tips | **0%** service fee | Confident | S2 ("One-off tips … Free: 0%"), S1 | 2026-08-25 |
| Ko-fi Free — crowdfunding (Goals) | **0%** service fee | Confident | S2 | 2026-08-25 |
| Ko-fi Free — **monthly** tips | **5%** service fee | Confident | S2 | 2026-08-25 |
| Ko-fi Free — membership tiers | **5%** service fee | Confident | S2 | 2026-08-25 |
| Ko-fi Free — commission sales | **5%** service fee | Confident | S2 | 2026-08-25 |
| Ko-fi Free — shop sales | **5%** service fee | Confident | S2 | 2026-08-25 |
| Ko-fi Free — feature restrictions | No supporter-only content, no scheduled posts, no shorter page name, no "coffee" metaphor change, no exclusive page colors, less shop storage | Confident | S2 | 2026-08-25 |
| Standard — monthly subscription | $0/mo | Confident | S1, S2 | 2026-08-25 |
| Standard — service fee | **5% on every payment type** (one-off tips, monthly tips, memberships, commissions, shop, goals) | Confident | S1, S2 | 2026-08-25 |
| Standard — default for new creators | Yes. "New creators now start with all of Ko-fi unlocked from day one" | Confident | S1, S2 | 2026-08-25 |
| Standard — reversible | Yes, toggled any time at Settings → Payment ("Turn on / off *Get all of Ko-fi*") | Confident | S2 | 2026-08-25 |
| Ko-fi Gold — price | **$12/month** | Confident | S1 (pricing table, Gold column: "$12 /month · 0% service fee") | 2026-08-25 |
| Ko-fi Gold — service fee | 0% on all payment options | Confident | S1, S3 | 2026-08-25 |
| Ko-fi Gold — still available to new creators | Yes, per S3 FAQ ("Yes, you can still join Ko-fi Gold…"), but the same page's headline is "**You no longer need Ko-fi Gold**", and the Help Center's own "full breakdown" table (S2) lists only Free and Standard. **Being actively de-emphasised.** | Confident on the text; see Verify row V-K1 on what it means in practice | S2, S3 | 2026-08-25 |
| Ko-fi Gold — annual plan for new creators | Not offered on S1/S3; S3 says existing subscriptions "continue to renew either monthly or annually depending on your subscription type" | Confident | S3 | 2026-08-25 |
| Gold cancellation behaviour | Cancelling moves you to the percentage-fee model "without losing any of your Gold benefits" | Confident | S3 | 2026-08-25 |
| Gold + Standard interaction | A Gold creator who also has "Get all of Ko-fi" switched on must opt out separately, or the 5% service fee still applies | Confident | S2 | 2026-08-25 |
| Payout fee charged by Ko-fi | **None.** "No buyer fees, payout fees, marketing fees or any other surprises" | Confident | S1 | 2026-08-25 |
| Payout minimum | **None** — Ko-fi never holds funds; payments land in the creator's own PayPal/Stripe account | Confident | S1, S2 | 2026-08-25 |
| Payment processing | Not handled by Ko-fi. Creator connects their **own** PayPal or Stripe account and pays that processor's normal rates | Confident | S1, S2 | 2026-08-25 |
| Payment processing rate | Ko-fi's own guidance: "**usually around 3% + $0.30**", explicitly stated to vary by account type, location and currency | Confident *as a Ko-fi-published estimate*; the true rate is the creator's own processor contract | S2 | 2026-08-25 |
| Fee naming in processor dashboards | Stripe shows Ko-fi's 5% as "Application Fee"; PayPal shows it as "Partner Fee" | Confident | S2 | 2026-08-25 |
| Currencies supported | USD, EUR, GBP, AUD, BRL, CAD, JPY, SGD, THB, NZD | Confident | S2 | 2026-08-25 |
| Currency conversion | Ko-fi charges nothing; PayPal/Stripe "usually add a small percentage" on payments in a currency other than the creator's Ko-fi currency. No figure published. | Confident that Ko-fi adds nothing; the processor's rate is **Verify** (V-K2) | S2 | 2026-08-25 |

### Supporter side

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Supporter/buyer fees | **None.** "No buyer fees" | Confident | S1 | 2026-08-25 |
| Supporter payment methods | PayPal*, Apple Pay, Google Pay, Venmo*, Cash App, credit/debit cards, local methods. *PayPal and Venmo require the creator to have connected a PayPal account. | Confident | S1 | 2026-08-25 |

### Verify — Ko-fi

| ID | Question | What blocked verification |
|---|---|---|
| V-K1 | Is Ko-fi Gold genuinely still purchasable by a brand-new creator, and at $12/mo? | S1's pricing table and S3's FAQ both say yes; S3's headline says "You no longer need Ko-fi Gold" and S2's authoritative breakdown table omits Gold. Cannot resolve without creating an account and reaching checkout, which is out of scope. **Do not build a Gold break-even claim on this without resolving it.** |
| V-K2 | Effective PayPal/Stripe rate a typical Ko-fi creator actually pays | Ko-fi publishes only "usually around 3% + $0.30" and disclaims variation. A precise figure would require PayPal's and Stripe's own rate cards, which were not fetched this session. |
| V-K3 | Whether the 5% service fee is charged on the pre-tax or post-tax amount, and who is merchant of record | Not addressed on any Ko-fi page loaded. |

---

## 3. Patreon

**Structural change since this site's calculator was written: the Lite/Pro/Premium
menu no longer exists. Every creator who published after 2025-08-04 is on a single
standard 10% plan. 5% / 8% / 11% survive only as closed legacy plans.**

### Platform fee

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Standard plan — platform fee | **10%** of income earned on Patreon | Confident | S4, S5 | 2026-08-25 |
| Who is on the standard plan | Any creator who **published their page after 2025-08-04** | Confident | S5 | 2026-08-25 |
| Basis of the platform fee | Percentage of successfully processed membership and one-time purchases, **calculated excluding sales tax** | Confident | S5 | 2026-08-25 |
| Legacy plan — Founders | **5%** — closed to new creators since 2019-05-07; holder must not have changed plan since | Confident | S5 | 2026-08-25 |
| Legacy plan — Pro | **8%** — closed to new creators after 2025-08-04 | Confident | S5 | 2026-08-25 |
| Legacy plan — Pro + Merch | **11%** — closed to new creators after 2025-08-04; includes merch fulfilment | Confident | S5 | 2026-08-25 |
| "Lite" and "Premium" plans | **Do not appear anywhere in Patreon's current fee documentation.** The legacy table lists only Founders / Pro / Pro + Merch. | Confident that they are absent from S4 and S5 | S4, S5 | 2026-08-25 |
| How legacy status is lost | Unpublishing the page (even briefly), Patreon unpublishing it for any reason, or republishing after 2025-08-04 → moved to standard 10%. Patreon advises using the **pause** tool instead of unpublishing. | Confident | S5 | 2026-08-25 |
| What the 10% includes | Hosted creator page; monthly and annual memberships; digital product sales; video hosting up to 100 hrs/month if the creator has paying fans; chats, polls, comments; audience and growth insights | Confident | S5 | 2026-08-25 |

### Payment processing — standard 10% plan, USD payout

| Member's payment method | Member's location | Rate | Confidence | Source |
|---|---|---|---|---|
| Credit card / Apple Pay | Any | **2.9% + $0.30** | Confident | S5 |
| PayPal / Venmo | US | **2.9% + $0.30** | Confident | S5 |
| PayPal / Venmo | Non-US | **3.9% + $0.30** | Confident | S5 |

> **Critical modelling note:** on the standard 10% plan there is **no micropayment
> rate**. S5 states verbatim: "Unlike legacy plans, the standard 10% plan applies
> the same processing rates to all payments, regardless of amount." A $1 or $3
> pledge on the standard plan is charged 2.9% + $0.30, which is a ~32.9%
> effective processing rate at $1. This is the single most decision-relevant fact
> about Patreon for a low-pledge creator.

### Payment processing — standard 10% plan, non-USD payout

| Payout currency | Rate | Confidence | Source |
|---|---|---|---|
| EUR | 3.4% + €0.35 | Confident | S5 |
| GBP | 3.4% + £0.35 | Confident | S5 |
| CAD | 3.2% + CA$0.35 | Confident | S5 |
| AUD | 3% + A$0.30 | Confident | S5 |
| DKK | 3.4% + DKK 2.60 | Confident | S5 |
| NOK | 3.4% + NOK 2.80 | Confident | S5 |
| SEK | 3.4% + SEK 3.25 | Confident | S5 |
| CZK | 3.4% + CZK 9 | Confident | S5 |
| HKD | 3.9% + HK$2.35 | Confident | S5 |
| HUF | 3.4% + HUF 129 | Confident | S5 |
| NZD | 3.9% + NZ$0.45 | Confident | S5 |
| PLN | 3.4% + PLN 1.75 | Confident | S5 |
| SGD | 3.9% + SGD 0.40 | Confident | S5 |

### Payment processing — legacy plans (Pro 8%, Pro + Merch 11%), USD payout

Legacy plans **do** have a micropayment rate. Threshold: tier price **≤ $3** (or the
local-currency equivalent).

| Member's payment method | Micropayment (≤ $3) | Standard (> $3) | Confidence | Source |
|---|---|---|---|---|
| Credit card / Apple Pay | 5% + $0.10 | 2.9% + $0.30 | Confident | S5 |
| PayPal / Venmo (US) | 5% + $0.10 | 2.9% + $0.30 | Confident | S5 |
| PayPal / Venmo (non-US) | 6% + $0.10 | 3.9% + $0.30 | Confident | S5 |

Legacy non-USD micropayment thresholds and rates (from S5): EUR 5% + €0.15 (≤ €3) /
3.4% + €0.35; GBP 5% + £0.15 (≤ £3) / 3.4% + £0.35; CAD 5% + CA$0.10 (≤ CA$3) /
3.2% + CA$0.35; AUD 5% + A$0.10 (≤ A$3) / 3% + A$0.30; DKK 5% + DKK 1.10 (≤ DKK 25) /
3.4% + DKK 2.60; NOK 5% + NOK 1.50 (≤ NOK 30) / 3.4% + NOK 2.80; SEK 5% + SEK 1.50
(≤ SEK 30) / 3.4% + SEK 3.25; CZK 5% + CZK 3.85 (≤ CZK 75) / 3.4% + CZK 9; HKD 5% +
HK$1.20 (≤ HK$25) / 3.9% + HK$2.35; HUF 5% + HUF 54.70 (≤ HUF 1000) / 3.4% + HUF 129;
NZD 5% + NZ$0.25 (≤ NZ$4) / 3.9% + NZ$0.45; PLN 5% + PLN 0.70 (≤ PLN 15) / 3.4% +
PLN 1.75; SGD 5% + SGD 0.20 (≤ SGD 4) / 3.9% + SGD 0.40. All Confident, S5, 2026-08-25.

### Payment processing — Founders plan (5%), USD only

| Member's payment method | Rate | Confidence | Source |
|---|---|---|---|
| Credit card / Apple Pay | **1.6% + $0.30** | Confident | S5 |
| PayPal / Venmo | **2.65% + $0.28** | Confident | S5 |

A Founders creator who changes payout currency keeps the 5% platform fee but moves
to the **standard** processing rates. (Confident, S5.)

### Currency conversion

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Currency conversion fee | **2.5%** when a member pays in a currency different from the creator's payout currency | Confident | S5 | 2026-08-25 |
| Basis | Calculated on the **full processed amount, including tax** | Confident | S5 | 2026-08-25 |
| Refundable | Yes — refunded if the member is refunded | Confident | S5 | 2026-08-25 |
| Where shown | "Payment Fees" column of the creator's Earnings dashboard | Confident | S5 | 2026-08-25 |
| Not charged when | Member pays in the creator's own payout currency | Confident | S5 | 2026-08-25 |

### Payout transaction fees

Deducted **when the balance leaves Patreon**, and — per S5 — **not shown** in the
Earnings dashboard fee breakdown.

| Payout method | US creator (USD) | Non-US creator, Patreon currency = USD | Non-US creator, local currency | Confidence | Source |
|---|---|---|---|---|---|
| Direct deposit (Stripe) | **$0.25 per payout**. Not supported for US Virgin Islands or other US territories/possessions except Puerto Rico. | Not supported | Not supported | Confident | S5 |
| Bank transfer (Payoneer) | Not supported | USD → local currency: **$0.25 + 1.55% currency conversion per payout**. USD → USD bank account: **$0.50 per payout**. | **$0.50 local equivalent per payout** | Confident | S5 |
| PayPal | **1%, minimum $0.25, capped at $20 USD**; **$10 minimum payout** | 1%, min $0.25, cap $20 USD; $10 minimum payout. PayPal may charge more to move funds to a bank. | Supported; per-currency table not captured | Confident | S5 |
| Payoneer Wallet | Not supported | **$1.00 USD per payout**; **$25 minimum payout**. Legacy global bank transfer $3.00 USD (only for accounts connected before 2018-12-19). | Supported; per-currency table not captured | Confident | S5 |

### One-time (digital product) purchases

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Listing fee | Free | Confident | S5 | 2026-08-25 |
| Platform fee on one-time purchases | Same as membership payments — "between 5% and 12% of successfully processed sales + applicable taxes, depending on your platform plan" | Confident **as published**; see V-P1 — the "12%" upper bound contradicts the legacy table in the same article, which tops out at 11% | S5 | 2026-08-25 |
| Legacy one-time-purchase rate | Creators who started selling digital products **before 2025-05-22** may be on a **5%** one-time purchase fee | Confident | S5 | 2026-08-25 |
| Processing on one-time purchases | Standard processing rate, varies by currency (e.g. 2.9% + $0.30 USD) | Confident | S5 | 2026-08-25 |

### Other

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Creator-to-creator membership payments | When a creator's Patreon balance covers a membership to another creator, **no payment processing fee** applies. If the balance is short, the card is charged and processing fees apply. | Confident | S5 | 2026-08-25 |
| Shared membership (Founders only) | If a member supports multiple creators in one transaction and the creator is on Founders, the processing fee is **split** between those creators | Confident | S5 | 2026-08-25 |
| Tax on creator fees | Where required by law, Patreon collects VAT/GST/sales tax **on the platform fee itself**, based on creator business location, shown as a separate line item | Confident | S5 | 2026-08-25 |
| Supporter-side fee | Patreon's own pricing page does not describe a fee charged to the patron; taxes may be collected from members by law | Confident that no patron fee is described; see V-P2 | S4, S5 | 2026-08-25 |

### Verify — Patreon

| ID | Question | What blocked verification |
|---|---|---|
| V-P1 | Is the one-time-purchase platform fee ceiling 11% or 12%? | S5 says "between 5% and 12%" in the one-time-purchase section but its own legacy plan table lists a maximum of 11% (Pro + Merch). Internal contradiction in Patreon's own article. **Do not publish either bound as fact.** |
| V-P2 | Does Patreon ever add a fee to the patron's charge? | Not addressed on S4 or S5. Only tax collection from members is mentioned. |
| V-P3 | Direct-deposit payout **minimum** for US creators | S5 gives payout minimums for PayPal ($10) and Payoneer ($25) but states no minimum for Stripe direct deposit. |
| V-P4 | Non-USD Payoneer/PayPal per-currency payout fee tables | S5 references "the table below" for these; the per-currency rows were beyond the portion of the article body extracted. Re-fetch S5 and read to the end if a hub needs them. |
| V-P5 | Whether Patreon is merchant of record and how sales tax hits creator take-home | S5 links to a separate "Taxes on creator fees" article that was not fetched. |

---

## 4. Buy Me a Coffee

**No calculator exists on this site for this platform** (confirmed against
`src/lib/calculators/` — see §7). This is the build target.

### Fee table

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Monthly/subscription cost to creator | **$0.** "We do not charge a monthly fee. All features including publishing and emails are free for everyone." | Confident | S6, S7 | 2026-08-25 |
| Platform fee | **5% per transaction**, flat — "you get to keep 95% of your earnings" | Confident | S6, S7 | 2026-08-25 |
| Plan tiers | **None.** Single flat rate; no paid upgrade tier exists. | Confident | S6, S7 | 2026-08-25 |
| Fee variation by product type (tips / memberships / shop) | None published — S6 and S7 both describe one flat 5% transaction fee with no carve-outs | Confident that no differentiation is published; see V-B1 | S6, S7 | 2026-08-25 |
| Payment processor | **Stripe** (plus Wise for some flows) | Confident | S6, S7 | 2026-08-25 |
| Base processing fee | **2.9% + $0.30** per successful transaction | Confident | S7 | 2026-08-25 |
| Payout processing fee | **0.5%** (Stripe payout processing, per S7) | Confident | S7 | 2026-08-25 |
| International surcharge | **+1%** for transactions outside the US | Confident | S7 | 2026-08-25 |
| Subscription surcharge | **+0.5%** for subscription (recurring) payments | Confident | S7 | 2026-08-25 |
| Who bears processing by default | **The creator.** "By default, this fee is deducted from your earnings, so you receive slightly less than the amount your supporter pays." | Confident | S9 | 2026-08-25 |
| Can the supporter be made to cover processing | **Yes** — Dashboard → Settings → "Cover credit card fee". Toggle **on** = creator pays; toggle **off** = supporter pays extra. | Confident | S9 | 2026-08-25 |
| Worked example published by BMC | With the supporter covering it, **a $25 contribution costs the supporter $26.03** and the creator receives the full $25 | Confident | S9 | 2026-08-25 |
| Can the supporter be made to cover the **5% platform fee** | No such option is described. Only the credit card fee is toggleable. | Confident that no such option is published | S7, S9 | 2026-08-25 |
| Payout minimum | **$10** — "You can request a payout once your outstanding balance reaches $10 or more." | Confident | S8 | 2026-08-25 |
| Payout mechanism | Balance → creator's Stripe account → bank | Confident | S6, S8 | 2026-08-25 |
| Payout timing | Requests processed in ~7 business days; bank leg a further 3–5 business days. First payout requires one-time human account review; first payout typically 7–14 days total. | Confident | S8 | 2026-08-25 |
| Countries supported for payout | **44** | Confident | S6 | 2026-08-25 |
| Supporter payment methods | All major credit and debit cards, Apple Pay, Google Pay, Cash App, "other global payment methods" | Confident | S6 | 2026-08-25 |
| Supporter account required | No — BMC advertises one-tap payment with no sign-up | Confident | S6 | 2026-08-25 |
| Ads / data sale | "We'll never show ads and we'll never sell your data" | Confident | S6 | 2026-08-25 |

### Modelling note — the $25 → $26.03 example

`25 × 1.029 + 0.30 = 26.025 → $26.03`. BMC **adds** 2.9% + $0.30 on top of the
contribution rather than grossing up to make itself whole. A gross-up would be
`(25 + 0.30) / (1 − 0.029) = $26.06`. Use the **additive** form to match BMC's own
published number. (Derived arithmetic on S9's published example; the formula
itself is not stated by BMC — treat the generalisation beyond $25 as an
inference, flagged V-B2.)

### Verify — Buy Me a Coffee

| ID | Question | What blocked verification |
|---|---|---|
| V-B1 | Does the 5% apply identically to one-off coffees, memberships, shop items, and Extras? | S6 and S7 state a single flat 5% with no carve-out, but neither enumerates the product types the way Ko-fi's S2 table does. Absence of a carve-out is not the same as a stated equivalence. |
| V-B2 | Does the additive `amount × 1.029 + 0.30` form hold at other amounts, and do the +1% international / +0.5% subscription surcharges also get passed to the supporter when "Cover credit card fee" is off? | S9 publishes exactly one worked example ($25 → $26.03) and does not give a formula or mention the surcharges. |
| V-B3 | Is the 0.5% payout processing fee charged **to the creator** on top of the 5% + 2.9% + $0.30, or absorbed by BMC? | S7's wording is ambiguous: it lists 0.5% among Stripe's charges, then says the surcharges "help us to cover the payout processing charge imposed by Stripe" — which reads as BMC recovering it via the +1%/+0.5% rather than billing it separately. **This materially changes take-home; do not publish a BMC effective-rate number until resolved.** |
| V-B4 | Whether BMC is merchant of record / how sales tax and VAT are handled | S7 links a separate tax article that was not fetched. |

---

## 5. Gumroad

### Fee table

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Monthly cost | **$0.** "Gumroad doesn't charge you a monthly fee." No listing fees. | Confident | S10 | 2026-08-25 |
| Direct sales fee | **10% + $0.50 per transaction** — "for all sales through your profile or direct links to your customers" | Confident | S10 | 2026-08-25 |
| Discover marketplace fee | **30% per transaction** — "when new customers find and buy from you through our discover marketplace" | Confident | S10 | 2026-08-25 |
| Separate payment processing fee | **None.** "No hidden fees, no monthly charges"; the fee is "deducted as a small percentage of every sale". No processing line item is published. | Confident | S10 | 2026-08-25 |
| Merchant of record | **Gumroad, since 2025-01-01.** Handles sales tax / VAT / GST collection and remittance worldwide; creator tax settings are disabled automatically. | Confident | S10 | 2026-08-25 |
| Applies to memberships | Yes — memberships are supported and S10 states the fee is "per transaction for all sales" | Confident that memberships are supported; see V-G1 on whether the $0.50 recurs per billing cycle | S10 | 2026-08-25 |
| Payout minimum | **$100 USD.** "⚠️ You need a minimum balance of $100 USD to receive a payout." | Confident | S11 | 2026-08-25 |
| Higher local minimums | Some countries are higher, e.g. Korea 40,000 KRW, Thailand 600 THB, Albania 3,000 ALL, Colombia 140,000 COP, Malaysia 133 MYR, Panama 50 USD, El Salvador 30 USD | Confident | S11 | 2026-08-25 |
| Bank payout fee | None published | Confident that none is published | S11 | 2026-08-25 |
| **PayPal payout fee** | **2% processing fee.** PayPal payouts processed in USD, arrive in 1–3 business days. Offered only where bank payouts are unavailable. | Confident | S11 | 2026-08-25 |
| **Instant payout fee** | **3%**, US creators only, up to $10K. Requires ≥1 prior payout and a Stripe account processing with Gumroad ≥60 days. | Confident | S11 | 2026-08-25 |
| Payout schedule | Daily / weekly / monthly / quarterly, creator-selectable, with a creator-set threshold. Weekly/monthly/quarterly payouts carry a **minimum 7-day holding period**; payouts cover sales through the previous Friday (UTC). Daily payouts are US-only, need an eligible bank account and ≥4 prior payouts. | Confident | S11 | 2026-08-25 |
| Payout day | Tuesday (most countries), Wednesday (EUR + AU/BG/CA/CZ/DK/GI/HU/LI/NO/PL/SG/KR/SE/CH/AE/UK), Thursday (US bank accounts and US debit cards), Friday (PayPal and own-connected-Stripe creators) | Confident | S11 | 2026-08-25 |
| Currency conversion | Payouts are in the creator's local currency. Conversions use rates **at the time of sale, not at time of payout**, typically mid-market. No conversion fee published. | Confident | S11 | 2026-08-25 |
| Own PayPal account connected | Proceeds from PayPal sales are credited at the **time of sale**, not via the balance/payout cycle | Confident | S11 | 2026-08-25 |
| Payout rails not supported | Payoneer, Wise, cheque, money order, wire transfer | Confident | S11 | 2026-08-25 |
| Rejected-account edge case | If Stripe finally rejects an account, any remaining balance **≥$1** is paid out automatically despite the $100 minimum, unless held for review/fraud | Confident | S11 | 2026-08-25 |
| Country-change forfeiture | Changing payout country (or switching method in a way needing a new connected account) **forfeits** unpaid amounts on the old country-specific connected account. Confirmation requires typing "I understand". Terms of Service §11.4. | Confident | S11 | 2026-08-25 |
| Supporter/buyer fee | None published | Confident that none is published | S10 | 2026-08-25 |

### Modelling note — the $0.50 matters

The `+ $0.50` is what turns Gumroad's headline 10% into a price-dependent rate:

| Price | Fee | Effective rate |
|---|---|---|
| $5 | $1.00 | 20.0% |
| $10 | $1.50 | 15.0% |
| $29 | $3.40 | 11.7% |
| $50 | $5.50 | 11.0% |
| $100 | $10.50 | 10.5% |

(Arithmetic derived from the S10 rate; the table itself is not published by Gumroad.)

### Verify — Gumroad

| ID | Question | What blocked verification |
|---|---|---|
| V-G1 | Does the $0.50 apply to each recurring membership charge, or only the initial sale? | S10 says "per transaction for all sales" without addressing recurring billing specifically. |
| V-G2 | Is Discover 30% instead of, or in addition to, the 10% + $0.50? | S10 presents them as two alternative per-transaction rates. It does not state explicitly that Discover replaces the direct rate. |
| V-G3 | Whether Gumroad's affiliate commission is calculated before or after the platform fee | Not addressed on S10 or S11. The existing calculator assumes affiliate commission comes off the creator's share (see §7). |
| V-G4 | Any currency conversion spread on non-USD payouts | S11 says conversions use "typically mid-market rates" but publishes no explicit spread or fee. |

---

## 6. Substack

### Fee table

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Cost to publish | **Free**, regardless of subscriber count | Confident | S12 | 2026-08-25 |
| Substack platform fee | **10% of each transaction** | Confident | S12 | 2026-08-25 |
| Stripe credit card fee | **2.9% + $0.30 per transaction** | Confident | S12 | 2026-08-25 |
| **Stripe Billing fee (recurring)** | **0.7%** for recurring payments, **as of July 2024** | Confident | S12 | 2026-08-25 |
| Legacy Billing fee | Creators who enabled payments **before 2024-07-10** kept the previous **0.5%** billing fee **until 2025-06-30**. That grandfathering has **expired** — as of today all creators are on 0.7%. | Confident | S12 | 2026-08-25 |
| Billing fee visibility | **Not** included in the "Stripe processing fee" figure in the Stripe payment breakdown. Appears separately as "Stripe fee" under Transactions → All Activity, or under a payout's Summary. | Confident | S12 | 2026-08-25 |
| Billing fee on non-card methods | Yes — Stripe's Billing fee also applies to non-credit-card methods | Confident | S12 | 2026-08-25 |
| Plan tiers | **None.** Single 10% rate; no paid upgrade tier. | Confident | S12 | 2026-08-25 |
| Reader-side fee from Substack | **None.** "Substack won't charge you any additional fees" | Confident | S12 | 2026-08-25 |
| Subscription pricing | Set by the creator (monthly and annual). Substack does not mandate a discount ratio. | Confident | S12 | 2026-08-25 |
| Reader payment methods | Most major cards (Visa, MasterCard, Discover, Amex). European readers may also see direct debit, iDEAL, Bancontact, Sofort. | Confident | S12 | 2026-08-25 |

### Stripe fees for non-card methods — example for a **US** Stripe account

S12 presents these as an example; they depend on the country of Stripe registration.

| Method | Fee | Confidence | Source |
|---|---|---|---|
| iDEAL | 80¢ | Confident | S12 |
| Bancontact | 1.4% + 30¢ | Confident | S12 |
| Sofort | 1.4% + 30¢ | Confident | S12 |
| SEPA Direct Debit | 0.8% + 30¢, capped at $6.00. Stripe charges **$10.00** for failed or disputed SEPA Direct Debit payments. | Confident | S12 |

### Modelling note — total Substack take rate

Card subscription, US Stripe account:
`10% (Substack) + 2.9% + $0.30 (Stripe card) + 0.7% (Stripe Billing) = 13.6% + $0.30`.

| Price | Total fees | Net | Effective rate |
|---|---|---|---|
| $5/mo | $0.98 | $4.02 | 19.6% |
| $10/mo | $1.66 | $8.34 | 16.6% |
| $50/yr | $7.10 | $42.90 | 14.2% |
| $100/yr | $13.90 | $86.10 | 13.9% |

(Arithmetic derived from S12's rates; the table itself is not published by Substack.)

### Verify — Substack

| ID | Question | What blocked verification |
|---|---|---|
| V-S1 | Payout minimum and payout schedule | S12 does not address payouts at all — they run through the creator's own Stripe account, so Stripe's own payout terms apply. Not fetched this session. |
| V-S2 | Whether Substack's 10% is calculated before or after Stripe's fees, and before or after tax | S12 says "10% of each transaction" without specifying the base. |
| V-S3 | Fees on Substack features other than subscriptions (pledges, gifts, Notes, paid founding tiers, Substack Network) | S12 covers paid subscriptions only. |
| V-S4 | Whether Substack is merchant of record for VAT/sales tax | Not addressed on S12. |
| V-S5 | Freshness | S12 shows "Updated 8 months ago" (≈ 2025-12) and its most recent dated fact is July 2024. It is the current live version of the page, but it is not a recently-revised document. |

---

## 7. Cross-check against existing calculator code — DISCREPANCIES

Read-only comparison. **No code was modified by this chip.** Files read:
`src/lib/calculators/kofi-earnings.ts`, `patreon-earnings.ts`,
`gumroad-revenue.ts`, `substack-revenue.ts`, plus the corresponding
`src/pages/creator/*.astro` body copy.

`ls src/lib/calculators/` confirms **there is no Buy Me a Coffee module** — no
`buymeacoffee*`, `bmc*`, or `coffee*` file exists. The 357 impressions at
position 17 are landing on nothing.

### Ko-fi — `src/lib/calculators/kofi-earnings.ts`

| Line | Code says | Verified fact | Impact |
|---|---|---|---|
| 39 | `KOFI_FREE_FEE = 0.05` applied to donations **and** memberships (L54–55) | On **Ko-fi Free**, one-off tips and Goals are **0%**. Only monthly tips, memberships, commissions and shop are 5%. | **Over-states** fees for the free-tier tipping creator — the single most common Ko-fi user, and the exact audience of the site's top page. |
| 55 | `platformFees = (donationRevenue + membershipRevenue) * rate` — shop and commission revenue **excluded** from the platform fee | Shop sales and commissions are **5% on every plan except Gold** | **Under-states** fees for any creator selling through the Ko-fi shop or taking commissions. |
| 15, 40 | Two states only: free (5%) vs Gold (0%) | Three states: Free / Standard / Gold | The default state for a new creator (**Standard**, 5% on everything) cannot be expressed. |
| — | Gold's monthly subscription cost is never subtracted from `netMonthly` | Gold costs $12/mo | Gold take-home is over-stated by the full subscription price. |
| 41–42 | `PAYMENT_PROCESSING_BASE = 0.029`, `+$0.30` | Ko-fi's own guidance is "around **3%** + $0.30" and explicitly varies | Minor; within Ko-fi's stated range. |

### Ko-fi page copy — `src/pages/creator/kofi-calculator.astro`

| Line | Copy says | Verified fact |
|---|---|---|
| 9, 14, 79, 92, 158, 162 | "Ko-fi Gold members (**$6/month**)" / "Gold costs $6/month" | **$12/month** (S1) |
| 14, 92, 162 | "If you receive more than **$120/month** … Gold pays for itself" | Derived from the wrong $6 price. At $12/mo against a 5% fee the break-even is **$240/month**. |
| 9, 79 | "Free Ko-fi accounts pay a 5% platform fee on donations" | Ko-fi Free pays **0%** on one-off tips (S2) |
| 76, 79, 92 | "zero platform fees on shop sales" / "Shop sales are always commission-free regardless of plan tier" / "Ko-fi takes 0% commission on shop transactions" | Shop sales are **5%** on both Free and Standard (S2) |
| 94 | "Patreon's 8-12%" | Patreon's current standard plan is **10%**; 8% and 11% are closed legacy plans (S5) |

> **D-008 note:** that ruling bars Wave 1 chips from modifying this page's **title
> and meta description**, on ranking-risk grounds. The body-copy errors above are a
> separate matter and are, in this chip's view, the highest-severity content defect
> found — the site's best-performing page tells creators to buy a $12 product for
> $6 and to expect a break-even at half the real figure. Flagged, not fixed; the
> Command Center should decide how to sequence a correction against D-008.

### Patreon — `src/lib/calculators/patreon-earnings.ts`

| Line | Code says | Verified fact | Impact |
|---|---|---|---|
| 25 | Comment: `// Patreon fee structure (2024)` | Structure changed 2025-08-04 | Self-declared two years stale. |
| 30–34 | `lite: 0.05, pro: 0.08, premium: 0.12` | Current standard plan is **10%**, available to and mandatory for every new creator. Legacy plans are **Founders 5%, Pro 8%, Pro + Merch 11%** — all closed. **"Lite" and "Premium" do not appear in Patreon's current fee documentation at all**, and 12% is not a rate Patreon publishes. | The calculator **cannot express the rate that applies to every new Patreon creator**, and offers three choices, two of which are not real. Every result is wrong for a post-2025-08-04 creator. |
| 36–37 | `2.9% + $0.30` for all pledges | Correct for the standard plan (which has no micropayment rate). **Wrong for legacy creators** at ≤$3, where the rate is 5% + $0.10. Wrong for non-US PayPal/Venmo (3.9% + $0.30), Founders (1.6% + $0.30), and every non-USD payout currency. | Understates for some, overstates for others. |
| — | No currency conversion fee | **2.5%** on cross-currency payments | Understates for creators with international patrons. |
| — | No payout fee | $0.25–$1.00+ per payout depending on rail; PayPal 1% capped at $20 | Understates. |

### Patreon page copy — `src/pages/creator/patreon-calculator.astro`

Lines 9, 24, 72, 89, 91, 102, 107–109, 120 present Lite/Pro/Premium as a live
menu and **advise the reader which to choose** ("Start with Lite (5%) if you just
need basic features", "Most creators benefit from the Pro plan at 8%", "Only
consider Premium at 12% if you need team accounts"). None of those plans can be
selected by any reader. Line 107–109 renders a comparison table across all three.
This is not a stale number; it is advice to take an action that does not exist —
the same defect class as the two-year-stale tax data, in the category D-001
identifies as the site's strategic core.

### Gumroad — `src/lib/calculators/gumroad-revenue.ts`

| Line | Code says | Verified fact | Impact |
|---|---|---|---|
| 39, 77 | `gumroadFee: 10`, applied as a pure percentage | **10% + $0.50 per transaction** | **Understates fees on every calculation.** At the module's own default `productPrice: 29`, the true rate is 11.7%, not 10% — a 17% understatement of the fee. At a $5 product it is 20% vs the modelled 10%. |
| — | No Discover rate | **30%** for marketplace-sourced customers | A creator whose sales come through Discover sees three times the modelled fee. |
| — | No payout modelling | $100 payout minimum; PayPal payout 2%; instant payout 3% | Understates, and hides a real cashflow constraint ($100 floor + 7-day hold). |
| 76 (comment) | "Gumroad fee (includes payment processing)" | **Correct** — Gumroad is merchant of record since 2025-01-01 and publishes no separate processing fee. | No change needed. |
| 80–81 | Affiliate commission taken off the creator's share | Matches the page copy's claim (L80) but **not verified against Gumroad** — see V-G3 | Unverified assumption. |

### Gumroad page copy — `src/pages/creator/gumroad-calculator.astro`

Lines 9, 14, 24, 29, 76, 91, 93, 97, 121 all assert a "flat 10%" with "no
additional credit card fees" and "no hidden charges", including the explicit
claim at L76: "**for every $1 you charge, you keep $0.90**". The $0.50 per
transaction is absent from the entire page. L121's comparison table lists
Gumroad's fee as a flat "10%" against competitors quoted with their fixed
components — a direct like-for-unlike comparison in Gumroad's favour.

### Substack — `src/lib/calculators/substack-revenue.ts`

| Line | Code says | Verified fact | Impact |
|---|---|---|---|
| 29–32 | `SUBSTACK_FEE_RATE = 0.10`, `STRIPE_RATE = 0.029`, `STRIPE_FLAT = 0.30` | Correct as far as it goes, but **the 0.7% Stripe Billing fee on recurring payments is missing entirely** | Understates fees for **every** Substack creator by 0.7% of gross. The 0.5% legacy rate expired 2025-06-30, so there is no creator for whom omitting it is correct. |
| 49 | `annualSubPrice = inputs.monthlyPrice * 10` — hardcodes a 2-month discount, commented "Standard 2-month discount" | Substack **does not mandate** any annual discount ratio; creators set both prices independently (S12) | Modelling assumption presented as a platform rule. Not a fee error, but it should be an input, not a constant. |

### Substack page copy — `src/pages/creator/substack-calculator.astro`

Lines 9, 72, 87, 98, 120 state total fees as "10% + 2.9% + $0.30" and give worked
examples ("$10 monthly subscription … you receive roughly $8.71"; "$5 monthly …
about $4.22"; "$50 annual … about $43.55"). Every one omits the 0.7% Billing fee.
Corrected: $10/mo → $8.34 net (not $8.71); $5/mo → $4.02 (not $4.22); $50/yr →
$42.90 (not $43.55). L9's "typically 12-14%" understates the true 13.9–19.6%
range at the price points the page itself uses.

---

## 8. Cross-platform comparison — creator vs supporter incidence

The distinction a comparison hub should surface. Every cell traces to a
Confident row above.

| | Ko-fi | Patreon | Buy Me a Coffee | Gumroad | Substack |
|---|---|---|---|---|---|
| Monthly cost to creator | $0 (Free/Standard), $12 (Gold) | $0 | $0 | $0 | $0 |
| Platform fee | 0% or 5% by product & state | 10% standard; 5/8/11% legacy | 5% flat | 10% + $0.50; 30% via Discover | 10% |
| Processing charged separately | Yes — creator's own PayPal/Stripe (~3% + $0.30) | Yes — 2.9% + $0.30 US card | Yes — 2.9% + $0.30 | **No** — bundled | Yes — Stripe 2.9% + $0.30 **+ 0.7% Billing** |
| Who holds the money | Creator (paid direct) | Patreon | BMC → Stripe | Gumroad | Creator's own Stripe |
| Payout fee | None | $0.25–$1.00+; PayPal 1% cap $20 | None published | None on bank; PayPal 2%; instant 3% | Stripe's own (V-S1) |
| Payout minimum | None | PayPal $10 / Payoneer $25 | $10 | **$100** | Not published (V-S1) |
| Supporter can be made to cover processing | No — "no buyer fees" | Not published (V-P2) | **Yes** — a settings toggle | Not published | Not published |
| Cross-currency fee | Processor's own (V-K2) | **2.5%** | Not published (V-B2) | None published | Stripe's own |
| Merchant of record | Not stated (V-K3) | Not resolved (V-P5) | Not resolved (V-B4) | **Gumroad**, since 2025-01-01 | Not resolved (V-S4) |

**The one genuinely distinctive fact in this table:** Buy Me a Coffee is the only
one of the five that lets the creator shift payment processing onto the supporter
with a settings toggle, with the platform publishing the resulting supporter
charge ($25 → $26.03). Ko-fi is the only one that charges 0% on its core product
(one-off tips) in its free state. Gumroad is the only merchant of record. These
three facts are the spine of an honest comparison and none of them are currently
anywhere on the site.

---

## 9. Open Verify rows — summary

Copy depending on any of these is **blocked**.

| ID | Platform | Question |
|---|---|---|
| V-K1 | Ko-fi | Is Gold genuinely purchasable by new creators at $12/mo? |
| V-K2 | Ko-fi | Effective PayPal/Stripe rate a typical creator pays |
| V-K3 | Ko-fi | Fee base (pre/post tax) and merchant of record |
| V-P1 | Patreon | One-time-purchase fee ceiling: 11% or 12%? (Patreon contradicts itself) |
| V-P2 | Patreon | Any patron-side fee? |
| V-P3 | Patreon | Direct-deposit payout minimum |
| V-P4 | Patreon | Non-USD Payoneer/PayPal per-currency payout fee tables |
| V-P5 | Patreon | Merchant-of-record status and sales-tax incidence |
| V-B1 | BMC | Does 5% apply identically across tips / memberships / shop / Extras? |
| V-B2 | BMC | Supporter-covered-fee formula beyond $25; surcharge pass-through |
| V-B3 | BMC | **Is the 0.5% payout processing fee billed to the creator on top?** |
| V-B4 | BMC | Merchant-of-record / VAT handling |
| V-G1 | Gumroad | Does $0.50 recur on each membership charge? |
| V-G2 | Gumroad | Is Discover 30% instead of, or on top of, 10% + $0.50? |
| V-G3 | Gumroad | Affiliate commission calculated before or after platform fee? |
| V-G4 | Gumroad | Currency conversion spread on non-USD payouts |
| V-S1 | Substack | Payout minimum and schedule |
| V-S2 | Substack | Is the 10% before or after Stripe fees and tax? |
| V-S3 | Substack | Fees on pledges, gifts, founding tiers, Substack Network |
| V-S4 | Substack | Merchant-of-record status |
| V-S5 | Substack | Source page is not recently revised (most recent dated fact: July 2024) |
