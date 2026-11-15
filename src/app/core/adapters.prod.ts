import { Adapters } from './adapters.types';
import { STORE_PATHS } from './adapters.config';
import { createFirebaseAuth } from './firebase-adapter/firebase-auth';
import {
  createFirestoreCollectionDriver,
  createFirestoreDocumentDriver,
} from './firebase-adapter/firestore-driver';

/**
 * PRODUCTION registry: Firebase only, ignores BACKEND.
 * Must never import anything from mock-adapter/.
 */
export const ADAPTERS: Adapters = {
  auth: createFirebaseAuth,
  collectionDriver: createFirestoreCollectionDriver,
  documentDriver: createFirestoreDocumentDriver,
  collectionPath: (key) => STORE_PATHS.collections[key].firebase,
  documentPath: (key) => STORE_PATHS.documents[key].firebase,
};
