import { AuthError as FirebaseAuthError} from "firebase/auth";


export function toAuthError(err: FirebaseAuthError) {
  switch(err.code) {

    case 'auth/email-already-exists': 
      return {
        code: 'email-already-exists',
        message: 'An account with this email already exists.'
      } as const

    case 'auth/user-not-found': 
      return {
        code: 'user-not-found',
        message: 'There are no account corresponding to this email.'
      } as const

    case 'auth/invalid-password': 
      return {
        code: 'invalid-password',
        message: 'The entered password is invalid.'
      } as const

    default: 
      return {
        code: 'unknown-error',
        message: `Unknown error (${err.code})`
      } as const
  }
}


export type AuthError = ReturnType<typeof toAuthError>