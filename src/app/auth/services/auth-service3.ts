import { inject, Injectable, Signal } from '@angular/core';
import { BehaviorSubject, filter, from, map, Observable, startWith, Subject, switchMap, take } from 'rxjs';
import { onAuthStateChanged, signInWithEmailAndPassword, User as FbUser, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { FirebaseService } from '../../_core/firebase-service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AuthStore } from '../../_types/AuthServiceInterface';
import { User } from '../../_types/User';


// TODO:
// Fix freeze when it errored... (probably need to catch the error)
// Error object to be enhanced (AuthError iso Error)??

export interface AuthServiceInterface3 {
  user$: Observable<User | null | undefined>
  user: Signal<User | null | undefined>
  isLoading$: Observable<boolean>
  isLoading: Signal<boolean>
  error$: Observable<Error | null>
  error: Signal<Error | null>

  login: (email: string, password: string) => void
  signup: (email: string, password: string) => void
  logout: () => void
}



@Injectable({ providedIn: 'root' })
export class AuthService3 implements AuthServiceInterface3 {
  // export class AuthService {
  private auth = inject(FirebaseService).auth

  // STATE
  private state = {
    user$: new BehaviorSubject<User | null | undefined>(undefined),
    isLoading$: new BehaviorSubject<boolean>(true),
    error$: new BehaviorSubject<Error | null>(null)
  }

  // ACTIONS
  private onAuthStateChange$ = new Observable<FbUser | null>(subscriber => {
    const unsubscribe = onAuthStateChanged(this.auth, {
      next: (fbUser) => subscriber.next(fbUser),
      error: (authError) => subscriber.error(authError),
      complete: () => subscriber.complete()
    })
    subscriber.add(() => unsubscribe())
  }).pipe(
    map(fbUser => fbUser === null ? null : { email: fbUser.email!, uid: fbUser.uid } as User)
  )
  private loginRequest$ = new Subject<{email: string, password: string}>()
  private loginResponse$ = this.loginRequest$.pipe(
    switchMap(({email, password}: {email: string, password: string}) => from(signInWithEmailAndPassword(this.auth, email, password))),
  )
  private signupRequest$ = new Subject<{email: string, password: string}>()
  private signupResponse$ = this.signupRequest$.pipe(
    switchMap(({email, password}: {email: string, password: string}) => from(createUserWithEmailAndPassword(this.auth, email, password)))
  )
  private logoutRequest$ = new Subject<void>()
  private logoutResponse$ = this.logoutRequest$.pipe(
    switchMap(() => from(signOut(this.auth)))
  )
  

  // SELECTORS
  user$ = this.state['user$'].asObservable()
  user = toSignal(this.user$, {requireSync: true})

  isLoading$ = this.state.isLoading$.asObservable()
  isLoading = toSignal(this.state.isLoading$, {requireSync: true})

  error$ = this.state.error$.asObservable()
  error = toSignal(this.state.error$, {requireSync: true})


  constructor() {
    // REDUCERS
    this.onAuthStateChange$.pipe(takeUntilDestroyed()).subscribe({
      next: (user: User | null) => {
        this.state.user$.next(user)
        this.state.isLoading$.next(false),
        this.state.error$.next(null)
      },
      error: (err: Error) => {
        this.state.isLoading$.next(false),
        this.state.error$.next(err)
      },
    })

    this.loginRequest$.pipe(takeUntilDestroyed()).subscribe({
      next: (_) => {
        this.state.isLoading$.next(true),
        this.state.error$.next(null)
      }
    })

    this.loginResponse$.pipe(takeUntilDestroyed()).subscribe({
      error: (err: Error) => {
        this.state.isLoading$.next(false)
        this.state.error$.next(err)
      }
    })

    this.signupRequest$.pipe(takeUntilDestroyed()).subscribe({
      next: (_) => {
        this.state.isLoading$.next(true),
        this.state.error$.next(null)
      }
    })

    this.signupResponse$.pipe(takeUntilDestroyed()).subscribe({
      error: (err: Error) => {
        this.state.isLoading$.next(false)
        this.state.error$.next(err)
      }
    })

    this.logoutRequest$.pipe(takeUntilDestroyed()).subscribe({
      next: (_) => {
        this.state.isLoading$.next(true),
        this.state.error$.next(null)
      }
    })

    this.logoutResponse$.pipe(takeUntilDestroyed()).subscribe({
      error: (err: Error) => {
        this.state.isLoading$.next(false)
        this.state.error$.next(err)
      }
    })
  }


  login(email: string, password: string) {
    this.loginRequest$.next({email, password})
  }

  signup(email: string, password: string) {
    this.signupRequest$.next({email, password})
  }

  logout() {
    this.logoutRequest$.next()
  }

  

}
