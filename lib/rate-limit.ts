import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// The website's own first layer of throttling, in front of Daotra's per-address
// limits (which are the authoritative ones — they live beside the accounts).
//
// The client address comes from lib/request-guards.ts (`clientIp`), which reads
// Cloudflare's CF-Connecting-IP only — X-Forwarded-For is caller-controlled.

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// One Upstash limiter per (limit, window): the algorithm's parameters are fixed
// when a limiter is built, so a single shared one would apply its own numbers to
// every caller whatever they asked for.
const limiters = new Map<string, Ratelimit>();

function upstashLimiter(limit: number, windowMs: number): Ratelimit | null {
  if (!redis) return null;
  const id = `${limit}:${windowMs}`;
  let limiter = limiters.get(id);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${Math.max(1, Math.round(windowMs / 1000))} s`),
      prefix: `daotra:rl:${id}`,
    });
    limiters.set(id, limiter);
  }
  return limiter;
}

// In-memory fallback: per isolate only — on Cloudflare Workers each isolate has
// its own copy, so it is a best effort, not a limit. Set UPSTASH_REDIS_REST_URL /
// UPSTASH_REDIS_REST_TOKEN where it matters. Expired entries are swept so the map
// cannot grow without bound.
const memoryHits = new Map<string, { count: number; resetAt: number }>();
const MAX_MEMORY_KEYS = 10_000;

function memoryRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (memoryHits.size >= MAX_MEMORY_KEYS) {
    for (const [stored, entry] of memoryHits) if (now > entry.resetAt) memoryHits.delete(stored);
    if (memoryHits.size >= MAX_MEMORY_KEYS) memoryHits.clear();
  }
  const entry = memoryHits.get(key);
  if (!entry || now > entry.resetAt) {
    memoryHits.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  entry.count += 1;
  const success = entry.count <= limit;
  return { success, remaining: Math.max(limit - entry.count, 0) };
}

/**
 * Rate-limits a request by an arbitrary key (typically `route:ip`), at the
 * caller's own limit and window. Default: 5 requests per 60 s.
 */
export async function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const limiter = upstashLimiter(limit, windowMs);
  if (limiter) {
    const result = await limiter.limit(key);
    return { success: result.success, remaining: result.remaining };
  }
  return memoryRateLimit(key, limit, windowMs);
}
