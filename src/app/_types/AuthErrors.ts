import { isString } from "../../js/types/valid-type"

export const AUTH_ERRORS = {
  'invalid-email': 'An account corresponding to this email has not been found',
  'invalid-password': 'The password is incorrect',
  'email-already-exists': 'There is already a registered user with this email'
} as const

export type AuthErrorCode = keyof typeof AUTH_ERRORS
export type AuthErrorMessage = typeof AUTH_ERRORS[keyof typeof AUTH_ERRORS]

export const isAuthErrorCode = (val: unknown): val is AuthErrorCode => isString(val) && val in AUTH_ERRORS

export class AuthError extends Error {
  code: AuthErrorCode

  constructor(code: AuthErrorCode) {
    const message: AuthErrorMessage = AUTH_ERRORS[code]
    super(message)
    this.code = code
    this.name = 'AuthError'
  }
}
