# Fact file — Newsletter platform fees

**Produced by:** CHIP-RESEARCH-NEWSLETTER
**Research date:** 2026-08-25
**Scope:** beehiiv, ConvertKit / Kit, Substack (Substack captured for cross-check
against `docs/facts/creator-payment-fees.md`)

> **Rule for downstream chips:** you may write nothing that is not in this file.
> Rows marked **Verify** are unverified and **block** any copy that depends on them.
> Do not "fill in" a Verify row from memory, from a comparison blog, or from the
> existing calculator code — the existing code is demonstrably stale (see §7).

> **Fee schedules change without notice.** Every figure below was read from the
> platform's own published page on the date in the `Fetched` column. Re-verify
> before republishing. Treat anything older than ~6 months as suspect.

> **Sibling fact file:** `docs/facts/creator-payment-fees.md` (CHIP-RESEARCH-PAYMENTS,
> 2026-08-25) is frozen source-of-truth and was **not modified by this chip**. Its
> Substack section and this one were researched independently. §6 records the
> comparison: **no disagreement found.**

---

## 1. Sources actually loaded in this session

Every one of these was opened and read on **2026-08-25**. Nothing below is cited
that was not loaded.

| # | Platform | URL | How loaded | Page's own date stamp |
|---|---|---|---|---|
| N1 | beehiiv | https://www.beehiiv.com/pricing | WebFetch **and** browser pane (JS-driven; see access notes) | none published |
| N2 | beehiiv | https://www.beehiiv.com/features/paid-subscriptions | WebFetch | none published |
| N3 | beehiiv | https://www.beehiiv.com/support/article/30064926230679-using-stripe-with-beehiiv-account-types-explained | WebFetch | Updated **2026-07-08** |
| N4 | beehiiv | https://www.beehiiv.com/support/article/12643795789335-how-to-set-up-a-stripe-account-for-paid-subscriptions | WebFetch | Updated **2026-08-06** |
| N5 | beehiiv | https://www.beehiiv.com/support/article/14492963616279-growing-your-audience-with-beehiiv-boosts | WebFetch | Updated **2026-07-09** |
| N6 | beehiiv | https://www.beehiiv.com/support/article/17507491038231-ad-network-faq | WebFetch | Updated **2026-08-12** |
| N7 | Kit | https://kit.com/pricing | WebFetch **and** browser pane (JS-driven slider) | schema `dateModified` 2024-12-18 |
| N8 | Kit | https://help.kit.com/en/articles/4199324-kit-commerce-overview-faqs | WebFetch | "Updated over a week ago" |
| N9 | Kit | https://help.kit.com/en/articles/6085844-kit-commerce-currencies | WebFetch | Updated **2026-06-11** |
| N10 | Kit | https://kit.com/features/commerce/paid-newsletter | WebFetch | none published |
| N11 | Substack | https://support.substack.com/api/v2/help_center/en-us/articles/360037607131.json | **curl** (Zendesk JSON body of "How much does Substack cost?"; canonical HTML at `https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost` returns **403** to WebFetch) | `updated_at` 2026-08-25, `edited_at` **2025-12-16** |
| N12 | Stripe | https://stripe.com/billing/pricing | WebFetch | none published |
| N13 | Stripe | https://stripe.com/pricing | WebFetch | none published |

### Access notes for the next research chip

Recorded so nobody rediscovers these.

- **`support.substack.com` is Cloudflare-gated to WebFetch (403), but its Zendesk
  JSON API is not.** `curl https://support.substack.com/api/v2/help_center/en-us/articles/<id>.json`
  returns 200 with the full first-party article body plus `created_at` /
  `updated_at` / `edited_at`. This is the same escalation that
  `docs/facts/creator-payment-fees.md` documented for Patreon — **it generalises to
  every Zendesk-hosted vendor help centre.** Try it before reaching for a browser.
- **`beehiiv.com`, `kit.com`, `help.kit.com` and `stripe.com` all answer WebFetch
  directly.** No Cloudflare gate. WebFetch is sufficient for every static figure.
- **The Chrome extension (`mcp__claude-in-chrome__*`) was not connected this
  session.** The `mcp__Claude_Browser__preview_start` pane worked as a substitute.
- **In that pane `read_page` and `computer{screenshot}` return an empty
  page / blank image** — the pane reports `innerWidth 0` until you call
  `resize_window`, and screenshots stay blank even after. **`get_page_text` and
  `javascript_tool` work regardless** and are the only usable tools there. This is
  the same class of trap as the `client:visible` hazard in `CHIP-PROTOCOL.md` §8.
- **Both pricing pages hide their real price grid behind a control.**
  - beehiiv: a `<select>` of subscriber tiers plus Monthly/Annual `<button>`s.
    Set `select.value` and dispatch a bubbling `change`.
  - Kit: a custom `role="slider"` (`#slider-thumb`, `aria-valuemin=0`,
    `aria-valuemax=44`) that ignores `ArrowRight` keydown. Drive it with synthetic
    `pointerdown`/`pointermove`/`pointerup` on the thumb **and** on `document`,
    after `resize_window` gives the track a non-zero width.
  - **Both re-render asynchronously. A settle shorter than ~1.5 s returns the
    PREVIOUS tier's prices, silently.** A first pass at 250 ms produced a
    non-monotonic beehiiv price ladder; that pass was discarded. Every figure below
    comes from a ≥1.3 s-settle pass and was checked for monotonicity across tiers.

---

## 2. beehiiv

**Structural finding: beehiiv's cost is not a flat monthly fee. It is a step
function of total list size, and paid subscriptions are not available at all on
the free plan.** Both facts are load-bearing and both are wrong on this site today
(§7).

