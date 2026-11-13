import { AuthInterface } from './auth-types';
import { StoreCollection, StoreDocument } from './data-types';
import type { FirestoreCollectionKey } from './firebase-adapter/firestore-collection';
import type { FirestoreDocumentKey } from './firebase-adapter/firestore-document';

export interface Adapters {
  auth: () => AuthInterface;
  collection: <T extends object>(
    name: FirestoreCollectionKey,
    validator?: (data: unknown) => data is T,
  ) => StoreCollection<T>;
  document: <T extends object>(
    name: FirestoreDocumentKey,
    validator?: (data: unknown) => data is T,
  ) => StoreDocument<T>;
}