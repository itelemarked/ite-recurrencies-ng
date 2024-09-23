import { Injectable, Signal, WritableSignal, computed, inject, signal } from "@angular/core";
import { Observable, map, tap } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { toSignal } from "@angular/core/rxjs-interop";
import { IStoreAuth } from "../_interfaces/IStoreAuth";
import { IUser } from "../_interfaces/IUser";

@Injectable({providedIn: 'root'})
export class AuthService implements IStoreAuth {

  private _angularFireAuth = inject(AngularFireAuth)

  private _userObs$ = this._angularFireAuth.authState.pipe(
    map(res => !!res ? { id: res.uid, email: res.email! } as IUser : null)
  )

  private _userSig$ = toSignal(this._userObs$, {initialValue: null})

  private async _signup(email: string, password: string): Promise<void> {
    await this._angularFireAuth.createUserWithEmailAndPassword(email, password)
    return
  }

  private async _login(email: string, password: string): Promise<void> {
    await this._angularFireAuth.signInWithEmailAndPassword(email, password)
    return
  }

  private async _logout(): Promise<void> {
    return this._angularFireAuth.signOut()
  }


  // PUBLIC

  get user$() {
    return this._userSig$
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