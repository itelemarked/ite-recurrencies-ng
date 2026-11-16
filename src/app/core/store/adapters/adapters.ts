import { Backend, BACKEND } from '../store.config';
import { createFirebaseAuth } from '../firebase-adapter/firebase-auth';
import {
  createFirestoreCollectionDriver,
  createFirestoreDocumentDriver,
} from '../firebase-adapter/firebase-data';
import { createMockAuth } from '../mock-adapter/mock-auth';
import { createMockCollectionDriver, createMockDocumentDriver } from '../mock-adapter/mock-data';
import { Adapters } from './adapters.types';

/**
 * DEVELOPMENT registry: wires the backend chosen by BACKEND (store.config.ts).
 * Production builds replace this file with adapters.prod.ts (angular.json, fileReplacements),
 * so the mock never reaches the release bundle.
 */
const BACKENDS: Record<Backend, Adapters> = {
  firebase: {
    auth: createFirebaseAuth,
    collection: createFirestoreCollectionDriver,
    document: createFirestoreDocumentDriver,
  },
  mock: {
    auth: createMockAuth,
    collection: createMockCollectionDriver,
    document: createMockDocumentDriver,
  },
};

export const ADAPTERS: Adapters = BACKENDS[BACKEND];
