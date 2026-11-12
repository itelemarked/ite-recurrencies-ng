import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { AuthError, AuthInterface, AuthOperation, AuthUser } from '../types/auth';
import { FIREBASE_AUTH } from './firebase.config';
import { createAuthError } from './auth-error';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthInterface {
  private readonly firebaseAuth = inject(FIREBASE_AUTH);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _user = signal<AuthUser | null | undefined>(undefined);
  private readonly _loading = signal(false);
  private readonly _error = signal<AuthError | null>(null);

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    const unsubscribe = onAuthStateChanged(
      this.firebaseAuth,
      (firebaseUser) => {
        if (firebaseUser) {
          this._user.set({
            uid: firebaseUser.uid,
            email: firebaseUser.email
          });
        } else {
          this._user.set(null);
        }
      },
      (err) => this.handleError(err, 'state-change')
    );

    this.destroyRef.onDestroy(unsubscribe);
  }

  login(email: string, password: string): void {
    this.runOperation('login', () =>
      signInWithEmailAndPassword(this.firebaseAuth, email, password)
    );
  }

  signup(email: string, password: string): void {
    this.runOperation('signup', () =>
      createUserWithEmailAndPassword(this.firebaseAuth, email, password)
    );
  }

  logout(): void {
    this.runOperation('logout', () => firebaseSignOut(this.firebaseAuth));
  }

  private clearError(): void {
    this._error.set(null);
  }

  private runOperation(op: AuthOperation, action: () => Promise<unknown>): void {
    this._loading.set(true);
    this.clearError();

    action()
      .then(() => this._loading.set(false))
      .catch((err) => this.handleError(err, op));
  }

  private handleError(error: unknown, op: AuthOperation): void {
    console.error(`[AuthService] Failed "${op}":`, error);
    this._error.set(createAuthError(error, op));
    this._loading.set(false);
  }
}