### Plan structure

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Plan names | **Launch** (free), **Scale**, **Max**, **Enterprise** | Confident | N1 | 2026-08-25 |
| A plan named "Grow" | **Does not exist.** The four names above are the complete list on N1. | Confident | N1 | 2026-08-25 |
| Launch — price | **$0/month**, "free, forever, with no credit card required" | Confident | N1 | 2026-08-25 |
| Launch — subscriber cap | **Up to 2,500 subscribers** | Confident | N1 | 2026-08-25 |
| Launch — **paid subscriptions** | **Not supported.** Feature-comparison table, Monetization section: "Paid subscriptions, Launch, **No**". FAQ: "When you're ready to unlock monetization … paid plans start at $49/month." | Confident | N1 | 2026-08-25 |
| Launch — other monetization | Ad Network **No**, Programmatic Ads **No**, Group subscriptions **No**, Recommendations **No**, Digital Products **No** | Confident | N1 | 2026-08-25 |
| Entry price for a paid newsletter | **$49/month** (Scale, monthly billing, up to 1,000 subscribers) | Confident | N1 | 2026-08-25 |
| Scale/Max/Enterprise — platform fee | **"0% Take Rate on Paid Subscriptions"** | Confident | N1, N2 | 2026-08-25 |
| Publication limit | Launch 3, Scale 3, Max up to 10 | Confident | N1 | 2026-08-25 |
| Email sends | Unlimited on **every** plan including Launch | Confident | N1 | 2026-08-25 |
| Enterprise | Custom pricing, 100K+ subscribers, "Contact Sales" | Confident | N1 | 2026-08-25 |

### Price grid — **monthly billing** (published, read tier by tier from N1)

| Total subscribers | Launch | Scale | Max |
|---|---|---|---|
| Up to 1,000 | $0 | **$49/mo** | $109/mo |
| Up to 2,500 | $0 | **$69/mo** | $149/mo |
| Up to 5,000 | $0 | **$89/mo** | $169/mo |
| Up to 10K | $0 | **$109/mo** | $219/mo |
| Up to 25K | $0 | **$169/mo** | $289/mo |
| Up to 50K | $0 | **$249/mo** | $379/mo |
| Up to 75K | $0 | **$289/mo** | $419/mo |
| Up to 100K | $0 | **$329/mo** | $459/mo |
| 100K+ | — | Enterprise, custom | Enterprise, custom |

All Confident, N1, 2026-08-25. Ladder verified monotonic in both columns.

### Price grid — **annual billing** (published, read tier by tier from N1)

The card shows an effective monthly figure alongside the annual charge.

| Total subscribers | Scale eff./mo | Scale billed annually | Max eff./mo | Max billed annually |
|---|---|---|---|---|
| Up to 1,000 | $43 | **$517/yr** | $96 | $1,151/yr |
| Up to 2,500 | $61 | **$729/yr** | $131 | $1,573/yr |
| Up to 5,000 | $78 | **$940/yr** | $149 | $1,785/yr |
| Up to 10K | $96 | **$1,151/yr** | $193 | $2,313/yr |
| Up to 25K | $149 | **$1,785/yr** | $254 | $3,052/yr |
| Up to 50K | $219 | **$2,629/yr** | $334 | $4,002/yr |
| Up to 75K | $254 | **$3,052/yr** | $369 | $4,425/yr |
| Up to 100K | $290 | **$3,474/yr** | $404 | $4,847/yr |

All Confident, N1, 2026-08-25.

> **Do not mix the two grids.** The pricing page **defaults to Annual billing**, so
> a casual read of beehiiv's page yields `$43` where the monthly-billing price is
> `$49`. beehiiv's own FAQ quotes the monthly-billing figure ("paid plans start at
> $49/month"). Any comparison must state which billing cadence it assumes.

### Payment processing and take-home

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| beehiiv revenue share on paid subscriptions | **0%.** "beehiiv takes 0% of your paid subscription revenue." | Confident | N1, N2 | 2026-08-25 |
| Processing rate beehiiv publishes | **"Stripe's standard processing fee of 2.9% + $0.30 per transaction"** | Confident | N1 (FAQ), N2 | 2026-08-25 |
| Who holds the money | **The creator.** Paid subscriptions run through a "Personal Stripe Account" that is "fully owned and managed by you" and "processes and receives all revenue from your paid subscribers and/or digital product sales." | Confident | N3 | 2026-08-25 |
| Stripe account types beehiiv uses | (1) Stripe Identity Verification, (2) **Personal Stripe Account** — paid subs + digital products, (3) Stripe **Express** Publication Account — Ad Network / paid recommendations / sponsorships, (4) Stripe **Express** Workspace Billing Account — paying beehiiv's own plan fee | Confident | N3 | 2026-08-25 |
| **Stripe Billing fee (0.7%) on beehiiv paid subscriptions** | **UNRESOLVED — see V-N1. beehiiv does not publish it.** | **Verify** | — | — |
| Payout fee charged by beehiiv on subscription revenue | None published | Confident that none is published | N1, N2, N3 | 2026-08-25 |
| Payout minimum on subscription revenue | None published — funds land in the creator's own Stripe account, so Stripe's own payout terms govern | Confident that beehiiv publishes none | N3 | 2026-08-25 |
| Reader-side fee | None published | Confident that none is published | N1, N2 | 2026-08-25 |

### Other beehiiv revenue streams (these do carry a beehiiv cut)

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| **Boosts / paid recommendations — fee** | **20%.** "A 20% fee covers operational and Stripe transaction costs and is already factored into the marketplace price." | Confident | N5 | 2026-08-25 |
| Boosts — worked example published by beehiiv | Advertiser sets $2.50 CPA → "the publication recommending you will be paid **$2**" | Confident | N5 | 2026-08-25 |
| Boosts — minimum deposit (spender side) | **$20** | Confident | N5 | 2026-08-25 |
| Boosts — charged only for | "subscribers who pass verification" | Confident | N5 | 2026-08-25 |
| Boosts — wallet funds | "cannot be reversed or withdrawn" once transferred to the Wallet | Confident | N5 | 2026-08-25 |
| **Ad Network — beehiiv's cut** | **Not published.** N6 describes what beehiiv does ("managing payments") but discloses no commission. | **Verify** (V-N4) | N6 | 2026-08-25 |
| Ad Network — payout timing | "Payouts are processed on the **20th of each month** for all ads placed in the previous month." Lands in the beehiiv Wallet; withdrawal to bank is manual. | Confident | N6 | 2026-08-25 |
| Ad Network — payout minimum | None mentioned | Confident that none is published | N6 | 2026-08-25 |
| Ad Network — pricing models | **CPM** ("with a $5 CPM, you'll earn $5 for every 1,000 unique opens") and **CPC** ("if the CPC for a campaign is $2 and … 100 payable clicks, your payout would be … $200"). Rates vary by campaign; no range published. | Confident | N6 | 2026-08-25 |

