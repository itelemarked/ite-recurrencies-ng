import { inject, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { toSignal } from "@angular/core/rxjs-interop";

import { BehaviorSubject, catchError, map, of, tap } from "rxjs";
import { User } from "./User";
import { AuthServiceInterface, Data } from "./AuthServiceInterface";
import { tryCatch } from "@app/_utils/try-catch";



@Injectable({providedIn: 'root'})
export class AuthFirebaseService implements AuthServiceInterface {

  private fbAuth = inject(AngularFireAuth)

  private _userData$ = new BehaviorSubject<Data<User>>({status: 'loading'})
  userData$ = this._userData$.asObservable()
  userData = toSignal(this._userData$, {requireSync: true})


  constructor() {
    /**
     * Fires first on subscription after initial fetch,
     * and then when a DIFFERENT user has been chosen (when it really changed!)
     * Possible values are of type User or null (undefined is not applicable here)
     */
    this.fbAuth.authState.pipe(
      map(firebaseUser => {
        if(firebaseUser === null) {
          return { status: 'success', value: null } as Data<User>
        }
        /** Since the app logs in/creates a user only with signInWithEmailAndPassword() or createUserWithEmailAndPassword(), we can be sure that 'email' property is not null! */ 
        const email = firebaseUser.email! 
        const uid = firebaseUser.uid
        return { status: 'success', value: {uid, email} } as Data<User>
      }),
      catchError(err => {
        return of({ status: 'error', error: err.message } as Data<User>)
      })
    ).subscribe(this._userData$)
  }

  async login(email: string, password: string) {
   // Initiate login with status 'loading'
    this._userData$.next({status: 'loading'})

    const getRequestedUser = async (email: string, password: string) => {
      const fbUser = await this.fbAuth.signInWithEmailAndPassword(email, password)
      return { uid: fbUser.user!.uid, email: fbUser.user!.email } as User
    }

    const getCurrentFirebaseUser = async () => {
      const fbUser = await this.fbAuth.currentUser
      return fbUser === null ? null : { uid: fbUser.uid, email: fbUser.email! } as User
    }

    const [currentUserError, currentUser] = await tryCatch(getCurrentFirebaseUser())
    // get current user errors.
    if(currentUserError) {
      this._userData$.next({status: 'error', error: currentUserError.message})
      return
    }

    const [requestedUserError, requestedUser] = await tryCatch(getRequestedUser(email, password))
    // get requested user errors
    if(requestedUserError) {
      this._userData$.next({status: 'error', error: requestedUserError.message})
      return
    }

    // check if requestedUser is the same as the currentUser. In this case, emit new user (changes won't be triggered by fb.authState!)
    if(requestedUser.email === currentUser?.email) {
      const {uid, email} = requestedUser
      this._userData$.next({status: 'success', value: {uid, email}})
      return
    }
  }

  // TODO
  async signup(email: string, password: string) {
    return Promise.resolve()
  }

  // TODO
  async logout() {
    return Promise.resolve()
  }
}