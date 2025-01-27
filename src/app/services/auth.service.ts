import { inject, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { BehaviorSubject, delay, ReplaySubject, Subject, take, takeUntil } from "rxjs";

import { User } from "../types/User";
import { AUTH_ERRORS, AuthError } from "../utils/errors/auth-error";


@Injectable({providedIn: 'root'})
export class AuthService {

  // DEPENDENCIES
  private fireauth = inject(AngularFireAuth)

  private _user$$ = new BehaviorSubject<User | null>(null)
  public user$$ = this._user$$.asObservable()
  public currentUser: User | null = this._user$$.value

  private _isLoading$ = new ReplaySubject<boolean>(1)
  public isLoading$ = this._isLoading$.asObservable()

  // INIT
  constructor() {
    // Before first fetch
    this._isLoading$.next(true)
    // authState 'Subject like': it fires only after the first fetch 
    this.fireauth.authState.subscribe(usr => {
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
      // After first fetch
      this._isLoading$.next(false)
    })
  }

  // METHODS
  async signup(email: string, password: string): Promise<User> {
    this._isLoading$.next(true)
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
    finally {
      this._isLoading$.next(false)
    }
  }

  async login(email: string, password: string): Promise<User> {
    this._isLoading$.next(true)
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
    finally {
      this._isLoading$.next(false)
    }
  }

  async logout(): Promise<void> {
    this._isLoading$.next(true)
    try {
      return this.fireauth.signOut()
    }
    catch(err: any) {
      if(err.code === 'auth/network-request-failed') throw new AuthError(AUTH_ERRORS.NETWORK_REQUEST_FAILED)
      throw new AuthError({ code: 'auth/unknown-error', message: err.message })
    }
    finally {
      this._isLoading$.next(false)
    }
  }

  TEST() {}

}

