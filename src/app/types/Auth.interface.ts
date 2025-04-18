import { Signal } from "@angular/core"
import { User } from "./User.interface";


export interface IAuth {
  currentUser: () => Signal<User | null | undefined>,
  login: (email: string, password: string) => Promise<User>,
  signup: (email: string, password: string) => Promise<User>,
  logout: () => Promise<void>,
}