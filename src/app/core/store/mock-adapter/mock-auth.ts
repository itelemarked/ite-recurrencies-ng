import { inject } from '@angular/core';
import { AuthDriver } from '../adapters/adapters.types';
import { AuthErrorCode, AuthErrorInfo, AuthUser } from '../store-auth.types';
import { MockDatabase } from './mock.utils';

// Simulated network delays, in milliseconds.
const READ_DELAY_MS = 200; // startup check: restoring the saved user
const WRITE_DELAY_MS = 300; // login, signup, logout

/** localStorage key of the signed-in user. Only the uid is saved, never any data. */
const STORAGE_KEY = 'mock-user-uid';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class MockAuthException extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
  ) {
    super(message);
  }
}

/** Mock auth errors -> auth error codes. */
function mapAuthError(error: unknown): AuthErrorInfo {
  if (error instanceof MockAuthException) {
    return { code: error.code, details: error.message };
  }

  return {
    code: 'UNKNOWN_AUTH_ERROR',
    details: error instanceof Error ? error.message : 'unknown-error',
  };
}

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// localStorage can be unavailable or full: the mock then simply starts signed out.
function readSavedUid(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveUid(uid: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, uid);
  } catch {
    /* storage unavailable: nothing to save */
  }
}

function clearSavedUid(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable: nothing to clear */
  }
}

type UserRecords = Record<string, Record<string, unknown>>;

function usersOf(data: Record<string, unknown>): UserRecords {
  const users = data['users'];
  return typeof users === 'object' && users !== null ? (users as UserRecords) : {};
}

/** Must be called in an injection context. */
export function createMockAuth(): AuthDriver {
  const db = inject(MockDatabase);
  const listeners = new Set<(user: AuthUser | null) => void>();
  const emit = (user: AuthUser | null): void => listeners.forEach((listener) => listener(user));

  /** The saved user, if it still exists. Users created by signup do not survive a reload
   * (the mock data resets), so they start signed out. */
  function restoreSavedUser(): AuthUser | null {
    const uid = readSavedUid();
    if (!uid) return null;

    const entry = usersOf(db.auth)[uid];
    if (!entry) {
      clearSavedUid();
      return null;
    }

    return { uid, email: typeof entry['email'] === 'string' ? entry['email'] : null };
  }

  return {
    watch: (next) => {
      listeners.add(next);
      const timer = setTimeout(() => next(restoreSavedUser()), READ_DELAY_MS);

      return () => {
        clearTimeout(timer);
        listeners.delete(next);
      };
    },

    login: (email, password) =>
      delay(WRITE_DELAY_MS).then(() => {
        if (!EMAIL_REGEX.test(email)) {
          throw new MockAuthException('INVALID_EMAIL', 'auth/invalid-email');
        }

        const entry = Object.entries(usersOf(db.auth)).find(
          ([, u]) => u['email'] === email && u['password'] === password,
        );
        if (!entry) {
          throw new MockAuthException('INVALID_CREDENTIALS', 'auth/invalid-credential');
        }

        const [uid] = entry;
        saveUid(uid);
        emit({ uid, email });
      }),

    signup: (email, password) =>
      delay(WRITE_DELAY_MS).then(() => {
        if (!EMAIL_REGEX.test(email)) {
          throw new MockAuthException('INVALID_EMAIL', 'auth/invalid-email');
        }
        if (password.length < 6) {
          throw new MockAuthException('WEAK_PASSWORD', 'auth/weak-password');
        }

        const authUsers = usersOf(db.auth);
        if (Object.values(authUsers).some((u) => u['email'] === email)) {
          throw new MockAuthException('EMAIL_ALREADY_IN_USE', 'auth/email-already-in-use');
        }

        const uid = `user-${crypto.randomUUID().slice(0, 8)}`;
        authUsers[uid] = { email, password };
        usersOf(db.store)[uid] = { recurrencies: {} };

        saveUid(uid);
        emit({ uid, email });
      }),

    logout: () =>
      delay(WRITE_DELAY_MS).then(() => {
        clearSavedUid();
        emit(null);
      }),

    mapError: mapAuthError,
  };
}
