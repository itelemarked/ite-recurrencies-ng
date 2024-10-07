import { Signal } from "@angular/core"
import { IUser } from "./IUser"
import { Observable } from "rxjs"

export interface IStoreAuth2 {
  user$: Observable<IUser | null>,
  signup(email: string, password: string): Promise<IUser>
  login(email: string, password: string): Promise<IUser>
  logout(): Promise<void>
}