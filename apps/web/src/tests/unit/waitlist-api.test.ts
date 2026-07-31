import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetEnvCacheForTests } from "@/lib/site/env";

const { fakeStore } = vi.hoisted(() => ({ fakeStore: new Map<string, number>() }));

/* eslint-disable @typescript-eslint/no-unused-vars -- fake mirrors the real Redis method signatures */
vi.mock("@upstash/redis", () => ({
  Redis: class FakeRedis {
    async zadd(
      _key: string,
      opts: { nx?: boolean },
      { score, member }: { score: number; member: string },
    ) {
      if (opts.nx && fakeStore.has(member)) return 0;
      fakeStore.set(member, score);
      return 1;
    }
    async zscore(_key: string, member: string) {
      return fakeStore.has(member) ? fakeStore.get(member)! : null;
    }
    async zrange(_key: string, _min: number, _max: number, _opts: { withScores?: boolean }) {
      return [...fakeStore.entries()]
        .sort((a, b) => b[1] - a[1])
        .flatMap(([member, score]) => [member, score]);
    }
  },
}));

const { POST } = await import("@/app/api/waitlist/route");
const { GET } = await import("@/app/api/admin/waitlist/route");

describe("waitlist API routes", () => {
  beforeEach(() => {
    fakeStore.clear();
    process.env.WAITLIST_ADMIN_API_KEY = "admin-secret";
    resetEnvCacheForTests();
  });

  afterEach(() => {
    fakeStore.clear();
    delete process.env.WAITLIST_ADMIN_API_KEY;
    resetEnvCacheForTests();
  });

  it("accepts valid waitlist signup", async () => {
    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "join@example.com", consent: true }),
      }),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as { message: string };
    expect(body.message).toContain("Successfully joined");
  });

  it("rejects duplicate email signup", async () => {
    const payload = {
      method: "POST" as const,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "dup@example.com", consent: true }),
    };

    await POST(new Request("http://localhost/api/waitlist", payload));
    const response = await POST(new Request("http://localhost/api/waitlist", payload));

    expect(response.status).toBe(200);
    const body = (await response.json()) as { message: string };
    expect(body.message).toContain("already on the waitlist");
  });

  it("requires consent on signup", async () => {
    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "noconsent@example.com", consent: false }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("returns 401 for admin list without key", async () => {
    const response = await GET(new Request("http://localhost/api/admin/waitlist"));
    expect(response.status).toBe(401);
  });

  it("returns entries for authorized admin", async () => {
    await POST(
      new Request("http://localhost/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin-view@example.com", consent: true }),
      }),
    );

    const response = await GET(
      new Request("http://localhost/api/admin/waitlist", {
        headers: { Authorization: "Bearer admin-secret" },
      }),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as { count: number; entries: { email: string }[] };
    expect(body.count).toBe(1);
    expect(body.entries[0]?.email).toBe("admin-view@example.com");
  });

  it("exports CSV for authorized admin", async () => {
    await POST(
      new Request("http://localhost/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "csv@example.com", consent: true }),
      }),
    );

    const response = await GET(
      new Request("http://localhost/api/admin/waitlist?format=csv", {
        headers: { Authorization: "Bearer admin-secret" },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/csv");
    const text = await response.text();
    expect(text).toContain("email,joinedAt");
    expect(text).toContain("csv@example.com");
  });
});
