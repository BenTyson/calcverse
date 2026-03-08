import type { ChartCategory } from '../../../lib/utils/chart-colors';

interface ChartCardProps {
  title: string;
  description?: string;
  category?: ChartCategory;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  children,
  className = '',
}: ChartCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm ${className}`}
    >
      <div className="px-5 py-4 bg-neutral-50 border-b border-neutral-100">
        <h3 className="font-semibold text-neutral-900">{title}</h3>
        {description && (
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
