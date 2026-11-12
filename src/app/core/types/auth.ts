import { Signal } from '@angular/core';

export interface AuthUser {
  uid: string;
  email: string | null;
}

export type AuthOperation = 'login' | 'logout' | 'signup' | 'state-change';

export type AuthErrorCode =
  | 'INVALID_EMAIL'
  | 'WRONG_PASSWORD'
  | 'USER_NOT_FOUND'
  | 'EMAIL_ALREADY_IN_USE'
  | 'WEAK_PASSWORD'
  | 'OPERATION_NOT_ALLOWED'
  | 'UNMAPPED_AUTH_ERROR'
  | 'UNKNOWN_AUTH_ERROR';

export interface AuthError {
  code: AuthErrorCode;
  operation: AuthOperation;
  details: string;
}

export interface AuthInterface {
  readonly user: Signal<AuthUser | null | undefined>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<AuthError | null>;

  login(email: string, password: string): void;
  signup(email: string, password: string): void;
  logout(): void;
}
