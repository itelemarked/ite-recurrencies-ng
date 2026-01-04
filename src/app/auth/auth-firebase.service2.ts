import { inject, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { toSignal } from "@angular/core/rxjs-interop";

import { BehaviorSubject, catchError, map, of, tap } from "rxjs";
import { User } from "../_types/User";
import { AuthServiceInterface } from "./AuthServiceInterface";



@Injectable({providedIn: 'root'})
export class AuthFirebaseService implements AuthServiceInterface {

  private fbAuth = inject(AngularFireAuth)

  private _user$ = new BehaviorSubject<User | null | undefined>(undefined)
  user$ = this._user$.asObservable()
  user = toSignal(this._user$, {requireSync: true})


  constructor() {
    /**
     * Fires first on subscription after initial fetch,
     * and then when a DIFFERENT user has been chosen (when it really changed!)
     * Possible values are of type User or null (undefined is not applicable here)
     */
    this.fbAuth.authState.pipe(
      tap(_ => this.resetErrors()),
      map(firebaseUser => {
        if(firebaseUser === null) {
          return null
        }
        /** Since the app logs in/creates a user only with signInWithEmailAndPassword() or createUserWithEmailAndPassword(), we can be sure that 'email' property is not null! */ 
        const email = firebaseUser.email! 
        const uid = firebaseUser.uid
        return {uid, email}
      }),
      catchError(err => {
        this.addError(err.code)
        return of(null)
      })
    ).subscribe(this._user$)
  }

  /**
   * RMK:
   * - signInWithEmailAndPassword() with resolve a Promise EVERY TIME it is called
   * - authState observable will fire ONLY if there is a CHANGE in the user
   * 
   * When calling signInWithEmailAndPassword() multiple times for the same user, the observables will fire only at most once: the first time (if the user really change)!
   * It is not necessary to let signInWithEmailAndPassword() be called multiple times for the same user... although it won't make any difference...
   * BUT: Be sure to reset the _user$ observable in order to reflect the 'loading state' ['this._user$.next(undefined)'] only when signInWithEmailAndPassword() is called for a different user!!  
   */
  async login(email: string, password: string) {
    const oldUser = this._user$.value

    if(oldUser?.email === email) {
      return oldUser
    }

    this._user$.next(undefined)
    this.resetErrors()

    const [error, data] = await tryCatch(this.fbAuth.signInWithEmailAndPassword(email, password))
    if(error) {
      console.log('should fail here!')
      this.addError((error as unknown as FirebaseAuthError))
      return oldUser
    }
    /** When logging in in with 'signInWithEmailAndPassword()' without error, we can be sure that a user is not null! */
    const uid = data.user!.uid
    return { uid, email }

    // return this.fbAuth.signInWithEmailAndPassword(email, password)
    // .then(data => {
    //   console.log('login success!')
    //   const uid = data.user!.uid
    //   return { uid, email }
    // })
    // .catch(error => {
    //   console.log('login failed!')
    //   this.addError((error as unknown as FirebaseAuthError))
    //   // console.log(oldUser)
    //   return oldUser     
    // })

  }

  // TODO!!!
  async signup(email: string, password: string) {
    /**
     * see login() RMK: also applicable for 'createUserWithEmailAndPassword()'!
     */
    if(this._user$?.value?.email === email) {
      return this._user$?.value
    }

    this._user$.next(undefined)

    const returnedData: any = await this.fbAuth.createUserWithEmailAndPassword(email, password)
    const user = {uid: returnedData.user.uid, email: returnedData.user.email}
    if(!isUser(user)) throw new CustomTypeError(`Data received after login() is not of type User...`)
    return user
  }

  // TODO!!!
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

  // private addErrorCodeAndGetAll(code: AuthErrorCode): AuthErrorCode[] {
  //   const oldCodes = this._errorCodes$.value
  //   if (oldCodes.includes(code)) return oldCodes
  //   return [...oldCodes, code]
  // }

  private addError(error: AuthError) {
    const oldErrors = this._errors$.value
    const found = oldErrors.find(err => err.code === error.code && err.message === error.message)
    if (!found) {
      this._errors$.next([...oldErrors, error])
    }
  }

  private resetErrors() {
    this._errors$.next([])
  }

}