import { inject, Injectable, Signal } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";

import { BehaviorSubject, catchError, delay, empty, EMPTY, filter, finalize, from, interval, map, materialize, NEVER, Observable, of, retry, retryWhen, startWith, Subject, switchMap, take, tap, throwError } from "rxjs";

import { CustomTypeError, LooseAutocomplete, tryCatch, isUser, User } from "./__imports";



type AuthState = {
  status: 'success' | 'error' | 'loading',
  user: User | null
  error: string | null
}

type ResponseSuccess = {response: 'success'}
type ResponseError = {response: 'error', error: string}



@Injectable({providedIn: 'root'})
export class AuthServiceFirebase {

  private fbAuth = inject(AngularFireAuth)

  // STATE
  private _state$ = new BehaviorSubject<AuthState>({
    status: 'loading',
    user: null,
    error: null
  })

  // ACTIONS
  private _login$ = new Subject<{email: string, password: string}>()
  
  private _loginResponse$ = this._login$.pipe(
    switchMap(({email, password}) => {
      return from(this.fbAuth.signInWithEmailAndPassword(email, password)).pipe(
        map(_ => {
          return {response: 'success'} as ResponseSuccess
        }),
        catchError(err => {
          return of({response: 'error', error: err.message} as ResponseError)
        })
      )
    })
  )

  private _logout$ = new Subject<void>()
  
  private _logoutResponse$ = this._logout$.pipe(
    switchMap(() => {
      return from(this.fbAuth.signOut()).pipe(
        map(_ => {
          return {response: 'success'} as ResponseSuccess
        }),
        catchError(err => {
          return of({response: 'error', error: err.message} as ResponseError)
        })
      )
    })
  )

  private _userChange$ = this.fbAuth.authState.pipe(
    map(firebaseUser => {
      if (firebaseUser === null) {
        return null
      }
      const uid = firebaseUser.uid
      const email = firebaseUser.email!
      return {uid, email} as User
    })
  )

  constructor() {
    // REDUCERS

    this._login$.pipe(takeUntilDestroyed()).subscribe(_ => {
      this._updateState({status: 'loading', error: null})
    })

    this._loginResponse$.pipe(takeUntilDestroyed()).subscribe(result => {
      if (result.response === 'success') {
        this._updateState({status: 'success'})
      } else {
        this._updateState({status: 'error', error: result.error})
      }
    })

    this._logout$.pipe(takeUntilDestroyed()).subscribe(_ => {
      this._updateState({status: 'loading', error: null})
    })

    this._logoutResponse$.pipe(takeUntilDestroyed()).subscribe(result => {
      if (result.response === 'success') {
        this._updateState({status: 'success'})
      } else {
        this._updateState({status: 'error', error: result.error})
      }
    })

    this._userChange$.pipe(takeUntilDestroyed()).subscribe(user => {
      this._updateState({user, status: 'success', error: null})
    })

  }

  // PUBLIC API
  state$ = this._state$.asObservable()
  state = toSignal(this.state$, {requireSync: true})

  user$ = this._state$.pipe(map(state => state.user))
  user = toSignal(this.user$, {requireSync: true})

  status$ = this._state$.pipe(map(state => state.status))
  status = toSignal(this.status$, {requireSync: true})

  error$ = this._state$.pipe(map(state => state.error))
  error = toSignal(this.error$, {requireSync: true})

  login = (email: string, password: string) => {
    this._login$.next({email, password})
  }

  logout = () => {
    this._logout$.next()
  }

  private _updateState(opts: Partial<AuthState>) {
    const state = this._state$.value
    this._state$.next({...state, ...opts})
  }

}