import { computed, inject, Injectable, Signal } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { toSignal } from "@angular/core/rxjs-interop";

import firebase from 'firebase/compat/app';

import { BehaviorSubject, map, Observable, tap} from "rxjs";

import { User } from "@app/types/User.type";
import { isInterface, isString } from "@app/utils/validation/validation";
import { tryCatch } from "@app/utils/errors/try-catch";



interface AuthServiceInterface {
  user$: Observable<User | null | undefined>
  user: Signal<User | null | undefined>
  isLoading: Signal<boolean>
  login(email: string, password: string): Promise<User>
  signup(email: string, password: string): Promise<User>
  logout(): Promise<void>
}



@Injectable({providedIn: 'root'})
export class Auth5Service implements AuthServiceInterface {

  private fbAuth = inject(AngularFireAuth)

  // private _loading$ = new BehaviorSubject<boolean>(true)
  private _user$ = new BehaviorSubject<User | null | undefined>(undefined)

  /**
   * emits when the user changes on the firebase backend
   */
  private _userChange$ = this.fbAuth.authState.pipe(
    map((usr: firebase.User | null): User | null => {
      if(usr === null) return null
      
      const user = {uid: usr.uid, email: usr.email}
      if(!isInterface<User>({
        email: [isString],
        uid: [isString]
      })(user)) throw new Error(`Invalid data. Is not an User Interface: ${usr}`)

      return user
    })
  )

  /**
   * Public properties depending directly of '_user$'
   */
  // loading$ = this._loading$.asObservable()
  user$ = this._user$.asObservable()
  user = toSignal(this.user$, {requireSync: true})
  isLoading = computed(() => this.user() === undefined)
  

  constructor() {
    /**
     * update 'user$' when changes occur on the firebase backend.
     */
    this._userChange$.subscribe(usr => {
      // this._loading$.next(false)
      this._user$.next(usr)
    })
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
    const oldUser = this._user$.value
    if(oldUser?.email === email) {
      return oldUser
    }

    this._user$.next(undefined)
    const [error, credentials] = await tryCatch(this.fbAuth.signInWithEmailAndPassword(email, password))
    if(error) {
      // sync with fbAuth user, which hasn't changed.
      this._user$.next(oldUser)
      // re-throw
      throw error
    }
    if (credentials.user === null || credentials.user.email === null) throw new Error(`AUTH-ERROR/LOGIN(): user or email is null...`) 
    const user: User = { uid: credentials.user.uid, email: credentials.user.email}
    return user
    // const credentials = await this.fbAuth.signInWithEmailAndPassword(email, password)
    // if (credentials.user === null || credentials.user.email === null) throw new Error(`AUTH-ERROR/LOGIN(): user or email is null...`) 
    // const user: User = { uid: credentials.user.uid, email: credentials.user.email}
    // return user
  }

  async signup(email: string, password: string) {
    /**
     * see login() RMK: also applicable for 'createUserWithEmailAndPassword()'!
     */
    const oldUser = this._user$.value
    if(oldUser?.email === email) {
      return oldUser
    }

    this._user$.next(undefined)
    const [error, credentials] = await tryCatch(this.fbAuth.createUserWithEmailAndPassword(email, password))
    if(error) {
      // sync with fbAuth user, which hasn't changed.
      this._user$.next(oldUser)
      // re-throw
      throw error
    }
    if (credentials.user === null || credentials.user.email === null) throw new Error(`AUTH-ERROR/SIGNUP(): user or email is null...`) 
    const user: User = { uid: credentials.user.uid, email: credentials.user.email}
    return user
  }

  async logout() {
    /**
     * see login() RMK: also applicable for 'signOut()'!
     */
    const oldUser = this._user$.value
    if(oldUser === null) {
      return
    }

    this._user$.next(undefined)
    const [error] = await tryCatch(this.fbAuth.signOut())
    if(error) {
      // sync with fbAuth user, which hasn't changed.
      this._user$.next(oldUser)
      // re-throw
      throw error
    }
    return
  }

}