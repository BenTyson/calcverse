interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  helpText?: string;
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  helpText,
}: NumberInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none font-medium">
            {prefix}
          </span>
        )}
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
          className={`w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 focus:outline-none
            transition-all duration-200 shadow-sm hover:border-neutral-300
            ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-16' : ''}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none font-medium">
            {suffix}
          </span>
        )}
      </div>
      {helpText && <p className="text-xs text-neutral-500">{helpText}</p>}
    </div>
  );
}
