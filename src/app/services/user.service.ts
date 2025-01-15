import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { User } from "../types/User";

// TEMP
const USER_A = {
  uid: '0yuA0RLZFJdbRKtVSfW4y5HSQMq1',
  email: 'aaa@aaa.com'
}

@Injectable({providedIn: 'root'})
export class UserService {
  
  // PROPERTIES
  private _user$$ = new BehaviorSubject<User|null>(null)
  public user$$ = this._user$$.asObservable()
  public currentUser = () => this._user$$.value

  constructor() {
    // TEMP
    this.simulateUserLogin()
  }

  // TODO
  signup(email: string, password: string): Promise<User> {
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

}