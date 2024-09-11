import { Injectable, Signal, WritableSignal, computed, inject, signal } from "@angular/core";
import { User } from "./User";
import { Observable, map } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable({providedIn: 'root'})
export class AuthService {

  // user$: Observable<User | null> = this._initUser()

  private _user: WritableSignal<User | null> = signal(null)
  user = computed(() => this._user())

  constructor(private auth: AngularFireAuth) {
    this.auth.authState.subscribe(res => 
      res === null
      ? this._user.set(null)
      : this._user.set(new User(res.uid, res.email!))
    )
  }

  // private _initUser(): Observable<User | null> {
  //   return this.auth.authState.pipe(
  //     map(res => res === null ? null : new User(res.uid, res.email!))
  //   )
  // }

  async signup(email: string, password: string): Promise<void> {
    await this.auth.createUserWithEmailAndPassword(email, password)
    return
  }

  async login(email: string, password: string): Promise<void> {
    await this.auth.signInWithEmailAndPassword(email, password)
    return
  }

  logout(): Promise<void> {
    return this.auth.signOut()
  }

}