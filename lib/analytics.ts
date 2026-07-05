"use client";

type GtagWindow = Window & {
  gtag?: (command: "event", eventName: string, params?: Record<string, unknown>) => void;
};

/**
 * GA4 event helper. No-ops when GA4 isn't configured
 * (NEXT_PUBLIC_GA4_ID unset) so calls are always safe.
 */
export function track(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, params);
  }
}
