# Manual Tasks for Ben

## Phase 0: External Setup
- [x] Configure calcfalcon.com DNS to point to Railway
- [x] Configure Umami analytics (website ID: 789f1a13-f7d2-4a67-8888-2b5934ba4a94, instance: umami-production-3685.up.railway.app)
- [x] Google Search Console — verify domain, submit sitemap

## Phase 4: Monetization Setup (Completed, Sparrow Migrated)
- [x] Email integration: Migrated from Resend to Sparrow API gateway (2026-04-21)
  - Set `SPARROW_URL` environment variable on Railway
  - Set `SPARROW_API_KEY` environment variable on Railway
  - Welcome email template ID: 4 (transactional, for new signups)
- [ ] Replace placeholder PDF (`public/downloads/freelancer-tax-cheatsheet.pdf`) with real content
- [ ] Replace placeholder affiliate URLs in `src/lib/config/monetization.ts` with real tracking links.
      Every partner below is wired up and will start rendering the moment its
      `url` field stops being `'#'` — no other code change needed. Ordered by
      traffic-weighted revenue potential (Umami, all-time since 2026-03-14):

  1. **Podia** — serves `kofi-calculator` (155 visitors) + `patreon-calculator` (67) +
     `gumroad-calculator` (41) + `online-course-revenue-calculator`. 20% commission,
     capped 12 months, 31-day cookie. Apply: https://podia.typeform.com/affiliate-apply
     (via https://affiliates.podia.com/)
  2. **beehiiv** — serves the same 3 top-traffic creator pages + `substack-calculator` (26) +
     `newsletter-revenue-calculator` + `sponsorship-rate-calculator`. Up to 50–60%
     commission for 12 months, 60-day cookie — highest-paying program researched.
     Apply: https://app.beehiiv.com/partner_program (via https://www.beehiiv.com/partners)
  3. **Keeper** — serves 5 gig calculators (turo, doordash, uber-lyft, instacart,
     amazon-flex, taskrabbit) + `quarterly-tax-calculator` + `self-employment-tax-calculator` +
     `w2-vs-1099-calculator`. Up to $50/referral, 30-day cookie. Apply:
     https://keepertax.hasoffers.com/signup (via https://www.keepertax.com/become-an-affiliate)
  4. **Printful** — serves `etsy-fee-calculator`, `gumroad-calculator`,
     `print-on-demand-profit-calculator`, `dropshipping-margin-calculator`,
     `reselling-profit-calculator` (25 visitors). 10% commission for 12 months, $25 min
     payout. Apply: https://www.printful.com/affiliates
  5. **Turo** (via FlexOffers) — serves `turo-calculator` (68 visitors, 2nd-highest
     traffic page on the site). $6–$36 per action, 30-day cookie. Apply:
     https://www.flexoffers.com/affiliate-programs/turo-affiliate-program/
  6. **HoneyBook** — serves freelance-ops calculators (hourly-rate, project-rate,
     consulting-fee, meeting-cost). $50/qualified referral, paid at 100 days. Apply:
     https://forms.gle/L5XMJGtSKuQuns7FA (via https://www.honeybook.com/lp/affiliates)
  7. **Bonsai** — serves the same freelance-ops cluster + `value-based-pricing-calculator` +
     `freelance-writing-rate-calculator`. 60-day cookie. Apply:
     https://hellobonsai.firstpromoter.com/ (via https://www.hellobonsai.com/affiliates)
  8. **TurboTax Self-Employed** — serves `quarterly-tax-calculator` +
     `self-employment-tax-calculator`. Apply via CJ Affiliate:
     https://signup.cj.com/member/brandedPublisherSignUp.do?air_refmerchantid=1905878
     (via https://turbotax.intuit.com/corp/affiliates.jsp)
  9. **QuickBooks / FreshBooks / TubeBuddy** — pre-existing entries, still unenrolled.

  **Not enrolled / could not verify — do not add without re-checking:**
  - *Ko-fi's own referral program*: search results consistently describe a 50–100%-of-first-month
    program at `more.ko-fi.com/research/affiliates-hidden`, but that page 401'd on every fetch
    attempt this session, so it's unconfirmed and left out of the config. Worth checking manually.
  - *Lemon Squeezy*: affiliates.lemonsqueezy.com and the docs pages both returned 403 to every
    fetch attempt — could not confirm terms directly, so it's left out. Would be a strong fit for
    kofi/gumroad/patreon if you can get in.
  - *Everlance*: no affiliate/referral program found for bloggers — only B2B platform partnerships
    (DoorDash, Lyft, etc.). Would have been the best fit for the 5 mileage-tracking gig calculators.
  - *Stride, Gridwise*: partnership pages exist but neither publishes public affiliate program
    terms — would need direct outreach.
  - *FreeTaxUSA*: FlexOffers explicitly states this program is "not currently offering" — inactive.
  - *Personal-finance calculators (fire, net-worth, debt-payoff, etc.)*: intentionally left
    unmapped. No brokerage/HYSA affiliate program was researched this session — those often carry
    compliance requirements (FINRA, state registration) beyond a standard content affiliate
    program, so they need dedicated research before adding.
  - *tiktok-calculator, twitch-calculator, podcast-calculator, freelance-vacation-calculator,
    time-to-goal-calculator*: no partner researched this session was a close enough fit — left
    unmapped rather than forcing a mismatch.
- [ ] Google AdSense: Application rejected. Reworking implementation (see Phase R1 in `docs/REVENUE-ROADMAP.md`)
- [ ] Add AdSense publisher ID to `MONETIZATION.adsense.publisherId` in `src/lib/config/monetization.ts` when approved
- [x] Update Railway start command for hybrid SSR mode: `node ./dist/server/entry.mjs`
