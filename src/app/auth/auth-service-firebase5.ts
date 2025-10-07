import { inject, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";

import { BehaviorSubject, catchError, from, map, of, Subject, switchMap, tap } from "rxjs";

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

// type AuthStateSuccess = {
//   status: 'success',
//   error: null
//   user: User | null
// }

// type AuthStateError = {
//   status: 'error',
//   error: string
//   user: null
// }

// type AuthStateLoading = {
//   status: 'loading',
//   error: null
//   user: null
// }

// type AuthState = Prettify<AuthStateSuccess | AuthStateError | AuthStateLoading>

// type AuthState = {
//   status: 'success' | 'error' | 'loading',
//   error: string | null
//   user: User | null
// }



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
  private _init() {
    this.fbAuth.authState.pipe(
      map((firebaseUser) => {
        if (firebaseUser === null) {
          return null
        }
        const uid = firebaseUser.uid
        const email = firebaseUser.email!
        return {uid, email} as User
      })
    ).subscribe((user) => this._state$.next({
      status: 'success',
      error: null,
      user
    }))
  }

  private _login(email: string, password: string) {
    this._setStateLoading()

    this.fbAuth.signInWithEmailAndPassword(email, password)
    .catch((err) => this._setStateError(err.message))
  }


  // UTILS
  // private _updateState(opts: Partial<AuthStateSuccess> | Partial<AuthStateError> | Partial<AuthStateLoading>) {
  private _setStateSuccess(user: User | null) {
    this._state$.next({
      status: 'success',
      error: null,
      user
    })
  }

  private _setStateError(error: string) {
    this._state$.next({
      status: 'error',
      error,
      user: null
    })
  }

  private _setStateLoading() {
    this._state$.next({
      status: 'loading',
      error: null,
      user: null
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

  login = this._login

}