import { useState, useId } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <span
      className="relative inline-flex items-center gap-1"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span tabIndex={0} aria-describedby={id} className="cursor-help border-b border-dashed border-neutral-400">
        {children}
      </span>
      {visible && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-neutral-900 rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none"
        >
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
        </span>
      )}
    </span>
  );
}
