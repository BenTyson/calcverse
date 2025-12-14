# Calcverse - Session Start Guide

> **Read this first before doing anything.**

## What is Calcverse?

A passive income calculator network targeting long-tail SEO keywords. Built with Astro + React + Tailwind. Goal: $1-5K/month from ads and affiliates.

## Current Status

**Phase 1 COMPLETE** - 3 calculators live, ready to deploy to Cloudflare Pages.

| What | Status |
|------|--------|
| Calculators | 3 live (target: 50) |
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

1. **Freelancer Hourly Rate** - `/freelance/hourly-rate-calculator`
2. **YouTube AdSense Revenue** - `/creator/youtube-adsense-calculator`
3. **Side Hustle Time to Goal** - `/side-hustle/time-to-goal-calculator`

## Next Steps (Phase 2)

1. Deploy to Cloudflare Pages
2. Add 12 more calculators
3. Submit sitemap to Google Search Console

## Need Help?

- Architecture questions → `ARCHITECTURE.md`
- Adding calculators → `ADDING-CALCULATORS.md`
- What's decided → `DECISIONS.md`
- Calculator ideas → `CALCULATOR-IDEAS.md`
