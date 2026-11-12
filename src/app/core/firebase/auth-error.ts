import { FirebaseError } from 'firebase/app';
import { AuthError, AuthErrorCode, AuthOperation } from '../types/auth';

function mapToAuthErrorCode(error: unknown): { code: AuthErrorCode; details: string } {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-email':
      case 'auth/invalid-credential':
        return { code: 'INVALID_EMAIL', details: error.code };
      case 'auth/wrong-password':
        return { code: 'WRONG_PASSWORD', details: error.code };
      case 'auth/user-not-found':
        return { code: 'USER_NOT_FOUND', details: error.code };
      case 'auth/email-already-in-use':
        return { code: 'EMAIL_ALREADY_IN_USE', details: error.code };
      case 'auth/weak-password':
        return { code: 'WEAK_PASSWORD', details: error.code };
      case 'auth/operation-not-allowed':
        return { code: 'OPERATION_NOT_ALLOWED', details: error.code };
      default:
        return { code: 'UNMAPPED_AUTH_ERROR', details: error.code };
    }
  }

  return {
    code: 'UNKNOWN_AUTH_ERROR',
    details: error instanceof Error ? error.message : 'unknown-error'
  };
}

export function createAuthError(error: unknown, operation: AuthOperation): AuthError {
  return {
    ...mapToAuthErrorCode(error),
    operation
  };
}
