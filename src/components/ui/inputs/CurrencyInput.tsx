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
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none font-medium">
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
          className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-3 text-neutral-900
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 focus:outline-none
            transition-all duration-200 shadow-sm hover:border-neutral-300"
        />
      </div>
      {helpText && <p className="text-xs text-neutral-500">{helpText}</p>}
    </div>
  );
}
