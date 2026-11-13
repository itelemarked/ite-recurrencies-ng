import { Injectable } from '@angular/core';
import { StoreCollection, StoreDocument } from './data-types';
import { createFirestoreCollection } from './firebase-adapter/firestore-collection';
import { createFirestoreDocument } from './firebase-adapter/firestore-document';

@Injectable({ providedIn: 'root' })
export class DataStore {
  collection<T extends Record<string, unknown>>(
    pathFactory: () => string | null,
    validator?: (data: unknown) => data is T,
  ): StoreCollection<T> {
    return createFirestoreCollection<T>(pathFactory, validator);
  }

  document<T extends object>(
    pathFactory: () => string | null,
    validator?: (data: unknown) => data is T,
  ): StoreDocument<T> {
    return createFirestoreDocument<T>(pathFactory, validator);
  }
}
