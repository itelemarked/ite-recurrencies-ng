import { Adapters } from './adapters-types';
import { createFirebaseAuth } from './firebase-adapter/firebase-auth';
import { createFirestoreCollection } from './firebase-adapter/firestore-collection';
import { createFirestoreDocument } from './firebase-adapter/firestore-document';
import { createMockAuth } from './mock-adapter/mock-auth';
import { createMockStoreCollection } from './mock-adapter/mock-store-collection';
import { createMockStoreDocument } from './mock-adapter/mock-store-document';

/**
 * DEVELOPMENT registry. Auth and data always use the same backend.
 * Replaced by adapters.prod.ts in production builds (see angular.json),
 * so the mock code and its data never reach the production bundle.
 */
const BACKEND: 'firebase' | 'mock' = 'mock';

const BACKENDS: Record<'firebase' | 'mock', Adapters> = {
  firebase: {
    auth: createFirebaseAuth,
    collection: createFirestoreCollection,
    document: createFirestoreDocument,
  },
  mock: {
    auth: createMockAuth,
    collection: createMockStoreCollection,
    document: createMockStoreDocument,
  },
};

export const ADAPTERS: Adapters = BACKENDS[BACKEND];