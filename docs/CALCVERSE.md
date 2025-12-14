# CALCVERSE - Project Overview

> **Last Updated**: 2025-12-13
> **Current Phase**: Phase 1 Complete - Ready for Phase 2
> **Status**: 3 calculators live, ready to deploy

---

## Quick Status

| Metric | Current | Phase 2 Target |
|--------|---------|----------------|
| Calculators Live | 3 | 15 |
| Categories | 3 | 4 |
| Build Size | 460KB | <1MB |
| Deployment | Ready | Cloudflare Pages |

**Live Calculators:**
1. Freelancer Hourly Rate (`/freelance/hourly-rate-calculator`)
2. YouTube AdSense Revenue (`/creator/youtube-adsense-calculator`)
3. Side Hustle Time to Goal (`/side-hustle/time-to-goal-calculator`)

---

## Project Vision

**What**: A network of 20-50 highly specific, interconnected calculators targeting long-tail SEO keywords.

**Revenue Model**: Display ads (primary) + affiliate links + lead gen

**Target Revenue**: $1-5K/month passive income

**Why This Works**:
- Calculator queries have high search intent
- Zero customer support burden
- Content doesn't go stale
- Can be built once then left alone
- Each calculator = dedicated SEO entry point

---

## Technical Stack (FINAL - Do Not Change)

| Layer | Choice | Status |
|-------|--------|--------|
| Framework | Astro 5 | Implemented |
| UI Components | React 19 | Implemented |
| Styling | Tailwind CSS 4 | Implemented |
| Hosting | Cloudflare Pages | Ready to deploy |
| Analytics | Plausible | Pending (add after domain) |
| Ads | Google AdSense | Pending (Phase 3) |

---

## For New AI Agents

**Read the session-start documents first:**
- `docs/session-start/README.md` - Start here
- `docs/session-start/ARCHITECTURE.md` - Code structure
- `docs/session-start/ADDING-CALCULATORS.md` - How to add new calculators
- `docs/session-start/DECISIONS.md` - What's already decided

**Key Commands:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## Phase Status

### Phase 1: Foundation ✅ COMPLETE
- [x] Astro + Tailwind + React setup
- [x] Base calculator component template
- [x] Homepage with category navigation
- [x] SEO utilities (schema.org, meta tags, sitemap)
- [x] 3 pilot calculators
- [x] Embed system
- [x] URL state sharing

### Phase 2: Core Calculators (NEXT)
- [ ] Add 12 more calculators (15 total)
- [ ] Category landing pages (basic versions exist)
- [ ] Deploy to Cloudflare Pages
- [ ] Submit sitemap to Google Search Console

### Phase 3: Monetization
- [ ] Apply for Google AdSense
- [ ] Add ad placements
- [ ] Set up affiliate links
- [ ] Add Plausible analytics

### Phase 4: Scale
- [ ] Expand to 30+ calculators
- [ ] Programmatic SEO variations
- [ ] Backlink outreach

---

## Session Log

### 2025-12-13 - Phase 1 Implementation
- Built complete Astro project from scratch
- Implemented 3 pilot calculators with full functionality
- Created reusable component library (inputs, results, layouts)
- Set up SEO infrastructure (schema.org, sitemap, meta tags)
- Built embed system for external sites
- URL state sharing for shareable results
- Project ready for deployment

### 2025-12-13 - Initial Planning
- Completed ideation and research
- Named project "Calcverse"
- Created initial planning document

---

## Calculator Backlog

### Priority 1 - Phase 2
4. Freelancer quarterly tax estimator
5. W2 vs 1099 comparison calculator
6. Etsy seller fee calculator
7. Twitch subscriber revenue calculator
8. Patreon take-home calculator
9. Uber/Lyft net earnings calculator

### Priority 2 - Phase 2
10. Airbnb profit calculator
11. FIRE runway calculator
12. Emergency fund calculator
13. Rent vs Buy calculator
14. DoorDash earnings calculator
15. Subscription audit calculator

### Future Ideas
- 3D printing cost calculator
- Podcast hosting cost comparison
- Newsletter revenue estimator
- Stock option value calculator
- Crypto tax estimator
- Solar panel ROI calculator
