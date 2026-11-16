import { StoreErrorInfo } from '../adapters/adapters.types';
import { StoreErrorCode } from '../store.types';

export class MockStoreException extends Error {
  constructor(
    public readonly code: StoreErrorCode,
    message: string,
  ) {
    super(message);
  }
}

/** Mock errors -> store error codes. */
export function mapMockError(error: unknown): StoreErrorInfo {
  if (error instanceof MockStoreException) {
    return { code: error.code, details: error.message };
  }

  return {
    code: 'UNKNOWN_STORE_ERROR',
    details: error instanceof Error ? error.message : 'unknown-error',
  };
}
