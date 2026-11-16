import { Signal } from "@angular/core";

export type Identifiable<T> = T & {id: string}

export type StoreErrorCode =
  | 'PERMISSION_DENIED'      // [create, read, update, delete] Security rules rejected the request due to insufficient permissions.
  | 'NOT_FOUND'              // [update, delete] The targeted document does not exist in the database.
  | 'UNAVAILABLE'            // [create, read, update, delete] The database service is temporarily unreachable or offline.
  | 'UNAUTHENTICATED'        // [create, read, update, delete] The request lacks valid authentication credentials.
  | 'INVALID_DOCUMENT_FOUND' // [read] A fetched document failed runtime type validation and was skipped.
  | 'UNMAPPED_STORE_ERROR'   // [create, read, update, delete] The backend returned a known SDK error code that has not been explicitly mapped.
  | 'UNKNOWN_STORE_ERROR';   // [create, read, update, delete] An unexpected runtime exception or non-SDK error interrupted the operation.

export type StoreError = {
  code: StoreErrorCode,
  cause?: unknown
}

export interface StoreCollectionInterface<T> {
  items: Signal<T>,
  error: Signal<StoreError | null>,
  isLoading: Signal<boolean>
  addItem: (item: T) => void,
  setItem: (id: string, item: T) => void
  updateItem: (id: string, item: Partial<T>) => void
  deleteItem: (id: string) => void
}

export type StoreCollectionPath =
| 'recurrencies'
| 'todos'

export type StoreValidator<T> = (val: unknown) => val is T