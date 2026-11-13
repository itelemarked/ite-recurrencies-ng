import { computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthStore } from '../auth-store';
import {
  Identifiable,
  StoreCollection,
  StoreError,
  StoreOperation,
  StoreWriteOperation,
} from '../data-types';
import { FIRESTORE } from './firebase-config';
import { createInvalidDocumentError, createStoreError } from './firestore-error';

const COLLECTION_PATH_BUILDERS = {
  recurrencies: (userId: string | undefined) => (userId ? `users/${userId}/recurrencies` : null),
} as const;

export type FirestoreCollectionKey = keyof typeof COLLECTION_PATH_BUILDERS;

interface CollectionContext<T> {
  firestore: Firestore;
  path: Signal<string | null>;
  path$: Observable<string | null>;
  isLoading: WritableSignal<boolean>;
  readError: WritableSignal<StoreError | null>;
  writeError: WritableSignal<StoreError | null>;
  validator?: (data: unknown) => data is T;
}

function fromOnSnapshot<T extends object>(
  ref: CollectionReference<DocumentData>,
): Observable<Identifiable<T>[]> {
  return new Observable((sub) =>
    onSnapshot(
      ref,
      (snap) => sub.next(snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }))),
      (err) => sub.error(err),
    ),
  );
}

function handleError<T>(
  ctx: CollectionContext<T>,
  err: unknown,
  op: StoreOperation,
  currentPath: string,
): void {
  console.error(`[FirestoreCollection:${currentPath}] Failed "${op}":`, err);
  const storeError = createStoreError(err, op, currentPath);
  (op === 'read' ? ctx.readError : ctx.writeError).set(storeError);
}

function validateItems<T>(
  ctx: CollectionContext<T>,
  rawItems: Identifiable<T>[],
  currentPath: string,
): Identifiable<T>[] {
  const validator = ctx.validator;
  if (!validator) return rawItems;

  const validItems = rawItems.filter((item) => validator(item));
  const invalidIds = rawItems
    .filter((item) => !validItems.some((validItem) => validItem.id === item.id))
    .map((item) => item.id);

  if (invalidIds.length > 0) {
    console.error(`[FirestoreCollection:${currentPath}] Invalid documents skipped:`, invalidIds);
    ctx.readError.set(createInvalidDocumentError(invalidIds, currentPath));
  } else {
    ctx.readError.set(null);
  }

  return validItems;
}

function createItemsStream<T extends object>(
  ctx: CollectionContext<T>,
): Observable<Identifiable<T>[]> {
  return ctx.path$.pipe(
    switchMap((currentPath) => {
      if (!currentPath) {
        ctx.isLoading.set(false);
        return of([]);
      }

      ctx.isLoading.set(true);
      ctx.readError.set(null);

      return fromOnSnapshot<T>(collection(ctx.firestore, currentPath)).pipe(
        map((rawItems) => validateItems(ctx, rawItems, currentPath)),
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
  ctx: CollectionContext<T>,
  op: StoreWriteOperation,
  action: (path: string) => Promise<unknown>,
): void {
  const currentPath = ctx.path();
  if (!currentPath) {
    handleError(ctx, new Error('No active collection path'), op, 'unknown');
    return;
  }

  ctx.writeError.set(null);
  action(currentPath).catch((err) => handleError(ctx, err, op, currentPath));
}

export function createFirestoreCollection<T extends object>(
  name: FirestoreCollectionKey,
  validator?: (data: unknown) => data is T,
): StoreCollection<T> {
  const firestore = inject(FIRESTORE);
  const auth = inject(AuthStore);
  const path = computed(() => COLLECTION_PATH_BUILDERS[name](auth.user()?.uid));

  const ctx: CollectionContext<T> = {
    firestore,
    path,
    path$: toObservable(path),
    isLoading: signal(false),
    readError: signal<StoreError | null>(null),
    writeError: signal<StoreError | null>(null),
    validator,
  };

  const items = toSignal(createItemsStream(ctx), { initialValue: [] });

  return {
    items,
    isLoading: ctx.isLoading.asReadonly(),
    error: computed(() => ctx.writeError() ?? ctx.readError()),

    addItem: (item) =>
      runWriteOperation(ctx, 'create', (p) =>
        addDoc(collection(firestore, p), item as DocumentData),
      ),

    updateItem: (id, changes) =>
      runWriteOperation(ctx, 'update', (p) =>
        updateDoc(doc(firestore, p, id), changes as DocumentData),
      ),

    deleteItem: (id) =>
      runWriteOperation(ctx, 'delete', (p) => deleteDoc(doc(firestore, p, id))),
  };
}