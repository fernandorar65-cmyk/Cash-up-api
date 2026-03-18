import { randomUUID } from 'crypto';

/**
 * Genera UUID v4 (GUID).
 * Node >= 16.7: usa crypto.randomUUID().
 */
export function guid(): string {
  return randomUUID();
}

