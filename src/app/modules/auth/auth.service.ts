import { Injectable, Signal, WritableSignal, computed, inject, signal } from "@angular/core";
import { User } from "./User";
import { Observable, map, tap } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({providedIn: 'root'})
export class AuthService {

  private _angularFireAuth = inject(AngularFireAuth)

  private _user$ = this._initUser()

  userSig = toSignal(this._user$, {initialValue: null})

  async signup(email: string, password: string): Promise<void> {
    await this._angularFireAuth.createUserWithEmailAndPassword(email, password)
    return
  }

  async login(email: string, password: string): Promise<void> {
    await this._angularFireAuth.signInWithEmailAndPassword(email, password)
    return
  }

  async logout(): Promise<void> {
    return this._angularFireAuth.signOut()
  }



  private _initUser() {
    return this._angularFireAuth.authState.pipe(
      map(res => res === null ? null : new User(res.uid, res.email!))
    )
  }

}