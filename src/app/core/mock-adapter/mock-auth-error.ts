import { AuthError, AuthErrorCode, AuthOperation } from '../auth-types';

export class MockAuthException extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
  ) {
    super(message);
  }
}

function mapToAuthErrorCode(error: unknown): { code: AuthErrorCode; details: string } {
  if (error instanceof MockAuthException) {
    return { code: error.code, details: error.message };
  }

  return {
    code: 'UNKNOWN_AUTH_ERROR',
    details: error instanceof Error ? error.message : 'unknown-error',
  };
}

export function createAuthError(error: unknown, operation: AuthOperation): AuthError {
  return {
    ...mapToAuthErrorCode(error),
    operation,
  };
}
