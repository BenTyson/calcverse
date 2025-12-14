export function encodeState<T extends Record<string, unknown>>(state: T): string {
  try {
    return btoa(JSON.stringify(state));
  } catch {
    return '';
  }
}

export function decodeState<T extends Record<string, unknown>>(
  encoded: string
): T | null {
  try {
    return JSON.parse(atob(encoded)) as T;
  } catch {
    return null;
  }
}

export function updateUrlState<T extends Record<string, unknown>>(
  state: T,
  mode?: 'quick' | 'advanced'
): void {
  if (typeof window === 'undefined') return;

  const encoded = encodeState(state);
  if (!encoded) return;

  const url = new URL(window.location.href);
  url.searchParams.set('s', encoded);

  // Include mode in URL if advanced (quick is default, so omit it)
  if (mode === 'advanced') {
    url.searchParams.set('mode', 'advanced');
  } else {
    url.searchParams.delete('mode');
  }

  window.history.replaceState({}, '', url.toString());
}

export function getInitialState<T extends Record<string, unknown>>(
  defaults: T
): T {
  if (typeof window === 'undefined') return defaults;

  const url = new URL(window.location.href);
  const encoded = url.searchParams.get('s');

  if (!encoded) return defaults;

  const decoded = decodeState<T>(encoded);
  return decoded ? { ...defaults, ...decoded } : defaults;
}

export function getInitialMode(): 'quick' | 'advanced' {
  if (typeof window === 'undefined') return 'quick';

  const url = new URL(window.location.href);
  return url.searchParams.get('mode') === 'advanced' ? 'advanced' : 'quick';
}

export function getShareUrl(
  baseUrl: string,
  state: Record<string, unknown>,
  mode?: 'quick' | 'advanced'
): string {
  const encoded = encodeState(state);
  const url = new URL(baseUrl);
  url.searchParams.set('s', encoded);

  if (mode === 'advanced') {
    url.searchParams.set('mode', 'advanced');
  }

  return url.toString();
}
