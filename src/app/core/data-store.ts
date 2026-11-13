import { computed, inject, Injectable } from '@angular/core';
import { AuthStore } from './auth-store';
import { StoreCollection, StoreDocument } from './data-types';
import {
  createFirestoreCollection,
  FirestoreCollectionKey,
} from './firebase-adapter/firestore-collection';
import {
  createFirestoreDocument,
  FirestoreDocumentKey,
} from './firebase-adapter/firestore-document';
import { createMockStoreCollection } from './mock-adapter/mock-store-collection';
import { createMockStoreDocument } from './mock-adapter/mock-store-document';


const ADAPTERS = {
  firebase: {
    collection: createFirestoreCollection,
    document: createFirestoreDocument,
  },
  mock: {
    collection: createMockStoreCollection,
    document: createMockStoreDocument,
  },
};

const ACTIVE_ADAPTER = ADAPTERS['mock']


@Injectable({ providedIn: 'root' })
export class DataStore {
  private readonly auth = inject(AuthStore);

  collection<T extends object>(
    name: FirestoreCollectionKey,
    validator?: (data: unknown) => data is T,
  ): StoreCollection<T> {
    const collection = ACTIVE_ADAPTER.collection<T>(name, validator);

    return {
      ...collection,
      isLoading: computed(() => this.auth.isLoading() || collection.isLoading()),
    };
  }

  document<T extends object>(
    name: FirestoreDocumentKey,
    validator?: (data: unknown) => data is T,
  ): StoreDocument<T> {
    const document = ACTIVE_ADAPTER.document<T>(name, validator);

    return {
      ...document,
      isLoading: computed(() => this.auth.isLoading() || document.isLoading()),
    };
  }
}
