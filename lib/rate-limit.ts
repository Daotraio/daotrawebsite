import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasUpstashEnv = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

// In-memory fallback: only safe for local dev or a single serverless instance -
// it does NOT share state across Vercel's distributed functions. Set
// UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN in production so the real
// Upstash-backed limiter below is used instead.
const memoryHits = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = memoryHits.get(key);
  if (!entry || now > entry.resetAt) {
    memoryHits.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  entry.count += 1;
  const success = entry.count <= limit;
  return { success, remaining: Math.max(limit - entry.count, 0) };
}

const upstashLimiter = hasUpstashEnv
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "daotra:rl",
    })
  : null;

/**
 * Rate-limits a request by an arbitrary key (typically `ip:route`).
 * Default: 5 requests per 60s window.
 */
export async function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  if (upstashLimiter) {
    const result = await upstashLimiter.limit(key);
    return { success: result.success, remaining: result.remaining };
  }
  return memoryRateLimit(key, limit, windowMs);
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
