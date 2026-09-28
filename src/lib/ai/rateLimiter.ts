import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding window cache for IP rate-limiting
const ipRateLimitStore = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 30;
const MAX_DAILY_USER_QUOTA = 100;
const MAX_INPUT_CHARS = 50_000;

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  error?: string;
  statusCode?: number;
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Checks per-IP sliding window rate limiting and optional per-user daily quota.
 */
export async function checkRateLimit(
  req: NextRequest,
  userId?: string | null
): Promise<RateLimitResult> {
  const ip = getClientIp(req);
  const now = Date.now();

  // 1. IP-based rate limiting (window of 1 minute)
  let record = ipRateLimitStore.get(ip);
  if (!record || record.resetAt <= now) {
    record = { count: 1, resetAt: now + WINDOW_MS };
    ipRateLimitStore.set(ip, record);
  } else {
    record.count += 1;
  }

  const remaining = Math.max(0, MAX_REQUESTS_PER_MINUTE - record.count);
  const resetSeconds = Math.ceil((record.resetAt - now) / 1000);

  if (record.count > MAX_REQUESTS_PER_MINUTE) {
    return {
      allowed: false,
      limit: MAX_REQUESTS_PER_MINUTE,
      remaining: 0,
      resetSeconds,
      error: `Rate limit exceeded. Please wait ${resetSeconds} seconds before requesting AI completions.`,
      statusCode: 429,
    };
  }

  // 2. User-based daily quota in PostgreSQL
  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { dailyAiCallsCount: true, lastAiCallDate: true },
      });

      if (user) {
        const todayStr = new Date().toISOString().split("T")[0];
        const lastCallStr = user.lastAiCallDate
          ? user.lastAiCallDate.toISOString().split("T")[0]
          : null;

        let currentCount = user.dailyAiCallsCount;
        if (lastCallStr !== todayStr) {
          // Reset daily count for new day
          currentCount = 0;
        }

        if (currentCount >= MAX_DAILY_USER_QUOTA) {
          return {
            allowed: false,
            limit: MAX_DAILY_USER_QUOTA,
            remaining: 0,
            resetSeconds: 86400,
            error: `Daily AI quota of ${MAX_DAILY_USER_QUOTA} requests reached. Your quota resets at midnight UTC.`,
            statusCode: 429,
          };
        }

        // Increment count
        await prisma.user.update({
          where: { id: userId },
          data: {
            dailyAiCallsCount: currentCount + 1,
            lastAiCallDate: new Date(),
          },
        });
      }
    } catch (e) {
      // Non-fatal if DB is temporarily offline or in local mode
      console.warn("User quota DB check skipped:", e);
    }
  }

  return {
    allowed: true,
    limit: MAX_REQUESTS_PER_MINUTE,
    remaining,
    resetSeconds,
  };
}

/**
 * Validates request payload size to prevent DOS / prompt inflation attacks.
 */
export function validateInputSize(content: unknown, maxChars = MAX_INPUT_CHARS): boolean {
  if (!content) return true;
  const str = typeof content === "string" ? content : JSON.stringify(content);
  return str.length <= maxChars;
}
