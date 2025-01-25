import { inject, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { BehaviorSubject, delay, ReplaySubject, Subject, take, takeUntil } from "rxjs";

import { User } from "../types/User";
import { AUTH_ERRORS, AuthError } from "../utils/errors/auth-error";


export const AuthErrors = {
  'NETWORK-REQUEST-FAILED': {
    code: 'auth/network-request-failed',
    message: ''
  }
}


@Injectable({providedIn: 'root'})
export class AuthService {

  // DEPENDENCIES
  private fireauth = inject(AngularFireAuth)
  
  // PROPERTIES
  // private _user$$ = new Subject<User|null>()
  // public user$$ = this._user$$.asObservable()
  // public currentUser: User | null = null

  

  private _user$$ = new BehaviorSubject<User | null>(null)
  public user$$ = this._user$$.asObservable()
  public currentUser: User | null = this._user$$.value

  // private _isLoading$ = new BehaviorSubject(true)
  // public isLoading$ = this._isLoading$.asObservable()

  private _isLoading$ = new ReplaySubject<boolean>(1)
  public isLoading$ = this._isLoading$.asObservable()

  // INIT
  constructor() {
    this._isLoading$.next(true)
    /** authState 'Subject like' */
    this.fireauth.authState.pipe(delay(1000)).subscribe(usr => {
      if (usr === null) {
        this.currentUser = null
        this._user$$.next(null)
      } else {
        if(usr.email === null) throw new Error(`User must have an email...`)
        const uid = usr.uid
        const email = usr.email
        this.currentUser = { uid, email }
        this._user$$.next({ uid, email })
      }
      // this._isLoading$.next(false)
      // this._isLoading$.complete()
      this._isLoading$.next(false)
      this._isLoading$.complete()
    })
  }

  // METHODS
  async signup(email: string, password: string): Promise<User> {
    try {
      const credentials = await this.fireauth.createUserWithEmailAndPassword(email, password)
      if(credentials.user === null) throw new Error(`No firebase user found...`)
      if(credentials.user.email === null) throw new Error(`A user must have an email`)
      return {
        uid: credentials.user.uid,
        email: credentials.user.email
      }  
    }
    catch(err: any) {
      if(err.code === 'auth/network-request-failed') throw new AuthError(AUTH_ERRORS.NETWORK_REQUEST_FAILED)
      if(err.code === 'auth/email-already-in-use') throw new AuthError(AUTH_ERRORS.EMAIL_ALREADY_IN_USE)
      if(err.code === 'auth/weak-password') throw new AuthError(AUTH_ERRORS.WEAK_PASSWORD)
      throw new AuthError({ code: 'auth/unknown-error', message: err.message })
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const credentials = await this.fireauth.signInWithEmailAndPassword(email, password)
      if(credentials.user === null) throw new Error(`No firebase user found...`)
      if(credentials.user.email === null) throw new Error(`A user must have an email`)
      return {
        uid: credentials.user.uid,
        email: credentials.user.email
      }  
    }
    catch(err: any) {
      if(err.code === 'auth/network-request-failed') throw new AuthError(AUTH_ERRORS.NETWORK_REQUEST_FAILED)
      if(err.code === 'auth/user-not-found') throw new AuthError(AUTH_ERRORS.USER_NOT_FOUND)
      if(err.code === 'auth/wrong-password') throw new AuthError(AUTH_ERRORS.WRONG_PASSWORD)
      throw new AuthError({ code: 'auth/unknown-error', message: err.message })
    }
  }

  async logout(): Promise<void> {
    try {
      return this.fireauth.signOut()
    }
    catch(err: any) {
      if(err.code === 'auth/network-request-failed') throw new AuthError(AUTH_ERRORS.NETWORK_REQUEST_FAILED)
      throw new AuthError({ code: 'auth/unknown-error', message: err.message })
    }
  }

  TEST() {
    // const mySubject = new ReplaySubject<number>(1);
    
    // mySubject.next(11);
    // const subscription1 = mySubject.pipe(take(1)).subscribe(x => {
    //   console.log('From subscription 1:', x);
    // });
    

    // mySubject.next(2);

    // const subscription2 = mySubject.subscribe(x => {
    //   console.log('From subscription 2:', x);
    // });

    // mySubject.next(3);

    // subscription1.unsubscribe();

    // mySubject.next(4);
  }

}

