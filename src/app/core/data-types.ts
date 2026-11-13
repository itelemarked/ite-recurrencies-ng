import { Signal } from '@angular/core';

export type Identifiable<T> = T & { readonly id: string };

export type StoreWriteOperation = 'create' | 'update' | 'delete';
export type StoreOperation = 'read' | StoreWriteOperation;

export type StoreErrorCode =
  | 'PERMISSION_DENIED'      // [create, read, update, delete] Security rules rejected the request due to insufficient permissions.
  | 'NOT_FOUND'              // [update, delete] The targeted document does not exist in the database.
  | 'UNAVAILABLE'            // [create, read, update, delete] The database service is temporarily unreachable or offline.
  | 'UNAUTHENTICATED'        // [create, read, update, delete] The request lacks valid authentication credentials.
  | 'INVALID_DOCUMENT_FOUND' // [read] A fetched document failed runtime type validation and was skipped.
  | 'UNMAPPED_STORE_ERROR'   // [create, read, update, delete] The backend returned a known SDK error code that has not been explicitly mapped.
  | 'UNKNOWN_STORE_ERROR';   // [create, read, update, delete] An unexpected runtime exception or non-SDK error interrupted the operation.

export interface StoreError {
  code: StoreErrorCode;
  operation: StoreOperation;
  collection: string;
  details: string;
}

export interface StoreCollection<T> {
  readonly items: Signal<Identifiable<T>[]>;
  readonly isLoading: Signal<boolean>;
  readonly error: Signal<StoreError | null>;

  addItem(item: Omit<T, 'id'>): void;
  updateItem(id: string, changes: Partial<T>): void;
  deleteItem(id: string): void;
}

export interface StoreDocument<T> {
  readonly item: Signal<T | null>;
  readonly isLoading: Signal<boolean>;
  readonly error: Signal<StoreError | null>;

  setDoc(data: Omit<T, 'id'>): void;
  updateDoc(changes: Partial<T>): void;
  deleteDoc(): void;
}
