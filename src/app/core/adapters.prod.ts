import { Adapters } from './adapters-types';
import { createFirebaseAuth } from './firebase-adapter/firebase-auth';
import { createFirestoreCollection } from './firebase-adapter/firestore-collection';
import { createFirestoreDocument } from './firebase-adapter/firestore-document';

/** PRODUCTION registry: Firebase only. Must never import anything from mock-adapter/. */
export const ADAPTERS: Adapters = {
  auth: createFirebaseAuth,
  collection: createFirestoreCollection,
  document: createFirestoreDocument,
};