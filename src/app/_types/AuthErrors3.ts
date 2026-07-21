
const AUTH_ERRORS_KNOWN = {
  'invalid-email': 'An account corresponding to this email has not been found',
  'invalid-password': 'The password is incorrect',
  'email-already-exists': 'There is already a registered user with this email'
} as const
export type AuthErrorCodeKnown = keyof typeof AUTH_ERRORS_KNOWN
const isAuthErrorCodeKnown = (val: AuthErrorCode): val is AuthErrorCodeKnown => val !== 'unknown-auth-error'

type AuthErrorCodeUnknown = 'unknown-auth-error'

type AuthErrorCode = AuthErrorCodeKnown | AuthErrorCodeUnknown

export class AuthError extends Error {
  readonly code: AuthErrorCode

  constructor(code: AuthErrorCodeKnown)
  constructor(code: AuthErrorCodeUnknown, detail: string)
  constructor(code: AuthErrorCode, detail?: string) {
    const message = isAuthErrorCodeKnown(code)
      ? AUTH_ERRORS_KNOWN[code]
      : `Unknown auth error: (${detail})`
    super(message)
    this.code = code
    this.name = 'AuthError'
  }
}