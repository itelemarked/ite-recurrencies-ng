import { computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, Observable, of, startWith, switchMap } from 'rxjs';
import { AuthStore } from '../auth-store';
import { StoreDocument, StoreError, StoreOperation, StoreWriteOperation } from '../data-types';
import { MockDatabase } from './mock-database';
import {
  createInvalidDocumentError,
  createStoreError,
  MockStoreException,
} from './mock-store-error';

const DOCUMENT_PATH_BUILDERS = {
  settings: (userId: string | undefined) => (userId ? `users/${userId}/settings` : null),
} as const;

export type MockDocumentKey = keyof typeof DOCUMENT_PATH_BUILDERS;

interface DocumentContext<T> {
  path: Signal<string | null>;
  path$: Observable<string | null>;
  isLoading: WritableSignal<boolean>;
  readError: WritableSignal<StoreError | null>;
  writeError: WritableSignal<StoreError | null>;
  validator?: (data: unknown) => data is T;
  db: MockDatabase;
}

function resolveDocumentSlot(
  root: Record<string, unknown>,
  path: string,
): { parent: Record<string, unknown>; key: string } | null {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const key = segments[segments.length - 1];
  let current: unknown = root;

  for (const segment of segments.slice(0, -1)) {
    if (typeof current !== 'object' || current === null || !(segment in current)) {
      return null;
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === 'object' && current !== null
    ? { parent: current as Record<string, unknown>, key }
    : null;
}

function handleError<T>(
  ctx: DocumentContext<T>,
  err: unknown,
  op: StoreOperation,
  currentPath: string,
): void {
  console.error(`[MockStoreDocument:${currentPath}] Failed "${op}":`, err);
  const storeError = createStoreError(err, op, currentPath);
  (op === 'read' ? ctx.readError : ctx.writeError).set(storeError);
}

function validateItem<T>(
  ctx: DocumentContext<T>,
  rawData: unknown,
  currentPath: string,
): T | null {
  if (rawData === null || rawData === undefined) {
    ctx.readError.set(null);
    return null;
  }

  const validator = ctx.validator;
  if (!validator) return rawData as T;

  if (validator(rawData)) {
    ctx.readError.set(null);
    return rawData;
  }

  console.error(`[MockStoreDocument:${currentPath}] Invalid document skipped:`, rawData);
  ctx.readError.set(createInvalidDocumentError([currentPath], currentPath));
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

      return ctx.db.changes$.pipe(
        startWith(undefined),
        map(() => {
          ctx.isLoading.set(true);
          ctx.readError.set(null);

          const slot = resolveDocumentSlot(ctx.db.store, currentPath);
          if (!slot) {
            ctx.isLoading.set(false);
            return null;
          }

          const rawData = slot.parent[slot.key];
          const validItem = validateItem(ctx, rawData, currentPath);
          ctx.isLoading.set(false);
          return validItem;
        }),
      );
    }),
  );
}

function runWriteOperation<T>(
  ctx: DocumentContext<T>,
  op: StoreWriteOperation,
  action: (slot: { parent: Record<string, unknown>; key: string }) => void,
): void {
  const currentPath = ctx.path();
  if (!currentPath) {
    handleError(ctx, new Error('No active document path'), op, 'unknown');
    return;
  }

  const slot = resolveDocumentSlot(ctx.db.store, currentPath);
  if (!slot) {
    handleError(ctx, new MockStoreException('NOT_FOUND', 'not-found'), op, currentPath);
    return;
  }

  try {
    ctx.writeError.set(null);
    action(slot);
    ctx.db.notify();
  } catch (err) {
    handleError(ctx, err, op, currentPath);
  }
}

export function createMockStoreDocument<T extends object>(
  name: MockDocumentKey,
  validator?: (data: unknown) => data is T,
): StoreDocument<T> {
  const auth = inject(AuthStore);
  const db = inject(MockDatabase);
  const path = computed(() => DOCUMENT_PATH_BUILDERS[name](auth.user()?.uid));

  const ctx: DocumentContext<T> = {
    path,
    path$: toObservable(path),
    isLoading: signal(false),
    readError: signal<StoreError | null>(null),
    writeError: signal<StoreError | null>(null),
    validator,
    db,
  };

  const item = toSignal(createItemStream(ctx), { initialValue: null });

  return {
    item,
    isLoading: ctx.isLoading.asReadonly(),
    error: computed(() => ctx.writeError() ?? ctx.readError()),

    setDoc: (data) =>
      runWriteOperation(ctx, 'create', ({ parent, key }) => {
        const existing = parent[key];
        parent[key] =
          typeof existing === 'object' && existing !== null
            ? { ...(existing as Record<string, unknown>), ...data }
            : { ...data };
      }),

    updateDoc: (changes) =>
      runWriteOperation(ctx, 'update', ({ parent, key }) => {
        const existing = parent[key];
        if (typeof existing !== 'object' || existing === null) {
          throw new MockStoreException('NOT_FOUND', 'not-found');
        }
        parent[key] = { ...(existing as Record<string, unknown>), ...changes };
      }),

    deleteDoc: () =>
      runWriteOperation(ctx, 'delete', ({ parent, key }) => {
        delete parent[key];
      }),
  };
}