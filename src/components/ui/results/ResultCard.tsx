interface ResultCardProps {
  label: string;
  value: string;
  description?: string;
  highlight?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ResultCard({
  label,
  value,
  description,
  highlight = false,
  size = 'md',
}: ResultCardProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  return (
    <div
      className={`rounded-xl p-4 ${
        highlight
          ? 'bg-brand-600 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}
    >
      <p
        className={`text-sm font-medium ${
          highlight ? 'text-brand-100' : 'text-gray-500'
        }`}
      >
        {label}
      </p>
      <p className={`${sizeClasses[size]} font-bold mt-1`}>{value}</p>
      {description && (
        <p
          className={`text-sm mt-1 ${
            highlight ? 'text-brand-200' : 'text-gray-500'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