### Verify — beehiiv

| ID | Question | What blocked verification |
|---|---|---|
| **V-N1** | **Does Stripe's 0.7% Billing fee apply to beehiiv paid subscriptions?** | beehiiv publishes only "2.9% + $0.30" (N1, N2) and never mentions a Billing fee. Structurally it looks like it should: paid subs are recurring and run through the creator's **own** Stripe account (N3), which is exactly the arrangement under which Substack's creators are billed 0.7% (N11), and Stripe's own pay-as-you-go Billing rate is 0.7% of Billing volume with no free tier (N12, N13). But "recurring charge on a connected account" and "Stripe Billing subscription object" are not the same thing, and neither beehiiv nor Stripe publishes which beehiiv uses. **This is load-bearing: it is the difference between beehiiv and Substack costing the same per-dollar on processing, or beehiiv being 0.7% cheaper. Do not publish a beehiiv effective-rate or a Substack-vs-beehiiv crossover as a single number until this is resolved — publish the pair (§5).** Resolving it needs a real beehiiv+Stripe account, or a beehiiv support answer. |
| V-N2 | What do the `*` and `†` footnote markers on Scale's "Ad Network*†", "Recommendations*†", "0% Take Rate on Paid Subscriptions*", "Teams (3 Seats)*" mean? | N1 renders the markers but the footnote text was not in the extracted body. Could be a geographic or eligibility restriction on the 0% take rate. **Do not publish "0% take rate" without a caveat until read.** |
| V-N3 | Does the subscriber cap count free + paid subscribers, or paid only? | N1's slider is labelled "How many **email** subscribers do you have?" and the table row is "Subscribers Limit". It never states the basis explicitly. The natural reading is total list size; that reading is what §5 assumes and it is not confirmed. |
| V-N4 | beehiiv's revenue share on Ad Network earnings | N6 does not disclose it. The 20% figure in N5 is for **Boosts/paid recommendations**, a different product; do not transplant it. |
| V-N5 | Does beehiiv charge anything on Digital Products sales? | N1 lists "Digital Products" as a Scale/Max feature; no fee is published on any page loaded. Absence of a published fee is not a published 0%. |
| V-N6 | Enterprise pricing, and the price grid above 100K subscribers | "Custom Pricing / Contact Sales" (N1). Not obtainable without a sales conversation. |
| V-N7 | Whether beehiiv is merchant of record for paid subscriptions, and how VAT/sales tax hits creator take-home | Not addressed on N1–N4. N3's "fully owned and managed by you" wording implies the creator is, but it does not say so. |

---

## 3. ConvertKit / Kit

**Structural finding, and the single most consequential fact in this file:
Kit's 3.5% + $0.30 is INCLUSIVE of credit-card processing. Kit's own take is
0.6%. Adding Stripe's 2.9% on top of it — which this site's calculator does —
double-counts payment processing.**

### Naming

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Current brand | **Kit.** `kit.com` is the live domain; the help centre is `help.kit.com`. "ConvertKit" appears nowhere in the pricing page's own plan names. | Confident | N7, N8, N9, N10 | 2026-08-25 |
| Plan names | **Newsletter** (free), **Creator**, **Pro** | Confident | N7 | 2026-08-25 |

### Transaction fee — the headline

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Transaction fee, USD | **3.5% + $0.30 per transaction** | Confident | N7, N8, N9, N10 | 2026-08-25 |
| **What the 3.5% + $0.30 includes** | **Credit-card processing.** N7 verbatim: *"Low transaction fees — For any digital products or subscription—**inclusive of credit card processing fees**, so Kit only takes **0.6%** of the total fees."* | Confident | N7 | 2026-08-25 |
| Implied split | 3.5% − 2.9% = **0.6% is Kit's platform take**; the remaining 2.9% + $0.30 is the card processing Kit is absorbing and passing through at cost | Confident (Kit states the 0.6% itself; the subtraction is arithmetic on N7 and N13) | N7, N13 | 2026-08-25 |
| Does the fee differ by plan | **No.** N7's comparison table shows "3.5% + 30c" in all three plan columns (Newsletter, Creator, Pro). | Confident | N7 | 2026-08-25 |
| Applies to recurring renewals | Yes — "Recurring subscription renewals are charged at the same rate" | Confident | N10 | 2026-08-25 |
| Applies to | "any digital products or subscription", paid newsletters, recurring memberships, tip jars | Confident | N7, N8, N10 | 2026-08-25 |
| Monthly fee for Commerce itself | **$0.** "no monthly fee for Commerce and nothing to pay until you make a sale" | Confident | N8 | 2026-08-25 |
| **Paid newsletters on the FREE plan** | **Yes.** N7's Newsletter plan key features include "Sell digital products & subscriptions"; N8: "Commerce is available on every plan, including the free Newsletter plan"; N10: "start selling on our free plan and pay only 3.5% + 30¢ per transaction". | Confident (three independent first-party statements) | N7, N8, N10 | 2026-08-25 |
| Processor | **Stripe** | Confident | N8 | 2026-08-25 |

### Transaction fee — non-USD (N9, article updated 2026-06-11)

| Currency | Fee | Confidence |
|---|---|---|
| USD | 3.5% + $0.30 | Confident |
| GBP | 3.5% + £0.20 | Confident |
| EUR | 3.5% + €0.25 | Confident |
| CAD | 3.5% + CA$0.30 | Confident |
| AUD | 3.5% + A$0.30 | Confident |
| NZD | 3.5% + NZ$0.30 | Confident |

