interface Option {
  value: string;
  label: string;
}

interface DropdownInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  helpText?: string;
}

export function DropdownInput({
  id,
  label,
  value,
  onChange,
  options,
  helpText,
}: DropdownInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 focus:outline-none
            transition-all duration-200 shadow-sm hover:border-neutral-300
            cursor-pointer appearance-none pr-10"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {helpText && <p className="text-xs text-neutral-500">{helpText}</p>}
    </div>
  );
}
