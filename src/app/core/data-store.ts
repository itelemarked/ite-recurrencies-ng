import { Injectable } from '@angular/core';
import { StoreCollection, StoreDocument } from './data-types';
import { createFirestoreCollection } from './firebase-adapter/firestore-collection';
import { createFirestoreDocument } from './firebase-adapter/firestore-document';
import { createMockStoreCollection } from './mock-adapter/mock-store-collection';

@Injectable({ providedIn: 'root' })
export class DataStore {
  collection<T extends object>(
    pathFactory: () => string | null,
    validator?: (data: unknown) => data is T,
  ): StoreCollection<T> {
    return createMockStoreCollection<T>(pathFactory, validator);
    // return createFirestoreCollection<T>(pathFactory, validator);
  }

  document<T extends object>(
    pathFactory: () => string | null,
    validator?: (data: unknown) => data is T,
  ): StoreDocument<T> {
    return createFirestoreDocument<T>(pathFactory, validator);
  }
}
