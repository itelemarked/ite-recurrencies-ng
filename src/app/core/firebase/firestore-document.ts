import { computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  DocumentData,
  Firestore,
  WithFieldValue
} from 'firebase/firestore';
import { Observable, tap, catchError, EMPTY, switchMap, of, map } from 'rxjs';
import { StoreDocument, StoreError, StoreOperation, StoreWriteOperation } from '../types/store';
import { FIRESTORE } from './firebase.config';
import { createInvalidDocumentError, createStoreError } from './firestore-error';

interface DocumentContext<T> {
  firestore: Firestore;
  path: Signal<string | null>;
  path$: Observable<string | null>;
  item: WritableSignal<T | null>;
  loading: WritableSignal<boolean>;
  error: WritableSignal<StoreError | null>;
  validator?: (data: unknown) => data is T;
}

function fromOnSnapshot<T extends DocumentData>(ref: DocumentReference<T>): Observable<{ id: string; data: T } | null> {
  return new Observable((sub) =>
    onSnapshot(
      ref,
      (snap) => {
        const data = snap.data();
        sub.next(data ? { id: snap.id, data } : null);
      },
      (err) => sub.error(err)
    )
  );
}

function handleError<T>(ctx: DocumentContext<T>, err: unknown, op: StoreOperation, currentPath: string): void {
  console.error(`[FirestoreDocument:${currentPath}] Failed "${op}":`, err);
  ctx.error.set(createStoreError(err, op, currentPath));
}

function validateItem<T>(
  ctx: DocumentContext<T>,
  rawSnap: { id: string; data: T } | null,
  currentPath: string
): T | null {
  if (!rawSnap) {
    ctx.error.set(null);
    return null;
  }

  const validator = ctx.validator;
  if (!validator) return rawSnap.data;

  if (validator(rawSnap.data)) {
    ctx.error.set(null);
    return rawSnap.data;
  }

  console.error(`[FirestoreDocument:${currentPath}] Invalid document skipped (id: ${rawSnap.id}):`, rawSnap.data);
  ctx.error.set(createInvalidDocumentError([rawSnap.id], currentPath));
  return null;
}

function runReadOperation<T extends DocumentData>(ctx: DocumentContext<T>): Observable<T | null> {
  return ctx.path$.pipe(
    switchMap((currentPath) => {
      if (!currentPath) {
        ctx.item.set(null);
        ctx.loading.set(false);
        return of(null);
      }

      ctx.loading.set(true);
      ctx.error.set(null);

      return fromOnSnapshot(doc(ctx.firestore, currentPath) as DocumentReference<T>).pipe(
        map((rawSnap) => validateItem(ctx, rawSnap, currentPath)),
        tap((validItem) => {
          ctx.item.set(validItem);
          ctx.loading.set(false);
        }),
        catchError((err) => {
          handleError(ctx, err, 'read', currentPath);
          ctx.loading.set(false);
          return EMPTY;
        })
      );
    })
  );
}

function runWriteOperation<T>(
  ctx: DocumentContext<T>,
  op: StoreWriteOperation,
  action: (ref: DocumentReference<T>) => Promise<unknown>
): void {
  const currentPath = ctx.path();
  if (!currentPath) {
    handleError(ctx, new Error('No active document path'), op, 'unknown');
    return;
  }

  ctx.error.set(null);
  const docRef = doc(ctx.firestore, currentPath) as DocumentReference<T>;
  action(docRef).catch((err) => handleError(ctx, err, op, currentPath));
}

export function createFirestoreDocument<T extends DocumentData>(
  pathFactory: () => string | null,
  validator?: (data: unknown) => data is T
): StoreDocument<T> {
  const firestore = inject(FIRESTORE);
  const path = computed(pathFactory);

  const ctx: DocumentContext<T> = {
    firestore,
    path,
    path$: toObservable(path),
    item: signal<T | null>(null),
    loading: signal(false),
    error: signal<StoreError | null>(null),
    validator
  };

  return {
    item: ctx.item.asReadonly(),
    loading: ctx.loading.asReadonly(),
    error: ctx.error.asReadonly(),

    getDoc: () => runReadOperation(ctx),
    setDoc: (data) => runWriteOperation(ctx, 'create', (ref) => setDoc(ref, data as WithFieldValue<T>, { merge: true })),
    updateDoc: (changes) => runWriteOperation(ctx, 'update', (ref) => updateDoc(ref, changes as DocumentData)),
    deleteDoc: () => runWriteOperation(ctx, 'delete', (ref) => deleteDoc(ref))
  };
}
