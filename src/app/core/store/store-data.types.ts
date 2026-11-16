import { Signal } from '@angular/core';
import { Identifiable, StoreError } from './store.types';

/** Runtime check of a document. Passing one lets TypeScript infer the entity type T. */
export type Validator<T> = (data: unknown) => data is T;

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
