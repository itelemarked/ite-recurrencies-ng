import { Injectable, Signal } from "@angular/core";
import { User } from "../types/User.type";
import { BehaviorSubject, Observable } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";


interface AuthServiceInterface {
  user$: Observable<User | null | undefined>
  user: Signal<User | null | undefined>
  login(email: string, password: string): Promise<User>
  signup(email: string, password: string): Promise<User>
  logout(): Promise<void>
}


// TEMPORARY UTILITY FUNCTIONS
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}


@Injectable({providedIn: 'root'})
export class AuthService implements AuthServiceInterface {

  private _user$ = new BehaviorSubject<User | null | undefined>(undefined)
  user$ = this._user$.asObservable()

  user = toSignal(this.user$)

  constructor() {
    this.login('aa', 'bb')
    // this.logout()
  }

  async login(email: string, password: string) {
    await delay(400)
    const user: User = {uid: 'xyz', email: 'xxx@xxx.com'}
    this._user$.next(user)
    return user
  }

  async signup(email: string, password: string) {
    await delay(400)
    const user: User = {uid: 'xyz', email: 'xxx@xxx.com'}
    this._user$.next(user)
    return user
  }

  async logout() {
    await delay(400)
    this._user$.next(null)
  }

}