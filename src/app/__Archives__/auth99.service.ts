import { computed, Injectable, signal } from "@angular/core"
import { User } from "../types/User"


/**
 * This is a MOCK Service...
 */


type MockUserData = {
  email: string,
  password: string,
  uid: string
}

const MOCK_AVAILABLE_USERS = [
  { email: 'aaa@aaa.com', password: '111111', uid: '0.5420253818351493' } ,
  { email: 'bbb@bbb.com', password: '222222', uid: '0.07791436815403863' }
]

// let MOCK_CURRENT_USER: MockUserData | null = { email: 'aaa@aaa.com', password: '111111', uid: '0.5420253818351493' }
let MOCK_CURRENT_USER: MockUserData | null = null




@Injectable({providedIn: 'root'})
export class AuthService {

  private _user = signal<User | null | undefined>(undefined)
  public user = computed(() => this._user())

  // User states
  public isLoading = computed(() => this._user() === undefined)
  public isLoggedOut = computed(() => this._user() === null)
  public isLoggedIn = computed(() => this._user() !== null && this._user() !== undefined)

  // VARS
  private DELAY = 1000

  constructor() {
    setTimeout(() => {
      const user: User | null | undefined = MOCK_CURRENT_USER ? {email: MOCK_CURRENT_USER?.email, uid: MOCK_CURRENT_USER?.uid} : null
      this._user.set(user)
    }, this.DELAY);
  }

  async login(email: string, password: string): Promise<User> {
    const foundUser = MOCK_AVAILABLE_USERS.find(data => data.email === email)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (foundUser === undefined) {
            reject('User-not-found')
        } else {
          if (foundUser.password !== password) {
            reject('Wrong-password')
          } else {
            const uid = foundUser.uid
            MOCK_CURRENT_USER = { email, password, uid }
            this._user.set({email, uid})
            resolve({email, uid})
          }
        }
      }, this.DELAY);
    })
  }
  
  async signup(email: string, password: string): Promise<User> {
    const foundUser = MOCK_AVAILABLE_USERS.find(data => data.email === email)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (foundUser !== undefined) {
            reject('User-already-exists')
        } else {
          const uid = Math.random().toString()
          MOCK_AVAILABLE_USERS.push({email, password, uid})
          MOCK_CURRENT_USER = {email, password, uid}
          this._user.set({email, uid})
          resolve({email, uid})
        }
      }, this.DELAY);
    })
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_CURRENT_USER = null
        this._user.set(null)
        resolve()
      }, this.DELAY);
    })
  }

}