
/**
 * RXJS way
 * As simple as possible... only with Subjects and BehaviorSubjects
 */


import { inject, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";

import { BehaviorSubject, catchError, from, map, Observable, of, Subject, switchMap, tap } from "rxjs";

import { User } from "./__imports";
import { Prettify } from "@app/_utils/custom-utility-types/Prettify";


type AuthStateSuccess = {
  status: 'success',
  error: null
  user: User | null
}

type AuthStateError = {
  status: 'error',
  error: string
  user: null
}

type AuthStateLoading = {
  status: 'loading',
  error: null
  user: null
}

type AuthState = AuthStateSuccess | AuthStateError | AuthStateLoading



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
  private _loginSuccess$ = new Subject<void>()
  private _loginSameUserSuccess$ = new Subject<User>()
  private _loginFailure$ = new Subject<string>()
  private _userChange$ = new Subject<User | null>()


  constructor() {
    // EFFECTS
    this._login$.pipe(takeUntilDestroyed()).subscribe(({email, password}) => {
      console.log(`EFFECT - login`)
      const state = this._state$.value
      this.fbAuth.signInWithEmailAndPassword(email, password)
        .then(result => {
          if(result.user!.uid === state.user?.uid) {
            this._loginSameUserSuccess$.next(state.user!)
          } else {
            this._loginSuccess$.next()
          }
        })
        .catch(err => this._loginFailure$.next(err.message))
    })

    this.fbAuth.authState.pipe(takeUntilDestroyed()).subscribe((result) => {
      console.log(`EFFECT - authState`)
      if (result === null) {
        this._userChange$.next(null)
      } else {
        const uid = result.uid
        const email = result.email!
        this._userChange$.next({uid, email})
      }
    })

    // REDUCERS
    this._login$.pipe(takeUntilDestroyed()).subscribe((result) => {
      console.log(`REDUCER - login$`)
      this._state$.next({
        status: 'loading',
        error: null,
        user: null
      })
    })

    this._loginSuccess$.pipe(takeUntilDestroyed()).subscribe((result) => {
      console.log(`REDUCER - loginSuccess$`)
      this._state$.next({
        status: 'success',
        error: null,
        user: null
      })
    })

    this._loginSameUserSuccess$.pipe(takeUntilDestroyed()).subscribe((result) => {
      console.log(`REDUCER - loginSameUserSuccess$`)
      this._state$.next({
        status: 'success',
        error: null,
        user: result
      })
    })

    this._userChange$.pipe(takeUntilDestroyed()).subscribe((result) => {
      console.log(`REDUCER - userChange$`)
      this._state$.next({
        status: 'success',
        error: null,
        user: result
      })
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

  login = (email: string, password: string) => this._login$.next({email, password})

}