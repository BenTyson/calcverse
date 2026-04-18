# CalcFalcon Revenue Roadmap

## Context

CalcFalcon has strong foundations — 45 calculators, 40 blog posts, 141 pages, SEO infrastructure, embeds, Sparrow email integration, and monetization scaffolding (ad slots, affiliate cards, email capture). But **almost no revenue is actually flowing**:

- AdSense slots are placeholders — no publisher ID wired up
- Only 1 of 45 calculators has a live affiliate (QuickBooks); the other 3 configured partners have `#` placeholder URLs
- No event tracking on ads, affiliate clicks, or email signups → can't optimize
- Zero premium/paid infrastructure (no Stripe, no PDF export, no saved scenarios, no B2B embed licensing)
- Planned Phase 12/13 add 8 more calculators — but adding inventory without monetizing the existing 45 is low-ROI

The goal of this roadmap is **revenue, not features**. We pause new-calculator work after any in-flight commitments and re-sequence everything around activating dormant revenue, then building new revenue streams.

The roadmap is organized into **9 session-sized phases** (R1–R9), ordered by ROI × speed. Each phase is a focused, executable chunk — roughly one dedicated session of work.

---

## External Blockers (as of 2026-04-17)

These are outside the code and gate parts of R1/R3. Work around them — don't wait.

1. **Google AdSense account under review (again).** A few more days expected. AdSense publisher ID wire-up in R1 is **deferred** until approval. Everything else in R1 (affiliate URLs, event tracking, ads.txt prep) proceeds without it. Once approved, wire-up is a ~15-minute follow-on task.
2. **QuickBooks affiliate not yet signed up.** Ben to enroll in QuickBooks ProAdvisor / Intuit affiliate program before R1 can replace the `#` placeholder. R1 can proceed with the other partners; swap QB URL in as soon as the link is available.
3. **Sparrow email integration not yet confirmed.** Blocked on Postmark going live (in progress). R3 (email engine) cannot fully verify end-to-end delivery until Sparrow is confirmed — but all code (EmailCapture updates, exit-intent, category metadata, lead-magnet PDFs) can be built and deployed. Flip the switch once Postmark is live.

**Rule:** None of these delay the overall roadmap. Build around them; activate the blocked pieces the moment the dependency clears.

---

## Model & Effort Guide

Each phase below specifies the recommended Claude model and thinking effort for efficient execution. Rough heuristic:

- **Haiku 4.5** — mechanical, well-patterned work (copy, config, scaffolding from clear templates)
- **Sonnet 4.6** — default for implementation; balanced speed/quality
- **Opus 4.7** — architecture-critical, security-sensitive, or novel work where getting it right once > iterating cheaply

Effort levels: `low` (snappy), `medium` (default), `high` (deep thinking on tricky bits).

---

## Sequencing Principle

1. **Activate** what exists (R1) — fastest wins, already-built infra
2. **Expand** what works (R2–R3) — affiliates and email, same patterns
3. **Measure** everything (R4) — prerequisite for CRO
4. **Build** new revenue streams (R5–R6) — PDF reports, B2B embeds
5. **Multiply** traffic (R7) — programmatic SEO
6. **Opportunistic** revenue (R8–R9) — sponsorships, content products

**Pause Phase 12/13 new calculators** until R1–R4 are done. More inventory without monetization activation is diminishing returns.

---

## Phase R1 — Activate Dormant Revenue (Session 1)

**Model:** Sonnet 4.6 · **Effort:** low–medium
*Rationale: mechanical config + component edits, clear patterns exist. No architectural decisions. Haiku 4.5 would also work for the config-replace pieces but Sonnet handles the tracking wrapper integration more reliably in one pass.*

**Blocked pieces (do in parallel, not in-line):**
- AdSense publisher ID wire-up — deferred until Google approval
- QuickBooks URL swap — deferred until Ben enrolls
- End-to-end signup verification — deferred until Sparrow/Postmark live

**Goal:** Turn on the revenue the site is already *wired for*.

