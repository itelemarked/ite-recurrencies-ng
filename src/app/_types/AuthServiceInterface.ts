import { Signal } from "@angular/core"
import { Observable } from "rxjs"
import { User } from "./User"
import { AuthError } from "./AuthError"

export interface AuthServiceInterface {
  readonly user$: Observable<User | null | undefined>
  readonly user: Signal<User | null | undefined>
  readonly isLoading$: Observable<boolean>
  readonly isLoading: Signal<boolean>
  readonly error$: Observable<AuthError | null>
  readonly error: Signal<AuthError | null>

  login: (email: string, password: string) => void
  signup: (email: string, password: string) => void
  logout: () => void
}