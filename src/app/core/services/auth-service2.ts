import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, filter, first, map, merge, Observable, skip, startWith, Subject, take, tap } from 'rxjs';
import { User } from '../../recurrencies/types/User';
import { onAuthStateChanged, signInWithEmailAndPassword, User as FbUser, AuthError, ErrorFn, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { FirebaseService } from '../firebase-service';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthStore } from '../types/AuthStore';




type AuthState = {
  user: User | null | undefined,
  isLoading: boolean,
  error: string | null
}

type AuthRequestParams = {
  email: string,
  password: string
}




@Injectable({ providedIn: 'root' })
export class AuthService2 {
  private auth = inject(FirebaseService).auth

  private _realtimeChange$ = new Observable<User | null>(subscriber => {
    const unsubscribe = onAuthStateChanged(this.auth, {
      next: (fbUser) => subscriber.next(fbUser === null ? null : {email: fbUser.email!, uid: fbUser.uid}),
      error: (authError) => subscriber.error(authError),
      complete: () => subscriber.complete()
    })
    subscriber.add(() => unsubscribe())
  })
  private _initialLoadComplete$ = this._realtimeChange$.pipe(take(1))
  private _authRequest$ = new Subject<{email: string, password: string}>()
  private _logoutRequest$ = new Subject<void>()
  private _authSuccess$ = new Subject<void>()
  private _authFailure$ = new Subject<string>()
  private _logoutSuccess$ = new Subject<void>()
  private _logoutFailure$ = new Subject<string>()

  private _user$ = merge(
    this._realtimeChange$.pipe(skip(1)),
    this._initialLoadComplete$
  ).pipe(
    startWith(undefined)
  )

  private _isLoading$ = merge(
    this._authRequest$.pipe(map(_ => true)),
    this._logoutRequest$.pipe(map(_=> true)),
    this._initialLoadComplete$.pipe(map(_ => false)),
    this._authSuccess$.pipe(map(_=> false)),
    this._logoutSuccess$.pipe(map(_=> false)),
    this._authFailure$.pipe(map(_=> false)),
    this._logoutFailure$.pipe(map(_=> false)),
  ).pipe(
    startWith(true)
  )

  private _error$ = merge(

  ).pipe(startWith(null))

  constructor() {}

  isLoading$ = this._isLoading$
  isLoading = toSignal(this.isLoading$, {requireSync: true})

  user$ = this._user$
  user = toSignal(this.user$, {requireSync: true})

  error$ = this._error$
  error = toSignal(this.error$, {requireSync: true})

  login = (email: string, password: string) => this._authRequest$.next({email, password})
  signup = (email: string, password: string) => this._authRequest$.next({email, password})
  logout = () => this._logoutRequest$.next()

}





// type AuthState = {
//   user: User | null | undefined,
//   isLoading: boolean,
//   error: string | null
// }

// type AuthRequestParams = {
//   email: string,
//   password: string
// }




// @Injectable({ providedIn: 'root' })
// export class AuthService2 {

//   private state = signal<AuthState>({
//     user: undefined,
//     isLoading: false,
//     error: null
//   })

//   private actions = {
//     'loginRequest$': new Subject<AuthRequestParams>(),
//     'loginSuccess$': new Subject<void>()
//   }

//   constructor() {

//     this.actions.loginRequest$.pipe(takeUntilDestroyed()).subscribe(_ => this.state.update(state => ({
//       ...state,
//       isLoading: true,
//       error: null
//     })))
//   }

//   isLoading = computed(() => this.state().isLoading)
//   login = (email: string, password: string) => this.actions.loginRequest$.next({email, password})

// }







// type StateOptions = {
//   states: any,
//   actions: any,
//   reducers: any,
//   effects: any
// }
// // type StateOptions<TState> = {
// //   states: Record<string, WritableSignal<any>>,
// //   actions: Record<string, Subject<any>>,
// //   reducers: Record<string, (state: TState) => TState>,
// //   effects: any
// // }

// const createState = <TState>(opts: StateOptions) => {
//   const states = opts.states
//   const actions = opts.actions
//   const reducers = Object.entries(opts.reducers).map(([actionName, stateModifierFn]) => {
//     return {
//       actionName,
//       stateModifierFn
//     }
//   })

//   reducers.forEach(r => actions[r.actionName].subscribe((params: any) => {
//     (r.stateModifierFn as any)(params, states)
//   }))

//   return {
//     states,
//     actions
//   }
// }

// const state = <T>(val: any) => signal<T>(val)
// const action = <T>() => new Subject<T>()
// const reducer = <TState>(stateModifierFn: (actionParams: any, state: TState) => TState): (actionParams: any, state: TState) => TState => {
//   return stateModifierFn
// }



// const s = createState({
//   states: {
//     user: state<User | null | undefined>(undefined),
//     isLoading: state<boolean>(false),
//     error: state<string | null>(null)
//   },
//   actions: {
//     loginRequest: action<AuthRequestParams>()
//   },
//   reducers: {
//     loginRequest: reducer<AuthState>((actionParams, state) => ({
//       ...state,
//       isLoading: true
//     }))
//   },
//   effects: {
//     // loginRequest: effect((actions) => {

//     // })
//   }
// })


// @Injectable({ providedIn: 'root' })
// export class AuthService2 {
//   private auth = inject(FirebaseService).auth

//   // STATE
//   // private store = createState({
//   //   states: {
//   //     user: state<User | null | undefined>(undefined),
//   //     isLoading: state<boolean>(true),
//   //     error: state<string | null>(null)
//   //   },
//   //   actions: {
//   //     loginRequest: action<AuthRequestParams>()
//   //   },
//   //   reducers: {
//   //     loginRequest: reducer<AuthState>((state) => ({
//   //       ...state,
//   //       isLoading: true
//   //     }))
//   //   },
//   //   effects: {
//   //     loginRequest: effect((actions) => {

//   //     })
//   //   }
//   // })
  

//   // ACTIONS
//   private _onAuthBackendChange$ =  new Observable<FbUser | null>(subscriber => {
//     const unsubscribe = onAuthStateChanged(this.auth, {
//       next: (fbUser) => subscriber.next(fbUser),
//       error: (authError) => subscriber.error(authError),
//       complete: () => subscriber.complete()
//     })
//     subscriber.add(() => unsubscribe())
//   })
//   private _loginRequest$ = new Subject<{email: string, password: string}>()

//   // SELECTORS


//   constructor() {
    
//   }

//   // login = (email: string, password: string) => this.store.dispatchAction('login')

// }