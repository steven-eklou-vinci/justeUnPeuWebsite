import * as argon2 from 'argon2';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { logger } from '../logger';

/**
 * Hash a password using Argon2id (with bcrypt fallback)
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Try Argon2 first
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });
    return hash;
  } catch (error) {
    logger.warn({ error }, 'Argon2 hashing failed, falling back to bcrypt');
    
    try {
      // Fallback to bcrypt
      const saltRounds = 12;
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    } catch (fallbackError) {
      logger.error({ error: fallbackError }, 'Password hashing completely failed');
      throw new Error('Password hashing failed');
    }
  }
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    // Try Argon2 first (hashes start with $argon2)
    if (hash.startsWith('$argon2')) {
      return await argon2.verify(hash, password);
    } else {
      // Fallback to bcrypt
      return await bcrypt.compare(password, hash);
    }
  } catch (error) {
    logger.error({ error }, 'Password verification failed');
    return false;
  }
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Hash a token for storage
 */
export async function hashToken(token: string): Promise<string> {
  return hashPassword(token);
}

/**
 * Verify a token against its hash
 */
export async function verifyToken(token: string, hash: string): Promise<boolean> {
  return verifyPassword(token, hash);
}