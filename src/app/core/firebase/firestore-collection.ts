import { computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  CollectionReference,
  DocumentData,
  Firestore,
  WithFieldValue
} from 'firebase/firestore';
import { Observable, tap, catchError, EMPTY, switchMap, of, map } from 'rxjs';
import { Identifiable, StoreCollection, StoreError, StoreOperation, StoreWriteOperation } from '../types/store';
import { FIRESTORE } from './firebase.config';
import { createInvalidDocumentError, createStoreError } from './firestore-error';

interface CollectionContext<T> {
  firestore: Firestore;
  path: Signal<string | null>;
  path$: Observable<string | null>;
  items: WritableSignal<Identifiable<T>[]>;
  loading: WritableSignal<boolean>;
  error: WritableSignal<StoreError | null>;
  validator?: (data: unknown) => data is T;
}

function fromOnSnapshot<T extends DocumentData>(ref: CollectionReference<T>): Observable<Identifiable<T>[]> {
  return new Observable((sub) =>
    onSnapshot(
      ref,
      (snap) => sub.next(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => sub.error(err)
    )
  );
}

function handleError<T>(ctx: CollectionContext<T>, err: unknown, op: StoreOperation, currentPath: string): void {
  console.error(`[FirestoreCollection:${currentPath}] Failed "${op}":`, err);
  ctx.error.set(createStoreError(err, op, currentPath));
}

function validateItems<T>(
  ctx: CollectionContext<T>,
  rawItems: Identifiable<T>[],
  currentPath: string
): Identifiable<T>[] {
  const validator = ctx.validator;
  if (!validator) return rawItems;

  const validItems = rawItems.filter((item) => validator(item));
  const invalidIds = rawItems
    .filter((item) => !validItems.some((validItem) => validItem.id === item.id))
    .map((item) => item.id);

  if (invalidIds.length > 0) {
    console.error(`[FirestoreCollection:${currentPath}] Invalid documents skipped:`, invalidIds);
    ctx.error.set(createInvalidDocumentError(invalidIds, currentPath));
  } else {
    ctx.error.set(null);
  }

  return validItems;
}

function runReadOperation<T extends DocumentData>(ctx: CollectionContext<T>): Observable<Identifiable<T>[]> {
  return ctx.path$.pipe(
    switchMap((currentPath) => {
      if (!currentPath) {
        ctx.items.set([]);
        ctx.loading.set(false);
        return of([]);
      }

      ctx.loading.set(true);
      ctx.error.set(null);

      return fromOnSnapshot(collection(ctx.firestore, currentPath) as CollectionReference<T>).pipe(
        map((rawItems) => validateItems(ctx, rawItems, currentPath)),
        tap((validItems) => {
          ctx.items.set(validItems);
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
  ctx: CollectionContext<T>,
  op: StoreWriteOperation,
  action: (path: string) => Promise<unknown>
): void {
  const currentPath = ctx.path();
  if (!currentPath) {
    handleError(ctx, new Error('No active collection path'), op, 'unknown');
    return;
  }

  ctx.error.set(null);
  action(currentPath).catch((err) => handleError(ctx, err, op, currentPath));
}

export function createFirestoreCollection<T extends DocumentData>(
  pathFactory: () => string | null,
  validator?: (data: unknown) => data is T
): StoreCollection<T> {
  const firestore = inject(FIRESTORE);
  const path = computed(pathFactory);

  const ctx: CollectionContext<T> = {
    firestore,
    path,
    path$: toObservable(path),
    items: signal<Identifiable<T>[]>([]),
    loading: signal(false),
    error: signal<StoreError | null>(null),
    validator
  };

  return {
    items: ctx.items.asReadonly(),
    loading: ctx.loading.asReadonly(),
    error: ctx.error.asReadonly(),

    getList: () => runReadOperation(ctx),

    addItem: (item) =>
      runWriteOperation(ctx, 'create', (p) => addDoc(collection(firestore, p) as CollectionReference<T>, item as WithFieldValue<T>)),

    updateItem: (id, changes) =>
      runWriteOperation(ctx, 'update', (p) => updateDoc(doc(firestore, p, id), changes as DocumentData)),

    deleteItem: (id) =>
      runWriteOperation(ctx, 'delete', (p) => deleteDoc(doc(firestore, p, id)))
  };
}
