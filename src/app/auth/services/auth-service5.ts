import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, filter, from, map, merge, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { onAuthStateChanged, signInWithEmailAndPassword, User as FbUser, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

import { assertError } from '../../../js/errors/assertError';
import { FirebaseService } from '../../_core/firebase-service';
import { User } from '../../_types/User';
import { log } from '../../../js/errors/rxjs-operator-log';



// // CLASSIC WAY (METHODS)
// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   // export class AuthService {
//   private auth = inject(FirebaseService).auth

//   // STATE
//   private state = {
//     user$: new BehaviorSubject<User | null | undefined>(undefined),
//     isLoading$: new BehaviorSubject<boolean>(true),
//     error$: new BehaviorSubject<Error | null>(null)
//   }

//   setStateRequestStarted() {
//     this.state.error$.next(null)
//     this.state.isLoading$.next(true)
//   }

//   setStateRequestSucceeded(settings: User | null | undefined) {
//     this.state.user$.next(settings)
//     this.state.error$.next(null)
//     this.state.isLoading$.next(false)
//   }

//   setStateRequestFailed(error: Error) {
// //     this.state.user$.next(null)
//     this.state.error$.next(error)
//     this.state.isLoading$.next(false)
//   }


//   constructor() {
//     // never errors
//     // is triggered suddenly (backend changes) or upon user actions.
//     onAuthStateChanged(this.auth, (fbUser) => {
//       this.backendDataChangeSucceeded(fbUser)
//     })
//   }

//   // ACTIONS
  
//   private backendDataChangeSucceeded(fbUser: FbUser | null) {
//     if(!!fbUser) {
//       const uid = fbUser.uid
//       const email = fbUser.email!
//       this.state.user$.next({uid, email})
//     }
//     else {
//       this.state.user$.next(fbUser)
//     }

//     this.state.isLoading$.next(false)
//     this.state.error$.next(null)
//   }

//   private loginRequest(email: string, password: string) {
//     if(this.state.user$.value === null || this.state.user$.value === undefined || (!!this.state.user$.value && email !== this.state.user$.value.email)) {
//       this.state.isLoading$.next(true)
//       this.state.error$.next(null)

//       signInWithEmailAndPassword(this.auth, email, password)
//         .catch(err => {
//           const error = assertError(err)
//           this.state.isLoading$.next(false)
//           this.state.error$.next(error)
//         })
//     }
//   }

//   private signupRequest(email: string, password: string) {
//     if(!!this.state.user$.value && email !== this.state.user$.value.email) {
//       this.state.isLoading$.next(true)
//       this.state.error$.next(null)

//       createUserWithEmailAndPassword(this.auth, email, password)
//         .catch(err => {
//           const error = assertError(err)
//           this.state.isLoading$.next(false)
//           this.state.error$.next(error)
//         })
//     }
//   }

//   private logoutRequest() {
//     if(!!this.state.user$ !== null && this.state.user$ !== undefined) {
//       this.state.isLoading$.next(true)
//       this.state.error$.next(null)

//       signOut(this.auth)
//         .catch(err => {
//           const error = assertError(err)
//           this.state.isLoading$.next(false)
//           this.state.error$.next(error)
//         })
//     }
//   }

//   // SELECTORS
//   public readonly user$ = this.state.user$.asObservable()
//   public readonly user = toSignal(this.user$, {requireSync: true})
//   public readonly isLoading$ = this.state.isLoading$.asObservable()
//   public readonly isLoading = toSignal(this.state.isLoading$, {requireSync: true})
//   public readonly error$ = this.state.error$.asObservable()
//   public readonly error = toSignal(this.state.error$, {requireSync: true})

//   public readonly login = (email: string, password: string) => this.loginRequest(email, password)
//   public readonly signup = (email: string, password: string) => this.signupRequest(email, password)
//   public readonly logout = () => this.logoutRequest()

// }


type ResponseSuccess = { type: 'success' }
type ResponseError = { type: 'error', error: Error }
type Response = ResponseSuccess | ResponseError

// OBSERVABLES WAY
@Injectable({ providedIn: 'root' })
export class AuthService {
  private fbAuth = inject(FirebaseService).auth

  // STATE
  private state = {
    user$: new BehaviorSubject<User | null | undefined>(undefined),
    isLoading$: new BehaviorSubject<boolean>(true),
    error$: new BehaviorSubject<Error | null>(null)
  }

  // onAuthStateChange: acc. documentation: never errors (the errors should be listen from the requests), and never completes!
  // isLoading  -->   true:         request started | initialisation
  //            -->   false:        request responded (successfully or with error)
  // error      -->   error:        request responded with error
  //            -->   null:         request started | request responded successfully 
  // user       -->   User:         backendData responded (always successfully) with a registered user
  //            -->   null:         backendData responded (always successfully) with null
  //            -->   undefined:    initialisation


  private onAuthStateChange$ = new Observable<User | null>(subscriber => {
    onAuthStateChanged(this.fbAuth, (fbUser) => fbUser === null 
      ? subscriber.next(null)
      : subscriber.next({email: fbUser.email, uid: fbUser.uid} as User))
  }).pipe(
    // log('auth-auth-onAuthStateChanged$')
  )

  private signInWithEmailAndPassword$ = ({email, password}: {email: string, password: string}): Observable<Response> => from(signInWithEmailAndPassword(this.fbAuth, email, password)).pipe(
    map((_) => ({
      type: 'success'
    } as ResponseSuccess)),
    catchError(err => {
      const error = assertError(err)
      return of({
        type: 'error', 
        error: new Error('auth-login-error', {cause: err.message})
      } as ResponseError)
    }),
    // log('auth-auth-signInWithEmailAndPassword$'),
  )

  private createUserWithEmailAndPassword$ = ({email, password}: {email: string, password: string}): Observable<Response> => from(createUserWithEmailAndPassword(this.fbAuth, email, password)).pipe(
    map((_) => ({
      type: 'success'
    } as ResponseSuccess)),
    catchError(err => {
      const error = assertError(err)
      return of({
        type: 'error', 
        error: new Error('auth-signup-error', {cause: err.message})
      } as ResponseError)
    }),
    // log('auth-auth-createUserWithEmailAndPassword$'),
  )

  private signOut$ = (): Observable<Response> => from(signOut(this.fbAuth)).pipe(
    map((_) => ({
      type: 'success'
    } as ResponseSuccess)),
    catchError(err => {
      const error = assertError(err)
      return of({
        type: 'error', 
        error: new Error('auth-logout-error', {cause: err.message})
      } as ResponseError)
    }),
    // log('auth-auth-signOut$'),
  )
  

  // ACTIONS
  private loginRequest$ = new Subject<{email: string, password: string}>()
  private signupRequest$ = new Subject<{email: string, password: string}>()
  private logoutRequest$ = new Subject<void>()
  private request$ = merge(this.loginRequest$, this.signupRequest$, this.logoutRequest$).pipe(
    // log('auth-auth-request$'),
  )

  private loginResponse$ = this.loginRequest$.pipe(
    switchMap(this.signInWithEmailAndPassword$),
    shareReplay({bufferSize: 1, refCount: false}),
    // log('auth-auth-loginResponse$'),
  )
  private signupResponse$ = this.signupRequest$.pipe(
    switchMap(this.createUserWithEmailAndPassword$),
    shareReplay({bufferSize: 1, refCount: false}),
    // log('auth-auth-signupResponse$'),
  )
  private logoutResponse$ = this.logoutRequest$.pipe(
    switchMap(this.signOut$),
    shareReplay({bufferSize: 1, refCount: false}),
    // log('auth-auth-logoutResponse$'),
  )
  
  private responseError$ = merge(
      this.loginResponse$, 
      this.signupResponse$, 
      this.logoutResponse$
    ).pipe(
      filter(response => response.type === 'error'),
      // log('auth-auth-responseError$'),
    )


  constructor() {
    this.onAuthStateChange$.pipe().subscribe(user => {
      this.state.user$.next(user)
      this.state.isLoading$.next(false)
      this.state.error$.next(null)
    })

    this.request$.subscribe(() => {
      this.state.isLoading$.next(true)
      this.state.error$.next(null)
    })

    this.responseError$.subscribe(response => {
      this.state.isLoading$.next(false)
      this.state.error$.next(response.error)
    })
  }

  // SELECTORS
  public readonly user$ = this.state.user$.asObservable()
  public readonly user = toSignal(this.user$, {requireSync: true})
  public readonly isLoading$ = this.state.isLoading$.asObservable()
  public readonly isLoading = toSignal(this.state.isLoading$, {requireSync: true})
  public readonly error$ = this.state.error$.asObservable()
  public readonly error = toSignal(this.state.error$, {requireSync: true})

  public readonly login = (email: string, password: string) => {
    const user = this.state.user$.value
    if(user === null || user === undefined || user.email !== email) {
      this.loginRequest$.next({email, password})
    }
  }
  public readonly signup = (email: string, password: string) => {
    const user = this.state.user$.value
    if(user === null || user === undefined || user.email !== email) {
      this.signupRequest$.next({email, password})
    }
  }
  public readonly logout = () => {
    const user = this.state.user$.value
    if(user !== null) {
      this.logoutRequest$.next()
    }
  }

}








