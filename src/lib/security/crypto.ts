import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { logger } from '../logger';

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    logger.error({ error }, 'Password hashing failed');
    throw new Error('Password hashing failed');
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
    return await bcrypt.compare(password, hash);
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