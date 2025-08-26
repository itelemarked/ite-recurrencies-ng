import { inject, Injectable, Signal } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { toSignal } from "@angular/core/rxjs-interop";

import { BehaviorSubject, catchError, map, Observable, of } from "rxjs";
import { isUser, User } from "./_types/User";
import { CustomTypeError } from "@app/_utils/errors/CustomTypeError";
import { FirebaseError } from "@angular/fire/app";
import { AuthError } from "./AuthError";
import { tryCatch } from "@app/_utils/try-catch";




interface AuthServiceInterface {
  user$: Observable<User | null | undefined>
  user: Signal<User | null | undefined>
  login(email: string, password: string): Promise<User>
  signup(email: string, password: string): Promise<User>
  logout(): Promise<void>
}



@Injectable({providedIn: 'root'})
export class AuthServiceFirebase implements AuthServiceInterface {

  private fbAuth = inject(AngularFireAuth)

  private _user$ = new BehaviorSubject<User | null | undefined>(undefined)
  user$ = this._user$.asObservable()
  user = toSignal(this._user$, {requireSync: true})

  private _errors$ = new BehaviorSubject<AuthError[]>([])
  errors$ = this._errors$.asObservable()
  errors = toSignal(this._errors$, {requireSync: true})

  constructor() {
    /**
     * reflects 'fbUser$' changes to '_user$'
     */
      /**
     * Fires first on subscription after initial fetch,
     * and then when a DIFFERENT user has been chosen (when it really changed!)
     * Possible values are of type User or null (undefined is not applicable here)
     */
    this.fbAuth.authState.pipe(
      map(firebaseUser => {
        if(firebaseUser === null || firebaseUser === undefined) return firebaseUser
        if(firebaseUser.email === null) throw new AuthError('user-without-email', 'The user fetched has no email, and therefore is not of required type User: {uid: string, email: string}')
        return {uid: firebaseUser.uid, email: firebaseUser.email}
      }),
      catchError(err => {
        this._errors$.next(err)
        return of(null)
      })
    ).subscribe(this._user$)
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
    this._errors$.next([])

    if(this._user$?.value?.email === email) {
      return this._user$?.value
    }

    this._user$.next(undefined)

    // const data = await this.fbAuth.signInWithEmailAndPassword(email, password)
    // const user = {uid: data?.user?.uid, email: data?.user?.email}
    // if(!isUser(user)) throw new CustomTypeError(`Data received after login() is not of type User...`)
    // return user

    const [error, data] = await tryCatch(this.fbAuth.signInWithEmailAndPassword(email, password))
    if(error) throw new AuthError((error as any).code, error.message)
    if(data.user === null) throw new AuthError('user-is-null-after-login', 'User shouldn\'t return null after logging in...')
    if(data.user.email === null) throw new AuthError('user-email-is-null-after-login', 'User email shouldn\'t return null after logging in...')
    return { uid: data.user.uid, email: data.user.email }
  }

  async signup(email: string, password: string) {
    /**
     * see login() RMK: also applicable for 'createUserWithEmailAndPassword()'!
     */
    this._errors$.next([])

    if(this._user$?.value?.email === email) {
      return this._user$?.value
    }

    this._user$.next(undefined)

    const returnedData: any = await this.fbAuth.createUserWithEmailAndPassword(email, password)
    const user = {uid: returnedData.user.uid, email: returnedData.user.email}
    if(!isUser(user)) throw new CustomTypeError(`Data received after login() is not of type User...`)
    return user
  }

  async logout() {
    /**
     * see login() RMK: also applicable for 'signOut()'!
     */
    this._errors$.next([])

    if(this._user$?.value === null) {
      return
    }

    this._user$.next(undefined)
    await this.fbAuth.signOut()
  }

}