All N9, 2026-08-25. N9 adds that "fees may vary" with exchange rates on non-USD
transactions; no spread is published (V-N11).

### Subscription plan pricing

Kit's plan price is a step function of **total email subscribers** (free + paid).
The pricing page exposes it through a 45-step slider; the rows below are the steps
actually landed on and read. **Annual figures are as published. Monthly-billing
figures are derived as `(annual + published "Save $X per year") / 12`** — a
derivation that was spot-checked against the page's own monthly-billing display at
two tiers (1,000 and 8,000) and matched exactly at both.

| Total subscribers | Newsletter | Creator eff./mo (annual) | Creator billed yearly | Creator monthly billing | Pro eff./mo (annual) | Pro billed yearly | Pro monthly billing |
|---|---|---|---|---|---|---|---|
| 0 | $0 | $33 | $390 | $39 | $66 | $790 | $79 |
| 1,000 | $0 | $33 | **$390** | **$39** ✅read directly | $66 | **$790** | **$79** ✅read directly |
| 3,000 | $0 | $50 | **$590** | $59 (derived) | $83 | **$990** | $99 (derived) |
| 5,000 | $0 | $75 | **$890** | $89 (derived) | $116 | **$1,390** | $139 (derived) |
| 8,000 | $0 | $100 | **$1,190** | **$119** ✅read directly | $141 | **$1,690** | **$169** ✅read directly |
| 20,000 | $0 | $158 | **$1,890** | $189 (derived) | $225 | **$2,690** | $269 (derived) |
| 55,000 | $0 | $316 | **$3,790** | $379 (derived) | $433 | **$5,190** | $519 (derived) |
| 145,000 | $0 | $766 | **$9,190** | $919 (derived) | $933 | **$11,190** | $1,119 (derived) |
| 255,000 | $0 | $1,316 | **$15,790** | $1,579 (derived) | $1,566 | **$18,790** | $1,879 (derived) |
| 500,000 | $0 | — | — | — | — | — | — (V-N9) |

All published figures Confident, N7, 2026-08-25. Annual saving is stated on the
page as **17%**.

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Newsletter (free) — subscriber cap | **Up to 10,000** | Confident | N7 (comparison table, "Subscribers" row) | 2026-08-25 |
| Newsletter (free) — automation limit | 1 basic Visual Automation; 1 automated email sequence; 1 user | Confident | N7 | 2026-08-25 |
| Newsletter (free) — Kit branding | Cannot be removed (Creator and above only) | Confident | N7 | 2026-08-25 |
| Basis of the plan price | **Total email subscribers** — "The total number of subscribers you can manage in your account. Subscribers are only counted if they are unique and active." Free and paid subscribers alike. | Confident | N7 | 2026-08-25 |
| Free trial | 14 days, no credit card | Confident | N7 | 2026-08-25 |

### Payouts

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Payout schedule | **Weekly, on Fridays** | Confident | N8, N10 | 2026-08-25 |
| First payout | "Your first one takes longer because of processing, so expect it **7–14 days** after your first successful sale." | Confident | N8 | 2026-08-25 |
| Payout minimum | **Not published on N8 or N10** | **Verify** (V-N10) | — | — |
| Payout fee | None published | Confident that none is published | N8, N10 | 2026-08-25 |

### Other Kit fees

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| **Paid Recommendations fee** | **23.5%** — "Kit's fee for any earnings paid through Paid Recommendations" | Confident | N7 | 2026-08-25 |
| Paid Recommendations availability | Creator and Pro only; **not** on the free Newsletter plan (N7 shows "-") | Confident | N7 | 2026-08-25 |
| Newsletter referral system | Creator/Pro get "a free SparkLoop plan (worth $99/mo)" | Confident | N7 | 2026-08-25 |
| Reader/buyer-side fee | None published | Confident that none is published | N7, N8, N10 | 2026-08-25 |

### Verify — Kit

| ID | Question | What blocked verification |
|---|---|---|
| V-N8 | Are the intermediate slider steps between the rows above (45 steps exist; 10 were sampled) linear or do they contain price jumps the sampled rows hide? | The slider was driven with synthetic pointer events and each step needs a ~1.5 s settle; exhaustive enumeration of all 45 steps was not attempted. **Do not interpolate a price for a subscriber count not in the table above.** |
| V-N9 | Creator/Pro price at the slider's 500,000 maximum | The 500K step rendered only the Newsletter `$0`; the paid columns presumably switch to a contact-sales state that was not captured. |
| V-N10 | Kit payout minimum | N8 covers schedule and first-payout timing but states no minimum. |
| V-N11 | Non-USD exchange-rate spread | N9 says "fees vary slightly by currency because of exchange rates" without publishing a spread. |
| V-N12 | Is the "0.6% of the total fees" claim consistent with Stripe Billing? | If Kit runs recurring subscriptions on Stripe Billing it pays 2.9% + $0.30 + 0.7% = 3.6% + $0.30, i.e. **more than the 3.5% + $0.30 it charges the creator**, which would make Kit's own take negative on recurring. Either Kit absorbs the difference, or it does not use Stripe Billing, or the "0.6%" is a one-off-sale figure. **Either way the creator pays 3.5% + $0.30 and nothing else — that part is Confident. Do not publish the 0.6% decomposition as applying to recurring revenue.** |
| V-N13 | Whether Kit is merchant of record and how sales tax / VAT hits creator take-home | Not addressed on N7, N8, N9 or N10. |
| V-N14 | N7's schema `dateModified` is **2024-12-18** even though the prices are served dynamically | The page markup is older than the price data it renders. Freshness of the price grid rests on it being fetched live, not on a published revision date. |

---

## 4. Substack (cross-check)

