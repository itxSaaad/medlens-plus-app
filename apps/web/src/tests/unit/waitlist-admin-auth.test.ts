import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resetEnvCacheForTests } from "@/lib/site/env";
import { isAuthorizedAdmin } from "@/lib/waitlist/admin-auth";

describe("waitlist admin auth", () => {
  beforeEach(() => {
    process.env.WAITLIST_ADMIN_API_KEY = "test-admin-key";
    resetEnvCacheForTests();
  });

  afterEach(() => {
    delete process.env.WAITLIST_ADMIN_API_KEY;
    resetEnvCacheForTests();
  });

  it("rejects missing authorization header", () => {
    const request = new Request("http://localhost/api/admin/waitlist");
    expect(isAuthorizedAdmin(request)).toBe(false);
  });

  it("accepts valid bearer token", () => {
    const request = new Request("http://localhost/api/admin/waitlist", {
      headers: { Authorization: "Bearer test-admin-key" },
    });
    expect(isAuthorizedAdmin(request)).toBe(true);
  });

  it("rejects invalid bearer token", () => {
    const request = new Request("http://localhost/api/admin/waitlist", {
      headers: { Authorization: "Bearer wrong-key" },
    });
    expect(isAuthorizedAdmin(request)).toBe(false);
  });
});
