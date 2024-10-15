import { Injectable, inject } from "@angular/core";
import { map, Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { IUser } from "../_interfaces/IUser";
import { IStoreAuth2 } from "../_interfaces/IStoreAuth2";
import { CustomError } from "../_custom-error/CustomError";

@Injectable({providedIn: 'root'})
export class AuthService implements IStoreAuth2 {

  private afAuth = inject(AngularFireAuth)

  user$: Observable<IUser | null> = this.afAuth.authState.pipe(
    map(res => {
      if (res === null) {
        return null
      }

      if (res.email === null) {
        throw new CustomError('[AUTH]_USER_HAS_NO_EMAIL')
      }

      const user: IUser = { id: res.uid, email: res.email }
      return user
    })
  )
  
  async signup(email: string, password: string): Promise<IUser> {
    console.log('signup called')
    try {
      const afUser = await this.afAuth.createUserWithEmailAndPassword(email, password)
      const user: IUser = {id: afUser.user!.uid as string, email}
      return user
    }
    catch(err: any) {
      throw new CustomError('[AUTH]_SIGNUP_ERROR', err)
    }
  }

  private async _login(email: string, password: string): Promise<IUser> {
    try {
      const afUser = await this.afAuth.signInWithEmailAndPassword(email, password)
      const user: IUser = {id: afUser.user!.uid as string, email}
      return user
    }
    catch(err: any) {
      throw new Error(err)
    }
  }

  private async _logout(): Promise<void> {
    return this.afAuth.signOut()
  }


  login(email: string, password: string) {
    return this._login(email, password)
  }

  logout(): Promise<void> {
    return this._logout()
  }

}