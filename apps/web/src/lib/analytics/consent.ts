export const CONSENT_STORAGE_KEY = "medlens-consent";

export type ConsentState = "pending" | "granted" | "denied";

export function getConsentState(): ConsentState {
  if (typeof window === "undefined") {
    return "pending";
  }
  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (stored === "granted" || stored === "denied") {
    return stored;
  }
  return "pending";
}

export function setConsentState(state: Exclude<ConsentState, "pending">): void {
  localStorage.setItem(CONSENT_STORAGE_KEY, state);
  window.dispatchEvent(new CustomEvent("medlens-consent-change", { detail: state }));
}

export function initConsentDefaults(): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "consent_default",
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function grantAnalyticsConsent(): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "consent_update",
    ad_storage: "denied",
    analytics_storage: "granted",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