**Scope:**
- Wire AdSense publisher ID into `src/lib/config/monetization.ts` and `src/components/monetization/AdSlot.astro` (currently placeholder markup)
- Add `public/ads.txt`
- Replace `#` placeholder URLs in `src/lib/config/monetization.ts` for QuickBooks, FreshBooks, TubeBuddy, Etsy Ads with real affiliate links (sign up for each program first; QuickBooks ProAdvisor, FreshBooks Partner, TubeBuddy Partner, Etsy — note Etsy discontinued its affiliate program, so substitute Printify/Printful/Creative Market)
- Map affiliate partners to all applicable calculators via `affiliateProduct` prop in `src/layouts/CalculatorLayout.astro` usage (not just the 4 currently mapped)
- Add event tracking wrappers for: ad-click (via AdSense reports), affiliate-click (wrap `AffiliateCard` anchor), email-signup (in `src/components/monetization/EmailCapture.tsx`), embed-backlink-click (in `src/layouts/EmbedLayout.astro`). Use Umami custom events via `window.umami.track('event-name', { props })` (Umami script already loaded in `src/layouts/BaseLayout.astro`).

**Critical files:**
- `src/lib/config/monetization.ts` — affiliate URL config
- `src/components/monetization/AdSlot.astro` — AdSense script injection
- `src/components/monetization/AffiliateCard.astro` — click tracking
- `src/components/monetization/EmailCapture.tsx` — signup tracking
- `src/layouts/BaseLayout.astro` — Umami already loaded, add `umami.track()` helper
- `public/ads.txt` (new)

**Verification:** Deploy to Railway → verify ads render on `/freelance/quarterly-tax-calculator`, affiliate link goes to real destination, Umami dashboard (umami-production-3685.up.railway.app) shows events for ad clicks / affiliate clicks / signups within 24h.

---

## Phase R2 — Affiliate Expansion (Session 2)

**Model:** Sonnet 4.6 · **Effort:** medium
*Rationale: a new `AffiliateGrid` component + config extension + layout integration. Clear pattern to follow from existing AffiliateCard. Partner research is human-side — Ben enrolls in programs, feeds URLs to the session.*

**Goal:** Every calculator has 1–3 contextually relevant affiliate partners. Finance/tax calcs are the highest CPA and get prioritized.

**Scope:**
- Research and enroll in 10–15 new partner programs. Priority targets:
  - **Tax:** TurboTax Self-Employed, H&R Block, Keeper Tax, Bonsai (freelance-tax, quarterly-tax, w2-vs-1099, se-tax, 1099-tax)
  - **Robo-advisors / investing:** Betterment ($100+ CPA), Wealthfront, M1 Finance, Public (fire, net-worth, capital-gains, savings-goal)
  - **HYS / banking:** SoFi, Wealthfront Cash, Marcus, Novo (business banking) (emergency-fund, savings-goal, net-worth)
  - **Debt:** SoFi personal loans, Credit Karma, Tally (debt-payoff)
  - **Creator tools:** Teachable, Kajabi, ConvertKit, Beehiiv (newsletter, online-course, podcast)
  - **Gig:** Everlance, Stride (mileage tracking — doordash, uber-lyft, instacart, amazon-flex)
  - **Freelance ops:** HoneyBook, Bonsai, FreshBooks, Wave (project-rate, consulting-fee, hourly-rate)
- Extend `src/lib/config/monetization.ts` with a `calculatorAffiliates` map: `{ [slug]: string[] }` returning 1–3 partner keys per calc
- Update `CalculatorLayout.astro` to render a multi-partner affiliate section (currently supports one via `affiliateProduct`) — new `<AffiliateGrid>` component that reuses `AffiliateCard.astro`
- Add a "Recommended Tools" section to the homepage and each category index page (`src/pages/freelance/index.astro` etc.)

**Critical files:**
- `src/lib/config/monetization.ts`
- `src/components/monetization/AffiliateCard.astro` (reuse)
- `src/components/monetization/AffiliateGrid.astro` (new)
- `src/layouts/CalculatorLayout.astro`
- Category index pages

