import { computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { AuthStore } from '../auth-store';
import {
  Identifiable,
  StoreCollection,
  StoreError,
  StoreOperation,
  StoreWriteOperation,
} from '../data-types';
import { MOCK_STORE_DATA } from './mock-store-data';
import {
  createInvalidDocumentError,
  createStoreError,
  MockStoreException,
} from './mock-store-error';

const COLLECTION_PATH_BUILDERS = {
  recurrencies: (userId: string | undefined) => (userId ? `users/${userId}/recurrencies` : null),
} as const;

export type MockCollectionKey = keyof typeof COLLECTION_PATH_BUILDERS;

interface CollectionContext<T> {
  path: Signal<string | null>;
  path$: Observable<string | null>;
  isLoading: WritableSignal<boolean>;
  error: WritableSignal<StoreError | null>;
  validator?: (data: unknown) => data is T;
  refresh$: BehaviorSubject<void>;
}

function resolveCollectionRecord(path: string): Record<string, unknown> | null {
  const segments = path.split('/').filter(Boolean);
  let current: unknown = MOCK_STORE_DATA;

  for (const segment of segments) {
    if (typeof current !== 'object' || current === null || !(segment in current)) {
      return null;
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === 'object' && current !== null
    ? (current as Record<string, unknown>)
    : null;
}

function handleError<T>(
  ctx: CollectionContext<T>,
  err: unknown,
  op: StoreOperation,
  currentPath: string,
): void {
  console.error(`[MockStoreCollection:${currentPath}] Failed "${op}":`, err);
  ctx.error.set(createStoreError(err, op, currentPath));
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
    console.error(`[MockStoreCollection:${currentPath}] Invalid documents skipped:`, invalidIds);
    ctx.error.set(createInvalidDocumentError(invalidIds, currentPath));
  } else {
    ctx.error.set(null);
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

      return ctx.refresh$.pipe(
        map(() => {
          ctx.isLoading.set(true);
          ctx.error.set(null);

          const record = resolveCollectionRecord(currentPath);
          if (!record) {
            ctx.isLoading.set(false);
            return [];
          }

          const rawItems = Object.entries(record).map(([id, data]) => ({
            id,
            ...(data as T),
          }));

          const validItems = validateItems(ctx, rawItems, currentPath);
          ctx.isLoading.set(false);
          return validItems;
        }),
      );
    }),
  );
}

function runWriteOperation<T>(
  ctx: CollectionContext<T>,
  op: StoreWriteOperation,
  action: (record: Record<string, unknown>) => void,
): void {
  const currentPath = ctx.path();
  if (!currentPath) {
    handleError(ctx, new Error('No active collection path'), op, 'unknown');
    return;
  }

  const record = resolveCollectionRecord(currentPath);
  if (!record) {
    handleError(ctx, new MockStoreException('NOT_FOUND', 'not-found'), op, currentPath);
    return;
  }

  try {
    ctx.error.set(null);
    action(record);
    ctx.refresh$.next();
  } catch (err) {
    handleError(ctx, err, op, currentPath);
  }
}

export function createMockStoreCollection<T extends object>(
  name: MockCollectionKey,
  validator?: (data: unknown) => data is T,
): StoreCollection<T> {
  const auth = inject(AuthStore);
  const path = computed(() => COLLECTION_PATH_BUILDERS[name](auth.user()?.uid));

  const ctx: CollectionContext<T> = {
    path,
    path$: toObservable(path),
    isLoading: signal(false),
    error: signal<StoreError | null>(null),
    validator,
    refresh$: new BehaviorSubject<void>(undefined),
  };

  const items = toSignal(createItemsStream(ctx), { initialValue: [] });

  return {
    items,
    isLoading: ctx.isLoading.asReadonly(),
    error: ctx.error.asReadonly(),

    addItem: (item) =>
      runWriteOperation(ctx, 'create', (record) => {
        const newId = `mock-${crypto.randomUUID().slice(0, 8)}`;
        record[newId] = { ...item };
      }),

    updateItem: (id, changes) =>
      runWriteOperation(ctx, 'update', (record) => {
        const existing = record[id];
        if (typeof existing !== 'object' || existing === null) {
          throw new MockStoreException('NOT_FOUND', 'not-found');
        }
        record[id] = { ...(existing as Record<string, unknown>), ...changes };
      }),

    deleteItem: (id) =>
      runWriteOperation(ctx, 'delete', (record) => {
        if (!(id in record)) {
          throw new MockStoreException('NOT_FOUND', 'not-found');
        }
        delete record[id];
      }),
  };
}
