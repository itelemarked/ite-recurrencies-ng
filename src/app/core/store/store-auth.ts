import { DestroyRef, inject, signal } from '@angular/core';
import { ADAPTERS } from './adapters/adapters';
import { AuthError, AuthInterface, AuthOperation, AuthUser } from './store-auth.types';

/**
 * Auth state and operations on top of the active backend (see adapters/).
 * Must be called in an injection context (AuthStore in store.ts does).
 *
 * A failed state listener keeps the last known user and sets `error`
 * (same rule as a failed data read, see store-data.ts).
 */
export function createStoreAuth(): AuthInterface {
  const driver = ADAPTERS.auth();
  const destroyRef = inject(DestroyRef);

  const user = signal<AuthUser | null | undefined>(undefined);
  const isLoading = signal(true);
  const error = signal<AuthError | null>(null);

  function fail(err: unknown, operation: AuthOperation): void {
    console.error(`[Auth] Failed "${operation}":`, err);
    error.set({ ...driver.mapError(err), operation });
    isLoading.set(false);
  }

  function run(operation: AuthOperation, action: () => Promise<unknown>): void {
    isLoading.set(true);
    error.set(null);

    void (async () => {
      try {
        await action();
        isLoading.set(false);
      } catch (err) {
        fail(err, operation);
      }
    })();
  }

  const unsubscribe = driver.watch(
    (next) => {
      user.set(next);
      isLoading.set(false);
    },
    (err) => fail(err, 'state-change'),
  );
  destroyRef.onDestroy(unsubscribe);

  return {
    user: user.asReadonly(),
    isLoading: isLoading.asReadonly(),
    error: error.asReadonly(),

    login: (email, password) => run('login', () => driver.login(email, password)),
    signup: (email, password) => run('signup', () => driver.signup(email, password)),
    logout: () => run('logout', () => driver.logout()),
  };
}
