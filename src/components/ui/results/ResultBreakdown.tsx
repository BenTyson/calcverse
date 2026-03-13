import { CATEGORY_COLORS, type CategoryKey } from '../../../lib/utils/category-styles';

interface BreakdownItem {
  label: React.ReactNode;
  value: string;
  highlight?: boolean;
}

interface ResultBreakdownProps {
  title?: string;
  items: BreakdownItem[];
  category?: CategoryKey;
}

export function ResultBreakdown({
  title,
  items,
  category = 'freelance',
}: ResultBreakdownProps) {
  const colors = CATEGORY_COLORS[category];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
      {title && (
        <div className="px-5 py-4 bg-neutral-50 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-900">{title}</h3>
        </div>
      )}
      <div className="divide-y divide-neutral-100">
        {items.map((item, index) => (
          <div
            key={index}
            className={`px-5 py-4 flex justify-between items-center ${
              item.highlight ? colors.bg : ''
            }`}
          >
            <span
              className={`text-sm ${
                item.highlight ? `font-medium ${colors.text}` : 'text-neutral-600'
              }`}
            >
              {item.label}
            </span>
            <span
              className={`font-semibold font-mono ${
                item.highlight ? colors.text : 'text-neutral-900'
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
