import { inject, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { User } from "./temp/types/User";
import { AUTH_ERRORS, AuthError } from "../utils/errors/auth-error";
import { BehaviorSubject, delay, ReplaySubject, Subject, take, takeUntil } from "rxjs";



@Injectable({providedIn: 'root'})
export class AuthService {

  // DEPENDENCIES
  private fireauth = inject(AngularFireAuth)

  private _currentUser: User | null = null
  public currentUser = (): User | null => this._currentUser
  private _user$$ = new BehaviorSubject<User | null>(null)
  public user$$ = this._user$$.asObservable()

  private _isLoading$ = new ReplaySubject<boolean>(1)
  public isLoading$ = this._isLoading$.asObservable()

  // INIT
  constructor() {
    // authState doesn't fire on subscription (at first when first fetch on firebase is done)
    this._isLoading$.next(true)
    this.fireauth.authState.subscribe(usr => {
      if (usr === null) {
        this._currentUser = null
        this._user$$.next(null)
      } else {
        if(usr.email === null) throw new Error(`User must have an email...`)
        const uid = usr.uid
        const email = usr.email
        this._currentUser = { uid, email }
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
      if(credentials.user === null) throw new Error(`no-firebase-user-found...`)
      return {
        uid: credentials.user.uid,
        email
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

