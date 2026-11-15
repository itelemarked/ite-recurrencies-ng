import { computed, Signal, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import { PathResolver } from './adapters.config';
import { CollectionDriver, DocumentDriver, RawItem, StoreErrorInfo } from './adapters.types';
import { AuthUser } from './auth-types';
import {
  Identifiable,
  StoreCollection,
  StoreDocument,
  StoreError,
  StoreWriteOperation,
} from './data-types';
import {
  createInvalidDocumentError,
  createUnauthenticatedError,
  toStoreError,
} from './store-errors';

type Validator<T> = (data: unknown) => data is T;

/** State and helpers shared by collections and documents. */
interface Scope {
  /** Label used in errors and logs. */
  readonly key: string;
  /** Where the data lives right now (null = not available). */
  readonly path: Signal<string | null>;
  readonly mapError: (err: unknown) => StoreErrorInfo;
  readonly isLoading: WritableSignal<boolean>;
  readonly readError: WritableSignal<StoreError | null>;
  readonly writeError: WritableSignal<StoreError | null>;
}

function createScope(
  key: string,
  path: Signal<string | null>,
  mapError: (err: unknown) => StoreErrorInfo,
): Scope {
  return {
    key,
    path,
    mapError,
    isLoading: signal(false),
    readError: signal<StoreError | null>(null),
    writeError: signal<StoreError | null>(null),
  };
}

/** Write errors take priority, so a later valid snapshot cannot hide them. */
function combinedError(scope: Scope): Signal<StoreError | null> {
  return computed(() => scope.writeError() ?? scope.readError());
}

/** Runs on every path change (login, logout, switch): nothing from before stays. */
function resetErrors(scope: Scope): void {
  scope.readError.set(null);
  scope.writeError.set(null);
}

function failRead(scope: Scope, err: unknown): void {
  console.error(`[Store:${scope.key}] Failed "read":`, err);
  scope.readError.set(toStoreError(scope.mapError(err), 'read', scope.key));
  scope.isLoading.set(false);
}

function runWrite(
  scope: Scope,
  op: StoreWriteOperation,
  action: (path: string) => Promise<unknown>,
): void {
  const path = scope.path();
  if (!path) {
    console.error(`[Store:${scope.key}] Failed "${op}": no active path`);
    scope.writeError.set(createUnauthenticatedError(op, scope.key));
    return;
  }

  scope.writeError.set(null);
  void (async () => {
    try {
      await action(path);
    } catch (err) {
      console.error(`[Store:${scope.key}] Failed "${op}":`, err);
      scope.writeError.set(toStoreError(scope.mapError(err), op, scope.key));
    }
  })();
}

function validateItems<T extends object>(
  scope: Scope,
  raw: RawItem[],
  validator: Validator<T> | undefined,
): Identifiable<T>[] {
  const valid: Identifiable<T>[] = [];
  const invalidIds: string[] = [];

  for (const { id, data } of raw) {
    const item = { ...(data as object), id };
    if (!validator || validator(item)) {
      valid.push(item as Identifiable<T>);
    } else {
      invalidIds.push(id);
    }
  }

  if (invalidIds.length > 0) {
    console.error(`[Store:${scope.key}] Invalid documents skipped:`, invalidIds);
    scope.readError.set(createInvalidDocumentError(invalidIds, scope.key));
  } else {
    scope.readError.set(null);
  }

  return valid;
}

function validateDocument<T extends object>(
  scope: Scope,
  raw: RawItem | null,
  validator: Validator<T> | undefined,
): T | null {
  if (!raw) {
    scope.readError.set(null);
    return null;
  }

  if (!validator || validator(raw.data)) {
    scope.readError.set(null);
    return raw.data as T;
  }

  console.error(`[Store:${scope.key}] Invalid document skipped (id: ${raw.id}):`, raw.data);
  scope.readError.set(createInvalidDocumentError([raw.id], scope.key));
  return null;
}

/** Must be called in an injection context (uses toObservable / toSignal). */
export function createStoreCollection<T extends object>(
  driver: CollectionDriver,
  key: string,
  pathOf: PathResolver,
  user: Signal<AuthUser | null>,
  validator?: Validator<T>,
): StoreCollection<T> {
  const path = computed(() => pathOf(user()));
  const scope = createScope(key, path, (err) => driver.mapError(err));

  const items = toSignal(
    toObservable(path).pipe(
      switchMap((currentPath) => {
        resetErrors(scope);

        if (!currentPath) {
          scope.isLoading.set(false);
          return of<Identifiable<T>[]>([]);
        }

        scope.isLoading.set(true);
        return driver.watch(currentPath).pipe(
          map((raw) => validateItems(scope, raw, validator)),
          tap(() => scope.isLoading.set(false)),
          catchError((err) => {
            failRead(scope, err);
            return EMPTY;
          }),
        );
      }),
    ),
    { initialValue: [] as Identifiable<T>[] },
  );

  return {
    items,
    isLoading: scope.isLoading.asReadonly(),
    error: combinedError(scope),

    addItem: (item) => runWrite(scope, 'create', (p) => driver.add(p, item)),
    updateItem: (id, changes) => runWrite(scope, 'update', (p) => driver.update(p, id, changes)),
    deleteItem: (id) => runWrite(scope, 'delete', (p) => driver.remove(p, id)),
  };
}

/** Must be called in an injection context (uses toObservable / toSignal). */
export function createStoreDocument<T extends object>(
  driver: DocumentDriver,
  key: string,
  pathOf: PathResolver,
  user: Signal<AuthUser | null>,
  validator?: Validator<T>,
): StoreDocument<T> {
  const path = computed(() => pathOf(user()));
  const scope = createScope(key, path, (err) => driver.mapError(err));

  const item = toSignal(
    toObservable(path).pipe(
      switchMap((currentPath) => {
        resetErrors(scope);

        if (!currentPath) {
          scope.isLoading.set(false);
          return of<T | null>(null);
        }

        scope.isLoading.set(true);
        return driver.watch(currentPath).pipe(
          map((raw) => validateDocument(scope, raw, validator)),
          tap(() => scope.isLoading.set(false)),
          catchError((err) => {
            failRead(scope, err);
            return EMPTY;
          }),
        );
      }),
    ),
    { initialValue: null as T | null },
  );

  return {
    item,
    isLoading: scope.isLoading.asReadonly(),
    error: combinedError(scope),

    setDoc: (data) => runWrite(scope, 'create', (p) => driver.set(p, data)),
    updateDoc: (changes) => runWrite(scope, 'update', (p) => driver.update(p, changes)),
    deleteDoc: () => runWrite(scope, 'delete', (p) => driver.remove(p)),
  };
}
