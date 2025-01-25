import { CustomError } from "./custom-error"

export const AUTH_ERRORS = {
  // login errors
  USER_NOT_FOUND: { code: 'auth/user-not-found', message: 'There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).' },
  NETWORK_REQUEST_FAILED: { code: 'auth/network-request-failed', message: 'A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred. (auth/network-request-failed).' },
  WRONG_PASSWORD: { code: 'auth/wrong-password', message: 'The password is invalid. (auth/wrong-password).' },
  // signup errors
  EMAIL_ALREADY_IN_USE: { code: 'auth/email-already-in-use', message: 'The email address is already in use by another account. (auth/email-already-in-use).' },
  WEAK_PASSWORD: { code: 'auth/weak-password', message: 'Password should be at least 6 characters (auth/weak-password).' },
}

export class AuthError extends CustomError {
  constructor({code, message}: {code: string, message: string}) {
    super({code, message, name: 'AuthError'})
  }
}