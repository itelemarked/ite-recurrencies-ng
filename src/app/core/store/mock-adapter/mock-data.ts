import { inject } from '@angular/core';
import { concat, map, timer } from 'rxjs';
import {
  CollectionDriver,
  CollectionPaths,
  DocumentDriver,
  DocumentPaths,
  RawItem,
} from '../adapters/adapters.types';
import { mapMockError, MockStoreException } from './mock.error';
import { MockDatabase, stripUndefined } from './mock.utils';

// Simulated network delays, in milliseconds.
const READ_DELAY_MS = 400; // first emission of every listener (later changes arrive at once)
const WRITE_DELAY_MS = 250; // the promise of a write settles after this; listeners see it at once

// Mock paths: walked through the nested objects of MockDatabase.store.
// One entry per key: a missing key is a compile error.
const COLLECTION_PATHS: CollectionPaths = {
  recurrencies: (user) => (user ? `users/${user.uid}/recurrencies` : null),
};

const DOCUMENT_PATHS: DocumentPaths = {
  settings: (user) => (user ? `users/${user.uid}/settings` : null),
};

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

/**
 * Applies a synchronous change and notifies listeners at once (like Firestore's local write).
 * The returned promise settles after WRITE_DELAY_MS, rejecting if the change failed.
 */
function mutate(db: MockDatabase, action: () => void): Promise<void> {
  let failure: { error: unknown } | null = null;
  try {
    action();
    db.notify();
  } catch (error) {
    failure = { error };
  }

  return new Promise((resolve, reject) =>
    setTimeout(() => (failure ? reject(failure.error) : resolve()), WRITE_DELAY_MS),
  );
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

  const read = (path: string): RawItem[] =>
    Object.entries(find(path) ?? {}).map(([id, data]) => ({ id, data }));

  return {
    paths: COLLECTION_PATHS,

    watch: (path) =>
      concat(
        timer(READ_DELAY_MS).pipe(map(() => read(path))),
        db.changes$.pipe(map(() => read(path))),
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

  const read = (path: string): RawItem | null => {
    const slot = find(path);
    if (!slot) return null;
    const data = slot.parent[slot.key];
    return data === undefined || data === null ? null : { id: slot.key, data };
  };

  return {
    paths: DOCUMENT_PATHS,

    watch: (path) =>
      concat(
        timer(READ_DELAY_MS).pipe(map(() => read(path))),
        db.changes$.pipe(map(() => read(path))),
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
