import fs from "node:fs";
import path from "node:path";
import { getServerEnv } from "@/lib/site/env";

export interface WaitlistEntry {
  email: string;
  joinedAt: string;
}

interface WaitlistData {
  entries: WaitlistEntry[];
}

function getWaitlistFile(): string {
  return path.join(process.cwd(), getServerEnv().WAITLIST_STORAGE_PATH);
}

export function ensureWaitlistFile(): void {
  const waitlistFile = getWaitlistFile();
  const dir = path.dirname(waitlistFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(waitlistFile)) {
    fs.writeFileSync(waitlistFile, JSON.stringify({ entries: [] }, null, 2));
  }
}

export function readWaitlistEntries(): WaitlistEntry[] {
  ensureWaitlistFile();
  const raw = fs.readFileSync(getWaitlistFile(), "utf-8");
  const data = JSON.parse(raw) as WaitlistData;
  return data.entries.sort(
    (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
  );
}

export function appendWaitlistEntry(email: string): void {
  ensureWaitlistFile();
  const waitlistFile = getWaitlistFile();
  const raw = fs.readFileSync(waitlistFile, "utf-8");
  const data = JSON.parse(raw) as WaitlistData;

  data.entries.push({ email, joinedAt: new Date().toISOString() });
  fs.writeFileSync(waitlistFile, JSON.stringify(data, null, 2));
}

export function waitlistEntryExists(email: string): boolean {
  return readWaitlistEntries().some((entry) => entry.email === email);
}

export function entriesToCsv(entries: WaitlistEntry[]): string {
  const header = "email,joinedAt";
  const rows = entries.map((entry) => `${entry.email},${entry.joinedAt}`);
  return [header, ...rows].join("\n");
}
