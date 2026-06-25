import { describe, expect, it } from "vitest";
import { getAllStaticRoutes, getHomeContent, getSiteConfig } from "@/lib/content/loader";

describe("content loader", () => {
  it("loads site config and home content", () => {
    const site = getSiteConfig();
    const home = getHomeContent();

    expect(site.name).toBe("MedLens+");
    expect(home.hero.headline).toContain("timeline");
  });

  it("generates all static marketing routes", () => {
    const routes = getAllStaticRoutes();

    expect(routes).toContain("/");
    expect(routes).toContain("/features");
    expect(routes).toContain("/blog/organize-lab-reports");
    expect(routes).toContain("/glossary/reference-range");
    expect(routes).toContain("/use-cases/diabetes-monitoring");
    expect(routes.length).toBeGreaterThanOrEqual(15);
  });
});
