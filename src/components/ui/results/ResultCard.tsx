import { useCountUp } from '../../../hooks/useCountUp';
import { CATEGORY_GRADIENTS, CATEGORY_GLOWS, type CategoryKey } from '../../../lib/utils/category-styles';

interface ResultCardProps {
  label: string;
  value: string;
  description?: string;
  highlight?: boolean;
  size?: 'sm' | 'md' | 'lg';
  category?: CategoryKey;
  numericValue?: number;
  formatFn?: (n: number) => string;
}

function AnimatedValue({ numericValue, formatFn }: { numericValue: number; formatFn: (n: number) => string }) {
  const animated = useCountUp({ end: numericValue });
  return <>{formatFn(animated)}</>;
}

export function ResultCard({
  label,
  value,
  description,
  highlight = false,
  size = 'md',
  category = 'freelance',
  numericValue,
  formatFn,
}: ResultCardProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
  };


  const displayValue = numericValue !== undefined && formatFn
    ? <AnimatedValue numericValue={numericValue} formatFn={formatFn} />
    : value;

  if (highlight) {
    return (
      <div
        className={`rounded-2xl p-6 bg-gradient-to-br ${CATEGORY_GRADIENTS[category]}
          text-white shadow-xl ${CATEGORY_GLOWS[category]} ring-1 ring-white/10 ring-inset`}
      >
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className={`${sizeClasses[size]} font-extrabold mt-2 tracking-tight`}>
          {displayValue}
        </p>
        {description && (
          <p className="text-sm mt-2 text-white/70">{description}</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 bg-neutral-100 border border-neutral-200">
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className={`${sizeClasses[size]} font-bold mt-1 text-neutral-900 tracking-tight`}>
        {displayValue}
      </p>
      {description && (
        <p className="text-sm mt-1 text-neutral-500">{description}</p>
      )}
    </div>
  );
}
