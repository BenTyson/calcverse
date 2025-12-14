interface SliderInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
  helpText?: string;
}

export function SliderInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue = (v) => v.toString(),
  helpText,
}: SliderInputProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
        <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">
          {formatValue(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-primary-500
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-500/25
          [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
          [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:hover:shadow-xl
          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:bg-primary-500 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-thumb]:shadow-lg"
        style={{
          background: `linear-gradient(to right, #06b6d4 ${percentage}%, #e7e5e4 ${percentage}%)`,
        }}
      />
      <div className="flex justify-between text-xs text-neutral-400">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
      {helpText && <p className="text-xs text-neutral-500">{helpText}</p>}
    </div>
  );
}
