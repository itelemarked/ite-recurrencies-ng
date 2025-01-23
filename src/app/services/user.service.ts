import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

import { User } from "../types/User";
import { AngularFireAuth } from "@angular/fire/compat/auth";

// TEMP
const USER_A = {
  uid: '0yuA0RLZFJdbRKtVSfW4y5HSQMq1',
  email: 'aaa@aaa.com'
}

@Injectable({providedIn: 'root'})
export class UserService {

  // DEPENDENCIES
  private fireauth = inject(AngularFireAuth)
  
  // PROPERTIES
  private _user$$ = new Subject<User|null>()
  public user$$ = this._user$$.asObservable()
  public currentUser: User | null = null

  private _isLoading$ = new BehaviorSubject(true)
  public isLoading$ = this._isLoading$.asObservable()

  // INIT
  constructor() {
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
      this._isLoading$.next(false)
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
      if('code' in err) throw new Error(err.message)
      throw err
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
      if('code' in err) throw new Error(err.message)
      throw err
    }
  }

  async logout(): Promise<void> {
    try {
      return this.fireauth.signOut()
    }
    catch(err: any) {
      if('code' in err) throw new Error(err.message)
      throw err
    }
  }

  TEST() {

    // const p1 = (): Promise<string> => {
    //   return new Promise<string>((resolve, reject) => {
    //     const nb = Math.random()
    //     if(nb < 0.5) {
    //       resolve(`p1 success: ${nb}`)
    //     } else {
    //       reject(`p1 rejected: ${nb}`)
    //     }
    //   })
    // }

    // const p2 = async (): Promise<string> => {
    //   try {
    //     const result = await p1()
    //     return `p2: ${result}`
    //   }
    //   catch (err) {
    //     return `p2: ${err}`
    //   }
    // }

    // p2().then(res => console.log(res)).catch(err => console.log(err))

  }

}