import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type CategoryType = 'freelance' | 'creator' | 'gig' | 'sidehustle' | 'finance';

interface CopyResultsButtonProps {
  getResultsText: () => string;
  category?: CategoryType;
}

const categoryStyles: Record<CategoryType, string> = {
  freelance: 'text-freelance-600 hover:bg-freelance-50',
  creator: 'text-creator-600 hover:bg-creator-50',
  gig: 'text-gig-600 hover:bg-gig-50',
  sidehustle: 'text-sidehustle-600 hover:bg-sidehustle-50',
  finance: 'text-finance-600 hover:bg-finance-50',
};

export function CopyResultsButton({ getResultsText, category = 'freelance' }: CopyResultsButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getResultsText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail if clipboard API unavailable
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
        copied ? 'text-green-600 bg-green-50' : categoryStyles[category]
      }`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy Results
        </>
      )}
    </button>
  );
}
