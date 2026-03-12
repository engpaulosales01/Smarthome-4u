const inMemory = new Map<string, { count: number; ts: number }>();

export function rateLimit(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const existing = inMemory.get(key);
  if (!existing || now - existing.ts > windowMs) {
    inMemory.set(key, { count: 1, ts: now });
    return true;
  }
  if (existing.count >= limit) return false;
  existing.count += 1;
  return true;
}
