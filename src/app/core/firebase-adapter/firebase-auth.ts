import { DestroyRef, inject, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { AuthError, AuthInterface, AuthOperation, AuthUser } from '../auth-types';
import { createAuthError } from './firebase-auth-error';
import { FIREBASE_AUTH } from './firebase-config';

export function createFirebaseAuth(): AuthInterface {
  const firebaseAuth = inject(FIREBASE_AUTH);
  const destroyRef = inject(DestroyRef);

  const _user = signal<AuthUser | null | undefined>(undefined);
  const _isLoading = signal(true);
  const _error = signal<AuthError | null>(null);

  function handleError(error: unknown, op: AuthOperation): void {
    console.error(`[FirebaseAuth] Failed "${op}":`, error);
    _error.set(createAuthError(error, op));
    _isLoading.set(false);
  }

  function runOperation(op: AuthOperation, action: () => Promise<unknown>): void {
    _isLoading.set(true);
    _error.set(null);

    action()
      .then(() => _isLoading.set(false))
      .catch((err) => handleError(err, op));
  }

  const unsubscribe = onAuthStateChanged(
    firebaseAuth,
    (firebaseUser) => {
      if (firebaseUser) {
        _user.set({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } else {
        _user.set(null);
      }
      _isLoading.set(false);
    },
    (err) => handleError(err, 'state-change'),
  );

  destroyRef.onDestroy(unsubscribe);

  return {
    user: _user.asReadonly(),
    isLoading: _isLoading.asReadonly(),
    error: _error.asReadonly(),

    login(email: string, password: string): void {
      runOperation('login', () => signInWithEmailAndPassword(firebaseAuth, email, password));
    },

    signup(email: string, password: string): void {
      runOperation('signup', () => createUserWithEmailAndPassword(firebaseAuth, email, password));
    },

    logout(): void {
      runOperation('logout', () => firebaseSignOut(firebaseAuth));
    },
  };
}
