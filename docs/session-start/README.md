# Calcverse - Session Start Guide

> **Read this first before doing anything.**

## What is Calcverse?

A passive income calculator network targeting long-tail SEO keywords. Built with Astro + React + Tailwind. Goal: $1-5K/month from ads and affiliates.

## Current Status

**Phase 2 COMPLETE** - 9 calculators live across 4 categories, ready to deploy to Cloudflare Pages.

| What | Status |
|------|--------|
| Calculators | 9 live (target: 15+) |
| Categories | 4 (Freelance, Creator, Gig Economy, Side Hustle) |
| Deployment | Ready (not yet deployed) |
| Analytics | Not set up (add after domain) |
| Monetization | Not set up (Phase 3) |

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

## Current Calculators

### Freelance (1)
1. **Freelancer Hourly Rate** - `/freelance/hourly-rate-calculator` *(Quick/Advanced mode)*

### Creator (4)
2. **YouTube AdSense Revenue** - `/creator/youtube-adsense-calculator`
3. **Patreon Earnings** - `/creator/patreon-calculator`
4. **Etsy Fee Calculator** - `/creator/etsy-fee-calculator`
5. **Substack Revenue** - `/creator/substack-calculator`

### Gig Economy (3) - NEW
6. **DoorDash Earnings** - `/gig-economy/doordash-calculator`
7. **Uber/Lyft Driver Earnings** - `/gig-economy/uber-lyft-calculator`
8. **Airbnb Profit** - `/gig-economy/airbnb-calculator`

### Side Hustle (1)
9. **Side Hustle Time to Goal** - `/side-hustle/time-to-goal-calculator`

## Next Steps (Phase 3)

1. Deploy to Cloudflare Pages
2. Submit sitemap to Google Search Console
3. Apply for AdSense
4. Add more calculators (Freelance focus)

## Need Help?

- Architecture questions → `ARCHITECTURE.md`
- Adding calculators → `ADDING-CALCULATORS.md`
- What's decided → `DECISIONS.md`
- Calculator ideas → `CALCULATOR-IDEAS.md`
