import { RateLimiterMemory } from 'rate-limiter-flexible';
import { logger } from '../logger';
import type { RateLimitResult } from '@/types/auth';

// Rate limiter for login attempts
const loginRateLimiter = new RateLimiterMemory({
  keyPrefix: 'login_fail',
  points: 5, // Number of attempts
  duration: 900, // Per 15 minutes
  blockDuration: 900, // Block for 15 minutes
});

// Rate limiter for registration
const registerRateLimiter = new RateLimiterMemory({
  keyPrefix: 'register',
  points: 3, // Number of attempts
  duration: 3600, // Per hour
  blockDuration: 3600, // Block for 1 hour
});

// Rate limiter for password reset
const passwordResetRateLimiter = new RateLimiterMemory({
  keyPrefix: 'password_reset',
  points: 3, // Number of attempts
  duration: 3600, // Per hour
  blockDuration: 3600, // Block for 1 hour
});

// Rate limiter for email verification
const emailVerificationRateLimiter = new RateLimiterMemory({
  keyPrefix: 'email_verify',
  points: 5, // Number of attempts
  duration: 3600, // Per hour
  blockDuration: 3600, // Block for 1 hour
});

/**
 * Check rate limit and return result
 */
async function checkRateLimit(
  limiter: RateLimiterMemory,
  key: string
): Promise<RateLimitResult> {
  try {
    const result = await limiter.get(key);
    
    if (result && result.remainingPoints <= 0) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(Date.now() + result.msBeforeNext).getTime()
      };
    }

    return {
      allowed: true,
      remaining: result ? result.remainingPoints - 1 : limiter.points - 1,
      resetTime: new Date(Date.now() + limiter.duration * 1000).getTime()
    };
  } catch (error) {
    logger.error({ error }, 'Rate limit check failed');
    // In case of error, allow the request but log it
    return {
      allowed: true,
      remaining: 0,
      resetTime: Date.now()
    };
  }
}

/**
 * Consume a rate limit point
 */
async function consumeRateLimit(
  limiter: RateLimiterMemory,
  key: string
): Promise<void> {
  try {
    await limiter.consume(key);
  } catch (error) {
    logger.error({ error }, 'Rate limit consumption failed');
    throw error;
  }
}

export const rateLimiters = {
  login: {
    check: (key: string) => checkRateLimit(loginRateLimiter, key),
    consume: (key: string) => consumeRateLimit(loginRateLimiter, key)
  },
  register: {
    check: (key: string) => checkRateLimit(registerRateLimiter, key),
    consume: (key: string) => consumeRateLimit(registerRateLimiter, key)
  },
  passwordReset: {
    check: (key: string) => checkRateLimit(passwordResetRateLimiter, key),
    consume: (key: string) => consumeRateLimit(passwordResetRateLimiter, key)
  },
  emailVerification: {
    check: (key: string) => checkRateLimit(emailVerificationRateLimiter, key),
    consume: (key: string) => consumeRateLimit(emailVerificationRateLimiter, key)
  }
};

/**
 * Get client IP from request
 */
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  return 'unknown';
}