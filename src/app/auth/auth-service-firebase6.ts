import { inject, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";

import { BehaviorSubject, catchError, from, map, Observable, of, Subject, switchMap, tap } from "rxjs";

import { User } from "./__imports";


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
  private _login$ = new Subject<{email: string, password: string}>()
  private _loginSuccess$ = new Subject<void>()
  private _loginSameUserSuccess$ = new Subject<User>()
  private _loginFailure$ = new Subject<string>()
  private _userChange$ = new Subject<User | null>()


  private createReducer = <T>(action: Subject<T>, callback: (oldState: AuthState, payload: T) => AuthState) => {
    return action.pipe(
      takeUntilDestroyed(),
    ).subscribe((result) => {
      const oldState = this._state$.value
      this._state$.next(callback(oldState, result))
    })
  }

  private createEffect = <T>(action: Observable<T>, callback: (oldState: AuthState, payload: T) => void) => {
    return action.pipe(
      takeUntilDestroyed()
    ).subscribe((result) => {
      const oldState = this._state$.value
      callback(oldState, result)
    })
  }

  constructor() {
    // EFFECTS
    this.createEffect(this._login$, (state, {email, password}) => {
      console.log(`EFFECT - login`)
      const oldUid = state.user?.uid
      this.fbAuth.signInWithEmailAndPassword(email, password)
        .then(result => {
          if(result.user!.uid === oldUid) {
            this._loginSameUserSuccess$.next(state.user!)
          } else {
            this._loginSuccess$.next()
          }
        })
        .catch(err => this._loginFailure$.next(err.message))
    })
    
    this.createEffect(this.fbAuth.authState, (state, user) => {
      console.log(`EFFECT - authState`)
      if (user === null) {
        this._userChange$.next(null)
      } else {
        const uid = user.uid
        const email = user.email!
        this._userChange$.next({uid, email})
      }
    })

    // REDUCERS
    this.createReducer(this._login$, (state, payload) => {
      console.log(`REDUCER - login$`)
      return {
        status: 'loading',
        error: null,
        user: null
      }
    })

    this.createReducer(this._loginSuccess$, (state) => {
      console.log(`REDUCER - loginSuccess$`)
      return {
        status: 'success',
        error: null,
        user: null
      }
    })

    this.createReducer(this._loginSameUserSuccess$, (state, user) => {
      console.log(`REDUCER - loginSameUserSuccess$`)
      return {
        status: 'success',
        error: null,
        user
      }
    })

    this.createReducer(this._userChange$, (state, user) => {
      console.log(`REDUCER - userChange$`)
      return {
        status: 'success',
        error: null,
        user
      }
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