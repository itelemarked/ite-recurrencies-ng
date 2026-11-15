import { Observable } from 'rxjs';
import { CollectionKey, DocumentKey, PathResolver } from './adapters.config';
import { AuthInterface } from './auth-types';
import { StoreErrorCode } from './data-types';

/** A document as delivered by a backend, before validation. */
export interface RawItem {
  readonly id: string;
  readonly data: unknown;
}

export interface StoreErrorInfo {
  code: StoreErrorCode;
  details: string;
}

/**
 * Everything backend-specific about a collection. Drivers never touch signals,
 * validation or StoreError: that is the job of data-store.factory.ts.
 * Write methods must return a Promise that rejects on failure (never throw synchronously).
 * The path is opaque to the data store: it comes from STORE_PATHS (adapters.config.ts)
 * and only the matching driver interprets it.
 */
export interface CollectionDriver {
  watch(path: string): Observable<RawItem[]>;
  add(path: string, data: object): Promise<unknown>;
  update(path: string, id: string, changes: object): Promise<unknown>;
  remove(path: string, id: string): Promise<unknown>;
  mapError(err: unknown): StoreErrorInfo;
}

export interface DocumentDriver {
  watch(path: string): Observable<RawItem | null>;
  set(path: string, data: object): Promise<unknown>;
  update(path: string, changes: object): Promise<unknown>;
  remove(path: string): Promise<unknown>;
  mapError(err: unknown): StoreErrorInfo;
}

/** What the active backend provides. Driver and auth factories run in an injection context. */
export interface Adapters {
  auth: () => AuthInterface;
  collectionDriver: () => CollectionDriver;
  documentDriver: () => DocumentDriver;
  /** Path resolver of a collection / document for this backend. */
  collectionPath: (key: CollectionKey) => PathResolver;
  documentPath: (key: DocumentKey) => PathResolver;
}
