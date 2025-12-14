interface ModeToggleProps {
  mode: 'quick' | 'advanced';
  onChange: (mode: 'quick' | 'advanced') => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl w-fit">
      <button
        onClick={() => onChange('quick')}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          mode === 'quick'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        Quick
      </button>
      <button
        onClick={() => onChange('advanced')}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          mode === 'advanced'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        Advanced
      </button>
    </div>
  );
}
