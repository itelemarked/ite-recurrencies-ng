import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';
import { onAuthStateChanged, signInWithEmailAndPassword, User as FbUser, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

import { assertError } from '../../../js/errors/assertError';
import { FirebaseService } from '../../_core/firebase-service';
import { User } from '../../_types/User';



// CLASSIC WAY (METHODS)

@Injectable({ providedIn: 'root' })
export class AuthService {
  // export class AuthService {
  private auth = inject(FirebaseService).auth

  // STATE
  private state = {
    user$: new BehaviorSubject<User | null | undefined>(undefined),
    isLoading$: new BehaviorSubject<boolean>(true),
    error$: new BehaviorSubject<Error | null>(null)
  }

  setStateRequestStarted() {
    this.state.error$.next(null)
    this.state.isLoading$.next(true)
  }

  setStateRequestSucceeded(settings: User | null | undefined) {
    this.state.user$.next(settings)
    this.state.error$.next(null)
    this.state.isLoading$.next(false)
  }

  setStateRequestFailed(error: Error) {
//     this.state.user$.next(null)
    this.state.error$.next(error)
    this.state.isLoading$.next(false)
  }


  constructor() {
    // never errors
    // is triggered suddenly (backend changes) or upon user actions.
    onAuthStateChanged(this.auth, (fbUser) => {
      this.backendDataChangeSucceeded(fbUser)
    })
  }

  // ACTIONS
  
  private backendDataChangeSucceeded(fbUser: FbUser | null) {
    if(!!fbUser) {
      const uid = fbUser.uid
      const email = fbUser.email!
      this.state.user$.next({uid, email})
    }
    else {
      this.state.user$.next(fbUser)
    }

    this.state.isLoading$.next(false)
    this.state.error$.next(null)
  }

  private loginRequest(email: string, password: string) {
    if(!!this.state.user$.value && email !== this.state.user$.value.email) {
      this.state.isLoading$.next(true)
      this.state.error$.next(null)

      signInWithEmailAndPassword(this.auth, email, password)
        .catch(err => {
          const error = assertError(err)
          this.state.isLoading$.next(false)
          this.state.error$.next(error)
        })
    }
  }

  private signupRequest(email: string, password: string) {
    if(!!this.state.user$.value && email !== this.state.user$.value.email) {
      this.state.isLoading$.next(true)
      this.state.error$.next(null)

      createUserWithEmailAndPassword(this.auth, email, password)
        .catch(err => {
          const error = assertError(err)
          this.state.isLoading$.next(false)
          this.state.error$.next(error)
        })
    }
  }

  private logoutRequest() {
    if(!!this.state.user$ !== null && this.state.user$ !== undefined) {
      this.state.isLoading$.next(true)
      this.state.error$.next(null)

      signOut(this.auth)
        .catch(err => {
          const error = assertError(err)
          this.state.isLoading$.next(false)
          this.state.error$.next(error)
        })
    }
  }

  // SELECTORS
  public readonly user$ = this.state.user$.asObservable()
  public readonly user = toSignal(this.user$, {requireSync: true})
  public readonly isLoading$ = this.state.isLoading$.asObservable()
  public readonly isLoading = toSignal(this.state.isLoading$, {requireSync: true})
  public readonly error$ = this.state.error$.asObservable()
  public readonly error = toSignal(this.state.error$, {requireSync: true})

  public readonly login = (email: string, password: string) => this.loginRequest(email, password)
  public readonly signup = (email: string, password: string) => this.signupRequest(email, password)
  public readonly logout = () => this.logoutRequest()

}












// WITH SIGNAL STATE???

// type StoreStateLoading<T> = {
//   status: 'loading',
//   data: T | null | undefined
// }
// type StoreStateSuccess<T> = {
//   status: 'success',
//   data: T | null
// }
// type StoreStateError<T> = {
//   status: 'error',
//   data: T | null | undefined
//   error: Error
// }
// type StoreState<T> = StoreStateLoading<T> | StoreStateSuccess<T> | StoreStateError<T>



// type StateLoading = {
//   status: 'loading',
//   user: User | null | undefined
//   isLoading: true,
//   error: null,
// }
// type StateSuccess = {
//   status: 'success',
//   user: User | null | undefined
//   isLoading: false,
//   error: null,
// }
// type StateError = {
//   status: 'error',
//   user: User | null
//   isLoading: false,
//   error: Error
// }
// type State = StateLoading | StateSuccess | StateError

// type StateOptionLoading = {
//   status: 'loading',
// }
// type StateOptionSuccess = {
//   status: 'success',
//   user: User | null | undefined
// }
// type StateOptionError = {
//   status: 'error',
//   error: Error
// }
// type StateOption = StateOptionLoading | StateOptionSuccess | StateOptionError


// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   // CONST
//   private auth = inject(FirebaseService).auth

//   private userBackendChange$ = new Observable<FbUser | null>(subscriber => {
//     const unsubscribe = onAuthStateChanged(this.auth, (fbUser) => subscriber.next(fbUser))
//     subscriber.add(() => unsubscribe())
//   })

//   // STATE
//   private state = signal<StoreState<User>>({
//     status: 'loading',
//     data: undefined,
//   })


//   constructor() {}

//   // ACTIONS
  


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
