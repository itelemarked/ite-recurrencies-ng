import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

export type Identifiable<T> = T & { id: string };

export type StoreOperation = 'read' | 'create' | 'update' | 'delete';
export type StoreWriteOperation = Exclude<StoreOperation, 'read'>;

export type StoreErrorCode =
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'UNAVAILABLE'
  | 'UNAUTHENTICATED'
  | 'INVALID_DOCUMENT_FOUND'
  | 'UNMAPPED_STORE_ERROR'
  | 'UNKNOWN_STORE_ERROR';

export interface StoreError {
  code: StoreErrorCode;
  operation: StoreOperation;
  collection: string;
  details: string;
}

export interface StoreCollection<T> {
  readonly items: Signal<Identifiable<T>[]>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<StoreError | null>;

  getList(): Observable<Identifiable<T>[]>;
  addItem(item: T): void;
  updateItem(id: string, changes: Partial<T>): void;
  deleteItem(id: string): void;
}

export interface StoreDocument<T> {
  readonly item: Signal<T | null>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<StoreError | null>;

  getDoc(): Observable<T | null>;
  setDoc(data: T): void;
  updateDoc(changes: Partial<T>): void;
  deleteDoc(): void;
}
