import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

import { onAuthStateChanged, signInWithEmailAndPassword, User as FbUser, createUserWithEmailAndPassword, signOut, AuthErrorCodes as FbAuthErrorCodes, AuthError as FbAuthError} from 'firebase/auth';

import { FirebaseService } from '../../_core/firebase-service';
import { assertError } from '../../../js/errors/assertError';

import { User } from '../../_types/User';
import { AuthError, AuthErrorCodeKnown } from '../../_types/AuthError';
import { AuthServiceInterface } from '../../_types/AuthServiceInterface';



/** FIREBASE DEPENDENCY */

/**
 * Redefining Firebase'AuthError' type, 
 * explicitely setting the 'code' type as 'string literal' from the firebase-code-list (through the constant Firebase'AuthErrorCodes') instead of simply 'string'
 */
type FirebaseAuthErrorCode = typeof FbAuthErrorCodes[keyof typeof FbAuthErrorCodes]
type FirebaseAuthError = Omit<FbAuthError, 'code'> & { readonly code: FirebaseAuthErrorCode }
const isFirebaseAuthError = (err: unknown): err is FirebaseAuthError => err instanceof Error && err.name === 'FirebaseError' && 'customData' in err

/** Converts some of FirebaseAuthErrorCodes in AuthCodes */
const FIREBASE_AUTH_ERROR_CODES: Partial<Record<FirebaseAuthErrorCode, AuthErrorCodeKnown>> = {
  'auth/user-not-found': 'invalid-email',
  'auth/wrong-password': 'invalid-password',
  'auth/email-already-in-use': 'email-already-exists',
}

/**
 * Acts as an AuthError factory, with firebase dependencies. 
 * Use this function to create an AuthError instead of new AuthError()!
 */
const getAuthErrorFrom = (error: unknown): AuthError => {
  const err = assertError(error)
  if(isFirebaseAuthError(err)) {
    const authErrorCode = FIREBASE_AUTH_ERROR_CODES[err.code]
    if(authErrorCode !== undefined) {
      return new AuthError(authErrorCode)
    }
  }
  return new AuthError('unknown-auth-error', err.message)
}



/**
 * An AuthService with Firebase dependencies.
 */
@Injectable({ providedIn: 'root' })
export class AuthService implements AuthServiceInterface {
  // export class AuthService {
  private auth = inject(FirebaseService).auth

  // STATE
  private state = {
    user$: new BehaviorSubject<User | null | undefined>(undefined),
    isLoading$: new BehaviorSubject<boolean>(true),
    error$: new BehaviorSubject<AuthError | null>(null)
  }

  constructor() {
    // triggered whenever the auth state changed on the backend. Long living, never ending.
    onAuthStateChanged(this.auth, 
      // Fire only on successful auth changes.
      // Since acc. docs it never errors, the errors must be caught in the signin, signup and logout results.
      (fbUser) => {
        const user = !!fbUser ? {email: fbUser.email, uid: fbUser.uid} as User : null
        this.authStateChanged(user)
      }
    )
  }

  // ACTIONS
  // triggered whenever the auth state changed on the backend. Long living, never ending.
  private authStateChanged(user: User | null) {
    this.operationSucceeded()
    this.realTimeChange(user)
  }

  // triggered upon login request from the user. 
  // A request corresponding to the current active user is ignored (only effective change request are processed!)
  private loginRequest(email: string, password: string) {
    this.operationStarts()
    signInWithEmailAndPassword(this.auth, email, password)
      .catch(err => {
        const authError = getAuthErrorFrom(err)
        this.operationFailed(authError)
      })
  }

  // triggered upon signup request from the user. 
  // A request corresponding to the current active user is ignored (only effective change request are processed!)
  private signupRequest(email: string, password: string) {
    this.operationStarts()
    createUserWithEmailAndPassword(this.auth, email, password)
      .catch(err => {
        const authError = getAuthErrorFrom(err)
        this.operationFailed(authError)
      })
  }

  // triggered upon logout request from the user. 
  // A request in case the user is currently not authenticated is ignored (only effective change request are processed!)
  private logoutRequest() {
    this.operationStarts()
    signOut(this.auth)
      .catch(err => {
        const authError = getAuthErrorFrom(err)
        this.operationFailed(authError)
      })
  }
  
  // REDUCERS
  private operationStarts() {
    this.state.isLoading$.next(true)
    this.state.error$.next(null)
  }

  private operationSucceeded() {
    this.state.isLoading$.next(false)
  }

  private operationFailed(authError: AuthError) {
    this.state.isLoading$.next(false)
    this.state.error$.next(authError)
  }

  private realTimeChange(data: User | null) {
    this.state.user$.next(data)
  }


  // SELECTORS
  readonly user$ = this.state.user$.asObservable()
  readonly user = toSignal(this.user$, {requireSync: true})

  readonly isLoading$ = this.state.isLoading$.asObservable()
  readonly isLoading = toSignal(this.state.isLoading$, {requireSync: true})

  readonly error$ = this.state.error$.asObservable()
  readonly error = toSignal(this.state.error$, {requireSync: true})


  login(email: string, password: string) {
    if(this.state.user$.value?.email !== email) {
      this.loginRequest(email, password)
    }
  }

  signup(email: string, password: string) {
    if(this.state.user$.value?.email !== email) {
      this.signupRequest(email, password)
    }
  }

  logout() {
    const currentUser = this.state.user$.value
    if(currentUser !== null && currentUser !== undefined) {
      this.logoutRequest()
    }
  }

}
