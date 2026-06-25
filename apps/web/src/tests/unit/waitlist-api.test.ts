import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resetEnvCacheForTests } from "@/lib/site/env";
import { POST } from "@/app/api/waitlist/route";
import { GET } from "@/app/api/admin/waitlist/route";

describe("waitlist API routes", () => {
  let tempDir: string;
  let tempFile: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "waitlist-api-"));
    tempFile = path.join(tempDir, "waitlist.json");
    process.env.WAITLIST_STORAGE_PATH = tempFile;
    process.env.WAITLIST_ADMIN_API_KEY = "admin-secret";
    resetEnvCacheForTests();
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    delete process.env.WAITLIST_STORAGE_PATH;
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
