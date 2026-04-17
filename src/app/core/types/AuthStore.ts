import { Signal } from "@angular/core";
import { User } from "../../recurrencies/types/User";
import { Observable } from "rxjs";

export interface AuthStore {

  user$: Observable<User | null | undefined>
  user: Signal<User | null | undefined>
  isLoading$: Observable<boolean>
  isLoading: Signal<boolean>
  error$: Observable<string | null>
  error: Signal<string | null>

  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>

}