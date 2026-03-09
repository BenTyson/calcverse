# Decisions — Do Not Re-debate

These are settled. Changing them requires explicit user approval.

## Stack

| Decision | Choice | Why |
|----------|--------|-----|
| Framework | Astro 5 (SSG) | Islands architecture, best for mostly-static with interactive widgets |
| UI | React 19 | Calculator interactivity, ecosystem |
| Styling | Tailwind CSS 4 | Rapid development, small bundle |
| Hosting | Railway | GitHub auto-deploy, user familiarity |
| Analytics | Umami (self-hosted) | Free, privacy-focused, no cookie banner |
| Ads | AdSense → Mediavine | Start simple, upgrade at 50K sessions/month |
| Email | Resend | Developer-friendly, simple API |
| Blog | Astro Content Collections | Markdown in src/content/blog/, no CMS |
| Domain | calcfalcon.com | Purchased, configured in codebase |

## Architecture

| Decision | Choice | Why |
|----------|--------|-----|
| Database | None | URL params for state sharing, no persistence needed |
| Auth | None | No user accounts |
| State | URL params (`?s=` base64, `?mode=`) | Shareable results |
| Build | Static (SSG) + SSR endpoint | Static pages + `/api/subscribe` SSR via `@astrojs/node` |
| Hydration | `client:visible` on pages, `client:load` on embeds | Performance — don't hydrate until scrolled into view |
| Error handling | React ErrorBoundary in every calculator | Prevents blank pages on crash |

## Brand

| Decision | Choice |
|----------|--------|
| Name | CalcFalcon |
| Primary color | Electric Cyan (#06b6d4) — `primary-*` classes |
| CSS convention | Category-specific classes (`freelance-*`, `creator-*`, etc.) |
| Font | Inter (Google Fonts with display=swap) |
| Never use | `brand-*` CSS classes (they don't exist in the design system) |

## URL Structure

```
/[category]/[calculator-name]-calculator     # Calculator pages
/embed/[category]/[calculator-name]-calculator  # Embeds (noindex)
```

## SEO

- Schema.org: WebApplication + FAQPage + BreadcrumbList per calculator
- Sitemap auto-generated, excludes `/embed/`
- Each calculator targets a specific keyword
- Blog articles target informational queries, link to calculators

## Monetization Path

1. Display ads: AdSense initially → Mediavine at 50K sessions/month
2. Affiliates: Accounting software, creator tools, gig platform referrals
3. Email list: Newsletter with sponsored placements
4. Prerequisites: custom domain + 30 pages content + 1K monthly visits for AdSense

## Monetization

| Decision | Choice | Why |
|----------|--------|-----|
| Ad slots | `AdSlot.astro` with CLS-safe min-heights | Prevent layout shift, ready for AdSense |
| Email capture | Resend API via SSR endpoint | API key stays server-side |
| SSR approach | `@astrojs/node` adapter, `prerender = false` per-endpoint | Astro 5 removed `output: 'hybrid'`; static default + per-route SSR opt-out |
| Affiliate placement | Opt-in per calculator via `affiliateProduct` prop | Not all calcs have relevant products |
| Affiliate links | `rel="nofollow sponsored"` | FTC compliance |

## What's Still Open

- Blog content voice (casual vs professional)
- Whether to self-host Inter font
- Social media presence
