import { StoreError, StoreOperation } from './data-types';
import { StoreErrorInfo } from './adapters.types';

export function toStoreError(
  info: StoreErrorInfo,
  operation: StoreOperation,
  collection: string,
): StoreError {
  return { ...info, operation, collection };
}

export function createInvalidDocumentError(invalidIds: string[], collection: string): StoreError {
  return {
    code: 'INVALID_DOCUMENT_FOUND',
    operation: 'read',
    collection,
    details: invalidIds.join(', '),
  };
}

/** A write was attempted while no path is available (typically: nobody is signed in). */
export function createUnauthenticatedError(
  operation: StoreOperation,
  collection: string,
): StoreError {
  return {
    code: 'UNAUTHENTICATED',
    operation,
    collection,
    details: 'no-active-path',
  };
}
