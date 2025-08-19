import { Observable } from "rxjs";
import { User } from "./User";
import { Signal } from "@angular/core";

export interface AuthServiceInterface {
  user$: Observable<User | null | undefined>
  user: Signal<User | null | undefined>
  signup: (email: string, password: string) => Promise<User>
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}