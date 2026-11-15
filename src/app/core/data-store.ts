import { computed, inject, Injectable } from '@angular/core';
import { ADAPTERS } from './adapters';
import { CollectionKey, DocumentKey } from './adapters.config';
import { AuthStore } from './auth-store';
import { createStoreCollection, createStoreDocument } from './data-store.factory';
import { StoreCollection, StoreDocument } from './data-types';

@Injectable({ providedIn: 'root' })
export class DataStore {
  private readonly auth = inject(AuthStore);
  /** undefined (auth still initializing) and null (signed out) both mean "no user". */
  private readonly user = computed(() => this.auth.user() ?? null);

  /** Call from an injection context (e.g. a field initializer of a feature service). */
  collection<T extends object>(
    key: CollectionKey,
    validator?: (data: unknown) => data is T,
  ): StoreCollection<T> {
    const collection = createStoreCollection<T>(
      ADAPTERS.collectionDriver(),
      key,
      ADAPTERS.collectionPath(key),
      this.user,
      validator,
    );

    return {
      ...collection,
      isLoading: computed(() => this.auth.isLoading() || collection.isLoading()),
    };
  }

  /** Call from an injection context (e.g. a field initializer of a feature service). */
  document<T extends object>(
    key: DocumentKey,
    validator?: (data: unknown) => data is T,
  ): StoreDocument<T> {
    const document = createStoreDocument<T>(
      ADAPTERS.documentDriver(),
      key,
      ADAPTERS.documentPath(key),
      this.user,
      validator,
    );

    return {
      ...document,
      isLoading: computed(() => this.auth.isLoading() || document.isLoading()),
    };
  }
}
