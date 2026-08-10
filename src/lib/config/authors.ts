// Author profiles for E-E-A-T (Experience, Expertise, Authoritativeness, Trust) signals.
// Rendered as bylines on blog posts, in Article structured data, and on /authors/[slug] pages.
//
// TODO(ben): Replace every TODO(ben) value below with real information before this ships.
// Do not publish invented credentials, job titles, or certifications — see CLAUDE.md and the
// AdSense remediation brief for why that would make the low-value-content problem worse, not better.

export interface Author {
  /** URL slug, used at /authors/[slug] */
  slug: string;
  /** Display name shown in bylines. */
  name: string;
  /** One-line role/title shown under the name (e.g. "Founder, CalcFalcon"). */
  title: string;
  /** 2-4 sentence bio: what genuinely qualifies this person to write this content. */
  bio: string;
  /**
   * What grounds this author's authority on freelance/creator/gig finance topics.
   * Lived experience ("ran a freelance design business for 6 years") is a legitimate
   * E-E-A-T signal and does not require a professional license — but it must be true.
   */
  background: string;
  /** Path to an avatar image in /public, or undefined to fall back to initials. */
  avatar?: string;
  social?: {
    linkedin?: string;
    x?: string;
    website?: string;
  };
}

export const AUTHORS: Record<string, Author> = {
  ben: {
    slug: 'ben',
    // TODO(ben): confirm the byline name you want published (full name, or a preferred
    // public-facing name). This appears on every post and in Google's Article schema.
    name: 'TODO(ben): your published byline name',
    // TODO(ben): e.g. "Founder, CalcFalcon"
    title: 'TODO(ben): your title/role',
    // TODO(ben): 2-4 sentences, first person or third person, on why you built these
    // calculators and what your relationship to this subject matter is.
    bio: 'TODO(ben): 2-4 sentence bio — who you are and why you built CalcFalcon.',
    // TODO(ben): concrete, true background. Examples of legitimate (non-licensed) E-E-A-T
    // signals: "Freelance software consultant for 8 years, filed quarterly estimated taxes
    // the whole time" or "Built and sold two content businesses funded by ad and affiliate
    // revenue." Do NOT write "CPA", "CFP", "financial advisor," or any licensed designation
    // unless you actually hold it.
    background: 'TODO(ben): what genuinely qualifies you to write about freelance/creator finances.',
    // TODO(ben): add a photo to /public/authors/ben.jpg (or similar) and set the path here,
    // or leave undefined to use initials.
    avatar: undefined,
    social: {
      // TODO(ben): add real profile URLs or remove the ones you don't want published.
      linkedin: undefined,
      x: undefined,
      website: undefined,
    },
  },
};

/** The author used when a blog post doesn't specify one. */
export const DEFAULT_AUTHOR_SLUG = 'ben';

export function getAuthor(slug: string | undefined): Author {
  return AUTHORS[slug ?? DEFAULT_AUTHOR_SLUG] ?? AUTHORS[DEFAULT_AUTHOR_SLUG];
}
