import { AuthUser } from './auth-types';

export type Backend = 'firebase' | 'mock';

/**
 * Where a piece of data lives for one backend, given the current user.
 * Returns null when the data is not available (typically: nobody is signed in).
 * The data store treats the result as opaque; only the matching driver interprets it.
 */
export type PathResolver = (user: AuthUser | null) => string | null;

/**
 * Active backend in DEVELOPMENT (read by adapters.ts).
 * Production builds swap adapters.ts for adapters.prod.ts, which is always Firebase
 * and ignores this constant.
 */
export const BACKEND: Backend = 'mock';

type PathsByBackend = Record<Backend, PathResolver>;

/**
 * THE place that declares the structure of the store: one entry per collection / document,
 * with an explicit path per backend. A path function receives the signed-in user (or null)
 * and returns the location, or null while the data is not available.
 * A path that does not depend on the user simply ignores the argument.
 *
 * Adding a new entry is a one-place change here; adding a backend to `Backend` makes every
 * entry that lacks it a compile error.
 */
export const STORE_PATHS = {
  collections: {
    recurrencies: {
      firebase: (user) => (user ? `users/${user.uid}/recurrencies` : null),
      mock: (user) => (user ? `users/${user.uid}/recurrencies` : null),
    },
  },
  documents: {
    settings: {
      firebase: (user) => (user ? `users/${user.uid}/settings/SETTINGS_UID` : null),
      mock: (user) => (user ? `users/${user.uid}/settings` : null),
    },
  },
} satisfies {
  collections: Record<string, PathsByBackend>;
  documents: Record<string, PathsByBackend>;
};

export type CollectionKey = keyof typeof STORE_PATHS.collections;
export type DocumentKey = keyof typeof STORE_PATHS.documents;
