import { Injectable, Signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { User } from "./_types/User"
import { AuthServiceInterface } from "./_types/AuthServiceInterface"
import { toSignal } from "@angular/core/rxjs-interop";


const REGISTERED_USER: User = {
  uid: '0yuA0RLZFJdbRKtVSfW4y5HSQMq1',
  email: 'aaa@aaa.com'
}


@Injectable({providedIn: 'root'})
export class AuthServiceMock implements AuthServiceInterface {

  private _user$: BehaviorSubject<User | null | undefined>
  user$: Observable<User | null | undefined>
  user: Signal<User | null | undefined>


  constructor() {
    this._user$ = new BehaviorSubject<User | null | undefined>(REGISTERED_USER)
    this.user$ = this._user$.asObservable()
    this.user = toSignal(this._user$, {requireSync: true})
  }

  
  async signup(email: string, password: string): Promise<User> {
    throw new Error(`signup() not implemented yet...`)
  }

  async login(email: string, password: string): Promise<User> {
    throw new Error(`login() not implemented yet...`)
  }

  async logout(): Promise<void> {
    throw new Error(`logout() not implemented yet...`)
  }
}