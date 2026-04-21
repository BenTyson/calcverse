type UmamiTracker = {
  track: (event: string, props?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

export function track(event: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    window.umami?.track(event, props);
  } catch {
    // no-op: analytics must never break user flow
  }
}