**Verification:** Build succeeds, every calculator page renders 1–3 AffiliateCards with real URLs, Umami tracks clicks per partner via custom events.

---

## Phase R3 — Email Engine (Session 3)

**Model:** Sonnet 4.6 · **Effort:** medium
*Rationale: React components (ExitIntentModal, category-aware EmailCapture) + Sparrow metadata plumbing. Non-trivial UX timing logic (exit intent, frequency capping) benefits from Sonnet over Haiku. PDF lead magnets produced outside the code session.*

**Dependency:** Final verification of Sparrow delivery blocked on Postmark going live. Build and deploy everything; flip on the welcome series automations in Sparrow once email is confirmed.

**Goal:** 5–10% email capture rate (vs. estimated <1% today) via real lead magnets. Build the list as a monetizable asset.

**Scope:**
- Produce (or commission) actual PDF lead magnets — the "Freelancer Tax Cheatsheet" is referenced in `EmailCapture.tsx` but verify the file exists; create if missing. Add 4 more:
  - Creator Monetization Playbook (Creator category)
  - Gig Driver Tax & Expense Tracker (Gig category)
  - Side Hustle Tax Checklist (Side Hustle category)
  - FIRE Calculator Companion Workbook (Personal Finance category)
- Store PDFs in `public/lead-magnets/`
- Category-aware `EmailCapture` — pass category prop, deliver matching PDF via Sparrow's automation triggers
- Build exit-intent modal (`src/components/monetization/ExitIntentModal.tsx`) triggered on high-value calculator pages (tax, FIRE, emergency-fund, net-worth, debt-payoff). Use `mouseleave` to top of viewport, frequency-capped in localStorage
- Sparrow welcome series: 5-email drip per category — valuable content + 1–2 soft affiliate plugs per send
- Add footer email capture across all pages (not just calculator/blog layouts) via `BaseLayout.astro`

**Critical files:**
- `src/components/monetization/EmailCapture.tsx` (extend with category + lead magnet selection)
- `src/components/monetization/ExitIntentModal.tsx` (new)
- `src/pages/api/subscribe.ts` (pass category/lead-magnet metadata to Sparrow)
- `src/layouts/BaseLayout.astro` (footer capture)
- `public/lead-magnets/*.pdf` (new)

**Manual / Sparrow side:** Configure automations, welcome series copy, lead magnet email delivery. Documented in `docs/ben.md`.

**Verification:** Subscribe on a creator calc → receive Creator Monetization Playbook PDF via Sparrow within minutes. Exit-intent fires once per session. Umami shows conversion uplift.

---

## Phase R4 — Analytics & Conversion Optimization (Session 4)

**Model:** Sonnet 4.6 · **Effort:** medium (Haiku 4.5 acceptable for Clarity snippet + event wiring)
*Rationale: instrumentation is mostly mechanical, but the A/B harness (deterministic bucket + session persistence + variant-tagged events) has enough subtlety to want Sonnet. Clarity install alone is a Haiku task.*

**Goal:** Measure everything that matters for revenue; run first round of A/B tests.

**Scope:**
- Add Microsoft Clarity (free heatmaps + session recordings) to `BaseLayout.astro` — catches UX friction ad/affiliate placement can't see
- Wire up structured Umami custom events: ad-click, affiliate-click (with `partner` prop), email-signup (with `source` prop), embed-copy, calculator-copy-results, pdf-download
- Build a lightweight admin-only dashboard page at `/admin/revenue` (gated by shared secret env var or basic auth middleware) pulling aggregated counts from Umami's API — or just document an Umami/Sparrow/AdSense dashboard workflow in `docs/ben.md`
- Run 3 A/B tests:
  1. Affiliate card position (above vs below first result card)
  2. Email capture CTA copy ("Get the cheatsheet" vs "Save $500 on taxes")
  3. Ad slot density (2 vs 3 per calculator) — measure RPM vs bounce
