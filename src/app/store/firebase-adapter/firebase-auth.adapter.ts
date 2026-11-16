import { inject, Injectable, Signal, signal } from "@angular/core";
import { AuthAdapterInterface, AuthError, AuthUser } from "../auth.type";
import { Observable } from "rxjs";

import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { toSignal } from "@angular/core/rxjs-interop";
import { mapToAuthErrorCode } from "./firebase-auth.error";
import { FIREBASE_AUTH } from "./firebase-config";



export function watchAuthState(auth: Auth): Observable<AuthUser | null> {
  return new Observable<AuthUser | null>((subscriber) =>
    // according docs, error and complete are never triggered
    onAuthStateChanged(
      auth,
      (user) => {
        if(!!user) {
          subscriber.next({
            uid: user.uid,
            email: user.email!
          })
        } else {
          subscriber.next(null)
        }
      },
    ),
  );
}


@Injectable({providedIn: 'root'}) 
export class FirebaseAuthAdapter implements AuthAdapterInterface {

  auth = inject(FIREBASE_AUTH)

  user = toSignal(watchAuthState(this.auth), {initialValue: null})
  error = signal<AuthError | null>(null)
  isLoading = signal<boolean>(true)

  login = (email: string, password: string): void => {
    signInWithEmailAndPassword(this.auth, email, password)
      .catch((err) => {
        const authError = mapToAuthErrorCode(err)
        this.error.set(authError)
    })
  }

  signup = (email: string, password: string): void => {
    createUserWithEmailAndPassword(this.auth, email, password)
      .catch((err) => {
        const authError = mapToAuthErrorCode(err)
        this.error.set(authError)
    })
  }

  logout = (): void => {
    signOut(this.auth)
      .catch((err) => {
        const authError = mapToAuthErrorCode(err)
        this.error.set(authError)
    })
  }

}