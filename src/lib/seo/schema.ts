export interface CalculatorSEO {
  name: string;
  description: string;
  url: string;
  category: string;
  image?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateWebApplicationSchema(calc: CalculatorSEO): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calc.name,
    description: calc.description,
    url: calc.url,
    ...(calc.image && { image: calc.image }),
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function generateFAQSchema(faqs: FAQ[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export interface ArticleAuthorSEO {
  name: string;
  url: string;
}

export interface ArticleSEO {
  headline: string;
  description: string;
  url: string;
  publishedDate: string;
  updatedDate?: string;
  category: string;
  /** Byline author. Falls back to the CalcFalcon organization if omitted. */
  author?: ArticleAuthorSEO;
  siteUrl?: string;
}

export function generateArticleSchema(article: ArticleSEO): object {
  const siteUrl = article.siteUrl || 'https://calcfalcon.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    url: article.url,
    datePublished: article.publishedDate,
    ...(article.updatedDate && { dateModified: article.updatedDate }),
    articleSection: article.category,
    author: article.author
      ? {
          '@type': 'Person',
          name: article.author.name,
          url: article.author.url,
        }
      : {
          '@type': 'Organization',
          name: 'CalcFalcon',
          url: siteUrl,
        },
    publisher: {
      '@type': 'Organization',
      name: 'CalcFalcon',
      url: siteUrl,
    },
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
