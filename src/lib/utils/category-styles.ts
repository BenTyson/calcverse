export type CategoryKey = 'freelance' | 'creator' | 'gig' | 'sidehustle' | 'finance';

export const CATEGORY_GRADIENTS: Record<CategoryKey, string> = {
  freelance: 'from-freelance-500 to-freelance-600',
  creator: 'from-creator-500 to-creator-600',
  gig: 'from-gig-500 to-gig-600',
  sidehustle: 'from-sidehustle-500 to-sidehustle-600',
  finance: 'from-finance-500 to-finance-600',
};

export const CATEGORY_GLOWS: Record<CategoryKey, string> = {
  freelance: 'shadow-freelance-500/25',
  creator: 'shadow-creator-500/25',
  gig: 'shadow-gig-500/25',
  sidehustle: 'shadow-sidehustle-500/25',
  finance: 'shadow-finance-500/25',
};

export const CATEGORY_COLORS: Record<CategoryKey, { bg: string; text: string; border: string }> = {
  freelance: { bg: 'bg-freelance-50', text: 'text-freelance-700', border: 'border-freelance-100' },
  creator: { bg: 'bg-creator-50', text: 'text-creator-700', border: 'border-creator-100' },
  gig: { bg: 'bg-gig-50', text: 'text-gig-700', border: 'border-gig-100' },
  sidehustle: { bg: 'bg-sidehustle-50', text: 'text-sidehustle-700', border: 'border-sidehustle-100' },
  finance: { bg: 'bg-finance-50', text: 'text-finance-700', border: 'border-finance-100' },
};
