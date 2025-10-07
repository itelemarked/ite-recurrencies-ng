import { inject, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";

import { BehaviorSubject, catchError, from, map, of, Subject, switchMap, tap } from "rxjs";

import { User } from "./__imports";


type AuthState = {
  status: 'success' | 'error' | 'loading',
  user: User | null
  error: string | null
}


type ResponseSuccess = {response: 'success', payload?: Record<string, any>}
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

  // ACTIONS - SOURCES
  private _login$ = new Subject<{email: string, password: string}>()
  private _logout$ = new Subject<void>()
  
  private _loginResponse$ = this._login$.pipe(
    switchMap(({email, password}) => {
      return from(this.fbAuth.signInWithEmailAndPassword(email, password)).pipe(
        map((result) => {
          return { response: 'success', payload: {userUid: result.user!.uid} } as ResponseSuccess
        }),
        catchError(err => {
          return of({response: 'error', error: err.message} as ResponseError)
        })
      )
    }),
  )
  
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
    map((firebaseUser) => {
      if (firebaseUser === null) {
        return null
      }
      const uid = firebaseUser.uid
      const email = firebaseUser.email!
      return {uid, email} as User
    })
  )

  constructor() {
    // EFFECTS (applies side effects (calls http requests, dispatches other actions, etc...))


    // REDUCERS (changes state only!)

    this._login$.pipe(
      takeUntilDestroyed(),
      tap((res) => console.log(`REUCER - login$ emits: ${JSON.stringify(res)}`))
    ).subscribe(_ => {
      const state = this._state$.value
      this._state$.next({...state, status: 'loading', error: null})
    })

    this._loginResponse$.pipe(
      takeUntilDestroyed(),
      tap((res) => console.log(`REUCER - loginResponse$ emits: ${JSON.stringify(res)}`))
    ).subscribe(result => {
      const state = this._state$.value
      const sameUser = result.response === 'success' && state.user !== null && result.payload!['userUid'] === state.user.uid
      if (sameUser) {
        this._state$.next({...state, status: 'success'})
      } else if (result.response === 'success') {
        this._state$.next({...state, status: 'success', error: null})
      } else {
        this._state$.next({...state, status: 'error', error: result.error})
      }
    })

    this._logout$.pipe(
      takeUntilDestroyed(),
      tap((res) => console.log(`REUCER - logout$ emits: ${JSON.stringify(res)}`))
    ).subscribe(_ => {
      const state = this._state$.value
      this._state$.next({...state, status: 'loading', error: null})
    })

    this._logoutResponse$.pipe(
      takeUntilDestroyed(),
      tap((res) => console.log(`REUCER - logoutResponse$ emits: ${JSON.stringify(res)}`))
    ).subscribe(result => {
      const state = this._state$.value
      if (result.response === 'success') {
        this._state$.next({...state, status: 'success', error: null})
      } else {
        this._state$.next({...state, status: 'error', error: result.error})
      }
    })

    this._userChange$.pipe(
      takeUntilDestroyed(),
      tap((res) => console.log(`REUCER - userChange$ emits: ${JSON.stringify(res)}`))
    ).subscribe((user) => {
      const state = this._state$.value
      this._state$.next({...state, user, status: 'success', error: null})
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

}