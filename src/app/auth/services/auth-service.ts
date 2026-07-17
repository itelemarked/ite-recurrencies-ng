import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, startWith, take } from 'rxjs';
import { onAuthStateChanged, signInWithEmailAndPassword, User as FbUser, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { FirebaseService } from '../../_core/firebase-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthStore } from '../../_types/AuthStore';
import { User } from '../../_types/User';




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
