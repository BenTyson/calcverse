# Decisions Already Made

> **Do not re-debate these decisions.** They were made deliberately and changing them would require significant refactoring.

## Technical Stack

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Astro 5 | SSG for performance, islands for interactivity |
| UI Library | React 19 | Calculator interactivity, ecosystem |
| Styling | Tailwind CSS 4 | Rapid development, small bundle |
| Hosting | Cloudflare Pages | Free tier, edge performance |
| Analytics | Plausible | Privacy-focused, no cookie banner |
| Ads | AdSense → Mediavine | Start simple, upgrade at scale |

**Why not Next.js?** Calculators are mostly static with small interactive islands. Astro's island architecture is simpler and produces better Core Web Vitals.

## Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | None | URL params for state sharing |
| Auth | None | No user accounts needed |
| CMS | None | Hardcoded content is fine |
| State Management | URL params | Shareable results |
| Build | Static (SSG) | Maximum performance |

**Why no database?** Each calculator is self-contained. State is encoded in URL parameters for sharing. No need for persistence.

## URL Structure

```
/[category]/[calculator-name]-calculator
```

Examples:
- `/freelance/hourly-rate-calculator`
- `/creator/youtube-adsense-calculator`
- `/side-hustle/time-to-goal-calculator`

**Embeds:** `/embed/[category]/[calculator-name]-calculator`

## SEO Strategy

| Decision | Implementation |
|----------|----------------|
| Schema.org | WebApplication + FAQPage |
| Sitemap | Auto-generated, excludes embeds |
| Meta tags | Unique per page |
| Internal linking | Related calculators on each page |

## Monetization (Phase 3)

| Decision | Plan |
|----------|------|
| Primary revenue | Display ads (AdSense, then Mediavine) |
| Secondary revenue | Affiliate links where relevant |
| Lead gen | Optional email capture on high-value calculators |

**Ad placement:** Below calculator results, sidebar on desktop.

## Content Strategy

| Decision | Approach |
|----------|----------|
| FAQs | 3-5 per calculator, target featured snippets |
| Copy | Minimal, let calculator do the work |
| Updates | Calculators don't need frequent updates |

## What's Still Open

These decisions can still be made:

1. **Specific calculator prioritization** - Order of building Phase 2 calculators
2. **Affiliate programs** - Which to join, where to place
3. **Email capture** - Whether to add, what to offer
4. **Social media** - Whether to create accounts
5. **OG images** - Currently placeholders, need real designs
6. **Domain** - Currently using placeholder URL

## If You Want to Change Something

Before proposing a change to any decided item:

1. Explain the problem with the current approach
2. Quantify the impact (performance, revenue, user experience)
3. Estimate the refactoring effort
4. Get explicit approval from the user

Most "improvements" aren't worth the refactoring cost. Ship more calculators instead.
