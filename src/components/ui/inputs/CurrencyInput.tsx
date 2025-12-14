interface CurrencyInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1000,
  helpText,
}: CurrencyInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          $
        </span>
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val)) {
              onChange(val);
            }
          }}
          min={min}
          max={max}
          step={step}
          className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2.5 text-gray-900
            focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none
            transition-colors"
        />
      </div>
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  );
}
