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
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900
          focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none
          transition-colors bg-white cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  );
}
