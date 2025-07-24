import { computed, Injectable, signal } from "@angular/core"
import { User } from "../__Archives__/temp/types/User"
import { AUTH } from "./_MOCK_DATAS"


/**
 * This is a MOCK Service...
 */

@Injectable({providedIn: 'root'})
export class AuthService {

  // DEPENDENCIES
  MOCK_AUTH: any = AUTH

  private _user = signal<User | null | undefined>(undefined)
  public user = computed(() => this._user())

  // User states
  public isLoading = computed(() => this._user() === undefined)
  public isLoggedOut = computed(() => this._user() === null)
  public isLoggedIn = computed(() => this._user() !== null && this._user() !== undefined)

  // VARS
  private DELAY = 300

  constructor() {
    setTimeout(() => {
      const user: User | null = this.MOCK_AUTH.currentUser
      this._user.set(user)
    }, this.DELAY);
  }

  async login(email: string, password: string): Promise<User> {
    const foundData: any = Object.entries(this.MOCK_AUTH.users).find(([uid, emailPassword]: [any, any]) => {
      return emailPassword.email === email && emailPassword.password === password
    })

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (foundData === undefined) {
          reject(`Invalid email or password`)
        } else {
          const activeUser = {email: foundData[1].email, uid: foundData[0]}
          this.MOCK_AUTH.currentUser = activeUser
          this._user.set(activeUser)
          resolve(activeUser)
        }
      }, this.DELAY);
    })
  }
  
  async signup(email: string, password: string): Promise<User> {
    const emailAlreadyUsed: any = Object.entries(this.MOCK_AUTH.users).find(([uid, emailPassword]: [any, any]) => {
      return emailPassword.email === email
    })

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (emailAlreadyUsed !== undefined) {
          reject('Email already used')
        } else {
          const uid = Math.random().toString()
          this.MOCK_AUTH.currentUser = {email, uid}
          this._user.set({email, uid})
          resolve({email, uid})
        }
      }, this.DELAY);
    })
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.MOCK_AUTH.currentUser = null
        this._user.set(null)
        resolve()
      }, this.DELAY);
    })
  }

  private simulatedFetch(DELAY = 0): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fetchedUser: User | null = this.MOCK_AUTH.currentUser
        resolve(fetchedUser)
      }, DELAY);
    })
  }

}