import { inject, Injectable, Signal } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, map, Observable, startWith, tap } from "rxjs";
import { User } from "../types/User.type";
import { delay } from "@app/utils/testing";


interface AuthServiceInterface {
  user$: Observable<User | null | undefined>
  user: Signal<User | null | undefined>
  login(email: string, password: string): Promise<User>
  signup(email: string, password: string): Promise<User>
  logout(): Promise<void>
}



@Injectable({providedIn: 'root'})
export class AuthService implements AuthServiceInterface {

  private fbAuth = inject(AngularFireAuth)

  /**
   * Needed to trigger changes manually (e.g: set 'loading' state by defining 'undefined')
   * 'fbUser$' changes must also be reflected here!
   */
  private _user$ = new BehaviorSubject<User | null | undefined>(undefined)

  /**
   * Fires when a DIFFERENT user has been chosen (when it really changed!)
   * Possible values are of type User or null (undefined is not applicable here)
   */
  private fbUser$ = this.fbAuth.authState.pipe(
    map(fbUser => {
      if(fbUser === null || fbUser === undefined) return fbUser
      const user: User = { uid: fbUser.uid, email: fbUser.email! }
      return user
    })
  )

  /**
   * Public properties depending directly of '_user$'
   */
  user$ = this._user$.asObservable()
  user = toSignal(this.user$)

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
    if(this._user$?.value?.email === email) {
      return this._user$?.value
    }

    this._user$.next(undefined)
    const credentials = await this.fbAuth.signInWithEmailAndPassword(email, password)
    if (credentials.user === null || credentials.user.email === null) throw new Error(`AUTH-ERROR/LOGIN(): user or email is null...`) 
    const user: User = { uid: credentials.user.uid, email: credentials.user.email}
    return user
  }

  async signup(email: string, password: string) {
    /**
     * see login() RMK: also applicable for 'createUserWithEmailAndPassword()'!
     */
    if(this._user$?.value?.email === email) {
      return this._user$?.value
    }

    this._user$.next(undefined)
    const credentials = await this.fbAuth.createUserWithEmailAndPassword(email, password)
    if (credentials.user === null || credentials.user.email === null) throw new Error(`AUTH-ERROR/SIGNUP(): user or email is null...`) 
    const user: User = { uid: credentials.user.uid, email: credentials.user.email}
    return user
  }

  async logout() {
    /**
     * see login() RMK: also applicable for 'signOut()'!
     */
    if(this._user$?.value === null) {
      return
    }

    this._user$.next(undefined)
    await this.fbAuth.signOut()
  }

}