import { useState, useEffect } from 'react';
import { getInitialState, updateUrlState, getInitialMode } from '../lib/utils/url-state';

export function useCalculatorState<T extends object>(
  defaultInputs: T,
  quickModeDefaults?: Partial<T>
) {
  const [mode, setMode] = useState<'quick' | 'advanced'>(() => getInitialMode());
  const [inputs, setInputs] = useState<T>(() =>
    getInitialState(defaultInputs as Record<string, unknown>) as T
  );

  useEffect(() => {
    if (quickModeDefaults && mode === 'quick') {
      setInputs((prev) => ({ ...prev, ...quickModeDefaults }));
    }
  }, [mode]);

  useEffect(() => {
    updateUrlState(inputs as Record<string, unknown>, mode);
  }, [inputs, mode]);

  const updateInput = <K extends keyof T>(key: K, value: T[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isAdvanced = mode === 'advanced';

  return { mode, setMode, inputs, setInputs, updateInput, isAdvanced };
}
