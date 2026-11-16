import { Signal } from '@angular/core';

export interface AuthUser {
  uid: string;
  email: string | null;
}

export type AuthOperation = 'login' | 'logout' | 'signup' | 'state-change';

export type AuthErrorCode =
  | 'INVALID_EMAIL'         // [login, signup] The email string is malformed or does not follow standard address formatting.
  | 'INVALID_CREDENTIALS'   // [login] Email does not exist or password is wrong (unified into one code by standard Email Enumeration Protection).
  | 'EMAIL_ALREADY_IN_USE'  // [signup] An account already exists with the submitted email address.
  | 'WEAK_PASSWORD'         // [signup] The chosen password fails minimum security requirements (e.g., fewer than 6 characters).
  | 'TOO_MANY_REQUESTS'     // [login, signup] Access is temporarily blocked after too many consecutive failed attempts from this device or IP.
  | 'NETWORK_ERROR'         // [login, signup, logout, state-change] The device lost internet connectivity or cannot reach the authentication server.
  | 'OPERATION_NOT_ALLOWED' // [login, signup] The requested sign-in method (e.g., email/password) is disabled in the backend configuration.
  | 'UNMAPPED_AUTH_ERROR'   // [login, signup, logout, state-change] The backend returned a known SDK error code that has not been explicitly mapped.
  | 'UNKNOWN_AUTH_ERROR';   // [login, signup, logout, state-change] An unexpected runtime exception or non-SDK error interrupted the operation.

/** What a backend knows about a failure. The store adds the operation. */
export interface AuthErrorInfo {
  code: AuthErrorCode;
  details: string;
}

export interface AuthError extends AuthErrorInfo {
  operation: AuthOperation;
}

/** What features see (implemented by AuthStore). */
export interface AuthInterface {
  /** undefined = still initializing, null = signed out. */
  readonly user: Signal<AuthUser | null | undefined>;
  readonly isLoading: Signal<boolean>;
  readonly error: Signal<AuthError | null>;

  login(email: string, password: string): void;
  signup(email: string, password: string): void;
  logout(): void;
}