Captured independently of `docs/facts/creator-payment-fees.md`. **No disagreement
found** — see §6.

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| Cost to publish | **Free**, "no matter how many subscribers you have" | Confident | N11 | 2026-08-25 |
| Plan tiers | **None.** Single rate; no paid upgrade tier. | Confident | N11 | 2026-08-25 |
| Substack platform fee | **10% of each transaction** | Confident | N11 | 2026-08-25 |
| Stripe credit card fee | **2.9% + $0.30 per transaction** | Confident | N11 | 2026-08-25 |
| **Stripe Billing fee** | **0.7% for recurring payments, "as of July 2024"** | Confident | N11 | 2026-08-25 |
| Legacy Billing rate | Creators who enabled payments **before 2024-07-10** kept **0.5%** until **2025-06-30**. That window closed 14 months ago; **no creator is on 0.5% today.** | Confident | N11 | 2026-08-25 |
| Billing fee visibility | Not included in the "Stripe processing fee" line. Appears as "Stripe fee" under Transactions → All Activity, or under a payout's Summary. | Confident | N11 | 2026-08-25 |
| Billing fee on non-card methods | Applies there too | Confident | N11 | 2026-08-25 |
| Reader-side fee from Substack | **None.** "Substack won't charge you any additional fees" | Confident | N11 | 2026-08-25 |
| Who sets subscription prices | The creator (monthly and annual). **Substack does not mandate any annual-discount ratio.** | Confident | N11 | 2026-08-25 |
| Reader payment methods | Visa, MasterCard, Discover, Amex; European readers may see direct debit, iDEAL, Bancontact, Sofort | Confident | N11 | 2026-08-25 |

