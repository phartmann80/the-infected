import { appendFile, chmod, mkdir, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const EARLY_ACCESS_SCHEMA_VERSION = 1;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimit = new Map<string, { count: number; windowStartedAt: number }>();

export type EarlyAccessRegistration = {
  email: string;
  consentedAt: string;
  source: 'hero' | 'landing' | 'unknown';
  schemaVersion: number;
};

export function isEarlyAccessEnabled() {
  return process.env.EARLY_ACCESS_ENABLED === 'true';
}

export function normalizeEmail(value: unknown) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length === 0 || email.length > 254 || !EMAIL_PATTERN.test(email)) return null;
  return email;
}

export function normalizeSource(value: unknown): EarlyAccessRegistration['source'] {
  if (value === 'hero' || value === 'landing') return value;
  return 'unknown';
}

export function consumeRateLimit(key: string, now = Date.now()) {
  const current = rateLimit.get(key);
  if (!current || now - current.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimit.set(key, { count: 1, windowStartedAt: now });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

export function getStoragePath() {
  if (process.env.EARLY_ACCESS_STORAGE_PATH) return process.env.EARLY_ACCESS_STORAGE_PATH;
  if (process.env.NODE_ENV === 'production') return '/var/lib/the-infected/early-access.ndjson';
  return path.join(os.tmpdir(), 'the-infected-early-access.ndjson');
}

async function hasRegistered(storagePath: string, email: string) {
  let contents: string;
  try {
    contents = await readFile(storagePath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }

  return contents.split('\n').some((line) => {
    if (!line) return false;
    try {
      const record = JSON.parse(line) as Partial<EarlyAccessRegistration>;
      return record.email === email;
    } catch {
      return false;
    }
  });
}

export async function registerEarlyAccess(email: string, source: EarlyAccessRegistration['source']) {
  const storagePath = getStoragePath();
  const alreadyRegistered = await hasRegistered(storagePath, email);
  if (alreadyRegistered) return 'already_registered' as const;

  await mkdir(path.dirname(storagePath), { recursive: true, mode: 0o750 });
  const record: EarlyAccessRegistration = {
    email,
    consentedAt: new Date().toISOString(),
    source,
    schemaVersion: EARLY_ACCESS_SCHEMA_VERSION,
  };
  await appendFile(storagePath, `${JSON.stringify(record)}\n`, { encoding: 'utf8', flag: 'a', mode: 0o640 });
  await chmod(storagePath, 0o640);
  return 'accepted' as const;
}
