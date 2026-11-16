import { computed, inject, Injectable } from '@angular/core';
import { createStoreAuth } from './store-auth';
import { AuthInterface } from './store-auth.types';
import { createStoreCollection, createStoreDocument } from './store-data';
import { StoreCollection, StoreDocument, Validator } from './store-data.types';
import { CollectionKey, DocumentKey } from './store.types';

/**
 * ENTRY POINT of the store: the only file features import (plus the types and keys they need).
 *
 *   AuthStore  user, isAuthenticated, isInitialized, isLoading, error, login(), signup(), logout()
 *   DataStore  collection(key, validator?) and document(key, validator?)
 *
 * DataStore.collection() / document() must be called in an injection context, e.g. in a field
 * initializer of a feature service:
 *
 *   private readonly recurrencies = inject(DataStore).collection('recurrencies', isRecurrence);
 *
 * The entity type is inferred from the validator (optional). Without one, write it yourself:
 * collection<Recurrence>('recurrencies').
 *
 * Adding a collection or document: see README.md. Everything else in this folder is internal.
 */

@Injectable({ providedIn: 'root' })
export class AuthStore implements AuthInterface {
  private readonly auth = createStoreAuth();

  readonly user = this.auth.user;
  readonly isLoading = this.auth.isLoading;
  readonly error = this.auth.error;

  readonly isAuthenticated = computed(() => !!this.user());
  readonly isInitialized = computed(() => this.user() !== undefined);

  login(email: string, password: string): void {
    this.auth.login(email, password);
  }

  signup(email: string, password: string): void {
    this.auth.signup(email, password);
  }

  logout(): void {
    this.auth.logout();
  }
}

@Injectable({ providedIn: 'root' })
export class DataStore {
  private readonly auth = inject(AuthStore);
  /** undefined (auth still initializing) and null (signed out) both mean "no user". */
  private readonly user = computed(() => this.auth.user() ?? null);

  collection<T extends object>(key: CollectionKey, validator?: Validator<T>): StoreCollection<T> {
    const collection = createStoreCollection<T>(key, this.user, validator);

    return {
      ...collection,
      isLoading: computed(() => this.auth.isLoading() || collection.isLoading()),
    };
  }

  document<T extends object>(key: DocumentKey, validator?: Validator<T>): StoreDocument<T> {
    const document = createStoreDocument<T>(key, this.user, validator);

    return {
      ...document,
      isLoading: computed(() => this.auth.isLoading() || document.isLoading()),
    };
  }
}
