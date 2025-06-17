import { computed, inject, Injectable, signal, Signal, WritableSignal } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { User } from "../types/User";
import { map } from "rxjs";



interface AuthServiceInterface {
  user: Signal<User | null | undefined>
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}



@Injectable({providedIn: 'root'})
export class AuthService {

  fireauth = inject(AngularFireAuth)

  private _user = signal<User | null | undefined>(undefined)
  public user = computed(() => this._user())

  // User states
  public isLoading = computed(() => this._user() === undefined)
  public isLoggedOut = computed(() => this._user() === null)
  public isLoggedIn = computed(() => this._user() !== null && this._user() !== undefined)

  constructor() {
    const user$$ = this.fireauth.authState.pipe(
      map(usr => {
        if (usr === null) return null
        const uid = usr.uid
        const email = usr.email!
        return { uid, email } as User
      })
    )

    user$$.subscribe(usr => this._user.set(usr))

    this.TEST()
  }

  async login(email: string, password: string) {
    this._user.set(undefined)
    return this.fireauth.signInWithEmailAndPassword(email, password)
      .then(returnedUser => {
        const user: User = { email, uid: returnedUser!.user!.uid }
        this._user.set(user)
      })
      .catch(err => {
        this._user.set(null)
      })
  }

  async logout() {
    this._user.set(undefined)
    return this.fireauth.signOut()
      .then(() => this._user.set(null))
      .catch((err) => {
        this._user.set(null)
        console.log(err)
      })
  }

  TEST() {

  }

}