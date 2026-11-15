import { inject } from '@angular/core';
import { map, startWith } from 'rxjs';
import { CollectionDriver, DocumentDriver } from '../adapters.types';
import { MockDatabase, stripUndefined } from './mock-database';
import { mapMockError, MockStoreException } from './mock-store-error';

// Paths are declared in adapters.config.ts. In the mock, a path like "users/{id}/recurrencies"
// is walked through the nested objects of MockDatabase.store.

type MockRecord = Record<string, unknown>;
type Slot = { parent: MockRecord; key: string };

function isRecord(value: unknown): value is MockRecord {
  return typeof value === 'object' && value !== null;
}

function splitPath(path: string): string[] {
  return path.split('/').filter(Boolean);
}

function resolveRecord(root: MockRecord, segments: string[]): MockRecord | null {
  let current: unknown = root;
  for (const segment of segments) {
    if (!isRecord(current) || !(segment in current)) return null;
    current = current[segment];
  }
  return isRecord(current) ? current : null;
}

function notFound(): MockStoreException {
  return new MockStoreException('NOT_FOUND', 'not-found');
}

/** Runs a synchronous change, notifies all listeners, and reports errors as a rejected Promise. */
function mutate(db: MockDatabase, action: () => void): Promise<void> {
  try {
    action();
    db.notify();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}

/** Must be called in an injection context. */
export function createMockCollectionDriver(): CollectionDriver {
  const db = inject(MockDatabase);

  const find = (path: string) => resolveRecord(db.store, splitPath(path));

  const require = (path: string): MockRecord => {
    const record = find(path);
    if (!record) throw notFound();
    return record;
  };

  return {
    watch: (path) =>
      db.changes$.pipe(
        startWith(undefined),
        map(() => Object.entries(find(path) ?? {}).map(([id, data]) => ({ id, data }))),
      ),

    add: (path, data) =>
      mutate(db, () => {
        require(path)[`mock-${crypto.randomUUID().slice(0, 8)}`] = stripUndefined({ ...data });
      }),

    update: (path, id, changes) =>
      mutate(db, () => {
        const record = require(path);
        const existing = record[id];
        if (!isRecord(existing)) throw notFound();
        record[id] = { ...existing, ...stripUndefined(changes) };
      }),

    // Silent success when the item does not exist, like Firestore.
    remove: (path, id) =>
      mutate(db, () => {
        delete require(path)[id];
      }),

    mapError: mapMockError,
  };
}

/** Must be called in an injection context. */
export function createMockDocumentDriver(): DocumentDriver {
  const db = inject(MockDatabase);

  const find = (path: string): Slot | null => {
    const segments = splitPath(path);
    const parent = resolveRecord(db.store, segments.slice(0, -1));
    return parent ? { parent, key: segments[segments.length - 1] } : null;
  };

  const require = (path: string): Slot => {
    const slot = find(path);
    if (!slot) throw notFound();
    return slot;
  };

  return {
    watch: (path) =>
      db.changes$.pipe(
        startWith(undefined),
        map(() => {
          const slot = find(path);
          if (!slot) return null;
          const data = slot.parent[slot.key];
          return data === undefined || data === null ? null : { id: slot.key, data };
        }),
      ),

    set: (path, data) =>
      mutate(db, () => {
        const { parent, key } = require(path);
        const existing = parent[key];
        parent[key] = { ...(isRecord(existing) ? existing : {}), ...stripUndefined(data) };
      }),

    update: (path, changes) =>
      mutate(db, () => {
        const { parent, key } = require(path);
        const existing = parent[key];
        if (!isRecord(existing)) throw notFound();
        parent[key] = { ...existing, ...stripUndefined(changes) };
      }),

    remove: (path) =>
      mutate(db, () => {
        const { parent, key } = require(path);
        delete parent[key];
      }),

    mapError: mapMockError,
  };
}
