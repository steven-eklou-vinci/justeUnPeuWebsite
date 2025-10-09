// Simple logger to avoid worker threads issues in Next.js dev mode
const isDev = process.env.NODE_ENV === 'development';

// Redact sensitive information
const redactSensitive = (obj: any) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const sensitiveKeys = ['password', 'passwordHash', 'token', 'tokenHash', 'authorization', 'cookie', 'set-cookie'];
  const redacted = { ...obj };
  
  for (const key of sensitiveKeys) {
    if (key in redacted) {
      redacted[key] = '[REDACTED]';
    }
  }
  
  return redacted;
};

export const logger = {
  info: (obj: any, msg?: string) => {
    if (isDev) {
      const safe = redactSensitive(obj);
      console.log(`[INFO] ${msg || ''}`, typeof safe === 'object' ? JSON.stringify(safe, null, 2) : safe);
    }
  },
  
  error: (obj: any, msg?: string) => {
    const safe = redactSensitive(obj);
    console.error(`[ERROR] ${msg || ''}`, typeof safe === 'object' ? JSON.stringify(safe, null, 2) : safe);
  },
  
  warn: (obj: any, msg?: string) => {
    if (isDev) {
      const safe = redactSensitive(obj);
      console.warn(`[WARN] ${msg || ''}`, typeof safe === 'object' ? JSON.stringify(safe, null, 2) : safe);
    }
  },
  
  debug: (obj: any, msg?: string) => {
    if (isDev) {
      const safe = redactSensitive(obj);
      console.debug(`[DEBUG] ${msg || ''}`, typeof safe === 'object' ? JSON.stringify(safe, null, 2) : safe);
    }
  }
};

export default logger;