import { describe, expect, it } from "vitest";
import { BRAND_LOGO_SRC, BRAND_LOGO_SRC_LARGE } from "@/components/marketing/brand/logo-paths";

describe("brand logo assets", () => {
  it("points to static icon files in public/", () => {
    expect(BRAND_LOGO_SRC).toBe("/brand/logo.png");
    expect(BRAND_LOGO_SRC_LARGE).toBe("/brand/logo-512.png");
  });
});
