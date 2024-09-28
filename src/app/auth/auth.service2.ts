import { Injectable, inject } from "@angular/core";
import { map } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { IUser } from "../_interfaces/IUser";

@Injectable({providedIn: 'root'})
export class AuthService {

  private afAuth = inject(AngularFireAuth)

  private _userObs$ = this.afAuth.authState.pipe(
    map(res => !!res ? { id: res.uid, email: res.email! } as IUser : null)
  )

  private async _signup(email: string, password: string): Promise<void> {
    await this.afAuth.createUserWithEmailAndPassword(email, password)
    return 
  }

  private async _login(email: string, password: string): Promise<void> {
    await this.afAuth.signInWithEmailAndPassword(email, password)
    return
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

  login(email: string, password: string): Promise<void> {
    return this._login(email, password)
  }

  logout(): Promise<void> {
    return this._logout()
  }

}