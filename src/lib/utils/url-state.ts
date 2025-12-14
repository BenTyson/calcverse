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
  state: T
): void {
  if (typeof window === 'undefined') return;

  const encoded = encodeState(state);
  if (!encoded) return;

  const url = new URL(window.location.href);
  url.searchParams.set('s', encoded);
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

export function getShareUrl(baseUrl: string, state: Record<string, unknown>): string {
  const encoded = encodeState(state);
  const url = new URL(baseUrl);
  url.searchParams.set('s', encoded);
  return url.toString();
}
