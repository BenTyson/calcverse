interface ResultCardProps {
  label: string;
  value: string;
  description?: string;
  highlight?: boolean;
  size?: 'sm' | 'md' | 'lg';
  category?: 'freelance' | 'creator' | 'gig' | 'sidehustle' | 'finance';
}

export function ResultCard({
  label,
  value,
  description,
  highlight = false,
  size = 'md',
  category = 'freelance',
}: ResultCardProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
  };

  const categoryGradients = {
    freelance: 'from-freelance-500 to-freelance-600',
    creator: 'from-creator-500 to-creator-600',
    gig: 'from-gig-500 to-gig-600',
    sidehustle: 'from-sidehustle-500 to-sidehustle-600',
    finance: 'from-finance-500 to-finance-600',
  };

  const categoryGlows = {
    freelance: 'shadow-freelance-500/25',
    creator: 'shadow-creator-500/25',
    gig: 'shadow-gig-500/25',
    sidehustle: 'shadow-sidehustle-500/25',
    finance: 'shadow-finance-500/25',
  };

  if (highlight) {
    return (
      <div
        className={`rounded-2xl p-6 bg-gradient-to-br ${categoryGradients[category]}
          text-white shadow-xl ${categoryGlows[category]} ring-1 ring-white/10 ring-inset`}
      >
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className={`${sizeClasses[size]} font-extrabold mt-2 tracking-tight`}>
          {value}
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
        {value}
      </p>
      {description && (
        <p className="text-sm mt-1 text-neutral-500">{description}</p>
      )}
    </div>
  );
}
