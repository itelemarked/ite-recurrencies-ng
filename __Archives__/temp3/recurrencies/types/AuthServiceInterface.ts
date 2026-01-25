import { Observable } from "rxjs";
import { AuthState } from "./AuthState";
import { Signal } from "@angular/core";

export interface AuthServiceInterface {
  state$: Observable<AuthState>
  state: Signal<AuthState>
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}