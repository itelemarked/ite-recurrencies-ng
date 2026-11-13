import { computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthStore } from '../auth-store';
import { StoreDocument, StoreError, StoreOperation, StoreWriteOperation } from '../data-types';
import { FIRESTORE } from './firebase-config';
import { createInvalidDocumentError, createStoreError } from './firestore-error';

const DOCUMENT_PATH_BUILDERS = {
  settings: (userId: string | undefined) => (userId ? `users/${userId}/settings/SETTINGS_UID` : null),
} as const;

export type FirestoreDocumentKey = keyof typeof DOCUMENT_PATH_BUILDERS;

interface DocumentContext<T> {
  firestore: Firestore;
  path: Signal<string | null>;
  path$: Observable<string | null>;
  isLoading: WritableSignal<boolean>;
  readError: WritableSignal<StoreError | null>;
  writeError: WritableSignal<StoreError | null>;
  validator?: (data: unknown) => data is T;
}

function fromOnSnapshot<T extends object>(
  ref: DocumentReference<DocumentData>,
): Observable<{ id: string; data: T } | null> {
  return new Observable((sub) =>
    onSnapshot(
      ref,
      (snap) => {
        const data = snap.data();
        sub.next(data ? { id: snap.id, data: data as T } : null);
      },
      (err) => sub.error(err),
    ),
  );
}

function handleError<T>(
  ctx: DocumentContext<T>,
  err: unknown,
  op: StoreOperation,
  currentPath: string,
): void {
  console.error(`[FirestoreDocument:${currentPath}] Failed "${op}":`, err);
  const storeError = createStoreError(err, op, currentPath);
  (op === 'read' ? ctx.readError : ctx.writeError).set(storeError);
}

function validateItem<T>(
  ctx: DocumentContext<T>,
  rawSnap: { id: string; data: T } | null,
  currentPath: string,
): T | null {
  if (!rawSnap) {
    ctx.readError.set(null);
    return null;
  }

  const validator = ctx.validator;
  if (!validator) return rawSnap.data;

  if (validator(rawSnap.data)) {
    ctx.readError.set(null);
    return rawSnap.data;
  }

  console.error(
    `[FirestoreDocument:${currentPath}] Invalid document skipped (id: ${rawSnap.id}):`,
    rawSnap.data,
  );
  ctx.readError.set(createInvalidDocumentError([rawSnap.id], currentPath));
  return null;
}

function createItemStream<T extends object>(
  ctx: DocumentContext<T>,
): Observable<T | null> {
  return ctx.path$.pipe(
    switchMap((currentPath) => {
      if (!currentPath) {
        ctx.isLoading.set(false);
        return of(null);
      }

      ctx.isLoading.set(true);
      ctx.readError.set(null);

      return fromOnSnapshot<T>(doc(ctx.firestore, currentPath)).pipe(
        map((rawSnap) => validateItem(ctx, rawSnap, currentPath)),
        tap(() => ctx.isLoading.set(false)),
        catchError((err) => {
          handleError(ctx, err, 'read', currentPath);
          ctx.isLoading.set(false);
          return EMPTY;
        }),
      );
    }),
  );
}

function runWriteOperation<T>(
  ctx: DocumentContext<T>,
  op: StoreWriteOperation,
  action: (ref: DocumentReference<DocumentData>) => Promise<unknown>,
): void {
  const currentPath = ctx.path();
  if (!currentPath) {
    handleError(ctx, new Error('No active document path'), op, 'unknown');
    return;
  }

  ctx.writeError.set(null);
  const docRef = doc(ctx.firestore, currentPath);
  action(docRef).catch((err) => handleError(ctx, err, op, currentPath));
}

export function createFirestoreDocument<T extends object>(
  name: FirestoreDocumentKey,
  validator?: (data: unknown) => data is T,
): StoreDocument<T> {
  const firestore = inject(FIRESTORE);
  const auth = inject(AuthStore);
  const path = computed(() => DOCUMENT_PATH_BUILDERS[name](auth.user()?.uid));

  const ctx: DocumentContext<T> = {
    firestore,
    path,
    path$: toObservable(path),
    isLoading: signal(false),
    readError: signal<StoreError | null>(null),
    writeError: signal<StoreError | null>(null),
    validator,
  };

  const item = toSignal(createItemStream(ctx), { initialValue: null });

  return {
    item,
    isLoading: ctx.isLoading.asReadonly(),
    error: computed(() => ctx.writeError() ?? ctx.readError()),

    setDoc: (data) =>
      runWriteOperation(ctx, 'create', (ref) =>
        setDoc(ref, data as DocumentData, { merge: true }),
      ),
    updateDoc: (changes) =>
      runWriteOperation(ctx, 'update', (ref) => updateDoc(ref, changes as DocumentData)),
    deleteDoc: () => runWriteOperation(ctx, 'delete', (ref) => deleteDoc(ref)),
  };
}