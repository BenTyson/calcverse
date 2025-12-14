interface BreakdownItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ResultBreakdownProps {
  title?: string;
  items: BreakdownItem[];
  category?: 'freelance' | 'creator' | 'gig' | 'sidehustle' | 'finance';
}

export function ResultBreakdown({
  title,
  items,
  category = 'freelance',
}: ResultBreakdownProps) {
  const categoryColors = {
    freelance: {
      bg: 'bg-freelance-50',
      text: 'text-freelance-700',
      border: 'border-freelance-100',
    },
    creator: {
      bg: 'bg-creator-50',
      text: 'text-creator-700',
      border: 'border-creator-100',
    },
    gig: {
      bg: 'bg-gig-50',
      text: 'text-gig-700',
      border: 'border-gig-100',
    },
    sidehustle: {
      bg: 'bg-sidehustle-50',
      text: 'text-sidehustle-700',
      border: 'border-sidehustle-100',
    },
    finance: {
      bg: 'bg-finance-50',
      text: 'text-finance-700',
      border: 'border-finance-100',
    },
  };

  const colors = categoryColors[category];

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
