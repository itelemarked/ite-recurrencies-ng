import { computed, inject, Injectable } from '@angular/core';
import { ADAPTERS } from './adapters';
import { AuthStore } from './auth-store';
import { StoreCollection, StoreDocument } from './data-types';
import type { FirestoreCollectionKey } from './firebase-adapter/firestore-collection';
import type { FirestoreDocumentKey } from './firebase-adapter/firestore-document';

@Injectable({ providedIn: 'root' })
export class DataStore {
  private readonly auth = inject(AuthStore);

  collection<T extends object>(
    name: FirestoreCollectionKey,
    validator?: (data: unknown) => data is T,
  ): StoreCollection<T> {
    const collection = ADAPTERS.collection<T>(name, validator);

    return {
      ...collection,
      isLoading: computed(() => this.auth.isLoading() || collection.isLoading()),
    };
  }

  document<T extends object>(
    name: FirestoreDocumentKey,
    validator?: (data: unknown) => data is T,
  ): StoreDocument<T> {
    const document = ADAPTERS.document<T>(name, validator);

    return {
      ...document,
      isLoading: computed(() => this.auth.isLoading() || document.isLoading()),
    };
  }
}