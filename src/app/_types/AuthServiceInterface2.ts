import { Signal } from "@angular/core"
import { Observable } from "rxjs"
import { User } from "./User"


export interface AuthServiceInterface2 {
  /** 'undefined' when loading for the first time, 'null' when unauthenticated, 'User' when authenticated */
  user$: Observable<User | null | undefined>
  /** 'undefined' when loading for the first time, 'null' when unauthenticated, 'User' when authenticated */
  user: Signal<User | null | undefined>

  /** may throw Error (unlikely) | FirebaseAuthError | AuthError */
  login: (email: string, password: string) => Promise<void>
  /** may throw Error (unlikely) | FirebaseAuthError | AuthError */
  signup: (email: string, password: string) => Promise<void>
  /** may throw Error (unlikely) | FirebaseAuthError | AuthError */
  logout: () => Promise<void>
}