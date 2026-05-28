declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

/** Programmatic Umami event. Safe no-op on server or when the script
 * hasn't loaded (missing env vars, dev, blocked). Click events use the
 * declarative `data-umami-event` attribute instead. */
export function track(event: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.umami?.track(event, data);
}

export {};
