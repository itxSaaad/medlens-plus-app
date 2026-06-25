import { describe, expect, it } from "vitest";
import { getBrandName, getContactEmail, getSiteUrl } from "@/lib/site/env";

describe("site env", () => {
  it("falls back to safe defaults when env vars are unset", () => {
    expect(getSiteUrl()).toMatch(/^https?:\/\//);
    expect(getContactEmail()).toContain("@");
    expect(getBrandName()).toBeTruthy();
  });
});
