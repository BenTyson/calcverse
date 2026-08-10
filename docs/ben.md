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
- [ ] Replace placeholder affiliate URLs in `src/lib/config/monetization.ts` with real tracking links
- [ ] Google AdSense: Application rejected. Reworking implementation (see Phase R1 in `docs/REVENUE-ROADMAP.md`)
- [ ] Add AdSense publisher ID to `MONETIZATION.adsense.publisherId` in `src/lib/config/monetization.ts` when approved
- [x] Update Railway start command for hybrid SSR mode: `node ./dist/server/entry.mjs`
