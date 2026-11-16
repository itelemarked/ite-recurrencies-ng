/** Names of all collections (lists of items) and documents (single items) of the store. */
export const COLLECTION_KEYS = ['recurrencies'] as const;
export const DOCUMENT_KEYS = ['settings'] as const;

export type CollectionKey = (typeof COLLECTION_KEYS)[number];
export type DocumentKey = (typeof DOCUMENT_KEYS)[number];

export type Identifiable<T> = T & { readonly id: string };

export type StoreWriteOperation = 'create' | 'update' | 'delete';
export type StoreOperation = 'read' | StoreWriteOperation;

export type StoreErrorCode =
  | 'PERMISSION_DENIED'      // [create, read, update, delete] Security rules rejected the request due to insufficient permissions.
  | 'NOT_FOUND'              // [update, delete] The targeted document does not exist in the database.
  | 'UNAVAILABLE'            // [create, read, update, delete] The database service is temporarily unreachable or offline.
  | 'UNAUTHENTICATED'        // [create, read, update, delete] No valid user: nobody is signed in, or the backend rejected the credentials.
  | 'INVALID_DOCUMENT_FOUND' // [read] A fetched document failed runtime type validation and was skipped.
  | 'UNMAPPED_STORE_ERROR'   // [create, read, update, delete] The backend returned a known SDK error code that has not been explicitly mapped.
  | 'UNKNOWN_STORE_ERROR';   // [create, read, update, delete] An unexpected runtime exception or non-SDK error interrupted the operation.

export interface StoreError {
  code: StoreErrorCode;
  operation: StoreOperation;
  /** The collection or document key, e.g. 'recurrencies'. */
  collection: string;
  details: string;
}
