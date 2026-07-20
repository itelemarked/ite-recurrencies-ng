import { inject, Injectable, Signal } from '@angular/core';
import { map, Observable, startWith } from 'rxjs';
import { onAuthStateChanged, signInWithEmailAndPassword, User as FbUser, createUserWithEmailAndPassword, signOut, AuthErrorCodes as FbAuthErrorCodes, AuthError as FbAuthError } from 'firebase/auth';
import { FirebaseService } from '../../_core/firebase-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../_types/User';
import { AuthError, AuthErrorCode } from '../../_types/AuthErrors';
import { assertError } from '../../../js/errors/assertError';
import { AuthServiceInterface2 } from '../../_types/AuthServiceInterface2';


/** FIREBASE DEPENDENCY */

/**
 * Redefining Firebase'AuthError' type, 
 * explicitely setting the 'code' type as 'string literal' from the firebase-code-list (through the constant Firebase'AuthErrorCodes') instead of simply 'string'
 */
type FirebaseAuthErrorCode = typeof FbAuthErrorCodes[keyof typeof FbAuthErrorCodes]
type FirebaseAuthError = Omit<FbAuthError, 'code'> & { readonly code: FirebaseAuthErrorCode }
const isFirebaseAuthError = (err: unknown): err is FirebaseAuthError => err instanceof Error && err.name === 'FirebaseError' && 'customData' in err

/**
 * Convert some of FirebaseAuthErrorCodes in AuthCodes
 */
const FIREBASE_AUTH_ERROR_CODES: Partial<Record<FirebaseAuthErrorCode, AuthErrorCode>> = {
  'auth/invalid-email': 'invalid-email',
  'auth/wrong-password': 'invalid-password',
  'auth/email-already-in-use': 'email-already-exists',
}

const getErrorFrom = (error: unknown): Error | FirebaseAuthError | AuthError => {
  const err = assertError(error)
  if(isFirebaseAuthError(err)) {
    const authErrorCode = FIREBASE_AUTH_ERROR_CODES[err.code]
    if(authErrorCode !== undefined) {
      return new AuthError(authErrorCode)
    }
  }
  // returns an 'Error' object (unlikely, since the method used should throw a 'FirebaseError' only),
  // or a FirebaseAuthError object if it's code is not meant to be converted to AuthError.
  return err
}




@Injectable({ providedIn: 'root' })
export class AuthService2 implements AuthServiceInterface2 {
  private auth = inject(FirebaseService).auth

  private _onAuthStateChangeToObservable$ = new Observable<FbUser | null>(subscriber => {
    const unsubscribe = onAuthStateChanged(this.auth, {
      next: (fbUser) => subscriber.next(fbUser),
      error: (authError) => subscriber.error(authError),
      complete: () => subscriber.complete()
    })
    subscriber.add(() => unsubscribe())
  })

  user$ = this._onAuthStateChangeToObservable$.pipe(
    map(fbUser => fbUser === null ? null : { email: fbUser.email!, uid: fbUser.uid } as User),
    startWith(undefined)
  )
  user = toSignal(this.user$, {requireSync: true})


  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password)
      return
    }
    catch (error: unknown) {
      throw getErrorFrom(error)
    }
  }

  async signup(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password)
      return
    }
    catch (error: unknown) {
      throw getErrorFrom(error)
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth)
      return
    }
    catch(error: unknown) {
      throw getErrorFrom(error)
    }
  }

  // private _throwAuthenicationError(err: unknown) {
  //   if(err instanceof Error) {
  //     switch(err.name) {
  //       case 'FirebaseError': {
  //         const firebaseErrorCode = err.code
  //         const customErrorCode = toAuthErrorCode(firebaseErrorCode)
    
  //         throw customErrorCode === undefined
  //           ? new UnknownAuthError(firebaseErrorCode)
  //           : new AuthError(customErrorCode)
  //       }
  
  //       default:
  //         throw err
  //     }
  //   }
  // }

}
