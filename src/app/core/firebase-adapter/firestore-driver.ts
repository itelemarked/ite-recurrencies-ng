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
import { CollectionDriver, DocumentDriver, RawItem } from '../adapters.types';
import { FIRESTORE } from './firebase-config';
import { mapFirestoreError } from './firestore-error';

/** Paths are declared in adapters.config.ts. Must be called in an injection context. */
export function createFirestoreCollectionDriver(): CollectionDriver {
  const firestore = inject(FIRESTORE);

  return {
    watch: (path) =>
      new Observable<RawItem[]>((sub) =>
        onSnapshot(
          collection(firestore, path),
          (snap) => sub.next(snap.docs.map((d) => ({ id: d.id, data: d.data() }))),
          (err) => sub.error(err),
        ),
      ),

    add: (path, data) => addDoc(collection(firestore, path), data as DocumentData),
    update: (path, id, changes) => updateDoc(doc(firestore, path, id), changes as DocumentData),
    remove: (path, id) => deleteDoc(doc(firestore, path, id)),

    mapError: mapFirestoreError,
  };
}

/** Paths are declared in adapters.config.ts. Must be called in an injection context. */
export function createFirestoreDocumentDriver(): DocumentDriver {
  const firestore = inject(FIRESTORE);

  return {
    watch: (path) =>
      new Observable<RawItem | null>((sub) =>
        onSnapshot(
          doc(firestore, path),
          (snap) => {
            const data = snap.data();
            sub.next(data ? { id: snap.id, data } : null);
          },
          (err) => sub.error(err),
        ),
      ),

    set: (path, data) => setDoc(doc(firestore, path), data as DocumentData, { merge: true }),
    update: (path, changes) => updateDoc(doc(firestore, path), changes as DocumentData),
    remove: (path) => deleteDoc(doc(firestore, path)),

    mapError: mapFirestoreError,
  };
}
