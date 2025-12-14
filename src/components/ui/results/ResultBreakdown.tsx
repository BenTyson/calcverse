interface BreakdownItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ResultBreakdownProps {
  title?: string;
  items: BreakdownItem[];
}

export function ResultBreakdown({ title, items }: ResultBreakdownProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="divide-y divide-gray-100">
        {items.map((item, index) => (
          <div
            key={index}
            className={`px-4 py-3 flex justify-between items-center ${
              item.highlight ? 'bg-brand-50' : ''
            }`}
          >
            <span
              className={`text-sm ${
                item.highlight ? 'font-medium text-brand-700' : 'text-gray-600'
              }`}
            >
              {item.label}
            </span>
            <span
              className={`font-semibold ${
                item.highlight ? 'text-brand-700' : 'text-gray-900'
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
