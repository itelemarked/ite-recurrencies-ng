import { Observable } from 'rxjs';
import { AuthErrorInfo, AuthUser } from '../store-auth.types';
import { CollectionKey, DocumentKey, StoreErrorCode } from '../store.types';

/**
 * CONTRACT every backend implements (firebase-adapter/, mock-adapter/).
 * Backends do only the backend-specific work. Signals, validation and error channels
 * live in store-auth.ts and store-data.ts. Write methods return a Promise that rejects
 * on failure (they never throw synchronously).
 */

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
 * Where a piece of data lives for one backend, given the signed-in user.
 * Returns null while the data is not available (typically: nobody is signed in).
 * A path that does not depend on the user simply ignores the argument.
 * The store treats the path as opaque; only the matching backend interprets it.
 */
export type PathResolver = (user: AuthUser | null) => string | null;

/** One entry per key. A missing key is a compile error. */
export type CollectionPaths = Record<CollectionKey, PathResolver>;
export type DocumentPaths = Record<DocumentKey, PathResolver>;

export interface AuthDriver {
  /** Reports the signed-in user now and on every change. Returns an unsubscribe function. */
  watch(next: (user: AuthUser | null) => void, fail: (err: unknown) => void): () => void;
  login(email: string, password: string): Promise<unknown>;
  signup(email: string, password: string): Promise<unknown>;
  logout(): Promise<unknown>;
  mapError(err: unknown): AuthErrorInfo;
}

export interface CollectionDriver {
  readonly paths: CollectionPaths;
  watch(path: string): Observable<RawItem[]>;
  add(path: string, data: object): Promise<unknown>;
  update(path: string, id: string, changes: object): Promise<unknown>;
  remove(path: string, id: string): Promise<unknown>;
  mapError(err: unknown): StoreErrorInfo;
}

export interface DocumentDriver {
  readonly paths: DocumentPaths;
  watch(path: string): Observable<RawItem | null>;
  set(path: string, data: object): Promise<unknown>;
  update(path: string, changes: object): Promise<unknown>;
  remove(path: string): Promise<unknown>;
  mapError(err: unknown): StoreErrorInfo;
}

/** What a backend provides. The factories run in an injection context. */
export interface Adapters {
  auth: () => AuthDriver;
  collection: () => CollectionDriver;
  document: () => DocumentDriver;
}
