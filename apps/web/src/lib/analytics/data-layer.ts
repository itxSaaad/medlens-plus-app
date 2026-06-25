export type AnalyticsEvent =
  | { event: "page_view"; page_type: string }
  | { event: "cta_click"; cta_id: string; page_type: string }
  | { event: "waitlist_submit"; page_type: string; success: boolean }
  | { event: "newsletter_submit"; page_type: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function pushEvent(payload: AnalyticsEvent): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    ...payload,
    page_location: sanitizePageLocation(window.location.href),
  });
}

function sanitizePageLocation(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    return parsed.toString();
  } catch {
    return url.split("?")[0] ?? url;
  }
}

export function getPageTypeFromPath(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/blog/")) return "blog_post";
  if (pathname === "/blog") return "blog";
  if (pathname.startsWith("/glossary/")) return "glossary_term";
  if (pathname === "/glossary") return "glossary";
  if (pathname.startsWith("/use-cases/")) return "use_case";
  if (pathname === "/use-cases") return "use_cases";
  return pathname.slice(1).replace(/\//g, "_") || "unknown";
}
