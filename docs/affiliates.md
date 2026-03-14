# Affiliate Program Tracker

## Active in Code

These are already wired into calculators via `src/lib/config/monetization.ts`. Replace `#` URLs with real tracking links once approved.

| Program | Calculator | Network | Sign Up | Status |
|---------|-----------|---------|---------|--------|
| QuickBooks Self-Employed | Quarterly Tax | CJ Affiliate / Impact | https://quickbooks.intuit.com/affiliates/ | [ ] Applied |
| FreshBooks | W2 vs 1099 | ShareASale | https://www.freshbooks.com/partners | [ ] Applied |
| TubeBuddy | YouTube AdSense | Direct (50% recurring) | https://www.tubebuddy.com/affiliates | [ ] Applied |
| Etsy Ads | Etsy Fee | N/A — no affiliate program | — | [ ] Find alternative |

## Etsy Alternatives

Etsy doesn't offer a traditional affiliate program. Consider replacing with:

- **Marmalead** — Etsy SEO tool, has affiliate program
- **eRank** — Etsy shop analytics, has affiliate program
- **Sale Samurai** — Etsy keyword research tool

## Future Opportunities

Calculators that could support affiliate cards later:

| Calculator | Potential Affiliate |
|-----------|-------------------|
| DoorDash | Gridwise (driver earnings tracker) |
| Uber/Lyft | Stride (mileage tracking) |
| Airbnb | PriceLabs (dynamic pricing) |
| FIRE | Betterment / Wealthfront |
| Rent vs Buy | Mortgage lenders (LendingTree) |
| Substack | ConvertKit / Beehiiv |
| Patreon | Teachable / Gumroad |
| Podcast | Buzzsprout / Riverside.fm |

## Steps After Approval

1. Get tracking URL from the affiliate dashboard
2. Update the URL in `src/lib/config/monetization.ts`
3. Test the link on the live calculator page
4. Verify `rel="nofollow sponsored"` is on the link (already handled by `AffiliateCard.astro`)