Non-card Stripe fees, US Stripe account (N11's own example): iDEAL 80¢;
Bancontact 1.4% + 30¢; Sofort 1.4% + 30¢; SEPA Direct Debit 0.8% + 30¢ capped at
$6.00, with **$10.00** charged for failed or disputed SEPA payments. All
Confident, N11.

**Total Substack take rate, card subscription, US Stripe account:**
`10% + 2.9% + 0.7% = 13.6% of gross, plus $0.30 per transaction.`

### Stripe's own published rates (primary, not via Substack)

| Claim | Value | Confidence | Source | Fetched |
|---|---|---|---|---|
| US domestic card | **2.9% + $0.30 per successful transaction** | Confident | N13 | 2026-08-25 |
| International card surcharge | **+1.5%** | Confident | N13 | 2026-08-25 |
| Currency conversion surcharge | **+1%** where conversion is required | Confident | N13 | 2026-08-25 |
| ACH Direct Debit | 0.8%, **$5.00 cap** | Confident | N13 | 2026-08-25 |
| **Stripe Billing, pay-as-you-go** | **0.7% of Billing volume** — "Billing transactions processed on and off Stripe. **Excludes one-off invoices.**" | Confident | N12, N13 | 2026-08-25 |
| Stripe Billing, volume plans | 0.67% for additional Billing volume; four monthly tiers $620–$5,750/mo up to $1,000,000 volume; 11–18% saving vs pay-as-you-go | Confident | N12 | 2026-08-25 |
| Free tier / threshold on Billing | **None published** on the pay-as-you-go rate | Confident that none is published | N12, N13 | 2026-08-25 |

> **Modelling consequence of "excludes one-off invoices":** the 0.7% attaches to
> *recurring* volume. A one-off tip or a single digital-product sale should not
> carry it. Newsletter subscriptions are recurring, so they do.

### Verify — Substack

| ID | Question | What blocked verification |
|---|---|---|
| V-N15 | Is the 10% calculated before or after Stripe's fees, and before or after tax? | N11 says "10% of each transaction" without naming the base. (Same as sibling row V-S2.) |
| V-N16 | Payout minimum and schedule | N11 does not address payouts. (Same as sibling V-S1.) |
| V-N17 | Source freshness | N11's `edited_at` is **2025-12-16** and its most recent dated fact is July 2024. It is the live current version, but it is not a recently revised document. (Same as sibling V-S5.) |

---

## 5. Cross-platform comparison

Every cell traces to a Confident row above. **US card subscription, monthly
billing, creator's own currency.**

|  | Substack | beehiiv (Scale) | Kit (Newsletter, free) | Kit (Creator) |
|---|---|---|---|---|
| Monthly cost to creator | **$0** | **$49–$329** by list size | **$0** | **$39–$1,579** by list size |
| Paid subs on the free tier | n/a — no tiers | **No** | **Yes** | n/a |
| Platform % on subscriptions | **10%** | **0%** | **3.5% all-in** | **3.5% all-in** |
| Card processing charged on top | **Yes** — 2.9% + $0.30 | **Yes** — 2.9% + $0.30 | **No** — bundled | **No** — bundled |
| Stripe Billing 0.7% on top | **Yes**, documented | **Unresolved (V-N1)** | **No** — bundled | **No** — bundled |
| All-in variable rate | **13.6% + $0.30** | **2.9% + $0.30** (+0.7% if V-N1 resolves yes) | **3.5% + $0.30** | **3.5% + $0.30** |
| Who holds the money | Creator's own Stripe | Creator's own Stripe | Kit | Kit |
| Payout schedule | Stripe's own (V-N16) | Stripe's own | Weekly, Fridays | Weekly, Fridays |
| Payout minimum | Not published | Not published | Not published (V-N10) | Not published (V-N10) |
| Reader-side fee | None | None published | None published | None published |
| Merchant of record | Not resolved | Not resolved (V-N7) | Not resolved (V-N13) | Not resolved (V-N13) |

### The three facts that actually decide this comparison

1. **Kit's fee is all-in and Substack's is not.** Kit 3.5% + $0.30 versus Substack
   13.6% + $0.30 is a **10.1-point** gap in variable rate — and on Kit's free
   Newsletter plan there is no monthly fee to offset it. From these Confident rows
   it follows arithmetically that **a paid newsletter on Kit's free plan costs the
   creator less than Substack at every revenue level**, with no crossover. (Per
   D-014, that is arithmetic from Confident inputs and may ship. Any *recommendation*
   to switch must also weigh the free plan's 10,000-subscriber cap and 1-automation
   limit, which are Confident rows in §3, and must not lean on V-N12.)
2. **beehiiv's cost is a step function, not a constant.** Its price moves with
   *total list size* — which for most newsletters is driven by free subscribers who
   generate no revenue. The "fixed cost that becomes a rounding error as you grow"
   framing is wrong: beehiiv's bill grows too, in steps.
3. **beehiiv's free plan cannot take money at all.** The entry price for a paid
   newsletter on beehiiv is $49/month, not $0.

### Substack-vs-beehiiv crossover — the corrected figure

Substack's variable cost is `0.136·G + 0.30·n`. beehiiv's is
`P + (0.029 + b)·G + 0.30·n`, where `P` is the Scale plan price for the creator's
list size and `b` is 0.007 or 0 depending on **V-N1**. The per-transaction $0.30 is
identical on both and cancels. Crossover is therefore `G = P / (0.107 − b)`.

| Total subscribers | Scale $/mo (monthly billing) | Crossover if V-N1 = **yes** (b = 0.007) | Crossover if V-N1 = **no** (b = 0) |
|---|---|---|---|
| Up to 1,000 | $49 | **$490/mo gross** | $457.94/mo |
| Up to 2,500 | $69 | **$690/mo** | $644.86/mo |
| Up to 5,000 | $89 | **$890/mo** | $831.78/mo |
| Up to 10K | $109 | **$1,090/mo** | $1,018.69/mo |
| Up to 25K | $169 | **$1,690/mo** | $1,579.44/mo |
| Up to 50K | $249 | **$2,490/mo** | $2,327.10/mo |
| Up to 75K | $289 | **$2,890/mo** | $2,700.93/mo |
| Up to 100K | $329 | **$3,290/mo** | $3,074.77/mo |

Arithmetic derived from the Confident rows in §2 and §4; the tables themselves are
not published by any platform.

> **There is no single crossover number.** It is a function of list size, because
> beehiiv's price is. Publishing one number — as this site currently does — is the
> defect, not just the value of the number.

---

## 6. Cross-check against the sibling fact file — **no disagreement**

`docs/facts/creator-payment-fees.md` §6 was compared line by line against §4 above.
Both were sourced from the same Substack article (it via browser, this chip via the
Zendesk JSON API) on the same day, and every figure matches: 10% platform fee,
2.9% + $0.30 card, **0.7% Billing as of July 2024**, 0.5% legacy expiring
2025-06-30, no plan tiers, no reader-side fee, and the identical non-card fee list.
Its `13.6% + $0.30` total also matches.

One refinement this chip can add without contradicting it: the sibling's V-S5
flagged the source as "Updated 8 months ago". The Zendesk API gives the exact
stamp — `edited_at` **2025-12-16**, `updated_at` 2026-08-25. **The sibling file is
not corrected here; this is an addition for the Integrator to consider.**

---

## 7. Cross-check against existing code and copy — DISCREPANCIES

Read-only. **No production code or content was modified by this chip.**
`ls src/lib/calculators/` was run to confirm real filenames rather than trusting
the names in the spawn prompt; the newsletter module is
`src/lib/calculators/newsletter-revenue.ts` and there is exactly one
newsletter-comparison blog post,
`src/content/blog/substack-vs-beehiiv-newsletter-revenue.md`. Files read:
both of those.

### `src/lib/calculators/newsletter-revenue.ts`

| Line | Code says | Verified fact | Impact |
|---|---|---|---|
| 53–58 | `case 'beehiiv': platformFee: 0` with comment `// 0% (Scale plan) + Stripe 2.9%` | 0% take rate is **correct**. But **Scale is not free** — $49–$329/mo — and the module never subtracts a plan cost | **blocker.** beehiiv take-home is over-stated by the entire plan price. At the module's own defaults that is **$160.01/mo, $1,920/yr** (see §8). |
| 59–64 | `case 'convertkit': platformFee: gross × 0.035` **plus** `paymentProcessing: gross × 0.029` | Kit's 3.5% + $0.30 is **inclusive of card processing** (N7). Adding 2.9% **double-counts processing**, and the module also charges a platform fee to a platform whose free plan costs $0/mo while never charging the Creator plan's $39–$1,579/mo | **blocker.** Two errors in opposite directions in one branch. Kit's variable cost is over-stated by 2.9% of gross; its fixed cost is under-stated by the whole plan price. |
| 47–52, 53–58, 59–64 | **No `+ $0.30` anywhere** | 2.9% + **$0.30** per transaction, on all three (N1, N7, N11, N13) | **blocker.** Understates fees on every platform, and the distortion is **price-dependent** — at $5/mo the $0.30 is 6% of the transaction. A comparison engine that drops the only price-sensitive term cannot rank platforms correctly at low price points. |
| 47–52 | Substack `0.10 + 0.029` | **0.7% Stripe Billing fee missing** (N11, N12) | high. Understates Substack fees by 0.7% of gross for **every** creator; the 0.5% legacy rate expired 2025-06-30, so there is nobody for whom omitting it is right. |
| 53–58 | beehiiv `0.029`, no Billing fee | **Unresolved — V-N1** | Cannot be corrected until V-N1 resolves. |
| 41 (comment) | `// Platform fee structures` — no date, no citation, no source | Per **D-011**, platform fees are now governed like IRS/SSA figures: single source of truth, in-session primary sources, verification date, guard | high. This module is the origin of the untraceable "0%" and "3.5%" that triggered this chip. |
| 78 | `const effectiveAnnualMonthly = (inputs.monthlyPrice * 10) / 12; // annual discount` | **Substack does not mandate any annual-discount ratio**; creators set both prices independently (N11). Neither does beehiiv or Kit. | medium. A modelling assumption presented as a platform rule, hardcoded for all three platforms. Identical defect to `substack-revenue.ts:49`, already recorded in the sibling fact file — **it is duplicated, not isolated.** |
| 92 (comment) | `// Platform fees (only on subscription revenue)` | Correct for Substack (N11) and for Kit's 3.5% (N7). For beehiiv, sponsorship income sold through **beehiiv's own Ad Network** is not fee-free — V-N4 is open, and **Boosts carry a documented 20%** (N5). | medium. The comment is right for direct-sold sponsorship and wrong for platform-sourced sponsorship; the module cannot express the difference. |
| 65–67 | `default: { platformFee: 0, paymentProcessing: 0 }` | — | low. An unrecognised platform string silently yields a zero-fee result rather than failing. |

**Not a fee error but adjacent:** the module has no transaction-count concept at
all, so `+ $0.30` cannot be added without a signature change. Any correction chip
must derive transactions from `paidSubscribers` and `annualPlanPercent` — annual
payers are charged **once a year**, not monthly. §8's script shows the derivation.

### `src/content/blog/substack-vs-beehiiv-newsletter-revenue.md`

Published 2026-01-26. Roughly eight fee calculations, all traceable to the same
wrong inputs.

| Line | Copy says | Verified fact |
|---|---|---|
| 21, 59, 63, 65, 69, 71, 73, 77, 79, 81, 119, 121, 123, 149, 189 | Beehiiv Scale **"costs $99 per month"** / "$1,188 per year" | **$49/mo** monthly billing at ≤1,000 subs, rising in steps to **$329/mo** at 100K. Annual: **$517/yr** at ≤1,000 (N1). $99 is not a beehiiv price at any tier on either cadence. |
| 63 | **"The Grow plan at $49 per month"** | **No plan named Grow exists.** beehiiv's plans are Launch / Scale / Max / Enterprise (N1). $49/mo is the price of **Scale** at ≤1,000 subscribers. |
| 63 | "The Max plan at **$399 per month**" | **$109/mo** at ≤1,000 subs to **$459/mo** at 100K (N1). |
| 63 | "The Launch plan is free but does not support monetization" | **Correct** (N1). The only beehiiv claim in the post that holds. |
| 29, 73, 79, 129 | Beehiiv's cost is a **fixed** monthly fee that "becomes proportionally cheaper as you grow" / "the fixed $99 becomes a rounding error on $10,000 in monthly revenue" | beehiiv's price is a **step function of total list size** (N1). The post's central analytical claim — fixed cost versus scaling cost — is structurally wrong, not just numerically. |
| **77, 79** | **"The breakeven point is where 10% of gross equals $99 — which is $990 per month in gross revenue"** / "Below $990 per month … Substack is cheaper" | **There is no single crossover.** At ≤1,000 subs it is **$490/mo**; at ≤5,000 subs **$890/mo**; at 100K **$3,290/mo** (§5). The $990 figure is not the crossover at any beehiiv tier. |
| 79 | "roughly 99 subscribers at $10 per month" | Follows from the wrong $990. At the ≤1,000-sub tier it is **49** subscribers at $10/mo. |
| 81 | "If you are earning $500 per month, Substack costs $50 … Beehiiv costs $99. Substack wins by $49" | At $500/mo gross with a ≤1,000 list, beehiiv Scale is $49 and Substack's platform fee is $50 — **beehiiv wins, by $1.** The example inverts its own conclusion. |
| 71, 73 | "Beehiiv saves you $101 per month, or $1,212 per year" / "The gap widens to $901 per month" | Derived from $99. Recomputed in §8. |
| 189 | "at $5,000 per month, you save over $400 per month compared to Substack" | Substack's 10% is $500; beehiiv Scale at a 5,000-subscriber list is $89 → the saving is **$411**, so "over $400" happens to survive — but only by coincidence, from a wrong plan price at an unstated list size. |
| 43, 45, 120, 121, 122, 123 | Substack worked examples: 200 subs × $10 → "Stripe … totaling $118", "combined fees are $318, leaving you with $1,682", "effective fee rate is **15.9%**"; 1,000 subs → "$1,590 … you keep $8,410" | **0.7% Stripe Billing fee omitted.** Corrected: 200 subs → Stripe **$132**, total **$332**, keep **$1,668**, effective **16.6%**. 1,000 subs → total **$1,660**, keep **$8,340**, **16.6%**. (§8) |
| 25 | "The standard rate is 2.9% plus $0.30 per transaction. **This fee applies regardless of which platform you choose**" | False for Kit: its 3.5% + $0.30 is inclusive of card processing (N7). |
| 89, 93, 101, 103, 118, 119, 121, 122, 123, 193 | "It charges a **3.5% platform fee** … **plus** Stripe processing at 2.9% and $0.30 … plus a monthly subscription"; worked example "$70 … $49 … $118 … total $237 … effective 11.85%" | Double-counts processing. Corrected at that scenario: **$130** transaction fees + **$59** plan = **$189**, keep **$1,811**, effective **9.45%**. **The post over-states Kit's cost by $48/mo** — the only error in the post that runs *against* the platform. |
| 93 | ConvertKit "$29/mo at 1,000 · $79 at 5,000 · $119 at 10,000 · $199 at 25,000" | Kit Creator, monthly billing: **$39** at 1,000; **$89** at 5,000; there is no 10,000 or 25,000 step — the sampled ladder runs 0 / 1,000 / 3,000 / 5,000 / 8,000 / 20,000 / … (N7, §3). $119 is the **8,000** price. |
| 89 | "ConvertKit (now rebranded to Kit in some markets, but widely still known as ConvertKit)" | The brand is **Kit**; `kit.com` and `help.kit.com` use no other name. "in some markets" is not supported by anything loaded. |
| 21, 33, 35, 51, 185 | Substack "10% of your gross paid subscription revenue, plus Stripe's 2.9% and $0.30" as the complete fee list | Incomplete — 0.7% Billing fee (N11). |
| 143 | "Substack does not take a cut of sponsorship revenue" | Consistent with N11, which addresses paid subscriptions only. Not contradicted; not positively confirmed either. |
| 145 | "their ad marketplace takes a percentage when they source the sponsor for you" | Directionally consistent with beehiiv's model but **the percentage is V-N4 (unpublished)**. The post is right to give no number. Boosts, a different product, is a documented **20%** (N5). |
| 197 | "On $2,000 per month in net newsletter revenue, self-employment tax alone is approximately **$3,672 per year**" | $24,000 × 15.3% = $3,672 — this **omits the 92.35% net-earnings adjustment**. The correct figure is $24,000 × 0.9235 × 0.153 = **$3,391**. Out of this chip's scope but it is a YMYL tax figure in body copy, hardcoded, on a site carrying a live AdSense violation. See Reflections. |

---

## 8. Corrected arithmetic — computed by running the real module

Per `CHIP-PROTOCOL.md` §7 ("when the thing you are fixing IS the calculator, import
the real module into a scratch script with only the fee constants corrected"), the
figures below come from a scratch script that **imports the unmodified
`calculateNewsletterRevenue` and `DEFAULT_INPUTS`** from
`src/lib/calculators/newsletter-revenue.ts` via `npx tsx`, and compares its output
against a corrected fee model built only from the Confident rows above. Nothing was
hand-computed. **No production file was written.**

Corrected model: Substack `10% + 2.9% + 0.7%` of gross `+ $0.30 × transactions`;
beehiiv `0% + 2.9% + 0.7%` (assuming V-N1 = yes) `+ $0.30 × transactions` + plan
cost; Kit `3.5% + $0.30 × transactions` all-in + plan cost. Transactions per month
are derived from the module's own annual-plan split: monthly payers bill 12×/yr,
annual payers **1×/yr**.

### The blog's headline scenario — 200 paid @ $10/mo, 3,000 total subscribers

beehiiv tier: "up to 5,000" → Scale $89/mo. Kit tier: 3,000 → Creator $59/mo.

| | Live module | Corrected | Over-statement |
|---|---|---|---|
| Substack net/mo | $1,742 | **$1,668** | **$74/mo — $888/yr** |
| beehiiv net/mo | $1,942 | **$1,779** | **$163/mo — $1,956/yr** |
| Kit net/mo | $1,872 | **$1,811** | **$61/mo — $732/yr** |

Corrected fee breakdown at this scenario:

| | Platform fee | Processing | Plan cost | Total cost | Effective rate |
|---|---|---|---|---|---|
| Substack | $200.00 | $132.00 | $0 | **$332.00** | **16.6%** |
| beehiiv Scale | $0 | $132.00 | $89.00 | **$221.00** | **11.05%** |
| Kit Creator | $130.00 (all-in) | — | $59.00 | **$189.00** | **9.45%** |
| Kit Newsletter (free) | $130.00 (all-in) | — | $0 | **$130.00** | **6.50%** |

The post's table at lines 115–123 reports **$318 / $217 / $237** and effective rates
of **15.9% / 10.85% / 11.85%**, and ranks beehiiv cheapest. The corrected ranking
puts **Kit** cheapest — on the free plan by a wide margin — and the post never
mentions that Kit's free plan can run a paid newsletter at all.

### The module's own `DEFAULT_INPUTS` (5,000 subs, 5% paid, $10/mo, 30% annual, $30 CPM)

| | Live module net/mo | Corrected net/mo | Over-statement |
|---|---|---|---|
| Substack | $2,188.63 | **$2,117.63** | **$71.01/mo — $852.06/yr** |
| beehiiv | $2,426.13 | **$2,266.13** | **$160.01/mo — $1,920.06/yr** |
| Kit | $2,343.00 | **$2,298.50** | **$44.50/mo — $534.00/yr** |

**The calculator over-states take-home on all three platforms at its own defaults,
and by different amounts on each — so the ranking it produces is unreliable, not
merely the magnitudes.** That is the D-011 failure mode exactly.

> **Rendering caveat for any correction chip (D-013):** `formatCurrency()` rounds to
> whole dollars and would render a $0.30 per-transaction fee as **"$0"**. Use
> `formatCurrencyWithCents` for the per-transaction line and for any effective-rate
> derivation. `NewsletterRevenueCalc.tsx` was **not** inspected by this chip —
> `src/components/calculators/*` is CHIP-CENTS-SWEEP's exclusive zone this wave.

---

## 9. Open Verify rows — summary

Copy depending on any of these is **blocked** (D-011). Per D-014, arithmetic from
Confident rows may still ship; a **recommendation** resting on a Verify row may not.

| ID | Platform | Question | Load-bearing? |
|---|---|---|---|
| **V-N1** | **beehiiv** | **Does Stripe's 0.7% Billing fee apply to beehiiv paid subscriptions?** | **Yes — blocks any single-number beehiiv effective rate or Substack-vs-beehiiv crossover** |
| V-N2 | beehiiv | What the `*` / `†` footnotes on "0% Take Rate on Paid Subscriptions*" restrict | Yes — blocks an unqualified "0%" claim |
| V-N3 | beehiiv | Does the subscriber cap count free + paid, or paid only? | Yes — decides which price tier a reader is quoted |
| V-N4 | beehiiv | Ad Network revenue share | Yes — blocks any sponsorship take-home claim |
| V-N5 | beehiiv | Any fee on Digital Products sales | No |
| V-N6 | beehiiv | Enterprise pricing / >100K tiers | No |
| V-N7 | beehiiv | Merchant of record and tax incidence | No |
| V-N8 | Kit | Prices at the 35 unsampled slider steps | Yes — blocks interpolating a price |
| V-N9 | Kit | Creator/Pro price at 500,000 subscribers | No |
| V-N10 | Kit | Payout minimum | No |
| V-N11 | Kit | Non-USD exchange-rate spread | No |
| V-N12 | Kit | Whether the "0.6% Kit take" decomposition holds for recurring revenue | No — the creator-facing 3.5% + $0.30 is Confident either way |
| V-N13 | Kit | Merchant of record and tax incidence | No |
| V-N14 | Kit | Pricing page markup `dateModified` is 2024-12-18 | No — prices are served live |
| V-N15 | Substack | Is the 10% before or after Stripe fees and tax? | No |
| V-N16 | Substack | Payout minimum and schedule | No |
| V-N17 | Substack | Source article last edited 2025-12-16; newest dated fact July 2024 | No |
