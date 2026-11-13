import { FirebaseError } from 'firebase/app';
import { StoreError, StoreErrorCode, StoreOperation } from '../data-types';

function mapToStoreErrorCode(error: unknown): { code: StoreErrorCode; details: string } {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'permission-denied':
        return { code: 'PERMISSION_DENIED', details: error.code };
      case 'not-found':
        return { code: 'NOT_FOUND', details: error.code };
      case 'unavailable':
        return { code: 'UNAVAILABLE', details: error.code };
      case 'unauthenticated':
        return { code: 'UNAUTHENTICATED', details: error.code };
      default:
        return { code: 'UNMAPPED_STORE_ERROR', details: error.code };
    }
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
