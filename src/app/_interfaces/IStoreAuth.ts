import { Signal } from "@angular/core"
import { IUser } from "./IUser"
import { Observable } from "rxjs"

export interface IStoreAuth {
  user$: Signal<IUser | null>,
  signup(email: string, password: string): Promise<void>
  login(email: string, password: string): Promise<void>
  logout(): Promise<void>
}