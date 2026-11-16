export type Backend = 'firebase' | 'mock';

/**
 * Backend used by DEVELOPMENT builds (read by adapters/adapters.ts).
 * Production builds replace adapters.ts with adapters.prod.ts, which is always Firebase
 * and never reads this constant.
 */
export const BACKEND: Backend = 'mock';
