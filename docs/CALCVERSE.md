# CALCVERSE - Project Overview

> **Last Updated**: 2025-12-14
> **Current Phase**: Phase 3 - Marketing & Growth
> **Status**: 16 calculators live, deployed on Railway

---

## Quick Status

| Metric | Current | Next Milestone |
|--------|---------|----------------|
| Calculators Live | 16 | 20 |
| Categories | 4 | 5 (add Personal Finance) |
| Total Pages | 39 | 45+ |
| Deployment | Railway (live) | Custom domain |
| Traffic | Awaiting indexing | 1,000 visits/month |

**Production URL:** `https://calcverse-production.up.railway.app`

---

## Live Calculators (16)

### Freelance (4)
1. Freelancer Hourly Rate (`/freelance/hourly-rate-calculator`)
2. Quarterly Tax Estimator (`/freelance/quarterly-tax-calculator`)
3. W2 vs 1099 Comparison (`/freelance/w2-vs-1099-calculator`)
4. Project Rate Calculator (`/freelance/project-rate-calculator`)

### Creator (7)
5. YouTube AdSense Revenue (`/creator/youtube-adsense-calculator`)
6. Twitch Revenue (`/creator/twitch-calculator`)
7. Podcast Sponsorship (`/creator/podcast-calculator`)
8. Patreon Earnings (`/creator/patreon-calculator`)
9. Ko-fi Earnings (`/creator/kofi-calculator`)
10. Etsy Fee Calculator (`/creator/etsy-fee-calculator`)
11. Substack Revenue (`/creator/substack-calculator`)

### Gig Economy (4)
12. DoorDash Earnings (`/gig-economy/doordash-calculator`)
13. Uber/Lyft Driver Earnings (`/gig-economy/uber-lyft-calculator`)
14. Instacart Shopper (`/gig-economy/instacart-calculator`)
15. Airbnb Profit (`/gig-economy/airbnb-calculator`)

### Side Hustle (1)
16. Side Hustle Time to Goal (`/side-hustle/time-to-goal-calculator`)

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

## Technical Stack

| Layer | Choice | Status |
|-------|--------|--------|
| Framework | Astro 5 | ✅ Implemented |
| UI Components | React 19 | ✅ Implemented |
| Styling | Tailwind CSS 4 | ✅ Implemented |
| Hosting | Railway | ✅ Deployed |
| Analytics | Plausible | ⏳ Pending (add when traffic exists) |
| Ads | Google AdSense | ⏳ Pending (need traffic first) |

---

## For New AI Agents

**Read the session-start documents first:**
- `docs/session-start/README.md` - Start here
- `docs/session-start/ARCHITECTURE.md` - Code structure
- `docs/session-start/ADDING-CALCULATORS.md` - How to add new calculators
- `docs/session-start/DECISIONS.md` - What's already decided

**Key Commands:**
```bash
npm run dev      # Start development server (localhost:4321)
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
- [x] 13 additional calculators (16 total)
- [x] All calculators with Quick/Advanced mode
- [x] Updated navigation and category pages
- [x] Build passing (39 pages)

### Phase 3: Marketing & Growth 🔄 IN PROGRESS
- [x] Deploy to Railway
- [x] Privacy Policy and Terms of Service pages
- [x] Production URL configured in astro.config.mjs
- [ ] **Submit sitemap to Google Search Console**
- [ ] **Create 2-3 backlinks for initial SEO**
- [ ] Wait for Google indexing (2-4 weeks)
- [ ] Add email capture for newsletter
- [ ] Apply for Google AdSense (when traffic >1000/month)
- [ ] Add Plausible analytics (when traffic exists)

### Phase 4: Scale (FUTURE)
- [ ] Add Personal Finance category
- [ ] Expand to 20+ calculators
- [ ] Programmatic SEO variations
- [ ] Affiliate link integration
- [ ] Upgrade to Mediavine (when traffic >50K sessions/month)

---

## Immediate TODO (Priority Order)

### 1. SEO Setup (DO THIS FIRST)
- [ ] Go to Google Search Console
- [ ] Add property: `https://calcverse-production.up.railway.app`
- [ ] Verify ownership (HTML meta tag method)
- [ ] Submit sitemap: `/sitemap-index.xml`

### 2. Initial Backlinks
- [ ] Post on Reddit (r/freelance, r/sidehustle, r/youtubers)
- [ ] Submit to Product Hunt
- [ ] Share on relevant Twitter/X communities

### 3. Monitor & Wait
- [ ] Check Search Console weekly for indexing progress
- [ ] Monitor for crawl errors
- [ ] Note which calculators get impressions first

---

## Calculator Backlog

### Next to Build (when ready)
- TaskRabbit Earnings Calculator (Gig Economy)
- Amazon Flex Calculator (Gig Economy)
- Turo Car Rental Calculator (Gig Economy)
- Gumroad Revenue Calculator (Creator)
- Teachable Course Calculator (Creator)

### Personal Finance Category (Future)
- FIRE Runway Calculator
- Emergency Fund Calculator
- Rent vs Buy Calculator
- Subscription Audit Calculator

### Future Ideas
- Freelance Retirement Planner
- Stock Option Calculator
- Crypto Tax Estimator
- Solar Panel ROI Calculator

---

## Session Log

### 2025-12-14 - Phase 3 Setup + Calculator Expansion
- Deployed to Railway via GitHub integration
- Updated astro.config.mjs with production URL
- Added Privacy Policy and Terms of Service pages
- Built 7 new calculators:
  - Quarterly Tax Estimator (Freelance)
  - W2 vs 1099 Comparison (Freelance)
  - Project Rate Calculator (Freelance)
  - Twitch Revenue (Creator)
  - Ko-fi Earnings (Creator)
  - Podcast Sponsorship (Creator)
  - Instacart Shopper (Gig Economy)
- Total now: 16 calculators, 39 pages

### 2025-12-14 - Phase 2 Implementation
- Added Quick/Advanced mode pattern to calculators
- Created new Gig Economy category with emerald color scheme
- Built 6 new calculators (Patreon, Etsy, Substack, DoorDash, Uber/Lyft, Airbnb)
- Updated ResultCard and ResultBreakdown for 'gig' category

### 2025-12-13 - Phase 1 Implementation
- Built complete Astro project from scratch
- Implemented 3 pilot calculators with full functionality
- Created reusable component library
- Set up SEO infrastructure
- Built embed system

---

## Key Metrics to Track

Once analytics are set up:

| Metric | Target | Notes |
|--------|--------|-------|
| Monthly Sessions | 10,000+ | AdSense threshold |
| Avg. Time on Page | >2 min | Indicates engagement |
| Bounce Rate | <70% | Calculator pages should be lower |
| Top Calculator | N/A | Double down on winners |
| Organic Traffic % | >80% | SEO is primary channel |

---

## Revenue Projections

| Traffic Level | Estimated Monthly Revenue |
|---------------|---------------------------|
| 1,000 sessions | $5-20 (AdSense) |
| 10,000 sessions | $50-200 (AdSense) |
| 50,000 sessions | $500-1,500 (Mediavine) |
| 100,000 sessions | $1,500-4,000 (Mediavine) |

*Based on typical finance/calculator niche CPMs*
