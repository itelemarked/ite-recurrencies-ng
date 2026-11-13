import { StoreError, StoreErrorCode, StoreOperation } from '../data-types';

export class MockStoreException extends Error {
  constructor(
    public readonly code: StoreErrorCode,
    message: string,
  ) {
    super(message);
  }
}

function mapToStoreErrorCode(error: unknown): { code: StoreErrorCode; details: string } {
  if (error instanceof MockStoreException) {
    return { code: error.code, details: error.message };
  }

  return {
    code: 'UNKNOWN_STORE_ERROR',
    details: error instanceof Error ? error.message : 'unknown-error',
  };
}

export function createStoreError(
  error: unknown,
  operation: StoreOperation,
  collection: string,
): StoreError {
  return {
    ...mapToStoreErrorCode(error),
    operation,
    collection,
  };
}

export function createInvalidDocumentError(
  invalidIds: string[],
  collection: string,
): StoreError {
  return {
    code: 'INVALID_DOCUMENT_FOUND',
    operation: 'read',
    collection,
    details: invalidIds.join(', '),
  };
}