- Simple A/B via deterministic `sessionStorage` bucket + URL param override, variant passed as event prop to Umami

**Critical files:**
- `src/layouts/BaseLayout.astro` (Clarity)
- `src/lib/utils/analytics.ts` (new — thin `umami.track()` wrapper with type-safe event names)
- `src/lib/utils/ab-test.ts` (new)
- Instrument AdSlot, AffiliateCard, EmailCapture

**Verification:** Clarity records sessions, Umami dashboard shows all custom events firing, A/B variant assignments visible in Umami event properties, at least 2 weeks of data collected before declaring winners.

---

## Phase R5 — Premium: Branded PDF Reports (Session 5)

**Model:** Opus 4.7 · **Effort:** high
*Rationale: Stripe webhooks + money-handling logic + PDF generation pipeline + one-time-signed-URL delivery. Security-sensitive (webhook signature verification, refund edge cases) and novel to this codebase. Getting it right once is cheaper than debugging a Sonnet pass.*

**Goal:** First paid revenue stream. Monetize serious users — accountants, coaches, and freelancers preparing client-ready deliverables.

**Scope:**
- Stripe integration via Astro API routes (`src/pages/api/checkout.ts`, `src/pages/api/webhook.ts`, `prerender = false`)
- Price: $4.99 one-off PDF, or $9/mo unlimited PDFs. Start with one-off to avoid subscription mgmt.
- PDF generation via `@react-pdf/renderer` or serverless Puppeteer. Server-side render calculator results into a branded PDF (logo, category colors, input summary, result breakdown, chart snapshots if feasible).
- "Export PDF Report" button next to `CopyResultsButton` in `src/components/ui/results/`. Triggers Stripe Checkout → webhook → generate PDF → email via Sparrow (or direct download via one-time signed URL).
- Optional: white-label PDF (user's logo + name) for premium tier.
- Add `/pro` landing page explaining value ("Client-ready reports in 30 seconds").

**Critical files:**
- `src/pages/api/checkout.ts` (new)
- `src/pages/api/webhook.ts` (new)
- `src/lib/pdf/generate-report.ts` (new)
- `src/components/monetization/PdfExportButton.tsx` (new)
- `src/components/ui/results/ResultCard.tsx` or a wrapper in CalculatorLayout
- `src/pages/pro.astro` (new landing page)

**Verification:** Real Stripe test-mode transaction → PDF arrives via email within 60 seconds → report has correct numbers and branding. One-off refund flow tested.

---

## Phase R6 — B2B White-Label Embeds (Session 6)

**Model:** Opus 4.7 · **Effort:** high
*Rationale: architecturally the biggest shift in the roadmap — embed route flips from SSG to SSR, introduces auth (magic link), license validation, subscription lifecycle, and customer dashboard. Highest-LTV revenue stream, so the extra token spend is warranted. Split into 2 sessions if scope runs long: session A = license validation + SSR embed + branding; session B = auth + dashboard + Stripe subscription.*

**Goal:** Highest-LTV channel. Sell embed licenses to accountants, financial coaches, freelance bloggers, and SaaS apps who want calculators on their site.

**Scope:**
- License tiers:
  - **Free:** Current embed with "Powered by CalcFalcon" backlink
  - **Pro ($29/mo):** Backlink removed, custom accent color, unlimited embeds
  - **Business ($99/mo):** Pro + custom logo, custom domain, priority support
- API key system: tiny Postgres or KV store (Railway has both); `src/pages/api/validate-license.ts`
- Embed route (`src/pages/embed/[...slug].astro`) becomes SSR (`prerender = false`) — reads `?license=<key>` param, validates against KV, applies tier-appropriate branding
- Self-serve signup at `/embed-license` with Stripe subscription checkout
- Dashboard at `/dashboard/embeds` — shows license key, usage stats, copy-embed-code UI
- Magic-link auth (reuse Sparrow or implement via Resend/Sparrow SMTP + signed JWT in cookie)
- Marketing landing page at `/for-accountants` and `/for-coaches` targeting those personas

**Critical files:**
- `src/pages/embed/[...slug].astro` (convert to SSR with license check)
- `src/layouts/EmbedLayout.astro` (conditional backlink/branding)
- `src/pages/api/validate-license.ts` (new)
- `src/pages/api/checkout-subscription.ts` (new)
- `src/pages/dashboard/*.astro` (new — auth-gated)
- `src/pages/for-accountants.astro`, `src/pages/for-coaches.astro` (new)
- `src/lib/auth/magic-link.ts` (new)

**Verification:** Sign up → receive magic link → land on dashboard → copy embed code with license key → paste into an external HTML file → embed renders without CalcFalcon backlink. Cancel subscription → embed reverts to free tier within 1 hour.

---

## Phase R7 — Programmatic SEO Expansion (Session 7)

**Model:** Sonnet 4.6 for architecture · Haiku 4.5 for bulk data generation · **Effort:** medium (high on the first variant pattern)
*Rationale: the first variant route (state tax, niche CPM) needs careful design — schema.ts updates, getStaticPaths, templated meta copy. Sonnet for the pattern. Once the pattern is set, generating the 50-state bracket data and 10 niche defaults is bulk work Haiku handles cheaply. Also consider `claude-api` skill for one-off data-generation scripts.*

**Goal:** 3–5× indexable pages without 3–5× the content-writing work. Long-tail traffic = compounding ad + affiliate revenue.

**Scope:**
- State-specific tax calculators: 50 variants each of `/freelance/quarterly-tax-calculator/[state]`, `/freelance/self-employment-tax-calculator/[state]`, `/personal-finance/capital-gains-tax-calculator/[state]`. Use existing `shared/tax-brackets.ts`; add state bracket data.
- Platform × niche combos: `/creator/youtube-adsense-calculator/[niche]` for 10 niches (gaming, tech, finance, beauty, cooking, fitness, vlog, kids, music, education). Each has niche-specific default CPM.
- City cost-of-living add-ons to `rent-vs-buy` and `fire-calculator`: top 50 US metros.
- Use Astro `getStaticPaths()` to generate all variants at build time. Ensure per-variant H1, meta title, meta description, and one unique paragraph of intro copy (can be templated from structured data).
- Update `src/lib/seo/schema.ts` to emit variant-specific structured data.
- Update sitemap to include all programmatic pages (`@astrojs/sitemap` handles this automatically).

**Critical files:**
- `src/pages/freelance/quarterly-tax-calculator/[state].astro` (new)
- `src/pages/creator/youtube-adsense-calculator/[niche].astro` (new)
- `src/lib/calculators/shared/state-tax-brackets.ts` (new)
- `src/lib/calculators/shared/niche-cpm-defaults.ts` (new)
- `src/lib/calculators/shared/metro-data.ts` (new)
- `src/lib/seo/schema.ts` (variant-aware)

**Verification:** Build count goes from 141 → ~400+ pages. Sitemap includes new routes. Spot-check 5 variants for accurate H1/meta/content. Google Search Console "URL inspection" confirms indexable. Traffic uplift visible in Umami over 60–90 days.

---

## Phase R8 — Direct Sponsorships (Session 8)

**Model:** Sonnet 4.6 · **Effort:** low–medium
*Rationale: new component + config layer + one landing page. Pattern mirrors existing AffiliateCard/AdSlot. No novel architecture. Could use Haiku 4.5 if running tight on budget — the work is well-templated.*

**Goal:** Replace programmatic AdSense on top-traffic pages with direct sponsorship deals at 2–3× the RPM.

**Scope:**
- Qualifies when a calculator crosses ~5k monthly sessions (identify top 5–10 via Umami).
- Build `SponsorSlot.astro` component — category-styled "Brought to you by [Sponsor]" card with CTA button. Replaces the first `AdSlot` on sponsored calcs.
- Config in `src/lib/config/sponsorships.ts`: `{ [calcSlug]: { sponsor, logo, cta, url, startDate, endDate } }`. CalculatorLayout conditionally renders `SponsorSlot` vs `AdSlot` based on config.
- Media kit page at `/sponsor` with traffic stats, audience demographics, pricing tiers, past sponsors, contact form (reuse `/api/subscribe` or dedicated endpoint).
- Outreach playbook (in `docs/ben.md`): target list of 30–50 potential sponsors scraped from current affiliate programs + adjacent SaaS; email templates; deal tracking spreadsheet.

**Critical files:**
- `src/components/monetization/SponsorSlot.astro` (new)
- `src/lib/config/sponsorships.ts` (new)
- `src/layouts/CalculatorLayout.astro`
- `src/pages/sponsor.astro` (new)
- `docs/ben.md` (sponsor outreach tracker)

**Verification:** Top-traffic calc renders SponsorSlot instead of AdSlot when sponsorship active; reverts to AdSlot when `endDate` past. Umami tracks sponsor CTA clicks.

---

## Phase R9 — Content Products (Optional / Ongoing)

**Model:** Haiku 4.5 · **Effort:** low
*Rationale: lightweight — ProductCard component + contextual CTA insertions + Gumroad links. No payment infra (Gumroad handles it). Haiku is the right tool; reserve Sonnet/Opus budget for R5/R6.*

**Goal:** Digital products sold direct. Highest margin, lowest operational complexity.

**Scope:**
- "Freelancer Finance Playbook" — $29 PDF ebook pulling from existing blog content + calculator walkthroughs
- "Creator Income Tracker" — $19 Notion template or Google Sheets
- "Gig Worker Tax Kit" — $19 spreadsheet + quarterly tax reminder email series
- Sell via Gumroad initially (we literally have a gumroad-calculator — dogfood it) — no custom infra needed
- Promote via email list, exit-intent, and contextual CTAs on matching calculators / blog posts

**Critical files:**
- `src/components/monetization/ProductCard.astro` (new)
- Update contextual pages to link to Gumroad listings

**Verification:** Gumroad analytics show clicks from calcfalcon.com referral + sales attributable to each CTA placement.

---

## Decisions Made (Executive)

1. **Pause new calculators.** Phase 12/13 and B8/B9 paused until R1–R4 complete. Revenue per existing calc > adding more.
2. **Activate before optimize.** R1 is the unblocker — can't A/B test ads that don't render.
3. **Email is an asset, not a nice-to-have.** R3 funds R5–R9 via direct promotion channel.
4. **B2B > B2C for LTV.** White-label embeds (R6) have 10–50× LTV vs ad impressions; prioritized above content products.
5. **Programmatic SEO before manual content.** R7 scales pages faster than writing more blog posts.
6. **Don't build what you can rent.** Use Stripe, Sparrow, Gumroad, Fathom, Clarity — zero custom auth/analytics/payments infra beyond thin wrappers.

---

## Success Metrics per Phase

| Phase | Metric | Target (90 days post-launch) |
|-------|--------|------------------------------|
| R1 | AdSense + affiliate revenue active | First $100 MRR |
| R2 | Affiliate click-through rate | 2–4% of calculator sessions |
| R3 | Email signup rate | 5–10% of calculator sessions |
| R4 | Conversion lift from A/B winners | +20–40% on tested metrics |
| R5 | PDF report sales | $500–2K MRR |
| R6 | Embed license MRR | $1–5K MRR |
| R7 | Organic traffic | 2–3× sessions |
| R8 | Sponsorship revenue | 2–3× RPM on sponsored slots |
| R9 | Content product revenue | $500–2K/mo |

**Cumulative 12-month target:** $10–30K MRR across all streams, with R6 (embed licensing) and R5 (PDF reports) as the two load-bearing pillars.

---

## Verification (Roadmap-Level)

- `npm run build` passes with 0 errors after each phase
- Each phase has an explicit deploy-and-validate step before moving on
- Revenue metrics reviewed monthly; re-sequence if a phase underperforms its target by >50% at 90 days
- Documented learnings in `docs/STATUS.md` at each phase close; roadmap updated in this file
