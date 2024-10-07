import { Injectable, inject } from "@angular/core";
import { map } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { IUser } from "../_interfaces/IUser";
import { IStoreAuth2 } from "../_interfaces/IStoreAuth2";

@Injectable({providedIn: 'root'})
export class AuthService2 implements IStoreAuth2 {

  private afAuth = inject(AngularFireAuth)

  private _userObs$ = this.afAuth.authState.pipe(
    map(res => !!res ? { id: res.uid, email: res.email! } as IUser : null)
  )

  private async _signup(email: string, password: string): Promise<IUser> {
    try {
      const afUser = await this.afAuth.createUserWithEmailAndPassword(email, password)
      const user: IUser = {id: afUser.user!.uid as string, email}
      return user
    }
    catch(err: any) {
      throw new Error(err)
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


  // PUBLIC

  get user$() {
    return this._userObs$
  }

  signup(email: string, password: string) {
    return this._signup(email, password)
  }

  login(email: string, password: string) {
    return this._login(email, password)
  }

  logout(): Promise<void> {
    return this._logout()
  }

}