import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, from, ignoreElements, map, Observable, of, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { onAuthStateChanged, signInWithEmailAndPassword, User as FbUser, createUserWithEmailAndPassword, signOut, AuthErrorCodes as FbAuthErrorCodes, AuthError as FbAuthError} from 'firebase/auth';

import { FirebaseService } from '../../_core/firebase-service';
import { User } from '../../_types/User';
import { AuthError, AuthErrorCodeKnown } from '../../_types/AuthErrors3';
import { AuthServiceInterface } from '../../_types/AuthServiceInterface3';
import { assertError } from '../../../js/errors/assertError';


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
const FIREBASE_AUTH_ERROR_CODES: Partial<Record<FirebaseAuthErrorCode, AuthErrorCodeKnown>> = {
  'auth/user-not-found': 'invalid-email',
  'auth/wrong-password': 'invalid-password',
  'auth/email-already-in-use': 'email-already-exists',
}

const getErrorFrom = (error: unknown): AuthError => {
  const err = assertError(error)
  if(isFirebaseAuthError(err)) {
    const authErrorCode = FIREBASE_AUTH_ERROR_CODES[err.code]
    if(authErrorCode !== undefined) {
      return new AuthError(authErrorCode)
    }
  }
  return new AuthError('unknown-auth-error', err.message)
}




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

  // ACTIONS
  private onAuthStateChange$ = new Observable<FbUser | null>(subscriber => {
    const unsubscribe = onAuthStateChanged(this.auth, {
      next: (fbUser) => subscriber.next(fbUser),
      error: (authError) => subscriber.error(authError),
      complete: () => subscriber.complete()
    })
    subscriber.add(() => unsubscribe())
  }).pipe(
    map(fbUser => fbUser === null ? null : { email: fbUser.email!, uid: fbUser.uid } as User)
  )


  private loginRequest$ = new Subject<{email: string, password: string}>()

  private loginFailure$ = this.loginRequest$.pipe(
    switchMap(
      ({email, password}: {email: string, password: string}) => from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
        ignoreElements(),
        catchError(err => of(err))
      )
    )
  )


  private signupRequest$ = new Subject<{email: string, password: string}>()

  private signupFailure$ = this.signupRequest$.pipe(
    switchMap(
      ({email, password}: {email: string, password: string}) => from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
        ignoreElements(),
        catchError(err => of(err))
      )
    )
  )


  private logoutRequest$ = new Subject<void>()

  private logoutResponse$ = this.logoutRequest$.pipe(
    switchMap(() => from(signOut(this.auth)))
  )


  constructor() {
    // REDUCERS
    this.onAuthStateChange$.pipe(takeUntilDestroyed()).subscribe({
      next: (user: User | null) => {
        this.state.user$.next(user)
        this.state.isLoading$.next(false),
        this.state.error$.next(null)
      }
    })

    this.loginRequest$.pipe(takeUntilDestroyed()).subscribe({
      next: (_) => {
        this.state.isLoading$.next(true),
        this.state.error$.next(null)
      }
    })

    this.loginFailure$.pipe(takeUntilDestroyed()).subscribe((errorValue) => {
      this.state.isLoading$.next(false)
      this.state.error$.next(getErrorFrom(errorValue))
    })

    this.signupRequest$.pipe(takeUntilDestroyed()).subscribe({
      next: (_) => {
        this.state.isLoading$.next(true),
        this.state.error$.next(null)
      }
    })

    this.signupFailure$.pipe(takeUntilDestroyed()).subscribe((errorValue) => {
      this.state.isLoading$.next(false)
      this.state.error$.next(getErrorFrom(errorValue))
    })

    this.logoutRequest$.pipe(takeUntilDestroyed()).subscribe({
      next: (_) => {
        this.state.isLoading$.next(true),
        this.state.error$.next(null)
      }
    })

    this.logoutResponse$.pipe(takeUntilDestroyed()).subscribe()
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
      this.loginRequest$.next({email, password})
    }
  }

  signup(email: string, password: string) {
    if(this.state.user$.value?.email !== email) {
      this.signupRequest$.next({email, password})
    }
  }

  logout() {
    const currentUser = this.state.user$.value
    if(currentUser !== null && currentUser !== undefined) {
      this.logoutRequest$.next()
    }
  }

}
