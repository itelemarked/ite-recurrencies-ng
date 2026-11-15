import { FirebaseError } from 'firebase/app';
import { StoreErrorInfo } from '../adapters.types';

export function mapFirestoreError(error: unknown): StoreErrorInfo {
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
