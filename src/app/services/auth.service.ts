import { computed, inject, Injectable, signal } from "@angular/core";
import { IAuth } from "../types/Auth.interface";
import { User } from "../types/User.interface";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { map } from "rxjs";


@Injectable({providedIn: 'root'})
export class AuthService implements IAuth {

  private fireauth = inject(AngularFireAuth)

  private _currentUser = signal<User| null | undefined>(undefined)

  constructor() {
    const user$$ = this.fireauth.authState.pipe(
      map(usr => {
        if (usr === null) return null
        const uid = usr.uid
        const email = usr.email!
        return { uid, email } as User
      })
    )

    // use toSignal() instead???
    user$$.subscribe(usr => this._currentUser.set(usr))
  }

  currentUser() {
    return computed(() => this._currentUser())
  }

  async login(email: string, password: string) {
    const returnedUser = await this.fireauth.signInWithEmailAndPassword(email, password)
    const user = { email, uid: returnedUser!.user!.uid }
    this._currentUser.set(user)
    return user
  }

  async signup(email: string, password: string) {
    const returnedUser = await this.fireauth.createUserWithEmailAndPassword(email, password)
    const user = { email, uid: returnedUser!.user!.uid }
    this._currentUser.set(user)
    return user
  }

  async logout() {
    await this.fireauth.signOut()
    this._currentUser.set(null)
  }

}

