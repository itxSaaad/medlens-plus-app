import { Redis } from "@upstash/redis";
import { getServerEnv } from "@/lib/site/env";

// Upstash Redis (REST, HTTP-based — works from any Vercel serverless/edge
// function, no persistent connection needed) backs waitlist signups until a
// real relational store exists. This is the same Upstash Redis instance the
// rest of the architecture already plans to use for caching/idempotency (see
// docs/02-architecture/02-STACK_DECISIONS.md), just a different key
// namespace — not a new service. Entries live in a sorted set keyed by
// lowercased email, scored by join time (epoch ms), which gives dedup
// (ZADD NX), existence checks (ZSCORE), and chronological order (ZRANGE) for
// free without a read-modify-write race. Move to Supabase once the real
// tenant/report schema exists; this key can be migrated wholesale then.

export interface WaitlistEntry {
  email: string;
  joinedAt: string;
}

const WAITLIST_KEY = "medlens:waitlist:entries";

let cachedClient: Redis | null = null;

function getRedisClient(): Redis {
  if (!cachedClient) {
    const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = getServerEnv();
    cachedClient = new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN });
  }
  return cachedClient;
}

/** @internal Test-only cache reset (mirrors resetEnvCacheForTests) */
export function resetWaitlistClientForTests(): void {
  cachedClient = null;
}

export async function readWaitlistEntries(): Promise<WaitlistEntry[]> {
  const redis = getRedisClient();
  const raw = await redis.zrange<(string | number)[]>(WAITLIST_KEY, 0, -1, {
    withScores: true,
    rev: true,
  });

  const entries: WaitlistEntry[] = [];
  for (let i = 0; i < raw.length; i += 2) {
    const email = String(raw[i]);
    const joinedAtMs = Number(raw[i + 1]);
    entries.push({ email, joinedAt: new Date(joinedAtMs).toISOString() });
  }
  return entries;
}

export async function appendWaitlistEntry(email: string): Promise<void> {
  const redis = getRedisClient();
  // NX: only set if not already a member, so a retried/duplicate request
  // can't overwrite the original join date — replaces the old
  // check-then-append pattern with one atomic call.
  await redis.zadd(WAITLIST_KEY, { nx: true }, { score: Date.now(), member: email });
}

export async function waitlistEntryExists(email: string): Promise<boolean> {
  const redis = getRedisClient();
  const score = await redis.zscore(WAITLIST_KEY, email);
  return score !== null;
}

export function entriesToCsv(entries: WaitlistEntry[]): string {
  const header = "email,joinedAt";
  const rows = entries.map((entry) => `${entry.email},${entry.joinedAt}`);
  return [header, ...rows].join("\n");
}
