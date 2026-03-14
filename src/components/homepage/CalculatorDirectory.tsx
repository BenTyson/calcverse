import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import type { CalculatorEntry } from '@lib/config/calculators';
import type { CategoryKey } from '@lib/utils/category-styles';

interface Props {
  calculators: CalculatorEntry[];
}

const CATEGORY_FILTERS: { key: CategoryKey | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'freelance', label: 'Freelance' },
  { key: 'creator', label: 'Creator' },
  { key: 'gig', label: 'Gig Economy' },
  { key: 'sidehustle', label: 'Side Hustle' },
  { key: 'finance', label: 'Personal Finance' },
];

const PILL_ACTIVE_STYLES: Record<CategoryKey | 'all', string> = {
  all: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
  freelance: 'bg-gradient-to-r from-freelance-500 to-freelance-600 text-white',
  creator: 'bg-gradient-to-r from-creator-500 to-creator-600 text-white',
  gig: 'bg-gradient-to-r from-gig-500 to-gig-600 text-white',
  sidehustle: 'bg-gradient-to-r from-sidehustle-500 to-sidehustle-600 text-white',
  finance: 'bg-gradient-to-r from-finance-500 to-finance-600 text-white',
};

const CARD_BORDER_COLORS: Record<CategoryKey, string> = {
  freelance: 'border-l-freelance-500',
  creator: 'border-l-creator-500',
  gig: 'border-l-gig-500',
  sidehustle: 'border-l-sidehustle-500',
  finance: 'border-l-finance-500',
};

const BADGE_STYLES: Record<CategoryKey, string> = {
  freelance: 'bg-freelance-50 text-freelance-700',
  creator: 'bg-creator-50 text-creator-700',
  gig: 'bg-gig-50 text-gig-700',
  sidehustle: 'bg-sidehustle-50 text-sidehustle-700',
  finance: 'bg-finance-50 text-finance-700',
};

export default function CalculatorDirectory({ calculators }: Props) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: calculators.length };
    for (const calc of calculators) {
      counts[calc.categoryKey] = (counts[calc.categoryKey] || 0) + 1;
    }
    return counts;
  }, [calculators]);

  const filtered = useMemo(() => {
    let results = calculators;
    if (activeCategory !== 'all') {
      results = results.filter((c) => c.categoryKey === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }
    return results;
  }, [calculators, activeCategory, searchQuery]);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === cat.key
                  ? PILL_ACTIVE_STYLES[cat.key]
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat.label} ({categoryCounts[cat.key] || 0})
            </button>
          ))}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search calculators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-sm text-neutral-500">
          Showing {filtered.length} calculator{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((calc) => (
          <a
            key={calc.href}
            href={calc.href}
            className={`group block p-6 bg-white rounded-2xl border border-neutral-100 border-l-4 ${CARD_BORDER_COLORS[calc.categoryKey]} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span
                className={`inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${BADGE_STYLES[calc.categoryKey]}`}
              >
                {calc.category}
              </span>
              {calc.featured && (
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                  Popular
                </span>
              )}
            </div>
            <h3 className="font-bold text-neutral-900 text-lg group-hover:text-primary-600 transition-colors">
              {calc.name}
            </h3>
            <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
              {calc.description}
            </p>
            <div className="mt-4 flex items-center gap-1 text-primary-600 font-semibold text-sm">
              <span>Try it free</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500 text-lg">No calculators match your search.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-4 text-primary-600 font-medium hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
