import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetEnvCacheForTests } from "@/lib/site/env";

// In-memory fake for @upstash/redis's sorted-set commands (zadd/zscore/zrange)
// — enough surface for waitlist storage, no real network/Upstash instance
// needed in tests.
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

const { appendWaitlistEntry, entriesToCsv, readWaitlistEntries, waitlistEntryExists } =
  await import("@/lib/waitlist/storage");

describe("waitlist storage", () => {
  beforeEach(() => {
    fakeStore.clear();
    resetEnvCacheForTests();
  });

  afterEach(() => {
    fakeStore.clear();
    resetEnvCacheForTests();
  });

  it("starts empty and appends entries", async () => {
    expect(await readWaitlistEntries()).toEqual([]);

    await appendWaitlistEntry("user@example.com");
    const entries = await readWaitlistEntries();

    expect(entries).toHaveLength(1);
    expect(entries[0]?.email).toBe("user@example.com");
    expect(await waitlistEntryExists("user@example.com")).toBe(true);
  });

  it("exports CSV with headers", async () => {
    await appendWaitlistEntry("a@example.com");
    const csv = entriesToCsv(await readWaitlistEntries());

    expect(csv.startsWith("email,joinedAt")).toBe(true);
    expect(csv).toContain("a@example.com");
  });
});
