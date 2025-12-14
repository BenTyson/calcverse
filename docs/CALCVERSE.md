# CALCVERSE - Project Overview

> **Last Updated**: 2025-12-14
> **Current Phase**: Phase 2 Complete - Ready for Phase 3
> **Status**: 9 calculators live, ready to deploy

---

## Quick Status

| Metric | Current | Phase 3 Target |
|--------|---------|----------------|
| Calculators Live | 9 | 15+ |
| Categories | 4 | 5 |
| Build Size | ~600KB | <1MB |
| Deployment | Ready | Cloudflare Pages |

**Live Calculators:**

### Freelance (1)
1. Freelancer Hourly Rate (`/freelance/hourly-rate-calculator`) - *with Quick/Advanced mode*

### Creator (4)
2. YouTube AdSense Revenue (`/creator/youtube-adsense-calculator`)
3. Patreon Earnings (`/creator/patreon-calculator`)
4. Etsy Fee Calculator (`/creator/etsy-fee-calculator`)
5. Substack Revenue (`/creator/substack-calculator`)

### Gig Economy (3) - NEW CATEGORY
6. DoorDash Earnings (`/gig-economy/doordash-calculator`)
7. Uber/Lyft Driver Earnings (`/gig-economy/uber-lyft-calculator`)
8. Airbnb Profit (`/gig-economy/airbnb-calculator`)

### Side Hustle (1)
9. Side Hustle Time to Goal (`/side-hustle/time-to-goal-calculator`)

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

### Phase 2: Core Calculators ✅ COMPLETE
- [x] Quick/Advanced mode toggle pattern
- [x] New Gig Economy category (emerald color)
- [x] 6 new calculators (Patreon, Etsy, Substack, DoorDash, Uber/Lyft, Airbnb)
- [x] All calculators with Quick/Advanced mode
- [x] Updated navigation and category pages
- [x] Build passing (23 pages)

### Phase 3: Deployment & Monetization (NEXT)
- [ ] Deploy to Cloudflare Pages
- [ ] Submit sitemap to Google Search Console
- [ ] Apply for Google AdSense
- [ ] Add ad placements
- [ ] Set up affiliate links
- [ ] Add Plausible analytics

### Phase 4: Scale
- [ ] Expand to 15+ calculators
- [ ] Add Personal Finance category
- [ ] Programmatic SEO variations
- [ ] Backlink outreach

---

## Session Log

### 2025-12-14 - Phase 2 Implementation
- Added Quick/Advanced mode pattern to calculators
- Created new Gig Economy category with emerald color scheme
- Built 6 new calculators:
  - Patreon Earnings (Creator)
  - Etsy Fee Calculator (Creator)
  - Substack Revenue (Creator)
  - DoorDash Earnings (Gig Economy)
  - Uber/Lyft Driver Earnings (Gig Economy)
  - Airbnb Profit (Gig Economy)
- Updated ResultCard and ResultBreakdown for 'gig' category
- All calculators support Quick/Advanced mode with URL persistence
- Build now produces 23 pages

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

### Priority 1 - Phase 3 (Freelance Focus)
- Quarterly Tax Estimator
- W2 vs 1099 Comparison
- Project Rate Calculator
- Freelance Retirement Planner

### Priority 2 - Phase 3 (Creator & Gig)
- Twitch Revenue Calculator
- Ko-fi Earnings Calculator
- TaskRabbit Calculator
- Instacart Shopper Calculator

### Priority 3 - Personal Finance (New Category)
- FIRE Runway Calculator
- Emergency Fund Calculator
- Rent vs Buy Calculator
- Subscription Audit Calculator

### Future Ideas
- 3D printing cost calculator
- Podcast hosting cost comparison
- Stock option value calculator
- Crypto tax estimator
- Solar panel ROI calculator
- Amazon Flex Calculator
- Turo Car Rental Calculator
