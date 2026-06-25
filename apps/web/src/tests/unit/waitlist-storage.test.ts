import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resetEnvCacheForTests } from "@/lib/site/env";
import {
  appendWaitlistEntry,
  entriesToCsv,
  readWaitlistEntries,
  waitlistEntryExists,
} from "@/lib/waitlist/storage";

describe("waitlist storage", () => {
  let tempDir: string;
  let tempFile: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "waitlist-test-"));
    tempFile = path.join(tempDir, "waitlist.json");
    process.env.WAITLIST_STORAGE_PATH = tempFile;
    resetEnvCacheForTests();
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    delete process.env.WAITLIST_STORAGE_PATH;
    resetEnvCacheForTests();
  });

  it("starts empty and appends entries", () => {
    expect(readWaitlistEntries()).toEqual([]);

    appendWaitlistEntry("user@example.com");
    const entries = readWaitlistEntries();

    expect(entries).toHaveLength(1);
    expect(entries[0]?.email).toBe("user@example.com");
    expect(waitlistEntryExists("user@example.com")).toBe(true);
  });

  it("exports CSV with headers", () => {
    appendWaitlistEntry("a@example.com");
    const csv = entriesToCsv(readWaitlistEntries());

    expect(csv.startsWith("email,joinedAt")).toBe(true);
    expect(csv).toContain("a@example.com");
  });
});
