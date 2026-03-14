Create a new blog post for CalcFalcon. Follow every step — do not skip any.

## Step 0: Gather Requirements

Before writing anything, confirm ALL of the following with the user (or extract from their prompt). Do not assume — ask if unclear.

### Required info:
1. **Post title** — compelling, specific, includes year if data-driven (e.g., "How Much Do TikTok Creators Actually Make? (2026 Data)")
2. **Category** — `freelance`, `creator`, `gig-economy`, `side-hustle`, or `finance`
3. **File slug** — kebab-case (e.g., `tiktok-creator-earnings`)
4. **Post type** — single-calc or hub (multi-calc)
5. **Calculator link(s)** — full path(s) (e.g., `/creator/tiktok-calculator`)
6. **Angle** — the hook/thesis that makes this post worth reading
7. **SEO description** — under 160 chars

### Check the roadmap:
- Look up the post in `docs/ROADMAP.md` Blog Content Roadmap — it may already have title, category, calculator(s), and angle defined.

## Step 1: Read Model Post + Calculator

Read the existing post closest in structure:
- **Single-calc model:** `src/content/blog/doordash-driver-earnings.md`
- **Hub/multi-calc model:** `src/content/blog/side-hustle-taxes.md`

Also read the target calculator's logic file (`src/lib/calculators/*.ts`) and Astro page to understand:
- What the calculator actually computes
- Key inputs and outputs
- FAQs already on the calculator page (don't duplicate — complement them)
- Related calculators listed on the page

## Step 2: Write the Blog Post

**File:** `src/content/blog/[slug].md`

### Frontmatter:

For single-calc posts:
```yaml
---
title: "Post Title Here"
description: "SEO description under 160 chars"
publishedDate: YYYY-MM-DD
category: category-name
calculatorSlug: /category/calculator-slug
---
```

For hub posts (multiple calculators):
```yaml
---
title: "Post Title Here"
description: "SEO description under 160 chars"
publishedDate: YYYY-MM-DD
category: category-name
calculatorSlugs:
  - /category/calculator-slug-1
  - /category/calculator-slug-2
---
```

### Date spacing:
- Check existing posts' `publishedDate` values to avoid clustering
- Space new posts ~1 week apart from existing ones and from each other
- Use dates in the past (not future) so they appear immediately

### Content structure (2,000-3,000 words):

Follow this structure — match the tone of existing posts (direct, data-driven, no fluff):

1. **Opening paragraph** — Hook with a specific claim or tension. No generic intros.
2. **"How [Topic] Actually Works" section** — Mechanics, fee structures, pay models. Use ### subsections. Include specific numbers and percentages.
3. **"Real Earnings/Numbers" section** — Data ranges, gross vs net, what typical users actually see. Be honest about variance.
4. **"Hidden Costs / What People Miss" section** — Expenses, fees, time costs, tax implications that aren't obvious.
5. **Strategy/optimization section** — Actionable advice. What top performers do differently.
6. **Platform/market comparison** (if applicable) — When comparing platforms, use specific numbers.
7. **"Is It Worth It?" or equivalent assessment** — Honest, nuanced take.
8. **CTA closing paragraph** — 2-3 sentences linking to the calculator. Format: "Plug your actual numbers into our [Calculator Name](/category/slug) to see..."

### Content rules:
- Write in second person ("you"), direct and conversational
- Use specific dollar amounts, percentages, and data points — never vague
- No bullet-point lists in body content — use flowing paragraphs with ### subsections
- Link to the calculator naturally in the intro AND as the closing CTA
- Link to 1-2 related blog posts inline where relevant (check existing posts)
- No emoji, no exclamation marks, no hype language
- Present both sides — don't oversell any platform or strategy
- Include tax implications where relevant (self-employment tax, deductions, quarterly payments)
- Use "2026" in claims about current rates/data to signal freshness

### Hub post specifics:
- Compare 2-3 calculators/platforms side by side
- Link each calculator inline where it's first discussed
- Include a "Which Should You Choose?" or comparison section
- Close with links to all calculators mentioned

## Step 3: Internal Linking

After creating the post, check if any existing blog posts should link to this new one (and vice versa). Natural link opportunities:
- Posts in the same category
- Posts covering related financial topics (e.g., tax posts link to earnings posts)
- The hub post `side-hustle-taxes.md` links broadly — check if new post is relevant

Only add links that are genuinely useful to the reader. Don't force them.

## Step 4: Build Verification

Run `npm run build` and confirm:
- 0 errors
- New blog post appears in build output
- Blog index page count increased

## Step 5: Update Roadmap

If this post is listed in `docs/ROADMAP.md` Blog Content Roadmap, note it as complete. Don't modify the roadmap table — just mention to the user which phase/post was completed.

---

## Quick Reference: Frontmatter Schema

From `src/content.config.ts`:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | yes | |
| description | string | yes | Under 160 chars |
| publishedDate | date | yes | YYYY-MM-DD format |
| updatedDate | date | no | For significant updates |
| category | enum | yes | freelance, creator, gig-economy, side-hustle, finance |
| calculatorSlug | string | no | Single calc: full path |
| calculatorSlugs | string[] | no | Hub post: array of full paths |
| ogImage | string | no | Custom OG image path |
| draft | boolean | no | Defaults to false |

## Mid-Article CTA

Posts with a `calculatorSlug` in frontmatter automatically get a dark, premium-styled CTA injected mid-article (at the halfway h2). No per-post config needed — `BlogLayout.astro` handles it. It only appears on posts with 3+ h2 headings.

## Quality Checklist

Before considering the post complete:
- [ ] Title is compelling and under 70 chars
- [ ] Description is under 160 chars and mentions the key value
- [ ] Frontmatter matches schema exactly (especially date format)
- [ ] Post is 2,000-3,000 words
- [ ] Calculator linked in intro and closing CTA
- [ ] Specific numbers and data throughout (not vague claims)
- [ ] At least 1 internal link to another blog post
- [ ] No emoji, no exclamation marks, no hype
- [ ] Tone matches existing posts (direct, honest, data-driven)
- [ ] Build passes with 0 errors
