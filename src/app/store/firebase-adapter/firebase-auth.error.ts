import { FirebaseError } from "firebase/app";
import { AuthError, AuthErrorCode } from "../auth.type";

export function mapToAuthErrorCode(error: unknown): AuthError {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-email':
        return { code: 'INVALID_EMAIL', cause: error };
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return { code: 'INVALID_CREDENTIALS', cause: error };
      case 'auth/email-already-in-use':
        return { code: 'EMAIL_ALREADY_IN_USE', cause: error };
      case 'auth/weak-password':
        return { code: 'WEAK_PASSWORD', cause: error };
      case 'auth/too-many-requests':
        return { code: 'TOO_MANY_REQUESTS', cause: error };
      case 'auth/network-request-failed':
        return { code: 'NETWORK_ERROR', cause: error };
      case 'auth/operation-not-allowed':
        return { code: 'OPERATION_NOT_ALLOWED', cause: error };
      default:
        return { code: 'UNMAPPED_AUTH_ERROR', cause: error };
    }
  }

  return {
    code: 'UNKNOWN_AUTH_ERROR',
    cause: error instanceof Error ? error : new Error('unknown-error'),
  };
}