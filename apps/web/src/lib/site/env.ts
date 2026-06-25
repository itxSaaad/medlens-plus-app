import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://medlens.plus"),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_CONTACT_EMAIL: z.string().email().default("hello@medlens.plus"),
  NEXT_PUBLIC_GITHUB_URL: z.string().url().default("https://github.com/itxSaaad/medlens-plus-app"),
  NEXT_PUBLIC_BRAND_NAME: z.string().default("MedLens+"),
});

const serverEnvSchema = z.object({
  WAITLIST_STORAGE_PATH: z.string().default("data/waitlist.json"),
  WAITLIST_ADMIN_API_KEY: z.string().optional(),
});

function parsePublicEnv() {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_GA4_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_GITHUB_URL: process.env.NEXT_PUBLIC_GITHUB_URL,
    NEXT_PUBLIC_BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME,
  });
}

function parseServerEnv() {
  return serverEnvSchema.parse({
    WAITLIST_STORAGE_PATH: process.env.WAITLIST_STORAGE_PATH,
    WAITLIST_ADMIN_API_KEY: process.env.WAITLIST_ADMIN_API_KEY,
  });
}

let cachedPublic: z.infer<typeof publicEnvSchema> | null = null;
let cachedServer: z.infer<typeof serverEnvSchema> | null = null;

/** @internal Test-only cache reset */
export function resetEnvCacheForTests(): void {
  cachedPublic = null;
  cachedServer = null;
}

export function getPublicEnv() {
  if (!cachedPublic) {
    cachedPublic = parsePublicEnv();
  }
  return cachedPublic;
}

export function getServerEnv() {
  if (!cachedServer) {
    cachedServer = parseServerEnv();
  }
  return cachedServer;
}

export function getSiteUrl(): string {
  return getPublicEnv().NEXT_PUBLIC_SITE_URL;
}

export function getBrandName(): string {
  return getPublicEnv().NEXT_PUBLIC_BRAND_NAME;
}

export function getContactEmail(): string {
  return getPublicEnv().NEXT_PUBLIC_CONTACT_EMAIL;
}

export function getGithubUrl(): string {
  return getPublicEnv().NEXT_PUBLIC_GITHUB_URL;
}

export function getWaitlistAdminApiKey(): string | undefined {
  const key = getServerEnv().WAITLIST_ADMIN_API_KEY;
  return key && key.length > 0 ? key : undefined;
}
