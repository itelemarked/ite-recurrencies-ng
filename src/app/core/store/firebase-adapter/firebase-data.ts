import { inject } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import {
  CollectionDriver,
  CollectionPaths,
  DocumentDriver,
  DocumentPaths,
  RawItem,
} from '../adapters/adapters.types';
import { FIRESTORE } from './firebase.config';
import { mapFirestoreError } from './firebase.error';

// Firestore paths. One entry per key: a missing key is a compile error.
// A path outside users/{uid}/ also needs its own Security Rule (Firebase console).
const COLLECTION_PATHS: CollectionPaths = {
  recurrencies: (user) => (user ? `users/${user.uid}/recurrencies` : null),
};

const DOCUMENT_PATHS: DocumentPaths = {
  settings: (user) => (user ? `users/${user.uid}/settings/SETTINGS_UID` : null),
};

/** Must be called in an injection context. */
export function createFirestoreCollectionDriver(): CollectionDriver {
  const firestore = inject(FIRESTORE);

  return {
    paths: COLLECTION_PATHS,

    watch: (path) =>
      new Observable<RawItem[]>((subscriber) =>
        onSnapshot(
          collection(firestore, path),
          (snap) => subscriber.next(snap.docs.map((d) => ({ id: d.id, data: d.data() }))),
          (err) => subscriber.error(err),
        ),
      ),

    add: (path, data) => addDoc(collection(firestore, path), data as DocumentData),
    update: (path, id, changes) => updateDoc(doc(firestore, path, id), changes as DocumentData),
    remove: (path, id) => deleteDoc(doc(firestore, path, id)),

    mapError: mapFirestoreError,
  };
}

/** Must be called in an injection context. */
export function createFirestoreDocumentDriver(): DocumentDriver {
  const firestore = inject(FIRESTORE);

  return {
    paths: DOCUMENT_PATHS,

    watch: (path) =>
      new Observable<RawItem | null>((subscriber) =>
        onSnapshot(
          doc(firestore, path),
          (snap) => {
            const data = snap.data();
            subscriber.next(data ? { id: snap.id, data } : null);
          },
          (err) => subscriber.error(err),
        ),
      ),

    set: (path, data) => setDoc(doc(firestore, path), data as DocumentData, { merge: true }),
    update: (path, changes) => updateDoc(doc(firestore, path), changes as DocumentData),
    remove: (path) => deleteDoc(doc(firestore, path)),

    mapError: mapFirestoreError,
  };
}
