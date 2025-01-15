import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

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
  private _user$$ = new BehaviorSubject<User|null>(null)
  public user$$ = this._user$$.asObservable()
  public currentUser = () => this._user$$.value

  constructor() {
    // TEMP
    this.simulateUserLogin()
  }

  // TODO
  async signup(email: string, password: string): Promise<User> {
    // const credentials = await this.fireauth.createUserWithEmailAndPassword(email, password)
    // if(credentials.user?.uid === undefined || credentials.user?.email === undefined) return Promise.reject('Something went wrong')
    // const user = { uid: credentials.user?.uid, email: credentials.user?.email}

    return Promise.resolve(USER_A)
  }

  // TODO
  login(email: string, password: string): Promise<User> {
    return Promise.resolve(USER_A)
  }

  // TODO
  logout(): Promise<void> {
    return Promise.resolve()
  }

  // TEMP
  simulateUserLogin() {
    setTimeout(() => {
      this._user$$.next(USER_A)
    }, 500);
  }

  TEST() {

    const p1 = (): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        const nb = Math.random()
        if(nb < 0.5) {
          resolve(`p1 success: ${nb}`)
        } else {
          reject(`p1 rejected: ${nb}`)
        }
      })
    }

    const p2 = async (): Promise<string> => {
      try {
        const result = await p1()
        return `p2: ${result}`
      }
      catch (err) {
        return `p2: ${err}`
      }
    }

    p2().then(res => console.log(res)).catch(err => console.log(err))

  }

}