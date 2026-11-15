import { Adapters } from './adapters.types';
import { Backend, BACKEND, STORE_PATHS } from './adapters.config';
import { createFirebaseAuth } from './firebase-adapter/firebase-auth';
import {
  createFirestoreCollectionDriver,
  createFirestoreDocumentDriver,
} from './firebase-adapter/firestore-driver';
import { createMockAuth } from './mock-adapter/mock-auth';
import { createMockCollectionDriver, createMockDocumentDriver } from './mock-adapter/mock-driver';

/**
 * DEVELOPMENT registry: wires the backend chosen by BACKEND (adapters.config.ts).
 * Replaced by adapters.prod.ts in production builds (see angular.json),
 * so the mock code never reaches the production bundle.
 */
type DriverSet = Pick<Adapters, 'auth' | 'collectionDriver' | 'documentDriver'>;

const DRIVERS: Record<Backend, DriverSet> = {
  firebase: {
    auth: createFirebaseAuth,
    collectionDriver: createFirestoreCollectionDriver,
    documentDriver: createFirestoreDocumentDriver,
  },
  mock: {
    auth: createMockAuth,
    collectionDriver: createMockCollectionDriver,
    documentDriver: createMockDocumentDriver,
  },
};

export const ADAPTERS: Adapters = {
  ...DRIVERS[BACKEND],
  collectionPath: (key) => STORE_PATHS.collections[key][BACKEND],
  documentPath: (key) => STORE_PATHS.documents[key][BACKEND],
};
