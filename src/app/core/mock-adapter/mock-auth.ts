import { signal } from '@angular/core';
import { AuthError, AuthInterface, AuthOperation, AuthUser } from '../auth-types';
import { MOCK_AUTH_DATA } from './mock-auth-data';
import { createAuthError, MockAuthException } from './mock-auth-error';
import { MOCK_STORE_DATA } from './mock-store-data';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

function getAuthUsers(): Record<string, Record<string, unknown>> {
  const users = MOCK_AUTH_DATA['users'];
  return typeof users === 'object' && users !== null
    ? (users as Record<string, Record<string, unknown>>)
    : {};
}

function getStoreUsers(): Record<string, Record<string, unknown>> {
  const users = MOCK_STORE_DATA['users'];
  return typeof users === 'object' && users !== null
    ? (users as Record<string, Record<string, unknown>>)
    : {};
}

export function createMockAuth(): AuthInterface {
  const _user = signal<AuthUser | null | undefined>(undefined);
  const _isLoading = signal(true);
  const _error = signal<AuthError | null>(null);

  // Simule l'initialisation initiale au démarrage de l'application
  delay(200).then(() => {
    _user.set(null);
    _isLoading.set(false);
  });

  function handleError(error: unknown, op: AuthOperation): void {
    console.error(`[MockAuth] Failed "${op}":`, error);
    _error.set(createAuthError(error, op));
    _isLoading.set(false);
  }

  function runOperation(op: AuthOperation, action: () => Promise<void>): void {
    _isLoading.set(true);
    _error.set(null);

    delay(300)
      .then(() => action())
      .then(() => _isLoading.set(false))
      .catch((err) => handleError(err, op));
  }

  return {
    user: _user.asReadonly(),
    isLoading: _isLoading.asReadonly(),
    error: _error.asReadonly(),

    login(email: string, password: string): void {
      runOperation('login', async () => {
        if (!EMAIL_REGEX.test(email)) {
          throw new MockAuthException('INVALID_EMAIL', 'auth/invalid-email');
        }

        const entry = Object.entries(getAuthUsers()).find(
          ([, u]) => u['email'] === email && u['password'] === password,
        );

        if (!entry) {
          throw new MockAuthException('INVALID_CREDENTIALS', 'auth/invalid-credential');
        }

        const [uid] = entry;
        _user.set({ uid, email });
      });
    },

    signup(email: string, password: string): void {
      runOperation('signup', async () => {
        if (!EMAIL_REGEX.test(email)) {
          throw new MockAuthException('INVALID_EMAIL', 'auth/invalid-email');
        }

        if (password.length < 6) {
          throw new MockAuthException('WEAK_PASSWORD', 'auth/weak-password');
        }

        const authUsers = getAuthUsers();
        const exists = Object.values(authUsers).some((u) => u['email'] === email);
        if (exists) {
          throw new MockAuthException('EMAIL_ALREADY_IN_USE', 'auth/email-already-in-use');
        }

        const uid = `user-${crypto.randomUUID().slice(0, 8)}`;
        authUsers[uid] = { email, password };
        getStoreUsers()[uid] = { recurrencies: {} };

        _user.set({ uid, email });
      });
    },

    logout(): void {
      runOperation('logout', async () => {
        _user.set(null);
      });
    },
  };
}
