import { inject, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { toSignal } from "@angular/core/rxjs-interop";

import firebase from 'firebase/compat/app';

import { BehaviorSubject, map, tap} from "rxjs";

import { DataRequest, DataRequestDataFound, DataRequestNoDataFound } from "@app/types/DataRequest.type";
import { User } from "@app/types/User.type";
import { isInterface, isString } from "@app/utils/validation/validation";






// interface AuthServiceInterface {
//   user$: Observable<DataRequest<User>>
//   user: Signal<DataRequest<User>>
//   login(email: string, password: string): Promise<User>
//   signup(email: string, password: string): Promise<User>
//   logout(): Promise<void>
// }



@Injectable({providedIn: 'root'})
export class Auth3Service {

  private fbAuth = inject(AngularFireAuth)

  private _currentUser$ = new BehaviorSubject<DataRequest<User>>({state: 'loading'})

  /**
   * emits when the user changes on the firebase backend
   */
  userChange$ = this.fbAuth.authState.pipe(
    map((usr: firebase.User | null): DataRequestDataFound<User> | DataRequestNoDataFound => {
      if(usr === null) return {state: 'data-not-found'}
      
      const user = {uid: usr.uid, email: usr.email}
      if(!isInterface<User>({
        email: [isString],
        uid: [isString]
      })(user)) throw new Error(`Invalid data. Is not an User Interface: ${usr}`)

      return { state: 'data-found', value: user }
    })
  )

  /**
   * Public properties depending directly of '_currentUser$'
   */
  currentUser$ = this._currentUser$.asObservable()
  currentUser = toSignal(this.currentUser$, {requireSync: true})

  constructor() {
    /**
     * update 'currentUser$' when changes occur on the firebase backend.
     */
    this.userChange$.subscribe(usr => this._currentUser$.next(usr))
  }

  async login(email: string, password: string) {
    /**
     * RMK:
     * - signInWithEmailAndPassword() with resolve a Promise EVERY TIME it is called
     * - authState observable will fire ONLY if there is a CHANGE in the user
     * 
     * When calling signInWithEmailAndPassword() multiple times for the same user, the observables will fire only at most once: the first time (if the user really change)!
     * It is not necessary to let signInWithEmailAndPassword() be called multiple times for the same user... although it won't make any difference...
     * BUT: Be sure to reset the _currentUser$ observable in order to reflect the 'loading state' ['this._currentUser$.next(undefined)'] only when signInWithEmailAndPassword() is called for a different user!!  
     */
    if(this._currentUser$.value.state === 'data-found' && this._currentUser$.value.value.email === email) {
      return this._currentUser$.value.value
    }

    this._currentUser$.next({state: 'loading'})
    const credentials = await this.fbAuth.signInWithEmailAndPassword(email, password)
    if (credentials.user === null || credentials.user.email === null) throw new Error(`AUTH-ERROR/LOGIN(): user or email is null...`) 
    const user: User = { uid: credentials.user.uid, email: credentials.user.email}
    return user
  }

  async signup(email: string, password: string) {
    /**
     * see login() RMK: also applicable for 'createUserWithEmailAndPassword()'!
     */
    if(this._currentUser$.value.state === 'data-found' && this._currentUser$.value.value.email === email) {
      return this._currentUser$.value.value
    }

    this._currentUser$.next({state: 'loading'})
    const credentials = await this.fbAuth.createUserWithEmailAndPassword(email, password)
    if (credentials.user === null || credentials.user.email === null) throw new Error(`AUTH-ERROR/SIGNUP(): user or email is null...`) 
    const user: User = { uid: credentials.user.uid, email: credentials.user.email}
    return user
  }

  async logout() {
    /**
     * see login() RMK: also applicable for 'signOut()'!
     */
    if(this._currentUser$.value.state === 'data-not-found') {
      return
    }

    this._currentUser$.next({state: 'loading'})
    await this.fbAuth.signOut()
  }

}