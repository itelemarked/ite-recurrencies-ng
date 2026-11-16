import { createFirebaseAuth } from '../firebase-adapter/firebase-auth';
import {
  createFirestoreCollectionDriver,
  createFirestoreDocumentDriver,
} from '../firebase-adapter/firebase-data';
import { Adapters } from './adapters.types';

/**
 * PRODUCTION registry: Firebase only, ignores BACKEND.
 * MUST NEVER import anything from mock-adapter/ (that is what keeps the mock out of the bundle).
 */
export const ADAPTERS: Adapters = {
  auth: createFirebaseAuth,
  collection: createFirestoreCollectionDriver,
  document: createFirestoreDocumentDriver,
};
