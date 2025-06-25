import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export function createRateLimiter({ window = 60, limit = 1 } = {}) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(limit, `${window}s`),
    analytics: true,
  });
}

export async function checkRateLimit({
  ratelimit,
  identifier,
  retryAfterSeconds = 30,
}: {
  ratelimit: Ratelimit;
  identifier: string;
  retryAfterSeconds?: number;
}) {
  const { success, reset } = await ratelimit.limit(identifier);
  if (!success) {
    return {
      limited: true,
      retryAfter: retryAfterSeconds,
      reset,
    };
  }
  return { limited: false };
}
