import { inject } from '@angular/core';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { AuthDriver } from '../adapters/adapters.types';
import { AuthErrorInfo } from '../store-auth.types';
import { FIREBASE_AUTH } from './firebase.config';

/** Firebase Auth error codes -> auth error codes. */
function mapAuthError(error: unknown): AuthErrorInfo {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-email':
        return { code: 'INVALID_EMAIL', details: error.code };
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return { code: 'INVALID_CREDENTIALS', details: error.code };
      case 'auth/email-already-in-use':
        return { code: 'EMAIL_ALREADY_IN_USE', details: error.code };
      case 'auth/weak-password':
        return { code: 'WEAK_PASSWORD', details: error.code };
      case 'auth/too-many-requests':
        return { code: 'TOO_MANY_REQUESTS', details: error.code };
      case 'auth/network-request-failed':
        return { code: 'NETWORK_ERROR', details: error.code };
      case 'auth/operation-not-allowed':
        return { code: 'OPERATION_NOT_ALLOWED', details: error.code };
      default:
        return { code: 'UNMAPPED_AUTH_ERROR', details: error.code };
    }
  }

  return {
    code: 'UNKNOWN_AUTH_ERROR',
    details: error instanceof Error ? error.message : 'unknown-error',
  };
}

/** Must be called in an injection context. */
export function createFirebaseAuth(): AuthDriver {
  const auth = inject(FIREBASE_AUTH);

  return {
    watch: (next, fail) =>
      onAuthStateChanged(
        auth,
        (firebaseUser) => next(firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email } : null),
        (err) => fail(err),
      ),

    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signup: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),

    mapError: mapAuthError,
  };
}
