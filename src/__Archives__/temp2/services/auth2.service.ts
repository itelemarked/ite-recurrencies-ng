import { inject, Injectable, Signal } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { toSignal } from "@angular/core/rxjs-interop";

import firebase from 'firebase/compat/app';

import { BehaviorSubject, map, Observable, startWith, tap } from "rxjs";
import { DataRequest } from "@app/types/DataRequest.type";
import { User } from "@app/types/User.type";



interface AuthServiceInterface {
  user$: Observable<DataRequest<User>>
  user: Signal<DataRequest<User>>
  login(email: string, password: string): Promise<User>
  signup(email: string, password: string): Promise<User>
  logout(): Promise<void>
}



@Injectable({providedIn: 'root'})
export class Auth2Service implements AuthServiceInterface {

  private fbAuth = inject(AngularFireAuth)

  /**
   * Needed to trigger changes manually (e.g: set 'loading' state by defining 'undefined')
   * 'fbUser$' changes must also be reflected here!
   */
  private _user$ = new BehaviorSubject<DataRequest<User>>({state: 'loading'})

  /**
   * Fires first on subscription after initial fetch,
   * and then when a DIFFERENT user has been chosen (when it really changed!)
   * Possible values are of type User or null (undefined is not applicable here)
   */
  private fbUser$ = this.fbAuth.authState.pipe(
    map((usr: firebase.User | null): DataRequest<User> => {
      if(usr === null) return {state: 'data-not-found'}
      const user: User = { uid: usr.uid, email: usr.email! }
      return { state: 'data-found', value: user }
    })
  )

  /**
   * Public properties depending directly of '_user$'
   */
  user$ = this._user$.asObservable()
  user = toSignal(this.user$, {requireSync: true})

  constructor() {
    /**
     * reflects 'fbUser$' changes to '_user$'
     */
    this.fbUser$.subscribe(usr => this._user$.next(usr))
  }

  async login(email: string, password: string) {
    /**
     * RMK:
     * - signInWithEmailAndPassword() with resolve a Promise EVERY TIME it is called
     * - authState observable will fire ONLY if there is a CHANGE in the user
     * 
     * When calling signInWithEmailAndPassword() multiple times for the same user, the observables will fire only at most once: the first time (if the user really change)!
     * It is not necessary to let signInWithEmailAndPassword() be called multiple times for the same user... although it won't make any difference...
     * BUT: Be sure to reset the _user$ observable in order to reflect the 'loading state' ['this._user$.next(undefined)'] only when signInWithEmailAndPassword() is called for a different user!!  
     */
    if(this._user$.value.state === 'data-found' && this._user$.value.value.email === email) {
      return this._user$.value.value
    }

    this._user$.next({state: 'loading'})
    const credentials = await this.fbAuth.signInWithEmailAndPassword(email, password)
    if (credentials.user === null || credentials.user.email === null) throw new Error(`AUTH-ERROR/LOGIN(): user or email is null...`) 
    const user: User = { uid: credentials.user.uid, email: credentials.user.email}
    return user
  }

  async signup(email: string, password: string) {
    /**
     * see login() RMK: also applicable for 'createUserWithEmailAndPassword()'!
     */
    if(this._user$.value.state === 'data-found' && this._user$.value.value.email === email) {
      return this._user$.value.value
    }

    this._user$.next({state: 'loading'})
    const credentials = await this.fbAuth.createUserWithEmailAndPassword(email, password)
    if (credentials.user === null || credentials.user.email === null) throw new Error(`AUTH-ERROR/SIGNUP(): user or email is null...`) 
    const user: User = { uid: credentials.user.uid, email: credentials.user.email}
    return user
  }

  async logout() {
    /**
     * see login() RMK: also applicable for 'signOut()'!
     */
    if(this._user$.value.state === 'data-not-found') {
      return
    }

    this._user$.next({state: 'loading'})
    await this.fbAuth.signOut()
  }

}