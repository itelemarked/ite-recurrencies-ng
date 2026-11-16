import { computed, Signal, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import { ADAPTERS } from './adapters/adapters';
import { RawItem, StoreErrorInfo } from './adapters/adapters.types';
import { AuthUser } from './store-auth.types';
import { StoreCollection, StoreDocument, Validator } from './store-data.types';
import {
  CollectionKey,
  DocumentKey,
  Identifiable,
  StoreError,
  StoreOperation,
  StoreWriteOperation,
} from './store.types';

/**
 * Collections and documents on top of the active backend (see adapters/).
 * Everything backend-independent lives here: signals, validation, the two error channels.
 *
 * Rules:
 * - The path comes from the backend's path table and depends on the user. When it becomes
 *   null (signed out) or changes (another user), items and errors are reset.
 * - Read errors and write errors are kept apart. The public `error` shows the write error
 *   first, so a later valid snapshot cannot hide it.
 * - A failed read ends the stream and the last items STAY on screen (intentional). The only
 *   warning that the data has stopped updating is `error()`: screens must show it.
 * - A write while no path is available reports UNAUTHENTICATED.
 */

// ---------------------------------------------------------------- errors

function toStoreError(info: StoreErrorInfo, operation: StoreOperation, key: string): StoreError {
  return { ...info, operation, collection: key };
}

function invalidDocumentError(invalidIds: string[], key: string): StoreError {
  return {
    code: 'INVALID_DOCUMENT_FOUND',
    operation: 'read',
    collection: key,
    details: invalidIds.join(', '),
  };
}

function unauthenticatedError(operation: StoreOperation, key: string): StoreError {
  return {
    code: 'UNAUTHENTICATED',
    operation,
    collection: key,
    details: 'no-active-path',
  };
}

// ----------------------------------------------------------- shared state

/** State shared by collections and documents. */
interface Scope {
  /** Collection or document key, used in errors and logs. */
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

function combinedError(scope: Scope): Signal<StoreError | null> {
  return computed(() => scope.writeError() ?? scope.readError());
}

/** Runs on every path change (login, logout, switch of user). */
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
  operation: StoreWriteOperation,
  action: (path: string) => Promise<unknown>,
): void {
  const path = scope.path();
  if (!path) {
    console.error(`[Store:${scope.key}] Failed "${operation}": no active path`);
    scope.writeError.set(unauthenticatedError(operation, scope.key));
    return;
  }

  scope.writeError.set(null);
  void (async () => {
    try {
      await action(path);
    } catch (err) {
      console.error(`[Store:${scope.key}] Failed "${operation}":`, err);
      scope.writeError.set(toStoreError(scope.mapError(err), operation, scope.key));
    }
  })();
}

// ------------------------------------------------------------- validation

/** Without a validator every document is accepted as it is. */
function validateItems<T extends object>(
  scope: Scope,
  raw: RawItem[],
  validator: Validator<T> | undefined,
): Identifiable<T>[] {
  const valid: Identifiable<T>[] = [];
  const invalidIds: string[] = [];

  for (const { id, data } of raw) {
    // The real id always wins over an "id" field stored in the document.
    const item = { ...(data as object), id };
    if (!validator || validator(item)) {
      valid.push(item as Identifiable<T>);
    } else {
      invalidIds.push(id);
    }
  }

  if (invalidIds.length > 0) {
    console.error(`[Store:${scope.key}] Invalid documents skipped:`, invalidIds);
    scope.readError.set(invalidDocumentError(invalidIds, scope.key));
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
  scope.readError.set(invalidDocumentError([raw.id], scope.key));
  return null;
}

// ------------------------------------------------------------------ public

/** Must be called in an injection context (uses toObservable / toSignal). */
export function createStoreCollection<T extends object>(
  key: CollectionKey,
  user: Signal<AuthUser | null>,
  validator?: Validator<T>,
): StoreCollection<T> {
  const driver = ADAPTERS.collection();
  const path = computed(() => driver.paths[key](user()));
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
          // Failed read: the stream ends and the items keep their last value (see top of file).
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

    addItem: (item) => runWrite(scope, 'create', (p) => driver.add(p, item as object)),
    updateItem: (id, changes) =>
      runWrite(scope, 'update', (p) => driver.update(p, id, changes as object)),
    deleteItem: (id) => runWrite(scope, 'delete', (p) => driver.remove(p, id)),
  };
}

/** Must be called in an injection context (uses toObservable / toSignal). */
export function createStoreDocument<T extends object>(
  key: DocumentKey,
  user: Signal<AuthUser | null>,
  validator?: Validator<T>,
): StoreDocument<T> {
  const driver = ADAPTERS.document();
  const path = computed(() => driver.paths[key](user()));
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
          // Failed read: the stream ends and the item keeps its last value (see top of file).
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

    setDoc: (data) => runWrite(scope, 'create', (p) => driver.set(p, data as object)),
    updateDoc: (changes) => runWrite(scope, 'update', (p) => driver.update(p, changes as object)),
    deleteDoc: () => runWrite(scope, 'delete', (p) => driver.remove(p)),
  };
}
