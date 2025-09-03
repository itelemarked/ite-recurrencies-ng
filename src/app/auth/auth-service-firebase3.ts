import { inject, Injectable, Signal } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";

import { BehaviorSubject, catchError, delay, empty, EMPTY, filter, finalize, from, interval, map, materialize, NEVER, Observable, of, retry, retryWhen, startWith, Subject, switchMap, take, tap, throwError } from "rxjs";

import { CustomTypeError, LooseAutocomplete, tryCatch, isUser, User } from "./__imports";



// type AuthStateSuccess = {
//   status: 'success',
//   user: User | null,
//   error: null
// }

// type AuthStateError = {
//   status: 'error',
//   user: User | null,
//   error: Error
// }

// type AuthStateLoading = {
//   status: 'loading',
//   user: User | null,
//   error: null
// }

// type AuthState = AuthStateSuccess | AuthStateError | AuthStateLoading

// type AuthStateSuccessUpdate = Pick<AuthStateSuccess, 'status' | 'user'>
// type AuthStateErrorUpdate = Pick<AuthStateError, 'status' | 'error'>
// type AuthStateLoadingUpdate = Pick<AuthStateLoading, 'status'>

// type AuthStateUpdate = AuthStateSuccessUpdate | AuthStateErrorUpdate | AuthStateLoadingUpdate


type AuthState = {
  status: 'success' | 'error' | 'loading',
  user: User | null
  error: Error | null
}



// interface AuthServiceInterface {
//   user$: Observable<User | null | undefined>
//   user: Signal<User | null | undefined>
//   errorCodes$: Observable<AuthErrorCode[]>
//   errorCode: Signal<AuthErrorCode[]>
//   login(email: string, password: string): Promise<User> // promise which never rejects. Use 'errorCode' instead!
//   signup(email: string, password: string): Promise<User> // promise which never rejects. Use 'errorCode' instead!
//   logout(): Promise<void> // promise which never rejects. Use 'errorCode' instead!
// }

@Injectable({providedIn: 'root'})
export class AuthServiceFirebase3 {

  private fbAuth = inject(AngularFireAuth)

  // STATE
  private _state$ = new BehaviorSubject<AuthState>({
    status: 'loading',
    user: null,
    error: null
  })

  // SOURCES
  private _loading$ = new Subject<void>()
  private _error$ = new Subject<Error>()
  private _login$ = new Subject<{email: string, password: string}>()
  private _logout$ = new Subject<void>()
  // private _signup$ = new Subject<{email: string, password: string}>()

  private _userChange$ = this.fbAuth.authState.pipe(
    map(firebaseUser => {
      if (firebaseUser === null) return null
      const email = firebaseUser.email!
      const uid = firebaseUser.uid
      return {uid, email} as User
    }),
    catchError(err => {
      this._error$.next(err)
      return NEVER
    }),
  )

  /** No need to catch the login stream here, since it is updated by userChange$ observable. 
   * But if the value has not been changed (same user), then it should emit (to set the 'loading' status)
   * Catch the error to maintain the subscription in case of errors!
   */
  private _loginResponse$ = this._login$.pipe(
    switchMap(
      /** - signInWithEmailAndPassword() resolves also if the same user request has been done.*/
      ({email, password}) => from(this.fbAuth.signInWithEmailAndPassword(email, password)).pipe(
        map(firebaseUserCredentials => {
          /** By successful login, we can be sure that the user won't be null. */
          const uid = firebaseUserCredentials.user!.uid
          const email = firebaseUserCredentials.user!.email!
          return {uid, email} as User
        }),
        catchError(err => {
          return of({catchedError: err})
        }),
      )
    )
  )

  private _logoutResponse$ = this._logout$.pipe(
    switchMap(
      (_) => from(this.fbAuth.signOut()).pipe(
        catchError(err => {
          return of({catchedError: err})
        })
      )
    )
  )

  // PUBLIC API
  state$ = this._state$.asObservable()
  state = toSignal(this.state$, {requireSync: true})

  user$ = this._state$.pipe(map(state => state.user))
  user = toSignal(this.user$, {requireSync: true})

  status$ = this._state$.pipe(map(state => state.status))
  status = toSignal(this.status$, {requireSync: true})

  error$ = this._state$.pipe(map(state => state.error))
  error = toSignal(this.error$, {requireSync: true})

  // ACTIONS (public, triggers SOURCES)
  login = (email: string, password: string) => {
    this._loading$.next()
    this._login$.next({email, password})
  }

  logout = () => {
    this._loading$.next()
    this._logout$.next()
  }

  constructor() {
    const mayThrow$ = interval(500).pipe(
      take(8),
      map(res => {
        // const random = Math.random()
        // if(random > 0.5) {
        //   return res
        // }
        if(res === 3) {
          throw new Error(`value is less than 0.5...`)
        } else {
          return res
        }
      }),
      catchError(() => EMPTY),
      // catchError((err) => {
      //   console.log('error handle internally here...')
      //   return throwError(() => err)
      // }),
      // finalize(() => console.log('finalize'))
      // retry({delay: (err) => err})
    )
    
    mayThrow$.subscribe({
      next: (res) => { console.log(`next:`); console.log(res) },
      error: (err) => console.log(`error: ${err}`),
      complete: () => console.log('complete')
    })

    // this.fbAuth.authState.subscribe(res => {
    //   const info = res=== undefined ? 'undefined' : res === null ? 'null' : res.email
    //   console.log('fb user changed: ' + info)
    // })

    this._state$.subscribe(res => {
      console.log(`state changed`)
      console.log(res)
    })

    this._userChange$.pipe(
      takeUntilDestroyed(),
    ).subscribe(user => {
      console.log('userChange$ emits')
      this._state$.next({
        ...this._state$.value,
        user,
        status: 'success',
        error: null
      })
      // this._updateState({status: 'success', user})
    })

    this._loading$.pipe(
      takeUntilDestroyed()
    ).subscribe(_ => {
      console.log('_loading$ emits')
      this._updateState({
        status: 'loading'
      })
    })

    this._error$.pipe(
      takeUntilDestroyed()
    ).subscribe(err => {
      console.log('_errors$ emits')
      this._state$.next({
        ...this._state$.value,
        status: 'error',
        error: err
      })
    })

    this._loginResponse$.pipe(
      takeUntilDestroyed(),
    ).subscribe(response => {
      console.log('_loginResponse$ emits')
      if('catchedError' in response) {
        this._updateState({
          status: 'error',
          error: response.catchedError
        })
      } 
      // else {
      //   this._updateState({
      //     status: 'success',
      //     // user: response,
      //     error: null
      //   })
      // }
    })

    this._logoutResponse$.pipe(
      takeUntilDestroyed(),
    ).subscribe(_ => {
      console.log('_logoutResponse$ emits!')
    })

  }

  private _updateState(opts: Partial<AuthState>) {
    const state = this._state$.value
    const user = opts.user ?? state.user
    const status = opts.status ?? state.status
    const error = opts.error ?? state.error

    this._state$.next({user, status, error})
  }

  // private _updateState(options: AuthStateUpdate) {
  //   switch (options.status) {
  //     case 'loading': {
  //       this._state$.next({
  //         status: options.status,
  //         user: null,
  //         error: null
  //       })
  //       break
  //     }
  //     case 'error': {
  //       this._state$.next({
  //         status: options.status,
  //         user: null,
  //         error: options.error
  //       })
  //       break
  //     }
  //     case 'success': {
  //       this._state$.next({
  //         status: options.status,
  //         user: options.user,
  //         error: null
  //       })
  //     }
  //   }
  // }

}