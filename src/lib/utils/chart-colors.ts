export type ChartCategory = 'freelance' | 'creator' | 'gig' | 'sidehustle' | 'finance';

const CATEGORY_COLORS: Record<ChartCategory, {
  primary: string;
  shades: string[];
  light: string;
  text: string;
}> = {
  freelance: {
    primary: '#06b6d4',
    shades: ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'],
    light: '#ecfeff',
    text: '#0e7490',
  },
  creator: {
    primary: '#ec4899',
    shades: ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8'],
    light: '#fdf2f8',
    text: '#be185d',
  },
  gig: {
    primary: '#10b981',
    shades: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
    light: '#ecfdf5',
    text: '#047857',
  },
  sidehustle: {
    primary: '#a855f7',
    shades: ['#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'],
    light: '#faf5ff',
    text: '#7e22ce',
  },
  finance: {
    primary: '#f59e0b',
    shades: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
    light: '#fffbeb',
    text: '#b45309',
  },
};

export function getCategoryColors(category: ChartCategory = 'freelance') {
  return CATEGORY_COLORS[category];
}
