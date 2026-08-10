// Byline identity for blog posts and Article structured data.
//
// Deliberately minimal: there is no /authors/[slug] page, no photo, and no
// credentials. CalcFalcon is a tools site, so the trust signals that carry
// weight here are data provenance (see SourcesBlock + /methodology) and a
// clearly accountable operator (see /about) — not an author bio.
//
// Bylines link to /about rather than a dedicated author page.
//
// NEVER add a licensed designation (CPA, CFP, "financial advisor") here.
// The site publishes YMYL tax and finance content; an invented credential
// would be far worse than no credential.

export interface Author {
  /** Display name shown in bylines and emitted as Article schema `author`. */
  name: string;
}

export const AUTHORS: Record<string, Author> = {
  ben: {
    // First name only, by choice.
    name: 'Ben',
  },
};

/** The author used when a blog post doesn't specify one. */
export const DEFAULT_AUTHOR_SLUG = 'ben';

/** Bylines and Article schema point here — there is no per-author page. */
export const AUTHOR_PATH = '/about';

export function getAuthor(slug: string | undefined): Author {
  return AUTHORS[slug ?? DEFAULT_AUTHOR_SLUG] ?? AUTHORS[DEFAULT_AUTHOR_SLUG];
}
