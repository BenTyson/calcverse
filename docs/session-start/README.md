# Calcverse - Session Start Guide

> **Read this first before doing anything.**

## What is Calcverse?

A passive income calculator network targeting long-tail SEO keywords. Built with Astro + React + Tailwind. Goal: $1-5K/month from ads and affiliates.

## Current Status

**Phase 3 IN PROGRESS** - 16 calculators live, deployed on Railway, awaiting Google indexing.

| What | Status |
|------|--------|
| Calculators | 16 live (target: 20+) |
| Categories | 4 (Freelance, Creator, Gig Economy, Side Hustle) |
| Deployment | **LIVE** on Railway |
| Analytics | Not set up (add when traffic exists) |
| Monetization | Not set up (need traffic first) |

**Production URL:** `https://calcverse-production.up.railway.app`

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Session Start Checklist

1. **Read these docs first:**
   - This README
   - `ARCHITECTURE.md` - Understand the codebase
   - `DECISIONS.md` - What's already decided (don't re-debate)

2. **Check current phase in `../CALCVERSE.md`**

3. **If adding calculators, read `ADDING-CALCULATORS.md`**

## What NOT To Do

- Don't change the tech stack (Astro + React + Tailwind)
- Don't add a database (URL params for state)
- Don't add user authentication
- Don't build a CMS
- Don't over-engineer simple calculators
- Don't re-debate architectural decisions

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/layouts/CalculatorLayout.astro` | Base layout for all calculator pages |
| `src/lib/calculators/*.ts` | Calculator logic (pure functions) |
| `src/components/calculators/*.tsx` | Calculator UI (React islands) |
| `src/lib/utils/url-state.ts` | URL state encoding for sharing |
| `src/lib/seo/schema.ts` | Schema.org markup generators |

## Current Calculators (16)

### Freelance (4)
1. **Freelancer Hourly Rate** - `/freelance/hourly-rate-calculator`
2. **Quarterly Tax Estimator** - `/freelance/quarterly-tax-calculator`
3. **W2 vs 1099 Comparison** - `/freelance/w2-vs-1099-calculator`
4. **Project Rate Calculator** - `/freelance/project-rate-calculator`

### Creator (7)
5. **YouTube AdSense Revenue** - `/creator/youtube-adsense-calculator`
6. **Twitch Revenue** - `/creator/twitch-calculator`
7. **Podcast Sponsorship** - `/creator/podcast-calculator`
8. **Patreon Earnings** - `/creator/patreon-calculator`
9. **Ko-fi Earnings** - `/creator/kofi-calculator`
10. **Etsy Fee Calculator** - `/creator/etsy-fee-calculator`
11. **Substack Revenue** - `/creator/substack-calculator`

### Gig Economy (4)
12. **DoorDash Earnings** - `/gig-economy/doordash-calculator`
13. **Uber/Lyft Driver Earnings** - `/gig-economy/uber-lyft-calculator`
14. **Instacart Shopper** - `/gig-economy/instacart-calculator`
15. **Airbnb Profit** - `/gig-economy/airbnb-calculator`

### Side Hustle (1)
16. **Side Hustle Time to Goal** - `/side-hustle/time-to-goal-calculator`

*All calculators have Quick/Advanced mode and URL state sharing.*

## Immediate TODO (Phase 3)

### 1. SEO Setup (DO THIS FIRST)
- [ ] Add site to Google Search Console
- [ ] Verify ownership via HTML meta tag
- [ ] Submit sitemap: `/sitemap-index.xml`

### 2. Initial Backlinks
- [ ] Post on Reddit (r/freelance, r/sidehustle, r/youtubers)
- [ ] Submit to Product Hunt
- [ ] Share on Twitter/X communities

### 3. Monitor & Wait
- [ ] Check Search Console weekly for indexing progress
- [ ] Watch for crawl errors
- [ ] Note which calculators get impressions first

### 4. Future (When Traffic Exists)
- [ ] Add Plausible analytics
- [ ] Apply for Google AdSense (when >1000 visits/month)

## Need Help?

- Architecture questions → `ARCHITECTURE.md`
- Adding calculators → `ADDING-CALCULATORS.md`
- What's decided → `DECISIONS.md`
- Calculator ideas → `CALCULATOR-IDEAS.md`
