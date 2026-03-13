# Manual Tasks for Ben

## Phase 0: External Setup
- [x] Configure calcfalcon.com DNS to point to Railway
- [x] Sign up for Fathom analytics (site ID: BRHGFMPN)
- [ ] Google Search Console — verify domain, submit sitemap

## Phase 4: Monetization Setup
- [ ] Sign up for Resend at resend.com — get API key
- [ ] Add `RESEND_API_KEY` environment variable on Railway
- [ ] Add `RESEND_AUDIENCE_ID` environment variable on Railway (create audience first)
- [ ] Replace placeholder PDF (`public/downloads/freelancer-tax-cheatsheet.pdf`) with real content
- [ ] Replace placeholder affiliate URLs in `src/lib/config/monetization.ts` with real tracking links
- [ ] Apply for Google AdSense (after 30+ pages and some traffic)
- [ ] Add AdSense publisher ID to `MONETIZATION.adsense.publisherId` in `src/lib/config/monetization.ts` when approved
- [x] Update Railway start command for hybrid SSR mode: `node ./dist/server/entry.mjs`
