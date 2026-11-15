import { StoreErrorCode } from '../data-types';
import { StoreErrorInfo } from '../adapters.types';

export class MockStoreException extends Error {
  constructor(
    public readonly code: StoreErrorCode,
    message: string,
  ) {
    super(message);
  }
}

export function mapMockError(error: unknown): StoreErrorInfo {
  if (error instanceof MockStoreException) {
    return { code: error.code, details: error.message };
  }

  return {
    code: 'UNKNOWN_STORE_ERROR',
    details: error instanceof Error ? error.message : 'unknown-error',
  };
}
