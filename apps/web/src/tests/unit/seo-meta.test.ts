import { describe, expect, it } from "vitest";
import { collectAllSeoEntries, getBannedMetaPhrases } from "@/lib/seo/collect-meta";

describe("SEO metadata", () => {
  it("has unique meta descriptions for every route", () => {
    const entries = collectAllSeoEntries();
    const descriptions = entries.map((entry) => entry.description);
    const unique = new Set(descriptions);

    expect(unique.size).toBe(descriptions.length);
  });

  it("keeps meta descriptions within recommended length", () => {
    const entries = collectAllSeoEntries();

    for (const entry of entries) {
      expect(entry.description.length).toBeLessThanOrEqual(160);
      expect(entry.title.length).toBeGreaterThan(0);
    }
  });

  it("avoids boilerplate phrases in meta descriptions", () => {
    const banned = getBannedMetaPhrases();
    const entries = collectAllSeoEntries();

    for (const entry of entries) {
      for (const phrase of banned) {
        expect(entry.description.toLowerCase()).not.toContain(phrase);
      }
    }
  });

  it("differentiates SERP description from on-page lead where both exist", () => {
    const entries = collectAllSeoEntries().filter((entry) => entry.pageDescription);

    for (const entry of entries) {
      expect(entry.description).not.toBe(entry.pageDescription);
    }
  });
});
