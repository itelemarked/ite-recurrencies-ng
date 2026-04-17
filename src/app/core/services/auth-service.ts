import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, startWith, Subject, take, tap } from 'rxjs';
import { User } from '../../recurrencies/types/User';
import { onAuthStateChanged, signInWithEmailAndPassword, User as FbUser, AuthError, ErrorFn, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { FirebaseService } from '../firebase-service';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthStore } from '../types/AuthStore';




@Injectable({ providedIn: 'root' })
export class AuthService implements AuthStore {
// export class AuthService {
  private auth = inject(FirebaseService).auth

  // ACTIONS
  private _onAuthStateChangeToObservable$ =  new Observable<FbUser | null>(subscriber => {
    const unsubscribe = onAuthStateChanged(this.auth, {
      next: (fbUser) => subscriber.next(fbUser),
      error: (authError) => subscriber.error(authError),
      complete: () => subscriber.complete()
    })
    subscriber.add(() => unsubscribe())
  })
  private _isLoading$ = new BehaviorSubject<boolean>(true)
  private _error$ = new BehaviorSubject<string | null>(null)

  // SELECTORS
  user$ = this._onAuthStateChangeToObservable$.pipe(
    map(fbUser => {
      return fbUser === null ? null : { email: fbUser.email!, uid: fbUser.uid } as User
    }),
    startWith(undefined)
  )
  user = toSignal(this.user$, {requireSync: true})

  isLoading$ = this._isLoading$.asObservable()
  isLoading = toSignal(this._isLoading$, {requireSync: true})

  error$ = this._error$.asObservable()
  error = toSignal(this._error$, {requireSync: true})


  constructor() {
    this.user$.pipe(
      filter(usr => usr !== undefined),
      take(1)
    ).subscribe(_ => this._isLoading$.next(false))
  }


  async login(email: string, password: string): Promise<void> {
    this._isLoading$.next(true)
    this._error$.next(null)
    try {
      await signInWithEmailAndPassword(this.auth, email, password)
      this._isLoading$.next(false)
    }
    catch (err: any) {
      this._error$.next(err.code)
      this._isLoading$.next(false)
    }
  }

  async signup(email: string, password: string): Promise<void> {
    this._isLoading$.next(true)
    this._error$.next(null)

    try {
      const credentials = await createUserWithEmailAndPassword(this.auth, email, password)
      this._isLoading$.next(false)
    }
    catch (err: any) {
      this._error$.next(err.code)
      this._isLoading$.next(false)
    }
  }

  async logout(): Promise<void> {
    this._isLoading$.next(true)
    this._error$.next(null)

    try {
      await signOut(this.auth)
      this._isLoading$.next(false)
    }
    catch(err: any) {
      this._error$.next(err.code)
      this._isLoading$.next(false)
    }
  }

}




// type AuthState = {
//   user : User | null | undefined,
//   loading: boolean,
//   error: string | null | undefined
// }

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private auth = inject(FirebaseService).auth

//   // STATE
//   private state = signal<AuthState>({
//     user: undefined,
//     loading: true,
//     error: undefined
//   })

//   // SELECTORS


//   // ACTIONS
//   private changeRequest$ = new Subject<void>
//   private changeSucess$ = new Observable<User | null>((subscriber) => {
//     const unsubscribe = onAuthStateChanged(this.auth, (fbUser) => {
//       if(fbUser === null) {
//         subscriber.next(null)
//       } else {
//         const user = { email: fbUser.email!, uid: fbUser.uid }
//         subscriber.next(user)
//       }
//     })
//     subscriber.add(() => unsubscribe())
//   })
//   private changeFailure$ = new Subject<string>()

//   constructor() {
    
//     // REDUCERS
//     this.changeRequest$.pipe(takeUntilDestroyed()).subscribe(_ => {
//       this.state.update(state => ({
//         ...state,
//         loading: true,
//         error: null
//       }))
//     })

//     this.changeSucess$.pipe(takeUntilDestroyed()).subscribe(val => {
//       this.state.set({
//         error: null,
//         loading: false,
//         user: val
//       })
//     })

//     this.changeFailure$.pipe(takeUntilDestroyed()).subscribe(val => {
//       this.state.update(state => ({
//         ...state,
//         error: val,
//         loading: false,
//       }))
//     })
//   }

//   async login(email: string, password: string): Promise<void> {
//     this.changeRequest$.next()
//     try {
//       const credentials = await signInWithEmailAndPassword(this.auth, email, password)
//     }
//     catch(err: any) {
//       this.changeFailure$.next(err.code)
//     }
//   }

// }





// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private auth = inject(FirebaseService).auth

//   private _user$ = new Observable<User | null>((subscriber) => {
//     const unsubscribe = onAuthStateChanged(this.auth, (fbUser) => {
//       if(fbUser === null) {
//         subscriber.next(null)
//       } else {
//         const user = { email: fbUser.email!, uid: fbUser.uid }
//         subscriber.next(user)
//       }
//     })
//     subscriber.add(() => unsubscribe())
//   })
//   user$ = this._user$
//   user = toSignal(this._user$, {initialValue: undefined})

//   private _loading$ = new BehaviorSubject<boolean>(true)
//   loading$ = this._loading$.asObservable()
//   loading = toSignal(this._loading$, {requireSync: true})

//   constructor() {
//     this.user$.pipe(take(1)).subscribe(_ => this._loading$.next(false))
//   }

// }